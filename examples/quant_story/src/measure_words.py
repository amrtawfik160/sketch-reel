from faster_whisper import WhisperModel
import json, soundfile as sf, numpy as np
from scipy.signal import resample_poly
a, sr = sf.read("build/audio/vo.wav")
if a.ndim > 1: a = a.mean(1)
a = resample_poly(a, 16000, sr).astype(np.float32)
m = WhisperModel("medium.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(a, word_timestamps=True, language="en", beam_size=5)
out = []
for s in segs:
    for w in s.words: out.append([w.word.strip(), round(w.start, 3), round(w.end, 3)])
json.dump(out, open("words_measured.json", "w"))
print(len(out))
