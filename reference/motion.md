# Motion: a board that is being drawn, live

The seek-safety rule in [`pipeline.md`](pipeline.md) applies in full: frames render out of order, so every state comes from the B timeline at absolute times. This file covers what the sketch style adds. The code for each item is in `examples/valor/scenes.js`.

## Boiling lines

Excalidraw sketch videos shimmer because each line is redrawn slightly differently. Here every rough.js shape is built three times with different seeds (`mk` → `boil(vars)`).

One time-driven clock picks the visible variant every `BOIL_DT = 0.14` s: a single `B.fromTo(clock, …, { onUpdate: () => boilAt(clock.v) })` from 0 to the end. Each shape has a phase offset, so the board never flips in sync.

Figures use the same clock: `boilAt` picks the pose from the figure's keys, then the variant. A freeze holds the clock still (`v` clamped to the freeze time), and the whole board goes dead, which is the effect.

Pass `boil: false` for shapes that move fast or sit inside a pose drawing.

## Drawing on

- **`drawIn(node, t, dur)`** draws a group the way a hand would:
  1. the outlines trace on (a stroke-dash per path, staggered);
  2. the hachure sweeps in;
  3. solid fills fade up;
  4. the arrow heads land last.

  Draw every window, card, and arrow this way on its cue.
- **`note(...)`** writes a handwritten note letter by letter at 36 characters a second (`cps`). At 24 a second a word's first letter sat alone on screen long enough to read as a stray mark; keep any word under about 0.4 s. **`headline(...)`** writes a big headline at about 26 a second and lifts it out before the next one. **`typeOn` / `typeLines`** type code or chat text with a human cadence: spaces and punctuation take longer.
- **A long `rc.path` chart line ignored the stroke-dash.** Reveal such a line with a widening clip rect instead.

## Camera

- **Queue every move** (`cam(pose, t, dur, ease)`) and apply them in time order at the end of `scene()`. `pose(s, fx, fy, sy)` frames the point (fx, fy) at screen y `sy`.
- **Four to six moves a reel, each with a reason:**

  | Move | How |
  |---|---|
  | Slow creep | push in on the hook from frame one |
  | Push-in | on the hero after a reveal, instead of an empty board |
  | Whip | between boards: a 0.1 s anticipation drift the other way, then about 0.48 s with `expo.inOut`, with a whoosh |
  | Dive | scale to 12.8 around a fixed focal point (the screen centre) into the world drawn at 1/12.8 inside the screen; into a character's head, see below |
  | Pull-out | reveals a new character (Tom in his chair) |
  | Jolt or shake | on a slam (STOP, the reveal), built on the current framing so it never snaps back to wide |

- **During a push or a dive,** fade out what the zoom would cut at the safe-frame edge, and fade it back in on the way out.
- **A dive into a character's head reads as "going inside"** when (`HF`, `INNER`, `DIVE` in `examples/care/src_build/story_body.js`; it took four review rounds):
  1. the head sits at the station centre, so the camera zooms on a fixed point with no drift;
  2. the move takes about 0.8 s with `power3.inOut` (0.62 s with `expo.inOut` read as a cut);
  3. the body and face fade in the first 0.25 s, before the body reaches the caption band;
  4. the head outline stays as the frame around the inner content, at least 110 px from the sides (`K = 3.8`; 5.5 cut the frame off), with the inner content drawn at `1/K` inside it.
- **On a board of three or more columns, pull back to at most 0.9,** or move on to the next station. A pull-back to 0.6-0.7 over two stations cut props at the edges and showed tiny text from other rows, two renders in a row. Check each pose before rendering: screen x = 540 + 0.8 × s × (board x − centre x).
- **On a station board, the camera travels only from cause to effect** (`examples/quant_story/src/story4.js`): right to the model box on "So I opened up a model", right to the chat on "Every word Claude writes", down from the dark row to the light row on "So I checked", left along the bottom row through the evidence. Each move is 0.5-0.6 s and settles before the next word that matters.
  - **Never go backwards.** A pan ahead to the chat followed by a pan back to the numbers was the one place the reviewer lost track. When two stations must be seen together, pull back to frame both (the number pile with arrows into the chat), then push in on the next one.
  - **The final pull-back is the payoff:** the whole board, numbered in story order, while the voice asks to follow.

