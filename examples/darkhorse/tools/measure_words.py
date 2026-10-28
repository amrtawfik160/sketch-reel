from faster_whisper import WhisperModel
import json, soundfile as sf, numpy as np
from scipy.signal import resample_poly
import os
P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the project folder
a, sr = sf.read(P + "/build/audio/vo.wav")
if a.ndim > 1: a = a.mean(1)
a = resample_poly(a, 16000, sr).astype(np.float32)
m = WhisperModel("medium.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(a, word_timestamps=True, language="en", beam_size=5, initial_prompt="Andrej Karpathy, OpenAI, firstmate, PocketBase, LocalSend, AirDrop, Dark Horse Labs, darkhorselabs dot dev.")
out = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in s.words]
json.dump(out, open(P + "/words_measured.json", "w"))
print(" ".join(f"{w}@{s}" for w, s, e in out))
