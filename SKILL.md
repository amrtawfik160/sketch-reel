---
name: sketch-reel
description: Make a vertical 9:16 reel in the Excalidraw sketch style - hand-drawn rough.js shapes that boil, Excalifont handwriting, a whiteboard the camera travels across (dark, or light and dark boards mixed by section), a hand-drawn hero (robot or stick figure), word-by-word captions, a natural human voice, and a plain-spoken story built to hold viewers past the halfway point (a 60 s character-and-object story on one board, a 55 s discovery story about a site or list, a 45 s hero or problem story, or a 100 s breakdown). Use when the user asks for an Excalidraw, whiteboard or sketch-style reel, short or explainer video, or to fix such a reel.
---

# Sketch reel

A 1080×1920, 60 fps reel that looks like someone drawing a story live on an Excalidraw board. It runs about 60 s for a connected story, about 55 s for a discovery story, 40-55 s for a hero or problem story, and about 100 s for a breakdown. [`reference/look.png`](reference/look.png) shows the look.

Everything it needs is in this folder:
- `pipeline/` turns a project folder into a HyperFrames composition, and handles voice, timing, captions, music and checks;
- `assets/` holds the theme, rough.js and the fonts;
- `reference/` holds the method;
- `examples/` holds five finished reels to start from.

| Example | Arc | What it shows |
|---|---|---|
| [`examples/darkhorse/`](examples/darkhorse/) | discovery, 54 s | A narrator telling a friend about a list of open-source projects: one favourite in three lines, one star-count note carried from station to station, a race-track progress line. The newest, and the best starting point. |
| [`examples/quant_story/`](examples/quant_story/) | connected story, 62 s | One character (Sam), one number card carried through every shot, one board of six stations, a tilt from the dark row to the light row, a pull-back recap. |
| [`examples/valor/`](examples/valor/) | hero, about 50 s | An AI engineer told as a person, with a hand-drawn robot hero. |
| [`examples/jev/`](examples/jev/) | problem, about 50 s | A shop-owner stand-in, the old way failing, the new tool as one plain picture, an offer ending. |
| [`examples/valor_breakdown/`](examples/valor_breakdown/) | breakdown, 102 s | One request followed through every stage, with light and dark boards and a wipe between them. |

Read each reference before the step that needs it:
- [`reference/script.md`](reference/script.md) and [`reference/story.md`](reference/story.md) before the script: the hook, the arcs, the retention ladder, the writing rules, the claims rules, the voice.
- [`reference/art.md`](reference/art.md) and [`reference/motion.md`](reference/motion.md) before writing scenes: the look, the board, the characters, the animation system, and the glitches already found and fixed.
- [`reference/pipeline.md`](reference/pipeline.md) before step 3: setup, every command, the scene contract.

## Steps

1. **Research.** Read the primary source: repo files (with `gh api` or a clone), the product site, the docs. Then hunt for the facts an everyday viewer finds wild, funny or slightly scary: what the subject did, names it uses, mistakes it made, money, who uses it. When the user names a reference reel, download it (`uvx yt-dlp`), transcribe it, and match its style, not its script. Done when you hold 10+ ranked facts, each with a quote and a source, and you know which are self-reported.

2. **Story and script** → `lines.py`, written with [`reference/script.md`](reference/script.md) and [`reference/story.md`](reference/story.md).
   - Pick the arc: the connected story for how something works, the discovery arc for a site, a list or a collection, the hero arc for a product that acts like a person, the problem arc for a tool, the breakdown only when the user asks for a deep step-by-step.
   - Check the script against the arc's rules and every line against the writing rules, including "Natural first".
   - Run an editorial pass in a fresh-context subagent. Brief it with the "Natural first" and writing rules in `story.md`, so that it cuts ad copy and AI tells and keeps the spoken connectors and the narrator's opinions.
   - Read every line aloud.
   - Show the user 3 hooks (A-C, with your pick) and the table: voice, visual and retention device for each line.
   Done when the user approves.

3. **Project.**
   1. Do the one-time setup in [`reference/pipeline.md`](reference/pipeline.md).
   2. Make `<proj>/`. Copy `assets/excal_theme.js` to `<proj>/excal_theme.js`, and copy `assets/rough.js` and `assets/fonts/*.woff2` to `<proj>/assets/`.
   3. Copy the settings block of the example that matches the arc: `MODEL`, `VOICE`, `INSTR` and its shape, `SPEED`, the gaps, `CAPTIONS = True`, `MUSIC = "beat"`, `PRELUDE`, `ASSETS`.
   Done when `make_reel.py` builds with the stub `function scene(ctx) { return {}; }` and the frame shows the dark canvas.

4. **Voice and timing**, by [`reference/pipeline.md`](reference/pipeline.md) (Voice, Timing) and the voice rules in [`reference/story.md`](reference/story.md). Re-voice any line whose transcript misreads a name (Jev as "Jeff", Vercel as "Bercel") until it reads right; up to 3 tries per line is normal. Done when every line transcribes word for word, and the total fits the arc at `SPEED` ≤ 1.15.

5. **Scenes** → `scenes.js` and `sfx.py`. Start from the example that matches the arc:
   - `examples/darkhorse/` for a discovery story, or `examples/quant_story/` for a connected story. In both, `build_scenes.sh` joins a head, the generated `caps_gen.js`, the toolkit, and the story into `scenes.js`. They add the station board, measured word times, and the travelling object.
   - `examples/valor_breakdown/scenes.js` for wiped light and dark sections (`THEME_SW`, `CAPFIX`, the wipe).
   - `examples/valor/scenes.js` for a hero story.
   Keep the toolkit block, and replace the story code:
   - guarded actors, and `tw`/`op` tweens;
   - rough.js `mk`/`rr`/`rline`/`rpath`/`rell`/`arrow`;
   - `drawIn`, `note`, `typeOn`/`typeLines`, `scribble`, `headline`, `splat`;
   - the figure system, `win`/`laptop`;
   - the camera queue and the boil clock.
   Lay the beats out on one board ([`reference/art.md`](reference/art.md)), time every beat to a word, and follow [`reference/motion.md`](reference/motion.md). Done when every beat in the approved table exists and fires on its word.

6. **Build, review, render, deliver**, by [`reference/pipeline.md`](reference/pipeline.md) (Build and check, Render) and the Review checks in [`reference/motion.md`](reference/motion.md).
   - After every render, a fresh subagent that has not seen your reasoning reviews it independently.
   - Pick the cover: the first frame that shows the hook complete. When that comes after 3 s, for example because a number is still counting up, say which frame and why.
   - Deliver the MP4 and the cover PNG to the folder the user names. Upload or post them only when the user asks.
   Done when the check, the side check, the transcript and a full sheet pass are all clean.
