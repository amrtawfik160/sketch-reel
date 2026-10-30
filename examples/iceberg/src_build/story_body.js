  { const r = defs.querySelector("#safeclip rect"); if (r) { r.setAttribute("x", -140); r.setAttribute("y", -250); r.setAttribute("width", 1360); r.setAttribute("height", 2420); } }
  const HOOKS = [];   // functions of the boil clock time (seek-safe per-frame state: timers, glitches)
  const SB = (col, row) => ({ x: COLX[col], y: ROWY[row] });
  const shake = (t, k = 1) => [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => cam({ s: camLast.s, x: camLast.x + dx * k, y: camLast.y + dy * k }, t + i * 0.045, 0.045, "none"));
  const WHITE = "#ffffff", WATER = "#74c0fc", WATER2 = "#4dabf7", ICEB = EX.blue, ICEP = "#a5d8ff", ICEF = "#e7f5ff";
  const ORF = "#ffd8a8", TWB = "#1DA1F2";
  const lerp = (a, b, p) => a + (b - a) * p;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const DECO = { "data-deco": 1 };

  // ---------- small drawings ----------
  const person = (p, x, y, s = 1, col = INK) => {
    const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
    const o = { stroke: col, strokeWidth: 3.6 / Math.sqrt(s), roughness: 0.7 };
    rpath(g, "M0 -100 L0 -46 M0 -88 L-22 -60 M0 -88 L22 -60 M0 -46 L-16 0 M0 -46 L16 0", o);
    rell(g, 0, -124, 46, 46, { ...o, fill: PAPER, fillStyle: "solid" });
    return g;
  };
  const wr = (p, s, x, y, size, col, t, { anchor = "start", cps = 36, maxW = 810, halo = true } = {}) => {   // fitted handwriting, typed on its word
    const g = G(p, { opacity: 0 });
    const e = T(g, s, x, y, size, col, { "text-anchor": anchor, ...(halo ? HALO() : {}) });
    fitT(e, maxW); typeOn(e, t, s.length / cps); show(g, t);
    g._e = e;
    return g;
  };
  const drawAt = (n, t, d = 0.35) => { show(n, t); drawIn(n, t, d); return n; };
  const img = (p, href, x, y, w, h, extra = {}) => el("image", { href: "img/" + href, x, y, width: w, height: h, preserveAspectRatio: "xMidYMid meet", ...extra }, p);
  const imgC = (p, href, cx, cy, w, h) => img(p, href, cx - w / 2, cy - h / 2, w, h);
  const bigTick = (p, x, y, s, t, col = EX.green) => { const g = G(p); tick(g, 0, 0, s, col, 9); return pop(g, t, x, y, 1, 0); };
  const dots3 = (p, x, y) => [0, 1, 2].forEach((i) => rell(p, x + i * 26, y, 15, 15, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6, fill: ["#ffc9c9", "#ffec99", "#b2f2bb"][i], fillStyle: "solid" }));
  // an app window: solid paper, a title bar with three dots, an optional logo and a title
  const appWin = (p, x, y, w, h, { title = "", logo = null, lw = 44, lh = 44, bar = 72, size = 44, stroke = INK } = {}) => {
    const g = G(p);
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid", stroke, strokeWidth: 4 });
    rline(g, x + 14, y + bar, x + w - 14, y + bar, { strokeWidth: 2.5, roughness: 0.8, stroke });
    dots3(g, x + 34, y + bar / 2);
    let tx = x + 124;
    if (logo) { img(g, logo, tx, y + bar / 2 - lh / 2, lw, lh); tx += lw + 14; }
    if (title) T(g, title, tx, y + bar / 2 + size * 0.36, size, INK2);
    g._bar = bar;
    return g;
  };
  const dlines = (p, x, y, ws, gap = 30, col = "#ced4da", sw = 6) => ws.forEach((w, i) => rline(p, x, y + i * gap, x + w, y + i * gap, { stroke: col, strokeWidth: sw, roughness: 0.5 }));
  const avatar = (p, cx, cy, r, fill, letter, col = INK) => { rell(p, cx, cy, 2 * r, 2 * r, { fill, fillStyle: "solid", stroke: col, strokeWidth: 3, roughness: 0.7 }); if (letter) T(p, letter, cx, cy + r * 0.42, r * 1.25, INK, { ...MID, ...DECO }); };
  const cube = (p, x, y, a, fill = "#ced4da", col = INK) => {   // an isometric cube, centre (x, y), edge a
    const h = a * 0.5, w = a * 0.866;
    rpath(p, `M${x} ${y - a} L${x + w} ${y - h} L${x + w} ${y + h} L${x} ${y + a} L${x - w} ${y + h} L${x - w} ${y - h} Z`, { fill, fillStyle: "hachure", hachureGap: Math.max(6, a / 5), stroke: col, strokeWidth: Math.max(2.5, a / 18) });
    rpath(p, `M${x - w} ${y - h} L${x} ${y} L${x + w} ${y - h} M${x} ${y} L${x} ${y + a}`, { stroke: col, strokeWidth: Math.max(2.5, a / 18) });
  };
  // a line revealed left to right by a widening clip (long rough chart paths ignore the stroke-dash)
  const clipReveal = (p, x, y, w, h, t, dur, ease = "power1.inOut") => {
    const id = "cr" + (SEED++), cp = el("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, defs);
    const r = el("rect", { x, y, width: 0, height: h }, cp);
    const g = G(p, { "clip-path": `url(#${id})` });
    tw(r, { attr: { width: 0 } }, { attr: { width: w }, duration: dur, ease }, t);
    return g;
  };
  const clipDown = (p, x, y, w, h, t, dur, ease = "power2.out") => {
    const id = "cd" + (SEED++), cp = el("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, defs);
    const r = el("rect", { x, y, width: w, height: 0 }, cp);
    const g = G(p, { "clip-path": `url(#${id})` });
    tw(r, { attr: { height: 0 } }, { attr: { height: h }, duration: dur, ease }, t);
    return g;
  };
  // a slammed stamp whose word is fitted to its box
  const stampF = (p, word, x, y, w, h, col, colF, t, rot = -7, size = 90, seed = 7, ls = 3) => {
    const g = G(p), a = A(g, { x, y, r: rot, o: 0 });
    rr(g, -w / 2, -h / 2, w, h, { stroke: "none", fill: PAPER, fillStyle: "solid", boil: false });
    rr(g, -w / 2, -h / 2, w, h, { stroke: col, fill: colF, fillStyle: "hachure", strokeWidth: 7, fillWeight: 2.6, hachureGap: 15 });
    const e = T(g, word, 0, size * 0.36, size, col, { ...MID, "letter-spacing": ls, ...HALO(), "stroke-width": 12 });
    fitT(e, w - 40);
    const sp = splat(g, w / 2, h / 2, col, seed);
    a.to({ s: 1.7, r: rot * 2 }, t - 0.02, 0.01).to({ o: 1, s: 1, r: rot }, t, 0.13, "power4.in");
    show(sp, t + 0.12); drawIn(sp, t + 0.12, 0.14, "power2.out");
    return a;
  };
  // a 16-hour timer: dial, sweep (fraction of a day), hand, the hours written in the middle. Local origin: the dial centre.
  const timer = (p, t0, t1, label, R = 96) => {
    const g = G(p);
    rell(g, 0, 0, 2 * R + 6, 2 * R + 6, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
    const sweep = el("path", { fill: EX.redF, opacity: 0.9 }, g);
    for (let k = 0; k < 24; k++) { const a = (k * Math.PI) / 12, L = k % 6 ? 8 : 16; rline(g, Math.sin(a) * (R - 4 - L), -Math.cos(a) * (R - 4 - L), Math.sin(a) * (R - 4), -Math.cos(a) * (R - 4), { strokeWidth: k % 6 ? 2 : 3.5, boil: false }); }
    rr(g, -18, -R - 30, 36, 18, { strokeWidth: 3.5, fill: PAPER, fillStyle: "solid" }); rline(g, 0, -R - 12, 0, -R, { strokeWidth: 4 });
    const hand = el("line", { x1: 0, y1: 0, x2: 0, y2: -R + 22, stroke: EX.red, "stroke-width": 6, "stroke-linecap": "round" }, g);
    el("circle", { cx: 0, cy: 0, r: 8, fill: EX.red }, g);
    const num = T(g, "0 h", 0, -22, 50, INK, { ...MID, ...HALO() });
    kit.counter(num, 0, 16, t0, t1 - t0, (v) => Math.round(v) + " h", "power1.inOut");
    HOOKS.push((v) => {
      const f = (16 / 24) * clamp01((v - t0) / (t1 - t0)), a = f * 2 * Math.PI, r = R - 6;
      const ex = Math.sin(a) * r, ey = -Math.cos(a) * r;
      sweep.setAttribute("d", f <= 0.001 ? "" : `M0 0 L0 ${-r} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z`);
      hand.setAttribute("x2", (Math.sin(a) * (R - 22)).toFixed(1)); hand.setAttribute("y2", (-Math.cos(a) * (R - 22)).toFixed(1));
    });
    if (label) T(g, label, 0, R + 58, 44, INK2, { ...MID, ...HALO() });
    return g;
  };

  // ====================================================================================================
  // THE ICEBERG: one outline over the whole board, water lines around it, the surface, the sea floor.
  // ====================================================================================================
  const WL = 1250, FLOOR = 10120;
  const ICE = [[1690, 600], [1800, 700], [1880, 820], [1960, 960], [2040, 1120], [2090, WL], [2140, 1420], [2190, 1600], [2500, 2250], [2900, 2950], [3220, 3600],
    [3335, 5000], [3330, 6600], [3380, 8400], [3640, FLOOR], [-260, FLOOR], [60, 8400], [160, 6750], [520, 5600], [900, 4300], [1180, 2600], [1230, 1600], [1260, 1420], [1290, WL],
    [1340, 1110], [1420, 960], [1500, 820], [1580, 700]];
  const inPoly = (x, y) => { let c = false; for (let i = 0, j = ICE.length - 1; i < ICE.length; j = i++) { const [xi, yi] = ICE[i], [xj, yj] = ICE[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  const spanAt = (y) => { const xs = []; for (let i = 0, j = ICE.length - 1; i < ICE.length; j = i++) { const [xi, yi] = ICE[i], [xj, yj] = ICE[j]; if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi); } xs.sort((a, b) => a - b); return [xs[0], xs[xs.length - 1]]; };
  const icePath = "M" + ICE.map(([x, y]) => `${x} ${y}`).join(" L") + " Z";
  const OVF = G(D, { opacity: 0 });        // overview only: the pale ice fill (behind everything)
  rpath(OVF, icePath, { stroke: "none", fill: ICEF, fillStyle: "solid", boil: false });
  const BGL = G(D);                         // the board: water, iceberg, floor
  // water lines (outside the ice, under the surface)
  const wave = (p, x, y, w, col, sw, o = {}) => rpath(p, `M${x} ${y} Q${x + w / 6} ${y - w / 9} ${x + w / 3} ${y} Q${x + w / 2} ${y + w / 9} ${x + (2 * w) / 3} ${y} Q${x + (5 * w) / 6} ${y - w / 9} ${x + w} ${y}`, { stroke: col, strokeWidth: sw, roughness: 0.6, ...o });
  { const R = rng(41);
    for (let y = 1400; y <= FLOOR - 120; y += 210) for (let x = -560; x <= 3920; x += 290) {
      const jx = x + (R() - 0.5) * 140, jy = y + (R() - 0.5) * 90, w = 110 + R() * 50;
      if ([-60, 0, w / 2, w, w + 60].some((d) => inPoly(jx + d, jy) || inPoly(jx + d, jy - 50) || inPoly(jx + d, jy + 50))) continue;
      wave(BGL, jx, jy, w, WATER, 3);
    } }
  // the surface: a darker line either side of the tip, with small crests
  rpath(BGL, `M-700 ${WL} L1290 ${WL}`, { stroke: WATER2, strokeWidth: 4.5, roughness: 1.2 });
  rpath(BGL, `M2090 ${WL} L4100 ${WL}`, { stroke: WATER2, strokeWidth: 4.5, roughness: 1.2 });
  for (let x = -640; x < 4060; x += 170) if (x + 90 < 1290 || x > 2090) wave(BGL, x, WL - 16, 90, WATER2, 3);
  // the iceberg outline, with pale glints just inside its edges
  rpath(BGL, icePath, { stroke: ICEB, strokeWidth: 5, roughness: 1.3 });
  for (let i = 0; i < ICE.length; i++) {
    const [x1, y1] = ICE[i], [x2, y2] = ICE[(i + 1) % ICE.length];
    const L = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(L / 300);
    if (y1 >= FLOOR - 1 && y2 >= FLOOR - 1) continue;
    const dx = (x2 - x1) / L, dy = (y2 - y1) / L;
    let nx = -dy, ny = dx;
    for (let k = 0; k < n; k++) {
      const f = (k + 0.5) / n, px = x1 + (x2 - x1) * f, py = y1 + (y2 - y1) * f;
      if (!inPoly(px + nx * 40, py + ny * 40)) { nx = -nx; ny = -ny; }
      const ox = px + nx * 34, oy = py + ny * 34, h = 46 + (k % 3) * 18;
      rline(BGL, ox - dx * h, oy - dy * h, ox + dx * h, oy + dy * h, { stroke: ICEP, strokeWidth: 3.5, roughness: 0.8 });
    }
  }
  // the sea floor: sand and seaweed
  rpath(BGL, `M-700 ${FLOOR} Q-300 ${FLOOR - 30} 100 ${FLOOR} T900 ${FLOOR} T1700 ${FLOOR} T2500 ${FLOOR} T3300 ${FLOOR} T4100 ${FLOOR}`, { stroke: "#e8590c", strokeWidth: 4, roughness: 1.2 });
  rr(BGL, -700, FLOOR + 8, 4800, 160, { stroke: "none", fill: "#ffec99", fillStyle: "hachure", hachureGap: 22, fillWeight: 2.5 });
  [[-40, 1], [1105, 1.1], [1155, 0.8], [2255, 1], [3460, 1.2], [3520, 0.8]].forEach(([x, s]) => rpath(BGL, `M${x} ${FLOOR} Q${x - 22 * s} ${FLOOR - 70 * s} ${x} ${FLOOR - 140 * s} Q${x + 22 * s} ${FLOOR - 210 * s} ${x} ${FLOOR - 280 * s}`, { stroke: EX.green, strokeWidth: 5, roughness: 1 }));
  // layer separators: dashed lines across the ice, with a small label
  const SEPS = [[3360, 2], [5060, 3], [6760, 4], [8460, 5]];
  SEPS.forEach(([y, n]) => {
    const [a, b] = spanAt(y);
    rline(BGL, a + 20, y, b - 20, y, { stroke: ICEB, strokeWidth: 3, roughness: 0.8, strokeLineDash: [26, 18] });
    COLX.forEach((cx0) => { const x = cx0 + 150; if (x > a + 40 && x < b - 220) T(BGL, "layer " + n, x, y - 18, 44, ICEB, { ...HALO(), "data-layout-ignore": 1 }); });
  });
  // the overview layer: the same outline in thick strokes, so it reads when the camera pulls back over the whole board
  const OVL = G(D, { opacity: 0 });
  rpath(OVL, icePath, { stroke: ICEB, strokeWidth: 30, roughness: 1.1 });
  rpath(OVL, `M-700 ${WL} L1290 ${WL} M2090 ${WL} L4100 ${WL}`, { stroke: WATER2, strokeWidth: 26, roughness: 0.8 });
  { const R = rng(77);
    for (let y = 1800; y <= FLOOR - 300; y += 620) for (let x = -500; x <= 3900; x += 760) {
      const jx = x + (R() - 0.5) * 300, jy = y + (R() - 0.5) * 160, w = 420;
      if ([-80, 0, w / 2, w, w + 80].some((d) => inPoly(jx + d, jy) || inPoly(jx + d, jy - 120) || inPoly(jx + d, jy + 120))) continue;
      wave(OVL, jx, jy, w, WATER, 22);
    } }
  SEPS.forEach(([y]) => { const [a, b] = spanAt(y); rline(OVL, a + 60, y, b - 60, y, { stroke: ICEB, strokeWidth: 18, roughness: 0.6, strokeLineDash: [120, 90] }); });
  rpath(OVL, `M-700 ${FLOOR} L4100 ${FLOOR}`, { stroke: "#e8590c", strokeWidth: 26, roughness: 0.8 });
  // the overview camera pose (the whole iceberg on the left of the frame) and its board -> design mapping
  const OVS = 0.105, OVP = { s: OVS, x: 330 - OVS * 1700, y: 150 };
  const ox = (wx) => OVS * wx + OVP.x, oy = (wy) => OVS * wy + OVP.y;
  const LMID = [1980, 4210, 5910, 7610, 9190];   // the middle of each layer (board y)

  // the screen-space overlay (above the board, below the captions)
  const OV = G(SAFE);

  // ====================================================================================================
  // THE SUBMARINE AND THE DEPTH METER (screen space): the narrator sinks one layer at a time.
  // ====================================================================================================
  const MET = G(OV), metA = GA(MET, { x: 0, y: -40, o: 0 });
  const SUB = G(MET), subA = GA(SUB, { x: 245, y: 162, s: 1, o: 1, r: 0 });
  rr(SUB, -26, -66, 56, 34, { fill: "#ffec99", fillStyle: "solid", stroke: "#e8590c", strokeWidth: 3.5 });
  rline(SUB, 12, -66, 12, -94, { stroke: INK, strokeWidth: 3.5 }); rline(SUB, 12, -94, 34, -94, { stroke: INK, strokeWidth: 3.5 });
  rpath(SUB, "M-92 -16 L-112 -38 L-112 38 L-92 16", { fill: "#ffd8a8", fillStyle: "solid", stroke: "#e8590c", strokeWidth: 3.5 });
  rell(SUB, 0, 0, 190, 86, { fill: "#ffec99", fillStyle: "solid", stroke: "#e8590c", strokeWidth: 4 });
  rell(SUB, -30, 0, 34, 34, { fill: ICEP, fillStyle: "solid", stroke: INK, strokeWidth: 3 });
  rell(SUB, 22, 0, 34, 34, { fill: ICEP, fillStyle: "solid", stroke: INK, strokeWidth: 3 });
  rell(SUB, 66, 2, 22, 22, { fill: ICEP, fillStyle: "solid", stroke: INK, strokeWidth: 2.5 });
  rr(MET, 360, 106, 560, 108, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  T(MET, "layer", 385, 175, 46, INK2);
  const MCX = (i) => 560 + i * 80;
  for (let i = 0; i < 5; i++) { rell(MET, MCX(i), 160, 58, 58, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 }); T(MET, String(i + 1), MCX(i), 174, 40, INK2, MID); }
  const LAYT = [7.95, wt("i4", "down") - 0.04, wt("i8", "down") - 0.04, wt("i10", "deeper") + 0.02, wt("i12", "bottom") - 0.04, 999];
  for (let i = 0; i < 5; i++) {
    const done = G(MET, { opacity: 0 }); rell(done, MCX(i), 160, 58, 58, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 3, stroke: INK2 }); T(done, String(i + 1), MCX(i), 174, 40, INK2, MID);
    const on = G(MET); rell(on, 0, 0, 66, 66, { fill: EX.blueF, fillStyle: "solid", strokeWidth: 4.5, stroke: EX.blue }); T(on, String(i + 1), 0, 16, 46, INK, MID);
    const onA = GA(on, { x: MCX(i), y: 160, s: 0.3, o: 0 });
    onA.to({ o: 1, s: 1 }, LAYT[i], 0.3, "back.out(2.5)");
    if (LAYT[i + 1] < 900) { onA.to({ o: 0, s: 0.6 }, LAYT[i + 1] - 0.02, 0.12, "power2.in"); show(done, LAYT[i + 1]); }
    if (i > 0) {   // the sub dips and bubbles rise
      const t = LAYT[i];
      subA.to({ r: 12, y: 176 }, t - 0.32, 0.26, "power2.in").to({ r: 0, y: 162 }, t - 0.04, 0.45, "back.out(2)");
      [0, 1, 2].forEach((k) => { const b = G(MET); rell(b, 0, 0, 16 - k * 3, 16 - k * 3, { stroke: WATER2, strokeWidth: 2.5, boil: false }); GA(b, { x: 345 + k * 6, y: 150, o: 0 }).to({ o: 1 }, t - 0.2 + k * 0.08, 0.01).to({ y: 92 - k * 10, x: 352 + k * 8 }, t - 0.19 + k * 0.08, 0.5, "power1.out").to({ o: 0 }, t + 0.31 + k * 0.08, 0.1); });
    }
  }
  metA.to({ o: 1, y: 0 }, LAYT[0] - 0.05, 0.35, "back.out(1.6)");

  // ====================================================================================================
  // S1 (1,0) i1 + i2: the tip. Frame 0: the ChatGPT card on the tip of the iceberg. "But..." the camera pulls back over
  // the whole iceberg: one website, 3,000,000+ models, the weird ones way down here. i2: back in on the tip, the detailed window.
  // ====================================================================================================
  const S1 = station(1, 0), b1 = SB(1, 0);
  cam(F(1, 0, 0.97), 0, 0.01, "none");
  cam(F(1, 0), 0.02, 1.85, "sine.inOut");
  camLast = F(1, 0);
  // the sky
  const sky = G(S1.back);
  rell(sky, 880, 330, 100, 100, { stroke: EX.orange, strokeWidth: 4, fill: EX.yellowF, fillStyle: "hachure", hachureGap: 12 });
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rline(sky, 880 + Math.cos(a) * 66, 330 + Math.sin(a) * 66, 880 + Math.cos(a) * 92, 330 + Math.sin(a) * 92, { stroke: EX.orange, strokeWidth: 4 }); }
  rpath(sky, "M190 420 Q205 402 220 420 Q235 402 250 420", { strokeWidth: 3.5 });
  rpath(sky, "M290 372 Q302 358 314 372 Q326 358 338 372", { strokeWidth: 3 });
  rpath(sky, "M80 300 Q92 262 135 272 Q155 238 200 256 Q240 246 246 290 Q262 318 222 324 L102 324 Q70 320 80 300 Z", { strokeWidth: 3, stroke: INK2, fill: PAPER, fillStyle: "solid" });
  // the ChatGPT card on the tip (on screen from frame 0)
  const CARD1 = G(S1.top);
  rr(CARD1, 270, 430, 540, 270, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  rline(CARD1, 284, 488, 796, 488, { strokeWidth: 2.5, roughness: 0.8 });
  dots3(CARD1, 302, 459);
  T(CARD1, "chatgpt.com", 392, 472, 36, INK2, DECO);
  img(CARD1, "openai.svg", 312, 512, 64, 64);
  const cgT = T(CARD1, "ChatGPT", 394, 568, 76, INK);
  rr(CARD1, 306, 600, 468, 64, { strokeWidth: 3, fill: EX.grayF, fillStyle: "solid", roughness: 0.6 });
  T(CARD1, "Ask anything", 330, 643, 38, INK2, DECO);
  el("circle", { cx: 738, cy: 632, r: 20, fill: INK }, CARD1);
  const byO = G(S1.top); pill(byO, "by OpenAI", 0, 0, EX.violet, EX.violetF, 40, "solid"); GA(byO, { x: 705, y: 712, r: 4, o: 1 });
  const evk = G(S1.top, { opacity: 0 }); wr(evk, "the tip", 545, 1010, 58, EX.orangeT, wt("i1", "knows") - 0.06, { anchor: "middle", cps: 22, maxW: 200 });
  const evA = arrow(evk, 540, 955, 525, 815, { stroke: EX.orangeT, strokeWidth: 4.5 }, 0.2); hide(evA, 0); show(evA, wt("i1", "knows") + 0.25); drawIn(evA, wt("i1", "knows") + 0.25, 0.2);
  show(evk, wt("i1", "knows") - 0.06);
  const ulC = scribble(S1.top, 394, 394 + cgT.getComputedTextLength(), 584, EX.orange, 3, 5); hide(ulC, 0); show(ulC, wt("i1", "chatgpt")); drawIn(ulC, wt("i1", "chatgpt"), 0.25);
  // "But one website alone has over three million AI models": the pull back over the whole iceberg
  const tPB = wt("i1", "but") - 0.02;
  cam(OVP, tPB, 1.05, "power3.inOut"); camLast = OVP;
  tw(OVL, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, tPB + 0.35);
  tw(OVF, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, tPB + 0.35);
  const OV1 = G(OV);
  // the Hugging Face badge
  const HB = G(OV1), hbA = GA(HB, { x: 770, y: 600, s: 0.3, o: 0, r: -2 });
  rr(HB, -185, -175, 370, 350, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  img(HB, "huggingface.svg", -165, -158, 104, 96);
  T(HB, "Hugging", -48, -112, 50, INK); T(HB, "Face", -48, -62, 50, INK);
  rline(HB, -160, -20, 160, -20, { strokeWidth: 2.5, roughness: 0.8 });
  const hbN = T(HB, "3,000,000+", 0, 62, 78, EX.orangeT, { ...MID, ...HALO() }); fitT(hbN, 330); hbN.textContent = "0";
  T(HB, "AI models", 0, 135, 50, INK2, MID);
  hbA.to({ o: 1, s: 1 }, wt("i1", "website") - 0.08, 0.3, "back.out(2)");
  kit.counter(hbN, 0, 3000000, wt("i1", "website") + 0.1, wt("i1", "million") - wt("i1", "website") + 0.1, (v) => (v >= 2999999 ? "3,000,000+" : Math.round(v).toLocaleString("en-US")), "power2.out");
  const ar1 = arrow(OV1, 590, 660, ox(2350), oy(4600), { stroke: EX.orange, strokeWidth: 4.5 }, 0.12); hide(ar1, 0); show(ar1, wt("i1", "models") - 0.06); drawIn(ar1, wt("i1", "models") - 0.06, 0.28);
  // the five layer numbers on the ice
  LMID.forEach((y, i) => { const g = G(OV1); rell(g, 0, 0, 52, 52, { fill: PAPER, fillStyle: "solid", stroke: ICEB, strokeWidth: 3.5 }); T(g, String(i + 1), 0, 14, 38, ICEB, MID); pop(g, wt("i1", "and") + i * 0.11, ox(spanAt(y)[0]) + 40, oy(y), 1, 0); });
  // the weird ones, way down here
  const wk = wr(OV1, "the weird ones", 750, 1010, 60, EX.red, wt("i1", "weird") - 0.08, { anchor: "middle", cps: 30, maxW: 380 });
  const ar1b = arrow(OV1, 640, 1040, ox(700), oy(9550), { stroke: EX.red, strokeWidth: 5 }, -0.2); hide(ar1b, 0); show(ar1b, wt("i1", "way") - 0.06); drawIn(ar1b, wt("i1", "way") - 0.06, 0.3);
  const eyes = G(OV1, { opacity: 0 });
  [[ox(380), oy(9620)], [ox(560), oy(9620)]].forEach(([x, y]) => { el("circle", { cx: x, cy: y, r: 9, fill: EX.orange }, eyes); el("circle", { cx: x, cy: y, r: 4, fill: INK }, eyes); });
  show(eyes, wt("i1", "here") - 0.04, 0.1);
  ring(OV1, ox(470), oy(9600), 150, 80, EX.red, wt("i1", "here") - 0.02, 4.5);
  // i2 "At the top": back in on the tip
  const tPI = L0("i2") - 0.5;
  tw(OV1, { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "power2.in" }, tPI);
  tw(OVL, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "power1.in", immediateRender: false }, tPI);
  tw(OVF, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "power1.in", immediateRender: false }, tPI);
  cam(F(1, 0), tPI, 0.6, "power3.inOut"); camLast = F(1, 0);
  // the detailed ChatGPT window grows out of the card
  const tW2 = L0("i2") - 0.08;
  [CARD1, byO, evk, ulC].forEach((n) => fade(n, tW2, 0.16));
  fade(sky, tW2, 0.2);
  const W2 = G(S1.mid, { opacity: 0 });
  appWin(W2, 135, 360, 810, 640, { title: "ChatGPT", logo: "openai.svg", lw: 46, lh: 46, size: 46 });
  rline(W2, 330, 440, 330, 990, { strokeWidth: 2.5, roughness: 0.6 });
  pill(G(W2), "+ new chat", 238, 490, INK2, EX.grayF, 36, "solid");
  dlines(W2, 165, 570, [130, 100, 140, 86, 120], 56, "#ced4da", 7);
  rr(W2, 360, 900, 560, 72, { strokeWidth: 3, fill: EX.grayF, fillStyle: "solid", roughness: 0.6 });
  T(W2, "Ask anything", 390, 948, 40, INK2, DECO);
  el("circle", { cx: 884, cy: 936, r: 24, fill: INK }, W2);
  rpath(W2, "M884 950 L884 924 M874 934 L884 922 L894 934", { stroke: WHITE, strokeWidth: 3.5, roughness: 0.3, boil: false });
  drawAt(W2, tW2, 0.45);
  const ub = G(S1.mid, { opacity: 0 }); rr(ub, 530, 460, 385, 70, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5, roughness: 0.6 });
  const ubT = T(ub, "plan a trip to Rome", 552, 506, 40, INK); fitT(ubT, 345);
  show(ub, tW2 + 0.3, 0.15); typeOn(ubT, tW2 + 0.35, 0.5);
  const ans = G(S1.mid, { opacity: 0 }); img(ans, "openai.svg", 362, 560, 42, 42);
  const aL = [0, 1, 2].map((i) => T(ans, "", 420, 594 + i * 62, 40, INK));
  show(ans, wt("i2", "use") - 0.06);
  typeLines(aL, ["Sure! A 3-day plan:", "Day 1: the Colosseum", "Day 2: the Vatican"], wt("i2", "use") - 0.1, wt("i2", "every") - 0.15, 5);
  // OpenAI says: about a billion people a week
  const os2 = G(S1.top, { opacity: 0 }); img(os2, "openai.svg", 150, 1030, 52, 52); show(os2, wt("i2", "openai") - 0.08, 0.1);
  wr(S1.top, "OpenAI says", 214, 1070, 52, INK, wt("i2", "openai") - 0.06, { cps: 34, maxW: 290 });
  const N2 = G(S1.top), n2A = GA(N2, { x: 735, y: 1120, s: 0.3, o: 0, r: 3 });
  rr(N2, -200, -108, 400, 216, { fill: EX.yellowF, fillStyle: "solid", stroke: EX.orange, strokeWidth: 3, roughness: 0.8 });
  const n2N = T(N2, "0", 0, 2, 104, INK, MID);
  const n2a = T(N2, "people", -6, 80, 50, INK2, END), n2b = T(N2, "/ week", 6, 80, 50, INK2, {});
  n2a.setAttribute("opacity", 0); n2b.setAttribute("opacity", 0);
  n2A.to({ o: 1, s: 1 }, wt("i2", "about") - 0.1, 0.28, "back.out(2)");
  kit.counter(n2N, 0, 1000, wt("i2", "about") + 0.05, wt("i2", "people") - wt("i2", "about") - 0.05, (v) => (v >= 995 ? "1B" : Math.round(v) + "M"), "power2.in");
  show(n2a, wt("i2", "people") - 0.04); typeOn(n2a, wt("i2", "people") - 0.04, 0.2);
  show(n2b, wt("i2", "every") - 0.04); typeOn(n2b, wt("i2", "every") - 0.04, 0.25);
  n2A.to({ s: 1.1 }, wt("i2", "billion") - 0.02, 0.1, "power2.out").to({ s: 1 }, wt("i2", "billion") + 0.08, 0.3, "back.out(3)");
  const ppl = G(S1.top);
  [0, 1, 2, 3, 4].forEach((k) => { const g = G(ppl); person(g, 0, 0, 0.62, [INK, EX.blue, EX.green, EX.violet, EX.orangeT][k]); pop(g, wt("i2", "people") - 0.06 + k * 0.06, 180 + k * 62, 1238, 1, 0); });

  // ====================================================================================================
  // S3 (1,1) i3: 2019. The newspaper: "Too dangerous to release?". OpenAI locks GPT-2 in a crate. An earlier model on a
  // timeline; the worries: fake news, spam, scams.
  // ====================================================================================================
  const S3 = station(1, 1), b3 = SB(1, 1);
  travel(F(1, 1), "i3", 0.45);
  const NP = G(S3.mid), npA = GA(NP, { x: -260, y: 540, r: -25, o: 0 });
  rr(NP, -235, -240, 470, 480, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  T(NP, "THE NEWS", 0, -168, 64, INK, { ...MID, "letter-spacing": 4 });
  rline(NP, -210, -146, 210, -146, { strokeWidth: 3 }); rline(NP, -210, -136, 210, -136, { strokeWidth: 2 });
  const npD = T(NP, "Feb 2019", -210, -104, 40, INK2, {});
  const h1 = T(NP, "Too dangerous", 0, -38, 54, INK, MID), h2 = T(NP, "to release?", 0, 46, 54, INK, MID); fitT(h1, 430); fitT(h2, 430);
  rr(NP, -210, 72, 190, 140, { fill: EX.grayF, fillStyle: "hachure", hachureGap: 12, strokeWidth: 3 });
  rr(NP, -150, 104, 70, 60, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 }); el("circle", { cx: -128, cy: 132, r: 6, fill: INK }, NP); el("circle", { cx: -102, cy: 132, r: 6, fill: INK }, NP); rline(NP, -115, 104, -115, 88, { strokeWidth: 3 });
  dlines(NP, 0, 86, [200, 180, 205, 160, 196, 120], 24, "#adb5bd", 5);
  npA.to({ o: 1 }, L0("i3") + 0.06, 0.01).to({ x: 370, y: 625, r: -3 }, L0("i3") + 0.07, 0.55, "expo.out");
  ring(NP, -128, -118, 230, 66, EX.orange, wt("i3", "nineteen") - 0.04, 4.5);
  // OpenAI, the crate, the lock
  const oa3 = G(S3.top); img(oa3, "openai.svg", -110, -30, 58, 58); T(oa3, "OpenAI", -40, 20, 56, INK);
  pop(oa3, wt("i3", "openai") - 0.08, 770, 470, 1, 0);
  const tHd = wt("i3", "held") - 0.08;
  const crate = G(S3.mid, { opacity: 0 });
  rpath(crate, "M620 650 L664 604 L960 604 L916 650 Z", { fill: ORF, fillStyle: "hachure", hachureGap: 12, stroke: EX.orangeT, strokeWidth: 4 });
  rpath(crate, "M916 650 L960 604 L960 836 L916 884 Z", { fill: ORF, fillStyle: "solid", stroke: EX.orangeT, strokeWidth: 4 });
  rr(crate, 620, 650, 296, 234, { fill: "#fff4e6", fillStyle: "solid", stroke: EX.orangeT, strokeWidth: 4.5 });
  [700, 780].forEach((y) => rline(crate, 628, y + 30, 908, y + 30, { stroke: EX.orangeT, strokeWidth: 2.5, roughness: 0.8 }));
  drawAt(crate, tHd, 0.4);
  const gpt2 = wr(S3.top, "GPT-2", 768, 860, 72, INK, wt("i3", "gpt2") - 0.06, { anchor: "middle", cps: 16, maxW: 270 });
  const tBk = wt("i3", "back") - 0.04;
  const strap = G(S3.mid, { opacity: 0 }); rline(strap, 632, 660, 904, 874, { stroke: INK2, strokeWidth: 9, roughness: 0.8 }); rline(strap, 904, 660, 632, 874, { stroke: INK2, strokeWidth: 9, roughness: 0.8 }); drawAt(strap, tBk - 0.1, 0.2);
  const lk = G(S3.top), lkA = GA(lk, { x: 768, y: 740, s: 0.3, o: 0 });
  const shO = G(lk), shC = G(lk, { opacity: 0 });
  rpath(shO, "M-22 -10 L-22 -50 Q-22 -78 4 -78 Q30 -78 30 -50 L30 -40", { strokeWidth: 7, roughness: 0.6 });
  rpath(shC, "M-22 -10 L-22 -40 Q-22 -66 0 -66 Q22 -66 22 -40 L22 -10", { strokeWidth: 7, roughness: 0.6 });
  rr(lk, -42, -14, 84, 70, { fill: "#ffd43b", fillStyle: "solid", stroke: INK, strokeWidth: 4 });
  el("circle", { cx: 0, cy: 14, r: 7, fill: INK }, lk); rline(lk, 0, 18, 0, 36, { strokeWidth: 4 });
  lkA.to({ o: 1, s: 1 }, tHd + 0.12, 0.25, "back.out(2)");
  hide(shO, tBk, 0.01); show(shC, tBk, 0.01);
  lkA.to({ s: 1.15 }, tBk, 0.06, "power2.out").to({ s: 1 }, tBk + 0.06, 0.25, "back.out(3)");
  // an earlier model: the timeline
  const tEr = wt("i3", "an") - 0.06;
  const tl3 = arrow(S3.mid, 170, 1040, 930, 1040, { strokeWidth: 4 }); hide(tl3, 0); show(tl3, tEr); drawIn(tl3, tEr, 0.3);
  const d1 = G(S3.mid, { opacity: 0 }); rell(d1, 300, 1040, 30, 30, { fill: INK, fillStyle: "solid" }); show(d1, tEr + 0.12, 0.1);
  const d2 = G(S3.mid, { opacity: 0 }); rell(d2, 760, 1040, 30, 30, { fill: INK, fillStyle: "solid" }); show(d2, tEr + 0.22, 0.1);
  wr(S3.top, "2019", 300, 1008, 46, INK2, tEr + 0.12, { anchor: "middle", cps: 24 });
  wr(S3.top, "GPT-2", 300, 1100, 48, INK, tEr + 0.16, { anchor: "middle", cps: 24 });
  wr(S3.top, "2022", 760, 1008, 46, INK2, tEr + 0.22, { anchor: "middle", cps: 24 });
  wr(S3.top, "ChatGPT", 760, 1100, 48, INK, tEr + 0.26, { anchor: "middle", cps: 30 });
  ring(S3.fx, 300, 1075, 190, 110, EX.orange, wt("i3", "earlier") - 0.02, 4.5);
  // the worries: warning signs, then fake news, spam, scams
  const warn = (x, y, t) => { const g = G(S3.fx); rpath(g, "M0 -34 L32 24 L-32 24 Z", { fill: EX.redF, fillStyle: "solid", stroke: EX.red, strokeWidth: 4 }); T(g, "!", 0, 16, 40, EX.red, MID); pop(g, t, x, y, 1, 0); };
  warn(905, 548, wt("i3", "worries") - 0.08); warn(588, 912, wt("i3", "worries") + 0.06);
  [["fake news", 270], ["spam", 545], ["scams", 790]].forEach(([s, x], i) => { const g = G(S3.top); pill(g, s, 0, 0, EX.red, EX.redF, 46, "solid"); pop(g, wt("i3", "malicious") - 0.08 + i * 0.13, x, 1195, 1, i % 2 ? 3 : -3); });

  // ====================================================================================================
  // THE VENDING MACHINE: Claude's snack shop. Drawn on S4, carried to S6. Local origin: its centre (330 x 700).
  // ====================================================================================================
  const MACH = el("g", {}, D);
  const machA = GA(MACH, { x: SB(1, 2).x + 310, y: SB(1, 2).y + 830, o: 0 });
  const MB_ = G(MACH);
  rr(MB_, -165, -350, 330, 700, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  rr(MB_, -145, -330, 290, 74, { fill: "#fff4e6", fillStyle: "solid", strokeWidth: 3 });
  rr(MB_, -145, -238, 205, 404, { fill: ICEF, fillStyle: "solid", strokeWidth: 3.5 });
  [-148, -58, 32, 122].forEach((y) => rline(MB_, -140, y + 30, 55, y + 30, { strokeWidth: 3, roughness: 0.6 }));
  rr(MB_, 82, -226, 46, 12, { fill: INK, fillStyle: "solid", strokeWidth: 2 });
  rr(MB_, 76, -196, 62, 44, { fill: EX.greenF, fillStyle: "solid", strokeWidth: 2.5 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) rr(MB_, 80 + c * 20, -130 + r * 26, 14, 16, { strokeWidth: 2, roughness: 0.4 });
  rr(MB_, -145, 196, 290, 96, { fill: EX.grayF, fillStyle: "hachure", hachureGap: 12, strokeWidth: 3.5 });
  T(MB_, "PUSH", 0, 256, 36, INK2, { ...MID, ...DECO });
  rr(MB_, -150, 350, 44, 20, { fill: INK, fillStyle: "solid", strokeWidth: 2 }); rr(MB_, 106, 350, 44, 20, { fill: INK, fillStyle: "solid", strokeWidth: 2 });
  // the snacks (S4), later swapped for metal cubes
  const SLOT = []; [-148, -58, 32, 122].forEach((y) => [-112, -50, 12].forEach((x) => SLOT.push([x + 4, y + 30])));
  const SN = G(MACH);
  const SNF = [EX.redF, EX.yellowF, EX.greenF, EX.blueF, EX.violetF, ORF];
  SLOT.forEach(([x, y], i) => { if (i % 3 === 1) rr(SN, x - 16, y - 54, 34, 52, { fill: SNF[(i * 5) % 6], fillStyle: "solid", strokeWidth: 2.5, roughness: 0.6 }); else rpath(SN, `M${x - 22} ${y - 4} L${x - 24} ${y - 58} Q${x} ${y - 66} ${x + 24} ${y - 58} L${x + 22} ${y - 4} Z`, { fill: SNF[(i * 5) % 6], fillStyle: "hachure", hachureGap: 8, strokeWidth: 2.5, roughness: 0.6 }); });
  const CL = G(MACH, { opacity: 0 }); img(CL, "claude.svg", -132, -318, 50, 50); T(CL, "Claude", -72, -277, 48, INK);
  drawIn(MACH, L0("i4") + 0.12, 0.5);
  machA.to({ o: 1 }, L0("i4") + 0.1, 0.05);

  // ====================================================================================================
  // S4 (1,2) i4 + i5: layer 2. Anthropic lets Claude run a real snack shop in its office for about a month (Day 1 -> 30).
  // Employees ask for discounts on Slack, codes fly, a tungsten-cube joke fills the machine with metal cubes, sold below cost.
  // ====================================================================================================
  const S4 = station(1, 2), b4 = SB(1, 2);
  { const p = F(1, 2), t = L0("i4") - 0.15; cam({ s: camLast.s, x: camLast.x, y: camLast.y + 14 }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  head(S4.top, "LAYER 2", L0("i4") + 0.33, wt("i4", "anthropic") - 0.2, EX.blue, 88, 410);
  const an4 = G(S4.top); img(an4, "anthropic.svg", -150, -44, 64, 64); T(an4, "Anthropic", -72, 6, 56, INK);
  pop(an4, wt("i4", "anthropic") - 0.08, 720, 440, 1, 0);
  const tCl = wt("i4", "claude") - 0.06;
  show(CL, tCl, 0.12);
  ring(S4.fx, 300, 537, 300, 96, EX.orange, tCl + 0.05, 4);
  // the awning on "snack shop"
  const AW = G(MACH), awA = GA(AW, { x: 0, y: -60, o: 0 });
  rpath(AW, "M-190 -392 L190 -392 L190 -346 L-190 -346 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  for (let k = 0; k < 6; k++) rpath(AW, `M${-190 + k * 63.3} -392 L${-190 + k * 63.3 + 31.7} -392 L${-190 + k * 63.3 + 31.7} -346 L${-190 + k * 63.3} -346 Z`, { stroke: "none", fill: EX.red, fillStyle: "hachure", hachureGap: 7, fillWeight: 2.5 });
  rpath(AW, "M-190 -346 Q-158 -322 -127 -346 Q-95 -322 -63 -346 Q-32 -322 0 -346 Q32 -322 63 -346 Q95 -322 127 -346 Q158 -322 190 -346", { strokeWidth: 3.5 });
  awA.to({ o: 1, y: 0 }, wt("i4", "snack") - 0.08, 0.3, "back.out(2)");
  // "in its office": a plant and a note
  const plant = G(S4.mid, { opacity: 0 });
  rpath(plant, "M850 1250 L840 1170 L920 1170 L910 1250 Z", { fill: ORF, fillStyle: "solid", stroke: EX.orangeT, strokeWidth: 3.5 });
  [[-30, -90], [0, -120], [30, -84], [-12, -60], [18, -66]].forEach(([dx, dy]) => rpath(plant, `M880 1170 Q${880 + dx * 0.4} ${1170 + dy * 0.6} ${880 + dx} ${1170 + dy}`, { stroke: EX.green, strokeWidth: 5 }));
  drawAt(plant, wt("i4", "office") - 0.1, 0.3);
  const off4 = wr(S4.top, "in the office", 680, 1220, 48, INK2, wt("i4", "office") - 0.04, { anchor: "middle", cps: 40, maxW: 300 });
  // the calendar: Day 1 -> Day 30
  const CAL = G(S4.top), calA = GA(CAL, { x: 735, y: 760, s: 0.3, o: 0, r: 2 });
  rr(CAL, -150, -150, 300, 300, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  rr(CAL, -150, -150, 300, 76, { fill: EX.redF, fillStyle: "solid", strokeWidth: 4.5 });
  [-80, 80].forEach((x) => rr(CAL, x - 9, -176, 18, 48, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 }));
  T(CAL, "DAY", 0, -96, 48, INK, MID);
  const calN = T(CAL, "1", 0, 84, 150, INK, MID);
  const tMo = wt("i4", "about", 0) - 0.12;
  calA.to({ o: 1, s: 1 }, tMo, 0.28, "back.out(2)");
  kit.counter(calN, 1, 30, tMo + 0.2, wt("i5", "employees") - tMo - 0.45, (v) => String(Math.round(v)), "power1.in");
  calA.to({ o: 0, s: 0.4, y: 700 }, wt("i5", "employees") - 0.16, 0.18, "power2.in");
  [off4, plant].forEach((n) => fade(n, wt("i5", "employees") - 0.16, 0.15));
  // the Slack channel
  const tEm = wt("i5", "employees") - 0.1;
  const SLK = G(S4.mid, { opacity: 0 });
  appWin(SLK, 505, 520, 440, 450, { title: "# snack-shop", size: 40 });
  drawAt(SLK, tEm - 0.05, 0.35);
  const msg = (y, fill, letter, text, t, extra) => {
    const g = G(S4.top);
    avatar(g, 0, 0, 27, fill, letter);
    const tt = T(g, text, 44, 14, 44, INK); fitT(tt, 290);
    if (extra && extra.typeAt) { typeOn(tt, extra.typeAt, 0.4); extra = extra.fn; }
    if (extra) extra(g);
    const a = GA(g, { x: 590, y, o: 0 }); a.to({ o: 1, x: 552 }, t, 0.25, "power3.out");
    return g;
  };
  msg(640, EX.blueF, "A", "discount?", wt("i5", "employees") - 0.04);
  msg(730, EX.greenF, "J", "code pls!", wt("i5", "talked") - 0.04);
  msg(820, EX.violetF, "M", "me too!", wt("i5", "into") - 0.06);
  const tJk = wt("i5", "joke") - 0.08;
  msg(910, ORF, "K", "tungsten cube?", tJk, { typeAt: wt("i5", "tungsten") - 0.06, fn: (g) => { const c = G(g, { opacity: 0 }); cube(c, 372, 0, 20, "#adb5bd"); show(c, wt("i5", "cube") - 0.04, 0.08); } });
  // discount codes fly out of the machine
  const tDc = wt("i5", "discount") - 0.08;
  [["-10%", 590], ["-25%", 735], ["-15%", 880]].forEach(([s, x], i) => {
    const g = G(S4.fx); pill(g, s, 0, 0, EX.green, EX.greenF, 42, "solid");
    const a = GA(g, { x: 400, y: 700, s: 0.4, o: 0, r: 0 });
    const t = tDc + i * 0.12;
    a.to({ o: 1 }, t, 0.01).to({ x: (400 + x) / 2, y: 980, s: 0.9, r: i % 2 ? 160 : -160 }, t + 0.01, 0.22, "power2.out").to({ x, y: 1045, s: 1, r: i % 2 ? 357 : -363 }, t + 0.23, 0.24, "power2.in");
  });
  // the cubes replace the snacks
  const tMc = wt("i5", "metal") - 0.12;
  hide(SN, tMc, 0.12);
  const CU = G(MACH);
  SLOT.forEach(([x, y], i) => { const g = G(CU); cube(g, 0, 0, 26, "#adb5bd"); pop(g, tMc + 0.05 + i * 0.04, x, y - 28, 1, 0); });
  // sold below cost: a red price tag on the machine
  const tBc = wt("i5", "below") - 0.08;
  const ptag = G(S4.top), tagA = GA(ptag, { x: 300, y: 1000, s: 0.3, o: 0, r: -8 });
  rpath(ptag, "M-150 -60 L120 -60 L170 0 L120 60 L-150 60 Z", { fill: EX.redF, fillStyle: "solid", stroke: EX.red, strokeWidth: 4.5 });
  el("circle", { cx: 122, cy: 0, r: 10, fill: PAPER, stroke: EX.red, "stroke-width": 3 }, ptag);
  T(ptag, "below cost", -15, 16, 50, EX.red, { ...MID, ...HALO() });
  tagA.to({ o: 1, s: 1 }, tBc, 0.28, "back.out(2)");

  // ====================================================================================================
  // S6 (2,2) i6 + i7: the machine travels along. A payment screen to an account Claude made up; "I'll deliver in person!";
  // a blue blazer and a red tie drop onto the machine. i7: a profit chart going down, NO PROFIT.
  // ====================================================================================================
  const S6 = station(2, 2), b6 = SB(2, 2);
  { const p = F(2, 2), t = L0("i6") - 0.2; cam({ s: camLast.s, x: camLast.x + 14, y: camLast.y }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p;
    machA.to({ x: b6.x + 310 }, t, 0.5, "expo.inOut"); }
  const PW = G(S6.mid, { opacity: 0 });
  appWin(PW, 520, 380, 425, 470, { title: "Pay", size: 42 });
  T(PW, "Send money", 550, 505, 48, INK);
  T(PW, "To:", 550, 590, 44, INK2);
  rr(PW, 625, 545, 290, 66, { strokeWidth: 3, roughness: 0.6 });
  T(PW, "$3.00", 732, 715, 80, INK, MID);
  pill(G(PW), "Pay", 732, 795, EX.blue, EX.blueF, 46, "solid");
  drawAt(PW, wt("i6", "pay") - 0.2, 0.4);
  const qq = wr(S6.top, "???", 645, 594, 52, EX.red, wt("i6", "made") - 0.06, { cps: 14, maxW: 250 });
  const qR = ring(S6.fx, 770, 578, 330, 100, EX.red, wt("i6", "up") - 0.02, 4.5);
  const BUB = G(S6.top), bubA = GA(BUB, { x: 735, y: 990, s: 0.3, o: 0 });
  rr(BUB, -210, -95, 420, 190, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rpath(BUB, "M-210 -20 L-268 -70 L-210 30", { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rline(BUB, -208, -18, -208, 28, { stroke: PAPER, strokeWidth: 8, boil: false });
  const bt1 = T(BUB, "I'll deliver it", 0, -14, 50, INK, MID), bt2 = T(BUB, "in person!", 0, 50, 50, INK, MID);
  const tSd = wt("i6", "said") - 0.08;
  bubA.to({ o: 1, s: 1 }, tSd, 0.25, "back.out(2)");
  typeOn(bt1, tSd + 0.12, 0.5); typeOn(bt2, wt("i6", "in", 0) - 0.04, 0.35);
  // the blazer and the tie, on the machine
  const BLZ = G(MACH), blzA = GA(BLZ, { x: 0, y: -260, o: 0 });
  rpath(BLZ, "M-150 -250 L-60 -250 L0 -60 L60 -250 L150 -250 L172 140 L-172 140 Z", { fill: EX.blue, fillStyle: "hachure", hachureGap: 9, fillWeight: 2.5, stroke: EX.blue, strokeWidth: 5 });
  rpath(BLZ, "M-60 -250 L0 -60 L60 -250", { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 3.5 });
  rpath(BLZ, "M-60 -250 L-92 -150 L-40 -120 M60 -250 L92 -150 L40 -120", { stroke: INK, strokeWidth: 3.5 });
  [-10, 50].forEach((y) => el("circle", { cx: 18, cy: y, r: 8, fill: INK }, BLZ));
  rline(BLZ, 0, -60, 0, 140, { stroke: INK, strokeWidth: 3 });
  blzA.to({ o: 1 }, wt("i6", "blue") - 0.12, 0.01).to({ y: 0 }, wt("i6", "blue") - 0.11, 0.3, "back.out(1.6)");
  const TIE = G(MACH), tieA = GA(TIE, { x: 0, y: -220, o: 0 });
  rpath(TIE, "M-16 -246 L16 -246 L10 -222 L-10 -222 Z", { fill: EX.red, fillStyle: "solid", stroke: "#c92a2a", strokeWidth: 3 });
  rpath(TIE, "M-10 -222 L10 -222 L26 -110 L0 -78 L-26 -110 Z", { fill: EX.red, fillStyle: "solid", stroke: "#c92a2a", strokeWidth: 3 });
  tieA.to({ o: 1 }, wt("i6", "red") - 0.12, 0.01).to({ y: 0 }, wt("i6", "red") - 0.11, 0.26, "back.out(1.8)");
  // i7: the profit chart
  const tPr = L0("i7") - 0.1;
  fade(PW, tPr, 0.18); fade(qq, tPr, 0.15); fade(qR, tPr, 0.15);
  const CH = G(S6.mid, { opacity: 0 });
  rr(CH, 520, 380, 425, 470, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  T(CH, "shop profit", 732, 450, 50, INK, MID);
  rline(CH, 570, 790, 920, 790, { strokeWidth: 4 }); rline(CH, 570, 790, 570, 490, { strokeWidth: 4 });
  T(CH, "$", 546, 520, 44, INK2, MID);
  drawAt(CH, tPr, 0.35);
  const pl7 = clipReveal(S6.top, 575, 470, 345, 330, wt("i7", "never") - 0.1, 0.75, "power1.in");
  rpath(pl7, "M585 560 L640 545 L690 600 L740 590 L790 680 L850 700 L905 770", { stroke: EX.red, strokeWidth: 7, roughness: 0.8 });
  stampF(S6.top, "NO PROFIT", 732, 650, 330, 110, EX.red, EX.redF, wt("i7", "money") - 0.1, -6, 60, 23);
  shake(wt("i7", "money") - 0.02, 0.9);

  // ====================================================================================================
  // S8 (2,3) i8: layer 3. China's DeepSeek, January 2025: #1 on the App Store; Nvidia's chart crashes, -$590B in 1 day.
  // ====================================================================================================
  const S8 = station(2, 3), b8 = SB(2, 3);
  { const p = F(2, 3), t = L0("i8") - 0.12; cam({ s: camLast.s, x: camLast.x, y: camLast.y + 14 }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  const ds = G(S8.top); img(ds, "deepseek.svg", -60, -60, 120, 120);
  pop(ds, wt("i8", "chinas") - 0.06, 215, 450, 1, 0);
  wr(S8.top, "DeepSeek", 295, 478, 84, INK, wt("i8", "deepseek") - 0.06, { cps: 26, maxW: 340 });
  wr(S8.top, "from China", 298, 540, 46, INK2, wt("i8", "deepseek") + 0.2, { cps: 34, maxW: 300 });
  const jan = G(S8.top); rr(jan, -34, -34, 68, 68, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 }); rr(jan, -34, -34, 68, 22, { fill: EX.redF, fillStyle: "solid", strokeWidth: 3.5 }); rline(jan, -18, 4, 18, 4, { strokeWidth: 2.5 }); rline(jan, -18, 18, 10, 18, { strokeWidth: 2.5 });
  pop(jan, wt("i8", "january") - 0.08, 690, 445, 1, 0);
  wr(S8.top, "Jan 2025", 740, 462, 50, INK, wt("i8", "january") - 0.04, { cps: 24, maxW: 200 });
  // the App Store chart: DeepSeek climbs to #1
  const tAs = wt("i8", "twentyfive") - 0.1;
  const AS = G(S8.mid, { opacity: 0 });
  appWin(AS, 135, 600, 395, 420, { title: "Top free apps", size: 38 });
  [0, 1, 2].forEach((k) => T(AS, String(k + 1), 168, 752 + k * 100, 46, INK2, MID));
  drawAt(AS, tAs, 0.35);
  const ROWS = G(S8.mid);
  const row = (y, iconFill, logo, name, t) => {
    const g = G(ROWS);
    rr(g, 0, -34, 68, 68, { fill: iconFill, fillStyle: "solid", strokeWidth: 3 });
    if (logo) img(g, logo, 8, -26, 52, 52);
    if (name) { const e = T(g, name, 82, 14, 42, INK); fitT(e, 168); } else dlines(g, 86, 0, [150], 0, "#ced4da", 9);
    const a = GA(g, { x: 200, y, o: 0 }); a.to({ o: 1 }, t, 0.2);
    return a;
  };
  const rC = row(736, PAPER, "openai.svg", "ChatGPT", tAs + 0.15), rX = row(836, EX.grayF, null, null, tAs + 0.22), rD = row(936, ICEF, "deepseek.svg", "DeepSeek", tAs + 0.29);
  const tVr = wt("i8", "went") - 0.06;
  rD.to({ y: 736 }, tVr, 0.4, "power3.inOut"); rC.to({ y: 836 }, tVr + 0.04, 0.4, "power3.inOut"); rX.to({ y: 936 }, tVr + 0.08, 0.4, "power3.inOut");
  const n1 = G(S8.top); rell(n1, 0, 0, 92, 92, { fill: EX.orange, fillStyle: "solid", stroke: EX.orangeT, strokeWidth: 3 }); T(n1, "#1", 0, 16, 46, INK, MID);
  pop(n1, wt("i8", "viral") - 0.02, 505, 700, 0.8, 8);
  // Nvidia's stock chart crashes
  const NV = G(S8.mid, { opacity: 0 });
  rr(NV, 565, 600, 380, 420, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  T(NV, "stock", 912, 652, 42, INK2, END);
  rline(NV, 600, 975, 915, 975, { strokeWidth: 3.5 }); rline(NV, 600, 975, 600, 700, { strokeWidth: 3.5 });
  drawAt(NV, wt("i8", "and") - 0.1, 0.35);
  const nvl = clipReveal(S8.top, 602, 690, 318, 290, wt("i8", "helped") - 0.06, 0.45, "none");
  rpath(nvl, "M610 790 L650 770 L690 780 L730 745 L770 755 L800 735", { stroke: EX.green, strokeWidth: 6, roughness: 0.7 });
  const nvc = clipReveal(S8.top, 798, 690, 122, 290, wt("i8", "wipe") - 0.04, 0.32, "power2.in");
  rpath(nvc, "M800 735 L828 935 L870 920 L910 940", { stroke: EX.red, strokeWidth: 7, roughness: 0.7 });
  const nva = arrow(S8.fx, 870, 760, 870, 880, { stroke: EX.red, strokeWidth: 6 }); hide(nva, 0); show(nva, wt("i8", "wipe") + 0.2); drawIn(nva, wt("i8", "wipe") + 0.2, 0.2);
  shake(wt("i8", "wipe") + 0.18, 1.1);
  const big8 = G(S8.top, { opacity: 0 });
  const b8N = T(big8, "-$0", 540, 1158, 120, EX.red, { ...MID, ...HALO() });
  show(big8, wt("i8", "five") - 0.08);
  kit.counter(b8N, 0, 590, wt("i8", "five") - 0.06, wt("i8", "dollars") - wt("i8", "five") + 0.1, (v) => "−$" + Math.round(v) + "B", "power2.out");
  const nvL = G(S8.top); img(nvL, "nvidia.svg", -80, -15, 160, 30); pop(nvL, wt("i8", "nvidia") - 0.1, 670, 640, 1, 0);
  ring(S8.fx, 670, 640, 210, 70, EX.orange, wt("i8", "nvidia") + 0.1, 4.5);
  wr(S8.top, "in 1 day", 540, 1240, 58, INK, wt("i8", "in", 1) - 0.04, { anchor: "middle", cps: 30 });

  // ====================================================================================================
  // S9 (1,3) i9: months later DeepSeek tells Nature; the receipt: final training run $294,000, SELF-REPORTED.
  // ====================================================================================================
  const S9 = station(1, 3), b9 = SB(1, 3);
  { const p = F(1, 3), t = L0("i9") - 0.12; cam({ s: camLast.s, x: camLast.x - 14, y: camLast.y }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  const NPG = G(S9.mid), npgA = GA(NPG, { x: -300, y: 700, r: -20, o: 0 });
  rr(NPG, -215, -320, 430, 640, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  img(NPG, "nature.svg", -150, -292, 300, 73);
  rline(NPG, -190, -200, 190, -200, { strokeWidth: 3 });
  T(NPG, "Article", -190, -150, 38, EX.red, {});
  T(NPG, "DeepSeek-R1", -190, -92, 54, INK, {});
  dlines(NPG, -190, -40, [370, 340, 365, 300, 355, 330, 260], 28, "#adb5bd", 5);
  rr(NPG, -190, 170, 380, 120, { strokeWidth: 3, roughness: 0.6 });
  [[-150, 60], [-90, 90], [-30, 40], [30, 75], [90, 55]].forEach(([x, h]) => rr(NPG, x, 270 - h, 34, h, { fill: EX.blueF, fillStyle: "solid", strokeWidth: 2.5, roughness: 0.5 }));
  const tJn = wt("i9", "journal") - 0.12;
  npgA.to({ o: 1 }, tJn, 0.01).to({ x: 340, y: 700, r: -2 }, tJn + 0.01, 0.5, "expo.out");
  const sep = G(S9.top); rr(sep, -150, -46, 330, 92, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 }); rr(sep, -132, -28, 56, 56, { fill: EX.redF, fillStyle: "solid", strokeWidth: 3 }); T(sep, "Sep 2025", -60, 16, 50, INK, {});
  const sepA = GA(sep, { x: 540, y: 760, s: 0.3, o: 0, r: -2 });
  sepA.to({ o: 1, s: 1.3 }, L0("i9") + 0.06, 0.3, "back.out(2)").to({ x: 345, y: 1100, s: 1 }, tJn - 0.05, 0.45, "power3.inOut");
  const dsT = G(S9.top); img(dsT, "deepseek.svg", -50, -50, 100, 100); pop(dsT, wt("i9", "deepseek") - 0.08, 800, 445, 1, 0);
  const ar9 = arrow(S9.fx, 735, 470, 575, 470, { stroke: EX.blue, strokeWidth: 5 }, 0.1); hide(ar9, 0); show(ar9, wt("i9", "told") - 0.04); drawIn(ar9, wt("i9", "told") - 0.04, 0.25);
  ring(NPG, 0, -255, 360, 110, EX.orange, wt("i9", "nature") - 0.04, 4.5);
  // the receipt prints down
  const tRc = wt("i9", "final") - 0.1;
  const RC = clipDown(S9.mid, 590, 520, 370, 660, tRc, 0.7);
  rpath(RC, "M600 540 L940 540 L940 1150 L920 1170 L898 1150 L876 1170 L854 1150 L832 1170 L810 1150 L788 1170 L766 1150 L744 1170 L722 1150 L700 1170 L678 1150 L656 1170 L634 1150 L612 1170 L600 1150 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  T(RC, "RECEIPT", 770, 605, 48, INK, { ...MID, "letter-spacing": 3 });
  T(RC, "DeepSeek-R1", 770, 660, 40, INK2, MID);
  rline(RC, 620, 690, 920, 690, { strokeWidth: 2.5, strokeLineDash: [10, 10] });
  T(RC, "final", 625, 750, 46, INK); T(RC, "training run", 625, 805, 46, INK);
  dlines(RC, 625, 850, [260, 200], 30, "#adb5bd", 5);
  rline(RC, 620, 900, 920, 900, { strokeWidth: 2.5, strokeLineDash: [10, 10] });
  T(RC, "TOTAL", 625, 960, 46, INK2);
  const rcN = T(RC, "$294,000", 770, 1044, 64, INK, MID); fitT(rcN, 280); rcN.textContent = "$0";
  kit.counter(rcN, 0, 294000, wt("i9", "under") - 0.04, wt("i9", "dollars") - wt("i9", "under") + 0.06, (v) => "$" + Math.round(v).toLocaleString("en-US"), "power2.out");
  stampF(S9.top, "self-reported", 770, 1116, 320, 70, EX.orangeT, ORF, wt("i9", "dollars") + 0.05, -6, 50, 29, 0);

  // ====================================================================================================
  // S10 (1,4) i10: layer 4. Models get tiny (the model box shrinks); Google's test: a small Gemma on a phone ran 25 chats,
  // and the battery barely moved: 100% -> 99.25%.
  // ====================================================================================================
  const S10 = station(1, 4), b10 = SB(1, 4);
  { const p = F(1, 4), t = L0("i10") - 0.19; cam({ s: camLast.s, x: camLast.x, y: camLast.y + 14 }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.55, "expo.inOut"); camLast = p; }
  const MB = G(S10.top), mbA = GA(MB, { x: 540, y: 760, s: 0.3, o: 0 });
  cube(MB, 0, 0, 170, ICEP, INK);
  const mbL = G(MB); T(mbL, "AI model", 0, 250, 56, INK, { ...MID, ...HALO() });
  mbA.to({ o: 1, s: 1 }, L0("i10") + 0.3, 0.3, "back.out(1.8)");
  fade(mbL, wt("i10", "tiny") - 0.14, 0.1);
  mbA.to({ s: 0.24, y: 500, x: 700 }, wt("i10", "tiny") - 0.1, 0.4, "back.in(1.4)");
  const tny = wr(S10.top, "tiny!", 840, 522, 64, EX.orangeT, wt("i10", "tiny") + 0.2, { anchor: "middle", cps: 18, maxW: 140 });
  const gg = G(S10.top); img(gg, "google_g.svg", -32, -32, 64, 64); pop(gg, wt("i10", "googles") - 0.08, 190, 440, 1, 0);
  wr(S10.top, "Google's test", 238, 460, 54, INK, wt("i10", "googles") - 0.04, { cps: 34, maxW: 330 });
  // the phone
  const PH = G(S10.mid, { opacity: 0 });
  rr(PH, 160, 520, 380, 730, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  rr(PH, 300, 538, 100, 22, { fill: INK, fillStyle: "solid", strokeWidth: 2 });
  T(PH, "9:41", 190, 590, 36, INK2, DECO);
  rr(PH, 470, 568, 40, 20, { strokeWidth: 2.5, roughness: 0.4 }); rr(PH, 474, 572, 30, 12, { fill: EX.green, fillStyle: "solid", stroke: "none", boil: false });
  rline(PH, 175, 690, 525, 690, { strokeWidth: 2.5, roughness: 0.6 });
  rr(PH, 190, 1150, 320, 70, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5, roughness: 0.6 });
  drawAt(PH, wt("i10", "in") - 0.04, 0.4);
  const cnt = G(S10.top, { opacity: 0 }); const cntT = T(cnt, "chats: 0", 350, 1198, 44, INK, MID); show(cnt, wt("i10", "twentyfive") - 0.25, 0.1);
  kit.counter(cntT, 0, 25, wt("i10", "twentyfive") - 0.2, wt("i10", "on") - wt("i10", "twentyfive") + 0.2, (v) => "chats: " + Math.round(v), "power1.inOut");
  const tGm = wt("i10", "gemma") - 0.08;
  mbA.to({ x: 222, y: 642, s: 0.2 }, tGm - 0.25, 0.3, "power3.inOut");
  wr(S10.top, "Gemma", 262, 660, 50, INK, tGm, { cps: 22, maxW: 250 });
  // chat bubbles scroll up through the chat area while the 25 chats run
  { const id = "chatclip", cp = el("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, defs); el("rect", { x: 170, y: 700, width: 360, height: 440 }, cp);
    const CC = G(S10.mid, { "clip-path": `url(#${id})` }), CI = G(CC), ciA = GA(CI, { x: 0, y: 0, o: 0 });
    for (let k = 0; k < 16; k++) { const left = k % 2 === 0, w = 170 + ((k * 37) % 70), y = 740 + k * 82; rr(CI, left ? 190 : 510 - w, y, w, 58, { fill: left ? EX.grayF : EX.blueF, fillStyle: "solid", strokeWidth: 2.5, roughness: 0.6 }); }
    ciA.to({ o: 1 }, tGm + 0.2, 0.2).to({ y: -800 }, wt("i10", "twentyfive") - 0.2, wt("i10", "on") - wt("i10", "twentyfive") + 0.3, "power1.inOut"); }
  // the battery
  const BAT = G(S10.mid, { opacity: 0 });
  rr(BAT, 690, 600, 200, 400, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  rr(BAT, 750, 572, 80, 30, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  drawAt(BAT, wt("i10", "in") + 0.2, 0.35);
  const lvl = el("rect", { x: 706, y: 616, width: 168, height: 368, fill: EX.greenF, stroke: EX.green, "stroke-width": 3, rx: 10, opacity: 0 }, S10.mid);
  show(lvl, wt("i10", "test") + 0.2, 0.2);
  const bp = G(S10.top, { opacity: 0 }); const bpT = T(bp, "100%", 790, 1075, 64, INK, { ...MID, ...HALO() }); show(bp, wt("i10", "test") + 0.2, 0.15);
  const tUn = wt("i10", "under") - 0.06;
  kit.counter(bpT, 100, 99.25, tUn, 0.6, (v) => (v > 99.99 ? "100%" : v.toFixed(2) + "%"), "power2.out");
  tw(lvl, { attr: { y: 616, height: 368 } }, { attr: { y: 619, height: 365 }, duration: 0.6, ease: "power2.out", immediateRender: false }, tUn);
  wr(S10.top, "25 chats", 790, 1150, 50, INK, wt("i10", "chats") - 0.04, { anchor: "middle", cps: 30, maxW: 260 });
  wr(S10.top, "= 0.75%", 790, 1218, 54, EX.orangeT, wt("i10", "percent") - 0.02, { anchor: "middle", cps: 26, maxW: 260 });
  ring(S10.fx, 790, 1054, 300, 110, EX.orange, wt("i10", "percent") - 0.04, 4.5);

  // ====================================================================================================
  // S11 (0,4) i11: Microsoft's model where every number inside is -1, 0 or 1: the grid flips; a normal chip ticked,
  // no graphics card (crossed out).
  // ====================================================================================================
  const S11 = station(0, 4), b11 = SB(0, 4);
  { const p = F(0, 4), t = L0("i11") - 0.18; cam({ s: camLast.s, x: camLast.x - 14, y: camLast.y }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  const ms = G(S11.top); img(ms, "microsoft.svg", -170, -36, 340, 72); pop(ms, wt("i11", "microsoft") - 0.08, 540, 425, 1, 0);
  const GRD = G(S11.mid, { opacity: 0 });
  rr(GRD, 150, 510, 780, 410, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  T(GRD, "inside the model", 540, 568, 44, INK2, MID);
  rline(GRD, 170, 592, 910, 592, { strokeWidth: 2.5, roughness: 0.6 });
  drawAt(GRD, wt("i11", "built") - 0.06, 0.35);
  const V0 = ["0.73", "-1.28", "0.05", "2.41", "-0.62", "1.97", "0.31", "-2.04", "1.15", "-0.09", "0.88", "-1.60"], V1 = [1, -1, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1];
  const tNum = wt("i11", "every") - 0.06, tFl = { "-1": wt("i11", "minus") - 0.06, "0": wt("i11", "zero") - 0.06, "1": wt("i11", "one", 2) - 0.06 };
  V0.forEach((s, i) => {
    const x = 255 + (i % 4) * 190, y = 680 + Math.floor(i / 4) * 95;
    const g0 = G(S11.top, { opacity: 0 }), e0 = M(g0, s, x, y, 54, INK, MID);
    show(g0, tNum + i * 0.04, 0.05); typeOn(e0, tNum + i * 0.04, 0.2);
    const v = V1[i], tf = tFl[String(v)] + (i % 4) * 0.03;
    tw(g0, { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.12, ease: "power2.in", immediateRender: false }, tf);
    const g1 = G(S11.top, { opacity: 0 }); M(g1, v === -1 ? "-1" : String(v), x, y, 62, v === -1 ? EX.red : v === 0 ? INK2 : EX.greenT, MID);
    tw(g1, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.22, ease: "back.out(2)" }, tf + 0.08);
  });
  // a normal chip (ticked), no graphics card (crossed out)
  const CPU = G(S11.mid, { opacity: 0 });
  rr(CPU, 205, 985, 190, 190, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  rr(CPU, 245, 1025, 110, 110, { fill: EX.grayF, fillStyle: "hachure", hachureGap: 10, strokeWidth: 3 });
  for (let k = 0; k < 5; k++) { const o = 225 + k * 37.5; rline(CPU, o, 985, o, 960, { strokeWidth: 3.5 }); rline(CPU, o, 1175, o, 1200, { strokeWidth: 3.5 }); rline(CPU, 205, o + 780, 180, o + 780, { strokeWidth: 3.5 }); rline(CPU, 395, o + 780, 420, o + 780, { strokeWidth: 3.5 }); }
  T(CPU, "CPU", 300, 1096, 46, INK, { ...MID, ...HALO() });
  drawAt(CPU, wt("i11", "normal") - 0.08, 0.35);
  bigTick(S11.top, 405, 975, 2.2, wt("i11", "chip") - 0.04);
  wr(S11.top, "normal chip", 300, 1258, 46, INK2, wt("i11", "computer") - 0.06, { anchor: "middle", cps: 34, maxW: 280 });
  const GPU = G(S11.mid, { opacity: 0 });
  rr(GPU, 520, 1000, 400, 170, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  [625, 815].forEach((x) => { rell(GPU, x, 1085, 120, 120, { strokeWidth: 3.5 }); for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2 + 0.4; rpath(GPU, `M${x} 1085 Q${x + Math.cos(a) * 40} ${1085 + Math.sin(a) * 40 - 14} ${x + Math.cos(a + 0.5) * 52} ${1085 + Math.sin(a + 0.5) * 52}`, { strokeWidth: 3 }); } });
  rr(GPU, 540, 1170, 140, 22, { fill: EX.yellowF, fillStyle: "solid", strokeWidth: 3 });
  drawAt(GPU, wt("i11", "no") - 0.1, 0.3);
  wr(S11.top, "graphics card", 720, 1258, 46, INK2, wt("i11", "graphics") - 0.04, { anchor: "middle", cps: 40, maxW: 360 });
  const gx = G(S11.fx, { opacity: 0 }); xmark(gx, 720, 1085, 115, EX.red, 10); drawAt(gx, wt("i11", "card") - 0.06, 0.2);

  // ====================================================================================================
  // TAY'S CARD: the 2016 tweet card. Drawn on S12, carried to S13. Local origin: its centre (810 x 460).
  // ====================================================================================================
  const TC = el("g", {}, D);
  const tcA = GA(TC, { x: SB(0, 5).x + 540, y: SB(0, 5).y + 720, s: 1, o: 0 });
  const TCB = G(TC);
  rr(TCB, -405, -230, 810, 460, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  rell(TCB, -322, -138, 124, 124, { fill: EX.grayF, fillStyle: "solid", stroke: TWB, strokeWidth: 4 });
  const tayNm = G(TC, { opacity: 0 }); T(tayNm, "TayTweets", -238, -150, 54, INK, {}); T(tayNm, "@TayandYou", -238, -96, 42, INK2, {});
  rline(TCB, -380, 118, 380, 118, { strokeWidth: 2.5, roughness: 0.6 });
  rpath(TCB, "M-330 160 Q-330 146 -314 146 L-282 146 Q-266 146 -266 160 Q-266 174 -282 174 L-306 174 L-322 186 L-318 174 Q-330 172 -330 160 Z", { strokeWidth: 3, stroke: INK2 });
  rpath(TCB, "M-60 150 L-30 150 L-30 182 M-38 174 L-30 184 L-22 174 M10 182 L-20 182 L-20 150 M-28 158 L-20 148 L-12 158", { strokeWidth: 3, stroke: INK2 });
  rpath(TCB, "M200 186 Q170 164 170 152 Q170 140 184 140 Q196 140 200 152 Q204 140 216 140 Q230 140 230 152 Q230 164 200 186 Z", { strokeWidth: 3, stroke: INK2 });
  const twb = G(TC); img(twb, "twitter.svg", -34, -28, 68, 56); const twbA = GA(twb, { x: 335, y: -165, s: 1, o: 1 });
  const tayImg = G(TC, { opacity: 0 });
  { const cp = el("clipPath", { id: "tayclip", clipPathUnits: "userSpaceOnUse" }, defs); el("circle", { cx: -322, cy: -138, r: 58 }, cp);
    img(tayImg, "tay.jpg", -380, -196, 116, 116, { "clip-path": "url(#tayclip)", preserveAspectRatio: "xMidYMid slice" });
    rell(tayImg, -322, -138, 124, 124, { stroke: TWB, strokeWidth: 4.5 }); }
  const twT = T(TC, "hellooooo world!!!", -370, -8, 58, INK, {}); fitT(twT, 740);
  const dtT = T(TC, "Mar 2016", -370, 66, 42, INK2, {});
  const tChb = G(TC, { opacity: 0 }); pill(tChb, "AI chatbot", 196, -96, EX.blue, EX.blueF, 40, "solid");
  // overlays for i13: the red tint and the scribbled tweet
  const TRED = G(TC, { opacity: 0 });
  rr(TRED, -405, -230, 810, 460, { stroke: EX.red, fill: EX.redF, fillStyle: "hachure", hachureGap: 18, fillWeight: 2, strokeWidth: 8 });
  const tscr = G(TC, { opacity: 0 }); scratch(tscr, -372, -50, 600, 46, EX.red, 61);

  // ====================================================================================================
  // S12 (0,5) i12: layer 5, the very bottom. Microsoft's Tay, a 2016 chatbot that learned from Twitter users.
  // ====================================================================================================
  const S12 = station(0, 5), b12 = SB(0, 5);
  { const p = F(0, 5), t = L0("i12") - 0.16; cam({ s: camLast.s, x: camLast.x, y: camLast.y + 14 }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  head(S12.top, "THE BOTTOM", wt("i12", "the") - 0.02, wt("i12", "microsofts") - 0.14, EX.blue, 92, 420);
  const msT = G(S12.top); T(msT, "made by", -20, 14, 46, INK2, END); img(msT, "microsoft.svg", 0, -27, 254, 54);
  pop(msT, wt("i12", "microsofts") + 0.06, 400, 420, 1, 0);
  tcA.to({ o: 1 }, wt("i12", "is") - 0.12, 0.01);
  drawIn(TCB, wt("i12", "is") - 0.12, 0.45);
  show(tayImg, wt("i12", "tay") - 0.06, 0.15); show(tayNm, wt("i12", "tay") - 0.04, 0.12);
  typeOn(twT, wt("i12", "tay") + 0.1, 0.45);
  typeOn(dtT, wt("i12", "twenty") - 0.06, 0.3);
  show(tChb, wt("i12", "chatbot") - 0.06, 0.15);
  // the Twitter users feeding it
  const tLr = wt("i12", "learned") - 0.1;
  [EX.blueF, EX.greenF, EX.violetF, ORF, EX.yellowF, EX.redF].forEach((f, k) => {
    const x = 190 + k * 140;
    const g = G(S12.mid); avatar(g, 0, 0, 34, f, "ABCDEF"[k]); pop(g, tLr + k * 0.05, x, 1105, 1, 0);
    const a = arrow(S12.fx, x, 1062, 540 + (x - 540) * 0.55, 952, { stroke: TWB, strokeWidth: 3.5 }); hide(a, 0); show(a, tLr + 0.15 + k * 0.05); drawIn(a, tLr + 0.15 + k * 0.05, 0.2);
  });
  const tTw = wt("i12", "twitter") - 0.06;
  twbA.to({ s: 1.35 }, tTw, 0.1, "power2.out").to({ s: 1 }, tTw + 0.1, 0.3, "back.out(3)");
  wr(S12.top, "Twitter users", 540, 1225, 50, INK, wt("i12", "users") - 0.06, { anchor: "middle", cps: 40 });

  // ====================================================================================================
  // S13 (1,5) i13: trolls pile replies on, the card turns red; PULLED OFFLINE; 16 hours.
  // ====================================================================================================
  const S13 = station(1, 5), b13 = SB(1, 5);
  { const p = F(1, 5), t = L0("i13") - 0.23; cam({ s: camLast.s, x: camLast.x - 14, y: camLast.y }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p;
    tcA.to({ x: b13.x + 540, y: b13.y + 600, s: 0.86 }, t, 0.5, "expo.inOut"); }
  const tTr = wt("i13", "trolls") - 0.06;
  [[365, 900, -3], [400, 990, 2], [360, 1080, -2], [395, 1170, 3]].forEach(([x, y, r], k) => {
    const g = G(S13.mid);
    rr(g, -215, -40, 430, 80, { fill: PAPER, fillStyle: "solid", stroke: EX.red, strokeWidth: 3.5 });
    avatar(g, -175, 0, 26, EX.redF, null, EX.red);
    el("circle", { cx: -184, cy: -4, r: 4, fill: EX.red }, g); el("circle", { cx: -166, cy: -4, r: 4, fill: EX.red }, g);
    rpath(g, "M-196 -22 L-184 -12 M-154 -22 L-166 -12 M-184 14 Q-175 6 -166 14", { stroke: EX.red, strokeWidth: 2.5 });
    scratch(g, -130, -16, 300, 32, EX.red, 70 + k);
    const a = GA(g, { x: x - 140, y: y + 60, s: 0.6, o: 0, r: r * 3 }); a.to({ o: 1, x, y, s: 1, r }, tTr + k * 0.13, 0.3, "back.out(1.6)");
  });
  wr(S13.top, "trolls", 750, 900, 60, EX.red, tTr + 0.1, { anchor: "middle", cps: 22, maxW: 200 });
  const tHt = wt("i13", "hate") - 0.06;
  show(TRED, tHt, 0.12); show(tscr, tHt + 0.04, 0.05); drawIn(tscr, tHt + 0.04, 0.25);
  shake(tHt + 0.05, 0.8);
  const FXT = el("g", {}, D);   // above the travelling card
  stampF(FXT, "PULLED OFFLINE", b13.x + 540, b13.y + 610, 640, 130, EX.red, EX.redF, wt("i13", "pulled") - 0.06, -7, 70, 37);
  // Tay's 16-hour timer (it travels on to S14)
  const TT = el("g", {}, D);
  timer(TT, wt("i13", "within") - 0.04, wt("i13", "hours") + 0.1, "Tay, 2016");
  const ttA = GA(TT, { x: b13.x + 780, y: b13.y + 1060, s: 0.3, o: 0 });
  ttA.to({ o: 1, s: 1 }, wt("i13", "microsoft") + 0.1, 0.28, "back.out(2)");

  // ====================================================================================================
  // S14 (2,5) i14: nine years later (2016 -> 2025). A bad update; Grok calls itself MechaHitler (red glitch); xAI says
  // it was live for 16 hours: Grok's timer beside Tay's. 9 years apart.
  // ====================================================================================================
  const S14 = station(2, 5), b14 = SB(2, 5);
  { const p = F(2, 5), t = L0("i14") - 0.32; cam({ s: camLast.s, x: camLast.x - 14, y: camLast.y }, t - 0.1, 0.1, "power1.out"); cam(p, t, 0.5, "expo.inOut"); camLast = p; }
  const yr = G(S14.top, { opacity: 0 }); const yrT = T(yr, "2016", 540, 470, 110, INK, { ...MID, ...HALO() });
  show(yr, L0("i14") + 0.02, 0.1);
  kit.counter(yrT, 2016, 2025, wt("i14", "years") - 0.1, 0.5, (v) => String(Math.round(v)), "power1.inOut");
  wr(S14.top, "+9 years", 840, 452, 52, EX.orangeT, wt("i14", "later") - 0.04, { anchor: "middle", cps: 26, maxW: 200 });
  const GW = G(S14.mid, { opacity: 0 });
  const gwBox = appWin(GW, 135, 540, 810, 350, { title: "", size: 40 });
  const grL = G(S14.top); img(grL, "grok.svg", -75, -21, 150, 42); pop(grL, wt("i14", "grok") - 0.08, 325, 577, 1, 0);
  drawAt(GW, wt("i14", "a") - 0.1, 0.35);
  const xa = G(S14.top); img(xa, "xai.svg", -24, -27, 48, 54); pop(xa, wt("i14", "xai") - 0.08, 890, 576, 1, 0);
  ring(S14.fx, 890, 576, 100, 90, EX.orange, wt("i14", "xai") + 0.02, 4);
  // the bad update
  const UP = G(S14.mid, { opacity: 0 });
  T(UP, "update...", 180, 700, 44, INK2, {});
  rr(UP, 180, 730, 720, 44, { strokeWidth: 3, roughness: 0.6 });
  show(UP, wt("i14", "a") - 0.02, 0.1);
  const upF = clipReveal(S14.mid, 184, 734, 712, 36, wt("i14", "bad") - 0.06, 0.4, "power2.out");
  rr(upF, 184, 734, 712, 36, { stroke: "none", fill: EX.red, fillStyle: "hachure", hachureGap: 9, fillWeight: 3, boil: false });
  const tMd = wt("i14", "made") - 0.06;
  tw(UP, { opacity: 1 }, { opacity: 0, duration: 0.12, immediateRender: false }, tMd); tw(upF, { opacity: 1 }, { opacity: 0, duration: 0.12 }, tMd);
  // Grok's reply, then the glitch
  const GB = G(S14.mid, { opacity: 0 });
  rr(GB, 180, 650, 720, 180, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 3, roughness: 0.6 });
  show(GB, tMd + 0.05, 0.12);
  const gl = (dx, dy, col) => { const g = G(S14.top, { opacity: 0 }); const e = T(g, "I'm MechaHitler", 540, 765, 70, col, MID); fitT(e, 660); return g; };
  const glC = gl(0, 0, "#22b8cf"), glR = gl(0, 0, EX.red), glM = G(S14.top, { opacity: 0 });
  const gmT = T(glM, "I'm MechaHitler", 540, 765, 70, INK, MID); fitT(gmT, 660);
  const tMH = wt("i14", "mechahitler") - 0.06;
  show(glM, wt("i14", "itself") - 0.04, 0.05); typeOn(gmT, wt("i14", "itself") - 0.04, 0.4);
  const RW = G(S14.top, { opacity: 0 }); rr(RW, 135, 540, 810, 350, { stroke: EX.red, strokeWidth: 9, roughness: 1.4 });
  show(RW, tMH, 0.05); shake(tMH + 0.02, 1.2);
  const GT1 = tMH, GT2 = wt("i14", "and") - 0.05;
  HOOKS.push((v) => {
    const on = v >= GT1 && v < GT2, R = rng(Math.floor(v * 30) + 3);
    [glC, glR].forEach((g, i) => { g.setAttribute("opacity", on ? 0.85 : 0); if (on) g.setAttribute("transform", `translate(${((R() - 0.5) * 22 + (i ? 6 : -6)).toFixed(1)},${((R() - 0.5) * 10).toFixed(1)})`); });
    glM.setAttribute("transform", on ? `translate(${((R() - 0.5) * 8).toFixed(1)},0)` : "");
  });
  // Grok's 16-hour timer, then Tay's comes back beside it
  const GTm = G(S14.top);
  timer(GTm, wt("i14", "for") - 0.04, wt("i14", "hours") + 0.1, "Grok, 2025");
  pop(GTm, wt("i14", "live") - 0.08, 780, 1060, 1, 0);
  const tAl = wt("i14", "about") - 0.08;
  ttA.to({ x: b14.x + 300, y: b14.y + 1060 }, tAl, 0.4, "power3.out");
  wr(S14.top, "=", 540, 1095, 110, EX.orangeT, wt("i14", "as", 0) - 0.04, { anchor: "middle", cps: 8 });
  wr(S14.top, "9 years apart", 540, 975, 50, INK, wt("i14", "tay") - 0.08, { anchor: "middle", cps: 30, maxW: 300 });

  // ====================================================================================================
  // i15: the pull back over the whole iceberg: the five layers named; "just this?" on the tip; Follow, clicked.
  // ====================================================================================================
  const tEnd = L0("i15") + 0.18;
  cam(OVP, tEnd, 1.0, "power3.inOut"); camLast = OVP;
  [S1, S3, S4, S6, S8, S9, S10, S11, S12, S13, S14, { g: FXT }].forEach((S) => tw(S.g, { opacity: 1 }, { opacity: 0.18, duration: 0.5, ease: "power1.inOut" }, tEnd + 0.2));
  [machA, tcA, ttA].forEach((a) => a.to({ o: 0.18 }, tEnd + 0.2, 0.5, "power1.inOut"));
  tw(OVL, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut", immediateRender: false }, tEnd + 0.35);
  tw(OVF, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut", immediateRender: false }, tEnd + 0.35);
  metA.to({ o: 0, y: -30 }, tEnd, 0.25, "power2.in");
  const OV15 = G(OV);
  const LBL = [["openai.svg", "ChatGPT"], ["claude.svg", "Claude's shop"], ["deepseek.svg", "DeepSeek"], ["google_g.svg", "tiny AIs"], ["twitter.svg", "Tay, Grok"]];
  const lblG = [];
  LBL.forEach(([logo, name], i) => {
    const y = oy(LMID[i]), g = G(OV15);
    rell(g, 0, 0, 56, 56, { fill: PAPER, fillStyle: "solid", stroke: ICEB, strokeWidth: 3.5 }); T(g, String(i + 1), 0, 14, 40, ICEB, MID);
    img(g, logo, 42, -28, 56, 56);
    const e = T(g, name, 112, 15, 46, INK, HALO()); fitT(e, 260);
    rline(g, -36, 0, ox(spanAt(LMID[i])[1]) - 590, 0, { stroke: ICEB, strokeWidth: 3, roughness: 0.6 });
    lblG.push(pop(g, tEnd + 0.95 + i * 0.16, 625, y, 1, 0));
  });
  ring(OV15, ox(1690), oy(780), 190, 170, EX.orange, wt("i15", "just") - 0.04, 5);
  wr(OV15, "just this?", ox(1690) + 30, 112, 58, EX.red, wt("i15", "chatgpt") - 0.1, { anchor: "middle", cps: 26, maxW: 300 });
  const tFo = wt("i15", "follow");
  const FBX = 770, FBY = 1262;
  const fb = G(OV15), fbA = GA(fb, { x: FBX, y: FBY, s: 0.4, o: 0, r: -2 });
  const fbOff = G(fb), fbOn = G(fb, { opacity: 0 });
  rr(fbOff, -160, -60, 320, 120, { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  T(fbOff, "+ Follow", 0, 22, 64, INK, MID);
  rr(fbOn, -160, -60, 320, 120, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  const fon = T(fbOn, "Following", 26, 20, 56, INK, MID); fitT(fon, 210);
  tick(fbOn, -118, 0, 0.85, EX.green, 6);
  fbA.to({ o: 1, s: 1 }, tFo - 0.02, 0.24, "back.out(2)");
  const cur = G(OV15), curA = GA(cur, { x: 1000, y: 1330, o: 0 });
  rpath(cur, "M0 0 L0 64 L15 50 L27 76 L39 71 L27 44 L49 44 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.6, roughness: 0.7 });
  const tCk = tFo + 0.28;
  curA.to({ o: 1 }, tCk - 0.3, 0.06).to({ x: FBX + 120, y: FBY + 30 }, tCk - 0.28, 0.26, "power3.out");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  fbA.to({ s: 0.93 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.16, "back.out(3)");
  hide(fbOff, tCk + 0.04, 0.08); show(fbOn, tCk + 0.04);
  const crg = G(OV15), cra = GA(crg, { x: FBX + 120, y: FBY + 30, s: 0.3, o: 0 });
  rell(crg, 0, 0, 110, 110, { stroke: EX.blue, strokeWidth: 4, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.5, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  curA.to({ o: 0, x: 1020, y: 1350 }, tCk + 0.55, 0.3, "power2.in");

  // layer order: the overview fill at the very back; the travelling objects above their stations
  D.insertBefore(OVF, D.firstChild); D.appendChild(MACH); D.appendChild(TC); D.appendChild(TT); D.appendChild(FXT); D.appendChild(OVL);
