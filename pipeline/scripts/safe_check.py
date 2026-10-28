"""Side safe-zone check for a rendered reel.

Phones taller than 9:16 fill the screen by cropping about 100 px from each side of a 1080x1920 video,
and the like/comment/share buttons sit over the right edge. This samples the video 4 times a second and
reports every moment where drawn content comes closer than MARGIN px to the left or right edge.

usage: python safe_check.py <video.mp4> [margin_px=110]
exit 0 = clear (brief moments under 0.5 s are listed), 1 = content held in a side zone (the times are printed).
"""
import subprocess
import sys

import numpy as np

f = sys.argv[1]
MARGIN = int(sys.argv[2]) if len(sys.argv) > 2 else 110
W, H, FPS = 270, 480, 4  # quarter scale: 1 px here = 4 px in the video
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(int)
bad = []
for i, a in enumerate(frames):
    ink = np.abs(a - np.median(a)) > 40           # differs clearly from the background
    cols = np.where(ink.sum(0) >= 2)[0]            # columns with real content, not a lone star or noise pixel
    if not len(cols):
        continue
    left, right = cols[0] * 4, (W - 1 - cols[-1]) * 4
    if min(left, right) < MARGIN:
        bad.append((i / FPS, left, right))
print(f"{f}: {len(frames)} frames checked, margin {MARGIN} px")
if not bad:
    print("PASS: nothing in the side zones")
    sys.exit(0)
runs, start = [], bad[0]
for prev, cur in zip(bad, bad[1:] + [None]):
    if cur is None or cur[0] - prev[0] > 1.5 / FPS:
        span = [b for b in bad if start[0] <= b[0] <= prev[0]]
        runs.append((start[0], prev[0], min(b[1] for b in span), min(b[2] for b in span)))
        start = cur
# One sample on its own (under 0.5 s) is a prop sliding in or out, or the follow pointer flying in: listed, not failed.
held = [r for r in runs if r[1] - r[0] >= 2 / FPS]   # 3+ samples in a row: on screen for at least 0.5 s
for t0, t1, l, r in runs:
    side = " ".join(s for s, d in (("left", l), ("right", r)) if d < MARGIN)
    print(f"  {t0:6.2f}-{t1:6.2f}s  {side:10s} closest: left {l} px, right {r} px  {'HELD' if (t0, t1, l, r) in held else 'brief'}")
if held:
    print(f"FAIL: {len(held)} stretch(es) of content held in a side zone; move those props inward")
    sys.exit(1)
print("PASS: only brief moments in the side zones")
