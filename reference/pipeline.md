# Pipeline: voice, timing, build, render, checks

The tools in `pipeline/` turn a project folder (`lines.py`, `scenes.js`, `sfx.py`) into a HyperFrames composition, then into an MP4. `SKILL.md` says when each step runs. This file says how. In the commands, `$SKILL` is this skill's folder and `<proj>` is the reel's project folder.

## Setup (once per machine)

1. Install Node.js 18+, Python 3.10+ and ffmpeg.
2. Run `bash $SKILL/pipeline/scripts/setup.sh`. It installs KaTeX and a sans font into `~/.cache/explainer-reel`, and makes a Python venv at `~/.venvs/mer` with numpy, scipy, soundfile and faster-whisper. To use a Python you already have, set `MER_PYTHON` to it first; it must import those four packages. Done when it prints `ready`.
3. Check that `npx hyperframes --version` runs. HyperFrames checks and renders the composition; the first `npx` call downloads it, plus a headless Chrome.
4. Export `OPENAI_API_KEY` for the voice. The key is read only when a line has no voice file yet in `<proj>/vo/`.

Below, `PY` means `"${MER_PYTHON:-$HOME/.venvs/mer/bin/python}"`.

## `lines.py`

`LINES = [(id, text, "")]`: one tuple per spoken line. The text is what the captions show. The third field is a LaTeX formula row that this style leaves empty. Settings, with defaults in `pipeline/scripts/make_reel.py` (`SETTINGS`):

- **Voice:** `MODEL` (default `gpt-audio-1.5`; it has no speech endpoint, so the builder asks it through chat to read each line and checks its transcript word for word, retrying up to 3 times; `gpt-4o-mini-tts-2025-12-15` is the speech-endpoint fallback), `VOICE`, `INSTR` (the delivery and pronunciations), `NOTES` (line id → delivery for that line), `SAY` (line id → the text actually spoken, for spelled-out names, numbers and domains; captions keep the `LINES` text).
- **Pace:** `SPEED` (time-stretch, 1.0-1.15), `GAP` (seconds between lines), `GAP_AFTER` (line id → its own gap), `LEAD_IN`, `HOLD` (seconds after the last line).
- **Look and sound:** `CAPTIONS = True`, `MUSIC = "beat"` (or `"ambient"`; a project `music.py` overrides both), `MUSIC_GAIN`, `SFX_GAIN`, the `DUCK_*` sidechain, `PAYOFF` (line id → the word that gets a chime; point it at a word that never occurs to turn chimes off), `SAFE` (the safe-frame scale, default 0.8), `PRELUDE` (JS files placed before `scenes.js`: `assets/rough.js` and `excal_theme.js`), `ASSETS` (extra files to copy into `build/`, such as the fonts).
- **Ending:** `FOLLOW_LINE = None`, because the sketch scenes draw their own Follow button and cursor. `TITLE` names the composition.

Copy a whole settings block from the example that matches your arc; see `SKILL.md` step 3.

## Voice

1. Run `PY $SKILL/pipeline/scripts/make_reel.py <proj> --tts-only`. It writes `<proj>/vo/<id>.wav` for every line that has none.
2. From `<proj>`, run `PY $SKILL/pipeline/scripts/check_vo.py vo/`. It transcribes each line with faster-whisper `medium.en`, with no name hints, so misread names show up, and compares the result to the script.
3. To redo a line, move its `vo/<id>.*` files to `vo_rejected/` and repeat step 1. Up to 3 tries per line is normal. A homophone in the transcript ("four max" for "four Macs") is fine. A misread name is not.
4. **Tighten long pauses.** Find the silences in a line with `ffmpeg -i vo/<id>.wav -af silencedetect=n=-38dB:d=0.4 -f null -`. Then run `PY $SKILL/pipeline/scripts/tighten.py <in.wav> <out.wav> 0.34 <start>:<end> ...` to shorten each one to about 0.34 s. Keep the original take in `vo_orig/`, and delete the line's cached `vo/<id>_t*`/`_f*` files before you rebuild. A breathy pause needs `n=-30dB` to be found.

## Timing

