"""Build an explainer reel project.

Usage: make_reel.py <project-dir> [--tts-only]

<project-dir> holds:
  lines.py   LINES = [(id, spoken text, LaTeX formula or "")], plus optional settings (see SETTINGS below)
  scenes.js  defines `function scene(ctx)` (see SKILL.md)
  sfx.py     optional: def extra(add, X, C) to place scene-specific sound effects
Writes <project-dir>/vo/ (voice cache) and <project-dir>/build/ (the HyperFrames project to check and render).
Needs OPENAI_API_KEY in the environment only when a voice line is missing from vo/.
"""
import importlib.util
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(SKILL, "scripts"))
import sfxlib as X  # noqa: E402

PROJ = os.path.abspath(sys.argv[1])
CACHE = os.path.expanduser("~/.cache/explainer-reel")
SR = X.SR

spec = importlib.util.spec_from_file_location("lines", os.path.join(PROJ, "lines.py"))
L = importlib.util.module_from_spec(spec)
spec.loader.exec_module(L)
SETTINGS = dict(
    INSTR="Narrator of a calm, clear math explainer in the style of 3Blue1Brown. Curious, warm, precise. Even pace, about 160 words per minute. No dead air at the start or end. Do not add any words.",
    VOICE="cedar", MODEL="gpt-audio-1.5",  # the preferred voice (Oct 2026); "gpt-4o-mini-tts-2025-12-15" is the speech-endpoint fallback
    SPEED=1.03, GAP=0.38, GAP_AFTER={}, LEAD_IN=0.35, HOLD=1.6,
    PAYOFF={},          # line id -> word that gets the soft chime; default: the word after "get"
    REWIND_LINE=None,   # line id whose word "rewind" starts the rewind; None = no rewind
    FOLLOW_LINE=None,   # line id of the "Follow for more." sign-off; None = no end card
    FOLLOW_SUB="for more explainers like this", TYPING_SFX=False, TITLE="Explainer reel",
    FORMULA_SIZE={},    # line id -> CSS font-size for long formulas (default 66px)
    SAY={},             # line id -> text the voice speaks instead (spelled-out names); captions keep the LINES text
    CAPTIONS=False,     # word-by-word captions near the bottom (the script's words, timed to the voice)
    MUSIC="ambient",    # "ambient" (calm pad) or "beat" (pad plus a light kick/hat groove for faster reels); a project music.py overrides both
    MUSIC_GAIN=0.13,    # music level into the mix before the voice sidechain
    SFX_GAIN=0.32,      # scene-sound level into the mix (the sfx stem is peak-normalised first)
    DUCK_RATIO=4, DUCK_THRESHOLD=0.03, DUCK_ATTACK=25, DUCK_RELEASE=750,   # music sidechain under the voice (ms for attack/release)
    SAFE=0.8,           # the scene is drawn on the 1080x1920 canvas, then shrunk by this around the center so it clears phone side crops
)
for k, v in SETTINGS.items():
    setattr(L, k, getattr(L, k, v))
LINES = L.LINES
os.makedirs(f"{PROJ}/vo", exist_ok=True)
OUT = f"{PROJ}/build"
os.makedirs(f"{OUT}/audio", exist_ok=True)


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def run(cmd):
    subprocess.run(cmd, check=True)


