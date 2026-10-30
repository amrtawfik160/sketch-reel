# transcribe the full mix and diff it word for word against the script (spoken form)
import sys, difflib, soundfile as sf, numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
sys.path.insert(0, "tools"); from check_vo import norm, L
a, sr = sf.read(sys.argv[1]); a = a.mean(1) if a.ndim > 1 else a
x = resample_poly(a, 16000, sr).astype(np.float32)
m = WhisperModel("medium.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(x, language="en", beam_size=5)
got = norm(" ".join(s.text for s in segs).replace("&", " and "))
want = norm(" ".join(L["SAY"].get(l, t) for l, t, _ in L["LINES"]))
print("words: script", len(want), "heard", len(got))
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, want, got, autojunk=False).get_opcodes():
    if op != "equal": print(op, "script:", " ".join(want[a0:a1]), "| heard:", " ".join(got[b0:b1]))
