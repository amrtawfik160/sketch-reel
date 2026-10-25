// "My friend Sam swears Claude got dumber" — the STORY version of the quantization reel (9 lines, ~63 s), sketch style.
// ONE continuous board (3 columns x 2 rows); the camera travels from cause to effect and never clears it:
//   row 0 (dark board):  ST1 Sam's theory (Claude in a vise)  ->  ST2 the model box, its numbers, the card 0.0372  ->  ST3 the chat
//   row 1 (light board): ST4 Anthropic's word  <-  ST5 the daily test (real LiveNerf scores)  <-  ST6 the effort dial
// ONE cast (screen-fixed, walks while the camera travels): the narrator (left) and Sam (right, red cap, phone).
// ONE object: the card 0.0372 -> 0.04 -> "a little off" -> the wrong answer. The end pulls back over the whole board.
// Facts: research.md. Illustrative: Sam, 0.0372, the pile numbers, 17 x 24.
// captions come pre-chunked from gen_caps.py (measured word times): caps_gen.js
CAPFIX = [];
const TL_ = T;   // the runtime timeline (scene() shadows T with its text helper)
// LiveNerf: Opus 5.5's daily score on the frozen panel, days 1-30 (github.com/ninjahawk/livenerf results/daily.csv, 23 Oct 2026)
const NERF = [0.5897, 0.6184, 0.5844, 0.6026, 0.641, 0.5256, 0.5455, 0.5584, 0.5325, 0.641, 0.6923, 0.6154, 0.6026, 0.5769, 0.5844,
  0.5385, 0.5769, 0.6026, 0.5658, 0.5641, 0.6282, 0.5641, 0.4805, 0.5513, 0.6923, 0.5256, 0.5065, 0.5897, 0.5897, 0.5769];
// 0.0372 in bfloat16 (the top 16 bits of the float32 0x3D185F07): 0011 1101 0001 1000
const BITS = "0011110100011000";