# ---------- 1. voice lines (cached) ----------
for lid, text, _ in LINES:
    out = f"{PROJ}/vo/{lid}.wav"
    if os.path.exists(out):
        continue
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        sys.exit(f"voice line {lid} missing and OPENAI_API_KEY is not set")
    note = getattr(L, "NOTES", {}).get(lid, "")
    said = L.SAY.get(lid, text)
    hdr = {"Authorization": "Bearer " + key, "Content-Type": "application/json"}
    if L.MODEL.startswith("gpt-audio"):
        # A chat audio model has no speech endpoint: it reads the line as a chat reply. It can reword, so its own
        # transcript must match the script word for word; retry up to 3 times, then stop.
        sysmsg = ("You are a voiceover reader. Read the user's text aloud exactly, word for word: add, drop, or change nothing, "
                  "and do not answer or comment. Delivery: " + (L.INSTR + " " + note).strip())
        for attempt in range(3):
            body = json.dumps({"model": L.MODEL, "modalities": ["text", "audio"], "audio": {"voice": L.VOICE, "format": "wav"},
                               "messages": [{"role": "system", "content": sysmsg}, {"role": "user", "content": said}]}).encode()
            req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=body, headers=hdr)
            audio = json.load(urllib.request.urlopen(req, timeout=180))["choices"][0]["message"]["audio"]
            if norm(audio.get("transcript", "")) == norm(said):
                break
            print(f"voice {lid}: the model read '{audio.get('transcript')}'; retrying")
        else:
            sys.exit(f"voice line {lid}: {L.MODEL} would not read the line word for word")
        data = base64.b64decode(audio["data"])
    else:
        body = json.dumps({"model": L.MODEL, "voice": L.VOICE, "input": said, "instructions": (L.INSTR + " " + note).strip(), "response_format": "wav"}).encode()
        req = urllib.request.Request("https://api.openai.com/v1/audio/speech", data=body, headers=hdr)
        data = urllib.request.urlopen(req, timeout=180).read()
    if len(data) < 2000:
        sys.exit(f"voice line {lid}: empty audio from the API")
    open(out, "wb").write(data)
    print("voice", lid)
if "--tts-only" in sys.argv:
    sys.exit(0)

