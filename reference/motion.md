# Motion: a board that is being drawn, live

The explainer-reel seek-safety rules apply in full: frames render out of order, so every state comes from the B timeline at absolute times. This file covers what the sketch style adds. The code for each item is in `examples/valor/scenes.js`.

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
  | Dive | scale to 12.8 around a fixed focal point (the screen centre) into the world drawn at 1/12.8 inside the screen |
  | Pull-out | reveals a new character (Tom in his chair) |
  | Jolt or shake | on a slam (STOP, the reveal), built on the current framing so it never snaps back to wide |

- **During a push or a dive,** fade out what the zoom would cut at the safe-frame edge, and fade it back in on the way out.

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

## Sound (`sfx.py`)

- **Quiet physical sounds tied to visible events** from `scripts/sfxlib.py`:

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

On top of explainer-reel steps 8-9:

1. **Read every review sheet.** Then crop a few frames at full size: the detail quality only shows there.
2. **Strip every moving list, drain, and pile frame by frame** at 12-30 fps with exact seeks (`ffmpeg -ss` per frame, or `fps` without `select`). Confirm no two rows' text overlaps in any frame.
3. **Run the render review checklist** in `~/.claude/skills/motionmaxxing/references/slop.md`:
   - uniform pop-ins;
   - effects that carry no meaning (sparkles, glows, confetti);
   - empty frames;
   - motion with no cause.
4. **Run `safe_check.py`.** It measures against the frame's median colour, so it works on the dark canvas unchanged. Single frames at 104-108 px during a whip or a slide-in are acceptable; held content is not.
5. **Get an independent review every round.** After each render, a fresh general-purpose subagent that has not seen your reasoning reviews the final: it reads every sheet, seeks every line start and every wipe, and reports P1/P2/P3 with timestamps and evidence frames. Fix everything it finds, then verify each fix with exact seeks before delivering. Each round found 2-3 defects the builder's own pass missed.
6. **Transcribe the full mix.** A name that comes back wrong (Jev as "Jeff") is fine only if that line, transcribed alone, reads right.
