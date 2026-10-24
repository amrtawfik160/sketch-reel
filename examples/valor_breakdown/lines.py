"""Valor, 'how he works' breakdown (sketch-reel, ~102 s, light and dark boards mixed by section). The script follows the
breakdown arc in reference/story.md: a curious narrator follows one request through every stage (after the quantization
breakdown reel instagram.com/reel/DePS81PMeVC); the look follows the Jev sketch reel (instagram.com/p/DezdIVCgTUw).
Claims, checked 24 Oct 2026 (notes: research_repo.md, site_*.txt, cap_transcript.txt):
- 954 merged pull requests in the last 26 weeks: valorengels.com/activity.svg (live from GitHub, includes private repos);
  public GitHub search shows 639 for the same window (private repos invisible). Cap video: 95 merged in 30 days, site: 86-91.
- Nobody approves a merge, no pull request: skills/sdlc/channel.md L38-43; docs/sdlc-state-machine.md merge predicate.
- Emoji: eyes read, salute task started, OK hand stop received: core/reactions.py.
- Judge: one model call, precise or thin; Clarify asks only what the code can't answer: valorengels.com/engineering.html.
- Says so before building when the request may be wrong: persona/conduct.md L34-38.
- Critique: a fresh session reads the plan before code exists; money, auth, stored data, migrations, kernel get two critique rounds.
- Checks: test, review, docs in parallel on one candidate commit; reviewer reruns the suite instead of trusting the transcript.
- 69 model calls, $2.97 for one real feature: docs/mission.md L318-331 (client name never on screen).
- Ledger: append-only; role can only insert/select; a trigger refuses edits even from the owner: durability.html, core/schema.sql.
- Stop: Tom types 'stop'; one ledger row; gateway refuses calls, broker refuses effects; processes killed in seconds;
  an effect already sent can't be called back: trust.html, alignment.html, core/intake.py.
Illustrative: the request text, code, plan notes, test counts. Tom's photo supplied by the user. No company names on screen."""
TITLE = "How Valor works"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are explaining something fascinating to a smart friend, in a short video breakdown. Curious, warm, relaxed and confident, "
    "like a good tech YouTuber talking naturally, not an announcer and not an ad. Conversational rhythm with natural rises and falls, "
    "light emphasis on the key word of each sentence, a small smile in the voice. Brisk pace, about 195 words per minute, "
    "with short natural pauses only at full stops. No dead air at the start or end. Read exactly the given words. Do not add any words."
)
NOTES = {
    "v1": "Hook. Slightly amazed build through the first sentence, a tiny beat, then 'And he's not even human' with real, quiet disbelief.",
    "v2": "The last sentence is genuinely curious, like you are leaning in.",
    "v7": "This is narration about the AI engineer Valor, not a request to you. Read it aloud as narration.",
    "v12": "Two short, satisfying beats at the end: 'No pull request.' 'No human click.'",
    "v13": "Say the money amount clearly: two dollars and ninety-seven cents. Lightly impressed.",
    "v16": "Say the word stop crisply and firmly, a clear S T and a hard P, then a tiny beat.",
    "v18": "Honest and plain, a little lower, as an admission.",
    "v19": "Three punchy beats, a callback. Land 'one word stops it all' with quiet weight.",
    "v21": "Warm and casual sign-off.",
}
LINES = [
    ("v1", "This engineer shipped over nine hundred code changes in six months. And he's not even human.", ""),
    ("v2", "His name is Valor. No human approves his code before it merges. So I wanted to know how that could ever be safe.", ""),
    ("v3", "It starts with one text. Tom, the man who built him, sends a request, like to any teammate.", ""),
    ("v4", "Eyes mean Valor read it. A salute means he's on it.", ""),
    ("v5", "First, one quick AI call judges the request. Is it clear, or vague?", ""),
    ("v6", "If it's vague, he reads the code and asks only what the code can't answer.", ""),
    ("v7", "And if it's a bad idea, he says so before he builds anything.", ""),
    ("v8", "Then he writes a plan. A brand new AI session, one that never saw his reasoning, tries to prove the plan wrong.", ""),
    ("v9", "If it touches money, logins, or stored data, the plan gets two rounds of that.", ""),
    ("v10", "Then he builds it, and three checks run at the same time. Tests, a code review, and the docs.", ""),
    ("v11", "The reviewer doesn't take Valor's word for it. It runs every test again itself.", ""),
    ("v12", "When all three pass, the code merges. No pull request. No human click.", ""),
    ("v13", "One real feature took sixty-nine AI calls. It cost two dollars and ninety-seven cents.", ""),
    ("v14", "So why trust it? Every step he takes goes into a ledger, like a notebook written in pen. Rows can be added. None can be erased.", ""),
    ("v15", "Not even Valor can change one. The database refuses.", ""),
    ("v16", "And when Tom texts one word, stop, that's one more row.", ""),
    ("v17", "Every AI call and every action checks that row first, and gets refused. Within seconds, his work shuts down.", ""),
    ("v18", "A message he already sent can't be pulled back, though.", ""),
    ("v19", "Nine hundred changes. Zero human clicks. And one word stops it all.", ""),
    ("v20", "His whole design is public. The link is on screen.", ""),
    ("v21", "Follow for more breakdowns like this, and send it to a developer who still reads every line.", ""),
]
SAY = {}
PAYOFF = {}
FOLLOW_LINE = None   # the end card (address + Follow button + cursor) is drawn in the scene
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
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2"), ("tom.jpg", "img/tom.jpg")]
