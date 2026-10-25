"""Quantization explainer, STORY version (sketch-reel, ~60 s; one character, Sam (invented), and one number card, 0.0372, carried through one continuous board; the 52 s cut felt disconnected; recreates instagram.com/reel/DePS81PMeVC in the sketch style,
mostly dark boards with light sections). Facts and sources: research.md (checked 24 Oct 2026). Summary:
- Opus 5.5 released 2026-09-22; Reddit "nerf" threads from ~09-29 (secondary reports). Quantization blamed, unproven.
- Anthropic, Sep 2025 postmortem: "We never reduce model quality due to demand, time of day, or server load."
- Qwen3.8-27B: BF16 54.66 GB, Q4_K_M 17.77 GB (Distillio GGUF; unsloth 17.1 GB) -> "under eighteen".
- 16 bits = 65,536 values; 4 bits = 16 values. Blocks of 32 weights with their own scale (llama.cpp). AWQ (MIT, arXiv 2306.00978):
  0.1-1% salient weights; protecting them greatly reduces quantization error; scales them up before rounding.
- LiveNerf (github.com/ninjahawk/livenerf): daily Opus 5.5 runs since 09-24; windows 1-2 (30 days) "no change"; detects ~7 points.
- platform.claude.com effort docs: Opus 5.5 defaults to medium effort; Opus 5 and earlier default to high.
Illustrative: the example weights 0.0372, 0.7, 0.12, 0.04."""
TITLE = "Is Anthropic shrinking Claude?"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are explaining something fascinating to a smart friend, in a short video breakdown. Curious, warm, relaxed and confident, "
    "like a good tech YouTuber talking naturally, not an announcer and not an ad. Conversational rhythm with natural rises and falls, "
    "light emphasis on the key word of each sentence, a small smile in the voice. Brisk pace, about 195 words per minute, "
    "with short natural pauses only at full stops. Say 'Qwen' as 'chwen', one syllable. Say 'LiveNerf' as 'live nerf'. "
    "No dead air at the start or end. Read exactly the given words. Do not add any words."
)
NOTES = {
    "s1": "Hook: amused and a little conspiratorial, like telling a friend's wild theory.",
    "s2": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Curious, rolling up your sleeves.",
    "s3": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Say the number zero point zero three seven two smoothly as one number with no pause inside it. A small 'look at this' moment on the number.",
    "s5": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Clear and satisfied, explaining.",
    "s6": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. A turn on 'But', a little serious.",
    "s7": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Investigative, then a calm verdict.",
    "s8": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Warm reveal, a small twist.",
    "s9": "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. Friendly tip, then a warm sign-off.",
}
LINES = [
    ("s1", "My friend Sam swears Claude got dumber. And he has a theory. Anthropic secretly shrank it to save money.", ""),
    ("s2", "The trick he means is called quantization. So I opened up a model to see what it would actually do.", ""),
    ("s3", "Inside, an AI is just billions of numbers, like this one. Zero point zero three seven two.", ""),
    ("s4", "Every word Claude writes is built by reading billions of numbers like this one.", ""),
    ("s5", "Quantization rounds them. Zero point zero three seven two becomes zero point zero four. Shorter numbers make the whole model three times smaller, so it's faster and cheaper to run.", ""),
    ("s6", "That's Sam's theory. But every rounded number is a little off. And a little off, billions of times, can turn a right answer into a wrong one.", ""),
    ("s7", "So I checked. Anthropic says it never lowers quality because of demand. And a public test has quizzed Claude every day since launch. Thirty days, no drop.", ""),
    ("s8", "So Sam's rounding theory has no proof. But he wasn't imagining it. The new Claude thinks less by default. Its effort setting starts at medium, where the old one started at high.", ""),
    ("s9", "So I sent Sam one tip. Turn the effort up. Follow for more, and send this to your own Sam.", ""),
]
SAY = {}
PAYOFF = {}
FOLLOW_LINE = None   # the Follow button and cursor are drawn in the scene
SPEED = 1.15
GAP = 0.1
GAP_AFTER = {}
LEAD_IN = 0.1
HOLD = 2.6
CAPTIONS = True
MUSIC = "beat"
MUSIC_GAIN = 0.035
DUCK_RATIO = 1
DUCK_THRESHOLD = 1.0
DUCK_ATTACK = 40
DUCK_RELEASE = 600
SFX_GAIN = 0.2

PRELUDE = ["assets/rough.js", "excal_theme.js"]
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")]
