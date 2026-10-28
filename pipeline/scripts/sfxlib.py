"""Synth primitives shared by the reel sound design (instruments and effects)."""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(7)

def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.002, d=0.2, curve=4.0):
    x = np.arange(n) / SR
    att = np.clip(x / max(a, 1e-4), 0, 1)
    return att * np.exp(-curve * x / max(d, 1e-4))


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def add(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[i : i + len(sig), 0] += sig * gain * l * 1.414
    buf[i : i + len(sig), 1] += sig * gain * r * 1.414


# ---------- instruments ----------

def kick(sec=0.45, f0=150, f1=42):
    x = t(sec)
    f = f1 + (f0 - f1) * np.exp(-x * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env(len(x), 0.001, sec, 5)
    click = hp(noise(0.01), 2000) * 0.3
    body[: len(click)] += click
    return np.tanh(body * 1.6)


def clap(sec=0.25):
    n = noise(sec)
    e = np.zeros(len(n))
    for k, off in enumerate([0, 0.008, 0.016]):
        i = int(off * SR)
        e[i:] += env(len(n) - i, 0.001, 0.05 if k < 2 else sec, 6)
    return bp(n, 900, 5000) * e * 0.8


def hat(sec=0.05, open_=False):
    n = hp(noise(sec if not open_ else 0.25), 7000)
    return n * env(len(n), 0.001, sec if not open_ else 0.2, 7) * 0.35


def sub(freq, sec):
    x = t(sec)
    s = np.sin(2 * np.pi * freq * x) + 0.25 * np.sin(4 * np.pi * freq * x)
    e = np.minimum(1, x / 0.01) * np.minimum(1, (sec - x) / 0.04)
    return np.tanh(s * 1.3) * e * 0.55


def pluck(freq, sec=0.3):
    x = t(sec)
    s = sum(np.sin(2 * np.pi * freq * h * x) / h for h in (1, 2, 3, 4))
    return lp(s * env(len(x), 0.002, sec, 9), 3500) * 0.25


def pad(freqs, sec):
    x = t(sec)
    s = sum(
        np.sin(2 * np.pi * f * x + np.sin(2 * np.pi * 0.3 * x) * 0.4)
        + 0.5 * np.sin(2 * np.pi * f * 1.004 * x)
        for f in freqs
    )
    e = np.minimum(1, x / 0.6) * np.minimum(1, (sec - x) / 0.8)
    return lp(s * e, 1800) * 0.06


# ---------- sound effects ----------

def whoosh(sec=0.55, up=True):
    n = noise(sec)
    x = t(sec)
    out = np.zeros_like(n)
    steps = 24
    for k in range(steps):
        a, b = int(k * len(n) / steps), int((k + 1) * len(n) / steps)
        frac = k / steps if up else 1 - k / steps
        f = 300 + 5000 * frac**2
        out[a:b] = bp(n, f * 0.7, min(f * 1.4, 20000))[a:b]
    shape = np.sin(np.pi * x / sec) ** 2
    return out * shape * 0.9


def impact(sec=1.6):
    k = kick(sec, 120, 32) * 1.2
    crack = hp(noise(0.12), 1500) * env(int(0.12 * SR), 0.001, 0.08, 6) * 0.6
    k[: len(crack)] += crack
    tail = lp(noise(sec), 400) * env(int(sec * SR), 0.01, sec, 3) * 0.5
    return np.tanh(k + tail)


def riser(sec):
    x = t(sec)
    f = 200 * (2 ** (x / sec * 3.5))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.15
    n = hp(noise(sec), 2000) * (x / sec) ** 2 * 0.35
    return (tone + n) * (x / sec) ** 1.5


def tick(freq=2600, sec=0.03):
    x = t(sec)
    return np.sin(2 * np.pi * freq * x) * env(len(x), 0.0005, sec, 8) * 0.5


def key_click():
    n = bp(noise(0.025), 1800, 6000)
    return n * env(len(n), 0.0005, 0.02, 6) * rng.uniform(0.25, 0.5)


def paper_swish(sec=0.35):
    n = bp(noise(sec), 2500, 9000)
    x = t(sec)
    grain = 1 + 0.6 * np.sin(2 * np.pi * 37 * x) * rng.uniform(0.5, 1)
    return n * np.sin(np.pi * x / sec) ** 3 * grain * 0.5


def squelch(sec=0.5):
    x = t(sec)
    f = 400 * np.exp(-x * 6) + 60
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
    return lp(s, 900) * env(len(x), 0.005, sec, 4) * 0.4


def snip():
    a = hp(noise(0.04), 3000) * env(int(0.04 * SR), 0.0005, 0.02, 6)
    b = tick(4200, 0.05) * 0.8
    out = np.zeros(int(0.12 * SR))
    out[: len(a)] += a
    out[int(0.05 * SR) : int(0.05 * SR) + len(b)] += b
    out[int(0.05 * SR) : int(0.05 * SR) + len(a)] += a
    return out


def shimmer(sec=1.6, base=1318.5):
    x = t(sec)
    s = sum(
        np.sin(2 * np.pi * base * r * x) * np.exp(-x * (2 + i))
        for i, r in enumerate([1, 1.5, 2, 2.52, 3])
    )
    return s * np.minimum(1, x / 0.01) * 0.12


def clank(freq=520):
    x = t(0.5)
    s = sum(np.sin(2 * np.pi * freq * r * x) * np.exp(-x * d) for r, d in [(1, 9), (2.76, 14), (5.4, 20)])
    n = hp(noise(0.02), 3000) * 0.6
    s[: len(n)] += n
    return np.tanh(s * 1.4) * 0.35


def stamp():
    k = kick(0.3, 180, 60) * 0.7
    k[: int(0.03 * SR)] += lp(noise(0.03), 2500) * 0.5
    return k


def ding(freq=1567.98):
    x = t(1.4)
    s = np.sin(2 * np.pi * freq * x) * np.exp(-x * 3) + 0.4 * np.sin(2 * np.pi * freq * 2.01 * x) * np.exp(-x * 5)
    return s * 0.22


def buzz(sec=0.45):
    x = t(sec)
    s = np.sign(np.sin(2 * np.pi * 180 * x)) * (0.6 + 0.4 * np.sin(2 * np.pi * 30 * x))
    return bp(s, 300, 3000) * np.sin(np.pi * x / sec) * 0.18


def pop():
    x = t(0.12)
    f = 900 * np.exp(-x * 30) + 200
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.001, 0.1, 6) * 0.6


def glitch(sec=0.35):
    out = np.zeros(int(sec * SR))
    i = 0
    while i < len(out):
        L = int(rng.uniform(0.008, 0.03) * SR)
        f = rng.choice([220, 440, 880, 1760, 3520])
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(L) / SR)) * rng.uniform(0.1, 0.4)
        out[i : i + L] = seg[: len(out) - i]
        i += L + int(rng.uniform(0, 0.01) * SR)
    return lp(out, 6000)


