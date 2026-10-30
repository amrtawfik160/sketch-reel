# sketch-reel

A [Claude Code](https://claude.com/claude-code) skill that makes vertical 9:16 explainer reels (Instagram Reels, TikTok, Shorts) that look like someone drawing the story live on an [Excalidraw](https://excalidraw.com) board.

![Eight frames from the Valor breakdown reel](reference/look.png)

Everything the skill needs is in this repository: the method, the theme, the build pipeline, and seven finished example reels. You supply an OpenAI API key for the voice.

## What it does

- **The look:** hand-drawn rough.js shapes that "boil" like a sketch video, and Excalifont handwriting. The board is light by default, with detailed hand-drawn app cards, receipts, newspapers and real logos on every beat. It can also be dark, or light and dark boards mixed by story section with a hand-drawn wipe between them.
- **The story:** six arcs, each with a finished example:
  - a depth story, the default (about 85-89.5 s: a journey through 4-5 stops, each told as a short story, such as a submarine sinking past the layers of an "AI model iceberg");
  - a connected story (about 60 s: one character, one object carried through every shot, each line caused by the one before);
  - a discovery story (about 55 s: a narrator telling a friend about a site or a list, with one favourite told properly);
  - a hero story and a problem story (40-55 s);
  - a step-by-step breakdown (about 100 s).
- **The writing:** a retention checklist, and rules that make a script sound like a person talking, not like ad copy.
- **The motion:** a live-drawing feel, with strokes that draw on, notes that write themselves and stamps that slam. It uses one board of stations that is never cleared, and a calm camera that travels from cause to effect. A hand-drawn hero acts out each line, and captions appear word by word.
- **The pipeline:** an OpenAI voice whose every line is checked against the script, measured word timings, captions, music with ducking, sound effects, a HyperFrames build, and an MP4 render.
- **The review:** checks for empty frames, text that runs out of its box, caption timing, and content in the phone's side crop zone. A fresh, independent review follows every render.

## Requirements

- [Claude Code](https://claude.com/claude-code), or another agent that can load a skill folder and run shell commands.
- Node.js 18 or newer. [HyperFrames](https://www.npmjs.com/package/hyperframes) runs through `npx` and downloads a headless Chrome on first use.
- Python 3.10 or newer, and ffmpeg.
- An OpenAI API key with access to `gpt-audio-1.5`, in `OPENAI_API_KEY`.
- About 2 GB of disk for the faster-whisper models and the browser, and about 1-2 GB per reel project while it builds.

## Install

1. Clone the repository into your Claude Code skills folder:

   ```bash
   git clone https://github.com/amrtawfik160/sketch-reel ~/.claude/skills/sketch-reel
   ```

2. Run the one-time setup. It installs KaTeX and a font into `~/.cache/explainer-reel`, and makes a Python venv at `~/.venvs/mer` with numpy, scipy, soundfile and faster-whisper:

   ```bash
   bash ~/.claude/skills/sketch-reel/pipeline/scripts/setup.sh
   ```

   To use a Python you already have, set `MER_PYTHON` to it first.

3. Export your key: `export OPENAI_API_KEY=...`

## Use

Ask Claude Code for a reel, for example:

> Make a sketch-style reel about https://github.com/some/repo

The skill then works in this order:
1. It researches the subject.
2. It shows you 3 hooks and a script table to approve.
3. After your approval, it voices, animates, builds, reviews and renders the reel.

It delivers an MP4 and a cover image, and it posts nothing unless you ask.

## Files

| Path | What it holds |
|---|---|
| `SKILL.md` | The steps, from research to delivery. |
| `reference/script.md` | Hooks, the shape of a reel, length, and the claims rules. |
| `reference/story.md` | The arcs, the retention ladder, the writing rules, the voice. |
| `reference/art.md` | Colours (Excalidraw dark and light), type, shapes, the board, characters, the detail kit. |
| `reference/motion.md` | Boiling lines, drawing on, the camera, physical motion, known glitches and their fixes, sound, review. |
| `reference/pipeline.md` | Setup, every command, `lines.py` settings, the scene contract. |
| `pipeline/scripts/` | `make_reel.py` (voice, word timings, captions, music, build), `sfxlib.py` (sound effects), `check_vo.py` (checks each voice line against the script), `tighten.py` (shortens long pauses), `measure_words.py` (exact word times), `review_sheet.sh`, `safe_check.py`, `setup.sh`. |
| `pipeline/assets/` | The HyperFrames page template and the drawing runtime. |
| `assets/` | The sketch theme (`excal_theme.js`), rough.js 4.6.6 patched to use a seeded random generator, and the Excalifont and Comic Shanns fonts. |
| `examples/` | Seven finished reels: `iceberg` (depth story, light), `care` (connected story with an object that changes state), `darkhorse` (discovery story), `quant_story` (connected story), `valor` (hero story), `jev` (problem story), `valor_breakdown` (breakdown). Each has `lines.py` (script, sources and voice settings), `scenes.js` (the animation) and `sfx.py` (sound effects). `iceberg`, `care`, `darkhorse` and `quant_story` build `scenes.js` from parts with `build_scenes.sh`. |

## Costs

- **Voice:** each spoken line is one `gpt-audio-1.5` request, with up to 3 retries when the transcript differs from the script. A 9-line reel uses about 10-20 requests. Voice files are cached in the project's `vo/` folder, so rebuilding costs nothing.
- **Everything else** runs locally.

## Notes

- The people and products in the examples are real: Valor, an AI engineer built by Tom Counsell; Jev, an AI decision model; Dark Horse Labs, a list of open-source projects; Matt Pocock, a coding teacher whose idea the CARE reel retells; and the AI models and companies in the iceberg reel. Nadia in the CARE reel is invented. The names of Valor's client companies are replaced with "Client A" to "Client F".
- The facts in the example scripts were checked against their sources in October 2026. Each `lines.py` (and the `script.md` and `research.md` files) lists them.
- The iceberg example draws real logos, which are third-party trademarks. The logo files are not in this repository; `examples/iceberg/lines.py` says where to fetch each one.
- The reference files record what worked and what failed on real reels. "The creator" in them is the person those reels were made for.

## License

MIT for the skill text and code. Third-party assets keep their own licenses; see [THIRD_PARTY.md](THIRD_PARTY.md).