## Physical motion

- **Easing by role:**
  - arrivals decelerate (`expo.out`, `power3.out`);
  - exits accelerate (`power3.in`);
  - `back.out` is only for small pops (a badge, a Mac appearing on its name).

  Varied easing is most of what keeps the motion from feeling templated.
- **Things travel; nothing teleports.**
  - Cards fly on arcs with a little spin.
  - A landing squashes slightly, and the tray it hits wobbles.
  - A torn plan's halves fall and fade as they go.
  - A card in the air at the freeze stays in the air.
- **Lists move like UI.** Rows stagger unevenly when one leaves. A new row waits above the clipped list, then the whole list slides together.
- **Hold still between bursts** for about 0.4-0.8 s, so a frame can be read.
- **Every strong word gets a physical event:** a scribble on "not", a stamp on "stop", a freeze on "freezes". The sound hit lands about 0.1 s before the word, never on it.

## Glitches already paid for

1. **Overlapping actor tweens fight.** `kit.actor.to()` tweens the whole state (x, y, scale, rotation, opacity) from its last target. A second `to()` that starts before the first ends makes the first one restore the old values. In the Jev reel, inbox rows faded out and then popped back over their neighbours. The fix:
   - Use `GA`, the guarded actor: each `to()` starts no earlier than the previous one ends.
   - Drain a list as one group, never row by row in parallel.
   - On a travelling object's actor, end every small reaction (a wobble, a pulse) before the next travel starts; the guard otherwise pushes the travel late (CARE's S2 move waited on the S1 wobble).
2. **Two owners of one opacity.** A GSAP opacity tween (`op`) on a node that a `kit.actor` also fades leaves the node visible before its time: SHIPPED and the code card showed inside the screen from the start. Fade an actor's node only through its actor.
3. **Things visible before their cue.** Give every element inside a screen or behind a dive a hidden start state; check the first frames of each scene.
4. **Headlines on top of headlines.** The old headline lifts out before the next one writes in.
5. **A stamp over a window border.** Place stamps inside the panel they judge.
6. **A frame with only the hero and empty board** after a reveal. Fill it with a push-in, a new prop, or a note.
7. **Labels below the size floor** when their figure is drawn small. Scale the font against the figure's scale.
8. **A tint or flash clipped to the safe box.** Full-bleed effects go before `SAFE`.
9. **Caption words timed wrong by the transcriber.** Two words at the same time (`zero` and `human` both at 89.035) or a missing word (`dollars` and `and` never transcribed) leave the blue word stuck. Measure the real onsets from the voice track and list them in `CAPFIX = [[word, built time, measured time], ...]`; the theme moves those words. Use the same times for the reactions and sounds on those words.
10. **An empty hold at a line start.** Three 0.7-0.9 s holds showed only a note and the hero. Bring the line's main object in on its first word ("And if" brings the speech bubble), or write the line's question big in the middle ("why trust it?").
11. **A static scene.** A critic who stood still for 3.5 s was the dullest moment. Make the figure act the line: walk to the plan, raise the pen, mark it in red.
12. **A plain recap.** Three bare number boxes undersold the callback. Pair each number with its earlier scene: a mini activity grid beside 954, a crossed-out "human click" tag beside 0, a STOP stamp beside 1.
13. **A still end card.** Seven seconds of a static address lost the ending. Keep the address still and readable, and give the board small life around it: the hero waves, Tom's photo pops in with a thumbs-up, sparkles twinkle.

