# Script: hook, shape, length, claims

What a short vertical reel (Instagram Reels, TikTok, Shorts) says, and in what order. Watch time decides reach, and the first 3 seconds decide watch time, so the hook gets more work than any other line. The default length is about 85-89.5 s, the sketch style's depth story. A 57 s cut that summarised 8 items in one line each was turned down: "very short and summarized reels like this does not get views". Whatever the length, tell fewer items in more depth. Read this with [`story.md`](story.md), which adds the sketch-style arcs, the retention ladder and the writing rules.

## Ideas

When the user asks for ideas, research 5 candidates and show them as A-E, each with its hook, its proof number, its honest limit, and your pick. A strong candidate has all four of these:
- a famous name or big stakes;
- a concrete, surprising event or claim;
- one proof number from a primary source (GitHub stars from the API, a dated news report);
- something the viewer can get today (free, open source, a link to send).

## Hook

Write 3 hooks, one per mechanism, and let the user choose. Give each option an honest case and mark your pick:
- **direct:** the consequence, stated flat ("One free AI plugin crashed Wall Street's legal giants in a day.");
- **curiosity gap:** a cause that sounds impossible ("Wall Street lost its mind over a free text file.");
- **name first:** the famous name plus the event ("Anthropic dropped 11 free plugins, and legal stocks crashed.").

The hook states the result, never the setup, in under 3 s. A hook that opens on the cause makes the viewer wait 5 s for the reason to care. Time compression sharpens it: "in a day", "in four months", "overnight". Say it as one spoken sentence; `story.md` (the retention ladder) has the rule and the case.

**The hook line and frame one are one unit.** Write the frame into the visual column:
- frame one shows the result already happening: the number counting up, the hero reacting;
- the cause arrives on its word, and each strong word gets a physical event (a drop, a stamp, a shake);
- something moves from frame one, a slow pull-back at least; never a still frame;
- the voice starts at 0.0 s, with the hook picture already on screen. Aim for at least 70% of viewers still watching at 3 s; measure that 3-second hold in your analytics tool for every reel. In the creator's reels the sketch style held noticeably more viewers at 3 s than the other styles did. A study of Reels found that speech in the first 3 s kept about 25% more viewers at 10 s than music alone.

**Built to be sent.** Sends (shares by direct message) are Instagram's top signal for reaching non-followers. The reels that drew the most saves and shares gave the viewer something free to use today. Every reel gives one concrete thing the viewer can use, and names the person to send it to.

## Shape

One beat per line, with a new fact or picture every 3-5 s. The arcs in `story.md` order the beats for each kind of reel. Every reel shares these parts:
1. **Hook** (line 1).
2. **Setup with proof:** what happened, when, and the number.
3. **An open loop:** a line that promises the explanation.
4. **The body,** told through one character or one object the viewer can follow.
5. **The honest limit,** said as a plain sentence ("Jev can't write Maya's replies, though."). It buys trust. Check what a limit claims as hard as any number.
6. **Callback:** the hook's picture returns, resolved.
7. **Close:** one call to action, then "Follow for more." as the last line.
   - **Test the ending.** Meta's rules count "comment this word" as engagement bait, which may keep a reel from non-followers on Instagram and Facebook. Run a test over 4 reels: reels 1 and 3 keep a keyword close ("Comment KEYWORD and I'll send you the link."); reels 2 and 4 close on a send ("Send this to <a named person who needs it>. Follow for more."), with no keyword and no link promise.
   - Keep a log with one row per reel. Compare views from non-followers, not total views. When the log holds 4 reels, report the result and make the winner your default.

## Length

- **The depth story (the default): about 285 words for 85-89.5 s,** never over 89.5 s, because Facebook Reels refuse anything over 90 s. [`story.md`](story.md) (The depth story) has the shape.
- **About 150 spoken words for 50 s** for the shorter hero and problem arcs. The voice model is asked for about 200 words a minute but reads about 175-190.
- After voicing, the measured pace sets the length, not the estimate. When the reel runs long, trim the gaps first, raise `SPEED` up to 1.15 at most, then offer the user a cut of one named line.

## Claims

- **Two sources for every number.** When they disagree, leave the number out. When the story needs it, use the conservative figure, and tell the user both numbers in a warning above the script.
- **Say only what a source states.** A total nobody reports stays out, however good it sounds. A precise-sounding word is a claim too: say "many" when the source gives no number, "about 4,300" when it gives 4,288, and keep the source's own hedge ("nearly", "almost 20%"). Compute any math in code.
- **Characters can be invented; numbers are real.** Say so to the user when a character is invented.
- **Dates and counts come from primary data:** stars and creation dates from the GitHub API, release dates from the vendor or a dated news report.
- **Record the sources** in the docstring of `lines.py`, each number with its date (see `examples/darkhorse/lines.py` and `script.md`).

## Show it

Show the user a table with one row per line: the voice, a one-line visual, and the retention device. Above the table, each on its own line, list every choice the user may want to change: an invented character, a real person's name, a number with two sources, a call to action. Wait for approval before voicing.

## Before posting

- **The caption's first line names the tool or topic** in the words people search ("Agent Reach", "Claude Code"), so platform search can find it.
- **Use 3-5 hashtags.** Instagram allows at most 5 per post.
- **For a keyword reel,** remind the user to set the comment auto-reply to the reel's KEYWORD, and give them the exact link it should send.

**The audience** is English-speaking people worldwide who are curious about AI tools. Growth has to come from non-followers, which is why the first 3 seconds and sends decide reach.
