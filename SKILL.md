---
name: sketch-reel
description: Make a vertical 9:16 reel in the Excalidraw sketch style - hand-drawn rough.js shapes that boil, Excalifont handwriting, a light whiteboard (or dark, or both mixed by section) the camera travels across, detailed hand-drawn app cards with real logos, a hand-drawn hero (robot, stick figure, submarine), word-by-word captions, a natural human voice, and a plain-spoken story told in depth (by default about 90 s, a few items each told as a short story; also a 60 s connected story, a 55 s discovery story, a 45 s hero or problem story, or a 100 s breakdown). Use when the user asks for an Excalidraw, whiteboard or sketch-style reel, short or explainer video, an iceberg or deep-dive reel, or to fix such a reel.
---

# Sketch reel

A 1080×1920, 60 fps reel that looks like someone drawing a story live on an Excalidraw board. It runs about 85-89.5 s for a depth story (the default), about 60 s for a connected story, about 55 s for a discovery story, 40-55 s for a hero or problem story, and about 100 s for a breakdown. [`reference/look.png`](reference/look.png) shows the older dark look.

**The default direction: light, detailed, deep.** [`examples/iceberg/`](examples/iceberg/) is the reel the creator called "AMAZING" and asked every reel to follow (Oct 2026; "the creator" is the person these reels were made for). It is "The AI model iceberg", 89.4 s, in light mode. A submarine sinks through 5 layers. Each layer is a short story of 3-4 lines: what it is, the wild detail, the payoff. Each model sits on a detailed hand-drawn app card with its real logo. The creator rejected a 57 s cut of the same reel with one line per model: "very short and summarized reels like this does not get views". So by default:
- **Light mode** (`LT`, a white board), unless the user asks for dark.
- **About 85-89.5 s, depth over breadth:** 4-5 items, each told as a 3-4 line story, not 8 items in one line each ([`reference/story.md`](reference/story.md), The depth story).
- **Detailed UI on every beat:** real logos, app windows with real-looking content, receipts, newspapers, chats, stamps ([`reference/art.md`](reference/art.md), Detailed UI cards).
- **A visual journey the camera follows** (down an iceberg, across a board), with a progress device such as a depth meter.

Everything it needs is in this folder:
- `pipeline/` turns a project folder into a HyperFrames composition, and handles voice, timing, captions, music and checks;
- `assets/` holds the theme, rough.js and the fonts;
- `reference/` holds the method;
- `examples/` holds seven finished reels to start from.

| Example | Arc | What it shows |
|---|---|---|
| [`examples/iceberg/`](examples/iceberg/) | depth story, 89.4 s, light | The default. A submarine sinks through 5 layers of an iceberg, a depth meter fills, each layer is a 3-4 line story on detailed app cards with real logos. The newest, and the best starting point. |
| [`examples/care/`](examples/care/) | connected story, 61 s, dark | An idea from someone else's video retold as our story. One app box changes state on every line (cracks, patches, a ball of mud, neat again), a score note carries the verdict, the camera dives into the robot's head, and the board has four columns. |
| [`examples/darkhorse/`](examples/darkhorse/) | discovery, 54 s | A narrator telling a friend about a list of open-source projects: one favourite in three lines, one star-count note carried from station to station, a race-track progress line. |
| [`examples/quant_story/`](examples/quant_story/) | connected story, 62 s | One character (Sam), one number card carried through every shot, one board of six stations, a tilt from the dark row to the light row, a pull-back recap. |
| [`examples/valor/`](examples/valor/) | hero, about 50 s | An AI engineer told as a person, with a hand-drawn robot hero. |
| [`examples/jev/`](examples/jev/) | problem, about 50 s | A shop-owner stand-in, the old way failing, the new tool as one plain picture, an offer ending. |
| [`examples/valor_breakdown/`](examples/valor_breakdown/) | breakdown, 102 s | One request followed through every stage, with light and dark boards and a wipe between them. |

Read each reference before the step that needs it:
- [`reference/script.md`](reference/script.md) and [`reference/story.md`](reference/story.md) before the script: the hook, the arcs, the retention ladder, the writing rules, the claims rules, the voice.
- [`reference/art.md`](reference/art.md) and [`reference/motion.md`](reference/motion.md) before writing scenes: the look, the board, the characters, the animation system, and the glitches already found and fixed.
- [`reference/pipeline.md`](reference/pipeline.md) before step 3: setup, every command, the scene contract.

## Steps

1. **Research.** Read the primary source: repo files (with `gh api` or a clone), the product site, the docs. Then hunt for the facts an everyday viewer finds wild, funny or slightly scary: what the subject did, names it uses, mistakes it made, money, who uses it.
   - Collect the full story behind the best facts, not just the headline number. Project Vend gave the discount codes, the tungsten cubes, the made-up account and the blazer, not only "lost money".
   - When the user names a reference reel, download it (`uvx yt-dlp`), transcribe it, and match its style, not its script.
   - When YouTube answers "Sign in to confirm you're not a bot" (it blocks many servers, in a browser too), read the video through a Piped mirror. `curl https://api.piped.private.coffee/streams/<id>` returns the title, the description, a video stream and the caption tracks; fetch the `en` track's TTML for the transcript.
   - When every mirror is blocked too, get the title from `https://www.youtube.com/oembed?url=<url>&format=json`. Build your own reel from the title's idea, and tell the user they can send the file for a closer match.
   - A remake of someone else's video tells the idea as your own story, credits the person by name in the script, and never reuses their wording.
   Done when you hold 10+ ranked facts, each with a quote and a source, you know which are self-reported, and you hold a real photo or logo for every person and product the script names ([`reference/art.md`](reference/art.md), Light and dark boards).