# ---------- 2. trim dead air and get word timings (cached per line) ----------
whisper = None
for lid, text, _ in LINES:
    js = f"{PROJ}/vo/{lid}.json"
    if os.path.exists(js) and os.path.getmtime(js) > os.path.getmtime(f"{PROJ}/vo/{lid}.wav"):
        continue
    if whisper is None:
        from faster_whisper import WhisperModel
        whisper = WhisperModel("small.en", device="cpu", compute_type="int8")
    a, sr = sf.read(f"{PROJ}/vo/{lid}.wav")
    if a.ndim > 1:
        a = a.mean(1)
    fr = int(0.01 * sr)
    db = 20 * np.log10(np.array([np.sqrt(np.mean(a[i * fr:(i + 1) * fr] ** 2)) + 1e-9 for i in range(len(a) // fr)]))
    # Trim only true silence (-50 dB) and keep padding, so soft consonants at the edges survive.
    loud = np.where(db > -50)[0]
    lo, hi = max(0, loud[0] - 6), min(len(db), loud[-1] + 8)
    a, db = a[lo * fr: hi * fr], db[lo:hi]
    # Shorten long pauses to ~0.28 s by cutting their middle; keep the real audio at both edges
    # (zeroing a pause erases quiet sounds like the "th" in "three").
    keep = int(0.14 * sr)
    xf = int(0.01 * sr)
    out, i, pos, q = [], 0, 0, db < -50
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]:
                j += 1
            if (j - i) * 0.01 > 0.4:
                head = a[pos: i * fr + keep]
                tail = a[j * fr - keep: j * fr]
                ramp = np.linspace(1, 0, xf)
                head[-xf:] = head[-xf:] * ramp + tail[:xf] * (1 - ramp)
                out.append(head); pos = j * fr - keep + xf
            i = j
        else:
            i += 1
    out.append(a[pos:])
    y = np.concatenate(out)
    sf.write(f"{PROJ}/vo/{lid}_t.wav", y, sr)
    segs, _ = whisper.transcribe(resample_poly(y, 16000, sr).astype(np.float32), word_timestamps=True)
    words = [{"w": x.word.strip(), "s": round(x.start, 3), "e": round(x.end, 3)} for s in segs for x in s.words]
    json.dump({"dur": round(len(y) / sr, 3), "words": words}, open(js, "w"))
    print("timed", lid, "|", " ".join(w["w"] for w in words))

# ---------- 3. assemble the voiceover and per-line cues ----------
t, placed, pieces = L.LEAD_IN, [], []
for lid, text, _ in LINES:
    info = json.load(open(f"{PROJ}/vo/{lid}.json"))
    fast = f"{PROJ}/vo/{lid}_f{L.SPEED}.wav"
    if not os.path.exists(fast) or os.path.getmtime(fast) < os.path.getmtime(f"{PROJ}/vo/{lid}_t.wav"):
        run(["ffmpeg", "-v", "error", "-y", "-i", f"{PROJ}/vo/{lid}_t.wav", "-af", f"atempo={L.SPEED}", fast])
    a, sr = sf.read(fast)
    if a.ndim > 1:
        a = a.mean(1)
    words = [{"w": w["w"], "s": w["s"] / L.SPEED, "e": w["e"] / L.SPEED} for w in info["words"]]
    # Keep the natural ending (word-end estimates run early on soft endings like "three"), but cap trailing
    # audio at 0.6 s past the last word: TTS sometimes leaves a hum or breath tail.
    fr = int(0.01 * sr)
    lv = 20 * np.log10(np.array([np.sqrt(np.mean(a[i * fr:(i + 1) * fr] ** 2)) + 1e-9 for i in range(len(a) // fr)]))
    e0 = min(len(a) / sr, words[-1]["e"] + 0.75)
    for i in range(int(words[-1]["e"] * 100), min(len(lv) - 5, int((words[-1]["e"] + 0.9) * 100))):
        if (lv[i:i + 5] < -50).all():  # the first real silence after the last word ends the line
            e0 = min(e0, i / 100 + 0.05)
            break
    # If the transcriber missed the line's last words, never cut at its last word: keep everything up to the last real sound.
    last_said = norm(L.SAY.get(lid, text).split()[-1])
    numeric = lambda w: any(c.isdigit() for c in w) or re.search(r"(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|teen|ty|hundred|thousand|million|percent)$", w)
    same_num = numeric(norm(words[-1]["w"])) and numeric(last_said)  # "365" said as "sixty-five"
    if norm(words[-1]["w"]) != last_said and not last_said.endswith(norm(words[-1]["w"])) and not same_num:
        loud_fr = np.where(lv > -50)[0]
        e0 = min(len(a) / sr, (loud_fr[-1] + 1) / 100 + 0.08) if len(loud_fr) else len(a) / sr
        print(f"WARNING {lid}: transcript ends on '{words[-1]['w']}', script ends on '{last_said}'; kept the audio to its last sound ({e0:.2f}s)")
    s0 = 0.0
    if len(a) / sr > words[-1]["e"] + 0.9 and norm(words[-1]["w"]) == last_said:
        print(f"WARNING {lid}: {len(a) / sr - words[-1]['e']:.1f}s of audio after the last word (cut); listen to vo/{lid}.wav and regenerate if it is a glitch")
    clip = resample_poly(a[int(s0 * sr): int(e0 * sr)], SR, sr)
    # Fade every line's edges (5 ms in, 40 ms out) so a cut that lands on sound never clicks or chops a word.
    fi, fo = min(len(clip), int(0.005 * SR)), min(len(clip), int(0.04 * SR))
    clip = clip.copy(); clip[:fi] *= np.linspace(0, 1, fi); clip[len(clip) - fo:] *= np.linspace(1, 0, fo) ** 2
    cues = {"_start": round(t, 3), "_end": round(t + len(clip) / SR, 3)}
    for w in words:  # first occurrence wins; use "_<word>2" style names in scenes only if you add them here
        cues.setdefault(norm(w["w"]), round(t + w["s"] - s0, 3))
    ws = [norm(w["w"]) for w in words]
    pw = L.PAYOFF.get(lid)
    if pw and norm(pw) in cues:
        cues["_payoff"] = cues[norm(pw)]
    elif "get" in ws and ws.index("get") < len(ws) - 1:
        gi = len(ws) - 1 - ws[::-1].index("get")
        cues["_payoff"] = round(t + words[gi + 1]["s"] - s0, 3)
    placed.append({"id": lid, "cues": cues, "words": [(norm(w["w"]), round(t + w["s"] - s0, 3)) for w in words], "text": text})
    pieces.append((t, clip))
    t += len(clip) / SR + L.GAP_AFTER.get(lid, L.GAP)
last_gap = L.GAP_AFTER.get(LINES[-1][0], L.GAP)
TOTAL = round(t - last_gap + L.HOLD, 3)
N = int(TOTAL * SR)
vo = np.zeros(N)
for at, clip in pieces:
    i = int(at * SR)
    vo[i: i + len(clip)] += clip[: N - i]
sf.write(f"{OUT}/audio/vo_raw.wav", vo, SR)
run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/audio/vo_raw.wav", "-af",
     "highpass=f=70,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
     "alimiter=limit=0.89,loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", str(SR), "-ac", "2", f"{OUT}/audio/vo.wav"])
C = {p["id"]: p["cues"] for p in placed}


def build_captions():
    """Chunks of up to 3 script words, each word timed by aligning the script to the transcribed words."""
    import difflib
    chunks = []
    for p in placed:
        if p["id"] == L.FOLLOW_LINE:
            continue
        toks = p["text"].split()
        sn = [norm(x) for x in toks]
        wn = [w for w, _ in p["words"]]
        times = [None] * len(toks)
        for a, b, n in difflib.SequenceMatcher(None, sn, wn, autojunk=False).get_matching_blocks():
            for k in range(n):
                times[a + k] = p["words"][b + k][1]
        known = [(i, x) for i, x in enumerate(times) if x is not None]
        if not known:
            continue
        for i in range(len(toks)):  # fill gaps by interpolating between matched neighbours
            if times[i] is None:
                prev = [k for k in known if k[0] < i]
                nxt = [k for k in known if k[0] > i]
                li, lt = prev[-1] if prev else (-1, p["cues"]["_start"])
                hi, ht = nxt[0] if nxt else (len(toks), p["cues"]["_end"] - 0.15)
                times[i] = round(lt + (ht - lt) * (i - li) / (hi - li), 3)
        cur = []
        for i, tok in enumerate(toks):
            disp = tok.rstrip(".,:;") if not tok.endswith("?") else tok
            cur.append({"w": disp, "t": times[i]})
            chars = sum(len(x["w"]) for x in cur)
            if tok[-1] in ".,:;?!" or len(cur) == 3 or chars > 16:
                chunks.append(cur); cur = []
        if cur:
            chunks.append(cur)
        chunks[-1].append({"end": p["cues"]["_end"]})
    out = []
    for i, c in enumerate(chunks):
        end = c.pop()["end"] if "end" in c[-1] else None
        nxt = chunks[i + 1][0]["t"] - 0.04 if i + 1 < len(chunks) else c[-1]["t"] + 0.8
        t1 = min(nxt, end + 0.1) if end is not None else nxt
        t1 = max(t1, c[-1]["t"] + 0.2)
        if i + 1 < len(chunks):
            t1 = min(t1, nxt)  # never overlap the next chunk
        out.append({"t0": round(c[0]["t"] - 0.04, 3), "t1": round(t1, 3), "words": c})
    return out


CAPS = build_captions() if L.CAPTIONS else None

# ---------- 4. ambient bed and effects ----------
music = np.zeros((N, 2))
chords = [[146.83, 220.0, 277.18, 329.63], [123.47, 185.0, 246.94, 293.66], [110.0, 164.81, 220.0, 277.18], [130.81, 196.0, 246.94, 329.63]]
for b in range(int(TOTAL / 4.0) + 1):
    ch = chords[b % 4]
    X.add(music, X.pad(ch, 5.2) * 2.2, b * 4.0, 1.0)
    X.add(music, X.sub(ch[0] / 2, 4.0) * 0.25, b * 4.0, 1.0)
    for k in range(8):
        X.add(music, X.pluck(ch[(k * 2 + b) % 4] * 2, 0.6) * 0.35, b * 4.0 + k * 0.5, 1.0, pan=0.35 if k % 2 else -0.35)
if L.MUSIC == "beat":  # 120 bpm: kick on beats, clap on 2 and 4, hats on the off-beats
    for k in range(int(TOTAL * 2)):
        bt = k * 0.5
        X.add(music, X.kick() * 0.55, bt, 1.0)
        if k % 2 == 1:
            X.add(music, X.clap() * 0.28, bt, 1.0)
        X.add(music, X.hat() * 0.22, bt + 0.25, 1.0, pan=0.2)
x = np.arange(N) / SR
music *= (np.clip(x / 1.5, 0, 1) * np.clip((TOTAL - x) / 1.2, 0, 1))[:, None]
_mp = os.path.join(PROJ, "music.py")   # optional: a project's own score, def music(N, SR, C, TOTAL, X) -> (N, 2) array
if os.path.exists(_mp):
    _ms = importlib.util.spec_from_file_location("music", _mp)
    _MM = importlib.util.module_from_spec(_ms)
    _ms.loader.exec_module(_MM)
    music = _MM.music(N, SR, C, TOTAL, X)
sfx = np.zeros((N, 2))


def add(sig, at, g=1.0, pan=0.0):
    X.add(sfx, sig, max(0.0, at), g, pan)


if L.TYPING_SFX:
    rng = np.random.default_rng(3)
    for k in range(20):
        add(X.key_click(), 0.02 + k * 0.045, 0.7, pan=rng.uniform(-0.3, 0.3))
for p in placed:
    if "_payoff" in p["cues"] and p["id"] != L.FOLLOW_LINE:
        add(X.ding(784.0 if p["id"] == L.REWIND_LINE else 1046.5) * 0.6, p["cues"]["_payoff"] + 0.02, 0.7)
rewind = None
if L.REWIND_LINE:
    c = C[L.REWIND_LINE]
    rw0 = c.get("rewind", c["_start"]) - 0.05
    RW = max(1.8, c.get("_payoff", c["_end"]) - rw0 - 0.25)
    tt = np.arange(int(RW * SR)) / SR
    tone = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-tt * 1.4) + 120) / SR) * 0.12
    hiss = X.hp(X.noise(RW), 1500) * 0.1 * (1 + 0.6 * np.sign(np.sin(2 * np.pi * 14 * tt)))
    add((tone + hiss) * np.minimum(1, tt / 0.05) * np.minimum(1, (RW - tt) / 0.15), rw0, 1.0)
    for k in range(int(RW / 0.12)):
        add(X.tick(2400 - k * 60, 0.02) * 0.6, rw0 + k * 0.12, 0.6)
    rewind = {"start": round(rw0, 3), "dur": round(RW, 3)}
follow = None
if L.FOLLOW_LINE:
    follow = C[L.FOLLOW_LINE]["_start"]
    add(X.pop(), follow - 0.15, 0.8)
    add(X.tick(2200, 0.05), follow + 0.55, 0.7)
    add(X.shimmer(1.4, 1046.5), follow + 0.6, 0.5)
extra = os.path.join(PROJ, "sfx.py")
if os.path.exists(extra):
    es = importlib.util.spec_from_file_location("sfx", extra)
    E = importlib.util.module_from_spec(es)
    es.loader.exec_module(E)
    try:
        E.extra(add, X, C)
    except KeyError as e:  # a timing build before sfx.py matches the new words: warn, keep building
        print(f"WARNING sfx.py uses a cue that does not exist ({e}); scene sounds skipped. Fix sfx.py before the final build.")


def peak(buf, p):
    m = np.max(np.abs(buf))
    return buf / m * p if m > 0 else buf


sf.write(f"{OUT}/audio/music.wav", peak(np.tanh(music), 0.7), SR)
sf.write(f"{OUT}/audio/sfx.wav", peak(np.tanh(sfx), 0.8), SR)
run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/audio/vo.wav", "-i", f"{OUT}/audio/music.wav", "-i", f"{OUT}/audio/sfx.wav",
     "-filter_complex", f"[1]volume={getattr(L, 'MUSIC_GAIN', 0.13)}[m];[0]asplit[v][sc];[m][sc]sidechaincompress=threshold={getattr(L, 'DUCK_THRESHOLD', 0.03)}:ratio={getattr(L, 'DUCK_RATIO', 4)}:attack={getattr(L, 'DUCK_ATTACK', 25)}:release={getattr(L, 'DUCK_RELEASE', 750)}[md];"
     f"[2]volume={getattr(L, 'SFX_GAIN', 0.32)}[s];[v][md][s]amix=inputs=3:normalize=0:duration=longest,alimiter=limit=0.95,loudnorm=I=-15:TP=-1:LRA=9",
     "-ar", str(SR), f"{OUT}/audio/mix.wav"])

