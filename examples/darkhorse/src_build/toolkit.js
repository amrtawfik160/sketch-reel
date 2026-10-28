function scene({ svg, defs, SAFE, D, CAM, B, cue, kit, el, txt, rng }) {
  const c = cue;
  const A = kit.actor;
  const GA = (node, init) => {
    const a = kit.actor(node, init); let busy = -1; const raw = a.to;
    a.to = (vals, at, dur = 0.35, ease) => { const t = Math.max(at, busy); busy = t + dur; raw(vals, t, dur, ease); return a; };
    return a;
  };
  const G = (p, attrs = {}) => el("g", attrs, p);
  const seen = new Map();
  const mark = (n, props) => { const s = seen.get(n) || new Set(); const any = props.some((p) => s.has(p)); props.forEach((p) => s.add(p)); seen.set(n, s); return any; };
  const tw = (n, from, to, t) => B.fromTo(n, from, { ...to, immediateRender: !mark(n, Object.keys(from)) }, t);
  const show = (n, t, dur = 0.01) => tw(n, { opacity: 0 }, { opacity: 1, duration: dur, ease: "power2.out" }, t);
  const hide = (n, t, dur = 0.01) => tw(n, { opacity: 1 }, { opacity: 0, duration: dur, ease: "power2.in" }, t);

  // ---------- the current theme (each section is drawn in its own palette) ----------
  let INK, INK2, PAPER, EX, DARK = true;
  const setTheme = (dark) => { DARK = dark; ({ INK, INK2, PAPER, EX } = dark ? DT : LT); if (dark) INK2 = "#b9bec5"; };
  const cx = (hex) => (DARK ? dk(hex) : hex);   // any extra Excalidraw colour, in the current theme
  setTheme(true);
  const T = (p, s, x, y, size, fill = INK, extra = {}) => txt(p, s, { x, y, "font-family": HAND, "font-size": size, fill, ...extra });
  const M = (p, s, x, y, size, fill = INK, extra = {}) => txt(p, s, { x, y, "font-family": CODE, "font-size": size, fill, ...extra });
  const MID = { "text-anchor": "middle" }, END = { "text-anchor": "end" };
  const HALO = () => ({ stroke: PAPER, "stroke-width": 8, "paint-order": "stroke" });

  // ---------- boiling ----------
  const BOIL = [], BOIL_DT = 0.14, FIGS = [];
  const boil = (vars) => { vars.forEach((v, i) => v.setAttribute("visibility", i ? "hidden" : "visible")); BOIL.push({ vars, cur: 0, ph: BOIL.length % 3 }); };

  // ---------- rough.js ----------
  const rc = rough.svg(svg);
  let SEED = 501;
  const RO = (o = {}) => {
    const sw = (o.strokeWidth || 3.5) * 1.2;   // a touch heavier than Excalidraw's defaults, so lines hold up at phone size
    return { roughness: 1, bowing: 1, stroke: INK, fillWeight: sw / 2, hachureGap: sw * 4, hachureAngle: -41, preserveVertices: true, seed: SEED++, ...o, strokeWidth: sw };
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
  const rr = (p, x, y, w, h, o = {}) => mk(p, (q) => rc.path(rrD(x, y, w, h, Math.min(32, Math.min(w, h) * 0.25)), q), o);
  const rline = (p, x1, y1, x2, y2, o = {}) => mk(p, (q) => rc.line(x1, y1, x2, y2, q), o);
  const rpath = (p, d, o = {}) => mk(p, (q) => rc.path(d, q), o);
  const rell = (p, x0, y0, w, h, o = {}) => mk(p, (q) => rc.ellipse(x0, y0, w, h, q), o);
  const rarc = (p, x0, y0, w, h, a0, a1, o = {}) => mk(p, (q) => rc.arc(x0, y0, w, h, a0, a1, false, q), o);
  const arrow = (p, x1, y1, x2, y2, o = {}, bend = 0) => {
    const g = G(p);
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    rpath(g, `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, o);
    const a = Math.atan2(y2 - my, x2 - mx), L = 28, s = 0.48;
    rpath(G(g, { "data-head": 1 }), `M${x2 - L * Math.cos(a - s)} ${y2 - L * Math.sin(a - s)} L${x2} ${y2} L${x2 - L * Math.cos(a + s)} ${y2 - L * Math.sin(a + s)}`, o);
    return g;
  };
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
    // plain shapes and text inside the drawing (dots, pupils, labels) fade in with it instead of sitting there from the start
    [...node.querySelectorAll("circle, ellipse, rect, line, polyline, text")].forEach((e) => tw(e, { opacity: 0 }, { opacity: 1, duration: dur * 0.4, ease: "power1.out" }, t + dur * 0.35));
    return node;
  };
  const typeLines = (els, lines, t0, t1, seed = 3) => {
    const R = rng(seed), full = lines.join("\n"), w = [];
    for (const ch of full) w.push(ch === "\n" ? 0.4 : ch === " " ? 1.6 + R() * 0.8 : ".,!?:".includes(ch) ? 2.6 : 0.7 + R() * 0.6);
    const tot = w.reduce((a, b) => a + b, 0), at = [];
    let acc = 0;
    w.forEach((x) => { acc += x; at.push(t0 + ((t1 - t0 - 0.03) * acc) / tot); });
    const showN = (n) => { let k = 0; lines.forEach((L, i) => { els[i].textContent = L.slice(0, Math.max(0, Math.min(L.length, n - k))); k += L.length + 1; }); };
    els.forEach((e) => (e.textContent = ""));
    const pr = { v: t0 };
    B.fromTo(pr, { v: t0 }, { v: t1, duration: t1 - t0, ease: "none", immediateRender: false, onUpdate: () => { let n = 0; while (n < at.length && at[n] <= pr.v) n++; showN(n); } }, t0);
  };
  const typeOn = (t, at, dur = 0.3) => { const s = t.textContent; t.textContent = ""; kit.counter(t, 0, s.length, at, dur, (v) => s.slice(0, Math.round(v)), "none"); };
  const note = (p, lines, x, y, size, col, t, { lh = size * 1.3, cps = 36, anchor = "start", rot = 0 } = {}) => {
    const g = G(p, { opacity: 0 });
    if (rot) g.setAttribute("transform", `rotate(${rot} ${x} ${y})`);
    let at = t;
    lines.forEach((L, i) => { const e = T(g, L, x, y + i * lh, size, col, { "text-anchor": anchor, ...HALO() }); const d = L.length / cps; typeOn(e, at, d); at += d + 0.04; });
    show(g, t);
    g._end = at;
    return g;
  };
  const scribble = (p, x1, x2, y, col, seed = 1, sw = 4) => {
    const R = rng(seed), pts = [];
    for (let x = x1, i = 0; x <= x2; x += 26, i++) pts.push(`${x.toFixed(1)} ${(y + (i % 2 ? 7 : -3) + R() * 3).toFixed(1)}`);
    return rpath(p, "M" + pts.join(" L"), { stroke: col, strokeWidth: sw, roughness: 1.3 });
  };
  const scratch = (p, x, y, w, h, col, seed = 1) => {   // a dense scribble-out over a box
    const R = rng(seed), pts = [];
    for (let i = 0; i <= 9; i++) pts.push(`${(x + (i % 2 ? w : 0) + (R() - 0.5) * 16).toFixed(1)} ${(y + (h * i) / 9 + (R() - 0.5) * 8).toFixed(1)}`);
    return rpath(p, "M" + pts.join(" L"), { stroke: col, strokeWidth: 5, roughness: 1.6 });
  };
  const xmark = (p, x0, y0, r, col = EX.red, sw = 7) => rpath(p, `M${x0 - r} ${y0 - r} L${x0 + r} ${y0 + r} M${x0 + r} ${y0 - r} L${x0 - r} ${y0 + r}`, { stroke: col, strokeWidth: sw, roughness: 1.4 });
  const tick = (p, x, y, s = 1, col = EX.green, sw = 6) => rpath(p, `M${x - 18 * s} ${y} L${x - 4 * s} ${y + 16 * s} L${x + 22 * s} ${y - 20 * s}`, { stroke: col, strokeWidth: sw, roughness: 0.8 });
  const headline = (p, s, t0, t1, col = INK, size = 96, y = 330, cps = 26) => {
    const g = G(p, { opacity: 0 });
    const e = T(g, s, 0, y, size, col, HALO());
    const w = e.getComputedTextLength();
    e.setAttribute("x", 540 - w / 2);
    typeOn(e, t0, s.length / cps);
    show(g, t0);
    if (t1) tw(g, { opacity: 1, y: 0 }, { opacity: 0, y: -18, duration: 0.16, ease: "power2.in" }, t1);
    return g;
  };
  const splat = (p, rx, ry, col, seed) => {
    const g = G(p, { opacity: 0 }), R = rng(seed);
    [[-1, -1], [1, -0.8], [-1, 0.9], [1, 1], [0.1, -1.2], [-0.3, 1.25]].forEach(([dx, dy]) => {
      const x1 = dx * rx, y1 = dy * ry;
      rline(g, x1, y1, x1 * 1.15 + R() * 6, y1 * 1.3, { stroke: col, strokeWidth: 4, roughness: 1.4 });
    });
    [[-1.25, -0.2, 10], [1.28, 0.1, 12], [0.6, -1.4, 8], [-0.6, 1.45, 9]].forEach(([dx, dy, r]) => el("circle", { cx: dx * rx, cy: dy * ry, r, fill: col }, g));
    return g;
  };
  // a slammed stamp: hachured box, word, ink splatter
  const stamp = (p, word, x, y, w, h, col, colF, t, rot = -7, size = 110, seed = 7) => {
    const g = G(p), a = A(g, { x, y, r: rot, o: 0 });
    rr(g, -w / 2, -h / 2, w, h, { stroke: col, fill: colF, fillStyle: "hachure", strokeWidth: 7, fillWeight: 2.6, hachureGap: 15 });
    T(g, word, 0, size * 0.36, size, col, { ...MID, "letter-spacing": 4, ...HALO(), "stroke-width": 12 });
    const sp = splat(g, w / 2, h / 2, col, seed);
    a.to({ s: 1.7, r: rot * 2 }, t - 0.02, 0.01).to({ o: 1, s: 1, r: rot }, t, 0.13, "power4.in");
    show(sp, t + 0.12); drawIn(sp, t + 0.12, 0.14, "power2.out");
    return a;
  };
  const win = (p, x, y, w, h, title, bar = 72) => {
    const g = G(p);
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid" });
    if (bar) {
      rline(g, x + 14, y + bar, x + w - 14, y + bar, { strokeWidth: 2.5, roughness: 0.8 });
      [0, 1, 2].forEach((i) => rell(g, x + 36 + i * 26, y + bar / 2, 15, 15, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
      if (title) T(g, title, x + 128, y + bar / 2 + 15, 44, INK2);
    }
    return g;
  };
  const laptop = (p, x, y, w = 300) => {
    const g = G(p), h = w * 0.625;
    rr(g, x, y, w, h, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
    rpath(g, `M${x - 22} ${y + h + 4} L${x + w + 22} ${y + h + 4} L${x + w + 6} ${y + h + 26} L${x - 6} ${y + h + 26} Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
    return g;
  };
  const pill = (p, s, x, y, col, colF, size = 40, style = "hachure") => {
    const g = G(p);
    const bx = G(g);
    const tt = T(g, s, x, y + size * 0.36, size, INK, { ...MID, ...HALO() });
    const w = tt.getComputedTextLength() + 44;
    rr(bx, x - w / 2, y - size * 0.8, w, size * 1.6, { stroke: col, fill: colF, fillStyle: style, strokeWidth: 3, hachureGap: 10, fillWeight: 2 });
    g._w = w;
    return g;
  };
  let PHOTO = 0;
  const photo = (p, x, y, r) => {   // Tom's photo in a hand-drawn ring
    const g = G(p), id = `tomclip${PHOTO++}`;
    const cp = el("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, defs);
    el("circle", { cx: x, cy: y, r }, cp);
    el("image", { href: "img/tom.jpg", x: x - r, y: y - r, width: 2 * r, height: 2 * r, preserveAspectRatio: "xMidYMid slice", "clip-path": `url(#${id})` }, g);
    rell(g, x, y, 2 * r + 8, 2 * r + 8, { stroke: EX.violet, strokeWidth: 4 });
    return g;
  };

  // ---------- figures: Valor the robot, the red critic, a developer ----------
  const R2D = Math.PI / 180;
  const limb = (x, y, [a1, a2], L1, L2) => { const ex = x + Math.sin(a1 * R2D) * L1, ey = y + Math.cos(a1 * R2D) * L1; return [[x, y], [ex, ey], [ex + Math.sin(a2 * R2D) * L2, ey + Math.cos(a2 * R2D) * L2]]; };
  const pl = (pts) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const MOUTH = { smile: "M-14 12 Q0 25 14 12", big: "M-17 8 Q0 34 17 8 Z", frown: "M-13 22 Q0 11 13 22", flat: "M-12 16 L12 16" };
  const drawPose = (p, P, kind, col) => {
    const g = G(p);
    const o = { strokeWidth: 5.5, roughness: 1.1, boil: false, stroke: col };
    const eye = col === INK ? EX.blue : col;
    const bot = kind === "bot";   // the AI helper: a hovering robot, no legs, jets under a box body
    if (!bot) {
      rpath(g, pl(limb(0, 0, P.ll, 84, 84)), o);
      rpath(g, pl(limb(0, 0, P.rl, 84, 84)), o);
    }
    const up = G(g, { transform: `rotate(${P.lean || 0})` });
    if (!bot) rline(up, 0, 0, 0, -150, o);
    if (kind === "karim" || kind === "omar") {   // a hoodie: a hachured body and a pocket line
      rpath(up, "M-30 -148 L30 -148 L40 -26 L-40 -26 Z", { ...o, strokeWidth: 4, fill: col, fillStyle: "hachure", hachureGap: 11 });
      rline(up, -22, -62, 22, -62, { ...o, strokeWidth: 3.5 });
    }
    rpath(up, pl(limb(0, -128, P.la, 72, 66)), o);
    rpath(up, pl(limb(0, -128, P.ra, 72, 66)), o);
    if (bot) {
      rr(up, -38, -152, 76, 108, { ...o, fill: PAPER, fillStyle: "solid", strokeWidth: 5 });
      el("circle", { cx: 0, cy: -106, r: 8, fill: col }, up);
      [-18, 0, 18].forEach((x) => rline(up, x, -34, x * 1.4, -4, { ...o, strokeWidth: 4, roughness: 1.6 }));
    }
    const [hx, hy2] = limb(0, -128, P.ra, 72, 66)[2];
    if (P.pen) rline(up, hx - 6, hy2 + 10, hx + 24, hy2 - 46, { ...o, stroke: P.penBlue ? EX.blue : EX.red, strokeWidth: 8 });
    if (P.hl) rline(up, hx - 8, hy2 + 12, hx + 22, hy2 - 40, { ...o, stroke: EX.yellowF, strokeWidth: 18, roughness: 0.6 });
    if (P.scis) {   // big scissors, blades crossing at (hx + 46, hy2 - 24): 1 open, 2 shut (the snip); two-tone so they read on dark and on paper
      const op = P.scis === 1 ? 50 : 8, cy0 = hy2 - 24;
      [[11, "#f1f3f5"], [5, "#343a40"]].forEach(([w0, c0]) => { rline(up, hx - 4, cy0 + op, hx + 96, cy0 - op, { ...o, stroke: c0, strokeWidth: w0, boil: false }); rline(up, hx - 4, cy0 - op, hx + 96, cy0 + op, { ...o, stroke: c0, strokeWidth: w0, boil: false }); });
      [[hx - 16, cy0 + op + 8], [hx - 16, cy0 - op - 8]].forEach(([x0, y0]) => rell(up, x0, y0, 28, 28, { ...o, stroke: EX.red, strokeWidth: 6 }));
    }
    if (P.lap) rr(up, -60, -118, 34, 90, { ...o, strokeWidth: 3.5, fill: EX.grayF, fillStyle: "solid" });   // a closed laptop under the arm
    if (P.lapOpen) {   // an open laptop held in front, at hand height
      rr(up, -122, -112, 112, 70, { ...o, strokeWidth: 3.5, fill: PAPER, fillStyle: "solid" });   // Omar faces left: the laptop is on his left
      rpath(up, "M-130 -40 L-2 -40 L-12 -30 L-120 -30 Z", { ...o, strokeWidth: 3.5, fill: PAPER, fillStyle: "solid" });
    }
    if (P.phone) { rr(up, hx - 18, hy2 - 52, 36, 62, { ...o, strokeWidth: 3.5, fill: EX.blueF, fillStyle: "solid" }); }
    const hd = G(up, { transform: `rotate(${P.tilt || 0} 0 -150)` });
    const hy = -194, lk = (P.look || 0) * 6;
    if (kind === "robot" || kind === "bot") {
      rline(hd, 0, hy - 44, 2, hy - 78, { ...o, strokeWidth: 4.5 });
      rell(hd, 2, hy - 86, 20, 20, { ...o, strokeWidth: 4, fill: eye, fillStyle: "solid" });
      rr(hd, -52, hy - 44, 104, 90, { ...o, fill: PAPER, fillStyle: "solid" });
      if (P.shut) [-20, 20].forEach((ex) => rline(hd, ex - 9, hy - 8, ex + 9, hy - 8, { ...o, stroke: eye, strokeWidth: 4.5 }));
      else [-20, 20].forEach((ex) => el("circle", { cx: ex + lk, cy: hy - 8, r: 7.5, fill: eye }, hd));
      if (P.brow) { rline(hd, -36 + lk, hy - 32, -10 + lk, hy - 22, { ...o, strokeWidth: 4 }); rline(hd, 10 + lk, hy - 22, 36 + lk, hy - 32, { ...o, strokeWidth: 4 }); }
    } else {
      if (kind === "karim" || kind === "omar") rpath(hd, `M-46 ${hy + 26} Q-66 ${hy - 26} -32 ${hy - 54} Q0 ${hy - 68} 32 ${hy - 54} Q66 ${hy - 26} 46 ${hy + 26}`, { ...o, strokeWidth: 4 });   // the hood behind his head
      rell(hd, 0, hy, 86, 86, { ...o, fill: PAPER, fillStyle: "solid" });
      if (kind === "omar") {   // Omar: short flat hair, glasses, a short beard
        rpath(hd, `M-38 ${hy - 18} Q-36 ${hy - 46} 0 ${hy - 46} Q36 ${hy - 46} 38 ${hy - 18} Q20 ${hy - 32} 0 ${hy - 32} Q-20 ${hy - 32} -38 ${hy - 18}`, { ...o, strokeWidth: 4, fill: col, fillStyle: "solid" });
        rpath(hd, `M-40 ${hy + 2} Q-38 ${hy + 46} 0 ${hy + 46} Q38 ${hy + 46} 40 ${hy + 2} L30 ${hy + 8} Q20 ${hy + 36} 0 ${hy + 34} Q-20 ${hy + 36} -30 ${hy + 8} Z`, { ...o, strokeWidth: 3, fill: col, fillStyle: "hachure", hachureGap: 6 });
        [-17, 17].forEach((ex) => rell(hd, ex, hy - 6, 28, 24, { ...o, strokeWidth: 3 }));
        rline(hd, -3, hy - 6, 3, hy - 6, { ...o, strokeWidth: 3 });
      }
      if (kind === "karim") [-150, -122, -95, -68, -40, -14].forEach((a, i) => { const r = a * Math.PI / 180; rell(hd, Math.cos(r) * 38, hy + Math.sin(r) * 38, 24, 21, { ...o, strokeWidth: 3.5 }); });   // short curls
      if (kind === "human") rpath(hd, `M-40 ${hy - 14} Q-30 ${hy - 50} 0 ${hy - 46} Q30 ${hy - 50} 40 ${hy - 14}`, { ...o, strokeWidth: 5 });
      if (kind === "sam") {   // Sam: a red cap with a brim, worn a little sideways
        rpath(hd, `M-44 ${hy - 10} Q-44 ${hy - 54} 0 ${hy - 54} Q42 ${hy - 54} 44 ${hy - 10} Z`, { ...o, strokeWidth: 4, fill: EX.red, fillStyle: "solid" });
        rpath(hd, `M30 ${hy - 14} L82 ${hy - 8} L80 ${hy - 2} L32 ${hy - 4}`, { ...o, strokeWidth: 4, fill: EX.red, fillStyle: "solid" });
      }
      if (kind === "nora") {   // Nora: hair over the top of her head and a ponytail on the side she faces away from
        rpath(hd, `M-44 ${hy + 4} Q-50 ${hy - 52} 0 ${hy - 50} Q48 ${hy - 52} 44 ${hy + 4} Q30 ${hy - 26} 0 ${hy - 28} Q-30 ${hy - 26} -44 ${hy + 4}`, { ...o, strokeWidth: 4, fill: col, fillStyle: "hachure", hachureGap: 8 });
        rpath(hd, `M36 ${hy - 34} Q80 ${hy - 36} 86 ${hy + 6} Q90 ${hy + 48} 66 ${hy + 72}`, { ...o, strokeWidth: 10 });
        rell(hd, 44, hy - 33, 16, 16, { ...o, strokeWidth: 3, fill: EX.orange, fillStyle: "solid" });
      }
      if (kind === "dev") {
        rpath(hd, `M-42 ${hy - 6} Q-44 ${hy - 52} 0 ${hy - 50} Q44 ${hy - 52} 42 ${hy - 6} Q20 ${hy - 30} -8 ${hy - 28} Q-30 ${hy - 26} -42 ${hy - 6}`, { ...o, strokeWidth: 4, fill: col, fillStyle: "hachure", hachureGap: 9 });
        [-18, 18].forEach((ex) => rell(hd, ex + lk, hy - 2, 30, 26, { ...o, strokeWidth: 3 }));
      }
      [-14, 14].forEach((ex) => el("circle", { cx: ex + lk * (kind === "dev" ? 1.4 : 1), cy: hy - (kind === "dev" ? 2 : 6), r: P.wide ? 9 : 5, fill: col }, hd));
    }
    const my = kind === "robot" ? hy + 6 : hy + 4;
    if (P.m === "o") rell(hd, lk, my + 18, 16, 18, { ...o, strokeWidth: 3.5, roughness: 0.5 });
    else rpath(G(hd, { transform: `translate(${lk},${my})` }), MOUTH[P.m], { ...o, strokeWidth: 4, roughness: 0.5 });
    return g;
  };
  const figure = (p, poses, kind, x, ground, s = 1, col = INK) => {
    const g = G(p), hip = ground - 167 * s;
    const a = GA(g, { x, y: hip, s, o: 1 });
    const Fg = { poses: {}, keys: [], cur: null, a, g, hip, s, x };
    Object.entries(poses).forEach(([name, P]) => {
      const k = P.kind || kind;
      Fg.poses[name] = [0, 1, 2].map(() => { const d = drawPose(g, P, k, col); d.setAttribute("visibility", "hidden"); return d; });
    });
    Fg.key = (t, name) => { Fg.keys.push([t, name]); return Fg; };
    FIGS.push(Fg);
    return Fg;
  };
  const VP = {
    stand: { la: [-16, -8], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    point: { la: [-16, -8], ra: [80, 76], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    pointUp: { la: [-16, -8], ra: [128, 140], ll: [-9, -4], rl: [9, 4], m: "big", look: 1 },
    type: { la: [52, 100], ra: [62, 104], ll: [-9, -4], rl: [9, 4], m: "flat", look: 1 },
    type2: { la: [58, 96], ra: [56, 108], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1 },
    wave: { la: [-16, -8], ra: [142, 168], ll: [-9, -4], rl: [9, 4], m: "big", look: 0.3 },
    cheer: { la: [-148, -170], ra: [148, 170], ll: [-12, -6], rl: [12, 6], m: "big", look: 0.2 },
    proud: { la: [-48, 42], ra: [48, -42], ll: [-11, -5], rl: [11, 5], m: "big", look: 0.5, tilt: -6 },
    oops: { la: [-62, -142], ra: [62, 142], ll: [-9, -4], rl: [9, 4], m: "o", look: 1 },
    freeze: { la: [-34, -20], ra: [44, 70], ll: [-9, -4], rl: [9, 4], m: "flat", look: 0, shut: 1 },
    think: { la: [-16, -8], ra: [60, -144], ll: [-9, -4], rl: [9, 4], m: "flat", look: 1, tilt: 6 },
    salute: { la: [-16, -8], ra: [100, -173], ll: [-9, -4], rl: [9, 4], m: "smile", look: 1, brow: 1 },
    shrug: { la: [-70, -150], ra: [70, 150], ll: [-9, -4], rl: [9, 4], m: "flat", look: 0, tilt: -8 },
    pen: { la: [-16, -8], ra: [72, 124], ll: [-9, -4], rl: [9, 4], m: "flat", look: 1, pen: 1, penBlue: 1 },
  };
  const HP = { htype: { ...VP.type, kind: "human", m: "smile" }, htype2: { ...VP.type2, kind: "human" } };
  const CP = {
    walk: { la: [24, 12], ra: [-20, -8], ll: [-16, -30], rl: [20, 10], m: "frown", look: -1, brow: 1 },
    pen: { la: [-16, -8], ra: [-62, -140], ll: [-9, -4], rl: [9, 4], m: "frown", look: -1, pen: 1, brow: 1 },
    pen2: { la: [-16, -8], ra: [-90, -150], ll: [-9, -4], rl: [9, 4], m: "flat", look: -1, pen: 1, brow: 1 },
    stand: { la: [-16, -8], ra: [16, 8], ll: [-9, -4], rl: [9, 4], m: "flat", look: -1, brow: 1 },
    reach: { la: [-16, -8], ra: [-150, -168], ll: [-9, -4], rl: [9, 4], m: "frown", look: -1, pen: 1, brow: 1 },
    reach2: { la: [-16, -8], ra: [-138, -178], ll: [-9, -4], rl: [9, 4], m: "flat", look: -1, pen: 1, brow: 1 },
  };
  const tag = (Fg) => {   // Valor's name tag on his chest, scaled so it stays readable
    const g = G(Fg.g, { opacity: 0 }), fs = Math.ceil(40 / Fg.s);
    rr(g, -66 * fs / 38, -118, 132 * fs / 38, 54, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 3 });
    T(g, "Valor", 0, -78, fs, INK, MID);
    return g;
  };

  // ---------- sections, ground, camera, the wipe ----------
  const SW = 2600;                                  // sections sit 2600 px apart on the board
  const HX = 175, GY = 1362, HS = 0.84;             // the hero's x, the ground line, his scale
  const pose = (s, fx = 540, fy = 960, sy = 960) => ({ s, x: 540 - s * fx, y: sy - s * fy });
  const camQ = [];
  const cam = (p, t, dur, ease = "sine.inOut") => camQ.push([t, p, dur, ease]);
  // base framing: the board drawn on x 50-1030 fills the phone-safe width (scale 1.07 inside the 0.8 safe frame), and the
  // stage sits high (design y 300 -> screen 200, the ground -> screen 1110), leaving the bottom for captions and the app's UI.
  // P(k, m, fx, fy): section k, zoomed m times around (fx, fy), which stays where the base framing puts it.
  const BS = 1.04, BX = -21.6, BYo = -238;
  const P = (k, m = 1, fx = 540, fy = 960) => { const s = BS * m; return { s, x: BS * fx + BX - s * (k * SW + fx), y: BS * fy + BYo - s * fy }; };
  const jolt = (k, m, fx, fy, t) => [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => { const p = P(k, m, fx, fy); cam({ s: p.s, x: p.x + dx, y: p.y + dy }, t + i * 0.045, 0.045, "none"); });
  TL_.captionY = 1390;
  const BG = el("rect", { x: -20, y: -20, width: 1120, height: 1960, fill: DT.PAPER }, null);
  svg.insertBefore(BG, SAFE);
  const WIPES = G(svg, { id: "wipes" });                              // above the board, below the captions (they are added after scene())
  const section = (k, dark, t0, t1) => {
    setTheme(dark);
    const g = G(D, { transform: `translate(${k * SW},0)` });
    if (t0 > 0) show(g, t0);
    if (t1 != null) hide(g, t1);
    rline(g, 84, GY, 1000, GY, { strokeWidth: 3, roughness: 1.2 });
    return { k, g, dark, back: G(g), mid: G(g), fig: G(g), top: G(g), fx: G(g) };
  };
  // the wipe into the next theme: a hachured band sweeps across and covers the frame by `tc`; then everything switches
  const wipe = (tc, toDark, dir = 1) => {
    const Pn = toDark ? DT : LT;
    const outer = G(WIPES, dir > 0 ? {} : { transform: "translate(1080,0) scale(-1,1)" });
    const g = G(outer, { opacity: 0 }), a = A(g, { x: -170, y: 0 });
    el("rect", { x: -1400, y: -40, width: 1402, height: 2000, fill: Pn.PAPER }, g);
    [0, 1, 2].forEach((i) => g.appendChild(rc.rectangle(-36 + i * 52, -60, 76, 2040, { fill: Pn.PAPER, fillStyle: "hachure", hachureGap: 11 + i * 7, fillWeight: 9 - i * 2.5, hachureAngle: 68, roughness: 2.2, stroke: "none", seed: 900 + i + Math.round(tc * 10) })));
    const d = 0.32;
    show(g, tc - d + 0.03);
    a.to({ x: 1080 + 230 }, tc - d + 0.03, d, "power2.in");
    tw(BG, { attr: { fill: toDark ? LT.PAPER : DT.PAPER } }, { attr: { fill: Pn.PAPER }, duration: 0.001 }, tc);
    hide(g, tc + 0.012);
  };

