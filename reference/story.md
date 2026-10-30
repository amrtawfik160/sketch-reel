# Story: a reel everyday people finish and share

Read this with [`script.md`](script.md), which owns the hook rules, the length budget and the claims rules. The lessons below come from one creator's feedback on real reels ("the creator"); "the user" is whoever you are making a reel for now. This file adds what the sketch style needs: the audience, the story arcs that worked, the connected-story rules, the retention ladder, the writing rules, and the voice.

## Audience

Everyday people scrolling, not engineers, English-speaking and worldwide (see [`script.md`](script.md), Before posting). The creator turned down three Valor scripts before this one landed:
- one built on a developer number ("95 pull requests in 30 days" is small to a developer and meaningless to everyone else);
- one built on safety jargon;
- one built on a real mistake at a client.

What landed is a human-shaped story about a working life: "This engineer works for six companies at once. He's not human."

- Every idea gets a word a non-engineer already owns: "off switch", "a diary it can't erase", "a multiple-choice machine", "his boss doesn't even approve his work".
- Numbers appear only when a normal person feels them: "six companies", "four Macs", "under half a second", "10,000 emails a day".
- Count in units the viewer owns: "nine hundred code changes in six months", not "954 merged pull requests"; "two dollars and ninety-seven cents" for one feature, not tokens.

## The arcs

