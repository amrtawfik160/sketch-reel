"""v13 score for the glass Valor reel (make_reel.py's music hook): a fast, high-energy 128 bpm EDM track, synthesised locally
with numpy (royalty-free). Band-limited (PolyBLEP) supersaws, a punchy saturated kick, a musical sidechain pump on every kick,
an offbeat bass with a sub, crisp 16th hats with rolls, claps on 2 and 4, a plucked arp hook with a dotted-eighth delay, risers,
reverse cymbals, impacts and a light bus saturation. F minor: Fm - Db - Ab - Eb, one chord a bar.
Sections follow the story:
  intro (0 -> "human"): filtered chords opening, hats, a snare roll speeding up, a riser and a reverse cymbal into the drop;
  DROP 1 on "human" (impact + crash): full beat through g2-g4, fills into each new line;
  BUILD (g5, "tear the plan apart"): snare roll 8ths -> 16ths -> 32nds, filter sweep, riser, a short gap;
  DROP 2 on "Then" (g6): full beat + the lead hook, fills into g7-g9;
  BREAKDOWN on "freezes": everything drops (a downlifter), a dark filtered pad, a reverse cymbal into g11;
  RE-DROP on g11: full beat to the end, a crash and a 2.5 s fade.
The mix ducks it gently under the voice (make_reel's sidechain)."""
import numpy as np
from scipy.signal import butter, sosfilt, sosfilt_zi, sosfiltfilt, fftconvolve

BPM = 128.0
BT = 60.0 / BPM            # one beat
BAR = 4 * BT
CHORDS = [  # (bass root Hz, voicing Hz)
    (87.31, [349.23, 415.30, 523.25]),   # Fm
    (69.30, [277.18, 349.23, 415.30]),   # Db
    (103.83, [261.63, 311.13, 415.30]),  # Ab
    (77.78, [311.13, 392.00, 466.16]),   # Eb
]