2. **Story and script** → `lines.py`, written with [`reference/script.md`](reference/script.md) and [`reference/story.md`](reference/story.md).
   - Pick the arc: the depth story by default (about 90 s, a few items each told as a short story), the connected story for one mechanism, the discovery arc for a site, a list or a collection, the hero arc for a product that acts like a person, the problem arc for a tool, the breakdown only when the user asks for a deep step-by-step.
   - Check the script against the arc's rules and every line against the writing rules, including "Natural first".
   - Run an editorial pass in a fresh-context subagent. Brief it with the "Natural first" and writing rules in `story.md`, so that it cuts ad copy and AI tells and keeps the spoken connectors and the narrator's opinions.
   - Read every line aloud.
   - Show the user 3 hooks (A-C, with your pick). When the reference reel opens with the viewer's own question, that question is option A (see the hook rule in [`reference/story.md`](reference/story.md)). Then show the table: voice, visual and retention device for each line.
   Done when the user approves.

3. **Project.**
   1. Do the one-time setup in [`reference/pipeline.md`](reference/pipeline.md).
   2. Make `<proj>/`. Copy `assets/excal_theme.js` to `<proj>/excal_theme.js`, and copy `assets/rough.js` and `assets/fonts/*.woff2` to `<proj>/assets/`.
   3. Copy the settings block of the example that matches the arc (`examples/iceberg/lines.py` for a depth story, `examples/quant_story/lines.py` or `examples/care/lines.py` for a connected story, `examples/darkhorse/lines.py` for a discovery story, `examples/valor/lines.py` for a hero story, `examples/valor_breakdown/lines.py` for a breakdown): `MODEL`, `VOICE`, `INSTR` and its shape, `SPEED`, the gaps, `CAPTIONS = True`, `MUSIC = "beat"`, `PRELUDE`, `ASSETS`.
   Done when `make_reel.py` builds with the stub `function scene(ctx) { return {}; }` and the frame shows the canvas in the reel's theme.

4. **Voice and timing**, by [`reference/pipeline.md`](reference/pipeline.md) (Voice, Timing) and the voice rules in [`reference/story.md`](reference/story.md). Re-voice any line whose transcript misreads a name (Jev as "Jeff", Vercel as "Bercel") until it reads right; up to 3 tries per line is normal. Done when every line transcribes word for word at `SPEED` ≤ 1.15, and the final file fits its length:
   - A depth story runs about 85-89.5 s, never over 89.5 s, because Facebook Reels refuse anything over 90 s (a 93.6 s reel had to go to Facebook as a plain video post).
   - To fit, tighten the pauses inside lines to about 0.26 s (`tighten.py`), `GAP` to about 0.12 s and `HOLD` to about 1 s (the iceberg's settings) before you cut words.
   - The other arcs keep their lengths: about 60 s connected, about 55 s discovery, 40-55 s hero or problem, and about 100 s breakdown, which goes to Facebook as a plain video.
   - On YouTube, a Short over 60 s with a copyright claim is blocked. The generated music keeps that risk low.

5. **Scenes** → `scenes.js` and `sfx.py`. Start from the example that matches the arc:
   - `examples/iceberg/` for a depth story. `build_scenes.sh` joins `src_build/` into `scenes.js`: `src_build/head.js` maps the stations, and `src_build/story_body.js` holds the iceberg, the submarine and depth meter, and the detailed cards.
   - `examples/care/` for a connected story whose object changes state: a fourth board column, the head dive.
   - `examples/darkhorse/` for a discovery story, or `examples/quant_story/` for a connected story. In all four, `build_scenes.sh` joins a head, the generated `caps_gen.js`, the toolkit, and the story into `scenes.js`. They add the station board, measured word times, and the travelling object.
   - `examples/valor_breakdown/scenes.js` for wiped light and dark sections (`THEME_SW`, `CAPFIX`, the wipe).
   - `examples/valor/scenes.js` for a hero story.
   Keep the toolkit block, and replace the story code:
   - guarded actors, and `tw`/`op` tweens;
   - rough.js `mk`/`rr`/`rline`/`rpath`/`rell`/`arrow`;
   - `drawIn`, `note`, `typeOn`/`typeLines`, `scribble`, `headline`, `splat`;
   - the figure system, `win`/`laptop`;
   - the camera queue and the boil clock.
   Lay the beats out on one board ([`reference/art.md`](reference/art.md)), time every beat to a word, and follow [`reference/motion.md`](reference/motion.md). Done when every beat in the approved table exists and fires on its word, and `sfx.py` is written. Without it, `make_reel.py` builds a silent effects track and gives no warning. A late `sfx.py` needs only an audio remux: `ffmpeg -i video -i mix -map 0:v -map 1:a -c:v copy`.

6. **Build, review, render, deliver**, by [`reference/pipeline.md`](reference/pipeline.md) (Build and check, Render) and the Review checks in [`reference/motion.md`](reference/motion.md).
   - After every render, a newly spawned subagent that has not seen your reasoning reviews it independently. Spawn a new one each round: a resumed reviewer once re-sent its old report without looking.
   - Pick the cover: the first frame that shows the hook complete. When that comes after 3 s, for example because a number is still counting up, say which frame and why.
   - Before delivering, look at 8 frames spread across the reel yourself. Tell the user about any near-empty frame, faded caption or weak first frame.
   - Deliver the MP4 and the cover PNG to the folder the user names. Upload or post them only when the user asks.
   Done when the check, the side check, the transcript and a full sheet pass are all clean.
