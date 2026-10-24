// "Valor, the AI engineer" (story, Excalidraw DARK look, same runtime and look as the Jev reel).
// One continuous Excalidraw board, three places on it:
//   board A (x 0-1080): the hook (six client chats ping one engineer, who turns out to be a robot), Valor's accounts and his
//   four Macs. The callback (all six ticked) and the address are drawn fresh on A2, at the same place.
//   board B (1300 px right): Valor's desk (his laptop, "the Pirate") and, later, Tom in his chair with a coffee.
//   the screen world: a full board drawn INSIDE board B's laptop screen at 1/12.8 scale. The camera dives into the screen
//   (s 1 -> 12.8 around a fixed focal point) and the world shows 1:1; the plan / critique / build / test / ship montage and the
//   "simpler way" beat happen in there; the camera pulls back out to reveal Tom.
// Every shape is rough.js (roughness 1) with fixed seeds, in three seeded variants that "boil" (swap) every 0.14 s from a
// time-driven update (seek-safe). On "freezes" the boil clock stops, so the whole board goes still. Figures (Valor, the human
// head he has for 3 s, Tom, the red critic) are rough.js drawings too, one boiling drawing per pose, switched pose to pose.
// Colours: dk() (excal_theme.js) is Excalidraw's dark-mode filter. blue = Valor, violet = Tom / decisions, green = done,
// red = the critic, problems and STOP, yellow = sticky notes. The chat contents, plan, code, tests and the settings-pages request
// are illustrative; the companies, Mac names and one-Mac-per-client come from the Valor repo (see lines.py).
function scene({ svg, defs, D, CAM, B, cue, kit, K, el, txt, rng }) {
  const c = cue;
  const A = kit.actor;
  // guarded actor: each to() starts no earlier than the previous one ends (overlapping to() calls fight)
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
  const MID = { "text-anchor": "middle" };
  const HALO = { stroke: PAPER, "stroke-width": 8, "paint-order": "stroke" };

  // ---------- boiling ----------
  const BOIL = [], BOIL_DT = 0.14;
  const boil = (vars) => { vars.forEach((v, i) => v.setAttribute("visibility", i ? "hidden" : "visible")); BOIL.push({ vars, cur: 0, ph: BOIL.length % 3 }); };
  const FIGS = [];

  // ---------- rough.js: Excalidraw's drawing ----------
  const rc = rough.svg(svg);
  let SEED = 301;
  const RO = (o = {}) => {
    const sw = o.strokeWidth || 3.5;
    return { roughness: 1, bowing: 1, stroke: INK, strokeWidth: sw, fillWeight: sw / 2, hachureGap: sw * 4, hachureAngle: -41, preserveVertices: true, seed: SEED++, ...o };
  };
  const put = (p, n) => (p.appendChild(n), n);
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
  const rr = (p, x, y, w, h, o = {}) => mk(p, (op_) => rc.path(rrD(x, y, w, h, Math.min(32, Math.min(w, h) * 0.25)), op_), o);
  const rline = (p, x1, y1, x2, y2, o = {}) => mk(p, (op_) => rc.line(x1, y1, x2, y2, op_), o);
  const rpath = (p, d, o = {}) => mk(p, (op_) => rc.path(d, op_), o);
  const rell = (p, cx, cy, w, h, o = {}) => mk(p, (op_) => rc.ellipse(cx, cy, w, h, op_), o);
  const arrow = (p, x1, y1, x2, y2, o = {}, bend = 0) => {
    const g = G(p);
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    rpath(g, `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, o);
    const a = Math.atan2(y2 - my, x2 - mx), L = 30, s = 0.48;
    rpath(G(g, { "data-head": 1 }), `M${x2 - L * Math.cos(a - s)} ${y2 - L * Math.sin(a - s)} L${x2} ${y2} L${x2 - L * Math.cos(a + s)} ${y2 - L * Math.sin(a + s)}`, o);
    return g;
  };
  // draw a rough group on like a hand: outlines trace, then hachure sweeps in, solid fills fade in; arrow heads land last
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
  // typing with a human cadence, spread over [t0, t1] across several lines
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
  };
  const typeOn = (t, at, dur = 0.3) => { const s = t.textContent; t.textContent = ""; kit.counter(t, 0, s.length, at, dur, (v) => s.slice(0, Math.round(v)), "none"); };
  // a handwritten note: each line writes on in turn
  const note = (p, lines, x, y, size, col, t, { lh = size * 1.32, cps = 24, anchor = "start", rot = 0 } = {}) => {
    const g = G(p, { opacity: 0 });
    if (rot) g.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
    let at = t;
    lines.forEach((L, i) => { const e = T(g, L, x, y + i * lh, size, col, { "text-anchor": anchor }); const d = L.length / cps; typeOn(e, at, d); at += d + 0.04; });
    tw(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t);
    g._end = at;
    return g;
  };
  const scribble = (p, x1, x2, y, col, seed = 1) => {
    const R = rng(seed), pts = [];
    for (let x = x1, i = 0; x <= x2; x += 26, i++) pts.push(`${x.toFixed(1)} ${(y + (i % 2 ? 7 : -3) + R() * 3).toFixed(1)}`);
    return rpath(p, "M" + pts.join(" L"), { stroke: col, strokeWidth: 4, roughness: 1.3 });
  };
  // a big hand-written headline across the top of a board (the words layer of the hook: picture, voice, words agree)
  const headline = (p, s, t0, t1, col = INK, size = 96, y = 350, cps = 26) => {
    const g = G(p, { opacity: 0 });
    const e = T(g, s, 0, y, size, col);
    const w = e.getComputedTextLength();
    e.setAttribute("x", 540 - w / 2);
    typeOn(e, t0, s.length / cps);
    tw(g, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t0);
    if (t1) tw(g, { opacity: 1, y: 0 }, { opacity: 0, y: -18, duration: 0.16, ease: "power2.in" }, t1);
    return g;
  };
  // ink splatter around a slammed stamp
  const splat = (p, rx, ry, col, seed) => {
    const g = G(p, { opacity: 0 }), R = rng(seed);
    [[-1, -1], [1, -0.8], [-1, 0.9], [1, 1], [0.1, -1.2], [-0.3, 1.25]].forEach(([dx, dy]) => {
      const x1 = dx * rx, y1 = dy * ry;
      rline(g, x1, y1, x1 * 1.15 + R() * 6, y1 * 1.3, { stroke: col, strokeWidth: 4, roughness: 1.4 });
    });
    [[-1.25, -0.2, 10], [1.28, 0.1, 12], [0.6, -1.4, 8], [-0.6, 1.45, 9]].forEach(([dx, dy, r]) => el("circle", { cx: dx * rx, cy: dy * ry, r, fill: col }, g));
    return g;
  };

  // ---------- figures: rough.js stick figures, one boiling drawing per pose ----------
  const R2D = Math.PI / 180;
  const limb = (x, y, [a1, a2], L1, L2) => { const ex = x + Math.sin(a1 * R2D) * L1, ey = y + Math.cos(a1 * R2D) * L1; return [[x, y], [ex, ey], [ex + Math.sin(a2 * R2D) * L2, ey + Math.cos(a2 * R2D) * L2]]; };
  const pl = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const MOUTH = { smile: "M-14 12 Q0 25 14 12", big: "M-17 8 Q0 34 17 8 Z", frown: "M-13 22 Q0 11 13 22", flat: "M-12 16 L12 16" };
  // head kinds: "robot" (Valor and the critic: a boxy head with an antenna), "human" (the engineer before the reveal), "tom"
  const drawPose = (p, P, kind, col = INK) => {
    const g = G(p);
    const o = { strokeWidth: 5.5, roughness: 1.1, boil: false, stroke: col };
    const eye = col === INK ? EX.blue : col;
    rpath(g, pl(limb(0, 0, P.ll, 84, 84)), o);
    rpath(g, pl(limb(0, 0, P.rl, 84, 84)), o);
    const up = G(g, { transform: `rotate(${P.lean || 0})` });
    rline(up, 0, 0, 0, -150, o);
    rpath(up, pl(limb(0, -128, P.la, 72, 66)), o);
    rpath(up, pl(limb(0, -128, P.ra, 72, 66)), o);
    const [hx, hy2] = limb(0, -128, P.ra, 72, 66)[2];
    if (P.mug) {   // a coffee mug in the right hand
      rr(up, hx - 18, hy2 - 34, 36, 40, { ...o, strokeWidth: 3.5, fill: dk("#a18072"), fillStyle: "solid" });
      rpath(up, `M${hx + 18} ${hy2 - 24} Q${hx + 34} ${hy2 - 16} ${hx + 18} ${hy2 - 6}`, { ...o, strokeWidth: 3.5 });
    }
    if (P.pen) rline(up, hx - 6, hy2 + 10, hx + 24, hy2 - 46, { ...o, stroke: EX.red, strokeWidth: 8 });   // the critic's red pen
    const hd = G(up, { transform: `rotate(${P.tilt || 0} 0 -150)` });
    const hy = -194, lk = (P.look || 0) * 6;
    if (kind === "robot") {
      rline(hd, 0, hy - 44, 2, hy - 78, { ...o, strokeWidth: 4.5 });
      rell(hd, 2, hy - 86, 20, 20, { ...o, strokeWidth: 4, fill: eye, fillStyle: "solid" });
      rr(hd, -52, hy - 44, 104, 90, { ...o, fill: PAPER, fillStyle: "solid" });
      [-20, 20].forEach((ex) => el("circle", { cx: ex + lk, cy: hy - 8, r: 7.5, fill: eye }, hd));
      if (P.brow) { rline(hd, -36 + lk, hy - 32, -10 + lk, hy - 22, { ...o, strokeWidth: 4 }); rline(hd, 10 + lk, hy - 22, 36 + lk, hy - 32, { ...o, strokeWidth: 4 }); }
    } else {
      rell(hd, 0, hy, 86, 86, { ...o, fill: PAPER, fillStyle: "solid" });
      if (kind === "human") rpath(hd, `M-40 ${hy - 14} Q-30 ${hy - 50} 0 ${hy - 46} Q30 ${hy - 50} 40 ${hy - 14}`, { ...o, strokeWidth: 5 });
      if (kind === "tom") rpath(hd, `M-34 ${hy - 26} L-26 ${hy - 54} L-14 ${hy - 36} L-4 ${hy - 60} L8 ${hy - 38} L20 ${hy - 58} L28 ${hy - 32}`, { ...o, strokeWidth: 4.5 });
      [-14, 14].forEach((ex) => el("circle", { cx: ex + lk, cy: hy - 6, r: 5, fill: col }, hd));
    }
    const my = kind === "robot" ? hy + 6 : hy;
    if (P.m === "o") rell(hd, lk, my + 18, 16, 18, { ...o, strokeWidth: 3.5, roughness: 0.5 });
    else rpath(G(hd, { transform: `translate(${lk},${my})` }), MOUTH[P.m], { ...o, strokeWidth: 4, roughness: 0.5 });
    return g;
  };
  // a figure: every pose drawn 3 times (boil variants); keys pick the pose over time
  const figure = (p, poses, kind, x, ground, s = 1, col = INK) => {
    const g = G(p), hip = ground - 167 * s;
    const a = A(g, { x, y: hip, s, o: 1 });
    const Fg = { poses: {}, keys: [], cur: null, a, g, hip, s, x };
    Object.entries(poses).forEach(([name, P]) => {
      const k = P.kind || kind;
      Fg.poses[name] = [0, 1, 2].map(() => { const d = drawPose(g, P, k, col); d.setAttribute("visibility", "hidden"); return d; });
    });
    Fg.key = (t, name) => Fg.keys.push([t, name]);
    Fg.hand = (name) => { const P = poses[name], h = limb(0, -128, P.ra, 72, 66)[2], an = (P.lean || 0) * R2D; return [Fg.x + (h[0] * Math.cos(an) - h[1] * Math.sin(an)) * s, hip + (h[0] * Math.sin(an) + h[1] * Math.cos(an)) * s]; };
    FIGS.push(Fg);
    return Fg;
  };
  const VP = {
    stand: { la: [-16, -8], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    walk1: { la: [24, 12], ra: [-20, -8], ll: [-16, -30], rl: [20, 10], m: "smile", look: -1 },
    walk2: { la: [-20, -8], ra: [24, 12], ll: [20, 10], rl: [-16, -30], m: "smile", look: -1 },
    point: { la: [-16, -8], ra: [80, 76], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    pointUp: { la: [-16, -8], ra: [128, 140], ll: [-9, -4], rl: [9, 4], m: "big", look: 1 },
    type: { la: [52, 100], ra: [62, 104], ll: [-9, -4], rl: [9, 4], m: "flat", look: 1 },
    type2: { la: [58, 96], ra: [56, 108], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    wave: { la: [-16, -8], ra: [142, 168], ll: [-9, -4], rl: [9, 4], m: "big", look: 0.3 },
    cheer: { la: [-148, -170], ra: [148, 170], ll: [-12, -6], rl: [12, 6], m: "big", look: 0.2 },
    proud: { la: [-48, 42], ra: [48, -42], ll: [-11, -5], rl: [11, 5], m: "big", look: 0.5, tilt: -6 },
    oops: { la: [-62, -142], ra: [62, 142], ll: [-9, -4], rl: [9, 4], m: "o", look: 1 },
    freeze: { la: [-34, -20], ra: [44, 70], ll: [-9, -4], rl: [9, 4], m: "o", look: 1 },
  };
  const humanP = { htype: { ...VP.type, kind: "human", m: "smile" }, htype2: { ...VP.type2, kind: "human" } };
  // Valor's name tag on his chest (outside the pose drawings, so it stays put)
  const tag = (Fg) => {
    const g = G(Fg.g, { opacity: 0 }), fs = Math.ceil(36 / Fg.s);
    rr(g, -62 * fs / 36, -116, 124 * fs / 36, 50, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 3 });
    T(g, "Valor", 0, -79, fs, INK, MID);
    return g;
  };

  // ---------- small props ----------
  const win = (p, x, y, w, h, bar = 72, dots = true) => {
    const g = G(p);
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid" });
    if (bar) rline(g, x + 14, y + bar, x + w - 14, y + bar, { strokeWidth: 2.5, roughness: 0.8 });
    if (bar && dots) [0, 1, 2].forEach((i) => rell(g, x + 36 + i * 26, y + bar / 2, 15, 15, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
    return g;
  };
  // a laptop: the screen top-left at (x, y), w wide and 0.625 w high, a base below
  const laptop = (p, x, y, w = 300) => {
    const g = G(p), h = w * 0.625;
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
    rpath(g, `M${x - 22} ${y + h + 4} L${x + w + 22} ${y + h + 4} L${x + w + 6} ${y + h + 26} L${x - 6} ${y + h + 26} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
    return g;
  };
  const GOLD = dk("#f08c00"), GOLDF = dk("#f5c84c"), BROWN = dk("#8a5a2b"), TAN = dk("#c08a5a");
  // a laptop's face (on the screen) and its doodle: pirate (eye patch), cowboy (hat), bald (shine), captain (cap)
  const macFace = (p, x, y, w, kind) => {
    const face = G(p), hat = G(p), h = w * 0.625, cx = x + w / 2, cy = y + h / 2 + 10, sc = w / 300;
    const eL = [cx - 42 * sc, cy - 16 * sc], eR = [cx + 42 * sc, cy - 16 * sc];
    if (kind === "pirate") {
      rell(face, eL[0], eL[1], 46 * sc, 38 * sc, { fill: INK, fillStyle: "solid", strokeWidth: 3 });
      rline(face, x + 14 * sc, y + 34 * sc, x + w - 20 * sc, y + 14 * sc, { strokeWidth: 3 });
      el("circle", { cx: eR[0], cy: eR[1], r: 8 * sc, fill: INK }, face);
    } else {
      [eL, eR].forEach(([ex, ey]) => el("circle", { cx: ex, cy: ey, r: 8 * sc, fill: INK }, face));
    }
    rpath(face, `M${cx - 34 * sc} ${cy + 22 * sc} Q${cx} ${cy + 52 * sc} ${cx + 34 * sc} ${cy + 22 * sc}`, { strokeWidth: 3.5 });
    if (kind === "cowboy") {
      rpath(hat, `M${cx - 70 * sc} ${y - 4 * sc} Q${cx - 74 * sc} ${y - 80 * sc} ${cx - 20 * sc} ${y - 74 * sc} Q${cx} ${y - 56 * sc} ${cx + 20 * sc} ${y - 74 * sc} Q${cx + 74 * sc} ${y - 80 * sc} ${cx + 70 * sc} ${y - 4 * sc} Z`,
        { fill: TAN, fillStyle: "hachure", stroke: BROWN, strokeWidth: 3.5 });
      rell(hat, cx, y + 2 * sc, 260 * sc, 34 * sc, { fill: TAN, fillStyle: "solid", stroke: BROWN, strokeWidth: 3.5 });
    }
    if (kind === "bald") {
      rpath(hat, `M${x + 20 * sc} ${y - 14 * sc} L${x + 4 * sc} ${y - 40 * sc} M${cx} ${y - 18 * sc} L${cx} ${y - 50 * sc} M${x + w - 20 * sc} ${y - 14 * sc} L${x + w - 4 * sc} ${y - 40 * sc}`, { stroke: GOLD, strokeWidth: 4 });
      rpath(hat, `M${x + 34 * sc} ${y + 44 * sc} Q${x + 46 * sc} ${y + 22 * sc} ${x + 74 * sc} ${y + 18 * sc}`, { stroke: GOLD, strokeWidth: 4 });
    }
    if (kind === "captain") {
      rpath(hat, `M${cx - 96 * sc} ${y - 6 * sc} L${cx - 100 * sc} ${y - 60 * sc} Q${cx} ${y - 98 * sc} ${cx + 100 * sc} ${y - 60 * sc} L${cx + 96 * sc} ${y - 6 * sc} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
      rpath(hat, `M${cx - 116 * sc} ${y + 6 * sc} Q${cx} ${y - 22 * sc} ${cx + 116 * sc} ${y + 6 * sc} Z`, { fill: INK, fillStyle: "solid", strokeWidth: 3 });
      rell(hat, cx, y - 46 * sc, 36 * sc, 32 * sc, { stroke: GOLD, fill: GOLDF, fillStyle: "solid", strokeWidth: 3 });
    }
    return { face, hat };
  };
  const MACS = [["pirate", "the Pirate"], ["cowboy", "the Cowboy"], ["bald", "the Bald"], ["captain", "the Captain"]];

  // ---------- camera: queued, applied in time order at the end ----------
  const camQ = [];
  const BXB = 1300;
  const pose = (s, fx = 540, fy = 960, sy = 960) => ({ s, x: 540 - s * fx, y: sy - s * fy });
  const cam = (p, t, dur, ease) => camQ.push([t, p, dur, ease]);
  const FB = [BXB + 540, 953.75];                 // board B's focal point: the centre of Valor's laptop screen
  const poseB = (s, dx = 0, dy = 0, sy = 960) => { const p = pose(s, FB[0], FB[1], sy); return { s, x: p.x + dx, y: p.y + dy }; };
  const BS = 1.15, BSY = 900;                     // board B's framing after the dive: closer, a little higher
  const S = 12.8, F = 1 / S;                      // the dive: the screen world is drawn at 1/S inside the screen

  // ---------- the board ----------
  const BA = G(D), BBB = G(D, { transform: `translate(${BXB},0)` }), A2 = G(D);
  const A1 = G(BA), A1H = G(BA), A1F = G(BA), A1N = G(BA);
  const BDESK = G(BBB), BTOM = G(BBB), BFIG = G(BBB), BWIN = G(BBB), BPILE = G(BBB), BFLY = G(BBB), BHEAD = G(BBB), BFX = G(BBB);
  const WORLD = G(D, { transform: `translate(${FB[0] - 540 * F},${FB[1] - 960 * F}) scale(${F})` });
  const WBG = G(WORLD), WCH = G(WORLD), W1 = G(WORLD), W2 = G(WORLD), WFX = G(WORLD);

  // =============== board A, v1: six client chats ping one engineer ===============
  const CH = ["Client A", "Client B", "Client C", "Client D", "Client E", "Client F"];
  const CW = 440, CHH = 150, CX = [70, 570], CY = [430, 600, 770];
  const chatWin = (p, i) => {
    const x = CX[i % 2], y = CY[Math.floor(i / 2)];
    const g = G(p), inner = G(g);
    win(inner, x, y, CW, CHH, 58, false);
    T(inner, CH[i], x + 28, y + 42, 40);
    T(inner, "new task", x + 28, y + 118, 40, INK2);
    [0, 1, 2].forEach((k) => el("circle", { cx: x + 210 + k * 24, cy: y + 106, r: 6, fill: INK2 }, inner));
    const bdg = G(g, { opacity: 0 }), bdA = A(bdg, { x: x + CW - 44, y: y + 100, s: 0.4 });
    rell(bdg, 0, 0, 58, 58, { stroke: EX.red, fill: EX.redF, fillStyle: "solid", strokeWidth: 3.5 });
    T(bdg, "1", 0, 14, 40, INK, MID);
    const okg = G(g, { opacity: 0 }), okA = A(okg, { x: x + CW - 44, y: y + 100, s: 0.4 });
    rell(okg, 0, 0, 58, 58, { stroke: EX.green, fill: EX.greenF, fillStyle: "solid", strokeWidth: 3.5 });
    rpath(okg, "M-15 1 L-4 13 L16 -12", { stroke: EX.green, strokeWidth: 5.5, roughness: 0.6 });
    return { g, inner, bdg, bdA, okg, okA, x, y, cx: x + CW / 2 };
  };
  const chats = CH.map((_, i) => chatWin(A1, i));
  const chA = chats.map((ch, i) => A(ch.g, { x: 0, y: 0, s: i < 2 ? 1 : 0.86, o: i < 2 ? 1 : 0 }));
  const tPing = [0, 0.22, 0.52, 0.8, 1.08, 1.32];
  // the engineer at his desk
  const desk = G(A1);
  rline(desk, 610, 1242, 960, 1242, { strokeWidth: 4 });
  rline(desk, 640, 1242, 646, 1362, { strokeWidth: 3.5 });
  rline(desk, 930, 1242, 924, 1362, { strokeWidth: 3.5 });
  laptop(desk, 680, 1104, 190);
  rline(A1, 60, 1362, 1020, 1362, { strokeWidth: 3, roughness: 1.2 });
  const v1 = figure(A1F, { ...humanP, ...VP }, "robot", 470, 1362, 1.0);
  const v1tag = tag(v1);
  chats.forEach((ch, i) => {
    const t = tPing[i];
    if (i >= 2) chA[i].to({ s: 1, o: 1 }, t, 0.24, "back.out(1.8)");
    ch.bdA.to({ s: 1 }, t + 0.06, 0.24, "back.out(2.4)");
    tw(ch.bdg, { opacity: 0 }, { opacity: 1, duration: 0.01 }, t + 0.06);
    // a ping line from the chat to the engineer, gone in a blink
    const pg = G(A1N);
    const ln = rline(pg, ch.cx, ch.y + CHH + 6, 470 + (i % 2 ? 30 : -30), 950, { stroke: EX.red, strokeWidth: 3, strokeLineDash: [10, 12], roughness: 0.7 });
    drawIn(ln, t + 0.08, 0.2);
    tw(pg, { opacity: 1 }, { opacity: 0, duration: 0.25 }, t + 0.36);
    tw(ch.inner, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: i % 2 ? 1.6 : -1.6, duration: 0.06, yoyo: true, repeat: 3, ease: "sine.inOut" }, t + 0.06);
  });
  // "at once": every badge pulses together
  chats.forEach((ch) => ch.bdA.to({ s: 1.3 }, c("v1", "once") - 0.05, 0.08, "power2.out").to({ s: 1 }, c("v1", "once") + 0.03, 0.18, "back.out(2)"));
  v1.key(0, "htype"); [0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4].forEach((t, i) => v1.key(t, i % 2 ? "htype" : "htype2"));
  // "not human": a red scribble over the head; under it, the robot head
  const scrG = G(A1N);
  const R0 = rng(41), sp = [];
  for (let i = 0; i < 9; i++) sp.push(`${(430 + R0() * 80).toFixed(1)} ${(950 + i * 12 + R0() * 6).toFixed(1)}`);
  const scr = rpath(scrG, "M" + sp.join(" L") + " L512 1050 L428 958", { stroke: EX.red, strokeWidth: 6, roughness: 1.8 });
  drawIn(scr, c("v1", "not") - 0.06, 0.24);
  v1.key(c("v1", "human") - 0.02, "point");
  tw(scrG, { opacity: 1 }, { opacity: 0, duration: 0.12 }, c("v1", "human") + 0.04);
  headline(A1H, "6 companies", c("v1", "six") - 0.04, c("v1", "hes") - 0.22);
  headline(A1H, "NOT human", c("v1", "hes") + 0.02, c("v2", "valor") - 0.25, EX.red, 104);
  // the camera creeps from frame one, then a jolt on the reveal
  cam(pose(1.0), 0, 0.01, "none");
  cam(pose(1.05, 540, 820, 820), 0.02, c("v1", "hes") - 0.1, "sine.inOut");
  [[9, -6], [-7, 5], [4, -3], [0, 0]].forEach(([dx, dy], i) => { const p = pose(1.05, 540, 820, 820); cam({ s: 1.05, x: p.x + dx, y: p.y + dy }, c("v1", "human") + 0.04 + i * 0.045, 0.045, "none"); });

  // =============== v2: his name, his accounts, his four Macs ===============
  const t2 = c("v2", "_start");
  cam(pose(1.0), t2 - 0.05, 0.5, "expo.out");
  chats.forEach((ch, i) => chA[i].to({ y: -560 - (i % 3) * 40, s: 0.9, o: 0 }, t2 - 0.08 + (i % 3) * 0.05 + (i > 2 ? 0.04 : 0), 0.32, "power3.in"));
  op(desk, 1, 0, t2, 0.2);
  const tWk = t2 + 0.2;
  v1.a.to({ x: 190 }, tWk, 0.66, "power2.inOut");
  [0, 1, 2, 3].forEach((i) => v1.key(tWk + i * 0.165, i % 2 ? "walk2" : "walk1"));
  v1.key(tWk + 0.66, "stand");
  tw(v1tag, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.2, ease: "expo.out" }, c("v2", "valor") - 0.02);
  headline(A1H, "Valor", c("v2", "valor") - 0.05, c("v2", "max") - 0.2, EX.blue, 120);
  cam(pose(1.55, 250, 1060, 1010), c("v2", "valor") - 0.12, 0.45, "expo.out");
  cam(pose(1.0), c("v2", "email") - 0.42, 0.42, "expo.inOut");
  const nameRing = rell(A1N, 190, 1104, 172, 78, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.4 });
  drawIn(nameRing, c("v2", "valor") + 0.12, 0.3);
  tw(nameRing, { opacity: 1 }, { opacity: 0, duration: 0.2 }, c("v2", "email") - 0.2);
  // his email and his GitHub, as cards on the right
  const card2 = (y, t) => { const g = G(A1), a = A(g, { x: 60, y: 0, o: 0 }); const fr = rr(g, 380, y, 640, 150, { fill: PAPER, fillStyle: "solid" }); a.to({ o: 1, x: 0 }, t, 0.34, "expo.out"); drawIn(fr, t, 0.35); return { g, a }; };
  const em = card2(500, c("v2", "email") - 0.12);
  rr(em.g, 420, 542, 92, 66, { fill: EX.redF, fillStyle: "solid", stroke: EX.red, strokeWidth: 3 });
  rpath(em.g, "M426 548 L466 580 L506 548", { stroke: EX.red, strokeWidth: 3, roughness: 0.8 });
  T(em.g, "valor@••••••", 538, 594, 54);
  const gh = card2(690, c("v2", "github") - 0.12);
  const ghl = kit.logo(gh.g, "github", 70); ghl.setAttribute("transform", "translate(466,765)");
  T(gh.g, "@valorengels", 538, 784, 54);
  v1.key(c("v2", "email") - 0.15, "point");
  // "four Macs": the cards step away; a 2 x 2 of laptops, one per name, each with its doodle
  [em, gh].forEach((cd, i) => cd.a.to({ y: -60, o: 0 }, c("v2", "max") - 0.25 + i * 0.05, 0.24, "power2.in"));
  const MW = 300, MH = MW * 0.625, MXs = [380, 720], MYs = [520, 900];
  const macs = MACS.map(([k, label], i) => {
    const x = MXs[i % 2], y = MYs[Math.floor(i / 2)];
    const g = G(A1), a = A(g, { x: x + MW / 2, y: y + 100, s: 0.7, o: 0 });
    const inner = G(g, { transform: `translate(${-(x + MW / 2)},${-(y + 100)})` });
    const lp = laptop(inner, x, y, MW);
    const fc = G(inner, { opacity: 0 });
    const mf = macFace(fc, x, y, MW, k);
    const lb = T(inner, label, x + MW / 2, y + MH + 76, 46, INK, MID);
    return { g, a, lp, fc, mf, lb, x, y };
  });
  const tMac = [c("v2", "pirate"), c("v2", "cowboy"), c("v2", "bald"), c("v2", "captain")];
  macs.forEach((m, i) => {
    const t = tMac[i] - 0.3;
    m.a.to({ o: 1, s: 1 }, t, 0.34, "back.out(1.6)");
    drawIn(m.lp, t, 0.34);
    tw(m.fc, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.22, ease: "back.out(2)" }, tMac[i] - 0.02);
    typeOn(m.lb, tMac[i] - 0.05, 0.3);
  });
  headline(A1H, "4 Macs", c("v2", "max") - 0.1, c("v3", "each") - 0.2, INK, 104);
  v1.key(c("v2", "pirate") - 0.1, "pointUp");
  v1.key(c("v2", "captain") + 0.4, "proud");

  // =============== v3: each Mac belongs to one client; walls go up between them ===============
  const CL = ["Client E", "Client A", "Client B", "Client D"];
  const tCl = [c("v3", "belongs") - 0.12, c("v3", "to") - 0.02, c("v3", "one") + 0.04, c("v3", "client") + 0.08];
  macs.forEach((m, i) => {
    const g = G(A1), a = A(g, { x: m.x + MW / 2, y: m.y - 140, o: 0, r: i % 2 ? 6 : -6 });
    const bg = G(g);
    const tt = T(g, CL[i], 0, 14, 42, INK, MID);
    const w = tt.getComputedTextLength() + 40;
    rr(bg, -w / 2, -36, w, 72, { fill: EX.yellowF, fillStyle: "solid", stroke: dk("#e8b93a"), strokeWidth: 2.5 });
    a.to({ o: 1 }, tCl[i], 0.01).to({ y: m.y + MH / 2 + 4, r: i % 2 ? -3 : 3 }, tCl[i] + 0.01, 0.34, "back.out(1.4)");
    op(m.mf.face, 1, 0, tCl[i] + 0.2, 0.1);
  });
  headline(A1H, "1 Mac = 1 client", c("v3", "each") - 0.1, null, INK, 92);
  const wallV = rline(A1N, 700, 470, 702, 1240, { stroke: EX.red, strokeWidth: 7, roughness: 1.6 });
  const wallH = rline(A1N, 360, 812, 1040, 816, { stroke: EX.red, strokeWidth: 7, roughness: 1.6 });
  drawIn(wallV, c("v3", "never") - 0.08, 0.3);
  drawIn(wallH, c("v3", "never") + 0.12, 0.3);
  note(A1N, ["no mixing!"], 40, 1290, 50, EX.red, c("v3", "mixes") - 0.02, { rot: -5, cps: 30 });
  v1.key(c("v3", "never") - 0.1, "point");

  // =============== the whip: board A -> Valor's desk (board B) ===============
  const tWh = c("v4", "_start") - 0.18;
  cam(pose(1.0, 530), tWh - 0.16, 0.14, "power2.out");
  cam(poseB(1.0), tWh - 0.02, 0.46, "expo.inOut");
  tw(BA, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tWh + 0.6);   // board A is off screen; its callback is drawn fresh on A2

  // =============== board B: Valor's desk and his laptop, the Pirate ===============
  const LS = { x: 390, y: 860, w: 300 };   // the laptop's screen; its centre is the focal point FB
  rline(BDESK, 300, 1082, 820, 1086, { strokeWidth: 4 });
  rline(BDESK, 330, 1084, 336, 1362, { strokeWidth: 3.5 });
  rline(BDESK, 790, 1086, 784, 1362, { strokeWidth: 3.5 });
  rline(BDESK, 120, 1362, 960, 1362, { strokeWidth: 3, roughness: 1.2 });
  laptop(BDESK, LS.x, LS.y, LS.w);
  const stk = G(BDESK);
  rr(stk, 600, 1094, 176, 52, { fill: EX.yellowF, fillStyle: "solid", stroke: dk("#e8b93a"), strokeWidth: 2.5 });
  T(stk, "the Pirate", 688, 1132, 36, INK, MID);
  const vB = figure(BFIG, VP, "robot", 190, 1362, 1.0);
  tag(vB).setAttribute("opacity", 1);
  vB.key(0, "stand");
  // v4: clients message him: a Slack window and a Telegram window
  const msgWin = (x, y, logo, name, lines, t) => {
    const g = G(BWIN), a = A(g, { x: x + 230, y: y + 170, s: 0.8, o: 0 });
    const inner = G(g, { transform: `translate(${-(x + 230)},${-(y + 170)})` });
    const fr = win(inner, x, y, 460, 340, 74, false);
    const lg = kit.logo(inner, logo, 46); lg.setAttribute("transform", `translate(${x + 50},${y + 37})`);
    T(inner, name, x + 90, y + 52, 46);
    rell(inner, x + 56, y + 150, 56, 56, { stroke: EX.violet, fill: EX.violetF, fillStyle: "hachure", strokeWidth: 2.6, hachureGap: 9 });
    T(inner, "C", x + 56, y + 165, 38, INK, { ...MID, ...HALO });
    const bub = rr(inner, x + 100, y + 108, 334, 190, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5 });
    const ls = lines.map((L, i) => T(inner, L, x + 124, y + 180 + i * 64, 48));
    a.to({ o: 1, s: 1 }, t, 0.32, "back.out(1.5)");
    drawIn(fr, t, 0.3); drawIn(bub, t + 0.12, 0.25);
    typeLines(ls, lines, t + 0.18, t + 0.7, 4);
    return { g, a };
  };
  const slk = msgWin(60, 450, "slack", "Slack", ["can you fix", "checkout?"], c("v4", "slack") - 0.2);
  const tg = msgWin(560, 450, "telegram", "Telegram", ["new landing", "page?"], c("v4", "telegram") - 0.14);
  headline(BHEAD, "just message him", c("v4", "clients") - 0.02, c("v5", "then") + 0.1, INK, 88);
  // the laptop pings on "message"
  const pingB = G(BFX), pingA = A(pingB, { x: LS.x + LS.w - 6, y: LS.y + 6, s: 0.4, o: 0 });
  rell(pingB, 0, 0, 56, 56, { stroke: EX.red, fill: EX.redF, fillStyle: "solid", strokeWidth: 3.5 });
  T(pingB, "2", 0, 14, 40, INK, MID);
  pingA.to({ o: 1, s: 1 }, c("v4", "message") - 0.02, 0.24, "back.out(2.4)").to({ o: 0 }, c("v5", "does"), 0.15);
  vB.key(c("v4", "slack") - 0.1, "point");
  vB.key(c("v4", "telegram") + 0.3, "type");
  // v5: the messages step out; he gets to work; the camera dives into his screen
  [slk, tg].forEach((m, i) => m.a.to({ y: 60, o: 0 }, c("v5", "then") - 0.05 + i * 0.06, 0.26, "power2.in"));
  [0, 1, 2, 3, 4, 5].forEach((i) => vB.key(c("v5", "then") + 0.1 + i * 0.22, i % 2 ? "type2" : "type"));
  const tDive = c("v5", "real") - 0.15;
  cam(poseB(1.25, 0, 0, 860), c("v5", "then") + 0.05, tDive - c("v5", "then") - 0.05, "sine.inOut");
  cam(poseB(S), tDive, 0.95, "expo.inOut");

  // =============== the screen world (1:1 once the camera is inside) ===============
  win(WBG, 60, 470, 960, 900, 76);
  T(WBG, "the Pirate", 190, 524, 46);
  T(WBG, "~/checkout", 980, 522, 40, INK2, { "text-anchor": "end" });
  // the progress row: plan, review, build, test, ship
  const CHIP = ["plan", "review", "build", "test", "ship"];
  const chips = CHIP.map((s, i) => {
    const x = 70 + i * 192, g = G(WCH);
    const on = G(g, { opacity: 0 }), done = G(g, { opacity: 0 });
    rr(on, x, 292, 176, 84, { stroke: EX.blue, fill: dk("#74b9f0"), fillStyle: "hachure", strokeWidth: 3, fillWeight: 2, hachureGap: 12 });
    rr(done, x, 292, 176, 84, { stroke: EX.green, fill: dk("#8ce99a"), fillStyle: "hachure", strokeWidth: 3, fillWeight: 2, hachureGap: 12 });
    rr(g, x, 292, 176, 84, { stroke: INK2, strokeWidth: 2.5 });
    T(g, s, x + 88, 348, 44, INK, { ...MID, ...HALO });
    return { on, done };
  });
  op(WCH, 0, 1, tDive + 0.6, 0.2);
  const tCh = [c("v6", "plans") - 0.05, c("v6", "second") - 0.05, c("v6", "builds") - 0.05, c("v6", "tests") - 0.05, c("v6", "ships") - 0.05];
  chips.forEach((ch, i) => {
    tw(ch.on, { opacity: 0 }, { opacity: 1, duration: 0.08 }, tCh[i]);
    const tEnd = i < 4 ? tCh[i + 1] : c("v6", "ships") + 0.35;
    tw(ch.on, { opacity: 1 }, { opacity: 0, duration: 0.08 }, tEnd);
    tw(ch.done, { opacity: 0 }, { opacity: 1, duration: 0.08 }, tEnd);
  });
  op(WCH, 1, 0, c("v7", "_start") - 0.15, 0.2);
  // the plan card (built three times: whole, and the two halves it tears into)
  const PL = ["1. read the checkout code", "2. fix the total", "3. add a test"];
  const planCard = (p, typed) => {
    const g = G(p);
    rr(g, 110, 600, 860, 440, { fill: PAPER, fillStyle: "solid" });
    T(g, "Plan", 150, 676, 60, EX.blue);
    const ls = PL.map((L, i) => T(g, typed ? "" : L, 150, 770 + i * 80, 50));
    return { g, ls };
  };
  const tPlan = Math.min(c("v6", "plans") - 0.35, tDive + 1.0);
  const pw = planCard(W1, true), pwA = A(pw.g, { x: 0, y: 40, o: 0 });
  pwA.to({ o: 1, y: 0 }, tPlan, 0.34, "expo.out");
  typeLines(pw.ls, PL, tPlan + 0.12, c("v6", "second") - 0.12, 6);
  // the critic: a second AI, in red, with a red pen
  const CP = {
    pen: { la: [-16, -8], ra: [62, 140], ll: [-9, -4], rl: [9, 4], m: "frown", look: -1, pen: 1, brow: 1 },
    pen2: { la: [-16, -8], ra: [90, 150], ll: [-9, -4], rl: [9, 4], m: "flat", look: -1, pen: 1, brow: 1 },
    ok: { la: [-16, -8], ra: [142, 168], ll: [-9, -4], rl: [9, 4], m: "smile", look: -1, pen: 1 },
  };
  const crit = figure(W2, CP, "robot", 1420, 1362, 0.82, EX.red);
  crit.key(0, "pen");
  const tCr = c("v6", "second") - 0.1;
  crit.a.to({ x: 900 }, tCr, 0.4, "back.out(1.3)");
  const nCr = note(W2, ["critic AI"], 580, 1150, 54, EX.red, c("v6", "ai") - 0.05, { rot: -4, cps: 30 });
  [0, 1, 2, 3].forEach((i) => crit.key(c("v6", "tears") - 0.05 + i * 0.16, i % 2 ? "pen" : "pen2"));
  const scrs = [0, 1, 2].map((i) => { const s = scribble(W1, 140, 930, 760 + i * 80, EX.red, 50 + i); drawIn(s, c("v6", "tears") - 0.02 + i * 0.12, 0.2); return s; });
  const cross = rpath(W1, "M150 640 L940 1010 M940 640 L150 1010", { stroke: EX.red, strokeWidth: 6, roughness: 1.6 });
  drawIn(cross, c("v6", "plan") - 0.04, 0.24);
  // "apart": the card tears in two; the halves fall away
  const tAp = c("v6", "apart") - 0.04;
  [0, 1].forEach((h) => {
    const cl = el("clipPath", { id: `half${h}`, clipPathUnits: "userSpaceOnUse" }, defs);
    el("path", { d: h ? "M540 560 L1000 560 L1000 1080 L520 1080 L556 900 L522 760 Z" : "M80 560 L540 560 L522 760 L556 900 L520 1080 L80 1080 Z" }, cl);
    const outer = G(W1), inner = G(outer, { "clip-path": `url(#half${h})` });
    planCard(inner, false);
    [0, 1, 2].forEach((i) => scribble(inner, 140, 930, 760 + i * 80, EX.red, 50 + i));
    rpath(inner, "M150 640 L940 1010 M940 640 L150 1010", { stroke: EX.red, strokeWidth: 6, roughness: 1.6 });
    const a = A(outer, { x: 0, y: 0, r: 0, o: 0 });
    a.to({ o: 1 }, tAp, 0.01).to({ x: h ? 90 : -90, y: 40, r: h ? 9 : -9 }, tAp + 0.01, 0.22, "power2.out").to({ y: 1000, r: h ? 26 : -24, o: 0 }, tAp + 0.26, 0.42, "power3.in");
  });
  pwA.to({ o: 0 }, tAp, 0.01);
  [...scrs, cross].forEach((n) => tw(n, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tAp));
  tw(nCr, { opacity: 1 }, { opacity: 0, duration: 0.15 }, tAp + 0.3);
  crit.key(tAp + 0.45, "ok");
  crit.a.to({ x: 1420 }, c("v6", "builds") + 0.05, 0.35, "power2.in");
  // "builds": the code; "tests": three green checks; "ships": SHIPPED
  const code = G(W1), codeA = A(code, { x: 0, y: 40, o: 0 });
  const codeFr = rr(code, 110, 600, 860, 330, { fill: PAPER, fillStyle: "solid" });
  M(code, "checkout.py", 150, 668, 42, INK2);
  const CL2 = ["def total(cart):", "    items = cart.items", "    return sum(items)"];
  const cls = CL2.map((_, i) => M(code, "", 150, 760 + i * 60, 44));
  const tB = c("v6", "builds") - 0.12;
  codeA.to({ o: 1, y: 0 }, tB, 0.3, "expo.out");
  drawIn(codeFr, tB, 0.3);
  typeLines(cls, CL2, tB + 0.1, c("v6", "tests") - 0.08, 8);
  const tests = G(W1), testA = A(tests, { x: 0, y: 40, o: 0 });
  rr(tests, 110, 960, 860, 300, { fill: PAPER, fillStyle: "solid" });
  const TS = ["test_total", "test_empty_cart", "test_refund"];
  const tT = c("v6", "tests") - 0.1;
  testA.to({ o: 1, y: 0 }, tT, 0.28, "expo.out");
  TS.forEach((s, i) => {
    const tl = M(tests, s, 150, 1040 + i * 76, 44);
    typeOn(tl, tT + 0.1 + i * 0.16, 0.18);
    const ck = rpath(tests, `M860 ${1024 + i * 76} L882 ${1046 + i * 76} L924 ${1000 + i * 76}`, { stroke: EX.green, strokeWidth: 7, roughness: 0.8 });
    drawIn(ck, tT + 0.26 + i * 0.16, 0.16);
  });
  const shp = G(WFX), shpA = A(shp, { x: 540, y: 930, r: -7, o: 0 });
  rr(shp, -300, -90, 600, 180, { stroke: EX.green, fill: dk("#8ce99a"), fillStyle: "hachure", strokeWidth: 7, fillWeight: 2.6, hachureGap: 15 });
  T(shp, "SHIPPED", 0, 40, 120, EX.green, { ...MID, "letter-spacing": 4, ...HALO, "stroke-width": 12 });
  const spl1 = splat(shp, 300, 90, EX.green, 61);
  const tS = c("v6", "ships") - 0.12;
  shpA.to({ s: 1.7, r: -14 }, tS - 0.02, 0.01).to({ o: 1, s: 1, r: -7 }, tS, 0.13, "power4.in");
  tw(spl1, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tS + 0.12);
  drawIn(spl1, tS + 0.12, 0.14, "power2.out");
  [[16, -10], [-13, 9], [8, -5], [-4, 3], [0, 0]].forEach(([dx, dy], i) => cam(poseB(S, dx, dy), tS + 0.13 + i * 0.045, 0.045, "none"));
  // v7: the montage clears; a client asks for something big; "wait! simpler way:"
  const t7 = c("v7", "_start") - 0.2;
  [codeA, testA, shpA].forEach((a) => a.to({ o: 0 }, t7, 0.18));
  const rq = G(W1), rqA = A(rq, { x: -80, y: 0, o: 0 });
  rr(rq, 110, 580, 860, 300, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 3 });
  rell(rq, 180, 650, 70, 70, { stroke: EX.violet, fill: EX.violetF, fillStyle: "hachure", strokeWidth: 2.6, hachureGap: 9 });
  T(rq, "C", 180, 668, 44, INK, { ...MID, ...HALO });
  T(rq, "client", 236, 666, 44, INK2);
  ["add 12 new", "settings pages?"].forEach((L, i) => T(rq, L, 150, 776 + i * 70, 60));
  rqA.to({ o: 1, x: 0 }, c("v7", "request") - 0.2, 0.34, "expo.out");
  const ring12 = rell(W1, 300, 756, 330, 96, { stroke: EX.red, strokeWidth: 5, roughness: 1.5 });
  drawIn(ring12, c("v7", "bad") - 0.06, 0.28);
  note(W1, ["?!"], 840, 800, 110, EX.red, c("v7", "idea") - 0.02, { cps: 12 });
  note(W1, ["wait! simpler way:"], 130, 1010, 64, EX.green, c("v7", "says") - 0.12, { rot: -3, cps: 34 });
  const simp = G(W1), simpA = A(simp, { x: 0, y: 30, o: 0 });
  rr(simp, 300, 1090, 660, 150, { stroke: EX.green, fill: dk("#8ce99a"), fillStyle: "hachure", strokeWidth: 4, fillWeight: 2, hachureGap: 13 });
  T(simp, "1 page, 3 tabs", 630, 1186, 66, INK, { ...MID, ...HALO });
  simpA.to({ o: 1, y: 0 }, c("v7", "first") - 0.05, 0.3, "back.out(1.6)");
  drawIn(arrow(W1, 180, 1040, 290, 1160, { stroke: EX.green, strokeWidth: 4 }, 0.25), c("v7", "first") + 0.05, 0.25);

  // =============== v8: back out of the screen: Tom, in his chair, coffee in hand ===============
  const tOut = c("v8", "_start") - 0.08;
  cam(poseB(BS, 0, 0, BSY), tOut, 0.8, "expo.inOut");
  const TP = {
    sit: { la: [10, -20], ra: [-24, -150], ll: [-90, 0], rl: [-80, 6], m: "smile", look: -1, lean: 12, mug: 1 },
    sip: { la: [10, -20], ra: [-58, -176], ll: [-90, 0], rl: [-80, 6], m: "flat", look: -1, lean: 16, mug: 1, tilt: 10 },
    hold: { la: [10, -20], ra: [-82, -96], ll: [-90, 0], rl: [-80, 6], m: "o", look: -1, lean: 4 },
    nod: { la: [10, -20], ra: [-82, -96], ll: [-90, 0], rl: [-80, 6], m: "smile", look: -1, lean: 4, tilt: -8 },
    stop: { la: [10, -20], ra: [-150, -178], ll: [-90, 0], rl: [-80, 6], m: "flat", look: -1, lean: -4 },
  };
  const chair = G(BTOM);
  const TX = 875, TH = 1362 - 84;
  rline(chair, TX - 60, TH + 14, TX + 70, TH + 14, { strokeWidth: 4 });
  rline(chair, TX + 64, TH + 14, TX + 96, TH - 190, { strokeWidth: 4 });
  rline(chair, TX - 50, TH + 14, TX - 56, 1362, { strokeWidth: 3.5 });
  rline(chair, TX + 60, TH + 14, TX + 66, 1362, { strokeWidth: 3.5 });
  const tom = figure(BTOM, TP, "tom", TX, TH + 167, 1.0, INK);
  tw(BTOM, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tOut + 0.1);
  tom.key(0, "sit");
  const nTom = note(BHEAD, ["his creator: Tom"], 520, 850, 52, EX.violet, c("v8", "creator") - 0.05, { rot: -3, cps: 22 });
  const arTom = arrow(BHEAD, 830, 870, 892, 1000, { stroke: EX.violet, strokeWidth: 3.5 }, -0.2);
  drawIn(arTom, nTom._end, 0.25);
  [nTom, arTom].forEach((n) => tw(n, { opacity: 1 }, { opacity: 0, duration: 0.2 }, c("v8", "doesnt") - 0.25));
  headline(BHEAD, "senior engineer", c("v8", "senior") - 0.05, c("v9", "he") - 0.12, EX.blue, 96);
  vB.key(c("v8", "senior") - 0.1, "proud");
  // a gold rosette on Valor
  const ros = G(BFX), rosA = A(ros, { x: 300, y: 860, s: 0.4, o: 0, r: -10 });
  rpath(ros, "M-16 30 L-26 76 L-6 62 L4 80 L12 32", { stroke: GOLD, strokeWidth: 3.5 });
  rell(ros, 0, 0, 74, 74, { stroke: GOLD, fill: GOLDF, fillStyle: "solid", strokeWidth: 3.5 });
  const st = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 11 : 26, an = -Math.PI / 2 + (i * Math.PI) / 5; st.push(`${(r * Math.cos(an)).toFixed(1)} ${(r * Math.sin(an)).toFixed(1)}`); }
  rpath(ros, "M" + st.join(" L") + " Z", { stroke: GOLD, fill: GOLD, fillStyle: "solid", strokeWidth: 2.5, roughness: 0.6 });
  rosA.to({ o: 1, s: 1, r: 8 }, c("v8", "engineer") - 0.05, 0.3, "back.out(2.2)").to({ o: 0 }, c("v9", "he") - 0.1, 0.2);
  // "doesn't even approve his merges": an Approve button by Tom, crossed out; Tom sips his coffee
  const apv = G(BFX), apvA = A(apv, { x: 760, y: 640, s: 0.8, o: 0 });
  const apvB = rr(apv, -170, -60, 340, 120, { stroke: EX.green, fill: dk("#8ce99a"), fillStyle: "hachure", strokeWidth: 4, fillWeight: 2, hachureGap: 13 });
  T(apv, "Approve", 0, 20, 60, INK, { ...MID, ...HALO });
  const tAp2 = c("v8", "doesnt") - 0.05;
  apvA.to({ o: 1, s: 1 }, tAp2, 0.3, "back.out(1.8)");
  drawIn(apvB, tAp2, 0.3);
  const apX = rpath(apv, "M-190 -70 L190 70 M190 -70 L-190 70", { stroke: EX.red, strokeWidth: 8, roughness: 1.5 });
  drawIn(apX, c("v8", "merges") - 0.08, 0.26);
  apvA.to({ o: 0, y: 600 }, c("v9", "he") - 0.05, 0.22, "power2.in");
  tom.key(c("v8", "approve") - 0.1, "sip");
  tom.key(c("v8", "merges") + 0.5, "sit");
  vB.key(c("v8", "merges") + 0.2, "type");

  // =============== v9: Valor clears a big pile; one decision goes to Tom ===============
  const FZ = c("v10", "freezes") - 0.02;     // the freeze: from here until v11 the board holds still
  const FZ1 = c("v11", "_start") - 0.15;
  const NP = 14, pileX = 190, pileY0 = 840;
  const PR = rng(71);
  const tPile = c("v9", "_start") - 0.15;
  const pileCards = [];
  for (let i = 0; i < NP; i++) {
    const y = pileY0 - i * 15, x = pileX + (PR() - 0.5) * 20;
    const g = G(BPILE), a = GA(g, { x, y: y - 320, r: (PR() - 0.5) * 8, o: 0 });
    rr(g, -95, -24, 190, 48, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
    rline(g, -70, 0, 40 + (i % 3) * 18, 0, { stroke: INK2, strokeWidth: 3, roughness: 0.8 });
    a.to({ o: 1 }, tPile + i * 0.03, 0.01).to({ y }, tPile + i * 0.03 + 0.01, 0.2, "power2.in");
    pileCards.push({ a, x, y });
  }
  // cards zip from the top of the pile into the laptop; the one in the air at the freeze stays there
  const tFly0 = c("v9", "brings") - 0.1, dFly = 0.4, tFlyDur = 0.42;
  for (let k = 0; k < NP; k++) {
    const p = pileCards[NP - 1 - k], t = Math.max(tFly0 + k * dFly, tPile + (NP - 1 - k) * 0.03 + 0.25);
    if (t >= FZ) break;
    const tx = 540 + ((k % 3) - 1) * 30, ty = 950;
    if (t + tFlyDur <= FZ) {
      p.a.to({ x: (p.x + tx) / 2, y: p.y - 110, r: 12, s: 0.8 }, t, tFlyDur * 0.45, "power2.out").to({ x: tx, y: ty, r: 0, s: 0.3, o: 0 }, t + tFlyDur * 0.45, tFlyDur * 0.55, "power2.in");
    } else {
      const u = (FZ - t) / tFlyDur;      // frozen mid-flight
      p.a.to({ x: p.x + (tx - p.x) * u, y: p.y - 110 * Math.sin(Math.PI * Math.min(1, u)), r: 12 * u, s: 1 - 0.3 * u }, t, FZ - t, "none");
    }
  }
  [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => vB.key(tFly0 + i * 0.36, i % 2 ? "type2" : "type"));
  // the one decision: a violet card into Tom's hand
  const dec = G(BFLY), decA = A(dec, { x: 300, y: 760, o: 0, r: -6 });
  rr(dec, -120, -38, 240, 76, { stroke: EX.violet, fill: EX.violetF, fillStyle: "solid", strokeWidth: 3.5 });
  T(dec, "decision?", 0, 14, 40, INK, MID);
  const [thx, thy] = tom.hand("hold");
  const tDc = c("v9", "decisions") - 0.25;
  decA.to({ o: 1 }, tDc, 0.01).to({ x: 560, y: 600, r: 6 }, tDc + 0.01, 0.26, "power2.out").to({ x: thx - 70, y: thy - 160, r: -4 }, tDc + 0.27, 0.32, "power2.in");
  tom.key(tDc + 0.45, "hold");
  tom.key(c("v9", "need") - 0.05, "nod");
  decA.to({ o: 0 }, c("v10", "_start") + 0.1, 0.2);
  tom.key(c("v10", "_start") + 0.2, "sit");
  headline(BHEAD, "only the big calls", c("v9", "decisions") - 0.1, c("v10", "_start") + 0.05, EX.violet, 88);

  // =============== v10: something goes wrong; STOP; Valor freezes ===============
  const warn = G(BFX), warnA = A(warn, { x: 540, y: 950, s: 0.4, o: 0 });
  rpath(warn, "M0 -78 L84 66 L-84 66 Z", { stroke: EX.red, fill: EX.redF, fillStyle: "solid", strokeWidth: 5 });
  T(warn, "!", 0, 50, 96, INK, MID);
  warnA.to({ o: 1, s: 1 }, c("v10", "wrong") - 0.08, 0.26, "back.out(2.4)").to({ r: 6 }, c("v10", "wrong") + 0.2, 0.1, "sine.inOut").to({ r: -6 }, c("v10", "wrong") + 0.3, 0.1, "sine.inOut").to({ r: 0 }, c("v10", "wrong") + 0.4, 0.1, "sine.inOut");
  vB.key(c("v10", "wrong") - 0.05, "oops");
  tom.key(c("v10", "tom") - 0.1, "stop");
  const stopG = G(BFX), stopA = A(stopG, { x: 540, y: 560, o: 0, r: -4 });
  const oct = []; for (let i = 0; i < 8; i++) { const an = (Math.PI / 8) * (2 * i + 1); oct.push(`${(170 * Math.cos(an)).toFixed(1)} ${(170 * Math.sin(an)).toFixed(1)}`); }
  rpath(stopG, "M" + oct.join(" L") + " Z", { stroke: EX.red, fill: dk("#f29a9a"), fillStyle: "hachure", strokeWidth: 7, fillWeight: 2.6, hachureGap: 14 });
  T(stopG, "STOP", 0, 38, 112, EX.red, { ...MID, "letter-spacing": 3, ...HALO, "stroke-width": 12 });
  const spl2 = splat(stopG, 175, 175, EX.red, 81);
  const tSt = c("v10", "stop") - 0.1;
  stopA.to({ s: 1.7, r: -12 }, tSt - 0.02, 0.01).to({ o: 1, s: 1, r: -4 }, tSt, 0.13, "power4.in");
  tw(spl2, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tSt + 0.12);
  drawIn(spl2, tSt + 0.12, 0.14, "power2.out");
  [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => cam(poseB(BS, dx, dy, BSY), tSt + 0.13 + i * 0.045, 0.045, "none"));
  vB.key(c("v10", "valor") - 0.1, "freeze");
  // the freeze: a flash, an icy tint, frost on Valor and icicles on his laptop
  const SAFE = CAM.parentNode;
  const flash = el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: INK, opacity: 0 }, svg);
  const tint = el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: EX.blue, opacity: 0 }, null);
  svg.insertBefore(tint, SAFE);
  tw(tint, { opacity: 0 }, { opacity: 0.16, duration: 0.06 }, FZ + 0.02);
  tw(tint, { opacity: 0.16 }, { opacity: 0, duration: 0.01 }, FZ1);
  tw(flash, { opacity: 0 }, { opacity: 0.55, duration: 0.04 }, FZ);
  tw(flash, { opacity: 0.55 }, { opacity: 0, duration: 0.22, ease: "power2.out" }, FZ + 0.05);
  const ice = G(BFX, { opacity: 0 });
  rr(ice, 104, 870, 176, 500, { stroke: EX.blue, fill: dk("#74b9f0"), fillStyle: "hachure", strokeWidth: 4, fillWeight: 1.6, hachureGap: 22 });
  const FR = rng(91);
  for (let i = 0; i < 7; i++) { const x = 116 + FR() * 130, y = 900 + FR() * 440; rpath(ice, `M${x} ${y} l12 -12 l12 12 l12 -12 M${x + 12} ${y - 12} l0 -14`, { stroke: INK, strokeWidth: 3, roughness: 0.8 }); }
  [0, 1, 2, 3, 4].forEach((i) => rpath(ice, `M${LS.x + 22 + i * 62} ${LS.y + 2} l14 36 l14 -36`, { stroke: EX.blue, fill: EX.blueF, fillStyle: "solid", strokeWidth: 3 }));
  T(ice, "frozen", 190, 846, 64, EX.blue, { ...MID, ...HALO });
  tw(ice, { opacity: 0 }, { opacity: 1, duration: 0.06 }, FZ + 0.02);

  // =============== v11: back to board A: one engineer, six companies, four Macs ===============
  const tBk = c("v11", "_start") - 0.2;
  cam(poseB(BS, 14, 0, BSY), tBk - 0.16, 0.14, "power2.out");
  cam(pose(1.0), tBk - 0.02, 0.46, "expo.inOut");
  tw(BBB, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tBk + 0.6);
  tw(A2, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tBk - 0.3);
  const chats2 = CH.map((_, i) => chatWin(A2, i));
  rline(A2, 60, 1362, 1020, 1362, { strokeWidth: 3, roughness: 1.2 });
  chats2.forEach((ch, i) => {
    const a = A(ch.g, { x: 0, y: -520, o: 1, s: 0.95 });
    a.to({ y: 0, s: 1 }, tBk + 0.05 + (i % 3) * 0.05 + (i > 2 ? 0.03 : 0), 0.4, "expo.out");
    tw(ch.bdg, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0);
    ch.bdA.to({ s: 1 }, 0, 0.01);
    const tk = c("v11", "engineer") + 0.1 + i * 0.17;
    tw(ch.bdg, { opacity: 1 }, { opacity: 0, duration: 0.01 }, tk);
    tw(ch.okg, { opacity: 0 }, { opacity: 1, duration: 0.01 }, tk);
    ch.okA.to({ s: 1 }, tk, 0.24, "back.out(2.6)");
    a.to({ o: 0, y: -40 }, c("v12", "_start") - 0.25 + (i % 3) * 0.03, 0.22, "power2.in");
  });
  const v2f = figure(A2, VP, "robot", 190, 1362, 0.9);
  tag(v2f).setAttribute("opacity", 1);
  v2f.key(0, "stand");
  v2f.key(c("v11", "one") - 0.05, "cheer");
  v2f.key(c("v11", "macs") + 0.3, "proud");
  headline(A2, "1 engineer", c("v11", "one") - 0.02, c("v11", "six") - 0.12, EX.blue, 104);
  headline(A2, "6 companies", c("v11", "six") - 0.05, c("v11", "for") - 0.12, INK, 104);
  headline(A2, "4 Macs", c("v11", "for") - 0.05, c("v12", "_start") - 0.2, EX.orange, 112);
  // four little Macs, with their doodles, pop up along the floor
  MACS.forEach(([k], i) => {
    const x = 400 + i * 160, y = 1170, w = 130;
    const g = G(A2), a = A(g, { x: x + w / 2, y: y + 60, s: 0.5, o: 0 });
    const inner = G(g, { transform: `translate(${-(x + w / 2)},${-(y + 60)})` });
    laptop(inner, x, y, w); macFace(inner, x, y, w, k);
    a.to({ o: 1, s: 1 }, c("v11", "macs") - 0.25 + i * 0.08, 0.26, "back.out(2)");
    a.to({ o: 0, y: y + 100 }, c("v12", "_start") - 0.2, 0.2, "power2.in");
  });

  // =============== v12: valorengels.com ===============
  const t12 = c("v12", "_start") - 0.1;
  const bw = win(A2, 70, 500, 940, 400, 76);
  drawIn(bw, t12, 0.45);
  const bwB = G(A2, { opacity: 0 });
  rr(bwB, 200, 516, 700, 44, { stroke: INK2, strokeWidth: 2.2 });
  T(bwB, "https://", 224, 550, 36, INK2, { "data-deco": 1 });
  op(bwB, 0, 1, t12 + 0.3, 0.2);
  const url = T(A2, "valorengels.com", 540, 760, 100, INK, MID);
  typeOn(url, c("v12", "valorangels") - 0.3, 0.75);
  drawIn(scribble(A2, 170, 910, 800, EX.blue, 99), c("v12", "com") - 0.05, 0.35);
  v2f.key(c("v12", "meet") + 0.05, "wave");
  // the cursor clicks the address
  const curG = G(A2), curA = A(curG, { x: 1000, y: 1250, o: 0 });
  rpath(curG, "M0 0 L0 48 L12 37 L21 57 L30 53 L21 33 L37 33 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.2, roughness: 0.7 });
  const tCk = c("v12", "com") + 0.3;
  curA.to({ o: 1 }, tCk - 0.6, 0.01).to({ x: 760, y: 780 }, tCk - 0.58, 0.5, "back.out(1.2)");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  const crg = G(A2), cra = A(crg, { x: 760, y: 780, s: 0.3, o: 0 });
  rell(crg, 0, 0, 80, 80, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.3, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  cam(pose(1.06, 540, 760, 760), c("v12", "_start"), 2.4, "sine.inOut");

  // ---------- the boil clock: one time-driven update; the freeze holds the clock still ----------
  FIGS.forEach((Fg) => Fg.keys.sort((a, b) => a[0] - b[0]));
  const boilAt = (v0) => {
    const v = v0 >= FZ && v0 < FZ1 ? FZ : v0;
    const k = Math.max(0, Math.floor(v / BOIL_DT));
    for (const it of BOIL) {
      const i = (k + it.ph) % 3;
      if (i !== it.cur) { it.vars[it.cur].setAttribute("visibility", "hidden"); it.vars[i].setAttribute("visibility", "visible"); it.cur = i; }
    }
    FIGS.forEach((Fg) => {
      let act = Fg.keys[0][1];
      for (const [t, n] of Fg.keys) { if (t <= v) act = n; else break; }
      const key = act + ":" + (k % 3);
      if (key !== Fg.cur) {
        Object.keys(Fg.poses).forEach((n) => Fg.poses[n].forEach((g, j) => g.setAttribute("visibility", n === act && j === k % 3 ? "visible" : "hidden")));
        Fg.cur = key;
      }
    });
  };
  const END_T = c("v13", "_end") + 4;
  const clock = { v: 0 };
  B.fromTo(clock, { v: 0 }, { v: END_T, duration: END_T, ease: "none", immediateRender: false, onUpdate: () => boilAt(clock.v) }, 0);
  boilAt(0);

  const CA = A(CAM, { x: 0, y: 0, s: 1 });
  camQ.sort((a, b) => a[0] - b[0]).forEach(([t, p, dur, ease]) => CA.to(p, t, dur, ease));
  return {};
}
