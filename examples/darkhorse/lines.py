"""Dark Horse Labs reel v2, SKETCH version (connected story, one station board, ~55 s).
Approved script: script.md (v2, 28 Oct 2026), said word for word. v1 is in script_v1.md and v1/.
Facts: script.md sources (GitHub API, 28 Oct 2026) and src/. Star counts are GitHub stars ("saved").
No logos drawn; Karpathy appears as text only (no face or likeness).
Illustrative: the laptop screen contents, the captain's request, the robots, the folders, the phone/laptop drawing, the horse and race track."""
TITLE = "Dark Horse Labs"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are telling a smart friend about a cool find, in a short video. Curious, warm, relaxed and confident, "
    "like a good tech YouTuber talking naturally, not an announcer and not an ad. Conversational rhythm with natural rises and falls, "
    "light emphasis on the key word of each sentence, a small smile in the voice. Brisk pace, about 195 words per minute, "
    "with short natural pauses only at full stops. "
    "Say 'Karpathy' as 'kar-PAH-thee'. Say 'firstmate' as two words, 'first mate'. Say 'PocketBase' as 'pocket base' and 'LocalSend' as 'local send'. "
    "Say 'PR' as the two letters 'P R'. Say 'darkhorselabs dot dev' as 'dark horse labs dot dev'. "
    "No dead air at the start or end. Read exactly the given words. Do not add any words."
)
N = "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration. "
NOTES = {
    "s1": N + "Hook: a little amused and amazed, like sharing a funny fact with a friend; a small grin on 'anyway'.",
    "s2": N + "Matter-of-fact reveal of the name, then read his quote with amused disbelief.",
    "s3": N + "Casual and pleased, like admitting you went down a rabbit hole.",
    "s4": N + "Genuinely enthusiastic, this is your favourite. Say firstmate as 'first mate'.",
    "s5": N + "Explaining, then a playful voice for the quoted line 'PR ready for review, captain.'",
    "s6": N + "Impressed, easy.",
    "s7": N + "Casual, moving on to the next find, a little impressed on 'One guy wrote almost all of it.'",
    "s8": N + "Easy and friendly, a bit of wow on the number.",
    "s9": N + "Friendly sign-off. Say the address clearly as 'dark horse labs dot dev'.",
}
LINES = [
    ("s1", "This app was built in one Saturday, and its creator said he'd never touch it again. Twenty-six thousand people saved it anyway.", ""),
    ("s2", "That's Andrej Karpathy, one of the founders of OpenAI. He literally wrote, \"I'm not going to support it in any way.\"", ""),
    ("s3", "There's actually a whole site that collects projects like this. It's called Dark Horse Labs, and I went through the list.", ""),
    ("s4", "My favourite one is firstmate. You talk to just one AI, and it runs a whole crew of coding agents for you.", ""),
    ("s5", "Each agent works on its own copy of your project, and when it's done, it reports back like a ship's crew. \"PR ready for review, captain.\"", ""),
    ("s6", "One developer started it in June, and it's already past eight thousand saves.", ""),
    ("s7", "Then there's PocketBase, a whole app backend in a single file. One guy wrote almost all of it.", ""),
    ("s8", "And LocalSend, which is basically AirDrop for any phone and any laptop, no internet needed. Ninety-six thousand people saved that one.", ""),
    ("s9", "The full list is at darkhorselabs dot dev. Send it to a friend who builds things on weekends. Follow for more.", ""),
]
SAY = {
    "s4": "My favourite one is first mate. You talk to just one AI, and it runs a whole crew of coding agents for you.",
    "s9": "The full list is at dark horse labs dot dev. Send it to a friend who builds things on weekends. Follow for more.",
}
PAYOFF = {"s1": "zzz"}   # no chimes
FOLLOW_LINE = None       # the Follow button and cursor are drawn in the scene
SPEED = 1.15
GAP = 0.28
GAP_AFTER = {}
LEAD_IN = 0.1
HOLD = 2.6
CAPTIONS = True
MUSIC = "beat"
MUSIC_GAIN = 0.038
DUCK_RATIO = 1
DUCK_THRESHOLD = 1.0
DUCK_ATTACK = 40
DUCK_RELEASE = 600
SFX_GAIN = 0.16
PRELUDE = ["assets/rough.js", "excal_theme.js"]
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")]
