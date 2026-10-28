"""(project: darkhorse) Caption chunks and word times from the measured narration (words_measured.json, faster-whisper medium on build/audio/vo.wav).
Writes caps_gen.js: CAPS (caption chunks, each number kept whole, chunks break at punctuation) and WT (per-line word times).
Run after any re-timing:  python3 gen_caps.py"""
import json, re, difflib

L = {}
exec(open("lines.py").read(), L)
LINES = L["LINES"]
cues = {}
for ln in open("build/cues.txt"):
    p = ln.split()
    cues[p[0]] = {k: float(v) for k, v in (x.split("=") for x in p[1:] if "=" in x)}

NUMW = {"26": "twenty-six", "96": "ninety-six", "8": "eight"}
MULTI = {"$20": ["twenty", "dollars"], ".dev": ["dot", "dev"]}
DIG = NUMW


def norm(s):
    s = s.lower().strip()
    if re.fullmatch(r"\d+\.\d+[.,]?", s):
        return s.rstrip(".,")
    return re.sub(r"[^a-z0-9]", "", s)


# expand measured whisper tokens into the script's spoken tokens, spreading time across multi-word expansions
meas = json.load(open("words_measured.json"))
ex = []
i = 0
while i < len(meas):
    w, a, b = meas[i]
    raw = w.strip()
    core = raw.rstrip(".,?!")
    nxt = meas[i + 1][0].strip() if i + 1 < len(meas) else ""
    def push(words, a, b):
        n = len(words)
        for k, ww in enumerate(words):
            ex.append([ww, round(a + (b - a) * k / n, 3), round(a + (b - a) * (k + 1) / n, 3)])
    if core.isdigit() and re.fullmatch(r"\.\d+[.,]?", nxt) and core != "0":   # a version: 5 .5 -> 5.5
        ex.append([core + nxt.rstrip(".,"), a, meas[i + 1][2]]); i += 2; continue
    if core in MULTI:
        push(MULTI[core], a, b); i += 1; continue
    if core == "0" and re.fullmatch(r"\.\d+[.,]?", nxt):                    # 0 .0372 -> zero point zero three seven two
        frac = nxt.rstrip(".,")[1:]
        ex.append(["zero", a, b]); push(["point"] + [DIG[d] for d in frac], meas[i + 1][1], meas[i + 1][2]); i += 2; continue
    if re.fullmatch(r"\.\d+", core):
        push(["point"] + [DIG[d] for d in core[1:]], a, b); i += 1; continue
    if core in NUMW and nxt.startswith(",000"):
        ex.append([NUMW[core], a, b]); ex.append(["thousand", meas[i + 1][1], meas[i + 1][2]]); i += 2; continue
    if core in NUMW:
        ex.append([NUMW[core], a, b]); i += 1; continue
    if core == "%":
        ex.append(["percent", a, b]); i += 1; continue
    if core == "GPT" and nxt.startswith("-2"):
        ex.append(["GPT-2", a, meas[i + 1][2]]); i += 2; continue
    if core.lower() == "favorite":
        ex.append(["favourite", a, b]); i += 1; continue
    if core.lower() == "passed":
        ex.append(["past", a, b]); i += 1; continue
    if core.lower() == "syndra":
        ex.append(["Cyndra", a, b]); i += 1; continue
    if core.lower() == "open" and nxt.startswith("-"):
        ex.append(["open-sourced", a, meas[i + 1][2]]); i += 2; continue
    if core.lower() == "clod":
        ex.append(["Claude", a, b]); i += 1; continue
    ex.append([core, a, b]); i += 1

# caption tokens in script order
toks = []
for lid, text, _ in LINES:
    for k, t in enumerate(text.split()):
        toks.append({"line": lid, "tok": t, "k": k})
A = [norm(t["tok"]) for t in toks]
Bn = [norm(e[0]) for e in ex]
for t in toks:
    t["t"] = None
for a0, b0, n in difflib.SequenceMatcher(None, A, Bn, autojunk=False).get_matching_blocks():
    for k in range(n):
        toks[a0 + k]["t"], toks[a0 + k]["e"] = ex[b0 + k][1], ex[b0 + k][2]