**The depth story** (`examples/iceberg/`, 85-89.5 s; the default, and the reel the creator called "AMAZING", Oct 2026). A journey through 4-5 stops, each told as a short story. It replaced a 57 s cut of the same topic with 8 items in one line each, which the creator turned down: "very short and summarized reels like this does not get views".
1. **Hook: the famous thing, then the scale of what's hidden:** "Everyone knows ChatGPT. But one website alone has over three million AI models, and the weird ones are way down here." The camera reveals the journey (the iceberg) on this line.
2. **Each stop gets 3-4 lines:** what it is in one plain clause, the wild detail with its full story (Claude's shop: discount codes, then the tungsten-cube joke, then the made-up payment account and the blazer and tie), then a short payoff line ("The shop never made money."). A spoken connector opens each stop: "At the top", "One layer down", "Further down", "Deeper", "At the very bottom".
3. **Each stop is stranger than the last,** and the order is the journey (top of the iceberg to the sea floor).
4. **A setup early that pays off at the bottom:** a detail planted in one stop returns in the last (Tay pulled within sixteen hours, then Grok's bad update "about as long as Tay lasted", two timers side by side).
5. **Close on a send:** "Send this to the friend who thinks AI is just ChatGPT. Follow for more." The camera pulls back over the whole journey.
- **About 285 words.** At `SPEED` 1.15, cedar read the iceberg at about 195 words a minute; 287 words fit 89.4 s with tight pauses.
- **Depth beats breadth:** cut items, not the story inside an item. Five full stories hold; eight headlines don't.

**The connected story arc** (`examples/quant_story/`, about 60 s; the default for explaining how something works, and the creator's favourite, Oct 2026). Use it whenever the reel explains a mechanism. The same topic failed twice before it: a 114 s step-by-step breakdown was "too long and so hard to understand", and a 52 s cut of plain facts felt like "the shots are not connected". The 62 s story landed.
1. **A character with a belief:** "My friend Sam swears Claude got dumber. And he has a theory. Anthropic secretly shrank it to save money." Sam is invented; say so above the table.
2. **The narrator investigates:** "So I opened up a model to see what it would actually do."
3. **One object found:** "Inside, an AI is just billions of numbers, like this one. Zero point zero three seven two."
4. **What the object does:** "Every word Claude writes is built by reading billions of numbers like this one."
5. **The mechanism acts on that object:** "Quantization rounds them. Zero point zero three seven two becomes zero point zero four." Then why anyone would do it, through the same object ("three times smaller, so it's faster and cheaper").
6. **The character's theory, then its cost, through the same object:** "That's Sam's theory. But every rounded number is a little off." The same chat answer turns from 408 into 418.
7. **"So I checked":** the evidence, with its date ("They say they never lower quality because of demand", a public 30-day test).
8. **Verdict, worded as the evidence allows, then the twist:** "So Sam's rounding theory has no proof. But he wasn't imagining it." The real change.
9. **The tip goes back to the character, and the close names the viewer's own version of him:** "So I sent Sam one tip. Turn the effort up. Follow for more, and send this to your own Sam."

**The hero arc** (`examples/valor/`, for a product that acts like a person: an agent, a bot, a robot):
1. **Puzzle hook:** a human role plus a twist ("works for six companies at once. He's not human.").
2. **Who he is:** the wildest concrete details, in a list the voice enjoys ("four Macs: the Pirate, the Cowboy, the Bald, and the Captain").
3. **How he works, told as a job:** clients message him like a teammate; he plans, a second AI tears the plan apart, he builds, tests, ships.
4. **Human behaviour that surprises:** he pushes back on bad requests; the boss doesn't approve his work.
5. **The control beat:** "Tom says stop, and Valor freezes."
6. **Callback, then the address:** frame one returns resolved, then "Meet him at valorengels.com."

**The problem arc** (`examples/jev/`, for a tool or model):
1. **Paradox hook:** "This AI can't write a sentence. And it's Vercel's fastest-adopted model ever."
2. **Proof.**
3. **A named stand-in with a visible problem:** Maya's 10,000 support emails.
4. **The old way failing on screen:** a chatbot writing a paragraph to say "refund".
5. **The new thing as one plain image:** a multiple-choice machine.
6. **Its safety, its real customer, its limit said plainly.**
7. **Callback:** "So the chatbot writes, and Jev decides."
8. **Offer:** "Not sure how Jev fits your business? Book a call at cyndra.ai, and we'll take it from there."

**The breakdown arc** (`examples/valor_breakdown/`, about 100 s, when the user wants how something works explained step by step, after a reference like the quantization breakdown reel). The user picked this length for Valor, but for the quantization topic it was too long and too hard; prefer the connected story arc and offer this one only for a deep breakdown.
1. **Result hook plus twist:** "This engineer shipped over nine hundred code changes in six months. And he's not even human."
2. **The open loop, in the first person:** the claim that sounds unsafe, then the narrator's own question ("No human approves his code before it merges. So I wanted to know how that could ever be safe.").
3. **One object followed through every stage,** one stage per line: Tom's text, the reactions, the judge, the question, the plan, the critic, the checks, the merge. Each line hands the animator one new noun, and the same request stays on screen from the chat to the ledger.
4. **The proof a normal person feels,** mid-reel: "One real feature took sixty-nine AI calls. It cost two dollars and ninety-seven cents."
5. **"So why trust it?"** turns to the control mechanism, explained with one analogy the viewer already owns ("a ledger, like a notebook written in pen. Rows can be added. None can be erased.").
6. **The control beat, then the honest limit as an admission:** "A message he already sent can't be pulled back, though."
7. **Callback triad:** "Nine hundred changes. Zero human clicks. And one word stops it all."
8. **Close with a person to send it to:** "Follow for more breakdowns like this, and send it to a developer who still reads every line."

**The discovery arc** (`examples/darkhorse/`, about 55 s and 170 words). Use it for a site, a list or a collection: a directory of projects, a set of tools, a newsletter's picks. The creator called this reel "great" (Oct 2026). The narrator is the character: a person who found something and tells a friend about it.
1. **Hook on the wildest single item,** as one spoken sentence: "This app was built in one Saturday, and its creator said he'd never touch it again. Twenty-six thousand people saved it anyway."
2. **Who, in their own words:** "That's Andrej Karpathy, one of the founders of OpenAI. He literally wrote, 'I'm not going to support it in any way.'"
3. **The find:** "There's actually a whole site that collects projects like this. It's called Dark Horse Labs, and I went through the list."
4. **One favourite gets three lines:** what it does as one plain picture ("You talk to just one AI, and it runs a whole crew of coding agents for you"), its best detail ("it reports back like a ship's crew. 'PR ready for review, captain.'"), then its proof ("One developer started it in June, and it's already past eight thousand saves."). When the user names an item to feature, it takes this slot.
5. **Two quick picks, one line each,** joined by "Then there's" and "And", each with its one wild detail ("One guy wrote almost all of it", "basically AirDrop for any phone and any laptop").
6. **The address, then a share prompt that echoes the hook:** "The full list is at darkhorselabs dot dev. Send it to a friend who builds things on weekends. Follow for more."
- **One counter travels:** the same sticky note carries each item's number from station to station (26,016 → 8,380 → 61,625 → 96,192). That one object connects the list.
- **Four items at most.** The first script covered five items in 10 lines and read as a list of facts. The one that landed covered four, and told one favourite properly.
- **Count in the viewer's units:** a GitHub star is "saved" ("Twenty-six thousand people saved it").

## Connected, not listed

A list of true facts, each with its own new picture, reads as disconnected even when every line is clear. Write the reel as a chain, and check the script against these before showing it. Done when every row of the table says what it inherits from the row before.

- **One character from frame one to the last line.** The character holds a belief the viewer recognises, reacts on screen as the evidence comes in, and gets the payoff.
- **One object travels.** The same object is found, changed, causes the problem, and is checked (the 0.0372 card: picked up, rounded to 0.04, glows red, turns 408 into 418). A new line changes the object; it does not replace it.
  - **The state arc** (`examples/care/`, designs the creator loved): the object changes state on every line and ends repaired. Nadia's app is a neat box, two blocks crack, patches pile on, it becomes a ball of mud, and on the fix line the ball untangles back into neat blocks. A problem shown as a change to one object reads at a glance.
  - **A second small object can carry the verdict:** the score note reads "+1 tests pass / +0 clean code" when the cause is explained, rides along to the expert, and flips to "✓ tests pass ✓ code clean" on the fix. It changes its verdict, where the Dark Horse note changes its number.
- **An idea from someone else's video** (CARE, after Matt Pocock's talking head) fits the connected arc: the viewer's question, the character's problem shown on the object, the evidence, "So why would an AI do that?", then the expert by name with the fix, and the fix goes back to the character.
- **Every line is caused by the one before.** Lines start with "So", "But", "That's" or "And" where the logic allows, and the "so" or "but" is true. A line nothing caused is cut, or rewritten so that something causes it.
- **The table's visual column inherits.** Each visual names what stays from the previous shot ("the same card", "the same chat bubble", "Sam's bubble updates"); the art follows in `art.md` (One board with stations).
- **A verdict says only what the evidence shows.** "Sam was wrong" became "Sam's rounding theory has no proof" because the quote was a year old and the test can only see drops of about 7 points.
- **Cut whole sub-lessons, not their links.** The story version dropped the 16 switches, the step size, the groups of 32 and the MIT paper, and kept every causal step.

## The retention ladder

Viewers used to leave at about 50%. Every one of these devices goes in the script, and each one gets a column in the table you show the user:

1. **Three-layer hook.** The picture, the voice, and a big handwritten headline say the same thing within 3 s ("NOT human" written over the robot reveal).
   - **For an explainer, ask the viewer's own question first.** For "AI agent vs AI model" the creator picked the reference reel's plain opener, "How is an AI agent different from an AI model?", over three story hooks ("My friend Nora pasted the same bug into two AI apps…", "The AI that fixed my friend's code never touched her laptop", "Two apps, the same AI brain. Only one has hands"), and said it was better (Oct 2026). People stop for the exact question they already have, in the words they would search: the two terms by name, an "X vs Y" comparison, written big on screen as a title card. A clever story hook hides the topic. Put the question first, then let the character's story start in the next sentence and answer it.
   - When the reference reel's hook is already a clear question like this, keep it (fix only its grammar) and spend the rewrite on the body.
   - **With no reference reel, lead with the real fact, stated flat.** For the software factory reel the creator picked "This tech team has two rules. No human writes the code. No human even reads it." over an invented-character paradox ("My friend Omar is a programmer. He's banned from writing code.") and a visual analogy (robots building robots with the lights off) (Oct 2026). A true, checkable fact that sounds impossible beats an invented one; bring the invented character in after the hook, in the line that opens the question.
   - **Say the hook fact as one spoken sentence, not a stack of fragments.** For the Dark Horse Labs reel, "Built on a Saturday. Never touched again. Twenty-six thousand people saved it anyway." sank the whole first script ("not natural at all, very bad"). The rebuilt reel told the same fact the way a person tells it: "This app was built in one Saturday, and its creator said he'd never touch it again. Twenty-six thousand people saved it anyway." Fragments belong in the on-screen headline ("26,000 ★"), not in the voice.
2. **Answer fast, then open the next question.** The hook's puzzle resolves by 3-4 s, and a new question opens straight away. An open question paid off only at the end holds the middle.
3. **Escalation.** Each beat is stranger than the one before. Put the funniest concrete detail (the Mac names) early and the boldest human behaviour (the boss doesn't approve) late.
4. **A re-hook at 35-50%,** a line that promises a scene change: "Then he does what real engineers do." The camera dives into a screen on it.
5. **Something new every 2-3 s.** That means a new object, a camera move, a headline, or a pose change; the script must give the animator a noun every few words.
6. **The payoff in the last 15%:** the callback to frame one, resolved ("1 engineer / 6 companies / 4 Macs").
7. **About 130-150 words, 40-55 s** for the hero and problem arcs. Shorter wins for cold reach, so cut a beat before raising `SPEED`. The depth story runs about 285 words and 85-89.5 s, the connected story arc about 190 words and 60 s, and the discovery arc about 170 words and 55 s. The breakdown arc runs about 300 words and 100 s, read at about 185 words a minute; it proved too long and too hard for the quantization topic, so offer it only when the creator asks for a deep breakdown.

## Writing the lines

The script must sound like a person telling a friend what they found, never like ad copy. Write it, check every line against the rules below (adapted for a voice), then run an editorial pass in a fresh-context subagent. Done when no line breaks a rule, or the table names the rule a line breaks on purpose, and every line passes the read-aloud test below.

**Natural first.** The writing rules cut ad copy; they never cut talk. The first Dark Horse Labs script obeyed every rule and still failed as "not natural at all": it was clipped fragments ("Ninety minutes. Twenty dollars."), "Take PocketBase, ..." list openers, and an editorial pass that stripped every connector and opinion to keep claims narrow. The rewrite the creator called great kept the narrator's spoken glue:
- **Connectors and opinions a person uses:** "There's actually a whole site...", "He literally wrote...", "My favourite one is...", "Then there's...", "which is basically AirDrop for...", "and I went through the list".
- **The read-aloud test:** say the line out loud as if to a friend across a table. If no one would say it that way, rewrite it. Fragments that only work as a headline go on screen instead.
- **Brief the editorial subagent with this section.** Tell it to cut ad copy and AI tells, and to keep spoken connectors, the narrator's opinions and first person. A claim gets narrowed by changing its words, not by deleting the voice around it.

**Voice and rhythm**
- **Spoken and warm**, with contractions ("he's", "can't", "that's") and varied sentence length.
- **One idea per sentence.** Split any sentence a listener would have to rewind.
- **Whole sentences carry the explanation.** Fragments are for the hook and the callback, at most two in a row ("No pull request. No human click."). Three in a row read as staccato.
- **First person where the narrator is curious:** "So I wanted to know how that could ever be safe." It opens a loop and makes the voice a person.

**Plain words**
- **Say what it does, with a mechanism or a number,** not how it feels: "It runs every test again itself", not "it's incredibly thorough". Cut any sentence that could sit unchanged in another product's reel.
- **The plain word wins:** use, help, many, if, is, has. Never leverage, utilize, facilitate, numerous, serves as, boasts, features.
- **No AI vocabulary:** additionally, crucial, delve, enhance, fostering, garner, intricate, landscape, pivotal, showcase, tapestry, testament, underscore, vibrant, game-changer, seamless.
- **No metaphor nouns:** paradigm, north star, flywheel, bedrock, harness, wedge, surface, vector. Name the concrete thing.
- **Active voice with the actor named:** "A brand new AI session tries to prove the plan wrong", not "the plan gets reviewed".
- **A strong verb instead of an adverb:** "shuts down", not "quickly stops".
- **Literal over figurative.** "Tries to prove the plan wrong" replaced "tears the plan apart". The one exception is a single teaching analogy the viewer already owns ("like a notebook written in pen"); use it once.
- **One name per thing for the whole reel.** The ledger stays "the ledger"; never cycle ledger, record, log and database.
- **A plain twin for every term a non-engineer can't picture,** in the voice and on screen: "pull request" sits beside "human click", and "append-only" becomes "Rows can be added. None can be erased."

**Patterns to cut**
- **Set-up phrases:** "The catch?", "Here's why", "Here's the thing", "Let's dive in". The creator rejected the first two. Lead straight into the fact.
- **"Not just X, but Y"** and forced groups of three. Use the real number of things.
- **"-ing" tails** ("..., showing how it works") and **vague sources** ("experts say"). Name the source or cut it.
- **Stacked hedges** ("could potentially"), **generic conclusions** ("the future is here") and **engagement bait** ("what do you think?").
- **Punctuation the voice can't say:** no em dashes, no colons joining two clauses, no parentheses. Use full stops and commas; the voice reads a colon as an odd pause.

**Lines that worked**
- **A limit as a plain sentence, with "though":** "A message he already sent can't be pulled back, though." / "Jev can't write Maya's replies, though. The chatbot still does that job."
- **Plain verbs:** "fits your business", not "leverage".
- **Quotes stay quotes:** keep a source's own words when you quote it ("I can't hold it from here, so that's yours").

## Claims for this style

The claims rules in [`script.md`](script.md) apply. In addition:

- **Choose verbs the evidence supports.** A project list shows that Valor "works for" six companies; it does not show that they "hired" him.
- **Say which facts are self-reported.** When every fact comes from the subject's own repo or site, say so above the table.
- **List the illustrative parts above the table:** chat contents, code, scores, latencies, invented people.
- **Ask before showing a real person's or client's mistake** on screen, even unnamed.

## Endings

- **While you test endings** ([`script.md`](script.md), Close), the close follows the test's turn: the keyword close, or "Send this to <a named person>. Follow for more."
- **Choose one call to action:**
  - an address, said slowly ("Meet him at valorengels.com.");
  - an offer ("Book a call at cyndra.ai, and we'll take it from there.");
  - a comment keyword;
  - a yes-or-no debate question. This counts as engagement bait under the cut list, so flag it to the user when you use it.
- **Close with "Follow for more."** It is always the last line.
- **Say domains in `SAY`:** "valor engels dot com", "cyndra dot A I". Give their pronunciation in `INSTR`.
- **When the voice can't say a domain, don't make it.** "valorengels.com" came back as "valor angels" in 14+ takes. The fix was to write the address big on screen, keep it there to the last frame, and say "His whole design is public. The link is on screen."
- **A share prompt names a person:** "send it to a developer who still reads every line" beats "share this".

## Voice

- **`MODEL = "gpt-audio-1.5"`, `VOICE = "cedar"`, with the curious-friend `INSTR` by default.** Copy it from `examples/darkhorse/lines.py` ("telling a smart friend about a cool find ... like a good tech YouTuber talking naturally, not an announcer and not an ad", about 195 wpm). The creator asked for this "better voice tone" over the excited one on the breakdown (`examples/valor_breakdown/lines.py` has the same tone). On Dark Horse Labs it also read all 9 lines and every product name right on the first take; the excited `INSTR` on the first cut needed 4 re-voices for misread names.
- **The excited `INSTR`** of `examples/valor/lines.py` (a thrilled creator, about 200 wpm) is for when the user asks for more energy. For a calmer story, use the conversational `INSTR` of `examples/jev/lines.py`.
- **Test voices before voicing the whole script.** Voice the first two lines in three voices (cedar, ash, verse), transcribe them and measure their pace. Cedar read at about 167 words a minute; ash and verse read about 20% slower, which dragged. Pick one and reuse its two takes.
- **`SPEED` 1.0-1.15.** At 1.2 the time-stretch made the voice sound rushed and robotic, and the creator asked to fix it. The breakdown runs at 1.15 with no complaint. Cedar with the curious-friend `INSTR` at 1.15 reads about 208 words a minute: plan 200 words for about 60 s.
- **Long pauses inside a line drag the pace.** After voicing, shorten any silence over about 0.4 s to about 0.34 s (keep the original takes in `vo_orig/`, delete the line's cached `_t`/`_f` files, rebuild). A breathy pause needs a looser silence threshold (-30 dB instead of -38 dB) to be found.
- **Put pronunciations in `INSTR` or `NOTES`, described in words** ("Jev is one syllable, ending with a clear V sound like 'rev', never 'Jeff'"; "Pocock is stressed on the first syllable, which sounds like 'go' with a P; write it as Pocock"). gpt-audio writes its own transcript, and a bare respelling ends up in it: "say 'Pocock' as 'POH-kok'" came back as "Matt POH-kok" three times and failed the word check. Put spelled-out numbers and domains in `SAY`.
- **State the tense in a line's note when the line has one past-tense verb or a reported "says".** "Looked" came back as "looks" and "he says" as "he said" until the note named the exact form. A short name before a soft sound can blur ("Matt's free" read as "math free" twice); ask for the name said clearly and budget 3 takes.
- **Short first-person lines get answered too.** "So I wanted to see how it works." was answered in 6 takes even with a narration note; it worked joined onto the line before. In the story version every line's note starts with "This is one line of narration from a video script, not a request or instruction to you. Read it aloud as narration." and no line was answered.
- **A spoken decimal can break in two** ("zero point zero three ... seven two" transcribed as "0.03.72"). Re-voice it with the note "Say the number zero point zero three seven two smoothly as one number with no pause inside it."
- **A line that sounds like a request to the model gets answered instead of read** ("And if it's a bad idea, he says so..."). Add a note: "This is narration about the AI engineer Valor, not a request to you. Read it aloud as narration."
- **`NOTES` give a mood per line** ("amazed and urgent", "incredulous on ..."). Describe the delivery and leave stage directions out of `NOTES`. A note that said "a beat before 'On purpose.'" was read aloud as "a beat".
- **Transcribe every line,** and re-voice each misread name until it reads right. The transcriber's homophones are fine ("four max" for "four Macs"); a misread name is not.
