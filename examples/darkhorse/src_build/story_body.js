
  { const r = defs.querySelector("#safeclip rect"); if (r) { r.setAttribute("x", -140); r.setAttribute("y", -250); r.setAttribute("width", 1360); r.setAttribute("height", 2420); } }
  // a station headline leaves before the camera starts its move to the next line's station
  const HOUT = (lid) => L0(lid) - 0.55;
  const HOOKS = [];   // functions of the boil clock time (seek-safe per-frame state: the horse's legs)
  const NUM = (v) => Math.round(v).toLocaleString("en-US");
  const DARKT = "#1e1e1e";

  // ---------- small drawings ----------
  // a generic stick person (no likeness of anyone), feet at (x, y); about 150 tall at s = 1
  const person = (p, x, y, s = 1, col = INK) => {
    const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
    const o = { stroke: col, strokeWidth: 3.6 / Math.sqrt(s), roughness: 0.7 };
    rpath(g, "M0 -100 L0 -46 M0 -88 L-22 -60 M0 -88 L22 -60 M0 -46 L-16 0 M0 -46 L16 0", o);
    rell(g, 0, -124, 46, 46, { ...o, fill: PAPER, fillStyle: "solid" });
    return g;
  };
  const starD = (x, y, r) => { let d = ""; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr0 = k % 2 ? r * 0.45 : r; d += (k ? " L" : "M") + (x + rr0 * Math.cos(a)).toFixed(1) + " " + (y + rr0 * Math.sin(a)).toFixed(1); } return d + " Z"; };
  const star = (p, x, y, r, o = {}) => rpath(p, starD(x, y, r), { fill: EX.yellowF, fillStyle: "solid", stroke: EX.orange, strokeWidth: 3.5, roughness: 0.6, ...o });
  const wr = (p, str, x, y, size, col, t, { anchor = "start", cps = 40, maxW = 810 } = {}) => {   // fitted handwriting, typed on
    const g = G(p, { opacity: 0 });
    const e = T(g, str, x, y, size, col, { "text-anchor": anchor, ...HALO() });
    fitT(e, maxW); typeOn(e, t, str.length / cps); show(g, t);
    return g;
  };
  const fileIcon = (p, x, y, w, h, o = {}) => {   // a dog-eared document, top-left (x, y)
    const g = G(p), d = Math.min(w, h) * 0.22;
    rpath(g, `M${x} ${y} L${x + w - d} ${y} L${x + w} ${y + d} L${x + w} ${y + h} L${x} ${y + h} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 4, ...o });
    rpath(g, `M${x + w - d} ${y} L${x + w - d} ${y + d} L${x + w} ${y + d}`, { strokeWidth: 3, ...o });
    return g;
  };

  // ====================================================================================================
  // THE NOTE: the one travelling object. Built now, appended on top of the board at the end.
  // ====================================================================================================
  const NOTE = el("g", {}, null);
  const noteBody = G(NOTE);
  rr(noteBody, -162, -72, 324, 144, { fill: "#ffec99", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 2.5, roughness: 0.8 });
  const nStarG = G(NOTE), nStarA = GA(nStarG, { x: -110, y: 0 });
  star(nStarG, 0, 0, 36, { fill: "#f08c00", fillStyle: "solid", stroke: DARKT, strokeWidth: 2.5 });
  const noteTxt = T(NOTE, "0", -64, 22, 62, DARKT, { "font-weight": 400 });
  const NP = (col, row, lx, ly) => ({ x: COLX[col] + lx, y: ROWY[row] + ly });
  const p1 = NP(0, 0, 745, 1150);
  const noteA = GA(NOTE, { x: p1.x, y: p1.y, s: 0.2, o: 0, r: 4 });
  const pulse = (t) => nStarA.to({ s: 1.45, r: 18 }, t, 0.12, "power2.out").to({ s: 1, r: 0 }, t + 0.12, 0.3, "back.out(3)");
  const count = (from, to, t, dur = 0.5) => { kit.counter(noteTxt, from, to, t, dur, NUM, "power2.out"); pulse(t + dur - 0.1); };
  // small stars that pop out of the note: "saved"
  const BURST = G(D);   // re-appended on top at the end
  const burst = (cx, cy, t, k = 1, n = 5, dir = 1) => {
    for (let i = 0; i < n; i++) {
      const g = G(BURST); star(g, 0, 0, 20, { boil: false });
      const a = -Math.PI * 0.15 - (i * Math.PI * 0.55) / (n - 1);
      const A0 = GA(g, { x: cx, y: cy, s: 0.3 * k, o: 0, r: 0 });
      A0.to({ o: 1, s: k }, t + i * 0.03, 0.08).to({ x: cx + Math.cos(a) * 170 * k, y: cy + dir * Math.sin(a) * 90 * k, r: 40 }, t + i * 0.03 + 0.08, 0.5, "power2.out").to({ o: 0, s: 0.5 * k }, t + i * 0.03 + 0.58, 0.18, "power2.in");
    }
  };

  // ====================================================================================================
  // OVERLAY (screen space, inside the safe frame): the race track and the horse
  // ====================================================================================================
  const OV = G(SAFE);
  const TRK = G(OV, { opacity: 0 });
  const RY0 = 1610, RY1 = 1716, FIN = 830;
  rline(TRK, 140, RY0, 1070, RY0, { stroke: INK2, strokeWidth: 3 });
  rline(TRK, 140, RY1, 1070, RY1, { stroke: INK2, strokeWidth: 3 });
  rline(TRK, 190, RY0 + 6, 190, RY1 - 6, { stroke: INK2, strokeWidth: 2.5, strokeLineDash: [10, 9] });
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0) el("rect", { x: FIN - 8 + j * 8, y: RY0 + i * 16, width: 8, height: 16, fill: INK }, TRK);
  rline(TRK, FIN - 8, RY0, FIN - 8, RY1, { stroke: INK, strokeWidth: 2 }); rline(TRK, FIN + 8, RY0, FIN + 8, RY1, { stroke: INK, strokeWidth: 2 });
  rline(TRK, FIN + 22, RY1, FIN + 22, 1584, { strokeWidth: 3 });
  rpath(TRK, `M${FIN + 22} 1584 L${FIN + 70} 1595 L${FIN + 22} 1608 Z`, { stroke: EX.red, fill: EX.red, fillStyle: "solid", strokeWidth: 2.5 });
  const tTrack = wt("s3", "called") - 0.1;
  show(TRK, tTrack); drawIn(TRK, tTrack, 0.5);
  // the horse: facing right, feet at local y 56, drawn at 0.75
  const HY = RY1 - 8 - 53;
  const HORSE = G(OV), horseA = GA(HORSE, { x: 200, y: HY, s: 0.3, o: 0 });
  const HB = G(HORSE), HSC = G(HB, { transform: "scale(0.95)" });
  const hO = { strokeWidth: 3.6, roughness: 0.9 };
  rpath(HSC, "M-58 -8 Q-86 -6 -92 26", { ...hO, strokeWidth: 6 });
  const LEGS = [
    "M34 18 L36 56 M46 16 L48 56 M-34 18 L-36 56 M-22 20 L-24 56",
    "M34 16 L64 46 M46 14 L76 36 M-34 16 L-66 46 M-24 18 L-58 52",
    "M34 18 L44 38 L34 54 M46 16 L54 36 L46 52 M-34 18 L-22 38 L-30 54 M-24 20 L-14 40 L-22 56",
  ].map((d, i) => { const g = G(HSC, { visibility: i ? "hidden" : "visible" }); rpath(g, d, { ...hO, strokeWidth: 5, boil: false }); return g; });
  rell(HSC, 0, 0, 122, 56, { ...hO, fill: INK2, fillStyle: "hachure", hachureGap: 8 });
  rpath(HSC, "M36 -16 L56 -62 L76 -52 L58 6 Z", { ...hO, fill: INK2, fillStyle: "hachure", hachureGap: 8 });
  rpath(HSC, "M54 -64 Q64 -78 80 -72 L108 -48 Q113 -36 100 -34 L74 -40 Z", { ...hO, fill: PAPER, fillStyle: "solid" });
  rpath(HSC, "M54 -64 Q64 -78 80 -72 L108 -48 Q113 -36 100 -34 L74 -40 Z", { ...hO, fill: INK2, fillStyle: "hachure", hachureGap: 8 });
  rpath(HSC, "M62 -70 L64 -88 L74 -72", hO);
  rpath(HSC, "M54 -66 Q40 -40 34 -14", { ...hO, strokeWidth: 7 });
  el("circle", { cx: 84, cy: -58, r: 4, fill: INK }, HSC);
  const STEPS = [];   // [t0, dur]
  const trot = (t, x, dur = 0.6) => { horseA.to({ x }, t, dur, "power1.inOut"); STEPS.push([t, dur]); };
  horseA.to({ o: 1, s: 1 }, wt("s3", "dark") - 0.06, 0.28, "back.out(2)");
  trot(wt("s3", "horse") + 0.02, 260, 0.55);
  ["s4", "s5", "s6", "s7", "s8"].forEach((lid, i) => trot(L0(lid) + 0.12, 330 + i * 70));
  const tWin = L0("s9") + 0.02;
  trot(tWin, 962, 0.8);
  HOOKS.push((v) => {
    const run = STEPS.some(([t0, d]) => v >= t0 && v < t0 + d);
    const k = run ? 1 + (Math.floor(v / 0.09) % 2) : 0;
    LEGS.forEach((g, i) => g.setAttribute("visibility", i === k ? "visible" : "hidden"));
    let dy = run ? -Math.abs(Math.sin(v * Math.PI / 0.18)) * 7 : 0;
    if (!run && v > tWin + 0.9) dy = -Math.max(0, Math.sin((v - tWin) * 5)) * 4;   // a happy bob after the win
    HB.setAttribute("transform", `translate(0,${dy.toFixed(2)})`);
  });
  const rosette = G(OV); rpath(rosette, "M-8 10 L-16 40 L-4 32 L2 44 Z M8 10 L16 40 L4 32 L-2 44 Z", { stroke: EX.red, fill: EX.red, fillStyle: "solid", strokeWidth: 2 }); rell(rosette, 0, 0, 34, 34, { stroke: EX.red, fill: EX.redF, fillStyle: "solid", strokeWidth: 3 }); pop(rosette, tWin + 0.85, 940, 1560);

  // ====================================================================================================
  // S1 (0,0) s1 + s2: the laptop built in one Saturday; then Karpathy's note on the same screen
  // ====================================================================================================
  const S1 = station(0, 0);
  cam(F(0, 0, 0.97), 0, 0.01, "none");
  cam(F(0, 0), 0.02, 4.0, "sine.inOut");   // a slow creep from frame 0
  camLast = F(0, 0);
  laptop(S1.mid, 200, 610, 660);
  const scr = G(S1.mid);
  rr(scr, 226, 636, 608, 360, { stroke: INK2, strokeWidth: 2 });
  [0, 1, 2].forEach((i) => rell(scr, 254 + i * 24, 668, 13, 13, { stroke: INK2, strokeWidth: 2, roughness: 0.6 }));
  T(scr, "llm-council", 340, 683, 44, INK2);
  rline(scr, 240, 704, 820, 704, { stroke: INK2, strokeWidth: 2 });
  const bodyA = G(S1.mid);   // the app sketch: three AI answers and one combined answer
  [380, 525, 670].forEach((x) => { rr(bodyA, x, 728, 130, 116, { stroke: EX.blue, strokeWidth: 3 }); [762, 792, 820].forEach((y, k) => rline(bodyA, x + 18, y, x + 112 - k * 24, y, { stroke: INK2, strokeWidth: 2.5, boil: false })); });
  rr(bodyA, 380, 866, 420, 104, { stroke: EX.green, strokeWidth: 3 });
  [902, 936].forEach((y, k) => rline(bodyA, 402, y, 760 - k * 120, y, { stroke: INK2, strokeWidth: 2.5, boil: false }));
  const cal = G(S1.top);
  rr(cal, 135, 1000, 200, 180, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rr(cal, 135, 1000, 200, 54, { fill: EX.redF, fillStyle: "hachure", stroke: EX.red, strokeWidth: 3.5, hachureGap: 12 });
  [185, 285].forEach((x) => rr(cal, x - 6, 982, 12, 36, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 }));
  T(cal, "SAT", 235, 1150, 76, INK, MID);
  ring(S1.top, 235, 1124, 184, 100, EX.red, wt("s1", "saturday") - 0.08);
  // "its creator said he'd never touch it again": a "never again" note, a cobweb, a spider drops
  head(S1.top, "never again!", wt("s1", "never") - 0.04, wt("s1", "twentysix") - 0.3, EX.red, 96, 460, 12 / (wt("s1", "again") + 0.12 - wt("s1", "never")));
  const web = G(S1.top);
  [[340, 712], [320, 760], [282, 800], [232, 806]].forEach(([x, y]) => rline(web, 232, 712, x, y, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
  [36, 66, 94].forEach((r) => rpath(web, `M${232 + r * 1.0} 712 Q${232 + r * 0.95} ${712 + r * 0.6} ${232 + r * 0.66} ${712 + r * 0.8} Q${232 + r * 0.3} ${712 + r * 1.0} 232 ${712 + r * 1.0}`, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
  drawIn(web, wt("s1", "never") - 0.08, 0.4);
  const spider = G(S1.top);
  rline(spider, 300, 742, 300, 838, { stroke: INK2, strokeWidth: 2, roughness: 0.4 });
  el("circle", { cx: 300, cy: 848, r: 11, fill: INK }, spider);
  rpath(spider, "M288 842 L274 832 M288 852 L272 860 M312 842 L326 832 M312 852 L328 860", { stroke: INK, strokeWidth: 2.4, roughness: 0.5 });
  drawIn(spider, wt("s1", "touch") - 0.06, 0.35);
  // the hook headline: 26,000 + a star
  const h1 = G(S1.top, { opacity: 0 });
  const h1t = T(h1, "26,000", 0, 470, 124, INK, HALO());
  const h1w = h1t.getComputedTextLength(), h1x = 540 - (h1w + 110) / 2;
  h1t.setAttribute("x", h1x);
  const t26 = wt("s1", "twentysix");
  typeOn(h1t, t26 - 0.04, 0.26); show(h1, t26 - 0.04);
  const h1s = G(h1); star(h1s, 0, 0, 44); pop(h1s, wt("s1", "thousand") - 0.02, h1x + h1w + 70, 430);
  tw(h1, { opacity: 1, y: 0 }, { opacity: 0, y: -18, duration: 0.16, ease: "power2.in" }, wt("s2", "andrej") - 0.3);
  const ul1 = scribble(S1.top, h1x, h1x + h1w + 110, 498, EX.orange, 4, 5); drawIn(ul1, wt("s1", "anyway") - 0.06, 0.28);
  fade(ul1, wt("s2", "andrej") - 0.3, 0.16);
  // the note arrives and counts to 26,016 (the "never again!" note leaves for it)
  noteA.to({ o: 1, s: 1 }, t26 - 0.16, 0.28, "back.out(2)");
  count(0, 26016, t26 - 0.02, 0.62);
  burst(p1.x, p1.y + 40, wt("s1", "saved") - 0.06, 0.7, 5, -1);
  // s2: push in on the same laptop
  const pIn = C(540, 790, FS * 1.08, 540, 820);
  cam(pIn, L0("s2") - 0.36, 0.56, "sine.inOut"); camLast = pIn;
  head(S1.top, "Andrej Karpathy", wt("s2", "andrej") - 0.04, null, INK, 90, 440);
  note(S1.top, ["one of OpenAI's founders"], 540, 516, 46, INK2, wt("s2", "one") - 0.04, { anchor: "middle", cps: 48 });
  const tNote = wt("s2", "wrote") - 0.1;
  fade(bodyA, tNote, 0.15);
  note(S1.top, ["README"], 254, 776, 46, EX.blue, tNote + 0.08, { cps: 40 });
  fade(web, tNote, 0.15); fade(spider, tNote, 0.15);
  const q1 = T(S1.top, "“I'm not going to", 254, 862, 54, INK), q2 = T(S1.top, "support it in any way.”", 254, 936, 54, INK);
  fitT(q2, 560); q1.setAttribute("font-size", q2.getAttribute("font-size"));
  const q2w = q2.getComputedTextLength();
  typeLines([q1, q2], ["“I'm not going to", "support it in any way.”"], wt("s2", "im") - 0.1, wt("s2", "any") + 0.02, 5);
  const ulq = scribble(S1.top, 254, 254 + q2w, 960, EX.red, 6, 5); drawIn(ulq, wt("s2", "any") + 0.04, 0.3);

  // ====================================================================================================
  // S3 (1,0) s3: the whole site, a terminal listing the projects
  // ====================================================================================================
  const S3 = station(1, 0);
  travel(F(1, 0), "s3", 0.42);
  const tT3 = L0("s3") + 0.1 - 0.42;
  const p3 = NP(1, 0, 758, 762);
  noteA.to({ x: p3.x, y: p3.y, r: -3 }, tT3, 0.42, "expo.inOut");
  win(S3.mid, 135, 520, 810, 660, "", 72);
  drawIn(S3.mid, PRE("s3"), 0.4);
  note(S3.top, ["darkhorselabs.dev"], 250, 571, 44, INK2, wt("s3", "site") - 0.04, { cps: 50 });
  const pr = M(S3.top, "root@darkhorselabs:~$ ls", 166, 652, 44, EX.green);
  typeLines([pr], ["root@darkhorselabs:~$ ls"], PRE("s3") + 0.3, PRE("s3") + 0.8, 2);
  const mg = G(S3.top); rell(mg, 0, 0, 92, 92, { strokeWidth: 6 }); rline(mg, 32, 32, 74, 74, { strokeWidth: 10 });
  const mgA = GA(mg, { x: 560, y: 960, o: 0, s: 0.4 });
  mgA.to({ o: 1, s: 1 }, wt("s3", "actually") - 0.08, 0.25, "back.out(2)").to({ x: 300, y: 880 }, wt("s3", "actually") + 0.2, 0.7, "sine.inOut").to({ o: 0, s: 0.6 }, wt("s3", "collects") - 0.12, 0.14, "power2.in");
  const ROWS = ["llm-council", "firstmate", "pocketbase", "localsend", "llm.c", "+ 9 more"];
  const tFound = wt("s3", "collects") - 0.06;
  ROWS.forEach((s, i) => { const e = M(S3.top, s, 172, 735 + i * 58, 44, i === 5 ? INK2 : INK); tw(e, { opacity: 0 }, { opacity: 1, duration: 0.08 }, tFound + i * 0.06); });
  const tLike = wt("s3", "like") - 0.06;
  const hlr = G(S3.fx); rr(hlr, 154, 692, 330, 62, { stroke: EX.orange, strokeWidth: 4 }); drawIn(hlr, tLike, 0.25);
  const ar3 = arrow(S3.fx, 594, 730, 496, 722, { stroke: EX.orange, strokeWidth: 4 }, 0.08); drawIn(ar3, tLike + 0.12, 0.2);
  const tHP = wt("s3", "went") - 0.08;
  [793, 851, 909, 967].forEach((y, i) => tickPop(S3.top, 520, y - 12, tHP + i * 0.07, 0.9));
  note(S3.top, ["14 repos, hand-picked"], 168, 1140, 52, EX.green, wt("s3", "went") - 0.06, { cps: 40 });
  head(S3.top, "Dark Horse Labs", wt("s3", "dark") - 0.04, null, INK, 96);

  // ====================================================================================================
  // SF (2,0) s4 + s5 + s6: firstmate. You (the captain) talk to one first mate; it runs a crew, each on its own copy.
  // The note waits at the list and flies in on s6 ("already past eight thousand").
  // ====================================================================================================
  const robot = (p, x, yb, s = 1, col = INK, anchor = false) => {   // a sketch robot, bottom centre at (x, yb), ~175 tall at s = 1
    const g = G(p, { transform: `translate(${x},${yb}) scale(${s})` });
    const o = { stroke: col, strokeWidth: 4 / Math.sqrt(s), roughness: 0.8 };
    rline(g, -34, -50, -60, -16, o); rline(g, 34, -50, 60, -16, o);
    rr(g, -34, -64, 68, 64, { ...o, fill: PAPER, fillStyle: "solid" });
    rline(g, 0, -140, 0, -158, o); el("circle", { cx: 0, cy: -164, r: 7, fill: EX.blue }, g);
    rr(g, -42, -140, 84, 70, { ...o, fill: PAPER, fillStyle: "solid" });
    [-16, 16].forEach((ex) => el("circle", { cx: ex, cy: -104, r: 7, fill: EX.blue }, g));
    if (anchor) { rpath(g, "M0 -52 L0 -12 M-15 -24 Q0 -2 15 -24 M-9 -46 L9 -46", { ...o, stroke: EX.orange, strokeWidth: 3.5 }); rell(g, 0, -57, 9, 9, { ...o, stroke: EX.orange, strokeWidth: 3 }); }
    return g;
  };
  const SF = station(2, 0);
  travel(F(2, 0), "s4");
  // drawn before the camera lands: you (the captain) and the first mate
  const capt = G(SF.mid);
  const cp0 = person(capt, 200, 920, 1.8, INK);
  rpath(cp0, "M-27 -142 Q-24 -166 0 -168 Q24 -166 27 -142 Z", { fill: EX.blue, fillStyle: "solid", stroke: INK, strokeWidth: 2.6 });
  rline(cp0, -32, -141, 34, -141, { strokeWidth: 3.2 });
  rpath(cp0, "M14 -142 L46 -136 L42 -130 L14 -134 Z", { fill: INK, fillStyle: "solid", strokeWidth: 2.4 });
  el("circle", { cx: 0, cy: -154, r: 4, fill: "#ffec99" }, cp0);
  const fm = robot(SF.mid, 660, 920, 1.3, INK, true);
  drawIn(SF.mid, PRE("s4"), 0.45);
  const heart = G(SF.top); rpath(heart, "M0 14 C-34 -8 -26 -36 0 -18 C26 -36 34 -8 0 14 Z", { stroke: EX.red, fill: EX.red, fillStyle: "solid", strokeWidth: 3 });
  pop(heart, wt("s4", "favourite") - 0.06, 250, 404, 1.2, -8);
  head(SF.top, "firstmate", wt("s4", "firstmate") - 0.06, null, INK, 100);
  note(SF.top, ["you"], 262, 905, 50, INK2, wt("s4", "you") - 0.04, { cps: 30 });
  // "You talk to just one AI": your request in a bubble; the first mate gets its name
  const cb = G(SF.top);
  rr(cb, 326, 604, 300, 128, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 3 });
  rpath(cb, "M336 700 L298 718 L344 722", { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  T(cb, "add dark", 476, 658, 50, INK, MID); T(cb, "mode", 476, 714, 50, INK, MID);
  const cbA = GA(cb, { x: 0, y: 0, o: 0 });
  cbA.to({ o: 1 }, wt("s4", "talk") - 0.08, 0.12);
  note(SF.top, ["first", "mate"], 762, 800, 50, EX.blue, wt("s4", "one", 1) - 0.06, { cps: 40, lh: 50 });
  // "runs a whole crew of coding agents": arrows fan out to three crew agents
  const CX = [230, 560, 870];
  const tRuns = wt("s4", "runs") - 0.08;
  CX.forEach((x, i) => { const a = arrow(SF.fx, 660 + (i - 1) * 34, 930, x + (660 - x) * 0.08, 978, { stroke: EX.blue, strokeWidth: 4 }, 0); drawIn(a, tRuns + i * 0.08, 0.25); });
  const tCrew = wt("s4", "crew") - 0.06;
  CX.forEach((x, i) => { const g = G(SF.mid); robot(g, 0, 0, 0.8, INK); const a = pop(g, tCrew + i * 0.1, x, 1136); const te = wt("s5", "each") - 0.06 + i * 0.08; a.to({ y: 1118 }, te, 0.12, "power2.out").to({ y: 1136 }, te + 0.12, 0.25, "back.out(3)"); });
  // s5: each on its own copy (a folder), done (ticks), reports back (the reply bubble)
  const tCopy = wt("s5", "copy") - 0.08;
  CX.forEach((x, i) => {
    const g = G(SF.top);
    rpath(g, `M${x - 72} 1146 L${x - 28} 1146 L${x - 16} 1158 L${x + 72} 1158 L${x + 72} 1206 L${x - 72} 1206 Z`, { fill: EX.yellowF, fillStyle: "hachure", stroke: EX.orange, strokeWidth: 3.5, hachureGap: 10 });
    drawIn(g, tCopy + i * 0.1, 0.3);
    note(SF.top, [`copy ${i + 1}`], x, 1254, 46, INK, tCopy + 0.12 + i * 0.1, { anchor: "middle", cps: 40 });
    tickPop(SF.top, x + 58, 1026, wt("s5", "done") - 0.08 + i * 0.08, 1.1);
  });
  const tRep = wt("s5", "reports") - 0.08;
  cbA.to({ o: 0 }, tRep - 0.1, 0.14);
  const rb = G(SF.top, { opacity: 0 });
  rr(rb, 436, 462, 508, 142, { fill: EX.greenF, fillStyle: "solid", stroke: EX.green, strokeWidth: 3.5 });
  rpath(rb, "M622 602 L652 686 L664 602", { fill: EX.greenF, fillStyle: "solid", stroke: EX.green, strokeWidth: 3.5 });
  tick(rb, 470, 506, 1.0, EX.green, 6);
  show(rb, wt("s5", "pr") - 0.26); drawIn(rb, wt("s5", "pr") - 0.26, 0.24);
  const rt1 = T(rb, "PR ready for review,", 500, 524, 50, INK), rt2 = T(rb, "captain.", 500, 584, 50, INK);
  fitT(rt1, 430); rt2.setAttribute("font-size", rt1.getAttribute("font-size"));
  typeLines([rt1, rt2], ["PR ready for review,", "captain."], wt("s5", "pr") - 0.06, wt("s5", "captain", 0, true) + 0.02, 7);
  tw(rb, { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.16, ease: "power2.in", immediateRender: false }, wt("s6", "june") - 0.26);
  // s6: one developer, since June; the note flies in and shows 8,380
  note(SF.top, ["1 developer"], 140, 540, 46, INK, wt("s6", "one") - 0.04, { cps: 40 });
  const jc = G(SF.top);
  rr(jc, 312, 598, 128, 118, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  rr(jc, 312, 598, 128, 34, { fill: EX.redF, fillStyle: "hachure", stroke: EX.red, strokeWidth: 3, hachureGap: 10 });
  T(jc, "JUN", 376, 698, 50, INK, MID);
  drawIn(jc, wt("s6", "june") - 0.08, 0.3);
  const pF = NP(2, 0, 765, 556);
  noteA.to({ x: pF.x, y: pF.y, r: 3 }, wt("s6", "eight") - 0.48, 0.44, "expo.out");
  count(26016, 8380, wt("s6", "eight") - 0.06, 0.05);
  burst(pF.x + 120, pF.y + 10, wt("s6", "saves") - 0.08, 0.6);

  // ====================================================================================================
  // PB (2,1) s7: PocketBase. One file; one guy wrote almost all of it; 61,625
  // ====================================================================================================
  const S4 = station(2, 1);
  travel(F(2, 1), "s7", 0.5);
  const p4 = NP(2, 1, 765, 600);
  noteA.to({ x: p4.x, y: p4.y, r: 3 }, L0("s7") + 0.1 - 0.5, 0.5, "expo.inOut");
  head(S4.top, "PocketBase", LAND("s7"), HOUT("s8"), INK, 96);
  count(8380, 61625, wt("s7", "pocketbase") - 0.02, 0.5);
  const fi = fileIcon(S4.mid, 150, 520, 300, 380);
  drawIn(fi, PRE("s7"), 0.4);
  const tApp = wt("s7", "app") - 0.08;
  const db = G(S4.top);
  rell(db, 232, 618, 96, 30, { stroke: EX.blue, strokeWidth: 4 });
  rpath(db, "M184 618 L184 694 Q232 716 280 694 L280 618", { stroke: EX.blue, strokeWidth: 4 });
  rpath(db, "M184 656 Q232 678 280 656", { stroke: EX.blue, strokeWidth: 3 });
  drawIn(db, tApp, 0.3);
  const lk = G(S4.top);
  rr(lk, 320, 640, 92, 70, { fill: EX.violetF, fillStyle: "hachure", stroke: EX.violet, strokeWidth: 4, hachureGap: 10 });
  rpath(lk, "M338 640 L338 616 Q366 584 394 616 L394 640", { stroke: EX.violet, strokeWidth: 4 });
  drawIn(lk, tApp + 0.12, 0.3);
  const fo = G(S4.top);
  rpath(fo, "M210 760 L262 760 L278 778 L392 778 L392 852 L210 852 Z", { fill: EX.yellowF, fillStyle: "hachure", stroke: EX.orange, strokeWidth: 4, hachureGap: 11 });
  drawIn(fo, tApp + 0.24, 0.3);
  note(S4.top, ["1 file"], 300, 968, 60, EX.blue, wt("s7", "single") - 0.04, { anchor: "middle", cps: 30 });
  const dev = person(S4.mid, 765, 962, 1.6, INK); drawIn(dev, wt("s7", "one") - 0.1, 0.35);
  note(S4.top, ["1 developer"], 765, 1022, 50, INK, wt("s7", "guy") - 0.04, { anchor: "middle", cps: 40 });
  const tBar = wt("s7", "one") - 0.04;
  const barO = G(S4.mid); rr(barO, 150, 1062, 780, 64, { strokeWidth: 3.5 }); drawIn(barO, tBar, 0.3);
  note(S4.top, ["98 of every 100 changes"], 540, 1208, 54, INK, tBar, { anchor: "middle", cps: 32 });
  rise(S4.back, 150, 1062, 780 * 0.98, 64, { fill: EX.green, fillStyle: "hachure", stroke: EX.green, strokeWidth: 3.5, hachureGap: 12 }, wt("s7", "almost") - 0.08, 0.8, true, "power2.out");
  burst(p4.x, p4.y - 40, wt("s7", "pocketbase") + 0.4);

  // ====================================================================================================
  // LS (1,1) s8: LocalSend. Basically AirDrop for any phone and any laptop, no internet; 96,192
  // ====================================================================================================
  const S5 = station(1, 1);
  travel(F(1, 1), "s8", 0.45, 18);
  const p5 = NP(1, 1, 784, 560);
  noteA.to({ x: p5.x, y: p5.y, r: -4 }, L0("s8") + 0.1 - 0.45, 0.45, "expo.inOut");
  head(S5.top, "LocalSend", LAND("s8"), null, INK, 96);
  const ph = G(S5.mid);
  rr(ph, 150, 580, 160, 300, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rr(ph, 166, 612, 128, 228, { stroke: INK2, strokeWidth: 2.2 });
  el("circle", { cx: 230, cy: 860, r: 7, fill: INK2 }, ph);
  laptop(S5.mid, 520, 664, 380);
  drawIn(S5.mid, PRE("s8"), 0.4);
  note(S5.top, ["like AirDrop"], 540, 1214, 56, EX.blue, wt("s8", "airdrop") - 0.06, { anchor: "middle", cps: 44 });
  const tPh = wt("s8", "phone") - 0.08;
  const arc5 = arrow(S5.fx, 250, 600, 652, 740, { stroke: EX.blue, strokeWidth: 4, strokeLineDash: [14, 10] }, -0.32); drawIn(arc5, tPh, 0.35);
  const fl = G(S5.fx); fileIcon(fl, -30, -38, 60, 76, { stroke: EX.blue, fill: EX.blueF, fillStyle: "solid", boil: false });
  const flA = GA(fl, { x: 230, y: 720, o: 0, s: 0.6, r: -8 });
  flA.to({ o: 1, s: 1 }, tPh - 0.05, 0.12).to({ x: 450, y: 520, r: 6 }, tPh + 0.1, 0.32, "power1.out").to({ x: 710, y: 782, r: 0 }, wt("s8", "laptop") - 0.2, 0.3, "power2.in");
  note(S5.top, ["any phone"], 230, 950, 50, INK2, wt("s8", "phone") - 0.1, { anchor: "middle", cps: 40 });
  note(S5.top, ["any laptop"], 710, 980, 50, INK2, wt("s8", "laptop") - 0.1, { anchor: "middle", cps: 40 });
  const ip = G(S5.mid);
  rr(ip, 310, 1020, 480, 104, { strokeWidth: 3.5 });
  [52, 34, 16].forEach((r) => rarc(ip, 384, 1096, r * 2, r * 2, -Math.PI * 0.78, -Math.PI * 0.22, { strokeWidth: 3.5 }));
  el("circle", { cx: 384, cy: 1094, r: 5, fill: INK }, ip);
  T(ip, "no internet", 452, 1088, 50, INK);
  drawIn(ip, wt("s8", "no") - 0.08, 0.3);
  const x1 = xmark(S5.top, 384, 1070, 36); drawIn(x1, wt("s8", "internet") - 0.04, 0.2);
  count(61625, 96192, wt("s8", "ninetysix") - 0.06, 0.5);

  // ====================================================================================================
  // s9: pull back over the whole board (s8 end). Small text clears, each station gets its big name; the horse wins
  // ====================================================================================================
  const WIDE = C(1690, 1650, 0.275, 540, 740);
  const tPull = L0("s9") - 0.06;
  cam(WIDE, tPull, 0.55, "power2.inOut");
  camLast = WIDE;
  const STS = [S1, S3, SF, S4, S5];
  const tClr = tPull - 0.02;
  STS.forEach((S) => [...S.g.querySelectorAll("text")].forEach((e) => tw(e, { opacity: 1 }, { opacity: 0, duration: 0.22, ease: "power1.in", immediateRender: false }, tClr)));
  const RECAP = el("g", {}, D);
  const RL = [[0, 0, "Saturday", 0], [1, 0, "the list", 0], [2, 0, "firstmate", 0], [2, 1, "PocketBase", 0], [1, 1, "LocalSend", 0]];
  RL.forEach(([col, row, s, t, mw], i) => {
    const g = G(RECAP, { opacity: 0 });
    const e = T(g, s, COLX[col] + 540, ROWY[row] + 400, 205, INK, { ...MID, stroke: PAPER, "stroke-width": 30, "paint-order": "stroke" });
    fitT(e, mw || 1060);
    const tt = tPull + 0.18;
    show(g, tt, 0.2);
  });
  const pH = { x: 540, y: 2470 };   // the empty cell of the board: the note, big
  noteA.to({ x: pH.x, y: pH.y, s: 3.3, r: -3 }, tPull, 0.55, "power2.inOut");
  burst(pH.x, pH.y - 260, tPull + 0.2, 2.2, 6);

  // ====================================================================================================
  // s9: a clean end card. The board clears; the note sticks to the address; the Follow button pops on "Follow" and is clicked.
  // ECARD is drawn in screen units (the camera holds the wide shot, so this group undoes it).
  // ====================================================================================================
  const tEnd = wt("s9", "darkhorselabs") - 0.05;
  STS.forEach((S) => tw(S.g, { opacity: 1 }, { opacity: 0, duration: 0.14, immediateRender: false }, tEnd));
  tw(RECAP, { opacity: 1 }, { opacity: 0, duration: 0.14, immediateRender: false }, tEnd);
  const ECARD = el("g", { transform: `translate(${-WIDE.x / WIDE.s},${-WIDE.y / WIDE.s}) scale(${1 / WIDE.s})` }, D);
  const toW = (dx, dy) => ({ x: (dx - WIDE.x) / WIDE.s, y: (dy - WIDE.y) / WIDE.s });
  const nE = toW(822, 376);
  noteA.to({ x: nE.x, y: nE.y, s: 0.9 / WIDE.s, r: 7 }, tEnd, 0.32, "expo.inOut");
  note(ECARD, ["the full list"], 420, 440, 66, INK2, tEnd + 0.15, { anchor: "middle", cps: 50 });
  const box = G(ECARD); rr(box, 100, 484, 880, 180, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 5 });
  drawIn(box, tEnd + 0.15, 0.28);
  const adr = G(ECARD, { opacity: 0 });
  const ae = T(adr, "darkhorselabs.dev", 540, 610, 112, INK, { ...MID, stroke: PAPER, "stroke-width": 12, "paint-order": "stroke" });
  fitT(ae, 830);
  typeOn(ae, tEnd + 0.2, 0.6); show(adr, tEnd + 0.2);
  note(ECARD, ["14 hand-picked repos"], 540, 744, 62, INK, wt("s9", "dot") - 0.02, { anchor: "middle", cps: 40 });
  // send it to a friend who builds things on weekends
  const fr = G(ECARD); person(fr, 0, 0, 1.6, INK);
  const frA = GA(fr, { x: 800, y: 1046, o: 0, s: 0.6 });
  frA.to({ o: 1, s: 1 }, wt("s9", "friend") - 0.1, 0.3, "back.out(2)");
  const pl2 = G(ECARD), pl2A = GA(pl2, { x: 190, y: 990, s: 1.3, o: 0, r: -12 });
  rpath(pl2, "M-60 12 L60 -24 L-12 36 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rpath(pl2, "M-12 36 L0 7 L60 -24", { strokeWidth: 3.5 });
  const tS = wt("s9", "send");
  pl2A.to({ o: 1, s: 1.3 }, tS - 0.12, 0.14).to({ x: 520, y: 920, r: -6 }, tS + 0.02, 0.55, "sine.inOut").to({ x: 740, y: 890, s: 0.9, r: 4 }, tS + 0.57, 0.3, "power2.in").to({ o: 0 }, tS + 0.87, 0.1);
  const hm = G(ECARD); rline(hm, 0, 0, 0, 56, { strokeWidth: 6 }); rr(hm, -24, -14, 48, 26, { fill: EX.orange, fillStyle: "solid", stroke: EX.orange, strokeWidth: 3 });
  const hmA = pop(hm, wt("s9", "builds") - 0.06, 862, 900, 1.3, 20);
  [51.5, 52.7].forEach((t) => hmA.to({ r: -14 }, t, 0.12, "power2.in").to({ r: 20 }, t + 0.12, 0.25, "back.out(3)"));
  const wk = G(ECARD); pill(wk, "Sat, Sun", 0, 0, EX.red, EX.redF, 54, "hachure");
  pop(wk, wt("s9", "weekends") - 0.06, 560, 880, 1, -3);
  const tF = wt("s9", "follow");
  const FBX = 540, FBY = 1180;
  const fb = G(ECARD), fbA = GA(fb, { x: FBX, y: FBY, s: 0.4, o: 0, r: -2 });
  const fbOff = G(fb), fbOn = G(fb, { opacity: 0 });
  rr(fbOff, -270, -80, 540, 160, { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  T(fbOff, "+ Follow", 0, 28, 86, INK, MID);
  rr(fbOn, -270, -80, 540, 160, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  T(fbOn, "Following", 40, 26, 76, INK, MID);
  tick(fbOn, -200, 0, 1.3, EX.green, 7);
  fbA.to({ o: 1, s: 1 }, tF - 0.1, 0.26, "back.out(2)");
  const cur = G(ECARD), curA = GA(cur, { x: 940, y: 1320, o: 0 });
  rpath(cur, "M0 0 L0 64 L15 50 L27 76 L39 71 L27 44 L49 44 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.6, roughness: 0.7 });
  const tCk = tF + 0.25;
  curA.to({ o: 1 }, tCk - 0.32, 0.06).to({ x: FBX + 220, y: FBY + 38 }, tCk - 0.3, 0.28, "power3.out");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  fbA.to({ s: 0.93 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.16, "back.out(3)");
  hide(fbOff, tCk + 0.04, 0.08); show(fbOn, tCk + 0.04);
  const crg = G(ECARD), cra = GA(crg, { x: FBX + 220, y: FBY + 38, s: 0.3, o: 0 });
  rell(crg, 0, 0, 120, 120, { stroke: EX.blue, strokeWidth: 4, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.5, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  curA.to({ o: 0, x: 880, y: 1300 }, tCk + 0.7, 0.3, "power2.in");
  // small life on the held card: the note wiggles once, the friend waves the hammer
  noteA.to({ r: 2 }, tCk + 1.2, 0.18, "power2.out").to({ r: 7 }, tCk + 1.38, 0.3, "back.out(3)");

  // layer order: the end card, the recap names, the bursts and the note sit on top of the board
  D.appendChild(RECAP); D.appendChild(ECARD); D.appendChild(BURST); D.appendChild(NOTE);