# ---------- 5. formulas, assets, page ----------
fids = [lid for lid, _, f in LINES if f]
json.dump([[lid, f] for lid, _, f in LINES if f], open(f"{OUT}/.formulas.json", "w"))
run(["node", os.path.join(SKILL, "scripts", "render_tex.js"), f"{OUT}/.formulas.json", f"{OUT}/.formulas.html.json"])
fx = json.load(open(f"{OUT}/.formulas.html.json"))
os.makedirs(f"{OUT}/fonts", exist_ok=True)
kd = os.path.join(CACHE, "node_modules", "katex", "dist")
shutil.copy(os.path.join(kd, "katex.min.css"), f"{OUT}/katex.min.css")
for f in os.listdir(os.path.join(kd, "fonts")):
    if f.endswith(".woff2"):
        shutil.copy(os.path.join(kd, "fonts", f), f"{OUT}/fonts/{f}")
shutil.copy(os.path.join(CACHE, "PlusJakartaSans.ttf"), f"{OUT}/fonts/PlusJakartaSans.ttf")
open(f"{OUT}/hyperframes.json", "w").write("{}\n")
for f in getattr(L, "ASSETS", []):  # extra files the scene loads: a path relative to the project dir, or (source path, path in build/)
    src, dst = (f if isinstance(f, (tuple, list)) else (os.path.join(PROJ, f), f))
    os.makedirs(os.path.dirname(f"{OUT}/{dst}") or OUT, exist_ok=True)
    shutil.copy(os.path.join(PROJ, src), f"{OUT}/{dst}")
