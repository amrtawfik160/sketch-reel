// "Jev, explained" (story, Excalidraw DARK look). Same story, voice and beats as v3/v4, drawn as one continuous Excalidraw board:
// board A (x 0-1080) holds the hook (a chat that writes nothing, Vercel's usage chart); board B (1300 px to the right) holds Maya's
// desk world (inbox at the top, one product panel in the middle, trays on the desk, Maya in the left column). The camera whips
// from A to B as the Maya line starts, like scrolling an infinite whiteboard.
// Every shape is rough.js (roughness 1) with fixed seeds, in three seeded variants that "boil" (swap) every 0.14 s from a
// time-driven update, so the line wobble is deterministic and seek-safe. Shapes draw on like a hand: outline first, then the
// hachure sweeps in; arrows draw tail to head and the head lands last; handwritten notes write letter by letter.
// Maya is a rough.js drawing too: one boiling drawing per pose, switched pose-to-pose like hand-drawn animation.
// Colours: dk() (excal_theme.js) is Excalidraw's own dark-mode filter. blue = Jev, yellow = refund / the chosen box,
// violet = confidence, red = slow / harmful. Maya, her shop, the senders, subjects, latencies (212 ms, 4.8 s) and scores are illustrative.
function scene({ svg, defs, D, CAM, B, cue, kit, K, el, txt, rng }) {
  const c = cue;
  kit.logo.add("cyndra", { size: 512, keep: true, parts: [["M72 0H440A72 72 0 0 1 512 72V440A72 72 0 0 1 440 512H72A72 72 0 0 1 0 440V72A72 72 0 0 1 72 0Z", "#1d1c18"], ["M2450 4024 c-416 -53 -730 -225 -947 -520 -129 -175 -208 -372 -255 -634 -18 -102 -18 -528 0 -630 35 -192 75 -317 148 -460 187 -363 513 -597 934 -671 134 -24 375 -29 510 -10 187 26 389 101 549 205 150 97 322 288 402 448 67 133 119 299 119 380 l0 38 -390 0 -390 0 -5 -27 c-24 -111 -92 -225 -169 -283 -104 -79 -208 -106 -369 -97 -222 11 -382 118 -473 312 -62 134 -85 267 -85 486 0 428 154 699 441 774 132 35 314 19 424 -37 101 -51 205 -195 222 -303 l6 -45 395 0 394 0 -6 48 c-21 153 -81 335 -147 446 -177 301 -469 493 -848 561 -92 16 -385 28 -460 19z", "#e6e1da", "translate(0,512) scale(0.1,-0.1)"]] });
  kit.logo.add("vercel", { size: 24, parts: [["M24 22.525H0l12-21.05 12 21.05z", "#000000"]] });
  const A = kit.actor;
  // Guarded actor for anything moved in quick bursts (inbox rows, the scrollbar): each to() starts no earlier than the
  // previous one ends. kit.actor tweens the whole state from the last target, so two overlapping to() calls fight, and the
  // older one can bring back a row that has already left.
  const GA = (node, init) => {
    const a = kit.actor(node, init); let busy = -1; const raw = a.to;
    a.to = (vals, at, dur = 0.35, ease) => { const t = Math.max(at, busy); busy = t + dur; return raw(vals, t, dur, ease); };
    return a;
  };
  const G = (p, attrs = {}) => el("g", attrs, p);
  const seen = new Map();
  const mark = (n, props) => { const s = seen.get(n) || new Set(); const any = props.some((p) => s.has(p)); props.forEach((p) => s.add(p)); seen.set(n, s); return any; };
  const tw = (n, from, to, t) => B.fromTo(n, from, { ...to, immediateRender: !mark(n, Object.keys(from)) }, t);
  const op = (n, a, b, t, dur = 0.25) => tw(n, { opacity: a }, { opacity: b, duration: dur, ease: "power2.out" }, t);
  const T = (p, s, x, y, size, fill = INK, extra = {}) => txt(p, s, { x, y, "font-family": HAND, "font-size": size, fill, ...extra });
  const M = (p, s, x, y, size, fill = INK, extra = {}) => txt(p, s, { x, y, "font-family": CODE, "font-size": size, fill, ...extra });
  const END = { "text-anchor": "end" }, MID = { "text-anchor": "middle" };
  const HALO = { stroke: PAPER, "stroke-width": 8, "paint-order": "stroke" };

  // ---------- boiling: every rough shape has 3 seeded variants; one shows at a time, swapped on a fixed clock ----------
  const BOIL = [], BOIL_DT = 0.14;
  const boil = (vars) => { vars.forEach((v, i) => v.setAttribute("visibility", i ? "hidden" : "visible")); BOIL.push({ vars, cur: 0, ph: BOIL.length % 3 }); };
  const MAYA = { poses: {}, keys: [], cur: null };

  // ---------- rough.js: Excalidraw's drawing ----------
  const rc = rough.svg(svg);
  let SEED = 101;
  // Excalidraw's defaults: roughness 1, bowing 1, fill weight = stroke / 2, hachure gap = stroke * 4, angle -41
  const RO = (o = {}) => {
    const sw = o.strokeWidth || 3.5;
    return { roughness: 1, bowing: 1, stroke: INK, strokeWidth: sw, fillWeight: sw / 2, hachureGap: sw * 4, hachureAngle: -41, preserveVertices: true, seed: SEED++, ...o };
  };
  const put = (p, n) => (p.appendChild(n), n);
  // build a rough shape: 3 boiling variants (or one, with boil:false); hachure strokes are tagged so they draw after the outline
  const mk = (p, gen, o = {}) => {
    const { boil: bo = true, ...rest } = o;
    const one = () => {
      const opt = RO(rest), n = gen(opt);
      if (opt.fill && opt.fillStyle && opt.fillStyle !== "solid") [...n.children].forEach((ch) => ch.getAttribute("stroke") === opt.fill && ch.setAttribute("data-hatch", 1));
      return n;
    };
    if (!bo) return put(p, one());
    const g = G(p);
    const vars = [0, 1, 2].map((i) => { const n = one(); n.setAttribute("data-v", i); return put(g, n); });
    boil(vars);
    return g;
  };
  const rrD = (x, y, w, h, r) => `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y}`;
  // Excalidraw's "round" edges: 25% of the short side for small shapes, a fixed 32 for large ones
  const rr = (p, x, y, w, h, o = {}) => mk(p, (op_) => rc.path(rrD(x, y, w, h, Math.min(32, Math.min(w, h) * 0.25)), op_), o);
  const rline = (p, x1, y1, x2, y2, o = {}) => mk(p, (op_) => rc.line(x1, y1, x2, y2, op_), o);
  const rpath = (p, d, o = {}) => mk(p, (op_) => rc.path(d, op_), o);
  const rell = (p, cx, cy, w, h, o = {}) => mk(p, (op_) => rc.ellipse(cx, cy, w, h, op_), o);
  // An Excalidraw arrow: a gently curved rough line and a two-stroke arrowhead that lands last
  const arrow = (p, x1, y1, x2, y2, o = {}, bend = 0) => {
    const g = G(p);
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    rpath(g, `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, o);
    const a = Math.atan2(y2 - my, x2 - mx), L = 30, s = 0.48;
    rpath(G(g, { "data-head": 1 }), `M${x2 - L * Math.cos(a - s)} ${y2 - L * Math.sin(a - s)} L${x2} ${y2} L${x2 - L * Math.cos(a + s)} ${y2 - L * Math.sin(a + s)}`, o);
    return g;
  };
  // Draw a rough group on like a hand: outlines trace in order, then hachure sweeps in, solid fills fade in behind;
  // an arrow's head lands at the end. Timing is per boil variant, so whichever variant is showing draws the same way.
  const drawIn = (node, t, dur = 0.45, ease = "power1.inOut") => {
    const ps = [...node.querySelectorAll("path")];
    const vOf = (p) => { const a = p.closest("[data-v]"); return a && node.contains(a) ? a.getAttribute("data-v") : "x"; };
    const stroked = ps.filter((p) => { const s = p.getAttribute("stroke"); return s && s !== "none"; });
    const outl = stroked.filter((p) => !p.hasAttribute("data-hatch")), hat = stroked.filter((p) => p.hasAttribute("data-hatch"));
    const idx = (arr) => { const tot = {}, cnt = {}; arr.forEach((p) => { const v = vOf(p); tot[v] = (tot[v] || 0) + 1; }); return arr.map((p) => { const v = vOf(p); cnt[v] = (cnt[v] || 0) + 1; return [p, cnt[v] - 1, tot[v]]; }); };
    const dash = (p, t0, d) => {
      const len = p.getTotalLength() + 1;
      B.fromTo(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len, opacity: 0 }, { opacity: 1, duration: 0.01 }, t0);
      B.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d, ease, immediateRender: false }, t0);
    };
    const oDur = hat.length ? dur * 0.62 : dur;
    const body = outl.filter((p) => !p.closest("[data-head]")), heads = outl.filter((p) => p.closest("[data-head]"));
    idx(body).forEach(([p, i, n]) => dash(p, t + (oDur * 0.45 * i) / n, oDur * 0.6));
    heads.forEach((p) => dash(p, t + oDur * 0.92, 0.07));
    idx(hat).forEach(([p, i, n]) => dash(p, t + oDur * 0.7 + (dur * 0.2 * i) / n, dur * 0.5));
    ps.filter((p) => { const s = p.getAttribute("stroke"); return !s || s === "none"; }).forEach((p) => tw(p, { opacity: 0 }, { opacity: 1, duration: dur * 0.4, ease: "power1.out" }, t + dur * 0.3));
  };

  // discrete text changes: strs[0] now, strs[i] from times[i-1] on
  const steps = (t, strs, times) => { t.textContent = strs[0]; times.forEach((tt, i) => kit.counter(t, i, i + 1, tt, 0.01, (v) => strs[Math.round(v)], "none")); };
  // typing with a human cadence (longer gaps after spaces and punctuation), spread over [t0, t1] across several lines
  const typeLines = (els, lines, t0, t1, seed = 3) => {
    const R = rng(seed), full = lines.join("\n"), w = [];
    for (const ch of full) w.push(ch === "\n" ? 0.4 : ch === " " ? 1.6 + R() * 0.8 : ".,!?:".includes(ch) ? 2.6 : 0.7 + R() * 0.6);
    const tot = w.reduce((a, b) => a + b, 0), at = [];
    let acc = 0;
    w.forEach((x) => { acc += x; at.push(t0 + ((t1 - t0) * acc) / tot); });
    const show = (n) => { let k = 0; lines.forEach((L, i) => { els[i].textContent = L.slice(0, Math.max(0, Math.min(L.length, n - k))); k += L.length + 1; }); };
    els.forEach((e) => (e.textContent = ""));
    const pr = { v: t0 };
    B.fromTo(pr, { v: t0 }, { v: t1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => { let n = 0; while (n < at.length && at[n] <= pr.v) n++; show(n); } }, t0);
    const starts = []; let k = 0;
    lines.forEach((L) => { starts.push(at[Math.min(k, at.length - 1)]); k += L.length + 1; });
    return starts;
  };
  // a static label written on: its characters appear over dur
  const typeOn = (t, at, dur = 0.3) => { const s = t.textContent; t.textContent = ""; kit.counter(t, 0, s.length, at, dur, (v) => s.slice(0, Math.round(v)), "none"); };
  const blink = (n, t0, t1) => {
    const k = Math.max(1, Math.floor((t1 - t0 - 0.5) / 0.5));
    tw(n, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t0);
    B.fromTo(n, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: k - 1, yoyo: true, immediateRender: false }, t0 + 0.5);
    tw(n, { opacity: 1 }, { opacity: 0, duration: 0.01 }, t1);
  };
  const tint = (n, col, rest, t, hold = 0.28) => { tw(n, { fill: rest }, { fill: col, duration: 0.02 }, t); tw(n, { fill: col }, { fill: rest, duration: 0.25, ease: "power1.out" }, t + hold); };
  // a handwritten note: each line writes on in turn, like someone annotating the board
  const note = (p, lines, x, y, size, col, t, { lh = size * 1.32, cps = 22, anchor = "start", rot = 0 } = {}) => {
    const g = G(p, { opacity: 0 });
    if (rot) g.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
    let at = t;
    lines.forEach((L, i) => { const e = T(g, L, x, y + i * lh, size, col, { "text-anchor": anchor }); const d = L.length / cps; typeOn(e, at, d); at += d + 0.04; });
    tw(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t);
    g._end = at;
    return g;
  };
  // a scribbled underline (a loose zigzag, the way people underline on a whiteboard)
  const scribble = (p, x1, x2, y, col, seed = 1) => {
    const R = rng(seed), pts = [];
    for (let x = x1, i = 0; x <= x2; x += 26, i++) pts.push(`${x.toFixed(1)} ${(y + (i % 2 ? 7 : -3) + R() * 3).toFixed(1)}`);
    return rpath(p, "M" + pts.join(" L"), { stroke: col, strokeWidth: 4, roughness: 1.3 });
  };

  // ---------- camera: queued, applied in time order at the end ----------
  const camQ = [];
  const BX = 1300;   // board B sits this far right of board A on the one big canvas
  const pose = (s, fx = 540, fy = 960, sy = 960) => ({ s, x: 540 - s * fx, y: sy - s * fy });
  const poseB = (s, fx = 540, fy = 960, sy = 960, dx = 0, dy = 0) => { const p = pose(s, fx + BX, fy, sy); return { s, x: p.x + dx, y: p.y + dy }; };
  const cam = (p, t, dur, ease) => camQ.push([t, p, dur, ease]);

  // ---------- the board ----------
  const BA = G(D), BBr = G(D, { transform: `translate(${BX},0)` });
  const WINA = G(BA), CHART = G(BA), NOTEA = G(BA);
  const GROUND = G(BBr), TBACK = G(BBr), STACK = G(BBr), TFRONT = G(BBr), WIN = G(BBr), NOTES = G(BBr), MAN = G(BBr), PAN = G(BBr), FLY = G(BBr), CUR = G(BBr);

  // a window or panel, top-left at (x, y): a canvas-filled rough rectangle with a title rule and three hand-drawn dots
  const win = (p, x, y, w, h, bar = 72, dots = true) => {
    const g = G(p);
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid" });
    if (bar) rline(g, x + 14, y + bar, x + w - 14, y + bar, { strokeWidth: 2.5, roughness: 0.8 });
    if (bar && dots) [0, 1, 2].forEach((i) => rell(g, x + 36 + i * 26, y + bar / 2, 15, 15, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
    return g;
  };
  const envelope = (p, fill = PAPER) => {
    const g = G(p);
    rr(g, -55, -35, 110, 70, { fill, fillStyle: "solid", strokeWidth: 3 });
    rpath(g, "M-48 -28 L0 6 L48 -28", { strokeWidth: 3, roughness: 0.8 });
    return g;
  };

  // ================= board A: the hook. A chat with Jev that writes nothing, and Vercel's usage chart =================
  const WY = 160;
  win(WINA, 80, WY, 920, 440, 76);
  rell(WINA, 214, WY + 38, 50, 50, { stroke: EX.blue, fill: EX.blueF, fillStyle: "hachure", strokeWidth: 3 });
  T(WINA, "J", 214, WY + 52, 38, EX.blue, MID);
  const jevName = T(WINA, "Jev", 254, WY + 54, 48);
  T(WINA, "by TypeSafe AI", 254 + jevName.getComputedTextLength() + 16, WY + 52, 40, INK2);
  const askT = T(WINA, "Write me one sentence.", 0, 316, 46);
  const aw = askT.getComputedTextLength();
  askT.setAttribute("x", 950 - aw);
  const askBg = rr(G(WINA), 926 - aw, 264, aw + 48, 78, { fill: EX.blueF, fillStyle: "solid", strokeWidth: 2.5 });
  WINA.insertBefore(askBg.parentNode, askT);
  rr(WINA, 112, 372, 250, 88, { strokeWidth: 2.5 });
  const caret1 = el("rect", { x: 144, y: 391, width: 5, height: 50, fill: INK, opacity: 0 }, WINA);
  const dots = G(WINA, { opacity: 0 });
  const dotEls = [0, 1, 2].map((i) => el("circle", { cx: 182 + i * 30, cy: 416, r: 8, fill: INK2 }, dots));
  const words0 = T(WINA, "0 words", 116, 524, 42, INK2);

  // the chart: Vercel's AI Gateway, teams using each model, with sketched gridlines and axis labels
  const ch = G(CHART);
  win(ch, 80, 640, 920, 690, 0, false);
  const vl = kit.logo(ch, "vercel", 40); vl.setAttribute("transform", "translate(134,702)");
  T(ch, "AI Gateway", 170, 717, 48);
  T(ch, "teams using each model", 120, 776, 40, INK2);
  const X0 = 220, X1 = 950, Y0 = 1240, Y35 = 845;
  [Y35, (Y0 + Y35) / 2].forEach((y) => rline(ch, X0, y, X1, y, { stroke: INK2, strokeWidth: 2, strokeLineDash: [10, 14], roughness: 0.6, boil: false }));
  rline(ch, X0, Y0, X1 + 10, Y0, { strokeWidth: 3 });
  rline(ch, X0, Y0, X0, 820, { strokeWidth: 3 });
  T(ch, "35%", X0 - 16, Y35 + 12, 38, INK2, END);
  T(ch, "0", X0 - 16, Y0 + 12, 38, INK2, END);
  T(ch, "launch", X0, Y0 + 52, 38, INK2);
  const curve = (top, k) => { const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(`${(X0 + (X1 - X0) * u).toFixed(1)} ${(Y0 - 5 - (top * (Math.exp(k * u) - 1)) / (Math.exp(k) - 1)).toFixed(1)}`); } return "M" + pts.join(" L"); };
  const nextL = rpath(ch, curve(200, 2.2), { stroke: EX.gray, strokeWidth: 4, disableMultiStroke: true, roughness: 0.6 });
  const jevLg = rpath(ch, curve(Y0 - 5 - Y35, 4), { stroke: EX.blue, strokeWidth: 7, disableMultiStroke: true, roughness: 0.6, boil: false });
  const nxtLbl = T(ch, "next model", X1, 1180, 40, INK2, { ...END, opacity: 0 });
  const jevLbl = T(ch, "Jev", 690, 1110, 50, EX.blue, { ...END, opacity: 0 });
  const dot35 = G(ch, { opacity: 0 });
  rell(dot35, X1, Y35, 28, 28, { stroke: EX.blue, fill: EX.blue, fillStyle: "solid", strokeWidth: 3 });
  // the 35% callout: a yellow sticky note, slightly turned
  const stick = G(ch, { opacity: 0 });
  const stickA = A(stick, { x: 560, y: 930, r: -3 });
  rr(stick, -180, -86, 360, 172, { fill: EX.yellowF, fillStyle: "solid", stroke: dk("#e8b93a"), strokeWidth: 2.5 });
  T(stick, "35%", 0, 4, 92, INK, MID);
  const p35s = T(stick, "of paid teams", 0, 60, 40, INK2, { ...MID, opacity: 0 });
  const wk = T(ch, "2 weeks after launch", X1, Y0 + 52, 40, INK2, { ...END, opacity: 0 });
  const tick2w = rline(ch, X1, Y0 - 12, X1, Y0 + 12, { strokeWidth: 3 });
  tick2w.setAttribute("opacity", 0);

  // j1: frame one already moving: the caret blinks in an empty reply, Jev's line is climbing, the camera creeps in
  cam(pose(1.0), 0, 0.01, "none");
  cam(pose(1.03, 540, 760, 760), 0.02, c("j2", "two") - 0.15, "sine.inOut");
  // the line is revealed by a clip that widens left to right (an x sweep reads as the line growing over time)
  const jcR = el("rect", { x: X0 - 10, y: 800, width: 260, height: 460 }, el("clipPath", { id: "jevclip", clipPathUnits: "userSpaceOnUse" }, defs));
  jevLg.setAttribute("clip-path", "url(#jevclip)");
  B.fromTo(jcR, { attr: { width: 260 } }, { attr: { width: 640 }, duration: c("j1", "ever"), ease: "power1.out", immediateRender: false }, 0.001);
  blink(caret1, 0, c("j3", "_start") - 0.1);
  tw(dots, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j1", "cant") - 0.05);
  dotEls.forEach((d, i) => B.fromTo(d, { attr: { cy: 416 } }, { attr: { cy: 403 }, duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, c("j1", "cant") + i * 0.09));
  tw(dots, { opacity: 1 }, { opacity: 0, duration: 0.01 }, c("j1", "sentence"));
  tint(words0, EX.red, INK2, c("j1", "sentence") + 0.02, 0.6);
  // a red hand-drawn circle around "0 words", and a note scrawled beside it
  const ring0 = rell(WINA, 190, 509, 214, 78, { stroke: EX.red, strokeWidth: 3.5, roughness: 1.4 });
  drawIn(ring0, c("j1", "sentence") + 0.05, 0.4);
  const n1 = note(NOTEA, ["not even one!"], 470, 532, 46, EX.red, c("j1", "sentence") + 0.3, { rot: -3 });
  drawIn(arrow(NOTEA, 460, 515, 312, 508, { stroke: EX.red, strokeWidth: 3 }, 0.12), n1._end, 0.3);
  // "fastest-adopted": the next model's line draws in, flatter; the labels land whole
  drawIn(nextL, c("j1", "fastest") - 0.1, 0.45);
  tw(nxtLbl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j1", "adopted"));
  tw(jevLbl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j1", "adopted") + 0.12);
  // j2: the name lights on its own title; push in on the chart; the line reaches 35% two weeks after launch
  tint(jevName, EX.blue, INK, c("j2", "jeff") - 0.03, 0.35);
  cam(pose(1.12, 540, 985, 960), c("j2", "two") - 0.12, 0.55, "expo.out");
  tw(wk, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.2, ease: "expo.out" }, c("j2", "after"));
  tw(tick2w, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j2", "after"));
  B.fromTo(jcR, { attr: { width: 640 } }, { attr: { width: X1 - X0 + 30 }, duration: 0.45, ease: "expo.out", immediateRender: false }, c("j2", "35") - 0.25);
  tw(dot35, { opacity: 0 }, { opacity: 1, duration: 0.12 }, c("j2", "35") - 0.02);
  tw(stick, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j2", "35") - 0.06);
  stickA.to({ s: 0.85, r: -8 }, 0, 0.01).to({ s: 1, r: -3 }, c("j2", "35") - 0.06, 0.32, "back.out(1.6)");
  tw(p35s, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j2", "paid"));
  typeOn(p35s, c("j2", "paid"), 0.35);
  drawIn(arrow(ch, 748, 905, 920, 856, { strokeWidth: 3.5 }, -0.15), c("j2", "paid") + 0.1, 0.35);

  // ================= the whip: the camera scrolls the board from A to Maya's desk (B) =================
  const t3 = c("j3", "_start") - 0.1;
  cam(pose(1.12, 530, 985, 960), t3 - 0.3, 0.16, "power2.out");            // anticipation: a small pull the other way
  cam(poseB(1.0), t3 - 0.14, 0.48, "expo.inOut");

  // ================= board B: Maya's inbox =================
  const ground = rline(GROUND, 60, 1362, 1020, 1362, { strokeWidth: 3, roughness: 1.2 });
  drawIn(ground, t3 + 0.15, 0.5);
  el("rect", { x: 82, y: 238, width: 880, height: 360 }, el("clipPath", { id: "winbody", clipPathUnits: "userSpaceOnUse" }, defs));
  el("rect", { x: 304, y: 812, width: 702, height: 354 }, el("clipPath", { id: "repclip", clipPathUnits: "userSpaceOnUse" }, defs));
  const inbF = win(WIN, 80, WY, 920, 440, 76);
  drawIn(inbF, t3 - 0.05, 0.5);
  const tb2 = G(WIN, { opacity: 0 });
  T(tb2, "Inbox", 200, WY + 54, 48);
  // a sketched search field
  rr(tb2, 440, WY + 16, 270, 46, { strokeWidth: 2.2, stroke: INK2 });
  rell(tb2, 470, WY + 37, 20, 20, { stroke: INK2, strokeWidth: 2.2 });
  rline(tb2, 477, WY + 44, 486, WY + 53, { stroke: INK2, strokeWidth: 2.2 });
  T(tb2, "search", 498, WY + 50, 36, INK2, { "data-deco": 1 });
  const cnt = T(tb2, "", 970, WY + 52, 42, INK2, END);
  op(tb2, 0, 1, t3 + 0.2, 0.25);
  // a hand-drawn scrollbar on the right edge of the list
  const sbar = G(WIN, { opacity: 0 });
  rr(sbar, 972, 250, 14, 336, { stroke: INK2, strokeWidth: 2, roughness: 0.6 });
  const thumbG = G(sbar), thumb = GA(thumbG, { x: 0, y: 0 });
  rr(thumbG, 970, 262, 18, 90, { stroke: INK, fill: INK2, fillStyle: "solid", strokeWidth: 2, roughness: 0.6 });
  op(sbar, 0, 1, t3 + 0.35, 0.25);
  let thumbY = 30;
  const thumbTo = (dy, t, dur = 0.18) => { thumbY = Math.max(0, Math.min(220, thumbY + dy)); thumb.to({ y: thumbY }, t, dur, "power2.out"); };
  thumb.to({ y: thumbY }, 0, 0.01);

  const INB = G(WIN, { "clip-path": "url(#winbody)" });
  const ROWS = [
    ["Dana", "Where's my refund?", "9:41"], ["Leo", "Package still not here", "9:41"], ["Sam", "Wrong size, can I swap it?", "9:40"],
    ["Priya", "URGENT: charged twice", "9:40"], ["Ana", "Tracking says delivered??", "9:39"], ["Omar", "Order #4471 never shipped", "9:39"],
    ["Kim", "No receipt for my order", "9:38"], ["Raj", "Can I change my address?", "9:38"],
    ["Jo", "Do you ship to Canada?", "9:37"], ["Mei", "Discount code not working", "9:36"], ["Ben", "Item arrived broken", "9:35"],
    ["Eva", "Change my order size?", "9:35"], ["Tom", "Where is my package?", "9:34"], ["Lia", "Refund for order #4402", "9:33"],
  ];
  const AV = [[EX.blue, EX.blueF], [EX.green, EX.greenF], [EX.violet, EX.violetF], [EX.red, EX.redF], [EX.orange, EX.yellowF]];
  const rowY = (k) => 296 + k * 120;
  const rows = ROWS.map(([who, subj, time], i) => {
    const g = G(INB);
    const [sc, fc] = AV[i % 5];
    el("circle", { cx: -438, cy: 0, r: 7, fill: EX.blue }, g);                   // unread dot
    rell(g, -386, 2, 58, 58, { stroke: sc, fill: fc, fillStyle: "hachure", strokeWidth: 2.6, hachureGap: 9 });
    T(g, who[0], -386, 17, 40, INK, { ...MID, ...HALO });
    T(g, who, -340, -12, 44);
    T(g, subj, -340, 38, 42, INK2);
    T(g, time, 412, -12, 38, INK2, END);
    rline(g, -440, 62, 412, 62, { strokeWidth: 2, stroke: dk("#ced4da"), roughness: 0.7 });
    return { g, a: GA(g, { x: 540, y: rowY(0), o: 0 }), subj };
  });
  // the list: rows 8-13 are already there; 7..0 arrive on top; later the top row leaves when it is sorted.
  // Rows below a change follow it with a small stagger, like a real list settling.
  let order = [8, 9, 10, 11, 12, 13];
  const tPa = c("j3", "runs") - 0.04, tPb = c("j3", "day") + 0.15, tP0 = tPa;
  order.forEach((r, k) => rows[r].a.to({ y: rowY(k) }, 0, 0.01).to({ o: 1 }, Math.min(t3 + 0.3 + k * 0.05, tP0 - 0.16 - (5 - k) * 0.01), 0.12));   // all settled before the first push
  const relayout = (t, dur = 0.26, stag = 0.035) => order.forEach((r, k) => { if (rows[r].a.cur().y !== rowY(k)) rows[r].a.to({ y: rowY(k) }, t + Math.min(k, 4) * stag, dur, "expo.out"); });
  // push: the new row waits just above the clipped list body and the whole list slides down together (no stagger,
  // so no row moves into a slot before its occupant has left)
  const push = (r, t) => { rows[r].a.to({ y: rowY(-1) }, 0, 0.01).to({ o: 1 }, t - 0.02, 0.01); order = [r, ...order]; relayout(t, 0.28, 0); thumbTo(-6, t); };
  const popTop = (t, dur = 0.26, stag = 0.035) => { const r = order.shift(); rows[r].a.to({ o: 0 }, t, 0.01); relayout(t + 0.04, dur, stag); thumbTo(9, t + 0.04, Math.min(0.18, dur)); return r; };
  const tP = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => tPa + i * (tPb - tPa) / 7);
  // mail arrives: small envelopes arc in from the right edge of the board and drop into the top of the inbox
  [7, 6, 5, 4, 3, 2, 1, 0].forEach((r, i) => {
    const t = tP[i];
    const o = G(FLY), inr = G(o); envelope(inr);
    const ax = A(o, { x: 1120 + (i % 3) * 30, y: 0, o: 0, s: 1 }), ay = A(inr, { x: 0, y: 420 + (i % 2) * 60, s: 0.55, r: 14 });
    ax.to({ o: 1 }, t - 0.42, 0.01).to({ x: 760 - (i % 4) * 50 }, t - 0.41, 0.4, "power1.out").to({ o: 0 }, t - 0.01, 0.01);
    ay.to({ y: 250 + (i % 2) * 40, r: -10 }, t - 0.41, 0.16, "power2.out").to({ y: 300, s: 0.4, r: 0 }, t - 0.25, 0.24, "power2.in");
    push(r, t);
  });
  tw(cnt, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j3", "10") - 0.3);
  const fmtN = (v) => Math.round(v).toLocaleString("en-US") + " new";
  kit.counter(cnt, 9958, 10000, c("j3", "10") - 0.3, c("j3", "emails") - c("j3", "10") + 0.3, fmtN, "none");
  let count = 10000;
  const dec = (t) => { kit.counter(cnt, count, count - 1, t, 0.01, fmtN, "none"); count -= 1; };

  // a yellow sticky note in the middle: 10,000 a day, and a scrawl under it
  const n10 = G(FLY), n10A = A(n10, { x: 650, y: 860, r: 3, o: 0 });
  rr(n10, -200, -112, 400, 224, { fill: EX.yellowF, fillStyle: "solid", stroke: dk("#e8b93a"), strokeWidth: 2.5 });
  T(n10, "10,000", 0, 8, 100, INK, MID);
  T(n10, "emails a day", 0, 74, 46, INK2, MID);
  const t10k = c("j3", "10") - 0.08;
  n10A.to({ s: 0.85, r: 9 }, 0, 0.01).to({ s: 1, r: 3, o: 1 }, t10k, 0.32, "back.out(1.6)").to({ y: 830, o: 0 }, c("j4", "each") - 0.45, 0.22, "power2.in");
  const nAnd = note(FLY, ["...and counting"], 470, 1060, 44, INK2, c("j3", "support"), { rot: -2 });
  tw(nAnd, { opacity: 1 }, { opacity: 0, duration: 0.2 }, c("j4", "each") - 0.45);

  // ================= Maya: a rough.js drawing, one boiling drawing per pose =================
  const POSE = {
    stand: { la: [-16, -8], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    calm: { la: [-16, -8], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "flat", look: 1 },
    wave: { la: [-16, -8], ra: [142, 168], ll: [-9, -4], rl: [9, 4], m: "big", look: 0.3 },
    walk1: { la: [24, 12], ra: [-20, -8], ll: [-16, -30], rl: [20, 10], m: "smile", look: 1 },
    walk2: { la: [-20, -8], ra: [24, 12], ll: [20, 10], rl: [-16, -30], m: "smile", look: 1 },
    point: { la: [-16, -8], ra: [80, 76], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    slump: { la: [-5, -2], ra: [5, 2], ll: [-7, -2], rl: [7, 2], m: "frown", look: 0.4, tilt: 16, lean: 5 },
    skeptic: { la: [-48, 42], ra: [48, -42], ll: [-11, -5], rl: [11, 5], m: "flat", look: 1, tilt: -8 },
    hold: { la: [-16, -8], ra: [150, 172], ll: [-9, -4], rl: [9, 4], m: "flat", look: 0.2, tilt: -6 },
    holdO: { la: [-16, -8], ra: [150, 172], ll: [-9, -4], rl: [9, 4], m: "o", look: 1 },
    holdHappy: { la: [-16, -8], ra: [150, 172], ll: [-9, -4], rl: [9, 4], m: "big", look: 1 },
    shrug: { la: [-62, -142], ra: [62, 142], ll: [-9, -4], rl: [9, 4], m: "flat", look: 0.6, tilt: 8 },
    relax: { la: [-150, 108], ra: [150, -108], ll: [-9, -4], rl: [12, 4], m: "big", look: 0.6, tilt: -6, lean: -4 },
    relax2: { la: [-150, 108], ra: [150, -108], ll: [-9, -4], rl: [12, 4], m: "big", look: 0.6, tilt: 5, lean: -4 },
  };
  const MOUTH = { smile: "M-14 12 Q0 25 14 12", big: "M-17 8 Q0 34 17 8 Z", frown: "M-13 22 Q0 11 13 22", flat: "M-12 16 L12 16" };
  const R2D = Math.PI / 180;
  const limb = (x, y, [a1, a2], L1, L2) => { const ex = x + Math.sin(a1 * R2D) * L1, ey = y + Math.cos(a1 * R2D) * L1; return [[x, y], [ex, ey], [ex + Math.sin(a2 * R2D) * L2, ey + Math.cos(a2 * R2D) * L2]]; };
  const pl = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const drawPose = (p, P) => {
    const g = G(p);
    const o = { strokeWidth: 5.5, roughness: 1.1, boil: false };
    rpath(g, pl(limb(0, 0, P.ll, 84, 84)), o);
    rpath(g, pl(limb(0, 0, P.rl, 84, 84)), o);
    const up = G(g, { transform: `rotate(${P.lean || 0})` });
    rline(up, 0, 0, 0, -150, o);
    rpath(up, pl(limb(0, -128, P.la, 72, 66)), o);
    rpath(up, pl(limb(0, -128, P.ra, 72, 66)), o);
    const hd = G(up, { transform: `rotate(${P.tilt || 0} 0 -150)` });
    const hy = -194, lk = (P.look || 0) * 5;
    rell(hd, -32, hy - 34, 34, 34, { ...o, strokeWidth: 4.5, fill: PAPER, fillStyle: "solid" });   // the bun, behind the head
    rell(hd, 0, hy, 86, 86, { ...o, fill: PAPER, fillStyle: "solid" });
    [-14, 14].forEach((ex) => el("circle", { cx: ex + lk, cy: hy - 6, r: 5, fill: INK }, hd));
    if (P.m === "o") rell(hd, lk, hy + 18, 16, 18, { ...o, strokeWidth: 3.5, roughness: 0.5 });
    else rpath(G(hd, { transform: `translate(${lk},${hy})` }), MOUTH[P.m], { ...o, strokeWidth: 4, roughness: 0.5 });
    return g;
  };
  const MS = 1.0, HIP = 1360 - 167 * MS, MX = 170;
  const mayaG = G(MAN), myA = A(mayaG, { x: -160, y: HIP, s: MS, o: 0 });
  Object.entries(POSE).forEach(([name, P]) => {
    MAYA.poses[name] = [0, 1, 2].map(() => { const g = drawPose(mayaG, P); g.setAttribute("visibility", "hidden"); return g; });
  });
  const mp = (t, name) => MAYA.keys.push([t, name]);
  const handOf = (name) => { const P = POSE[name], h = limb(0, -128, P.ra, 72, 66)[2], a = (P.lean || 0) * R2D; return [MX + (h[0] * Math.cos(a) - h[1] * Math.sin(a)) * MS, HIP + (h[0] * Math.sin(a) + h[1] * Math.cos(a)) * MS]; };
  const tW = t3 + 0.42;
  myA.to({ o: 1 }, tW, 0.01).to({ x: MX }, tW + 0.01, 0.62, "power2.out");
  // walk in, pose to pose
  mp(0, "stand");
  [0, 1, 2, 3].forEach((i) => mp(tW + i * 0.155, i % 2 ? "walk2" : "walk1"));
  mp(tW + 0.64, "wave");
  mp(c("j3", "support"), "stand");
  // her name, hand-written beside her with a little arrow
  const nameG = G(MAN);
  const nm = note(nameG, ["Maya"], 36, 900, 50, EX.violet, tW + 0.3, { rot: -4 });
  drawIn(arrow(nameG, 104, 912, 132, 950, { stroke: EX.violet, strokeWidth: 3 }, 0.2), nm._end, 0.25);
  tw(nameG, { opacity: 1 }, { opacity: 0, duration: 0.25 }, c("j4", "each") - 0.1);

  // ================= j4: three trays drawn on the desk, one per word =================
  const TX = [370, 560, 750], TNAME = ["Refund", "Shipping", "Urgent"];
  const TFILL = [[EX.orange, EX.yellowF, dk("#f5c84c")], [EX.blue, EX.blueF, dk("#74b9f0")], [EX.red, EX.redF, dk("#f29a9a")]];
  const tray = (p1, p2, cx, label, cols, dash = null, hw = 96) => {
    const back = G(p1), front = G(p2);
    const ds = dash ? { strokeLineDash: dash } : {};
    rpath(back, `M${cx - hw + 12} 1228 L${cx + hw - 12} 1228 M${cx - hw + 12} 1228 L${cx - hw} 1240 M${cx + hw - 12} 1228 L${cx + hw} 1240`, { strokeWidth: 3, roughness: 0.8, ...ds });
    const body = rpath(front, `M${cx - hw} 1240 L${cx - hw + 12} 1354 L${cx + hw - 12} 1354 L${cx + hw} 1240 Z`, { strokeWidth: 3.5, fill: PAPER, fillStyle: "solid", ...ds });
    const hatch = rpath(front, `M${cx - hw} 1240 L${cx - hw + 12} 1354 L${cx + hw - 12} 1354 L${cx + hw} 1240 Z`, { stroke: "none", fill: cols[2] || cols[1], fillStyle: "hachure", strokeWidth: 3.5, fillWeight: 2.6, hachureGap: 13, ...ds });
    hatch.querySelectorAll("path").forEach((p) => p.setAttribute("data-hatch", 1));
    const lbl = T(front, label, cx, 1312, 38, dash ? EX.red : INK, { ...MID, ...HALO });
    return { back, front, body, hatch, lbl };
  };
  const trays = TX.map((x, i) => tray(TBACK, TFRONT, x, TNAME[i], TFILL[i]));
  const trayIn = [c("j4", "refund") - 0.08, c("j4", "shipping") - 0.08, c("j4", "urgent") - 0.06];
  trays.forEach((t, i) => {
    drawIn(t.body, trayIn[i], 0.32); drawIn(t.back, trayIn[i] + 0.1, 0.22); drawIn(t.hatch, trayIn[i] + 0.2, 0.4);
    tw(t.lbl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, trayIn[i] + 0.14); typeOn(t.lbl, trayIn[i] + 0.14, 0.24);
  });
  mp(c("j4", "box") - 0.1, "point");
  mp(c("j4", "urgent") + 0.5, "stand");
  // a tray wobbles when something lands in it
  const wobble = (b, t) => [trays[b].back, trays[b].front].forEach((n) => tw(n, { rotation: 0, transformOrigin: "50% 100%" }, { rotation: b % 2 ? 2.6 : -2.6, duration: 0.07, ease: "power2.out", yoyo: true, repeat: 1 }, t));
  // stacks: an envelope that lands becomes part of its tray's stack (drawn between the tray's back and front)
  const stackN = [0, 0, 0], SR = rng(11);
  const stackPos = (b) => { const n = stackN[b]++; return [TX[b] + (SR() - 0.5) * 14, 1262 - n * 11, (SR() - 0.5) * 8]; };
  // an envelope flies on a gravity arc (x eases across while y rises then falls), spins a little, and lands with a settle
  const drop = (b, x0, y0, t0, t1, s0 = 1, lift = 90) => {
    const [x, y, r] = stackPos(b);
    const outer = G(FLY), inner = G(outer); envelope(inner);
    const ox = A(outer, { x: x0, y: 0, o: 0 }), iy = A(inner, { x: 0, y: y0, s: s0, r: 0 });
    const d = t1 - t0, apex = Math.min(y0, y) - lift;
    ox.to({ o: 1 }, t0, 0.01).to({ x }, t0 + 0.01, d - 0.01, "power1.inOut").to({ o: 0 }, t1, 0.01);
    iy.to({ y: apex, s: (s0 + 1) / 2, r: -16 }, t0 + 0.01, d * 0.36, "power2.out").to({ y, s: 1, r }, t0 + 0.01 + d * 0.36, d * 0.64 - 0.01, "power2.in");
    const st = A(envelope(STACK), { x, y, r, o: 0 });
    st.to({ o: 1, y: y + 4, s: 1.05 }, t1, 0.01).to({ y, s: 1 }, t1 + 0.01, 0.16, "back.out(3)");
    wobble(b, t1);
  };

  // ================= the hand-drawn mouse cursor =================
  const curG = G(CUR), curA = A(curG, { x: 1000, y: 1000, o: 0 });
  rpath(curG, "M0 0 L0 48 L12 37 L21 57 L30 53 L21 33 L37 33 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.2, roughness: 0.7 });
  const click = (x, y, t) => {
    curA.to({ s: 0.84 }, t, 0.06, "power2.in").to({ s: 1 }, t + 0.06, 0.12, "back.out(3)");
    const rg = G(CUR), ra = A(rg, { x, y, s: 0.3, o: 0 });
    rell(rg, 0, 0, 70, 70, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.2 });
    ra.to({ o: 1 }, t + 0.02, 0.01).to({ s: 1.25, o: 0 }, t + 0.03, 0.4, "power2.out");
  };

  // ================= the middle panel slot: one product panel at a time =================
  const PX0 = 300, PY0 = 630, PW = 710, PH = 540, PR = PX0 + PW - 30;   // PR: right text edge
  const TTX = PX0 + 120;   // title text starts after the three dots
  const panel = (title, sub, subSize = 38) => {
    const g = G(PAN), a = A(g, { x: 0, y: 0, o: 0 });
    const frame = win(g, PX0, PY0, PW, PH, 72);
    const b = G(g);
    const tt = T(b, title, TTX, PY0 + 52, 46);
    if (sub) T(b, sub, TTX + 14 + tt.getComputedTextLength(), PY0 + 50, subSize, INK2);
    return { g, a, frame, b };
  };
  const slideIn = (pa, t) => { pa.a.to({ y: 26 }, 0, 0.01).to({ o: 1 }, t, 0.01).to({ y: 0 }, t + 0.01, 0.42, "expo.out"); drawIn(pa.frame, t, 0.42); op(pa.b, 0, 1, t + 0.2, 0.2); };
  const slideOut = (pa, t) => pa.a.to({ y: -40, o: 0 }, t, 0.24, "power2.in");

  // ================= j4: Maya clicks the top email; it opens in a reading pane =================
  const tClk = c("j4", "each") - 0.12;
  curA.to({ o: 1 }, tClk - 0.62, 0.01).to({ x: 540, y: rowY(0) + 8 }, tClk - 0.6, 0.5, "back.out(1.3)");
  click(540, rowY(0) + 8, tClk);
  curA.to({ x: 1000, y: 1180 }, tClk + 0.35, 0.55, "power2.inOut").to({ o: 0 }, tClk + 0.92, 0.12);
  const t5 = c("j5", "right") - 0.05;
  const rd = panel("Dana", "9:41");
  slideIn(rd, tClk + 0.06);
  T(rd.b, "Where's my refund?", PX0 + 32, PY0 + 146, 52);
  ["Hi! I sent the shoes back two", "weeks ago and I still haven't", "seen my money. Can you check?"].forEach((L, i) => T(rd.b, L, PX0 + 32, PY0 + 228 + i * 60, 44, INK2));
  const rdU = scribble(rd.b, PX0 + 34, PX0 + 470, PY0 + 166, EX.orange, 4);
  drawIn(rdU, c("j4", "refund") + 0.05, 0.3);
  slideOut(rd, t5 - 0.12);

  // ================= j5: the chatbot writes a whole paragraph, word by word, to say "refund" =================
  const cb = panel("Chatbot");
  slideIn(cb, t5);
  const timer = M(cb.b, "0.0 s", PR, PY0 + 52, 40, INK2, END);
  const incT = T(cb.b, "Package still not here", PX0 + 54, PY0 + 146, 44);
  const incBgG = G(cb.b);
  cb.b.insertBefore(incBgG, incT);
  rr(incBgG, PX0 + 30, PY0 + 96, incT.getComputedTextLength() + 48, 74, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5 });
  const R1 = ["Thanks for reaching out!", "I understand how stressful", "a missing refund can be.", "Looking at this message,", "the customer mentions a",
    "refund that hasn't arrived,", "so after weighing our", "policies, the best category", "for this email is: refund."];
  const LH = 56, LY0 = PY0 + 232;
  const repA = G(cb.b, { "clip-path": "url(#repclip)" });
  const scr = G(repA), scrA = A(scr);
  const r1Els = R1.map((_, i) => T(scr, "", PX0 + 32, LY0 + i * LH, 42, INK2));
  const lastLine = R1[8], cut = lastLine.indexOf("refund");
  r1Els[8].textContent = lastLine.slice(0, cut);
  const lx = PX0 + 32 + r1Els[8].getComputedTextLength() + 4;
  const hl = G(scr, { opacity: 0 });
  rr(hl, lx + 2, LY0 + 8 * LH - 38, 140, 50, { stroke: "none", fill: EX.yellowF, fillStyle: "solid", strokeWidth: 2 });
  const r1Last = T(scr, "", lx + 10, LY0 + 8 * LH, 42, INK);
  const tTypeA = c("j5", "writes"), tTypeB = c("j5", "say") + 0.05;
  const typed = R1.slice(0, 8).concat([lastLine.slice(0, cut)]);
  const st1 = typeLines(r1Els, typed, tTypeA, tTypeB, 5);
  steps(r1Last, ["", "refund."], [c("j5", "refund") - 0.02]);
  tw(hl, { opacity: 0 }, { opacity: 1, duration: 0.12 }, c("j5", "refund") + 0.02);
  for (let i = 6; i < 9; i++) scrA.to({ y: -(i - 5) * LH }, st1[i] - 0.05, 0.16, "power2.out");
  kit.counter(timer, 0, 4.8, tTypeA, c("j5", "seconds") - tTypeA, (v) => v.toFixed(1) + " s", "none");
  tw(timer, { fill: INK2 }, { fill: EX.red, duration: 0.02 }, c("j5", "seconds") - 0.02);
  // the annotator's note: an essay, for one word
  const nEss = note(NOTES, ["an essay...", "for 1 word"], 44, 700, 44, EX.red, c("j5", "paragraph"), { rot: -4 });
  const arEss = arrow(NOTES, 150, 790, 316, 880, { stroke: EX.red, strokeWidth: 3 }, -0.18);
  drawIn(arEss, nEss._end, 0.3);
  // "every email": the next one starts the same way
  const tEv = c("j5", "per") - 0.05;
  tw(scr, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tEv);
  steps(incT, ["Where's my refund?", "Package still not here"], [tEv]);
  const scr2 = G(repA);
  const r2Els = [0, 1].map((i) => T(scr2, "", PX0 + 32, LY0 + i * LH, 42, INK2));
  typeLines(r2Els, ["Thanks for reaching out!", "I'm sorry your package"], tEv + 0.12, c("j6", "jev") - 0.1, 9);
  tw(timer, { fill: EX.red }, { fill: INK2, duration: 0.01 }, tEv);
  kit.counter(timer, 0, 1.3, tEv + 0.02, c("j6", "jev") - 0.15 - tEv, (v) => v.toFixed(1) + " s", "none");
  mp(c("j5", "seconds") - 0.05, "slump");

  // ================= j6: Jev: email in, one box out =================
  const t6 = c("j6", "jev") - 0.12;
  slideOut(cb, t6 - 0.06);
  [nEss, arEss].forEach((n) => tw(n, { opacity: 1 }, { opacity: 0, duration: 0.18 }, t6 - 0.06));
  const jv = panel("Jev", "by TypeSafe AI");
  slideIn(jv, t6 + 0.1);
  mp(t6 + 0.2, "calm");
  const lat = M(jv.b, "", PR, PY0 + 122, 42, EX.blue, END);
  M(jv.b, "email", PX0 + 32, PY0 + 122, 38, INK2);
  const SLOT = [PX0 + PW / 2, PY0 + 175];
  rr(jv.b, PX0 + 30, SLOT[1] - 40, PW - 60, 80, { strokeWidth: 2.5, strokeLineDash: [12, 10], stroke: EX.gray });
  const choose = T(jv.b, "choose one", PX0 + 32, PY0 + 272, 40, INK2, { opacity: 0 });
  const OY = [PY0 + 330, PY0 + 388, PY0 + 446], OPT = ["refund", "shipping", "urgent"];
  const optG = OPT.map((o, i) => {
    const g = G(jv.b, { opacity: 0 });
    rell(g, PX0 + 50, OY[i] - 14, 32, 32, { strokeWidth: 3 });
    const fillC = G(g, { opacity: 0 });
    rell(fillC, PX0 + 50, OY[i] - 14, 18, 18, { stroke: EX.orange, fill: EX.orange, fillStyle: "solid", strokeWidth: 2 });
    T(g, o, PX0 + 82, OY[i], 46);
    const sc = M(g, "", PR, OY[i], 42, INK2, END);
    return { g, fillC, sc };
  });
  rline(jv.b, PX0 + 30, PY0 + 474, PX0 + PW - 30, PY0 + 474, { strokeWidth: 2.5, roughness: 0.8 });
  M(jv.b, "box:", PX0 + 32, PY0 + 520, 40, INK2);
  const boxV = M(jv.b, "", PX0 + 140, PY0 + 520, 40, EX.orangeT);
  const confL = M(jv.b, "sure:", PX0 + 470, PY0 + 520, 40, INK2, { opacity: 0 });
  const confV = M(jv.b, "", PR, PY0 + 520, 40, EX.violet, END);
  // "multiple-choice": the three options write in, unevenly
  [0, 0.09, 0.15].forEach((d, i) => tw(optG[i].g, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.2, ease: "expo.out" }, c("j6", "multiple") - 0.05 + d));
  tw(choose, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j6", "multiple") - 0.05);
  const nNo = note(NOTES, ["no essay.", "just pick 1"], 44, 700, 44, EX.green, c("j6", "machine") - 0.05, { rot: -4 });
  const arNo = arrow(NOTES, 150, 790, 318, 945, { stroke: EX.green, strokeWidth: 3 }, -0.15);
  drawIn(arNo, nNo._end, 0.3);
  // the flow, drawn as Excalidraw arrows: inbox -> Jev's email slot, Jev -> the trays
  const arIn = arrow(PAN, 250, 610, PX0 + 24, SLOT[1] - 10, { strokeWidth: 3.5, stroke: EX.blue }, -0.25);
  const arOut = arrow(PAN, 995, PY0 + PH + 14, 866, 1290, { strokeWidth: 3.5, stroke: EX.blue }, -0.25);
  drawIn(arIn, c("j6", "machine") - 0.25, 0.35);
  drawIn(arOut, c("j6", "box") - 0.1, 0.3);
  // an inbox row becomes a card and travels down into the email slot (lift, then a glide)
  const card = (subj) => {
    const g = G(FLY);
    rr(g, -(PW - 60) / 2, -40, PW - 60, 80, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
    T(g, subj, -(PW - 60) / 2 + 24, 15, 44);
    return A(g, { x: 450, y: rowY(0) + 13, o: 0 });
  };
  const bringIn = (t) => {
    const cd = card(rows[order[0]].subj);
    cd.to({ o: 1 }, t, 0.01).to({ s: 1.05, y: rowY(0) - 6, r: -2 }, t + 0.01, 0.1, "power2.out").to({ x: SLOT[0], y: SLOT[1], s: 1, r: 0 }, t + 0.11, 0.44, "expo.out");
    popTop(t + 0.14);   // the list closes up only after the lifted card has left the row
    return cd;
  };
  const sendOut = (cd, b, t) => { cd.to({ o: 0 }, t, 0.01); drop(b, SLOT[0], SLOT[1], t, t + 0.5, 0.9, 70); dec(t); };
  const cd1 = bringIn(c("j6", "machine") - 0.3);
  sendOut(cd1, 0, c("j6", "box") + 0.2);
  mp(c("j6", "box") + 0.45, "stand");

  // ================= j7: all three scored at once; the answer in a fraction of a second =================
  const scoreRing = G(jv.b);
  const sr = rr(scoreRing, PX0 + 22, OY[0] - 54, 268, 188, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.5 });
  drawIn(sr, c("j7", "all") - 0.05, 0.42);
  tw(scoreRing, { opacity: 1 }, { opacity: 0, duration: 0.25 }, c("j7", "answers"));
  [nNo, arNo].forEach((n) => tw(n, { opacity: 1 }, { opacity: 0, duration: 0.2 }, c("j7", "it") - 0.05));
  const tLat = c("j7", "answers") - 0.05, tBack = c("j8", "it") - 0.1;
  // push in on the panel; what the zoom would crop steps out, and comes back on the way out
  cam(poseB(1.3, PX0 + PW / 2, PY0 + PH / 2, 900), tLat - 0.24, 0.52, "expo.out");
  cam(poseB(1.0), tBack, 0.58, "expo.inOut");
  [WIN, MAN, TBACK, STACK, TFRONT, GROUND, arIn, arOut].forEach((n) => { op(n, 1, 0, tLat - 0.2, 0.2); op(n, 0, 1, tBack + 0.1, 0.35); });
  tw(lat, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tLat);
  kit.counter(lat, 0, 212, tLat, 0.212, (v) => Math.round(v) + " ms", "none");
  const latU = scribble(jv.b, PR - 150, PR, PY0 + 138, EX.blue, 7);
  drawIn(latU, tLat + 0.28, 0.25);
  // a sticky note: the chatbot's time, for comparison
  const vsG = G(jv.g, { opacity: 0 }), vsA = A(vsG, { x: 840, y: 566, r: 4 });
  rr(vsG, -160, -52, 320, 104, { fill: EX.redF, fillStyle: "solid", stroke: dk("#e8a0a0"), strokeWidth: 2.5 });
  T(vsG, "chatbot: 4.8 s", 0, 14, 42, INK, MID);
  const tVs = Math.max(c("j7", "so") - 0.05, tLat + 0.05);   // after the inbox has stepped out of the zoom
  tw(vsG, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tVs);
  vsA.to({ s: 0.8, r: 12 }, 0, 0.01).to({ s: 1, r: 4 }, tVs, 0.32, "back.out(1.8)");
  tw(vsG, { opacity: 1 }, { opacity: 0, duration: 0.15 }, tBack);

  // the sheet's states, in time order: Dana (refund), Leo (shipping), Sam (unsure); all three scores change together
  const tS1 = c("j6", "picks") - 0.03, tOnce = c("j7", "once") - 0.03;
  const tIn2 = c("j9", "98") - 0.45, tS2 = c("j9", "98") - 0.03;
  const tIn3 = c("j9", "52") - 0.4, tS3 = c("j9", "52") - 0.03;
  const ST = [tOnce, tIn2, tS2, tIn3, tS3];
  const scores = (i, vals) => steps(optG[i].sc, ["", vals[0], "", vals[1], "", vals[2]], ST);
  scores(0, ["0.98", "0.01", "0.52"]);
  scores(1, ["0.01", "0.98", "0.46"]);
  scores(2, ["0.01", "0.01", "0.02"]);
  steps(boxV, ["", "\"refund\"", "", "\"shipping\"", "", "\"refund\""], [c("j6", "box") - 0.03, tIn2, tS2, tIn3, tS3]);
  steps(confV, ["", "0.98", "", "0.98", "", "0.52"], [c("j8", "how") - 0.05, tIn2, tS2, tIn3, tS3]);
  tw(confL, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j8", "how") - 0.05);
  tw(boxV, { fill: EX.orangeT }, { fill: INK2, duration: 0.01 }, tS3);
  const pick = (i, t0, t1) => {
    tw(optG[i].fillC, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "power2.out" }, t0);
    if (t1) tw(optG[i].fillC, { opacity: 1 }, { opacity: 0, duration: 0.01 }, t1);
  };
  pick(0, tS1, tIn2);
  pick(1, tS2, tIn3);
  pick(0, tS3, null);

  // ================= j8: a fourth box tries to form, and can't; the confidence shows =================
  const g4 = tray(G(TBACK), G(TFRONT), 950, "refund-ish", [EX.red, EX.redF, dk("#f29a9a")], [12, 10], 100);
  const t4 = c("j8", "invent") - 0.05;
  drawIn(g4.body, t4, 0.3); drawIn(g4.back, t4 + 0.05, 0.25); drawIn(g4.hatch, t4 + 0.12, 0.3);
  tw(g4.lbl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t4 + 0.1);
  typeOn(g4.lbl, t4 + 0.1, 0.2);
  const t4x = c("j8", "box") + 0.05;
  // a red cross is drawn over it, it shudders, then falls away off the desk
  const x4 = G(TFRONT);
  rpath(x4, "M866 1236 L1034 1350", { stroke: EX.red, strokeWidth: 5 });
  rpath(x4, "M1034 1236 L866 1350", { stroke: EX.red, strokeWidth: 5 });
  drawIn(x4, t4x, 0.25);
  const g4all = G(TFRONT);
  [g4.back, g4.front, x4].forEach((n) => g4all.appendChild(n));
  tw(g4all, { x: 0 }, { x: 6, duration: 0.04, yoyo: true, repeat: 3, ease: "none" }, t4x + 0.26);
  tw(g4all, { rotation: 0, y: 0, opacity: 1, transformOrigin: "50% 100%" }, { rotation: 14, y: 90, opacity: 0, duration: 0.3, ease: "power3.in" }, t4x + 0.44);
  tw(arOut, { opacity: 1 }, { opacity: 0, duration: 0.15 }, t4 - 0.2);
  tw(arOut, { opacity: 0 }, { opacity: 1, duration: 0.25 }, t4x + 0.75);
  mp(t4, "skeptic");
  mp(c("j8", "tells"), "stand");

  // ================= j9: 0.98 goes straight to its tray; 0.52 goes up to Maya =================
  const cd2 = bringIn(tIn2);
  sendOut(cd2, 1, c("j9", "sorted") - 0.05);
  const cd3 = bringIn(tIn3);
  const rv = G(jv.b, { opacity: 0 });
  const rvT = T(rv, "needs review", 0, PY0 + 274, 42, EX.violet, MID);
  const rvW = rvT.getComputedTextLength() + 36;
  rvT.setAttribute("x", PR - rvW / 2);
  rv.insertBefore(rr(G(rv), PR - rvW, PY0 + 232, rvW, 56, { stroke: EX.violet, fill: EX.violetF, fillStyle: "solid", strokeWidth: 2.5 }).parentNode, rvT);
  tw(rv, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.22, ease: "expo.out" }, c("j9", "52") + 0.3);
  tw(choose, { opacity: 1 }, { opacity: 0, duration: 0.01 }, c("j9", "52") + 0.3);
  const cfU = scribble(jv.b, PR - 84, PR, PY0 + 536, EX.violet, 9);
  drawIn(cfU, c("j9", "52") + 0.15, 0.25);
  const tHand = c("j9", "maya") - 0.15;
  // the unsure email becomes a violet envelope and arcs up to Maya's hand
  const [hx, hy] = handOf("hold");
  const env3o = G(FLY), env3 = G(env3o);
  const e3x = A(env3o, { x: SLOT[0], y: 0, o: 0 }), e3y = A(env3, { x: 0, y: SLOT[1], r: 0 });
  envelope(env3, EX.violetF);
  cd3.to({ o: 0 }, tHand, 0.01);
  e3x.to({ o: 1 }, tHand, 0.01).to({ x: hx + 10 }, tHand + 0.01, 0.55, "power2.inOut");
  e3y.to({ y: SLOT[1] - 120, r: -20 }, tHand + 0.01, 0.22, "power2.out").to({ y: hy - 14, r: -8 }, tHand + 0.23, 0.33, "power2.in");
  dec(tHand);
  mp(tHand + 0.5, "hold");

  // ================= j10: the same trick at Vercel: a harmful command, blocked before it runs =================
  const t10 = c("j10", "vercel") - 0.15;
  slideOut(jv, t10 - 0.1);
  [arIn, arOut].forEach((n) => tw(n, { opacity: 1 }, { opacity: 0, duration: 0.2 }, t10 - 0.1));
  const tm = panel("Terminal");
  const tvl = kit.logo(tm.b, "vercel", 36); tvl.setAttribute("transform", `translate(${PR - 18},${PY0 + 37})`);
  const tmIn = G(tm.b);
  slideIn(tm, t10 + 0.18);
  const cmd = M(tmIn, "", PX0 + 32, PY0 + 146, 44, INK);
  const verdict = M(tmIn, "jev: harmful", PX0 + 32, PY0 + 220, 44, EX.red, { opacity: 0 });
  const nextP = M(tmIn, "$", PX0 + 32, PY0 + 292, 44, INK2, { opacity: 0 });
  typeLines([cmd], ["$ rm -rf ./production"], c("j10", "uses"), c("j10", "harmful") - 0.05, 13);
  tw(verdict, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j10", "commands") - 0.03);
  const vU = scribble(tmIn, PX0 + 32, PX0 + 340, PY0 + 238, EX.red, 12);
  drawIn(vU, c("j10", "commands") + 0.12, 0.25);
  const stG = G(tmIn), stA = A(stG, { x: PX0 + PW / 2 + 40, y: PY0 + 412, r: -5, o: 0 });
  rr(stG, -200, -64, 400, 128, { stroke: EX.red, fill: dk("#f29a9a"), fillStyle: "hachure", strokeWidth: 6, fillWeight: 2.5, hachureGap: 14 });
  T(stG, "BLOCKED", 0, 24, 78, EX.red, { ...MID, "letter-spacing": 3, ...HALO, "stroke-width": 10 });
  // ink splatter around the stamp
  const spl = G(stG), SPR = rng(17);
  [[-230, -70, -262, -96], [236, -60, 270, -84], [-226, 70, -258, 98], [238, 66, 268, 96], [0, -88, 4, -122], [-60, 92, -70, 126]].forEach(([x1, y1, x2, y2]) => rline(spl, x1, y1, x2, y2, { stroke: EX.red, strokeWidth: 4, roughness: 1.4 }));
  [[-286, -20, 10], [292, 10, 12], [140, -110, 8], [-150, 118, 9], [300, -100, 7]].forEach(([x, y, r]) => el("circle", { cx: x + SPR() * 4, cy: y, r, fill: EX.red }, spl));
  const tBl = c("j10", "before") - 0.1;
  stA.to({ s: 1.6, r: -12 }, tBl - 0.02, 0.01).to({ o: 1, s: 1, r: -5 }, tBl, 0.13, "power4.in");
  tw(spl, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tBl + 0.12);
  drawIn(spl, tBl + 0.12, 0.14, "power2.out");
  // the camera takes the hit
  [[11, -7], [-9, 6], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => cam(poseB(1.0, 540, 960, 960, dx, dy), tBl + 0.13 + i * 0.045, 0.045, "none"));
  tw(nextP, { opacity: 0 }, { opacity: 1, duration: 0.01 }, c("j10", "run"));
  mp(c("j10", "harmful"), "holdO");
  mp(tBl + 0.25, "holdHappy");

  // ================= j11: a reply needs words; Jev only gives the box; the chatbot writes it =================
  const t11 = c("j11", "_start") - 0.25;
  slideOut(tm, t11);
  const rp = panel("Reply", "to Sam", 44);
  slideIn(rp, t11 + 0.14);
  const subj = T(rp.b, "Re: Wrong size, can I swap it?", PX0 + 32, PY0 + 126, 44, INK2, { opacity: 0 });
  rline(rp.b, PX0 + 30, PY0 + 156, PX0 + PW - 30, PY0 + 156, { strokeWidth: 2.5, roughness: 0.8 });
  e3x.to({ x: PX0 + 120 }, t11 + 0.3, 0.45, "power2.inOut").to({ o: 0 }, t11 + 0.75, 0.01);
  e3y.to({ y: PY0 + 150, r: 6 }, t11 + 0.3, 0.2, "power2.out").to({ y: PY0 + 250, r: 0 }, t11 + 0.5, 0.25, "power2.in");
  tw(subj, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t11 + 0.75);
  typeOn(subj, t11 + 0.75, 0.3);
  mp(t11 + 0.35, "calm");
  // the cursor clicks into the reply body
  const tC2 = t11 + 0.95;
  curA.to({ x: 1040, y: 1250 }, tC2 - 0.7, 0.01).to({ o: 1 }, tC2 - 0.6, 0.01).to({ x: PX0 + 70, y: PY0 + 210 }, tC2 - 0.58, 0.5, "back.out(1.2)");
  click(PX0 + 70, PY0 + 210, tC2);
  curA.to({ x: 1040, y: 1230 }, tC2 + 0.3, 0.5, "power2.inOut").to({ o: 0 }, tC2 + 0.82, 0.1);
  const caret2 = el("rect", { x: PX0 + 32, y: PY0 + 182, width: 5, height: 50, fill: INK, opacity: 0 }, rp.b);
  const tCh = c("j11", "chatbot") - 0.05;
  blink(caret2, tC2 + 0.05, tCh);
  const jvOut = G(rp.b, { opacity: 0 });
  rr(jvOut, PX0 + 30, PY0 + 446, PW - 60, 72, { stroke: EX.blue, fill: dk("#74b9f0"), fillStyle: "hachure", strokeWidth: 3, fillWeight: 2, hachureGap: 13 });
  M(jvOut, "jev:", PX0 + 52, PY0 + 497, 44, EX.blue, HALO);
  M(jvOut, "box \"refund\"", PX0 + 176, PY0 + 497, 44, INK, HALO);
  tw(jvOut, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.24, ease: "expo.out" }, c("j11", "replies") - 0.1);
  mp(c("j11", "though") - 0.05, "shrug");
  const RP = ["Hi Sam! Sure thing.", "Here's a free return label,", "and your new size ships", "today."];
  const rpEls = RP.map((_, i) => T(rp.b, "", PX0 + 32, PY0 + 222 + i * 58, 44));
  typeLines(rpEls, RP, tCh, c("j12", "decides") + 0.2, 21);
  mp(tCh, "stand");

  // ================= j12: callback: the chatbot keeps writing while Jev sorts the inbox into the trays =================
  const t12 = c("j12", "so") - 0.05;
  cam(poseB(0.95, 540, 760, 770), t12, 0.8, "expo.inOut");
  rp.a.to({ s: 0.85, x: 1010 * 0.15, y: PY0 * 0.15 }, t12 + 0.1, 0.5, "expo.inOut");
  const pill = G(FLY), PLX = 900, PLY = 1165, pillA = A(pill, { x: PLX, y: PLY, o: 0 });
  rr(pill, -80, -40, 160, 80, { stroke: EX.blue, fill: EX.blueF, fillStyle: "solid", strokeWidth: 3.5 });
  T(pill, "Jev", 0, 16, 48, INK, MID);
  const tJ = c("j12", "and") - 0.08;
  pillA.to({ s: 1.15 }, 0, 0.01).to({ o: 1 }, tJ, 0.01).to({ s: 1 }, tJ + 0.04, 0.22, "back.out(2)");
  const gaps = [0.02, 0.15, 0.26, 0.42, 0.52, 0.66, 0.8], toT = [2, 1, 1, 0, 1, 0, 2];
  gaps.forEach((g, i) => {
    const t = tJ + 0.08 + g; popTop(t, 0.055, 0); dec(t);
    drop(toT[i], PLX, PLY, t, t + 0.46, 0.5, 45);
    pillA.to({ s: 1.08 }, t, 0.04, "power2.out").to({ s: 1 }, t + 0.04, 0.08, "power2.in");
  });
  mp(t12 + 0.2, "relax");
  mp(c("j12", "decides"), "relax2");

  // ================= j12b: the offer. The camera moves on to a fresh corner of the board: Cyndra's card =================
  const BXC = 2600;   // board C: right of Maya's desk on the same canvas
  const poseC = (s, fx = 540, fy = 960, sy = 960) => { const p = pose(s, fx + BXC, fy, sy); return { s, x: p.x, y: p.y }; };
  const BC = G(D, { transform: `translate(${BXC},0)` });
  const CW = G(BC), CMA = G(BC), CNO = G(BC), CCU = G(BC);
  const t13 = c("j12b", "_start");
  cam(poseC(1.12, 530, 960, 960), t13 - 0.42, 0.14, "power2.out");   // a small pull the other way, then the move
  cam(poseC(1.0), t13 - 0.28, 0.5, "expo.inOut");
  // Maya on this part of the board: unsure, then happy (her poses, boiling like everything else)
  const mayaC = (P, vis) => { const g = G(CMA, { opacity: vis ? 1 : 0 }); g.setAttribute("transform", `translate(200,${HIP})`); boil([0, 1, 2].map(() => drawPose(g, P))); return g; };
  const mUnsure = mayaC(POSE.skeptic, 1), mHappy = mayaC(POSE.wave, 0);
  const groundC = rline(CMA, 60, 1362, 1020, 1362, { strokeWidth: 3, roughness: 1.2 });
  const tHappy = c("j12b", "take") - 0.05;
  tw(mUnsure, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tHappy);
  tw(mHappy, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tHappy);
  // "not sure": a question scrawled beside her head
  const q = note(CNO, ["how does", "Jev fit?"], 320, 1060, 50, EX.violet, c("j12b", "not") + 0.05, { rot: -3, cps: 26 });
  drawIn(arrow(CNO, 310, 1120, 268, 1060, { stroke: EX.violet, strokeWidth: 3 }, -0.25), q._end, 0.22);
  // the card: Cyndra's mark, its address, a "Book a call" button
  const CX0 = 160, CY0 = 300, CWD = 760, CHT = 600;
  const ccard = win(CW, CX0, CY0, CWD, CHT, 72);
  const tCard = c("j12b", "_start") + 0.05;
  drawIn(ccard, tCard, 0.5);
  const cb2 = G(CW, { opacity: 0 });
  op(cb2, 0, 1, tCard + 0.25, 0.01);
  const lgG = G(cb2), lgA = A(lgG, { x: 540, y: CY0 + 190, s: 0.6, o: 0 });
  kit.logo(lgG, "cyndra", 132);
  lgA.to({ o: 1, s: 1 }, tCard + 0.3, 0.4, "back.out(1.7)");
  const site = T(cb2, "cyndra.ai", 540, CY0 + 360, 96, INK, MID);
  typeOn(site, c("j12b", "book") - 0.25, 0.45);
  drawIn(scribble(cb2, 360, 720, CY0 + 386, EX.blue, 21), c("j12b", "cindra") - 0.02, 0.32);
  const btG = G(cb2), btA = A(btG, { x: 540, y: CY0 + 490, o: 0 });
  const btn = rr(btG, -200, -54, 400, 108, { stroke: EX.blue, fill: dk("#74b9f0"), fillStyle: "hachure", strokeWidth: 4, fillWeight: 2, hachureGap: 13 });
  T(btG, "Book a call", 0, 18, 56, EX.blue, { ...MID, ...HALO });
  const tBtn = c("j12b", "book") - 0.05;
  btA.to({ o: 1 }, tBtn, 0.01);
  drawIn(btn, tBtn, 0.4);
  // the cursor comes in and clicks it; the button presses
  const tClkC = c("j12b", "call") + 0.06;
  const ccG = G(CCU), ccA = A(ccG, { x: 1000, y: 1250, o: 0 });
  rpath(ccG, "M0 0 L0 48 L12 37 L21 57 L30 53 L21 33 L37 33 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.2, roughness: 0.7 });
  ccA.to({ o: 1 }, tClkC - 0.62, 0.01).to({ x: 600, y: CY0 + 500 }, tClkC - 0.6, 0.55, "back.out(1.2)");
  ccA.to({ s: 0.84 }, tClkC, 0.06, "power2.in").to({ s: 1 }, tClkC + 0.06, 0.12, "back.out(3)");
  btA.to({ s: 0.93 }, tClkC, 0.06, "power2.in").to({ s: 1 }, tClkC + 0.06, 0.2, "back.out(3)");
  const crg = G(CCU), cra = A(crg, { x: 600, y: CY0 + 500, s: 0.3, o: 0 });
  rell(crg, 0, 0, 80, 80, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.2 });
  cra.to({ o: 1 }, tClkC + 0.02, 0.01).to({ s: 1.3, o: 0 }, tClkC + 0.03, 0.42, "power2.out");
  ccA.to({ x: 980, y: 1240 }, tClkC + 0.5, 0.5, "power2.inOut").to({ o: 0 }, tClkC + 1.0, 0.1);
  // "we'll take it from there": a little calendar on the desk gets its check
  const calG = G(CW), calX = 820, calY = 1150;
  const cal = G(calG);
  rr(cal, calX - 90, calY - 80, 180, 170, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  rline(cal, calX - 80, calY - 36, calX + 80, calY - 36, { strokeWidth: 2.5, roughness: 0.8 });
  [-40, 40].forEach((dx) => rline(cal, calX + dx, calY - 100, calX + dx, calY - 64, { strokeWidth: 4, roughness: 0.8 }));
  const tCal = c("j12b", "and") - 0.1;
  drawIn(cal, tCal, 0.4);
  const chk = rpath(calG, `M${calX - 44} ${calY + 22} L${calX - 10} ${calY + 56} L${calX + 52} ${calY - 12}`, { stroke: EX.green, strokeWidth: 7, roughness: 0.9 });
  drawIn(chk, c("j12b", "take") + 0.02, 0.28);
  [groundC].forEach((n) => drawIn(n, t13 - 0.1, 0.4));

  // ---------- the boil clock: one time-driven update shows one variant of every shape, and Maya's current pose ----------
  MAYA.keys.sort((a, b) => a[0] - b[0]);
  const names = Object.keys(MAYA.poses);
  const boilAt = (v) => {
    const k = Math.max(0, Math.floor(v / BOIL_DT));
    for (const it of BOIL) {
      const i = (k + it.ph) % 3;
      if (i !== it.cur) { it.vars[it.cur].setAttribute("visibility", "hidden"); it.vars[i].setAttribute("visibility", "visible"); it.cur = i; }
    }
    let act = MAYA.keys[0][1];
    for (const [t, n] of MAYA.keys) { if (t <= v) act = n; else break; }
    const key = act + ":" + (k % 3);
    if (key !== MAYA.cur) {
      names.forEach((n) => MAYA.poses[n].forEach((g, j) => g.setAttribute("visibility", n === act && j === k % 3 ? "visible" : "hidden")));
      MAYA.cur = key;
    }
  };
  const END_T = c("j13", "_end") + 4;
  const clock = { v: 0 };
  B.fromTo(clock, { v: 0 }, { v: END_T, duration: END_T, ease: "none", immediateRender: false, onUpdate: () => boilAt(clock.v) }, 0);
  boilAt(0);

  const CA = A(CAM, { x: 0, y: 0, s: 1 });
  camQ.sort((a, b) => a[0] - b[0]).forEach(([t, p, dur, ease]) => CA.to(p, t, dur, ease));
  return {};
}