# interpolate unmatched tokens inside their line
for lid, _, _ in LINES:
    idx = [i for i, t in enumerate(toks) if t["line"] == lid]
    for j, i in enumerate(idx):
        if toks[i]["t"] is None:
            prv = [toks[q] for q in idx[:j] if toks[q]["t"] is not None]
            nx = [toks[q] for q in idx[j + 1:] if toks[q]["t"] is not None]
            lt = prv[-1]["e"] if prv else cues[lid]["_start"]
            ht = nx[0]["t"] if nx else cues[lid]["_end"]
            toks[i]["t"], toks[i]["e"] = round(lt, 3), round(ht, 3)
            print("interpolated", lid, toks[i]["tok"], toks[i]["t"])
    # keep times monotonic within the line
    for j in range(1, len(idx)):
        if toks[idx[j]]["t"] < toks[idx[j - 1]]["t"] + 0.05:
            toks[idx[j]]["t"] = round(toks[idx[j - 1]]["t"] + 0.05, 3)

# measured onsets the transcriber got wrong (checked on the waveform)
FIXT = {}   # waveform onsets the transcriber got wrong
for lid, _, _ in LINES:
    seen = {}
    for t in toks:
        if t["line"] != lid:
            continue
        k = norm(t["tok"]); n = seen.get(k, 0); seen[k] = n + 1
        if (lid, k, n) in FIXT:
            t["t"] = FIXT[(lid, k, n)]

for t in toks:
    t["raw"] = t["t"]
# a word the transcriber gave almost no time to would flash; keep each highlight at least 0.12 s
for lid, _, _ in LINES:
    idx = [i for i, t in enumerate(toks) if t["line"] == lid]
    for j in range(1, len(idx)):
        prev, cur = toks[idx[j - 1]], toks[idx[j]]
        nxt = toks[idx[j + 1]]["t"] if j + 1 < len(idx) else 1e9
        if cur["t"] - prev["t"] < 0.12 and prev["t"] + 0.12 < nxt - 0.06:
            cur["t"] = round(prev["t"] + 0.12, 3)
        elif cur["t"] - prev["t"] < 0.12:
            pp = toks[idx[j - 2]]["t"] if j >= 2 else -1e9
            prev["t"] = round(max(cur["t"] - 0.12, pp + 0.12), 3)

NUMSET0 = {"zero", "one", "two", "three", "four", "five", "seven", "point", "sixteen", "sixty-five", "thousand", "twenty-seven", "billion",
          "fifty-four", "eighteen", "thirty-two", "thirty", "percent", "hundred", "twenty-two", "ten", "twenty-nine", "twenty-five", "forty-seven", "forty-one", "twenty-six", "sixty-one", "ninety-six", "ninety-eight", "ninety", "twenty", "eight"}
class _NS:
    def __contains__(self, w): return bool(re.fullmatch(r"[\d,]+", w)) or w in NUMSET0
NUMSET = _NS()
JOIN_AFTER = {"thousand", "billion", "percent", "dollars"}
chunks = []
for lid, _, _ in LINES:
    lt = [t for t in toks if t["line"] == lid]
    units, cur = [], []
    for j, t in enumerate(lt):
        cur.append(t)
        w = t["tok"].lower().rstrip(".,?!")
        nw = lt[j + 1]["tok"].lower().rstrip(".,?!") if j + 1 < len(lt) else ""
        punct = t["tok"].rstrip('"')[-1] in ".,?!:"
        glue = not punct and ((w in NUMSET and nw in NUMSET) or (nw in JOIN_AFTER and w in NUMSET))
        if not glue:
            units.append(cur); cur = []
    if cur:
        units.append(cur)
    ch = []
    for u in units:
        words = sum(len(x) for x in ch)
        chars = sum(len(x["tok"]) + 1 for x in sum(ch, []))
        ulen = sum(len(x["tok"]) + 1 for x in u)
        if ch and (words + len(u) > 3 or chars + ulen > 20):
            chunks.append((lid, sum(ch, []))); ch = []
        ch.append(u)
        if u[-1]["tok"].rstrip('"')[-1] in ".,?!:":
            chunks.append((lid, sum(ch, []))); ch = []
    if ch:
        chunks.append((lid, sum(ch, [])))

# merge a chunk shorter than 0.45 s into a neighbour on the same line when no punctuation separates them (a comma may, for a lone word: "cheap, though.")
def dur(i):
    ws = chunks[i][1]
    nxt = chunks[i + 1][1][0]["t"] if i + 1 < len(chunks) else ws[-1]["e"] + 0.3
    return nxt - ws[0]["t"]
