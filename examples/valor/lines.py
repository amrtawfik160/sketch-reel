"""Valor reel: one AI engineer working for six companies (dark Excalidraw style like the Jev reel).
Claims, all from github.com/tomcounsell/ai (checked 22 Oct 2026):
- projects/*.toml: 13 project specs, each naming a client; the companies among them are client-a, client-b, client-c, client-d,
  client-e, client-f (six; "counsell" is Tom's own home project). Machines named "Valor the Pirate/Cowboy/Bald/Captain".
- docs/machine.md: "Valor has four Macs, one per client"; "The hard boundary between clients is the Mac and the accounts on it".
- docs/business.md: "Valor works across many of them at once."
- docs/performers.md: Valor's accounts are its own (valor@••••••, its own memberships), "never acts as Tom".
- projects/README.md + docs/bridges: tasks start from Telegram, Slack and email chats, including team chats.
- README + docs/sdlc-state-machine.md + tour: plan, a fresh reviewer critiques the plan, build, checks, merge.
- persona/conduct.md: "When inspection says the request should not be built as stated, say so first."
- docs/plans/valor-rebuild-feedback.md (Tom): "the human also doesn't even get merge taps"; README: "brings back only the decisions that need him".
- README: stop is immediate; every request after a stop is refused. Tom's documents call Valor "he".
Wording "works for", not "hired by": the specs show client work, not contracts."""
TITLE = "Valor, the AI engineer"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are an excited, high-energy creator telling your followers about something genuinely mind-blowing you just found. "
    "Thrilled, fast, punchy, with real amazement in your voice and natural rises and falls, like the best viral reels, "
    "but still a real human, never a cheesy announcer or an ad. About 200 words per minute, almost no pauses between sentences. "
    "Say 'Valor' as 'VAL-er'. Say 'valorengels.com' as 'valor engels dot com' with 'engels' as 'ENG-gulz'. "
    "No dead air at the start or end. Read exactly the given words. Do not add any words."
)
NOTES = {
    "v1": "Hook: amazed and urgent; land 'He's not human.' with a jaw-drop beat.",
    "v2": "Delighted, rattle off the four Mac names with growing amusement.",
    "v5": "Leaning in, building suspense.",
    "v6": "Rapid-fire, excited, like a montage.",
    "v8": "Incredulous on 'Tom doesn't even approve his merges.'",
    "v10": "Serious for a second, firm on 'Valor freezes.'",
    "v11": "Slow, three punchy beats, awed.",
    "v12": "Warm, clear, inviting.",
    "v13": "Warm, casual sign-off.",
}
LINES = [
    ("v1", "This engineer works for six companies at once. He's not human.", ""),
    ("v2", "His name is Valor. He has his own email, his own GitHub, and four Macs: the Pirate, the Cowboy, the Bald, and the Captain.", ""),
    ("v3", "Each Mac belongs to one client, so their work never mixes.", ""),
    ("v4", "Clients message him in Slack or Telegram, like any teammate.", ""),
    ("v5", "Then he does what real engineers do.", ""),
    ("v6", "He plans the job. A second AI tears the plan apart. He builds it, tests it, and ships it.", ""),
    ("v7", "If the request is a bad idea, he says so first.", ""),
    ("v8", "His creator, Tom, treats him like a senior engineer. Tom doesn't even approve his merges.", ""),
    ("v9", "He only brings Tom the decisions that really need him.", ""),
    ("v10", "And if anything goes wrong, Tom says stop, and Valor freezes.", ""),
    ("v11", "One engineer. Six companies. Four Macs.", ""),
    ("v12", "Meet him at valorengels.com.", ""),
    ("v13", "Follow for more.", ""),
]
SAY = {"v12": "Meet him at valor engels dot com."}
PAYOFF = {"v1": "human", "v11": "macs"}
FOLLOW_LINE = "v13"
FOLLOW_SUB = "for more AI, explained"
SPEED = 1.08
GAP = 0.08
GAP_AFTER = {"v1": 0.15, "v5": 0.1, "v10": 0.15, "v11": 0.2, "v12": 0.2}
LEAD_IN = 0.1
HOLD = 2.1
CAPTIONS = True
MUSIC = "beat"
PRELUDE = ["assets/rough.js", "excal_theme.js"]
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")]