14. **An effect before its cause.** The model box shrank while the voice was still reading the number, then the picture stood still for 2.5 s during the line that explains the shrink. Every change fires on the word that names it: the shrink on "whole model", "3× smaller!" on "smaller", the price tag on "cheaper". Typed text starts at `wt(line, word) - 0.06` for the first word it spells ("NEW RULE" on "new", not on "one"). Check the picture plan for this before showing it: CARE's approved "a tick after each patch" put the "tests ✓" chips 2 s before the spoken "tests"; place a recurring beat on its word, or reword the line.
15. **A bubble that outlives its meaning.** Sam's "see?!" stayed up for 16 s and returned next to the evidence against him. A reaction ends when its cause ends, and the next reaction replaces it on its own word.
16. **The whole picture running 0.14 s late.** The first caption page started at -0.14 s, which shifted every drawing and camera move behind the voice. `excal_theme.js` now clamps page starts at 0; after any caption change, check that a frame-one event lands on its word (Sam's cap colour was due at 39.17 s and drew at 39.32 s).
17. **Caption words on the transcriber's times.** The build's word times split numbers ("0 .0372", "65 ,000", "5 .5") and give two words one time. For number-heavy lines, measure the narration with faster-whisper medium (`examples/quant_story/src/measure_words.py` writes `words_measured.json`) and generate the caption pages and per-word times from it (`gen_caps.py` writes `caps_gen.js`: each number in one page, pages break at punctuation, each page opens 0.04-0.14 s before its first word). Time scenes from those measured times too (`wt(line, word)`).
18. **The Follow button after the ask.** A 1.3 s recap hold put the button 2 s after the spoken "follow". The button pops on the word and is clicked within 0.6 s; the recap can finish folding in behind it.
19. **A travelling counter that shows the old number.** In the Dark Horse Labs reel the star note flew to the firstmate station still reading the previous item's 26,016, then changed to 8,380 on "eight". Fold the old number out as the note lifts off, and write the new one as it lands or on its word, so no frame pairs a number with the wrong item.
20. **A recap with no time to read.** The pull-back over the whole board held for about 0.5 s, because the last line started with the address. The build check flagged its labels as on screen too briefly to read. Either give the recap its own short spoken beat before the address (at least 1.2 s), or skip the recap and go straight to the end card. The same holds for any label: it stays at least 0.5 s plus 0.3 s a word before the camera leaves, or it goes, because the caption already says it (CARE's "first time!", "+ feature" and "other apps too" were flagged).
21. **A progress track keeps a list moving.** A small hand-drawn horse on a race track along the bottom stepped forward on every line from the list reveal and crossed the finish on the last line. It gave a five-station list the feeling of one race. Keep the track below the stations and above the captions, and give it one step per line.

## Sound (`sfx.py`)

- **Quiet physical sounds tied to visible events** from `pipeline/scripts/sfxlib.py`:

  | Sound | Event |
  |---|---|
  | `tick` | chat pings and checks |
  | `pop` | small arrivals |
  | `paper_swish` | cards and sticky notes |
  | `whoosh`, low-passed with `lp` | whips and dives |
  | `key_click` | typing |
  | `clank` | walls going up |
  | `stamp` | slams |
  | `glitch`, low-passed | the reveal scribble |
  | `ding` | a result |

- **Gains stay at 0.2-0.35.** The beat and the voice carry the energy.
- **Music sits about 24 dB under the voice.** A quieter section for a serious beat (the stop) works, but at 33 dB under it sounded dead; about 29 dB under was right.
- **Every cue name in `sfx.py` must exist in `build/cues.txt`.** A missing cue skips all scene sounds with a WARNING.

## Review

On top of the render steps in [`pipeline.md`](pipeline.md):

1. **Read every review sheet.** Then crop a few frames at full size: the detail quality only shows there.
2. **Strip every moving list, drain, and pile frame by frame** at 12-30 fps with exact seeks (`ffmpeg -ss` per frame, or `fps` without `select`). Confirm no two rows' text overlaps in any frame.
3. **Run the render review checklist**, and fix every case of:
   - uniform pop-ins;
   - effects that carry no meaning (sparkles, glows, confetti);
   - empty frames;
   - motion with no cause;
   - small moving specks (flies buzzing round CARE's mud ball read as a render glitch and were cut).
4. **Run `pipeline/scripts/safe_check.py`.** It measures against the frame's median colour, so it works on the dark canvas unchanged. Single frames at 104-108 px during a whip or a slide-in are acceptable; held content is not. On a station board it reports FAIL during camera travel, the tilt and the half-dark/half-light recap by design; check held frames yourself and measure the recap board's edges (x 120-960).
5. **Get an independent review every round.** After each render, a fresh general-purpose subagent that has not seen your reasoning reviews the final: it reads every sheet, seeks every line start and every wipe, and reports P1/P2/P3 with timestamps and evidence frames. Fix everything it finds, then verify each fix with exact seeks before delivering. Each round found 2-3 defects the builder's own pass missed.
6. **Transcribe the full mix.** A name that comes back wrong (Jev as "Jeff") is fine only if that line, transcribed alone, reads right.
