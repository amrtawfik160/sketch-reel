// Dark Horse Labs v2, sketch style (9 lines, ~54 s). Stations: S1 laptop (s1, s2), S3 list (s3), SF firstmate (s4-s6), PocketBase (s7), LocalSend (s8); s9 pull-back and end card.
//   row 0: S1 the hook laptop (s1, s2) -> S3 the list, a terminal (s3) -> S4 PocketBase (s4)
//   row 1: S8 Rooms (s8) <- S67 llm.c (s6 whip, s7) <- S5 LocalSend (s5)
//   s9 pulls back over the whole board; s10 is a clean end card with the address and the Follow click.
// One travelling object: the yellow star note (26,016 -> 61,625 -> 96,192 -> 402 -> 26,016). A horse on a race track (screen space)
// moves forward on every line from s3 and crosses the finish on s9. Captions and word times come from gen_caps.py (caps_gen.js).
CAPFIX = [];
const TL_ = T;   // the runtime timeline (scene() shadows T with its text helper)
