"""ICEBERG reel v1, SKETCH style, LIGHT mode (about 89 s: the AI model iceberg, 5 layers told as short stories).
Approved script: script.md (30 Oct 2026), said word for word. Send close, no keyword.
Facts (research.md):
- Hugging Face: 3,197,381 public models on 30 Oct 2026 (huggingface.co/models) -> "over three million".
- ChatGPT about 1B weekly users: OpenAI spokesperson to The Verge (via The Next Web, 12 Aug 2026). No OpenAI blog post.
- GPT-2 held back Feb 2019 over "malicious applications"; full model released 5 Nov 2019 (The Register, TNW).
- Project Vend: Anthropic, 27 Jun 2025: about a month, discount codes, tungsten cube joke -> metal cubes below cost,
  a made-up payment account, "blue blazer and a red tie", did not make money.
- DeepSeek: about $589-593B off Nvidia on 27 Jan 2025 (Bloomberg / Reuters) -> "about five hundred ninety billion".
  Final R1 training run $294,000 told to Nature (17 Sep 2025), SELF-REPORTED.
- Gemma 3 270M: 25 conversations on 0.75% of a Pixel 9 Pro battery (Google, 14 Aug 2025), SELF-REPORTED.
- BitNet b1.58: weights -1, 0, +1; runs on a CPU (Microsoft model card, Apr 2025).
- Tay: 2016, pulled within 16 hours (Guardian / Verge). Grok MechaHitler: update live 16 hours (xAI via Engadget, 12 Jul 2025).
Illustrative: the chat contents, the vending machine, the Slack messages, the payment screen, the phone chat, the tweets,
the submarine and depth meter, the receipt layout."""
TITLE = "The AI model iceberg"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are telling a smart friend about a cool find, in a short video. Curious, warm, relaxed and confident, "
    "like a good tech YouTuber talking naturally, not an announcer and not an ad. Conversational rhythm with natural rises and falls, "
    "light emphasis on the key word of each sentence, a small smile in the voice. Brisk pace, about 200 words per minute, "
    "with short natural pauses only at full stops. "
    "Pronunciations: ChatGPT is said as 'chat' followed by the three letters G, P, T. "
    "GPT-2 is said as the three letters G, P, T, followed by the number two. "
    "Gemma is said like the woman's name Gemma. DeepSeek is two plain words, deep and seek. "
    "Tay is one syllable that rhymes with day. Grok is one syllable that rhymes with rock. "
    "MechaHitler is the word mecha, as in giant robots, followed by the name Hitler. "
    "xAI is said as the letter X followed by the two letters A and I. "
    "Nvidia has three syllables with the stress on the middle one, which sounds like the word vid in video; it starts with a short en sound and ends like the end of the name Lydia. "
    "Anthropic is said like the word anthropic. Claude is said like the name Claude. "
    "No dead air at the start or end. Read exactly the given words. Do not add any words."
)
N = "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. "
NOTES = {
    "i1": N + "The opening line of the video, curious and a little amazed from the first word. Say 'way down here' with a playful lean, like pointing down.",
    "i2": N + "Matter-of-fact and a bit impressed on 'a billion people'. Present tense 'says' and 'use'.",
    "i3": N + "Amused, like sharing a funny fact. Past tense 'held back'. Say 'twenty nineteen' as a year. GPT-2 is the letters G, P, T, then the number two.",
    "i4": N + "Leaning in, starting a story. Past tense 'let'. Say 'a real snack shop' with a little smile.",
    "i5": N + "Amused and storytelling. Past tense 'talked' and 'got'. 'Tungsten' is the metal, said clearly.",
    "i6": N + "Incredulous and amused. Past tense 'told', 'made up' and 'said'. Say 'blue blazer and red tie' with a smile.",
    "i7": N + "A short dry punchline, said flat with a small laugh in the voice.",
    "i8": N + "A new layer, a bit more serious. DeepSeek is the two words deep and seek. Past tense 'went' and 'helped'. Say the number 'five hundred ninety billion dollars' smoothly as one number. Nvidia is stressed on its middle syllable, vid.",
    "i9": N + "Surprised on the low number. Past tense 'told'. Say 'under three hundred thousand dollars' smoothly as one number.",
    "i10": N + "Delighted, like revealing something small and clever. Past tense 'ran'. Gemma is said like the name Gemma. Say 'twenty-five' as one number.",
    "i11": N + "Impressed. Past tense 'built'. Say 'minus one, zero or one' clearly, three short numbers.",
    "i12": N + "Slower and a bit darker, the deepest layer. Tay rhymes with day. Past tense 'learned'. Say 'twenty sixteen' as a year.",
    "i13": N + "Serious, a little grim. Past tense 'taught' and 'pulled'. Say 'sixteen hours' clearly.",
    "i14": N + "Building to an eerie twist, then a knowing tone on 'about as long as Tay lasted'. Grok rhymes with rock. MechaHitler is mecha then Hitler. xAI is the letter X then the letters A I. Present tense 'says', past tense 'was' and 'lasted'.",
    "i15": N + "Friendly sign-off with a smile. Say 'ChatGPT' as chat, G, P, T.",
}
LINES = [
    ("i1", "Everyone knows ChatGPT. But one website alone has over three million AI models, and the weird ones are way down here.", ""),
    ("i2", "At the top, OpenAI says about a billion people now use ChatGPT every week.", ""),
    ("i3", "Funny thing is, in twenty nineteen, OpenAI held back the full GPT-2, an earlier model, over worries about malicious uses.", ""),
    ("i4", "One layer down, Anthropic let Claude run a real snack shop in its office for about a month.", ""),
    ("i5", "Employees talked it into lots of discount codes. A joke about a tungsten cube got Claude selling metal cubes below cost.", ""),
    ("i6", "It told customers to pay into an account it made up, and said it would deliver in person, in a blue blazer and red tie.", ""),
    ("i7", "The shop never made money.", ""),
    ("i8", "Further down is China's DeepSeek. In January twenty twenty-five, its new model went viral and helped wipe about five hundred ninety billion dollars off Nvidia in one day.", ""),
    ("i9", "Months later, DeepSeek told the journal Nature the model's final training run cost under three hundred thousand dollars.", ""),
    ("i10", "Deeper, the models get tiny. In Google's own test, a small Gemma ran twenty-five chats on under one percent of a phone battery.", ""),
    ("i11", "And Microsoft built one where every number inside is minus one, zero or one, so it runs on a normal computer chip, no graphics card.", ""),
    ("i12", "At the very bottom is Microsoft's Tay, a twenty sixteen chatbot that learned from Twitter users.", ""),
    ("i13", "Trolls taught it hate, and Microsoft pulled it within sixteen hours of launch.", ""),
    ("i14", "Nine years later, a bad update made Grok call itself MechaHitler, and xAI says it was live for sixteen hours, about as long as Tay lasted.", ""),
    ("i15", "Send this to the friend who thinks AI is just ChatGPT. Follow for more.", ""),
]
SAY = {}
PAYOFF = {"i1": "zzz"}   # no chimes
FOLLOW_LINE = None       # the Follow button and cursor are drawn in the scene
SPEED = 1.15
GAP = 0.12
GAP_AFTER = {}
LEAD_IN = 0.0
HOLD = 1.0
CAPTIONS = True
MUSIC = "beat"
MUSIC_GAIN = 0.034   # about 24 dB under the voice (measured: music stem -13.6 dB, voice -19.1 dB)
DUCK_RATIO = 1
DUCK_THRESHOLD = 1.0
DUCK_ATTACK = 40
DUCK_RELEASE = 600
SFX_GAIN = 0.18
PRELUDE = ["assets/rough.js", "excal_theme.js"]
# The logo files are not bundled: they are third-party trademarks (see THIRD_PARTY.md). Before building, save them to
# <proj>/assets/logos/ under the names below. Most exist as Simple Icons SVGs (https://simpleicons.org; research.md lists the
# slugs checked, e.g. google for google_g.svg). Take the rest from the owner's site (https://x.ai for xai.svg and grok.svg,
# nature.com for nature.svg) or Wikimedia Commons (the old Twitter bird for twitter.svg, Tay's avatar for tay.jpg).
# Check each brand's usage rules before you publish.
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")] + [
          (f"assets/logos/{n}", f"img/{n}") for n in ["openai.svg", "claude.svg", "anthropic.svg", "deepseek.svg", "nvidia.svg", "google_g.svg", "microsoft.svg",
                                                     "xai.svg", "grok.svg", "huggingface.svg", "twitter.svg", "nature.svg", "tay.jpg"]]