1. With the stub `function scene(ctx) { return {}; }` in `<proj>/scenes.js`, run `PY $SKILL/pipeline/scripts/make_reel.py <proj>`.
2. Read `build/cues.txt`. It lists every line's cue names: each spoken word lowercased without punctuation, numbers as digits, and a misheard word under its misheard name. It also lists `_start`, `_end` and `_payoff` for each line. Read every WARNING too. "transcript ends on X" means the transcriber dropped the line's last words: the audio is kept, but those words have no cues, so re-voice the line when a scene needs them.
3. **For exact word times,** copy `pipeline/scripts/measure_words.py` into `<proj>/tools/`, put your names in its `initial_prompt`, and run it. It writes `words_measured.json` from the mixed voice track with faster-whisper `medium.en`. `examples/darkhorse/gen_caps.py` turns that file into `caps_gen.js`, the caption pages and per-word times. The scenes then time beats with `wt(line, word)`.
Done when every cue your scenes and sounds use exists.

## Scene contract

`scenes.js` defines `function scene(ctx)`. It runs once, after the fonts load. `ctx` carries:

- `B`, the build timeline. Put every tween here, at absolute times taken from `cue()`.
- `cue(line, word = "_start")` returns seconds. It throws on a missing name, so typos surface in the check.
- `D`, the drawing group inside `CAM` (the camera group, 1080×1920 units). `CAM` sits inside `SAFE`, which shrinks the whole drawing toward the centre and clips it to the canvas. `svg` is the root and `defs` its `<defs>`. Append to `svg` only for full-bleed backgrounds, inserted before `SAFE`.
- `kit`: `actor` (owns a node's translate, rotate, scale and opacity: `pop`, `to`, `hide`), `stickman`, `popIn`, `moveTo`, `fadeIn`, `fadeOut`, `drawPath`, `counter`, `camAt`, and `logo` (empty in this bundle: the sketch style draws names as text).
- `K` (the palette), `el`, `txt`, `arrowHead` (SVG builders), `rng(seed)` (a seeded random generator), and the fonts.

Return `{}`, or `{ firstFormulaAt: 0 }`. The examples' toolkit blocks (`examples/darkhorse/src_build/toolkit.js`, `examples/valor/scenes.js`) wrap all of this in the sketch helpers.

**Seek safety.** HyperFrames renders frames out of order. Every visual state must come from the `B` timeline at an absolute time. Use no `setTimeout`, no timers, no `Math.random()` (use `rng`), and no state carried from one frame to the next.

## Sounds (`sfx.py`)

`def extra(add, X, C)`. `X` is `pipeline/scripts/sfxlib.py`: `tick`, `pop`, `paper_swish`, `whoosh`, `riser`, `impact`, `shimmer`, `ding`, `key_click`, `stamp`, `buzz`, `glitch`, `snip`, `clank`, `squelch`, and the low-pass `lp`. `C[line][word]` is a cue time from `build/cues.txt`, and `add(sound, t, gain, pan=0)` places a sound. The examples read measured word times from `caps_gen.js` instead (`examples/darkhorse/sfx.py`). Every cue name used here must exist in `build/cues.txt`; a missing one skips all scene sounds with a WARNING.

## Build and check

1. Run `PY $SKILL/pipeline/scripts/make_reel.py <proj>`, then `npx hyperframes check` in `<proj>/build/`.
2. The check must pass with no WARNING left from the build. A `[reel-lint]` error lists text too small for a phone; raise those sizes (the floor is 34 px on screen). Expected notices: `rotation_pivot_drift` on things that tip from a corner, and `container_overflow` on `#safe`.

## Render

1. Render a draft: `npx hyperframes render -o <proj>/draft.mp4 --fps 60 -q draft` in `<proj>/build/`.
2. Make review sheets: `bash $SKILL/pipeline/scripts/review_sheet.sh <proj>/draft.mp4 /tmp/review`. It writes one timestamped frame every 0.5 s, 12 per sheet. Read every sheet, then fix what `reference/motion.md` (Review) lists.
3. To look closer at a moment, seek exactly: `ffmpeg -ss <t> -i draft.mp4 -frames:v 1 f.png`. Avoid a `select` filter followed by `fps`: it repeats the last selected frame and fakes a frozen animation.
4. Render the final: `npx hyperframes render -o <proj>/raw.mp4 --fps 60 -q delivery`. Then re-encode it: `ffmpeg -i raw.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart final.mp4`.
5. Extract the audio (`ffmpeg -i final.mp4 -vn -ac 2 final.wav`) and transcribe it. Transcribing the MP4 directly misreads words. When one word differs, transcribe that line's span alone before changing anything.
6. Run `PY $SKILL/pipeline/scripts/safe_check.py final.mp4`. It lists every moment where content comes within 110 px of a side, where phones crop and the like and share buttons sit. Move held content inward and re-render.
Done when every line matches the script and the side check passes.
