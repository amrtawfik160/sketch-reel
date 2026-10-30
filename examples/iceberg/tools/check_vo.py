# transcribe each voice line with faster-whisper medium.en (no name prompt, so misread names show) and compare to the script
# usage: python tools/check_vo.py [vo_dir/] [line ids...]
import sys, re, soundfile as sf, numpy as np
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
L = {}; exec(open("lines.py").read(), L)
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
def say(n):
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + say(n % 100))
    return say(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + say(n % 1000))
def norm(s):
    s = s.lower().replace("%", " percent")
    s = re.sub(r"(^|[\s(])-(\d)", r"\1minus \2", s).replace("-", " ")
    s = re.sub(r"\$([\d,]+) (billion|million)", r"\1 \2 dollars", s)
    s = re.sub(r"\$([\d,]+)", r"\1 dollars", s)
    s = re.sub(r"\b(20\d\d)\b", lambda m: "twenty " + {"2019": "nineteen", "2016": "sixteen", "2025": "twenty five"}.get(m.group(1), m.group(1)), s)
    s = re.sub(r"(\d),(\d{3})", r"\1\2", s)
    s = re.sub(r"\.(?=[a-z])", " dot ", s)
    out = []
    for w in re.sub(r"[^a-z0-9 ]", " ", s).split():
        out += (say(w) if w.isdigit() else w).split()
    s = " " + " ".join(out) + " "
    for a, b in [(" s e o ", " seo "), (" openseo ", " open seo "), (" dataforseo ", " data for seo "), (" readme ", " read me "), (" chatgpt ", " chat gpt "), (" deep seek ", " deepseek "), (" x ai ", " xai "), (" mecha hitler ", " mechahitler "), (" a billion ", " one billion "), (" gpt two ", " gpt 2 "), (" twenty two ", " twenty two "), (" a hundred ", " hundred "), (" g p t ", " gpt "), (" a i ", " ai "), ("darkhorselabs", "dark horse labs"), (" darkhorse ", " dark horse "),
                 (" pocket base ", " pocketbase "), (" first mate ", " firstmate "), (" p r ", " pr "), (" favorite ", " favourite "), (" air drop ", " airdrop "), (" one hundred ", " hundred "), (" local send ", " localsend "), (" open ai", " openai"), (" two thousand twenty four ", " twenty twenty four "), (" git clear ", " gitclear "), (" copy and pasted ", " copy pasted ")]:
        s = s.replace(a, b)
    return s.split()
if __name__ == "__main__":
    m = WhisperModel("medium.en", device="cpu", compute_type="int8")
    src = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].endswith("/") else "vo/"
    ids = [a for a in sys.argv[1:] if not a.endswith("/")] or [l[0] for l in L["LINES"]]
    for lid, text, _ in L["LINES"]:
        if lid not in ids: continue
        a, sr = sf.read(f"{src}{lid}.wav")
        if a.ndim > 1: a = a.mean(1)
        x = resample_poly(a, 16000, sr).astype(np.float32)
        segs, _ = m.transcribe(x, language="en", beam_size=5)
        t = " ".join(s.text.strip() for s in segs)
        ok = norm(t) == norm(L["SAY"].get(lid, text))
        print(("OK  " if ok else "DIFF"), lid, round(len(a)/sr, 2), "|", t, flush=True)
