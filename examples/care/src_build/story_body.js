  { const r = defs.querySelector("#safeclip rect"); if (r) { r.setAttribute("x", -140); r.setAttribute("y", -250); r.setAttribute("width", 1360); r.setAttribute("height", 2420); } }
  const HOOKS = [];   // functions of the boil clock time (seek-safe per-frame state: flies)
  const DARKT = "#1e1e1e";
  const NUMF = (v) => Math.round(v).toLocaleString("en-US");
  const SB = (col, row) => ({ x: COLX[col], y: ROWY[row] });
  // a quick camera jolt around the current framing (never snaps back to wide)
  const shake = (t, k = 1) => [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => cam({ s: camLast.s, x: camLast.x + dx * k, y: camLast.y + dy * k }, t + i * 0.045, 0.045, "none"));
  const BROWN = cx("#846358"), BROWNF = cx("#eaddd7");
  const LG = LT.EX.green, LR = LT.EX.red;   // ink on the yellow note (a light paper)

  // ---------- small drawings ----------
  const person = (p, x, y, s = 1, col = INK) => {   // a generic stick person, feet at (x, y)
    const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
    const o = { stroke: col, strokeWidth: 3.6 / Math.sqrt(s), roughness: 0.7 };
    rpath(g, "M0 -100 L0 -46 M0 -88 L-22 -60 M0 -88 L30 -96 M0 -46 L-16 0 M0 -46 L16 0", o);
    rell(g, 0, -124, 46, 46, { ...o, fill: PAPER, fillStyle: "solid" });
    return g;
  };
  const starD = (x, y, r) => { let d = ""; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr0 = k % 2 ? r * 0.45 : r; d += (k ? " L" : "M") + (x + rr0 * Math.cos(a)).toFixed(1) + " " + (y + rr0 * Math.sin(a)).toFixed(1); } return d + " Z"; };
  const star = (p, x, y, r, o = {}) => rpath(p, starD(x, y, r), { fill: "#ffd43b", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 3.5, roughness: 0.6, ...o });
  const fileIcon = (p, x, y, w, h, o = {}) => {   // a dog-eared document, top-left (x, y)
    const g = G(p), d = Math.min(w, h) * 0.22;
    rpath(g, `M${x} ${y} L${x + w - d} ${y} L${x + w} ${y + d} L${x + w} ${y + h} L${x} ${y + h} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 4, ...o });
    rpath(g, `M${x + w - d} ${y} L${x + w - d} ${y + d} L${x + w} ${y + d}`, { strokeWidth: 3, ...o });
    return g;
  };
  const robot = (p, x, yb, s = 1, col = INK) => {   // a small sketch robot (another coding AI), bottom centre at (x, yb)
    const g = G(p, { transform: `translate(${x},${yb}) scale(${s})` });
    const o = { stroke: col, strokeWidth: 4 / Math.sqrt(s), roughness: 0.8 };
    rline(g, -34, -50, -60, -16, o); rline(g, 34, -50, 60, -16, o);
    rr(g, -34, -64, 68, 64, { ...o, fill: PAPER, fillStyle: "solid" });
    rline(g, 0, -140, 0, -158, o); el("circle", { cx: 0, cy: -164, r: 7, fill: EX.blue }, g);
    rr(g, -42, -140, 84, 70, { ...o, fill: PAPER, fillStyle: "solid" });
    [-16, 16].forEach((ex) => el("circle", { cx: ex, cy: -104, r: 7, fill: EX.blue }, g));
    return g;
  };
  const wr = (p, s, x, y, size, col, t, { anchor = "start", cps = 36, maxW = 810, halo = true } = {}) => {   // fitted handwriting, typed on its word
    const g = G(p, { opacity: 0 });
    const e = T(g, s, x, y, size, col, { "text-anchor": anchor, ...(halo ? HALO() : {}) });
    fitT(e, maxW); typeOn(e, t, s.length / cps); show(g, t);
    g._e = e;
    return g;
  };
  const bigQ = (p, x, y, t, rot) => { const g = G(p); T(g, "?", 0, 40, 150, EX.red, { ...MID, ...HALO() }); return pop(g, t, x, y, 1, rot); };
  const sparkle = (p, x, y, t, r = 30, col = EX.orange) => {   // four short lines that flash out
    const g = G(p, { opacity: 0 });
    [0, 90, 180, 270, 45, 135, 225, 315].forEach((a, i) => { const k = i < 4 ? 1 : 0.6, c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); rline(g, x + c * r * 0.5, y + s * r * 0.5, x + c * r * (1 + k), y + s * r * (1 + k), { stroke: col, strokeWidth: 4, roughness: 0.6, boil: false }); });
    show(g, t); drawIn(g, t, 0.16, "power2.out"); hide(g, t + 0.55, 0.15);
    return g;
  };
  const testPill = (p) => {   // a green "tests" chip with a drawn tick
    const g = G(p);
    rr(g, -95, -36, 190, 72, { stroke: EX.green, fill: EX.greenF, fillStyle: "solid", strokeWidth: 3 });
    T(g, "tests", -24, 15, 48, INK, MID); tick(g, 60, -2, 1.1, EX.green, 6);
    return g;
  };
  const pillA = (p, s, col, colF, x, y, size = 44, r = 0) => { const g = G(p); pill(g, s, 0, 0, col, colF, size, "solid"); return { g, a: GA(g, { x, y, s: 0.3, o: 0, r }) }; };

  // ---------- figures: Nadia (ponytail) and her AI (a hovering robot) ----------
  const NP = {};
  ["stand", "wave", "point", "oops", "cheer", "think", "shrug", "proud"].forEach((k) => (NP[k] = { ...VP[k], kind: "nora" }));
  NP.stand.m = "smile"; NP.think.m = "flat"; NP.oops.m = "o";
  const RP = {
    blank: { ...VP.stand, kind: "bot", m: "flat", look: 0 },
    type: { ...VP.type, kind: "bot", m: "flat", look: -0.6 }, type2: { ...VP.type2, kind: "bot", m: "flat", look: -0.6 },
    think: { ...VP.think, kind: "bot", m: "flat", look: 0.4 }, shrug: { ...VP.shrug, kind: "bot", m: "flat" },
    keen: { ...VP.stand, kind: "bot", m: "big", look: 0 }, cheer: { ...VP.cheer, kind: "bot" }, wave: { ...VP.wave, kind: "bot" },
    ktype: { ...VP.type, kind: "bot", m: "big", look: 0.6 }, ktype2: { ...VP.type2, kind: "bot", m: "big", look: 0.6 }, proud: { ...VP.proud, kind: "bot" },
    reach: { ...VP.stand, la: [-80, -76], kind: "bot", m: "flat", look: -1 },
    typeL: { ...VP.type, la: [-62, -104], ra: [-52, -100], kind: "bot", m: "flat", look: -0.6 }, typeL2: { ...VP.type2, la: [-56, -108], ra: [-58, -96], kind: "bot", m: "flat", look: -0.6 },
  };
  NP.pointL = { ...VP.stand, la: [-112, -124], m: "big", look: -1, kind: "nora" };

  // ====================================================================================================
  // THE APP: the one travelling object. A neat box of four blocks (S1), two blocks crack (S2), patches stack on it (S3),
  // it turns into a ball of mud (S4), it drops into S9 and is untangled into six neat blocks (S9-S10). Local origin: centre.
  // ====================================================================================================
  const APP = el("g", {}, null);
  const b1 = SB(0, 0);
  const appA = GA(APP, { x: b1.x + 540, y: b1.y + 1045, s: 1.55, o: 1, r: 0 });
  const AW = 300, AH = 260;
  const appBox = G(APP), appBoxA = GA(appBox, { x: 0, y: 0, s: 1, o: 1, r: 0 });
  rr(appBox, -AW / 2, -AH / 2, AW, AH, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  const lblG = G(appBox);
  const appLbl = T(lblG, "app", 0, -AH / 2 - 36, 50, INK2, { ...MID, ...HALO() });
  const appLbl2 = T(lblG, "Nadia's app", 0, -AH / 2 - 36, 50, INK2, { ...MID, ...HALO(), opacity: 0 });
  const BLK = [[-70, -60, EX.blue, EX.blueF], [70, -60, EX.green, EX.greenF], [-70, 60, EX.violet, EX.violetF], [70, 60, EX.orange, EX.yellowF]];
  const block = (p, c, f, w = 120, h = 100) => {
    const g = G(p);
    rr(g, -w / 2, -h / 2, w, h, { stroke: c, fill: f, fillStyle: "hachure", strokeWidth: 3, hachureGap: 12 });
    rline(g, -w / 2 + 18, -12, w / 2 - 18, -12, { stroke: INK, strokeWidth: 3, roughness: 0.6 });
    rline(g, -w / 2 + 18, 18, w / 2 - 44, 18, { stroke: INK, strokeWidth: 3, roughness: 0.6 });
    return g;
  };
  const blocks = BLK.map(([x, y, c, f]) => { const g = block(appBox, c, f); return { g, a: GA(g, { x, y, r: 0, o: 1 }) }; });
  const crack = (bi) => { const k = rpath(blocks[bi].g, "M-56 -46 L-30 -14 L-14 -30 L8 12 L24 -2 L54 44", { stroke: EX.red, strokeWidth: 6, roughness: 0.9 }); k.setAttribute("opacity", 0); return k; };
  const CRK = [crack(0), crack(3)];
  // patches: stuck on the box, then on the ball. [x, y, rot, w]
  const PATCH = [[-40, -100, -10, 170], [90, -86, 14, 150], [-130, 30, 72, 140], [30, -40, -22, 160],
                 [128, 90, -64, 150], [-60, 128, 8, 170], [-150, -80, 38, 130], [70, 150, -12, 150], [0, 40, 30, 140]];
  const PG = G(APP);
  const patches = PATCH.map(([x, y, r, w], i) => {
    const g = G(PG);
    rr(g, -w / 2, -24, w, 48, { fill: "#ffec99", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 3, roughness: 1.2 });
    [-0.25, 0, 0.25].forEach((f) => rline(g, w * f - 8, -14, w * f + 8, 14, { stroke: "#f08c00", strokeWidth: 2.5, roughness: 0.6 }));
    return { g, a: GA(g, { x, y, r, s: 1.7, o: 0 }) };
  });
  const slap = (i, t) => patches[i].a.to({ o: 1 }, t - 0.02, 0.01).to({ s: 1 }, t - 0.01, 0.12, "power4.in");
  // the ball of mud (hidden until S4)
  const BALL = G(APP, { opacity: 0 }), BALLI = G(BALL);
  const ballA = GA(BALLI, { x: 0, y: 0, s: 1, r: 0 });
  rell(BALLI, 0, 0, 430, 410, { stroke: BROWN, fill: BROWNF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 14 });
  const strand = (seed, R0) => {
    const R = rng(seed); let a = R() * 6.28, r = R0 * (0.4 + R() * 0.5);
    let d = `M${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    for (let i = 0; i < 16; i++) {
      const a2 = a + 1.2 + R() * 2.4, r2 = R0 * (0.25 + R() * 0.72), ac = (a + a2) / 2 + (R() - 0.5), rc0 = R0 * (0.2 + R() * 0.9);
      d += ` Q${(Math.cos(ac) * rc0).toFixed(1)} ${(Math.sin(ac) * rc0).toFixed(1)} ${(Math.cos(a2) * r2).toFixed(1)} ${(Math.sin(a2) * r2).toFixed(1)}`;
      a = a2;
    }
    return d;
  };
  const STR = [[11, INK, 4], [23, BROWN, 5], [37, INK2, 3.5], [41, BROWN, 4]].map(([sd, c, w]) => rpath(BALLI, strand(sd, 190), { stroke: c, strokeWidth: w, roughness: 1.4 }));
  // the neat app after the clean-up (hidden until S9): a frame and six blocks in a 3 x 2 grid
  const NEAT = G(APP, { opacity: 0 });
  const NF = G(NEAT);
  rr(NF, -215, -165, 430, 330, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  T(NF, "Nadia's app", 0, -190, 50, INK2, { ...MID, ...HALO() });
  const NB = [[-135, -72, EX.blue, EX.blueF], [0, -72, EX.green, EX.greenF], [135, -72, EX.violet, EX.violetF], [-135, 72, EX.orange, EX.yellowF], [0, 72, EX.blue, EX.blueF]]
    .map(([x, y, c, f]) => { const g = block(NEAT, c, f, 118, 118); return { g, x, y, a: GA(g, { x: 0, y: 0, s: 0.3, o: 0, r: 25 }) }; });
  const NB6 = G(NEAT); rr(NB6, -59, -59, 118, 118, { stroke: EX.green, fill: EX.greenF, fillStyle: "solid", strokeWidth: 3.5 });
  T(NB6, "new", 0, -2, 40, INK, MID); tick(NB6, 0, 30, 0.9, EX.green, 5);
  const nb6A = GA(NB6, { x: 135, y: 72, s: 0.3, o: 0 });

  // ====================================================================================================
  // THE SCORE NOTE: the second travelling object. Written inside the robot's head (S6), carried to Matt (S7),
  // updated on S10. Local origin: centre. Light paper, so its ink is the light-theme ink.
  // ====================================================================================================
  const NOTE = el("g", {}, null);
  rr(NOTE, -260, -170, 520, 340, { fill: "#ffec99", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 3, roughness: 0.8 });
  T(NOTE, "score", 0, -104, 54, DARKT, MID);
  rline(NOTE, -70, -88, 70, -88, { stroke: DARKT, strokeWidth: 2.5, roughness: 0.8 });
  const m1 = G(NOTE, { opacity: 0 }), m1i = G(m1); T(m1i, "+1", 0, 26, 76, LG, MID);
  const m1A = GA(m1i, { x: -170, y: -6 });
  const m2 = G(NOTE, { opacity: 0 }); T(m2, "+0", -170, 130, 76, LR, MID);
  const r1 = T(NOTE, "tests pass", -100, 16, 60, DARKT);
  const r2 = T(NOTE, "clean code", -100, 126, 60, DARKT);
  const r2b = T(NOTE, "code clean", -100, 126, 60, DARKT); r2b.setAttribute("opacity", 0);
  const x2 = scribble(NOTE, -215, -125, 148, LR, 9, 5); x2.setAttribute("opacity", 0);
  const k1 = G(NOTE, { opacity: 0 }); tick(k1, -170, -4, 1.6, LG, 8);
  const k2 = G(NOTE, { opacity: 0 }); tick(k2, -170, 106, 1.6, LG, 8);
  const noteA = GA(NOTE, { x: 0, y: 0, s: 1, o: 0, r: -2 });
  const npulse = (t) => noteA.to({ s: noteA._s * 1.08 }, t, 0.1, "power2.out").to({ s: noteA._s }, t + 0.1, 0.3, "back.out(3)");

  // ====================================================================================================
  // S1 (0,0) c1: the question, written big over Nadia's neat little app. Features drop in; one block tips.
  // ====================================================================================================
  const S1 = station(0, 0);
  cam(F(0, 0, 0.96), 0, 0.01, "none");
  cam(F(0, 0), 0.02, 3.9, "sine.inOut");   // a slow creep from frame 0
  camLast = F(0, 0);
  const hq = G(S1.top);
  const HQ = [["WHY DOES", wt("c1", "why") - 0.1, 400, INK, 122], ["AI CODE GET", wt("c1", "ai") - 0.08, 530, INK, 122], ["MESSIER?", wt("c1", "messier") - 0.1, 685, EX.red, 156]];
  HQ.forEach(([s, t, y, col, size]) => { const e = T(hq, s, 540, y, size, col, { ...MID, ...HALO() }); fitT(e, MAXW); typeOn(e, t, s.length / 30); });
  const ulq = scribble(S1.top, 270, 810, 712, EX.red, 3, 6); drawIn(ulq, wt("c1", "messier") + 0.28, 0.24);
  // the app is on screen from frame 0
  // "every new feature": two feature cards drop into the box; the box jolts and one block tips
  const tEv = wt("c1", "every") - 0.06, tFe = wt("c1", "feature") - 0.25;
  [[tEv - 0.3, 275, -8], [tFe - 0.1, 805, 8]].forEach(([t, x0, r], i) => {
    const f = pillA(S1.fx, "+ feature", EX.blue, EX.blueF, x0, 790, 46, r);
    const td = i ? t + 0.3 : t + 0.45;
    f.a.to({ o: 1, s: 1 }, t, 0.12, "back.out(2)").to({ x: 540, y: 1045, s: 0.3, r: 0 }, td, 0.17, "power3.in").to({ o: 0 }, td + 0.17, 0.01);
    appA.to({ s: 1.62, r: i ? 2 : -2 }, td + 0.17, 0.05, "power2.out").to({ s: 1.55, r: 0 }, td + 0.22, 0.1, "power2.out");
  });
  blocks[1].a.to({ r: 9, x: 76 }, tFe + 0.55, 0.2, "back.out(3)");

  // ====================================================================================================
  // S2 (1,0) c2: Nadia and her AI by the same box. A new feature goes in; two old blocks crack. "So I looked."
  // ====================================================================================================
  const S2 = station(1, 0), b2 = SB(1, 0);
  const t2 = L0("c2") + 0.1 - 0.45;
  travel(F(1, 0), "c2", 0.45);
  appA.to({ x: b2.x + 545, y: b2.y + 770, s: 1.25 }, t2, 0.45, "expo.inOut");
  const NAD2 = figure(S2.mid, NP, "nora", 205, 1290, 1.2);
  NAD2.key(0, "stand");
  const BOT2 = figure(S2.mid, RP, "bot", 860, 1290, 1.1);
  BOT2.key(0, "blank");
  drawIn(S2.mid, PRE("c2"), 0.4);
  const tNa = wt("c2", "nadias");
  wr(S2.top, "Nadia", 205, 760, 70, EX.blue, tNa - 0.06, { anchor: "middle", cps: 26 });
  NAD2.key(tNa - 0.05, "wave").key(tNa + 0.9, "stand");
  const tAI2 = wt("c2", "ai");
  BOT2.a.to({ s: 1.25 }, tAI2 - 0.06, 0.1, "power2.out").to({ s: 1.1 }, tAI2 + 0.04, 0.3, "back.out(3)");
  const lb2 = wr(S2.top, "her AI", 860, 745, 56, INK2, tAI2 - 0.04, { anchor: "middle", cps: 30, maxW: 160 });
  const tBu = wt("c2", "built");
  for (let k = 0; k < 6; k++) BOT2.key(tBu - 0.04 + k * 0.17, k % 2 ? "typeL2" : "typeL");
  BOT2.key(tBu + 1.05, "blank");
  const tWh = wt("c2", "whole");
  tw(appLbl, { opacity: 1 }, { opacity: 0, duration: 0.08, immediateRender: false }, tWh - 0.1);
  show(appLbl2, tWh - 0.04); typeOn(appLbl2, tWh - 0.04, 0.3);
  appA.to({ s: 1.33 }, tWh + 0.2, 0.08, "power2.out").to({ s: 1.25 }, tWh + 0.28, 0.3, "back.out(3)");
  // a new feature card leaves the robot and drops into the box
  const tNw = wt("c2", "every"), tFt = wt("c2", "feature");
  const f2 = pillA(S2.fx, "+ feature", EX.blue, EX.blueF, 800, 500, 48, 6);
  f2.a.to({ o: 1, s: 1 }, tNw - 0.06, 0.18, "back.out(2)").to({ x: 560, y: 770, s: 0.3, r: 0 }, tFt - 0.12, 0.24, "power3.in").to({ o: 0 }, tFt + 0.12, 0.01);
  fade(lb2, tNw - 0.1, 0.15);
  BOT2.key(tNw - 0.06, "reach").key(tFt + 0.3, "blank");
  // "breaks two old ones": two old blocks crack and tip
  const tBr = wt("c2", "breaks") - 0.04, tTw = wt("c2", "two") - 0.04;
  appA.to({ s: 1.31 }, tBr, 0.05, "power2.out").to({ s: 1.25 }, tBr + 0.05, 0.25, "back.out(3)");
  [[0, tBr, -14], [3, tTw, 12]].forEach(([bi, t, r], j) => {
    const k = CRK[j];
    tw(k, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t); drawIn(k, t, 0.14, "power2.out");
    blocks[bi].a.to({ r, y: BLK[bi][1] + 8 }, t + 0.04, 0.2, "back.out(3)");
    shake(t + 0.04, 0.9);
  });
  const brk = wr(S2.top, "2 broke!", 545, 495, 80, EX.red, wt("c2", "old") - 0.06, { anchor: "middle", cps: 30 });
  NAD2.key(tBr, "oops").key(wt("c2", "so") - 0.1, "think");
  // "So I looked at her code": a magnifying glass swings over the box
  const tLk = wt("c2", "looked") - 0.1;
  const mag = G(S2.fx), magA = GA(mag, { x: 760, y: 1240, s: 0.4, o: 0, r: 30 });
  rell(mag, 0, 0, 300, 300, { strokeWidth: 8, fill: EX.blueF, fillStyle: "hachure", hachureGap: 22, fillWeight: 1.5 });
  rline(mag, 106, 106, 210, 210, { strokeWidth: 18, roughness: 0.6 });
  magA.to({ o: 1 }, tLk, 0.01).to({ x: 500, y: 790, s: 1, r: 0 }, tLk + 0.01, 0.34, "back.out(1.6)");
  magA.to({ x: 560, y: 740, r: -6 }, tLk + 0.45, 0.4, "sine.inOut");
  fade(brk, L0("c3") - 0.5, 0.15);

  // ====================================================================================================
  // S3 (2,0) c3: every feature, a patch on top; a green "tests ✓" after each patch; the tests still pass.
  // ====================================================================================================
  const S3 = station(2, 0), b3 = SB(2, 0);
  const t3 = L0("c3") + 0.1 - 0.45;
  travel(F(2, 0), "c3", 0.45);
  magA.to({ x: 1100, y: 1100, o: 0 }, t3 - 0.05, 0.3, "power3.in");
  appA.to({ x: b3.x + 465, y: b3.y + 830, s: 1.45 }, t3, 0.45, "expo.inOut");
  const BOT3 = figure(S3.mid, RP, "bot", 170, 1295, 0.9);
  BOT3.key(0, "blank");
  drawIn(S3.mid, PRE("c3"), 0.3);
  // feature, patch, test: three rounds, then a fourth patch "on top"
  const tA = wt("c3", "asked") - 0.08, tF3 = wt("c3", "feature") - 0.04, tS = wt("c3", "stuck") - 0.06, tPa = wt("c3", "patch") - 0.04, tTp = wt("c3", "top") - 0.04;
  const rounds = [[tA - 0.25, tF3], [wt("c3", "the") - 0.3, tS], [null, tPa]];
  const TP = [];
  rounds.forEach(([tf, tp], i) => {
    if (tf != null) {
      const f = pillA(S3.fx, "+ feature", EX.blue, EX.blueF, 465 + (i ? 160 : -160), 460, 48, i ? 6 : -6);
      f.a.to({ o: 1, s: 1 }, tf, 0.14, "back.out(2)").to({ x: 465, y: 830, s: 0.3, r: 0 }, tp - 0.24, 0.2, "power3.in").to({ o: 0 }, tp - 0.04, 0.01);
    }
    slap(i, tp);
    BOT3.key(tp - 0.12, i % 2 ? "type2" : "type").key(tp + 0.2, "blank");
    appA.to({ s: 1.52 }, tp + 0.1, 0.05, "power2.out").to({ s: 1.45 }, tp + 0.15, 0.25, "back.out(3)");
    const tt = testPill(S3.top);
    pop(tt, tp + 0.3, 830, 610 + i * 112, 1.1, i % 2 ? 3 : -3);
    TP.push(tt);
  });
  slap(3, tTp);
  appA.to({ s: 1.52 }, tTp + 0.1, 0.05, "power2.out").to({ s: 1.45 }, tTp + 0.15, 0.25, "back.out(3)");
  { const tt = testPill(S3.top); pop(tt, tTp + 0.28, 830, 946, 1.1, 2); }
  head(S3.top, "a patch on top", wt("c3", "patch") - 0.06, null, INK, 92, 440, 40);
  // "And the tests still passed": a green ring round the test column, the robot cheers
  const tPs = wt("c3", "passed") - 0.04;
  ring(S3.fx, 830, 778, 250, 540, EX.green, wt("c3", "tests") - 0.04, 5);
  const ps3 = wr(S3.top, "passed!", 830, 1125, 66, EX.green, wt("c3", "passed") - 0.04, { anchor: "middle", cps: 30, maxW: 240 });
  BOT3.key(tPs - 0.06, "cheer");
  sparkle(S3.fx, 830, 778, tPs, 44, EX.green);

  // ====================================================================================================
  // S4 (2,1) c4: months of patches; the box turns into a ball of mud. "BIG BALL OF MUD".
  // ====================================================================================================
  const S4 = station(2, 1), b4 = SB(2, 1);
  const t4 = L0("c4") + 0.1 - 0.5;
  travel(F(2, 1), "c4", 0.5);
  appA.to({ x: b4.x + 565, y: b4.y + 860, s: 1.1 }, t4, 0.5, "expo.inOut");
  const mon = wr(S4.top, "a few months later...", 540, 440, 76, INK2, wt("c4", "after") - 0.04, { anchor: "middle", cps: 40 });
  // more patches, faster and faster
  const tM0 = wt("c4", "months") - 0.02;
  [4, 5, 6, 7, 8].forEach((i, k) => slap(i, tM0 + k * 0.1));
  appA.to({ r: -3 }, tM0 + 0.1, 0.12, "power2.out").to({ r: 3 }, tM0 + 0.22, 0.12, "power2.inOut").to({ r: 0 }, tM0 + 0.34, 0.14, "power2.out");
  // "it looked like this": the box gives way to the tangled ball
  const tLL = wt("c4", "looked") - 0.12;
  appBoxA.to({ s: 0.6, o: 0, r: -20 }, tLL, 0.3, "power3.in");
  show(BALL, tLL + 0.02);
  STR.forEach((s, i) => drawIn(s, tLL + 0.02 + i * 0.07, 0.5, "power1.out"));
  drawIn(BALLI.firstChild, tLL, 0.3);
  ballA.to({ s: 1.12, r: 8 }, tLL + 0.1, 0.4, "back.out(1.4)");
  appA.to({ s: 1.2 }, tLL + 0.1, 0.4, "power2.out");
  shake(wt("c4", "this") - 0.02, 1.4);
  // two flies circle the mud
  const FL = [0, 1].map(() => { const g = G(S4.fx, { opacity: 0 }); el("circle", { cx: 0, cy: 0, r: 7, fill: INK }, g); rell(g, -7, -9, 16, 10, { stroke: INK2, strokeWidth: 2, boil: false }); rell(g, 7, -9, 16, 10, { stroke: INK2, strokeWidth: 2, boil: false }); return g; });
  const tFly0 = wt("c4", "this") + 0.1, tFly1 = L0("c5") + 1.2;
  if (false) HOOKS.push((v) => FL.forEach((g, i) => {
    const on = v >= tFly0 && v < tFly1;
    g.setAttribute("opacity", on ? 1 : 0);
    if (on) { const a = (v - tFly0) * (i ? -3.1 : 2.6) + i * 2.2; g.setAttribute("transform", `translate(${(565 + Math.cos(a) * (315 + i * 15)).toFixed(1)},${(860 + Math.sin(a * 1.3) * 190).toFixed(1)})`); }
  }));
  // "Programmers call it": a programmer pops in and names it
  const tPr = wt("c4", "programmers") - 0.06;
  const prg = G(S4.mid); person(prg, 0, 0, 1.25); pop(prg, tPr, 175, 1270, 1);
  const pb = G(S4.top), pbA = GA(pb, { x: 205, y: 1000, s: 0.3, o: 0 });
  rr(pb, -88, -50, 176, 84, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 }); rpath(pb, "M-30 34 L-40 64 L-6 34", { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  T(pb, "it's a...", 0, 4, 44, INK, MID);
  pbA.to({ o: 1, s: 1 }, tPr + 0.2, 0.2, "back.out(2)");
  tw(mon, { opacity: 1, y: 0 }, { opacity: 0, y: -18, duration: 0.16, ease: "power2.in", immediateRender: false }, wt("c4", "big") - 0.35);
  const hm = head(S4.top, "BIG BALL OF MUD", wt("c4", "big") - 0.08, null, EX.orange, 100, 450, 22);
  cam(F(2, 1, 1.06), wt("c4", "programmers") - 0.2, 1.8, "sine.inOut"); camLast = F(2, 1, 1.06);   // a slow push-in on the mud
  const ulm = scribble(S4.top, 170, 910, 476, BROWN, 13, 6); drawIn(ulm, wt("c4", "mud") + 0.1, 0.24);
  pbA.to({ o: 0 }, L0("c5") - 0.2, 0.15);

  // ====================================================================================================
  // S5 (1,1) c5: pull back: not just her (other balls of mud), then push in on the GitClear bars for 2024.
  // ====================================================================================================
  const S5 = station(1, 1), b5 = SB(1, 1);
  travel(F(1, 1, 0.9), "c5", 0.5);
  const MB = [[290, 500, 51], [555, 470, 67], [820, 505, 79]].map(([x, y, sd], i) => {
    const g = G(S5.mid);
    rell(g, 0, 0, 200, 190, { stroke: BROWN, fill: BROWNF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 14 });
    [0, 1].forEach((k) => rpath(g, strand(sd + k, 88), { stroke: k ? BROWN : INK2, strokeWidth: 3.5, roughness: 1.4 }));
    rr(g, -60, -70, 110, 32, { fill: "#ffec99", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 2.5, boil: false });
    return { g, x, y };
  });
  const tNj = [L0("c5") - 0.02, wt("c5", "not") - 0.06, wt("c5", "her") - 0.04];
  const MBX = [270, 540, 810];
  const mbA = MB.map((m, i) => pop(m.g, tNj[i], MBX[i], 820, 1.3, (i - 1) * 8));
  const oa = wr(S5.top, "other apps too", 540, 1070, 66, INK2, wt("c5", "not") - 0.04, { anchor: "middle", cps: 36 });
  const tUp = wt("c5", "gitclear") - 0.6;
  mbA.forEach((a, i) => a.to({ x: MB[i].x, y: MB[i].y, s: 1 }, tUp + i * 0.05, 0.45, "power3.inOut"));
  fade(oa, tUp - 0.05, 0.15);
  // push in on the chart
  { const t = wt("c5", "in") - 0.25; cam(F(1, 1), t, 0.5, "expo.inOut"); camLast = F(1, 1); }
  const tYr = wt("c5", "2024") - 0.06;
  const ax = G(S5.mid);
  rline(ax, 150, 1170, 640, 1170, { strokeWidth: 4 });
  drawIn(ax, tYr - 0.2, 0.25);
  const yr = wr(S5.top, "2024", 382, 1250, 72, INK, tYr, { anchor: "middle", cps: 16 });
  // the note and the source
  const tSt = wt("c5", "study") - 0.06;
  const n5 = G(S5.top), n5A = GA(n5, { x: 785, y: 790, s: 0.3, o: 0, r: 3 });
  rr(n5, -158, -112, 316, 224, { fill: "#ffec99", fillStyle: "solid", stroke: "#f08c00", strokeWidth: 2.5, roughness: 0.8 });
  const n5a = T(n5, "211 million", 0, -16, 58, DARKT, MID), n5b = T(n5, "lines of code", 0, 54, 46, DARKT, MID); fitT(n5b, 270);
  n5A.to({ o: 1, s: 1 }, wt("c5", "gitclear") + 0.02, 0.22, "back.out(2)");
  typeOn(n5a, wt("c5", "gitclear") + 0.12, 0.3); typeOn(n5b, tSt, 0.3);
  wr(S5.top, "GitClear,", 785, 960, 42, INK2, tSt + 0.2, { anchor: "middle", cps: 40 });
  wr(S5.top, "2025 report", 785, 1008, 42, INK2, tSt + 0.4, { anchor: "middle", cps: 40 });
  // the bars: copy-pasted rises above cleaned up
  const tCp = wt("c5", "copypasted") - 0.06, tCl = wt("c5", "cleaned") - 0.06;
  rise(S5.mid, 175, 1168, 180, 470, { stroke: EX.red, fill: EX.redF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 13 }, tCp, 0.6);
  wr(S5.top, "copy-pasted", 268, 676, 52, EX.red, tCp + 0.05, { anchor: "middle", cps: 30, maxW: 262 });
  rise(S5.mid, 410, 1168, 180, 250, { stroke: EX.green, fill: EX.greenF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 13 }, tCl, 0.45);
  wr(S5.top, "cleaned up", 490, 896, 52, EX.green, tCl + 0.05, { anchor: "middle", cps: 30, maxW: 225 });
  const tFi = wt("c5", "first") - 0.1;
  ring(S5.fx, 382, 1228, 210, 100, EX.orange, tFi, 5);

  // ====================================================================================================
  // S6 (0,1) c6 (the re-hook): why would an AI do that? Dive into the robot's head: its training rules, the score note.
  // ====================================================================================================
  const S6 = station(0, 1), b6 = SB(0, 1);
  travel(F(0, 1), "c6", 0.45);
  const BOT6 = figure(S6.mid, RP, "bot", 540, 810 + 360 * 2.2, 2.2);   // the head centre sits at the station centre, so the dive goes straight in
  BOT6.key(0, "blank");
  const HX6 = 540, HY6 = 810;   // the robot's head centre
  drawIn(S6.mid, PRE("c6"), 0.4);
  const tWy = wt("c6", "why") - 0.06, tTh = wt("c6", "that") - 0.06;
  const q1 = bigQ(S6.top, 790, 640, tWy, 10), q2 = bigQ(S6.top, 290, 670, tTh, -10);
  BOT6.key(tWy, "think").key(tTh, "blank");
  // the dive: the camera zooms on the head centre; the body and face fade, the head outline stays as the frame of the inside
  const K = 3.8;
  const tDv = wt("c6", "one") - 0.12;
  const DIVE = C(b6.x + HX6, b6.y + HY6, FS * K, 540, 820);
  cam(DIVE, tDv - 0.05, 0.8, "power3.inOut"); camLast = DIVE;
  q1.to({ o: 0 }, tDv, 0.15); q2.to({ o: 0 }, tDv, 0.15);
  const HF = G(S6.top, { opacity: 0 });
  rpath(HF, rrD(HX6 - 114.4, HY6 - 99, 228.8, 198, 49.5), { strokeWidth: 3, roughness: 0.5 });
  show(HF, tDv + 0.1);
  BOT6.a.to({ o: 0 }, tDv + 0.1, 0.25, "power1.in");
  const INNER = G(S6.top, { opacity: 0, transform: `translate(${HX6},${HY6}) scale(${1 / K}) translate(-540,-810)` });
  show(INNER, tDv + 0.45, 0.15);
  // inside: a document of training rules, its source, and the score note
  const tPb = wt("c6", "published") - 0.08, tTr = wt("c6", "training") - 0.06;
  const doc = G(INNER);
  fileIcon(doc, 200, 512, 680, 200, { stroke: EX.blue });
  drawIn(doc, tDv + 0.5, 0.35);
  const open6 = wr(INNER, "an open coding AI", 540, 494, 54, INK2, tDv + 0.5, { anchor: "middle", cps: 44 });
  wr(INNER, "training rules", 540, 616, 90, INK, tTr, { anchor: "middle", cps: 30, maxW: 600 });
  wr(INNER, "DeepSWE, 2025", 540, 688, 44, INK2, tTr + 0.4, { anchor: "middle", cps: 40, maxW: 560 });
  const NIN = { x: b6.x + HX6, y: b6.y + HY6 + (962 - 810) / K };
  noteA.to({ x: NIN.x, y: NIN.y - 8 / K, s: 0.4 / K, o: 0 }, 0, 0.01);
  noteA._s = 0.98 / K;
  noteA.to({ o: 1, s: 0.98 / K, y: NIN.y }, wt("c6", "rules") - 0.02, 0.22, "back.out(2)");
  const ar6 = arrow(INNER, 540, 716, 540, 784, { stroke: EX.blue, strokeWidth: 4 }); drawIn(ar6, wt("c6", "rules") + 0.05, 0.2);
  const tPs6 = wt("c6", "pass") - 0.06;
  typeOn(r1, tPs6, 0.4); typeOn(r2, wt("c6", "clean") - 0.06, 0.4);
  const tPt = wt("c6", "point") - 0.06;
  show(m1, tPt); m1A.to({ s: 1.5 }, tPt, 0.08, "power2.out").to({ s: 1 }, tPt + 0.08, 0.25, "back.out(3)");
  npulse(tPt + 0.05);
  const tNo = wt("c6", "nothing") - 0.06;
  show(m2, tNo);
  tw(x2, { opacity: 0 }, { opacity: 1, duration: 0.01 }, wt("c6", "extra") - 0.04); drawIn(x2, wt("c6", "extra") - 0.04, 0.2);
  BOT6.key(L0("c7"), "blank");

  // ====================================================================================================
  // S7 (0,2) c7: out of the head and down to Matt Pocock's card; the note comes along. Most coding AIs learn like this.
  // ====================================================================================================
  const S7 = station(0, 2), b7 = SB(0, 2);
  const t7 = L0("c7") + 0.1 - 0.6;
  cam(F(0, 2), t7, 0.6, "expo.inOut"); camLast = F(0, 2);
  tw(INNER, { opacity: 1 }, { opacity: 0, duration: 0.12, immediateRender: false }, t7 + 0.05); hide(HF, t7 + 0.05, 0.12);
  BOT6.a.to({ o: 1 }, t7 + 0.3, 0.2);
  const NP7 = { x: b7.x + 745, y: b7.y + 1030 };
  noteA.to({ x: NP7.x, y: NP7.y, s: 0.75, r: 3 }, t7, 0.6, "expo.inOut");
  noteA._s = 0.75;
  // Matt's name card, across the top
  const tMt = wt("c7", "matt") - 0.08;
  const mc = G(S7.mid);
  rr(mc, 135, 340, 810, 230, { fill: PAPER, fillStyle: "solid", strokeWidth: 4, stroke: EX.violet });
  drawIn(mc, tMt - 0.1, 0.3);
  wr(S7.top, "Matt Pocock", 540, 445, 92, INK, tMt, { anchor: "middle", cps: 26, maxW: 700 });
  wr(S7.top, "coding teacher", 540, 530, 56, INK2, wt("c7", "coding") - 0.06, { anchor: "middle", cps: 34, maxW: 700 });
  // his AI skills: the saves count up
  const tSk = wt("c7", "ai") - 0.06;
  const sk = G(S7.mid);
  rr(sk, 135, 610, 430, 240, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  drawIn(sk, tSk, 0.3);
  wr(S7.top, "his AI skills", 350, 672, 52, INK2, wt("c7", "skills") - 0.1, { anchor: "middle", cps: 34, maxW: 380 });
  const tTh7 = wt("c7", "three") - 0.06;
  const cnt = T(S7.top, "0", 228, 760, 74, INK); cnt.setAttribute("opacity", 0);
  show(cnt, tTh7); kit.counter(cnt, 0, 306000, tTh7, wt("c7", "saves") - tTh7, NUMF, "power2.out");
  const st7 = G(S7.top); star(st7, 0, 0, 32); pop(st7, tTh7 + 0.1, 190, 736);
  wr(S7.top, "saves", 350, 825, 50, INK2, wt("c7", "saves") - 0.06, { anchor: "middle", cps: 30 });
  // "thinks": thought dots from Matt's card down to the note
  const tTk = wt("c7", "thinks") - 0.08;
  [[690, 610, 16], [715, 668, 22], [735, 738, 28]].forEach(([x, y, r], i) => { const g = G(S7.fx); rell(g, 0, 0, r * 2, r * 2, { stroke: EX.violet, strokeWidth: 3.5 }); pop(g, tTk + i * 0.09, x, y); });
  // "most coding AIs learn like this": three coding AIs, each gets a +1
  wr(S7.top, "most coding AIs", 300, 950, 52, INK, wt("c7", "most") - 0.06, { anchor: "middle", cps: 40, maxW: 330 });
  const RB = [185, 315, 445].map((x, i) => { const g = G(S7.mid); robot(g, 0, 0, 1.1); pop(g, wt("c7", "coding", 1) - 0.1 + i * 0.12, x, 1290, 1, (i - 1) * 6); return x; });
  const tLr = wt("c7", "learn") - 0.06;
  RB.forEach((x, i) => { const g = G(S7.top); T(g, "+1", 0, 0, 56, EX.green, { ...MID, ...HALO() }); pop(g, tLr + i * 0.1, x + 46, 1068, 1, 8); });
  const tLt = wt("c7", "like") - 0.06;
  const ar7b = arrow(S7.fx, 505, 1180, 552, 1120, { stroke: EX.orange, strokeWidth: 4.5 }, -0.15); drawIn(ar7b, tLt, 0.2);
  npulse(tLt + 0.15);

  // ====================================================================================================
  // S8 (1,2) c8: the fix is simple. "I care about the code" -> the robot's face goes from blank to keen; it cleans.
  // ====================================================================================================
  const S8 = station(1, 2), b8 = SB(1, 2);
  travel(F(1, 2), "c8", 0.45);
  const NAD8 = figure(S8.mid, NP, "nora", 225, 1295, 1.2);
  NAD8.key(0, "stand");
  const BOT8 = figure(S8.mid, RP, "bot", 770, 1300, 1.4);
  BOT8.key(0, "blank");
  drawIn(S8.mid, PRE("c8"), 0.4);
  head(S8.top, "the fix is simple", wt("c8", "fix") - 0.1, null, INK, 90, 390, 44);
  const ul8 = scribble(S8.top, 640, 880, 414, EX.green, 21, 6); drawIn(ul8, wt("c8", "simple") + 0.1, 0.22);
  // the speech bubble
  const tTl = wt("c8", "tell") - 0.08;
  const bub = G(S8.mid);
  rr(bub, 135, 470, 470, 240, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  rpath(bub, "M232 706 L244 790 L300 706", { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  drawIn(bub, tTl - 0.1, 0.25);
  const bl1 = T(S8.top, "I care about", 370, 570, 70, INK, MID), bl2 = T(S8.top, "the code", 370, 660, 70, INK, MID);
  const cX = 370 - bl1.getComputedTextLength() / 2 + bl1.getSubStringLength(0, 2), cW8 = bl1.getSubStringLength(2, 4);
  typeOn(bl1, tTl + 0.1, wt("c8", "about") - tTl); typeOn(bl2, wt("c8", "the", 1) - 0.04, 0.4);
  NAD8.key(tTl - 0.05, "point").key(wt("c8", "and") - 0.1, "stand");
  const tCa = wt("c8", "care") - 0.04;
  ring(S8.fx, cX + cW8 / 2, 550, cW8 + 50, 88, EX.blue, tCa + 0.05, 4);
  BOT8.key(tCa, "keen");
  BOT8.a.to({ y: BOT8.hip - 34 }, tCa, 0.14, "power2.out").to({ y: BOT8.hip }, tCa + 0.14, 0.3, "bounce.out");
  sparkle(S8.fx, 770, 796, tCa + 0.05, 95, EX.blue);
  // "really good at cleaning up": it grabs a broom, sparkles
  const tRg = wt("c8", "really") - 0.06, tCu = wt("c8", "cleaning") - 0.06;
  BOT8.key(tRg, "cheer").key(tCu + 0.1, "keen");
  const brm = G(S8.top), brmA = GA(brm, { x: 870, y: 1120, s: 0.3, o: 0, r: 20 });
  rline(brm, 0, -170, 0, 60, { stroke: BROWN, strokeWidth: 7 });
  rpath(brm, "M-40 60 L40 60 L56 130 L-56 130 Z", { stroke: EX.orange, fill: EX.yellowF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 10 });
  brmA.to({ o: 1, s: 1 }, tCu, 0.2, "back.out(2)").to({ r: -12 }, tCu + 0.22, 0.2, "sine.inOut").to({ r: 16 }, tCu + 0.42, 0.2, "sine.inOut").to({ r: 0 }, tCu + 0.62, 0.2, "sine.inOut");
  [[640, 1210], [925, 980], [640, 920]].forEach(([x, y], i) => sparkle(S8.fx, x, y, tCu + 0.15 + i * 0.12, 26, EX.orange));

  // ====================================================================================================
  // S9 (2,2) c9 + c10: the ball of mud drops back in. Nadia gives her AI one rule; it untangles the ball into neat
  // blocks. The score note flies in and updates: tests pass, code clean.
  // ====================================================================================================
  const S9 = station(2, 2), b9 = SB(2, 2);
  const t9 = L0("c9") + 0.1 - 0.45;
  travel(F(2, 2), "c9", 0.45);
  appA.to({ x: b9.x + 545, y: b9.y + 905, s: 1.1, r: 0 }, t9 - 0.15, 0.6, "power2.inOut");
  const NAD9 = figure(S9.mid, NP, "nora", 872, 1295, 0.85);
  NAD9.key(0, "stand");
  const BOT9 = figure(S9.mid, RP, "bot", 190, 1300, 0.9);
  BOT9.key(0, "keen");
  drawIn(S9.mid, PRE("c9"), 0.4);
  // the rule card: from Nadia's hand to the top
  const tGv = wt("c9", "gave") - 0.08, tRu = wt("c9", "rule") - 0.06;
  NAD9.key(tGv, "pointL").key(tRu + 0.5, "stand");
  const RC = G(S9.top), rcA = GA(RC, { x: 840, y: 960, s: 0.2, o: 0, r: 12 });
  rr(RC, -370, -115, 740, 230, { fill: PAPER, fillStyle: "solid", stroke: EX.blue, strokeWidth: 5 });
  const rcT = T(RC, "NEW RULE", 0, -48, 52, EX.blue, MID);
  const rc2 = T(RC, "before you add a feature,", 0, 18, 50, INK2, MID); fitT(rc2, 680);
  const rc3 = T(RC, "clean up the code it touches", 0, 86, 56, INK, MID); fitT(rc3, 690);
  rcA.to({ o: 1 }, tGv + 0.1, 0.01).to({ x: 540, y: 470, s: 1, r: 0 }, tGv + 0.1, 0.5, "power3.out");
  typeOn(rcT, wt("c9", "new") - 0.06, 0.3);
  typeOn(rc2, wt("c9", "before") - 0.06, wt("c9", "feature") + 0.3 - wt("c9", "before"));
  const tCl9 = wt("c9", "clean") - 0.06;
  typeOn(rc3, tCl9, wt("c9", "touches") + 0.3 - tCl9);
  const ul9 = scribble(RC, -330, 330, 104, EX.green, 29, 5); drawIn(ul9, wt("c9", "touches") + 0.1, 0.25);
  // the feature waits outside
  const tAf = wt("c9", "add") - 0.06;
  const f9 = pillA(S9.fx, "+ feature", EX.blue, EX.blueF, 255, 640, 46, -5);
  f9.a.to({ o: 1, s: 1 }, tAf, 0.2, "back.out(2)");
  const w9 = wr(S9.top, "wait!", 255, 765, 46, INK2, wt("c9", "feature") + 0.05, { anchor: "middle", cps: 30 });
  // the clean-up: the strands unwind, the patches fall, the blocks fly out into a neat grid
  for (let k = 0; k < 9; k++) BOT9.key(tCl9 + k * 0.17, k % 2 ? "ktype2" : "ktype");
  BOT9.key(tCl9 + 1.55, "keen");
  STR.forEach((s, i) => s.querySelectorAll("path").forEach((p) => {
    const len = p.getTotalLength() + 1;
    B.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: len, duration: 0.7, ease: "power2.in", immediateRender: false }, tCl9 + 0.05 + i * 0.12);
  }));
  patches.forEach((pt, i) => pt.a.to({ y: PATCH[i][1] + 260, r: PATCH[i][2] + (i % 2 ? 50 : -50), o: 0 }, tCl9 + 0.1 + i * 0.05, 0.4, "power2.in"));
  ballA.to({ s: 0.5, r: 120, o: 0 }, tCl9 + 0.55, 0.5, "power2.in");
  show(NEAT, tCl9 + 0.2);
  tw(NF, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tCl9 + 1.0); drawIn(NF, tCl9 + 1.0, 0.35);
  NB.forEach((b, i) => b.a.to({ o: 1, s: 1 }, tCl9 + 0.25 + i * 0.13, 0.08).to({ x: b.x, y: b.y, r: 0 }, tCl9 + 0.33 + i * 0.13, 0.35, "back.out(1.5)"));
  // c10: the waiting feature slots in; the rule card moves aside; the note flies in and updates
  const t10 = L0("c10");
  fade(w9, tCl9 + 0.8, 0.12);
  f9.a.to({ x: 545 + 135 * 1.1, y: 905 + 72 * 1.1, s: 0.4, r: 0 }, t10 - 0.2, 0.32, "power3.in").to({ o: 0 }, t10 + 0.12, 0.01);
  nb6A.to({ o: 1 }, t10 + 0.12, 0.01).to({ s: 1 }, t10 + 0.12, 0.25, "back.out(2.5)");
  rcA.to({ y: 300, s: 0.9, o: 0 }, t10 + 0.35, 0.3, "power3.in");
  const NP9 = { x: b9.x + 540, y: b9.y + 452 };
  noteA.to({ x: b9.x + 120, y: b9.y + 180, r: -8, s: 0.8 }, t10 + 0.45, 0.3, "power2.in").to({ x: NP9.x, y: NP9.y, r: 2, s: 0.85 }, t10 + 0.75, 0.3, "power2.out");
  noteA._s = 0.85;
  const tDn = wt("c10", "done") - 0.06;
  hide(m1, tDn, 0.08); show(k1, tDn); drawIn(k1, tDn, 0.18);
  npulse(tDn + 0.05);
  const tCn = wt("c10", "clean") - 0.06;
  hide(m2, tCn, 0.08); hide(x2, tCn, 0.08); hide(r2, tCn, 0.08);
  show(r2b, tCn); typeOn(r2b, tCn, 0.3);
  show(k2, tCn + 0.05); drawIn(k2, tCn + 0.05, 0.18);
  npulse(tCn + 0.2);
  ring(S9.fx, 540, 452, 520, 330, EX.green, tCn + 0.25, 5);
  NAD9.key(tCn, "cheer"); BOT9.key(tCn, "cheer");
  sparkle(S9.fx, 545, 700, wt("c10", "until") - 0.04, 40, EX.green);
  appA.to({ s: 1.15 }, wt("c10", "until") - 0.04, 0.08, "power2.out").to({ s: 1.1 }, wt("c10", "until") + 0.04, 0.3, "back.out(3)");

  // ====================================================================================================
  // S11 (3,2) c11: Comment CARE, then the Follow button, clicked on the word.
  // ====================================================================================================
  const S11 = station(3, 2), bE = SB(3, 2);
  const ENDP = C(bE.x + 540, bE.y + 810, FS, 540, 760);
  travel(ENDP, "c11", 0.45);
  noteA.to({ x: bE.x + 540, y: bE.y + 455, s: 0.62, r: -3 }, L0("c11") - 0.4, 0.5, "expo.inOut");
  noteA._s = 0.62;
  const tCm = wt("c11", "comment"), tCr = wt("c11", "care");
  const cbub = G(S11.top), cbA = GA(cbub, { x: 540, y: 775, s: 1.5, o: 0, r: -4 });
  rr(cbub, -390, -165, 780, 330, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  rpath(cbub, "M-290 163 L-344 186 L-240 163", { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  cbA.to({ o: 1 }, tCm - 0.14, 0.01).to({ s: 1, r: 0 }, tCm - 0.13, 0.14, "power4.in");
  shake(tCm + 0.02, 1.1);
  const cW = T(S11.top, "Comment", 540, 735, 150, INK, MID), sW = T(S11.top, "CARE", 540, 903, 180, EX.blue, { ...MID, "letter-spacing": 10 });
  fitT(cW, 700);
  const sw = sW.getComputedTextLength(), cx0 = 540 - sw / 2;
  typeOn(cW, tCm - 0.02, 0.24); show(cW, tCm - 0.02);
  typeOn(sW, tCr - 0.04, 0.2); show(sW, tCr - 0.04);
  const ulS = scribble(S11.top, cx0, cx0 + sw, 919, EX.blue, 31, 7); drawIn(ulS, tCr + 0.22, 0.24);
  const hS = G(S11.top); rpath(hS, "M0 22 C-52 -12 -40 -56 0 -28 C40 -56 52 -12 0 22 Z", { stroke: EX.red, fill: EX.redF, fillStyle: "solid", strokeWidth: 3 }); pop(hS, tCr + 0.1, 895, 612, 1.2, 12);
  wr(S11.top, "I'll send you Matt's free skills", 560, 1025, 50, INK2, wt("c11", "send") - 0.1, { anchor: "middle", cps: 44, maxW: 690 });
  const EB = figure(S11.top, RP, "bot", 165, 1378, 0.72);
  EB.key(0, "keen");
  EB.a.to({ o: 0 }, 0, 0.01).to({ o: 1 }, tCm + 0.4, 0.2);
  const tFo = wt("c11", "follow");
  const FBX = 700, FBY = 1150;
  const fb = G(S11.top), fbA = GA(fb, { x: FBX, y: FBY, s: 0.4, o: 0, r: -2 });
  const fbOff = G(fb), fbOn = G(fb, { opacity: 0 });
  rr(fbOff, -150, -58, 300, 116, { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  T(fbOff, "+ Follow", 0, 22, 62, INK, MID);
  rr(fbOn, -150, -58, 300, 116, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  const fon = T(fbOn, "Following", 24, 20, 54, INK, MID); fitT(fon, 200);
  tick(fbOn, -112, 0, 0.85, EX.green, 6);
  fbA.to({ o: 1, s: 1 }, tFo - 0.1, 0.26, "back.out(2)");
  const cur = G(S11.top), curA = GA(cur, { x: 980, y: 1260, o: 0 });
  rpath(cur, "M0 0 L0 64 L15 50 L27 76 L39 71 L27 44 L49 44 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.6, roughness: 0.7 });
  const tCk = tFo + 0.28;
  curA.to({ o: 1 }, tCk - 0.3, 0.06).to({ x: FBX + 128, y: FBY + 34 }, tCk - 0.28, 0.26, "power3.out");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  fbA.to({ s: 0.93 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.16, "back.out(3)");
  hide(fbOff, tCk + 0.04, 0.08); show(fbOn, tCk + 0.04);
  const crg = G(S11.top), cra = GA(crg, { x: FBX + 128, y: FBY + 34, s: 0.3, o: 0 });
  rell(crg, 0, 0, 110, 110, { stroke: EX.blue, strokeWidth: 4, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.5, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  curA.to({ o: 0, x: 1010, y: 1280 }, tCk + 0.6, 0.3, "power2.in");
  // small life on the held card: the robot waves and hops
  for (let q = 0; q < 10; q++) EB.key(tCk + 0.35 + q * 0.32, q % 2 ? "cheer" : "wave");
  for (let q = 0; q < 3; q++) EB.a.to({ y: EB.hip - 26 }, tCk + 0.4 + q * 0.9, 0.14, "power2.out").to({ y: EB.hip }, tCk + 0.54 + q * 0.9, 0.22, "bounce.out");
  const ulS2 = scribble(S11.top, cx0, cx0 + sw, 929, EX.orange, 33, 6); drawIn(ulS2, tCk + 1.3, 0.3);

  // layer order: the app and the note sit on top of the board
  D.appendChild(APP); D.appendChild(NOTE);
