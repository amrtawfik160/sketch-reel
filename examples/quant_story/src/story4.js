
  // ====================================================================================================
  // the story version (s1-s9): one board, one cast, one number card; the camera travels from cause to effect
  // ====================================================================================================
  TL_.captions = CAPS; TL_.capNoMerge = true; TL_.capNoHold = true;
  // Caption pages from gen_caps already open 0.14 s before their first word. The stock builder moves every page
  // start to first word - 0.04 (and leaves a 0.1 s blank before it), so a page read as late; this copy keeps the given start.
  buildCaptions = function (svg, tl) {
    const Y = TL_.captionY || 1450, MAXW = 840;
    const g = el("g", { id: "captions" }, svg);
    const caps = TL_.captions.map((c) => ({ ...c, words: c.words.map((w) => ({ ...w })) }));
    caps.forEach((c, i) => {
      c.t0 = Math.max(0, Math.min(c.t0, c.words[0].t - 0.04));
      if (i > 0) caps[i - 1].t1 = Math.min(caps[i - 1].t1, c.t0);
    });
    const wp = svg.querySelector("#wipes"); if (wp) svg.appendChild(wp);
    caps.forEach((c) => {
      const P = themeAt(c.t0 + 0.06);
      const cg = el("g", { opacity: 0 }, g);
      let size = 76;
      const ws = c.words.map((w) => txt(cg, w.w, { "font-family": HAND, "font-size": size, fill: P.INK, stroke: P.PAPER, "stroke-width": 14, "paint-order": "stroke", "stroke-linejoin": "round", y: Y }));
      const lay = () => {
        const wd = ws.map((t) => t.getComputedTextLength()), gap = size * 0.3;
        const total = wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
        let x = 540 - total / 2;
        ws.forEach((t, i) => { t.setAttribute("x", x); x += wd[i] + gap; });
        return total;
      };
      const total = lay();
      if (total > MAXW) { size = Math.floor((size * MAXW) / total); ws.forEach((t) => t.setAttribute("font-size", size)); lay(); }
      const popD = Math.max(0.03, Math.min(0.1, c.t1 - 0.06 - c.t0));
      tl.fromTo(cg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: popD, ease: "power2.out" }, c.t0);
      tl.fromTo(cg, { opacity: 1 }, { opacity: 0, duration: 0.04, immediateRender: false }, c.t1 - 0.05);
      c.words.forEach((w, i) => {
        tl.fromTo(ws[i], { fill: P.INK }, { fill: P.EX.blue, duration: 0.02 }, w.t);
        if (i < c.words.length - 1) tl.fromTo(ws[i], { fill: P.EX.blue }, { fill: P.INK, duration: 0.02, immediateRender: false }, c.words[i + 1].t);
      });
    });
  };
  const wnorm = (s) => { s = s.toLowerCase().trim(); return /^\d+\.\d+$/.test(s) ? s : s.replace(/[^a-z0-9]/g, ""); };
  const wt = (lid, word, n = 0, end = false) => {
    const hits = WT[lid].filter((x) => x[0] === wnorm(word));
    if (!hits[n]) throw new Error(`no measured word ${lid} ${word} #${n}`);
    return hits[n][end ? 2 : 1];
  };
  const END_T = c("s9", "_end") + 3;
  const fitT = (e, maxW) => { const w = e.getComputedTextLength(); if (w > maxW) e.setAttribute("font-size", (parseFloat(e.getAttribute("font-size")) * maxW) / w); return e; };
  const stepText = (e, times, strs) => { const pr = { v: 0 }; e.textContent = ""; B.fromTo(pr, { v: 0 }, { v: END_T, duration: END_T, ease: "none", immediateRender: false, onUpdate: () => { let n = 0; while (n < times.length && times[n] <= pr.v) n++; e.textContent = n ? strs[n - 1] : ""; } }, 0); };
  const card = (p, x, y, w, h, o = {}) => rr(p, x, y, w, h, { fill: PAPER, fillStyle: "solid", ...o });

  // ---------- the board: 3 columns x 2 rows; row 0 is a dark board, row 1 a light one ----------
  const COLX = [0, 1200, 2400], ROWY = [0, 2700], EDGE = 2500, FOLD = 1000;
  // the board's two grounds live in an unclipped copy of the camera, so they fill the phone margins too
  const BGO = el("g", { transform: SAFE.getAttribute("transform") }, null); svg.insertBefore(BGO, SAFE);
  const BGC = el("g", {}, BGO);
  // until the tilt the whole world is dark (the wide shot in s4 sees far below row 0); then the light board starts at EDGE
  const bgDark = el("rect", { x: -6000, y: -6000, width: 14000, height: 20000, fill: DT.PAPER }, BGC);
  const bgLight = el("rect", { x: -6000, y: 14000, width: 14000, height: 9000, fill: LT.PAPER }, BGC);
  const station = (col, row) => {
    setTheme(row === 0);
    const g = G(D, { transform: `translate(${COLX[col]},${ROWY[row]})` });
    return { g, back: G(g), mid: G(g), top: G(g), fx: G(g) };
  };
  // camera: V frames a station (zoomed m around local (fx, fy)); C puts world (wx, wy) at screen (sx, sy) at scale s
  const V = (col, row, m = 1, fx = 540, fy = 960) => { const s = BS * m; return { s, x: BS * fx + BX - s * (COLX[col] + fx), y: BS * fy + BYo - s * (ROWY[row] + fy) }; };
  const C = (wx, wy, s, sx = 540, sy = 760) => ({ s, x: sx - s * wx, y: sy - s * wy });
  const joltV = (p, t) => [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => cam({ s: p.s, x: p.x + dx, y: p.y + dy }, t + i * 0.045, 0.045, "none"));
  BG.setAttribute("fill", DT.PAPER);

  // ---------- the cast: screen-fixed, so it stays with us all the way; one dark-ink and one light-ink copy ----------
  const T_SWAP = wt("s7", "so") - 0.12 + 0.38;            // the camera's tilt down to the light board passes the cast here
  THEME_SW = [[wt("s7", "so") - 0.15, "light"]];   // switch on the page boundary, not inside "So I checked"
  const CW = G(SAFE), CWA = A(CW, { x: 0, y: 0, s: 1 });   // the cast (scaled down for the recap)
  const CASTD = G(CW), CASTL = G(CW, { opacity: 0 });
  const FOLLOW = G(SAFE);
  hide(CASTD, T_SWAP, 0.01); show(CASTL, T_SWAP, 0.01);
  const CGY = 1310, CS = 1.05;
  const WK = { wA: { la: [24, 12], ra: [-22, -10], ll: [-20, -8], rl: [22, 10], m: "smile", look: 1 }, wB: { la: [-22, -10], ra: [24, 12], ll: [22, 10], rl: [-20, -8], m: "smile", look: 1 } };
  const NPOSE = { ...VP, ...WK, think2: { ...VP.think, m: "o" } };
  const flip = (P) => ({ ...P, la: P.ra.map((v) => -v), ra: P.la.map((v) => -v), ll: P.rl.map((v) => -v), rl: P.ll.map((v) => -v), look: -(P.look || 0) });
  const SPOSE = {
    phone: { la: [-16, -8], ra: [60, 160], ll: [-9, -4], rl: [9, 4], m: "frown", look: 0.6, phone: 1, brow: 1 },
    frown: { ...VP.stand, m: "frown", look: -1 },
    pointL: { la: [-80, -76], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "flat", look: -1 },
    see: { la: [-130, -150], ra: [60, 160], ll: [-12, -6], rl: [12, 6], m: "big", look: -1, phone: 1 },
    proud: { ...VP.proud, look: -0.5 },
    oops: { ...VP.oops, look: -1 },
    sad: { la: [-8, -4], ra: [8, 4], ll: [-6, -2], rl: [6, 2], m: "frown", look: -0.4, tilt: 10 },
    aha: { la: [-16, -8], ra: [140, 176], ll: [-9, -4], rl: [9, 4], m: "big", look: -1 },
    yay: { la: [-122, -134], ra: [122, 134], ll: [-12, -6], rl: [12, 6], m: "big", look: -0.3 },
    wave: { ...flip(VP.wave), m: "big" },
    think: { ...flip(VP.think), look: -1 },
    ...Object.fromEntries(Object.entries(WK).map(([k, v]) => [k, flip(v)])),
  };
  const castFig = (poses, kind, x) => {
    setTheme(true); const d = figure(CASTD, poses, kind, x, CGY, CS);
    setTheme(false); const l = figure(CASTL, poses, kind, x, CGY, CS);
    return { key(t, n) { d.key(t, n); l.key(t, n); return this; } };
  };
  const NAR = castFig(NPOSE, "dev", 130), SAM = castFig(SPOSE, "sam", 950);
  [[CASTD, true], [CASTL, false]].forEach(([g, dk_]) => { setTheme(dk_); rline(g, 30, CGY, 1050, CGY, { strokeWidth: 3, roughness: 1.2 }); });
  const walk = (F, t0, t1, a = "wA", b = "wB", rest = "stand") => { for (let t = t0, k = 0; t < t1 - 0.05; t += 0.17, k++) F.key(t, k % 2 ? b : a); F.key(t1, rest); };
  // Sam's speech bubbles sit beside his head (screen space); each is drawn in the palette of its moment
  const samSays = (txt_, t0, t1, dark, col, pop = false) => {
    setTheme(dark);
    const outer = G(dark ? CASTD : CASTL);
    const g = G(outer), probe = T(g, txt_, 0, 0, 62, col || INK, MID);
    const BY0 = 888, BY1 = 996, BYC = 942;
    const w = Math.max(probe.getComputedTextLength() + 64, 200), x1 = 872, x0 = x1 - w, cxm = (x0 + x1) / 2;
    const a = GA(outer, { x: cxm, y: BYC, s: t0 > 0 ? 0.6 : 1, o: t0 > 0 ? 0 : 1 });   // the bubble scales about its own centre
    g.setAttribute("transform", `translate(${-cxm},${-BYC})`);
    probe.setAttribute("x", cxm); probe.setAttribute("y", BYC + 21);
    const bub = rpath(g, `M${x0 + 20} ${BY0} L${x1 - 20} ${BY0} Q${x1} ${BY0} ${x1} ${BY0 + 20} L${x1} ${BYC - 10} L${x1 + 30} ${BYC} L${x1} ${BYC + 12} L${x1} ${BY1 - 20} Q${x1} ${BY1} ${x1 - 20} ${BY1} L${x0 + 20} ${BY1} Q${x0} ${BY1} ${x0} ${BY1 - 20} L${x0} ${BY0 + 20} Q${x0} ${BY0} ${x0 + 20} ${BY0} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
    g.insertBefore(bub, probe);
    if (t0 > 0) a.to({ o: 1, s: 1 }, t0, 0.25, "back.out(2.2)");
    if (t1 != null) a.to(pop ? { o: 0, s: 1.35 } : { o: 0, s: 0.9 }, t1, pop ? 0.16 : 0.15, "power2.in");
    return outer;
  };

  // ====================================================================================================
  // ST1 (dark): Sam's theory — Claude squeezed in a vise for money
  // ====================================================================================================
  const S1 = station(0, 0);
  setTheme(true);
  NAR.key(0, "stand"); SAM.key(0, "phone");
  samSays("Claude got dumber!", 0, wt("s1", "and") + 0.05, true, EX.red);
  const hl = G(S1.top); T(hl, "my friend Sam", 560, 430, 84, EX.blue, { ...MID, ...HALO() });
  const hlA = arrow(S1.top, 760, 470, 905, 1045, { stroke: EX.blue, strokeWidth: 5 }, -0.15);
  drawIn(hlA, 0.02, 0.01);
  [hl, hlA].forEach((n) => hide(n, wt("s1", "theory") - 0.3, 0.12));
  NAR.key(wt("s1", "friend") - 0.1, "point");
  // "he has a theory": a big thought cloud, with tail bubbles down to Sam
  // the cloud grows out of Sam's head (his head sits near world (934, 1110) in this shot)
  const W1 = G(S1.mid), W1A = GA(W1, { x: 934 * 0.92, y: 1110 * 0.92, s: 0.08, o: 0 });
  W1A.to({ x: 0, y: 0, s: 1, o: 1 }, wt("s1", "theory") - 0.35, 0.55, "back.out(1.3)");
  const cl = G(W1);
  const CLD = "M140 640 Q60 520 190 450 Q230 330 380 380 Q470 290 600 360 Q740 300 820 410 Q960 430 930 560 Q1010 680 900 760 Q910 900 760 900 Q660 990 520 920 Q380 990 280 900 Q130 900 150 780 Q50 720 140 640 Z";
  const cloudShape = rpath(cl, CLD, { fill: PAPER, fillStyle: "solid", strokeWidth: 4.5 });
  [[880, 975, 34], [925, 1040, 22]].forEach(([x, y, r]) => rell(cl, x, y, r * 2, r * 1.6, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 }));
  note(W1, ["Sam's theory:"], 540, 470, 56, INK2, wt("s1", "theory") + 0.1, { cps: 30, anchor: "middle" });
  // the vise inside the cloud
  const vz = G(W1), vzA = GA(vz, { x: 540, y: 690, s: 0.5, o: 0 });   // drawn around (0,0)
  const jawR = G(vz), jawRA = A(jawR, { x: 0, y: 0 });
  rr(vz, -330, -230, 90, 400, { fill: EX.grayF, fillStyle: "hachure", strokeWidth: 6, hachureGap: 16 });
  const lg = G(vz), lgA = A(lg, { x: 0, y: -30, s: 1 });
  rell(lg, 0, 0, 380, 380, { fill: cx("#ffd8a8"), fillStyle: "hachure", stroke: EX.orange, strokeWidth: 5, hachureGap: 18 });
  kit.logo(lg, "claude", 260);
  rr(jawR, 240, -230, 90, 400, { fill: EX.grayF, fillStyle: "hachure", strokeWidth: 6, hachureGap: 16 });
  rline(jawR, 330, -30, 420, -30, { strokeWidth: 12 });
  const hnd = G(jawR), hndA = A(hnd, { x: 420, y: -30, r: 0 });
  rline(hnd, 0, -100, 0, 100, { strokeWidth: 11 });
  [-100, 100].forEach((y) => rell(hnd, 0, y, 36, 36, { fill: INK, fillStyle: "solid", strokeWidth: 3 }));
  rr(vz, -370, 170, 740, 70, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  vzA.to({ o: 1, s: 0.62 }, wt("s1", "theory") + 0.15, 0.35, "back.out(1.6)");
  const an = G(W1), anA = GA(an, { x: 0, y: 0, o: 0 });
  kit.logo(an, "anthropic", 60).setAttribute("transform", "translate(300,560)");
  T(an, "Anthropic", 345, 578, 52, INK);
  anA.to({ o: 1 }, wt("s1", "anthropic") - 0.08, 0.2);
  const tShr = wt("s1", "shrank") - 0.15;
  jawRA.to({ x: -110 }, tShr, 0.7, "power2.inOut"); hndA.to({ r: 200 }, tShr, 0.7, "power2.inOut"); lgA.to({ s: 0.72 }, tShr + 0.05, 0.65, "power2.inOut");
  note(W1, ["secretly?"], 760, 560, 56, EX.red, wt("s1", "secretly") - 0.05, { rot: -5, cps: 30 });
  const coinOf = (p, r = 26) => { const g = G(p); rell(g, 0, 0, 2 * r, 2 * r, { stroke: cx("#e8b93a"), fill: EX.yellowF, fillStyle: "solid", strokeWidth: 3.5 }); T(g, "$", 0, r * 0.42, r * 1.2, cx("#b08000"), { ...MID, "data-deco": 1 }); return g; };
  [[-150, 40], [-60, 70], [40, 50], [130, 80], [210, 45], [-230, 75]].forEach(([dx, dy], i) => {
    const g = coinOf(S1.fx), a = GA(g, { x: 540, y: 670, s: 0.4, o: 0 });
    const t0 = wt("s1", "money") - 0.2 + i * 0.05;
    a.to({ o: 1, s: 1, x: 540 + dx * 0.7, y: 600 }, t0, 0.2, "power2.out").to({ x: 540 + dx, y: 830 + dy * 0.3, r: dx / 4 }, t0 + 0.2, 0.32, "power2.in");
  });
  SAM.key(wt("s1", "theory") - 0.1, "pointL"); SAM.key(wt("s1", "money") - 0.1, "frown");
  NAR.key(wt("s1", "he") - 0.1, "think");
  cam(V(0, 0, 1.0), 0, 0.01, "none");
  cam(V(0, 0, 1.02, 540, 700), 0.02, 6.2, "sine.inOut");
  // ---- s2: "the trick he means is called quantization" — stamped on his theory ----
  const qs = stamp(S1.top, "QUANTIZATION?", 540, 930, 720, 130, EX.red, "#f29a9a", wt("s2", "quantization") - 0.05, -4, 78, 31);
  { const bk = rr(qs.node, -360, -65, 720, 130, { fill: PAPER, fillStyle: "solid", stroke: "none", boil: false }); qs.node.insertBefore(bk, qs.node.firstChild); }
  joltV(V(0, 0, 1.02, 540, 700), wt("s2", "quantization") + 0.1);
  SAM.key(wt("s2", "trick") - 0.1, "pointL");
  // "so I opened up a model": an arrow across the gap, and the camera travels right to the model box
  setTheme(true);
  const g12 = arrow(S1.fx, 960, 700, 1300, 700, { stroke: EX.blue, strokeWidth: 5 }, 0.08);
  drawIn(g12, wt("s2", "so") - 0.05, 0.4);
  const tP1 = wt("s2", "so") - 0.05;
  cam(V(1, 0, 1.0), tP1, 0.8, "sine.inOut");
  walk(NAR, tP1, tP1 + 0.8); walk(SAM, tP1, tP1 + 0.8, "wA", "wB", "frown");

  // ====================================================================================================
  // ST2 (dark): the model box, its billions of numbers, and THE card 0.0372
  // ====================================================================================================
  const S2 = station(1, 0);
  setTheme(true);
  const lli = note(S2.top, ["let's look inside"], 260, 870, 54, EX.blue, tP1 + 0.3, { cps: 32, anchor: "middle" });
  hide(lli, wt("s3", "one") - 0.2, 0.12);
  const bx = G(S2.mid), bxA = GA(bx, { x: 260, y: 640, s: 1, o: 1 });   // the box, drawn around its centre
  rr(bx, -160, -170, 320, 340, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  rr(bx, -160, -170, 320, 340, { fill: EX.violetF, fillStyle: "hachure", stroke: EX.violet, strokeWidth: 3, hachureGap: 18 });
  T(bx, "AI", 0, -10, 90, INK, { ...MID, ...HALO() }); T(bx, "model", 0, 76, 74, INK, { ...MID, ...HALO() });
  const lid = G(bx), lidA = A(lid, { x: -170, y: -170, r: 0 });
  rr(lid, 0, -50, 340, 50, { fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
  hide(bx, 0); show(bx, tP1 + 0.2, 0.01); drawIn(bx, tP1 + 0.2, 0.5);
  lidA.to({ r: -32 }, wt("s2", "opened") - 0.05, 0.35, "back.out(1.8)");
  const qm = note(S2.fx, ["?  ?"], 560, 520, 80, EX.orange, wt("s2", "see") - 0.05, { cps: 6 });
  NAR.key(wt("s2", "opened") - 0.1, "point"); NAR.key(wt("s2", "see") - 0.05, "think2");
  // ---- s3: numbers spill out; "like this one" becomes the card ----
  const PR = rng(31), chips = [];
  const PCOL = [528, 728, 928], PROW = (r) => 384 + r * 78;
  for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) {
    const pk = r === 2 && k === 1;
    const v = pk ? 0.0372 : (PR() * 0.16 - 0.08) * (PR() < 0.2 ? 5 : 1);
    const s4 = (v < 0 ? "-" : "") + Math.abs(v).toFixed(4), s2v = (v < 0 ? "-" : "") + Math.abs(v).toFixed(2);
    const g = G(S2.mid), a = GA(g, { x: 260, y: 480, s: 0.3, o: 0 });
    const bxr = rr(g, -98, -32, 196, 64, { fill: PAPER, fillStyle: "solid", stroke: INK2, strokeWidth: 2.5 });
    const t4 = M(g, s4, 0, 16, 46, v < 0 ? EX.blue : INK, MID), t2 = M(g, s2v, 0, 16, 46, EX.orange, { ...MID, opacity: 0 });
    const t0 = wt("s3", "inside") + (r * 3 + k) * 0.09;
    a.to({ o: 1, s: 1, x: PCOL[k], y: PROW(r), r: (PR() - 0.5) * 6 }, t0, 0.45, "back.out(1.4)");
    chips.push({ g, a, t4, t2, r, k, pk, bxr });
  }
  const bil = note(S2.top, ["billions!"], 728, 318, 60, EX.blue, wt("s3", "billions") - 0.05, { cps: 26, anchor: "middle", rot: -3 });
  hide(qm, wt("s3", "inside"), 0.15);
  NAR.key(wt("s3", "billions") - 0.1, "cheer");
  const pick = chips.find((q) => q.pk);
  const ringP = rell(S2.fx, PCOL[1], PROW(2), 250, 100, { stroke: EX.orange, strokeWidth: 5 });
  drawIn(ringP, wt("s3", "this") - 0.05, 0.25);
  hide(ringP, wt("s3", "one") + 0.35, 0.15);
  // the card (the one object we follow): it grows out of the picked chip
  const cd = G(S2.top), cdA = GA(cd, { x: PCOL[1], y: PROW(2), s: 0.2, o: 0 });
  const cdBox = rr(cd, -350, -100, 700, 230, { fill: PAPER, fillStyle: "solid", stroke: EX.orange, strokeWidth: 6 });
  const cdR = rr(cd, -350, -100, 700, 230, { fill: "none", stroke: EX.red, strokeWidth: 9, boil: false });
  hide(cdR, 0);
  const cdN = G(cd), cdNA = GA(cdN, { x: 0, y: 0, s: 1 });
  const bigN = M(cdN, "", 0, 50, 150, INK, MID);
  const ph0 = M(cd, "?.????", 0, 50, 150, cx("#495057"), MID);
  cdA.to({ o: 1, s: 1, x: 540, y: 925 }, wt("s3", "one") - 0.05, 0.5, "back.out(1.3)");
  hide(ph0, wt("s3", "zero") - 0.04, 0.05);
  const DIGT = [wt("s3", "zero"), wt("s3", "point"), wt("s3", "zero", 1), wt("s3", "three"), wt("s3", "seven"), wt("s3", "two")];
  stepText(bigN, DIGT.map((t) => t - 0.03), ["0", "0.", "0.0", "0.03", "0.037", "0.0372"]);
  NAR.key(wt("s3", "like") - 0.1, "point"); NAR.key(wt("s3", "two"), "proud");
  SAM.key(wt("s3", "inside") - 0.1, "phone");
  cam(V(1, 0, 1.03, 540, 760), wt("s3", "inside") - 0.2, 5.5, "sine.inOut");

  // ====================================================================================================
  // ST3 (dark): the chat — every word is built from those numbers
  // ====================================================================================================
  const S3 = station(2, 0);
  setTheme(true);
  const tP2 = c("s4") - 0.1;
  cam(C(2360, 700, 0.49, 540, 635), tP2, 0.8, "sine.inOut");   // the numbers AND the chat in one shot
  SAM.key(tP2, "frown");
  // the flow: arrows from the pile across the gap into the chat
  setTheme(true);
  const flowA = arrow(S2.fx, 1050, 560, 1300, 640, { stroke: EX.green, strokeWidth: 5 }, -0.1);
  drawIn(flowA, tP2 + 0.1, 0.4);
  const ch = G(S3.mid);
  drawIn(win(ch, 60, 330, 960, 720, null, 76), tP2 + 0.15, 0.45);
  kit.logo(ch, "claude", 46).setAttribute("transform", "translate(126,368)");
  T(ch, "Claude", 166, 386, 48, INK);
  rr(ch, 400, 450, 590, 110, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 3 });
  T(ch, "What's 17 × 24?", 430, 524, 60, INK);
  rr(ch, 90, 620, 640, 130, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 3 });
  const TOK = ["17", "×", "24", "=", "408"], tokT = [wt("s4", "word"), wt("s4", "claude"), wt("s4", "writes"), wt("s4", "is"), wt("s4", "built")];
  const ansA = T(ch, "", 120, 708, 76, INK);
  stepText(ansA, tokT.map((t) => t - 0.03), TOK.map((_, i) => TOK.slice(0, i + 1).join(" ")));
  const ans8 = T(ch, "408", 0, 708, 76, EX.green, { opacity: 0 });
  // each word is built from the pile: an arrow from the numbers into the answer, word by word
  const wordArr = tokT.map((t, i) => { const a = arrow(S2.fx, 1030, 400 + i * 80, 1300, 690, { stroke: EX.green, strokeWidth: 4 }, -0.06); drawIn(a, t - 0.1, 0.22); return a; });
  wordArr.forEach((a) => hide(a, c("s5") - 0.15, 0.2));
  const okT = tick(ch, 800, 680, 1.6, EX.green, 7);
  drawIn(okT, wt("s4", "reading") - 0.05, 0.2);
  const okN = note(S3.fx, ["right!"], 760, 820, 60, EX.green, wt("s4", "reading"), { cps: 24 });
  const num2 = note(S3.fx, ["made of billions", "of numbers"], 540, 900, 52, INK2, wt("s4", "billions") - 0.1, { anchor: "middle", cps: 40 });
  NAR.key(c("s4") + 0.7, "point"); SAM.key(c("s4") + 0.7, "phone");

  // ====================================================================================================
  // s5 back at ST2: rounding, the shrinking box, the price
  // ====================================================================================================
  const tP3 = c("s5") - 0.1;
  cam(V(1, 0, 1.03, 540, 760), tP3, 0.75, "sine.inOut");   // push in on the numbers and the card
  hide(bil, tP3, 0.1);
  const rnd = note(S2.top, ["rounding"], 728, 306, 72, EX.orange, tP3 + 0.4, { anchor: "middle", cps: 30 }); hide(rnd, wt("s5", "two") + 0.2, 0.15);
  // the pile rounds in a wave
  chips.forEach(({ t4, t2, r, k }) => {
    const tc = wt("s5", "rounds") + (k + r * 0.6) * 0.08;
    hide(t4, tc, 0.06); show(t2, tc, 0.08);
    tw(t2, { attr: { fill: EX.orange } }, { attr: { fill: INK }, duration: 0.5, immediateRender: false }, tc + 0.3);
  });
  // the card: 0.0372 slides left, greys, gets a line through it; "rounds up"; 0.04 is written as it is spoken
  const tBec = wt("s5", "becomes");
  cdNA.to({ x: -185, y: -6, s: 0.5 }, tBec - 0.1, 0.4, "power3.inOut");
  tw(bigN, { attr: { fill: INK } }, { attr: { fill: INK2 }, duration: 0.3, immediateRender: false }, tBec + 0.2);
  const strike = rline(cd, -330, 22, -45, 14, { stroke: INK2, strokeWidth: 5 });
  drawIn(strike, tBec + 0.35, 0.25);
  const rArr = arrow(cd, -30, 26, 40, 26, { stroke: EX.green, strokeWidth: 5 });
  drawIn(rArr, tBec + 0.3, 0.25);
  const newN = M(cd, "", 195, 62, 124, EX.green, MID);
  stepText(newN, [wt("s5", "zero", 2), wt("s5", "point", 1), wt("s5", "zero", 3), wt("s5", "four")].map((t) => t - 0.03), ["0", "0.", "0.0", "0.04"]);
  note(cd, ["rounds up"], 40, 94, 46, EX.green, tBec + 0.4, { anchor: "middle", cps: 30 });
  drawIn(arrow(cd, -110, 90, -110, 56, { stroke: EX.green, strokeWidth: 4 }), tBec + 0.55, 0.2);
  NAR.key(wt("s5", "rounds") - 0.1, "point"); NAR.key(wt("s5", "four") - 0.05, "proud");
  // shorter numbers -> the whole model 3x smaller
  chips.forEach(({ bxr, r, k }) => tw(bxr, { attr: { transform: "scale(1,1)" } }, { attr: { transform: "scale(0.62,1)" }, duration: 0.3, ease: "back.out(2)", immediateRender: false }, wt("s5", "shorter") + (r + k) * 0.05));
  const ghost = rr(S2.back, 90, 462, 340, 356, { stroke: INK2, strokeWidth: 3, strokeLineDash: [14, 12] });
  hide(ghost, 0);
  const tSm = wt("s5", "whole") - 0.05;
  show(ghost, tSm, 0.1);
  bxA.to({ s: 0.56, y: 680 }, tSm, 0.6, "back.out(1.3)");
  const x3 = note(S2.fx, ["3× smaller!"], 260, 432, 56, EX.green, wt("s5", "smaller") - 0.08, { anchor: "middle", cps: 70, rot: -3 });
  // faster: speed lines; cheaper: the price tag $$$ -> $
  const spd = G(S2.fx);
  [0, 1, 2].forEach((i) => rline(spd, 90, 640 + i * 40, 140, 640 + i * 40, { stroke: EX.blue, strokeWidth: 5 }));
  hide(spd, 0); show(spd, wt("s5", "faster") - 0.1, 0.05); drawIn(spd, wt("s5", "faster") - 0.1, 0.2);
  const tg = G(S2.fx), tgA = GA(tg, { x: 260, y: 318, o: 0, s: 0.6, r: -6 });
  rpath(tg, "M-120 -46 L80 -46 L120 0 L80 46 L-120 46 Z", { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 4 });
  el("circle", { cx: 82, cy: 0, r: 9, fill: PAPER, stroke: cx("#e8b93a"), "stroke-width": 3 }, tg);
  const d3 = T(tg, "$$$", -22, 24, 66, EX.red, MID), d1 = T(tg, "$", -22, 24, 66, EX.green, { ...MID, opacity: 0 });
  tgA.to({ o: 1, s: 1 }, wt("s5", "and") - 0.1, 0.3, "back.out(2)");
  const tCh = wt("s5", "cheaper") - 0.03;
  hide(d3, tCh, 0.1); show(d1, tCh + 0.08, 0.12);
  tgA.to({ s: 0.85 }, tCh, 0.2, "back.out(2)");
  // Sam: "see?!"
  samSays("see?!", wt("s5", "faster") - 0.1, wt("s7", "so") - 0.02, true, EX.red, true);
  SAM.key(wt("s5", "faster") - 0.15, "see");

  // ====================================================================================================
  // s6: "That's Sam's theory" (pull back over his cloud and the box), then "a little off" -> the wrong answer
  // ====================================================================================================
  const tPB = wt("s6", "thats") - 0.15;
  cam(V(1, 0, 0.97, 540, 760), tPB, 0.7, "sine.inOut");
  SAM.key(wt("s6", "sams") - 0.1, "proud");
  setTheme(true);
  const tBk = wt("s6", "but") - 0.1;
  cam(V(1, 0, 1.03, 540, 760), tBk, 0.6, "sine.inOut");
  // the card glows red: a little off
  show(cdR, wt("s6", "off") - 0.1, 0.12);
  tw(newN, { attr: { fill: EX.green } }, { attr: { fill: EX.red }, duration: 0.2, immediateRender: false }, wt("s6", "off") - 0.1);
  const lo = note(S2.fx, ["a little off!"], 790, 786, 46, EX.red, wt("s6", "little") - 0.05, { anchor: "middle", cps: 28, rot: -3 });
  NAR.key(wt("s6", "but") - 0.1, "think");
  // billions of times: the pile flashes red, chip by chip
  chips.forEach(({ bxr, r, k }) => {
    const t0 = wt("s6", "billions") + (r * 3 + k) * 0.04;
    tw(bxr, { opacity: 1 }, { opacity: 1, duration: 0.01 }, t0);
    const fl = rr(S2.fx, PCOL[k] - 98, PROW(r) - 32, 196, 64, { stroke: EX.red, strokeWidth: 4, boil: false });
    hide(fl, 0); show(fl, t0, 0.06); hide(fl, wt("s6", "can") + 0.2, 0.2);
  });
  const xb = note(S2.top, ["× billions"], 728, 310, 58, EX.red, wt("s6", "billions") + 0.1, { cps: 30, anchor: "middle", rot: -3 });
  // can turn a right answer into a wrong one: a red arrow from the card to the chat, and the answer changes
  setTheme(true);
  const redA = arrow(S2.fx, 895, 925, 1310, 780, { stroke: EX.red, strokeWidth: 6 }, 0.1);
  drawIn(redA, wt("s6", "can") - 0.1, 0.4);
  const tP4 = wt("s6", "can") - 0.1;
  cam(V(2, 0, 1.0), tP4, 0.75, "sine.inOut");
  walk(NAR, tP4, tP4 + 0.75); walk(SAM, tP4, tP4 + 0.75, "wA", "wB", "frown");
  const tWr = wt("s6", "wrong") - 0.1;
  hide(ansA, tWr, 0.05);
  setTheme(true);
  const ansW = T(S3.mid, "17 × 24 = 418", 120, 708, 76, INK, { opacity: 0 }); show(ansW, tWr, 0.05);
  const wr = rell(S3.fx, 560, 682, 190, 110, { stroke: EX.red, strokeWidth: 6 }); drawIn(wr, tWr + 0.05, 0.22);
  hide(okT, tWr, 0.08); hide(okN, tWr, 0.1); hide(num2, wt("s6", "can"), 0.12);
  drawIn(xmark(S3.fx, 820, 690, 40, EX.red, 8), tWr + 0.1, 0.2);
  note(S3.fx, ["should be 408"], 540, 860, 60, EX.red, tWr + 0.15, { anchor: "middle", cps: 34 });
  NAR.key(tWr, "oops"); SAM.key(tWr, "oops");

  // ====================================================================================================
  // s7: "So I checked" — the camera tilts down to the light board: Anthropic's word, then the daily test
  // ====================================================================================================
  const tP5 = wt("s7", "so") - 0.12;
  cam(V(2, 1, 1.0), tP5, 0.8, "sine.inOut");
  walk(NAR, tP5, tP5 + 0.8); walk(SAM, tP5, tP5 + 0.8, "wA", "wB", "frown");
  tw(BG, { attr: { fill: DT.PAPER } }, { attr: { fill: LT.PAPER }, duration: 0.001 }, T_SWAP);
  tw(bgDark, { attr: { height: 20000 } }, { attr: { height: 6000 + EDGE }, duration: 0.001 }, tP5 - 0.05);
  tw(bgLight, { attr: { y: 14000 } }, { attr: { y: EDGE }, duration: 0.001 }, tP5 - 0.05);
  setTheme(true);
  const dn1 = arrow(S3.fx, 600, 1110, 600, EDGE - 10, { stroke: EX.blue, strokeWidth: 6 }, 0);
  drawIn(dn1, tP5, 0.3);
  setTheme(false);
  const S4 = station(2, 1);
  setTheme(false);
  const dn2 = rline(S3.fx, 600, EDGE, 600, ROWY[1] + 330, { stroke: EX.blue, strokeWidth: 6 });
  drawIn(dn2, tP5 + 0.3, 0.3);
  const qc = G(S4.mid), qcA = GA(qc, { x: 0, y: 30, o: 0, r: 1 });
  rr(qc, 100, 360, 880, 580, { fill: "#f3efe6", fillStyle: "solid", stroke: "#adb5bd", strokeWidth: 3 });
  kit.logo(qc, "anthropic", 60).setAttribute("transform", "translate(176,436)");
  T(qc, "Anthropic says:", 222, 456, 52, "#868e96");
  ["“We never reduce model", "quality due to demand,", "time of day, or server", "load.”"].forEach((s, i) => fitT(T(qc, s, 150, 552 + i * 88, 68, "#1e1e1e"), 780));
  const sd = G(qc);
  rr(sd, 590, 846, 360, 74, { fill: "#ffe8cc", fillStyle: "solid", stroke: "#e8590c", strokeWidth: 3, boil: false });
  T(sd, "said in 2025", 770, 898, 54, "#d9480f", MID);
  qcA.to({ o: 1, y: 0, r: 1 }, tP5 + 0.72, 0.35, "back.out(1.3)");
  drawIn(scribble(qc, 150, 470, 574, EX.orange, 77, 5), wt("s7", "never") - 0.05, 0.3);
  drawIn(scribble(qc, 470, 720, 662, EX.orange, 78, 5), wt("s7", "demand") - 0.08, 0.25);
  NAR.key(wt("s7", "anthropic") - 0.1, "point");
  SAM.key(wt("s7", "never") - 0.1, "think");
  // "and a public test": an arrow left across the gap; the camera follows to the chart
  const tP6 = wt("s7", "and") - 0.12;
  const lf1 = arrow(S4.fx, 60, 700, -260, 700, { stroke: EX.blue, strokeWidth: 7 }, 0.08);
  drawIn(lf1, tP6, 0.35);
  cam(V(1, 1, 1.0), tP6, 0.75, "sine.inOut");
  walk(NAR, tP6, tP6 + 0.75); walk(SAM, tP6, tP6 + 0.75, "wA", "wB", "think");
  const S5 = station(1, 1);
  setTheme(false);
  const chg = G(S5.mid);
  drawIn(win(chg, 40, 330, 1000, 700, null), tP6 + 0.1, 0.45);
  fitT(T(chg, "a public test of Claude, every day", 160, 386, 52, INK2), 850);
  const CX0 = 130, CX1 = 990, CY0 = 560, CY1 = 930;
  const cyv = (v) => CY1 - ((v - 0.4) / 0.4) * (CY1 - CY0);
  rline(chg, CX0, CY1, CX1, CY1, { strokeWidth: 3.5 }); rline(chg, CX0, CY0 - 30, CX0, CY1, { strokeWidth: 3.5 });
  T(chg, "score", 70, 500, 50, INK2);
  rline(chg, 540, 486, 590, 486, { stroke: EX.violet, strokeWidth: 4, roughness: 0.5 });
  T(chg, "launch-week level", 604, 502, 50, EX.violet);
  rline(chg, CX0, cyv(0.584), CX1, cyv(0.584), { stroke: EX.violet, strokeWidth: 3.5, roughness: 0.5 });
  const tD0 = wt("s7", "quizzed") - 0.1, tD1 = wt("s7", "days") + 0.1;
  const dayX = (i) => CX0 + 24 + (i * (CX1 - CX0 - 48)) / 29;
  NERF.forEach((v, i) => { const d = el("circle", { cx: dayX(i), cy: cyv(v), r: 13, fill: EX.blue, opacity: 0 }, chg); show(d, tD0 + ((tD1 - tD0) * i) / 29, 0.05); });
  [0.584, 0.592, 0.571].forEach((v, w) => { const ln = rline(chg, dayX(w * 10), cyv(v), dayX(w * 10 + 9), cyv(v), { stroke: EX.green, strokeWidth: 9 }); drawIn(ln, wt("s7", "no") - 0.35 + w * 0.08, 0.25); });
  T(chg, "day 1", dayX(0), 990, 50, INK2, MID); T(chg, "day 30", 1010, 990, 50, INK2, END);
  note(S5.fx, ["30 days"], 540, 990, 56, EX.blue, wt("s7", "thirty") - 0.05, { cps: 24, anchor: "middle" });
  stamp(S5.top, "NO DROP", 760, 640, 380, 100, EX.green, "#b2f2bb", wt("s7", "no") - 0.04, -5, 76, 61);
  NAR.key(wt("s7", "test") - 0.1, "point"); NAR.key(wt("s7", "no"), "cheer");
  samSays("hmm…", wt("s7", "no") + 0.05, wt("s8", "thinks") - 0.12, false, INK2);
  SAM.key(wt("s7", "no") + 0.05, "think");

  // ====================================================================================================
  // s8: his rounding theory has no proof... but the new Claude thinks less by default — the effort dial
  // ====================================================================================================
  SAM.key(wt("s8", "rounding") - 0.1, "sad");
  const tP7 = wt("s8", "but") - 0.12;
  const lf2 = arrow(S5.fx, 60, 700, -260, 700, { stroke: EX.blue, strokeWidth: 7 }, 0.08);
  drawIn(lf2, tP7, 0.35);
  cam(V(0, 1, 1.0), tP7, 0.75, "sine.inOut");
  walk(NAR, tP7, tP7 + 0.75); walk(SAM, tP7, tP7 + 0.75, "wA", "wB", "sad");
  const S6 = station(0, 1);
  setTheme(false);
  note(S6.top, ["but something did change"], 540, 380, 58, EX.violet, tP7 + 0.35, { cps: 36, anchor: "middle" });
  const dl = G(S6.mid);
  card(dl, 40, 420, 1000, 620);
  T(dl, "effort setting", 540, 488, 60, INK, MID);
  const DX = 540, DY = 880, DR = 300;
  rarc(dl, DX, DY, DR * 2, DR * 2, Math.PI, Math.PI * 2, { strokeWidth: 7 });
  [["low", Math.PI, INK2], ["medium", Math.PI * 1.5, EX.orange], ["high", Math.PI * 2, EX.green]].forEach(([s0, an_, col]) => {
    rline(dl, DX + Math.cos(an_) * (DR - 36), DY + Math.sin(an_) * (DR - 36), DX + Math.cos(an_) * (DR + 8), DY + Math.sin(an_) * (DR + 8), { strokeWidth: 5, roughness: 0.6 });
    T(dl, s0, an_ === Math.PI ? DX - DR : an_ === Math.PI * 2 ? DX + DR : DX, an_ === Math.PI * 1.5 ? DY - DR - 30 : DY + 62, 58, col, MID);
  });
  drawIn(dl, tP7 + 0.1, 0.5);
  const ghN = G(dl, { opacity: 0 });   // the old setting stays as a dashed needle
  rline(ghN, DX, DY, DX + DR - 60, DY, { stroke: EX.green, strokeWidth: 6, strokeLineDash: [16, 12], boil: false });
  const ndl = G(dl), ndA = GA(ndl, { x: DX, y: DY, r: 90 });   // r 90 = high, 0 = medium, -90 = low
  rline(ndl, 0, 0, 0, -(DR - 60), { strokeWidth: 10, roughness: 0.8, boil: false });
  rell(ndl, 0, 0, 54, 54, { fill: INK, fillStyle: "solid", strokeWidth: 3 });
  ndA.to({ r: 0 }, wt("s8", "less") - 0.12, 0.5, "back.out(1.4)");
  show(ghN, wt("s8", "less") - 0.1, 0.15);
  note(S6.fx, ["new Claude: medium, by default"], 540, 1012, 52, EX.orange, wt("s8", "default") - 0.1, { cps: 40, anchor: "middle" });
  const oldN = note(S6.fx, ["old: high"], 700, 842, 48, EX.green, wt("s8", "old") - 0.1, { cps: 36, anchor: "middle" });
  samSays("aha!", wt("s8", "thinks") - 0.05, c("s9") - 0.1, false, EX.violet);
  SAM.key(wt("s8", "thinks") - 0.1, "aha");
  NAR.key(wt("s8", "new") - 0.1, "point");
  // ---- s9: one tip — turn the effort up; a paper plane to Sam; then the whole board folds into view; Follow ----
  setTheme(false);
  const plane1 = G(CASTL), plA = GA(plane1, { x: 240, y: 1000, s: 0.8, o: 0, r: -10 });
  rpath(plane1, "M-60 12 L60 -24 L-12 36 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rpath(plane1, "M-12 36 L0 7 L60 -24", { strokeWidth: 3.5 });
  plA.to({ o: 1, s: 1.1 }, wt("s9", "sent") - 0.15, 0.15).to({ x: 820, y: 960, r: 8 }, wt("s9", "sent"), 0.55, "power2.inOut").to({ o: 0 }, wt("s9", "sent") + 0.56, 0.1);
  NAR.key(wt("s9", "sent") - 0.1, "point");
  samSays("thanks!", wt("s9", "tip") - 0.05, wt("s9", "up") + 0.05, false, EX.green);
  SAM.key(wt("s9", "tip") - 0.1, "yay");
  const tTurn = wt("s9", "turn") - 0.05;
  const hd = G(S6.fx), hdA = GA(hd, { x: 1000, y: 1100, o: 0, r: -10 });
  rr(hd, -50, -36, 120, 84, { fill: "#ffd8a8", fillStyle: "solid", stroke: "#c08040", strokeWidth: 3 });
  rr(hd, -76, -22, 50, 28, { fill: "#ffd8a8", fillStyle: "solid", stroke: "#c08040", strokeWidth: 3 });
  hdA.to({ o: 1, x: 620, y: 680 }, tTurn - 0.4, 0.35, "power3.out").to({ x: 780, y: 760, r: 40 }, tTurn, 0.4, "power2.inOut").to({ o: 0, x: 1000, y: 1100 }, tTurn + 0.5, 0.2, "power2.in");
  ndA.to({ r: 90 }, tTurn + 0.05, 0.4, "back.out(1.8)");
  hide(oldN, tTurn, 0.12); hide(ghN, tTurn, 0.12);
  note(S6.fx, ["turn it up!"], 820, 616, 56, EX.green, tTurn + 0.05, { cps: 30, anchor: "middle" });
  // the recap: the light row folds up under the dark one, every station gets a number, and the camera pulls back
  const tPull = wt("s9", "up") + 0.05;
  // the light row stays out of sight until the tilt (the wide shot in s4 sees down that far)
  [S4, S5, S6].forEach((S) => { hide(S.g, 0); show(S.g, tP5 - 0.05, 0.001); });
  const FD = 0.9;
  [S4, S5, S6].forEach((S, i) => { const x = COLX[2 - i]; B.fromTo(S.g, { attr: { transform: `translate(${x},${ROWY[1]})` } }, { attr: { transform: `translate(${x},${ROWY[1] - FOLD})` }, duration: FD, ease: "sine.inOut", immediateRender: false }, tPull); });
  B.fromTo(bgDark, { attr: { height: 6000 + EDGE } }, { attr: { height: 6000 + EDGE - FOLD }, duration: FD, ease: "sine.inOut", immediateRender: false }, tPull);
  B.fromTo(bgLight, { attr: { y: EDGE } }, { attr: { y: EDGE - FOLD }, duration: FD, ease: "sine.inOut", immediateRender: false }, tPull);
  [dn1, dn2].forEach((n) => hide(n, tPull, 0.15));
  setTheme(true);
  const dnR = arrow(S3.fx, 1000, 1110, 1000, ROWY[1] - FOLD + 300, { stroke: EX.blue, strokeWidth: 8 }, 0);
  hide(dnR, 0); show(dnR, tPull + FD - 0.1, 0.2);
  [[S1, "1 the theory", true], [S2, "2 the numbers", true], [S3, "3 the answer", true], [S4, "4 Anthropic", false], [S5, "5 the test", false], [S6, "6 the change", false]].forEach(([S, s0, dk_], i) => {
    setTheme(dk_);
    const g = G(S.g, { opacity: 0 });
    fitT(T(g, s0, S === S4 ? 420 : 540, 250, 180, EX.blue, { ...MID, ...HALO() }), 1000);
    show(g, tPull + 0.4 + i * 0.08, 0.25);
  });
  setTheme(true);
  const gT = G(D, { opacity: 0 }); T(gT, "Sam's theory", 1740, 1260, 140, EX.red, { ...MID, ...HALO() }); show(gT, tPull + 0.5, 0.25);
  const gF = G(D, { opacity: 0 }); T(gF, "what really happened", 1740, 1450, 120, EX.green, { ...MID, ...HALO() }); show(gF, tPull + 0.6, 0.25);
  cam(C(1750, 1460, 0.305, 545, 500), tPull, FD + 0.1, "sine.inOut");   // the whole board inside the phone-safe column
  CWA.to({ x: 540 * 0.4, y: CGY * 0.4, s: 0.6 }, tPull, FD, "sine.inOut");   // the cast steps back to make room
  // Follow (screen space, not scaled with the cast)
  setTheme(false);
  const fb = G(FOLLOW), fbA = GA(fb, { x: 540, y: 1200, s: 0.4, o: 0, r: -2 });
  const fbOff = G(fb), fbOn = G(fb, { opacity: 0 });
  rr(fbOff, -170, -64, 340, 128, { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  T(fbOff, "+ Follow", 0, 24, 66, INK, MID);
  rr(fbOn, -170, -64, 340, 128, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 6 });
  T(fbOn, "Following", 20, 22, 60, INK, MID);
  tick(fbOn, -124, 0, 1.1, EX.green, 6);
  const tFb = wt("s9", "follow") - 0.05;   // the button pops on the spoken "follow" while the board folds in behind it
  fbA.to({ o: 1, s: 1 }, tFb, 0.35, "back.out(2)");
  const cur = G(FOLLOW), curA = GA(cur, { x: 760, y: 1450, o: 0 });
  rpath(cur, "M0 0 L0 64 L15 50 L27 76 L39 71 L27 44 L49 44 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.6, roughness: 0.7 });
  const tCk = wt("s9", "follow") + 0.5;
  curA.to({ o: 1 }, tCk - 0.4, 0.01).to({ x: 590, y: 1210 }, tCk - 0.38, 0.34, "power3.out");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  fbA.to({ s: 0.92 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.16, "back.out(3)");
  hide(fbOff, tCk + 0.04, 0.08); show(fbOn, tCk + 0.04);
  const crg = G(FOLLOW), cra = GA(crg, { x: 590, y: 1210, s: 0.3, o: 0 });
  rell(crg, 0, 0, 100, 100, { stroke: EX.blue, strokeWidth: 4, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.4, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  curA.to({ o: 0, x: 700, y: 1450 }, tCk + 0.7, 0.3, "power2.in");
  // "send this to your own Sam": a second plane flies out toward you, under the board
  const pl2 = G(FOLLOW), pl2A = GA(pl2, { x: 300, y: 1330, s: 0.7, o: 0, r: -10 });   // flies under the Follow button
  rpath(pl2, "M-60 12 L60 -24 L-12 36 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rpath(pl2, "M-12 36 L0 7 L60 -24", { strokeWidth: 3.5 });
  pl2A.to({ o: 1, s: 1 }, wt("s9", "send") - 0.15, 0.15).to({ x: 1000, y: 1470, s: 1.9, r: 14 }, wt("s9", "send"), 0.7, "power2.in").to({ o: 0 }, wt("s9", "send") + 0.66, 0.1);
  NAR.key(wt("s9", "follow") - 0.1, "wave"); NAR.key(wt("s9", "send") - 0.1, "cheer");   // no pointing arm across the Follow button
  for (let k = 0; k < 8; k++) { SAM.key(wt("s9", "own") + k * 0.45, k % 2 ? "yay" : "wave"); NAR.key(wt("s9", "own") + 0.2 + k * 0.45, k % 2 ? "stand" : "wave"); }

  // the connecting arrows cross the gaps between stations: they show while the camera travels and again in the recap
  [[g12, tP1 + 1.0], [flowA, wt("s5", "quantization")], [redA, tP4 + 1.0], [lf1, tP6 + 1.0], [lf2, tP7 + 1.0]].forEach(([n, t]) => { hide(n, t, 0.25); show(n, tPull + 0.5, 0.3); });

  // ---------- the boil clock ----------
  FIGS.forEach((Fg) => Fg.keys.sort((a, b) => a[0] - b[0]));
  const boilAt = (v0) => {
    const k = Math.max(0, Math.floor(v0 / BOIL_DT));
    for (const it of BOIL) {
      const i = (k + it.ph) % 3;
      if (i !== it.cur) { it.vars[it.cur].setAttribute("visibility", "hidden"); it.vars[i].setAttribute("visibility", "visible"); it.cur = i; }
    }
    FIGS.forEach((Fg) => {
      let act = Fg.keys[0][1];
      for (const [t, n] of Fg.keys) { if (t <= v0) act = n; else break; }
      const key = act + ":" + (k % 3);
      if (key !== Fg.cur) {
        Object.keys(Fg.poses).forEach((n) => Fg.poses[n].forEach((g, j) => g.setAttribute("visibility", n === act && j === k % 3 ? "visible" : "hidden")));
        Fg.cur = key;
      }
    });
  };
  const clock = { v: 0 };
  B.fromTo(clock, { v: 0 }, { v: END_T, duration: END_T, ease: "none", immediateRender: false, onUpdate: () => boilAt(clock.v) }, 0);
  boilAt(0);
  const CA = A(CAM, { x: 0, y: 0, s: 1 }), CB = A(BGC, { x: 0, y: 0, s: 1 });
  camQ.sort((a, b) => a[0] - b[0]).forEach(([t, p, dur, ease]) => { CA.to(p, t, dur, ease); CB.to(p, t, dur, ease); });
  return {};
}
