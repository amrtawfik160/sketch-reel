# shorten inner pauses: python tighten.py <in.wav> <out.wav> <target_s> [start:end:target ...]  (regions from silencedetect)
import sys, soundfile as sf, numpy as np
src, dst, tgt = sys.argv[1], sys.argv[2], float(sys.argv[3])
y, sr = sf.read(src)
regions = []
for r in sys.argv[4:]:
    a, b, *t = r.split(":"); regions.append((float(a), float(b), float(t[0]) if t else tgt))
out, pos = [], 0
for a, b, t in sorted(regions):
    if b >= len(y) / sr - 0.02: continue          # trailing silence: make_reel trims it
    d = b - a
    if d <= t: continue
    cut0 = int((a + t / 2) * sr); cut1 = int((b - t / 2) * sr)
    out.append(y[pos:cut0]); pos = cut1
out.append(y[pos:])
sf.write(dst, np.concatenate(out), sr)
print(dst, round(len(y) / sr, 2), "->", round(sum(len(o) for o in out) / sr, 2))