def shown(i):
    """How long the page is actually up (see start() below): a lone word can be spoken 0.45 s yet shown only 0.4 s."""
    f = chunks[i][1][0]["t"]
    b = max(f - 0.14, min(chunks[i - 1][1][-1]["t"] + 0.16, f - 0.04)) if i > 0 else f - 0.14
    return (chunks[i + 1][1][0]["t"] - 0.14 if i + 1 < len(chunks) else 1e9) - b
changed = True
while changed:
    changed = False
    for i in range(len(chunks)):
        lid, ws = chunks[i]
        if dur(i) >= 0.45 and not (len(ws) == 1 and shown(i) < 0.5):
            continue
        chars = sum(len(w["tok"]) + 1 for w in ws)
        if i > 0 and chunks[i - 1][0] == lid and chunks[i - 1][1][-1]["tok"][-1] not in (".?!" if len(ws) == 1 else ".,?!") and chars + sum(len(w["tok"]) + 1 for w in chunks[i - 1][1]) <= 26:
            chunks[i - 1] = (lid, chunks[i - 1][1] + ws); del chunks[i]; changed = True; break
        if i + 1 < len(chunks) and chunks[i + 1][0] == lid and ws[-1]["tok"][-1] not in ".,?!:" and chars + sum(len(w["tok"]) + 1 for w in chunks[i + 1][1]) <= 26:
            chunks[i + 1] = (lid, ws + chunks[i + 1][1]); del chunks[i]; changed = True; break

def start(i):
    """A page opens 0.14 s before its first word, but late enough that the last word of the page before it stays lit 0.16 s."""
    f = chunks[i][1][0]["t"]
    b = f - 0.14
    if i > 0:
        b = max(b, min(chunks[i - 1][1][-1]["t"] + 0.16, f - 0.04))
    return max(0.0, b)

# where an approved take says a different word than the script, the caption follows the voice: {(line, word, n): "said"}; WT keeps the script word
SAID = {}
for lid, _, _ in LINES:
    seen = {}
    for t in [t for t in toks if t["line"] == lid]:
        k = norm(t["tok"]); n = seen.get(k, 0); seen[k] = n + 1
        if (lid, k, n) in SAID:
            t["say"] = SAID[(lid, k, n)] + t["tok"][len(t["tok"].rstrip(".,?!")):]

CAPS = []
for i, (lid, ws) in enumerate(chunks):
    # the page is up before its first word; never before 0 (a tween at a negative time shifts the whole GSAP timeline late)
    t0 = start(i)
    if i + 1 < len(chunks) and chunks[i + 1][0] == lid:
        t1 = start(i + 1)
    elif i + 1 < len(chunks):
        t1 = min(chunks[i + 1][1][0]["t"] - 0.14, ws[-1]["e"] + 0.35)
    else:
        t1 = ws[-1]["e"] + 0.5
    disp = lambda s: (s if s.endswith("?") else s.rstrip(".,:;")) if not s.endswith('."') else s[:-2] + '"'
    # two words spoken almost together ("So I", "Claude every") light up as one highlight, not two flashes
    out = []
    for w in ws:
        if False and out[-1]["tok"][-1] not in ".,?!:":
            out[-1] = {**out[-1], "tok": out[-1]["tok"] + " " + w["tok"]}
        else:
            out.append(w)
    # the runtime opens a page at its first word - 0.04, so a word at 0.0 would also land at a negative time
    CAPS.append({"t0": round(t0, 3), "t1": round(max(t1, t0 + 0.3), 3), "words": [{"w": disp(w.get("say", w["tok"])), "t": max(w["t"], 0.04)} for w in out]})
short = [(c["words"][0]["w"], round(c["t1"] - c["t0"], 2)) for c in CAPS if c["t1"] - c["t0"] < 0.45]
print(len(CAPS), "chunks; short:", short)
WT = {lid: [[norm(t["tok"]), t["t"], t["e"]] for t in toks if t["line"] == lid] for lid, _, _ in LINES}
open("caps_gen.js", "w").write("// generated by gen_caps.py from words_measured.json\nconst CAPS = " + json.dumps(CAPS) + ";\nconst WT = " + json.dumps(WT) + ";\n")
for c in CAPS:
    print(c["t0"], c["t1"], " ".join(w["w"] + "@" + str(w["t"]) for w in c["words"]))
