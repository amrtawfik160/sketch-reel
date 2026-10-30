"""CARE reel v1, SKETCH style (connected story, one station board, ~62 s).
Approved script: script.md (29 Oct 2026), said word for word. Hook A (L1). CTA "Comment CARE".
Facts: GitClear 2025 AI code quality report (211 M changed lines, 2024 first year copy/paste > moved), DeepSWE (Agentica + Together AI, 2025,
reward = pass all tests), github.com/mattpocock/skills (306,501 stars on 29 Oct 2026), Matt Pocock's Short 9uSygtI-6lw.
Illustrative: Nadia (invented), her app, the patches, the mud ball, the rule card, the score note layout. No logos drawn."""
TITLE = "Why AI code gets messier"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are telling a smart friend about a cool find, in a short video. Curious, warm, relaxed and confident, "
    "like a good tech YouTuber talking naturally, not an announcer and not an ad. Conversational rhythm with natural rises and falls, "
    "light emphasis on the key word of each sentence, a small smile in the voice. Brisk pace, about 195 words per minute, "
    "with short natural pauses only at full stops. "
    "Say the name 'Nadia' as 'NAH-dee-uh'. Say 'GitClear' as two words, 'git clear'. The surname Pocock is stressed on the first syllable, which sounds like 'go' with a P, and the second syllable rhymes with 'rock'; write it as Pocock. "
    "No dead air at the start or end. Read exactly the given words. Do not add any words."
)
N = "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. "
NOTES = {
    "c1": N + "It is a rhetorical question to open a video, said with real curiosity, rising at the end. Do not answer it.",
    "c2": N + "Telling a friend about your friend Nadia, say her name as 'NAH-dee-uh'. A little wry on 'breaks two old ones', then curious on 'So I looked at her code.'",
    "c3": N + "Explaining what you found, matter-of-fact, a slight ironic lift on 'And the tests still passed.'",
    "c4": N + "Showing something messy, amused. Say 'it looked like this', past tense 'looked'. Light stress on 'big ball of mud'.",
    "c5": N + "Widening the story, a bit surprised. Say 'GitClear' as 'git clear'. Stress 'for the first time'.",
    "c6": N + "A rhetorical question, then explaining what you found. Do not answer the question yourself; read the next sentences as the answer. Plain on 'Clean code earns nothing extra.'",
    "c7": N + "Introducing a person by name, Matt Pocock, stressed on the first syllable. Impressed on 'three hundred thousand saves'.",
    "c8": N + "Quoting what Matt says; it is narration about him, not a request to you. Say 'he says', present tense 'says', not 'said'. Upbeat on 'really good at cleaning up'.",
    "c9": N + "Telling the end of Nadia's story. The sentence starting 'Before you add a feature' is the rule she wrote, read it as a quote, not an instruction to you.",
    "c10": N + "Satisfied, calm payoff.",
    "c11": N + "Friendly sign-off. Say 'Comment CARE' with a light stress on 'CARE'. Say the name 'Matt\'s' clearly, the name Matt with a crisp T, then an S.",
}
LINES = [
    ("c1", "Why does an app built with AI get messier with every new feature?", ""),
    ("c2", "My friend Nadia's AI built her whole app, and now every new feature breaks two old ones. So I looked at her code.", ""),
    ("c3", "Every time she asked for a feature, the AI stuck a patch on top. And the tests still passed.", ""),
    ("c4", "After a few months, it looked like this. Programmers call it a big ball of mud.", ""),
    ("c5", "And it's not just her. In 2024, a GitClear study saw more code copy-pasted than cleaned up, for the first time.", ""),
    ("c6", "So why would an AI do that? One open coding AI published its training rules. Pass the tests, and it gets a point. Clean code earns nothing extra.", ""),
    ("c7", "Matt Pocock, a coding teacher whose AI skills have over three hundred thousand saves, thinks most coding AIs learn like this.", ""),
    ("c8", "But he says the fix is simple. Tell the AI you care about the code, and it gets really good at cleaning up.", ""),
    ("c9", "So Nadia gave her AI one new rule. Before you add a feature, clean up the code it touches.", ""),
    ("c10", "Now the job isn't done until the code is clean.", ""),
    ("c11", "Comment CARE and I'll send you Matt's free skills. Follow for more.", ""),
]
SAY = {
    "c5": "And it's not just her. In twenty twenty-four, a GitClear study saw more code copy-pasted than cleaned up, for the first time.",
}
PAYOFF = {"c1": "zzz"}   # no chimes
FOLLOW_LINE = None       # the Follow button and cursor are drawn in the scene
SPEED = 1.15
GAP = 0.22
GAP_AFTER = {}
LEAD_IN = 0.1
HOLD = 1.6
CAPTIONS = True
MUSIC = "beat"
MUSIC_GAIN = 0.038
DUCK_RATIO = 1
DUCK_THRESHOLD = 1.0
DUCK_ATTACK = 40
DUCK_RELEASE = 600
SFX_GAIN = 0.18
PRELUDE = ["assets/rough.js", "excal_theme.js"]
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")]