# PRELUDE: JS files (a theme, shared helpers) placed between lib.js and scenes.js; absolute or relative to the project dir
prelude = "".join(open(os.path.join(PROJ, f)).read() + "\n" for f in getattr(L, "PRELUDE", []))
timeline = {"cues": C, "total": TOTAL, "lines": [lid for lid, _, _ in LINES], "formulas": fids, "rewind": rewind, "follow": follow, "captions": CAPS, "safe": L.SAFE}
html = open(os.path.join(SKILL, "assets", "template.html")).read()
css = "\n".join(f"#fx_{k} {{ font-size: {v}; }}" for k, v in L.FORMULA_SIZE.items())
html = (html.replace("__TOTAL__", str(TOTAL)).replace("__TITLE__", L.TITLE).replace("__FORMULA_CSS__", css)
        .replace("__FORMULAS__", "".join(f'<div class="fx" id="fx_{k}">{fx[k]}</div>' for k in fids))
        .replace("__FOLLOW_SUB__", L.FOLLOW_SUB).replace("__TIMELINE__", json.dumps(timeline))
        .replace("__LIB__", "const LOGOS = " + open(os.path.join(SKILL, "assets", "logos.json")).read() + ";\n" + open(os.path.join(SKILL, "assets", "lib.js")).read())
        .replace("__SCENES__", prelude + open(os.path.join(PROJ, "scenes.js")).read()))
open(f"{OUT}/index.html", "w").write(html)
with open(f"{OUT}/cues.txt", "w") as f:  # every cue name per line, for writing scenes.js and sfx.py
    for lid, cdict in C.items():
        f.write(lid + "  " + "  ".join(f"{k}={v}" for k, v in cdict.items()) + "\n")
print("total", TOTAL, "| rewind", rewind, "| follow", follow, "| cues in build/cues.txt")
for lid, c in C.items():
    print(f"  {lid}: start {c['_start']:.2f}  payoff {c.get('_payoff', '-')}")