def music(N, SR, C0, TOTAL, X):
    # Valor breakdown reel: the same score, mapped to this script. Drop 1 on "human" (v1), the build under v7 ("a bad
    # idea"), drop 2 on "Then he writes a plan" (v8), the breakdown on "stop" (v16), the re-drop on the callback (v19).
    C = dict(C0)
    C["g1"] = C0["v1"]; C["g5"] = C0["v7"]; C["g6"] = C0["v8"]; C["g11"] = C0["v19"]
    C["g10"] = {"freezes": C0["v16"]["stop"]}
    rng = np.random.default_rng(13)
    T = np.arange(N) / SR
    s = lambda lid, w="_start": C[lid][w]
    # v14: ONE beat grid for the whole track. The tempo is fitted (least squares, ~127 bpm) so that drop 1 ("human"), drop 2
    # ("Then") and the re-drop (g11) all sit on whole beats of the same grid: no section restarts its own grid, so no drop
    # arrives off the beat the build set up.
    A = C["g1"]["human"]
    BT0 = 60.0 / BPM
    d1, d2 = (s("g6") - 0.02) - A, (s("g11") - 0.02) - A
    n1, n2 = int(round(d1 / BT0)), int(round(d2 / BT0))
    BT = (n1 * d1 + n2 * d2) / (n1 * n1 + n2 * n2)
    BAR = 4 * BT
    hum = A
    tBuild, tDrop2 = s("g5"), A + n1 * BT
    tFz = C["g10"]["freezes"] - 0.03
    tRe = A + n2 * BT
    DROPS = (hum, tDrop2, tRe)
    print(f"music v14: {60 / BT:.2f} bpm, drop2 {tDrop2:.3f} (Then {s('g6'):.3f}), re-drop {tRe:.3f} (g11 {s('g11'):.3f})")
    tEnd = TOTAL
    starts = {k: s(k) for k in ("v2", "v3", "v5", "v6", "v10", "v12", "v13", "v14")}

    # ---------- primitives ----------
    def blep_saw(f, n, ph0=0.0):
        dt = f / SR
        t = (ph0 + dt * np.arange(n)) % 1.0
        y = 2.0 * t - 1.0
        m = t < dt
        x = t[m] / dt
        y[m] -= x + x - x * x - 1.0
        m = t > 1.0 - dt
        x = (t[m] - 1.0) / dt
        y[m] -= x * x + x + x + 1.0
        return y

    def env_ad(n, a, d):
        x = np.arange(n) / SR
        return np.clip(x / max(a, 1e-4), 0, 1) * np.exp(-x / max(d, 1e-4))

    def sweep(x, fc, kind="low", order=2, blk=256):
        """time-varying Butterworth filter: fc is an array (Hz) as long as x, applied block by block."""
        y = np.zeros_like(x)
        zi = None
        for i in range(0, len(x), blk):
            f = float(np.clip(fc[min(i + blk // 2, len(fc) - 1)], 30, SR * 0.45))
            sos = butter(order, f, kind, fs=SR, output="sos")
            if zi is None:
                zi = sosfilt_zi(sos) * x[0]
            seg, zi = sosfilt(sos, x[i:i + blk], zi=zi)
            y[i:i + blk] = seg
        return y

    def put_into(buf, sig, at, g=1.0, pan=0.0):
        i = int(round(at * SR))
        if i >= len(buf) or i + len(sig) <= 0:
            return
        j0 = max(0, -i)
        sig = sig[j0:len(buf) - i]
        i = max(i, 0)
        if buf.ndim == 1:
            buf[i:i + len(sig)] += sig * g
        elif sig.ndim == 2:
            buf[i:i + len(sig)] += sig * g
        else:
            l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
            buf[i:i + len(sig), 0] += sig * g * l * 1.414
            buf[i:i + len(sig), 1] += sig * g * r * 1.414

    def grid(t0, t1, step, anchor):
        k = int(np.ceil((t0 - anchor) / step - 1e-9))
        res = []
        while anchor + k * step < t1 - 1e-6:
            res.append((k, anchor + k * step))
            k += 1
        return res

    # ---------- instruments ----------
    def kick():
        n = int(0.42 * SR)
        x = np.arange(n) / SR
        f = 54 + 150 * np.exp(-x * 34) + 40 * np.exp(-x * 120)
        body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9)
        nc = int(0.012 * SR)
        click = X.hp(X.noise(0.012), 3000)[:nc] * np.linspace(1, 0, nc) * 0.6
        body[:nc] += click
        return np.tanh(body * 2.2) * 0.95
    KICK = kick()

    def clap():
        n = int(0.4 * SR)
        nz = X.noise(0.4)[:n]
        e = np.zeros(n)
        for off in (0.0, 0.009, 0.019):
            i = int(off * SR)
            e[i:] += np.exp(-np.arange(n - i) / SR * 90)
        tail = np.exp(-np.arange(n) / SR * 14) * 0.45
        sig = X.bp(nz, 900, 5200) * (e + tail)
        return np.tanh(sig * 1.4) * 0.8
    CLAP = clap()

    def hat(dec=0.035, bright=8500):
        n = int((dec * 5) * SR)
        sig = X.lp(X.hp(X.noise(dec * 5)[:n], bright, 4), 13500, 2)
        return sig * env_ad(n, 0.0005, dec)
    HAT, OHAT = hat(0.028), hat(0.11, 7000)

    def snare():
        n = int(0.25 * SR)
        x = np.arange(n) / SR
        tone = np.sin(2 * np.pi * 190 * x) * np.exp(-x * 30) * 0.6
        nz = X.bp(X.noise(0.25)[:n], 1500, 9000) * np.exp(-x * 22)
        return np.tanh((tone + nz) * 1.3) * 0.8
    SN = snare()

    def crash(sec=2.2):
        n = int(sec * SR)
        x = np.arange(n) / SR
        return X.lp(X.hp(X.noise(sec)[:n], 4500, 2), 12500, 2) * np.exp(-x * 2.2) * 0.38

    def rev_cym(sec):
        n = int(sec * SR)
        x = np.arange(n) / SR
        return X.hp(X.noise(sec)[:n], 3500, 2) * (x / sec) ** 3 * 0.55

    def impact():
        n = int(1.6 * SR)
        x = np.arange(n) / SR
        boom = np.sin(2 * np.pi * np.cumsum(32 + 40 * np.exp(-x * 8)) / SR) * np.exp(-x * 2.6)
        thump = X.lp(X.noise(1.6)[:n], 260, 2) * np.exp(-x * 9) * 1.2
        return np.tanh((boom + thump) * 1.6) * 0.9

    def riser(sec, f0=300, f1=7000):
        n = int(sec * SR)
        x = np.arange(n) / SR
        k = x / sec
        fc = f0 * (f1 / f0) ** (k ** 1.6)
        nz = sweep(X.noise(sec)[:n], fc * 0.7, "high") * 0.5
        nz = sweep(nz, np.minimum(fc * 1.6, SR * 0.44), "low")
        ph = np.cumsum(140 * 2 ** (2.5 * k ** 1.5)) / SR
        tone = (2 * (ph % 1) - 1) * 0.18
        tone = sweep(tone, 600 + 5000 * k ** 2, "low")
        return (nz + tone) * (k ** 2.2)

    def downlifter(sec=0.9):
        n = int(sec * SR)
        x = np.arange(n) / SR
        k = x / sec
        ph = np.cumsum(420 * 2 ** (-3.5 * k)) / SR
        tone = (2 * (ph % 1) - 1) * 0.3 * (1 - k) ** 1.5
        nz = sweep(X.noise(sec)[:n], 6000 * (1 - k) + 200, "low") * 0.35 * (1 - k) ** 1.2
        return X.lp(tone, 3000) + nz

    def supersaw(f, n, cutoff, voices=7, spread=0.012):
        L = np.zeros(n)
        R = np.zeros(n)
        for v in range(voices):
            d = (v - (voices - 1) / 2) / ((voices - 1) / 2)
            sig = blep_saw(f * (1 + d * spread), n, rng.random())
            pan = d * 0.85
            L += sig * np.sqrt(0.5 * (1 - pan))
            R += sig * np.sqrt(0.5 * (1 + pan))
        L /= voices / 2
        R /= voices / 2
        if np.ndim(cutoff):
            return np.stack([sweep(L, cutoff), sweep(R, cutoff)], 1)
        return np.stack([X.lp(L, cutoff), X.lp(R, cutoff)], 1)

    def pluck(f, sec=0.32, bright=7000):
        n = int(sec * SR)
        x = np.arange(n) / SR
        sig = blep_saw(f, n, rng.random()) * 0.6 + blep_saw(f * 2.003, n, rng.random()) * 0.25
        sig = sweep(sig, 500 + bright * np.exp(-x * 18), "low", blk=128)
        return sig * env_ad(n, 0.002, 0.16)

    # ---------- section map ----------
    FULL = [(hum, tBuild, hum), (tDrop2, tFz, tDrop2), (tRe, tEnd, tRe)]   # (t0, t1, grid anchor)

    def chord_at(t, anchor):
        bar = int(np.floor((t - anchor) / BAR + 1e-6))
        return CHORDS[bar % 4]

    # ---------- drums ----------
    drums = np.zeros((N, 2))
    kick_times = []
    for (t0, t1, an) in FULL:
        for k, t in grid(t0, t1, BT, an):
            kick_times.append(t)
            put_into(drums, KICK, t, 0.95)
            if k % 2 == 1:
                put_into(drums, CLAP, t, 0.5, pan=0.05)
        for k, t in grid(t0, t1, BT / 4, an):
            if k % 4 == 2:
                put_into(drums, OHAT, t, 0.2, pan=0.25)
            else:
                put_into(drums, HAT, t, 0.16 if k % 2 == 0 else 0.1, pan=-0.2 if k % 2 else 0.2)
        for k, t in grid(t0, t1 - BAR * 2 + 1e-6, BAR * 2, an):   # a 32nd hat roll closing every 2nd bar
            for j in range(6):
                put_into(drums, HAT, t + BAR * 2 - BT * 0.75 + j * BT / 8, 0.08 + 0.02 * j, pan=0.3)
    # intro: hats from the start, filtered kicks in the last bar, a snare roll speeding up into the drop
    for k, t in grid(0.0, hum, BT / 2, hum):
        put_into(drums, HAT, t, 0.1 if k % 2 else 0.06, pan=0.2)
    roll_len = min(hum - 0.05, 1.9)
    t = hum - roll_len
    while t < hum - 0.02:
        kk = (t - (hum - roll_len)) / roll_len
        put_into(drums, SN, t, 0.15 + 0.35 * kk)
        t += BT / 2 if kk < 0.45 else (BT / 4 if kk < 0.8 else BT / 8)
    KLP = X.lp(KICK, 700)
    for k, t in grid(max(0.0, hum - BAR), hum, BT, hum):
        put_into(drums, KLP, t, 0.55)
        kick_times.append(t)
    # build (g5): kick on quarters, a snare roll 8ths -> 16ths -> 32nds, cut 0.12 s before the drop
    bstart = tBuild
    bend = tDrop2 - BT / 2
    blen = max(0.5, bend - bstart)
    for k, t in grid(bstart, bend, BT, hum):
        put_into(drums, KICK, t, 0.85)
        kick_times.append(t)
    t = bstart
    while t < bend - 0.02:
        kk = (t - bstart) / blen
        put_into(drums, SN, t, 0.12 + 0.4 * kk)
        t += BT / 2 if kk < 0.4 else (BT / 4 if kk < 0.75 else BT / 8)
    # fills into the new lines: a 16th snare fill over the last half beat + a short reverse cymbal
    for lid, t in starts.items():
        tt = A + np.floor((t - 0.04 - A) / (BT / 2)) * (BT / 2)   # v14: the fill ends on a grid half-beat just before the line
        for j in range(4):
            put_into(drums, SN, tt - BT / 2 + j * BT / 8, 0.12 + 0.06 * j, pan=(-0.3 + 0.2 * j))
        put_into(drums, rev_cym(0.5), tt - 0.5, 0.35, pan=0.2)
    # the musical pump: on every kick
    kt = np.array(sorted(set(np.round(kick_times, 5))))
    idx = np.searchsorted(kt, T, side="right") - 1
    since = np.where(idx >= 0, T - kt[np.maximum(idx, 0)], 9.0)
    pump = np.clip(1 - 0.3 * np.exp(-since / 0.085) * (since < BT), 0.2, 1)

    # ---------- chords ----------
    syn = np.zeros((N, 2))
    stab_cache = {}

    def stab(voic, n, cutoff):
        key = (tuple(voic), n, cutoff)
        if key not in stab_cache:
            st = np.zeros((n, 2))
            for f in voic:
                st += supersaw(f, n, cutoff)
            stab_cache[key] = st * env_ad(n, 0.004, 0.16)[:, None]
        return stab_cache[key]
    nst = int(BT / 2 * SR * 0.92)
    for (t0, t1, an) in FULL:
        for k, t in grid(t0, t1, BT / 2, an):
            _, voic = chord_at(t, an)
            put_into(syn, stab(voic, nst, 7600), t, 0.26 if k % 2 else 0.32)
    # intro: a sustained chord per bar, the cutoff opening 380 -> 6000 Hz into the drop
    for k, t in grid(-BAR, hum, BAR, hum):
        t0 = max(0.0, t)
        t1 = min(hum, t + BAR)
        if t1 <= t0:
            continue
        _, voic = chord_at(t, hum)
        n = int((t1 - t0) * SR) + int(0.05 * SR)
        x = t0 + np.arange(n) / SR
        fc = 380 + 5600 * np.clip(x / max(0.1, hum), 0, 1) ** 2.2
        st = np.zeros((n, 2))
        for f in voic:
            st += supersaw(f, n, fc)
        st *= (np.clip(np.arange(n) / (0.02 * SR), 0, 1) * np.clip((n - np.arange(n)) / (0.04 * SR), 0, 1))[:, None]
        put_into(syn, st, t0, 0.2)
    # build: chords on 8ths with the filter sweeping open
    for k, t in grid(bstart, bend, BT / 2, hum):
        _, voic = chord_at(t, hum)
        kk = (t - bstart) / blen
        n = int(BT / 2 * SR * 0.9)
        st = np.zeros((n, 2))
        for f in voic:
            st += supersaw(f, n, 900 + 5000 * kk ** 1.8)
        put_into(syn, st * env_ad(n, 0.004, 0.14)[:, None], t, 0.24 + 0.1 * kk)
    # breakdown pad: a dark, filtered Fm under the freeze
    bd = max(0.3, tRe - tFz)
    n = int((bd + 0.05) * SR)
    pad = np.zeros((n, 2))
    for f in CHORDS[0][1]:
        pad += supersaw(f / 2, n, 650, voices=5, spread=0.008)
    pad *= (np.clip(np.arange(n) / (0.08 * SR), 0, 1) * np.clip((n - np.arange(n)) / (0.05 * SR), 0, 1))[:, None]
    brk = np.zeros((N, 2))
    put_into(brk, pad, tFz + 0.05, 0.17)

    # ---------- offbeat bass + sub ----------
    bass = np.zeros(N)
    bass_cache = {}
    nb = int(BT / 2 * SR * 0.95)
    for (t0, t1, an) in FULL + [(bstart, bend, hum)]:
        for k, t in grid(t0, t1, BT / 2, an):
            if k % 2 == 0:
                continue
            root, _ = chord_at(t, an)
            if root not in bass_cache:
                x = np.arange(nb) / SR
                b = X.lp(blep_saw(root * 2, nb), 1400) * 0.5 + np.sin(2 * np.pi * root * x) * 0.75
                bass_cache[root] = np.tanh(b * env_ad(nb, 0.003, 0.2) * 1.5)
            put_into(bass, bass_cache[root], t, 0.6)

    # ---------- lead hook: a 16th-note pluck arp in the drops ----------
    lead = np.zeros((N, 2))
    PAT = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 2, 0, 1, 0]
    pl_cache = {}
    for si, (t0, t1, an) in enumerate(FULL):
        gl = 0.11 if si == 0 else 0.15
        for k, t in grid(t0, t1, BT / 4, an):
            if k % 16 in (3, 11):
                continue
            _, voic = chord_at(t, an)
            f = voic[PAT[k % 16]] * 2
            if f not in pl_cache:
                pl_cache[f] = pluck(f)
            put_into(lead, pl_cache[f], t, gl, pan=0.35 if k % 2 else -0.35)
    dly = int(BT * 0.75 * SR)
    echo = np.zeros_like(lead)
    fb = lead.copy()
    for _ in range(3):
        sh = np.zeros_like(lead)
        sh[dly:] = fb[:-dly][:, ::-1] * 0.38      # ping-pong
        echo += sh
        fb = sh
    lead[:, 0] += X.lp(echo[:, 0], 4500)
    lead[:, 1] += X.lp(echo[:, 1], 4500)

    # ---------- one-shots ----------
    fx = np.zeros((N, 2))
    r1 = max(0.5, min(2.6, hum - 0.05))
    put_into(fx, riser(r1), hum - r1, 0.5)
    put_into(fx, rev_cym(min(1.2, hum)), hum - min(1.2, hum), 0.5)
    IMP, CR1, CR2 = impact(), crash(), crash()
    for tt, g in ((hum, 1.0), (tDrop2, 0.85), (tRe, 0.75)):
        put_into(fx, IMP, tt, 0.5 * g)                 # v14: exactly on the drop downbeat, with the kick (no flam)
        put_into(fx, CR1, tt, 0.4 * g, pan=-0.2)
        put_into(fx, CR2, tt + 0.011, 0.4 * g, pan=0.2)
    put_into(fx, riser(blen + 0.1, 400, 9000), bstart, 0.5)
    put_into(fx, rev_cym(0.9), tDrop2 - 0.9, 0.5)
    put_into(fx, downlifter(0.9), tFz, 0.55)
    put_into(fx, rev_cym(min(1.0, bd)), tRe - min(1.0, bd), 0.55)

    # ---------- mix ----------
    syn *= pump[:, None]
    lead *= (0.55 + 0.45 * pump)[:, None]
    bass *= pump
    irn = int(1.3 * SR)
    ir = X.lp(rng.standard_normal(irn) * np.exp(-np.arange(irn) / SR * 4.2), 6000) * 0.012
    wet = fftconvolve(syn[:, 0] + syn[:, 1] + lead[:, 0] + lead[:, 1], ir)[:N]
    wetL = X.hp(wet, 250)
    wetR = np.roll(wetL, int(0.013 * SR))
    mix = drums * 0.62 + syn * 1.9 + lead * 1.7 + fx * 0.85
    mix[:, 0] += bass + wetL * 0.5
    mix[:, 1] += bass + wetR * 0.5
    # the freeze: the beat stops dead; only the breakdown pad and the fx (downlifter, reverse cymbal) remain until the re-drop
    fz0, fz1 = int(tFz * SR), int(tRe * SR)
    mix[fz0:fz1] = (fx[fz0:fz1] + brk[fz0:fz1]) * 1.78   # round 2: the soft section sits ~5 dB higher so it is not dead
    mix[fz1:] += brk[fz1:]
    # v14: a short REAL silence (half a beat) before every drop, with 8 ms edges
    for d in DROPS:
        a0, a1 = int((d - BT / 2) * SR), int(d * SR)
        fd = int(0.008 * SR)
        mix[a0:a1] = 0.0
        if a0 - fd > 0:
            mix[a0 - fd:a0] *= np.linspace(1, 0, fd)[:, None]
    mix = np.stack([X.hp(mix[:, 0], 32, 2), X.hp(mix[:, 1], 32, 2)], 1)
    mix = np.tanh(mix * 1.15) / 1.15
    # v14: a FIXED level schedule timed to the script (no voice-triggered duck): speech level while any line is spoken, +3.5 dB
    # in gaps of 0.4 s or more, 100 ms ramps outside the words; gaps shorter than 0.4 s never release (no breathing). While
    # the voice speaks, the 4-10 kHz band of the music is cut by 6 dB (zero-phase band split) so it clears the consonants.
    iv = sorted((C0[k]["_start"], C0[k]["_end"]) for k in C0 if k.startswith("v") and "_start" in C0[k])
    merged = []
    for a, b in iv:
        if merged and a - merged[-1][1] < 0.4:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    m = np.zeros(N)
    for a, b in merged:
        m = np.maximum(m, np.clip((T - (a - 0.1)) / 0.1, 0, 1) * np.clip(((b + 0.1) - T) / 0.1, 0, 1))
    # v15: no 4-10 kHz cut under speech any more (the hats and arp carry on phone speakers); instead a +2 dB lift at 1-3 kHz
    # (EQ only), and a small 4-10 kHz guard (HI_GUARD dB) only if a measurement shows the music within 6 dB of the voice there
    msos = butter(2, [1000, 3000], "band", fs=SR, output="sos")
    mid = np.stack([sosfiltfilt(msos, mix[:, 0]), sosfiltfilt(msos, mix[:, 1])], 1)
    mix = mix + mid * (10 ** (2 / 20) - 1)
    HI_GUARD = 0.0
    if HI_GUARD:
        hsos = butter(2, [4000, 10000], "band", fs=SR, output="sos")
        hi = np.stack([sosfiltfilt(hsos, mix[:, 0]), sosfiltfilt(hsos, mix[:, 1])], 1)
        mix = mix - hi * (1 - 10 ** (-HI_GUARD / 20)) * m[:, None]
    gg = 10 ** (3.5 / 20)
    mix *= (gg + (1 - gg) * m)[:, None]
    mix *= (np.clip(T / 0.05, 0, 1) * np.clip((TOTAL - T) / 2.5, 0, 1))[:, None]
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.95
    # v15: a dynamic consonant guard. The music keeps its full 4-10 kHz (hats and arp carry on phones), EXCEPT where the voice is
    # speaking and its own 4-10 kHz would sit less than 6 dB above the music's there: only there the music's 4-10 kHz band is
    # pulled down, just enough (+1 dB margin, max 14 dB), smoothed over 120 ms. Reads the processed voice (written earlier in
    # the build) and MUSIC_GAIN from lines.py, so it measures exactly what the mix will contain.
    try:
        import os, runpy, soundfile as sf
        here = os.path.dirname(os.path.abspath(__file__))
        vo, vsr = sf.read(os.path.join(here, "build", "audio", "vo.wav"))
        vo = vo.mean(1) if vo.ndim > 1 else vo
        G = runpy.run_path(os.path.join(here, "lines.py")).get("MUSIC_GAIN", 1.0)
        if vsr == SR:
            vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
            hsos = butter(4, [4000, 10000], "band", fs=SR, output="sos")
            vh = sosfiltfilt(hsos, vo)
            hi = np.stack([sosfiltfilt(hsos, mix[:, 0]), sosfiltfilt(hsos, mix[:, 1])], 1)
            mh = hi.mean(1) * G
            hop, win = int(0.025 * SR), int(0.25 * SR)
            def mavg(x):   # centred moving average via a cumulative sum (O(N), not O(N*win))
                cs = np.concatenate([[0.0], np.cumsum(x)])
                i = np.arange(0, len(x), hop)
                lo = np.clip(i - win // 2, 0, len(x)); hi_ = np.clip(i + win // 2, 0, len(x))
                return (cs[hi_] - cs[lo]) / np.maximum(hi_ - lo, 1)
            pv = mavg(vh ** 2); pm = mavg(mh ** 2); pfull = mavg(vo ** 2)
            dbv, dbm, dbf = (10 * np.log10(x + 1e-12) for x in (pv, pm, pfull))
            active = dbf > dbf.max() - 18
            need = np.where(active, np.clip(9.5 - (dbv - dbm), 0, 18), 0.0)
            need = np.maximum.reduce([np.roll(need, s_) for s_ in range(-6, 7)])   # hold +-0.15 s around each need
            sm = np.convolve(need, np.ones(5) / 5, "same")
            att = np.interp(np.arange(N), np.arange(len(sm)) * hop, sm)
            mix = mix - hi * (1 - 10 ** (-att / 20))[:, None]
    except Exception as e:   # the guard is a refinement; the track still renders without it
        print("music guard skipped:", e)
    return mix / (np.max(np.abs(mix)) + 1e-9) * 0.95

