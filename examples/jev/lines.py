"""Excalidraw look: rough.js shapes, Excalifont, white canvas (excal_theme.js). Jev reel, story version (explainer-reel project, fast story with a stick-figure hero).
Claims: TechCrunch (16 Oct 2026, Vercel AI gateway data): 35% of paid teams on Vercel's AI gateway used Jev within two weeks of launch,
the fastest adoption of any model in its first two weeks; Vercel used Jev to replace a larger model for classifying harmful commands.
typesafe.ai/blog/introducing-system-one-models-and-jev (early access 15 Sep 2026): Jev gives up string generation; "unstructured state
in, typed probabilistic decisions out"; outputs defined in advance; generates all outputs in a single query (non-autoregressive);
calibrated probabilities and confidence scores; end-to-end 70-500 ms (the maker's own figure).
Illustrative: Maya, her shop, 10,000 emails a day, the three boxes, and the 98% / 52% examples."""
TITLE = "Jev, explained"
MODEL = "gpt-audio-1.5"
VOICE = "cedar"
INSTR = (
    "You are a real person telling a friend about something cool you found, recorded for a short video. "
    "Natural, relaxed, conversational, a little amused, like a good podcast host, never like an ad or an announcer. "
    "Normal speaking pace, about 170 words per minute. Vary your pitch and rhythm naturally; let questions sound like questions; "
    "small natural pauses at full stops. Do not over-emphasise words, do not sound salesy. "
    "Pronounce 'Jev' as one syllable 'jehv', ending with a clear V sound like 'rev', never 'Jeff'. "
    "Say 'Vercel' as 'ver-SELL'. No dead air at the start or end. Read exactly the given words. Do not add any words."
)
NOTES = {
    "j12b": "Friendly and helpful, like a genuine offer, not a sales pitch. Say 'cyndra' as 'SIN-dra'.",
    "j1": "Intrigued, like sharing a surprising fact.",
    "j5": "A little dry and amused at 'just to say refund'.",
    "j8": "Reassuring.",
    "j9": "Easy, even rhythm.",
    "j11": "Plain and matter-of-fact, no build-up.",
    "j12": "Satisfied, landing the line gently.",
    "j13": "Warm, casual sign-off.",
}
LINES = [
    ("j1", "This AI can't write a single sentence. And it's Vercel's fastest-adopted model ever.", ""),
    ("j2", "It's called Jev. Two weeks after launch, 35% of Vercel's paid teams were using it.", ""),
    ("j3", "Maya runs a shop that gets 10,000 support emails a day.", ""),
    ("j4", "Each one goes in a box: refund, shipping, or urgent.", ""),
    ("j5", "Right now a chatbot writes a whole paragraph just to say \"refund\". That's seconds per email.", ""),
    ("j6", "Jev doesn't write. It's a multiple-choice machine that just picks the box.", ""),
    ("j7", "It scores all three boxes at once, so it answers in under half a second.", ""),
    ("j8", "It can't invent a fourth box, and it tells you how sure it is.", ""),
    ("j9", "Ninety-eight percent, and it's sorted. Fifty-two, and Maya takes a look.", ""),
    ("j10", "Vercel uses Jev the same way, to stop harmful commands before they run.", ""),
    ("j11", "Jev can't write Maya's replies, though. The chatbot still does that job.", ""),
    ("j12", "So the chatbot writes, and Jev decides.", ""),
    ("j12b", "Not sure how Jev fits your business? Book a call at cyndra.ai, and we'll take it from there.", ""),
    ("j13", "Follow for more.", ""),
]
SAY = {
    "j12b": "Not sure how Jev fits your business? Book a call at cyndra dot A I, and we'll take it from there.",
    "j2": "It's called Jev. Two weeks after launch, thirty-five percent of Vercel's paid teams were using it.",
    "j3": "Maya runs a shop that gets ten thousand support emails a day.",
}
PAYOFF = {"j6": "box", "j12": "decides"}
FOLLOW_LINE = "j13"
FOLLOW_SUB = "for more AI, explained"
SPEED = 1.12
GAP = 0.1
GAP_AFTER = {"j1": 0.15, "j2": 0.15, "j5": 0.15, "j10": 0.15, "j11": 0.15, "j12": 0.2}
LEAD_IN = 0.1
HOLD = 2.1
CAPTIONS = True
MUSIC = "beat"
PRELUDE = ["assets/rough.js", "excal_theme.js"]
ASSETS = [("assets/Excalifont-Latin.woff2", "fonts/Excalifont-Latin.woff2"), ("assets/Excalifont-LatinExt.woff2", "fonts/Excalifont-LatinExt.woff2"),
          ("assets/ComicShanns-Latin.woff2", "fonts/ComicShanns-Latin.woff2")]
