// "How Valor works" in the SKETCH style (Excalidraw boards, rough.js lines that boil, a hand-drawn robot hero), after the Jev
// sketch reel (instagram.com/p/DezdIVCgTUw). The script and voice were first made for a mascot-style version.
// The reel mixes Excalidraw's two themes by story section, one board per section:
//   S0 dark  (v1-v2)   the hook: his real merge heatmap; nobody approves his merges
//   S1 light (v3-v7)   Tom's text, the reactions, the judge, the code scan + one question, the bad-idea pushback
//   S2 dark  (v8-v12)  the plan, the fresh critic, money/logins/data, three checks, the re-run, the merge
//   S3 light (v13-v15) the $2.97 receipt, the ledger notebook in pen, "refused"
//   S4 dark  (v16-v18) Tom texts "stop", the refusals, the work shuts down, the sent message
//   S5 light (v19-v21) 954 / 0 / 1, valorengels.com, Follow
// Between sections a hand-drawn wipe (a hachured band in the next theme's paper colour) sweeps across the frame; when it
// covers the frame the ground, the board and the camera cut together, and the captions take the new theme from that line on.
// Every shape is rough.js (roughness 1, fixed seeds), three variants that boil every 0.14 s from one time-driven clock.
// Illustrative: the request, code, plan notes, test names. Real: the heatmap (valorengels.com/activity.svg, 954 merged in
// 26 weeks), the stages, 69 calls / $2.97 (docs/mission.md), the ledger rules, stop. No company names, no email address.

// caption words the transcriber timed wrong: [word, built time, measured time] (measured from the voice track)
CAPFIX = [
  ["two", 61.363, 61.48], ["dollars", 61.729, 61.74], ["and", 62.094, 62.16], ["ninety-seven", 62.46, 62.40], ["cents", 62.826, 62.92],
  ["Nine", 87.36, 87.19], ["hundred", 87.563, 87.57], ["changes", 87.766, 87.92], ["Zero", 89.035, 88.79], ["human", 89.035, 89.18],
  ["clicks", 89.313, 89.42], ["And", 90.026, 90.06], ["one", 90.235, 90.43], ["word", 90.722, 90.78], ["stops", 91.157, 91.43],
  ["it", 91.661, 91.60], ["all", 91.818, 91.78],
];
const TL_ = T;   // the runtime timeline (scene() shadows T with its text helper)
const VTIME = { two: 61.48, nineSeven: 62.40, cents: 62.92, nine: 87.19, changes: 87.92, zero: 88.79, clicks: 89.42, one: 90.43, word: 90.78, stops: 91.43 };
// merged pull requests per day from 2026-04-27 (a Monday), 181 days, from valorengels.com/activity.svg (char code - 48)
const HEAT = "1593:001887401491710011628291<6560034?48616<35600;==5600:B89200@95250012;7922@;D:301K689522=1@;2104439J10914?701:750690>85>300?016B76L83031062584927=550120:504011039;00087101012?400";

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
      if (title) T(g, title, x + 128, y + bar / 2 + 14, 40, INK2);
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
    rpath(g, pl(limb(0, 0, P.ll, 84, 84)), o);
    rpath(g, pl(limb(0, 0, P.rl, 84, 84)), o);
    const up = G(g, { transform: `rotate(${P.lean || 0})` });
    rline(up, 0, 0, 0, -150, o);
    rpath(up, pl(limb(0, -128, P.la, 72, 66)), o);
    rpath(up, pl(limb(0, -128, P.ra, 72, 66)), o);
    const [hx, hy2] = limb(0, -128, P.ra, 72, 66)[2];
    if (P.pen) rline(up, hx - 6, hy2 + 10, hx + 24, hy2 - 46, { ...o, stroke: P.penBlue ? EX.blue : EX.red, strokeWidth: 8 });
    const hd = G(up, { transform: `rotate(${P.tilt || 0} 0 -150)` });
    const hy = -194, lk = (P.look || 0) * 6;
    if (kind === "robot") {
      rline(hd, 0, hy - 44, 2, hy - 78, { ...o, strokeWidth: 4.5 });
      rell(hd, 2, hy - 86, 20, 20, { ...o, strokeWidth: 4, fill: eye, fillStyle: "solid" });
      rr(hd, -52, hy - 44, 104, 90, { ...o, fill: PAPER, fillStyle: "solid" });
      if (P.shut) [-20, 20].forEach((ex) => rline(hd, ex - 9, hy - 8, ex + 9, hy - 8, { ...o, stroke: eye, strokeWidth: 4.5 }));
      else [-20, 20].forEach((ex) => el("circle", { cx: ex + lk, cy: hy - 8, r: 7.5, fill: eye }, hd));
      if (P.brow) { rline(hd, -36 + lk, hy - 32, -10 + lk, hy - 22, { ...o, strokeWidth: 4 }); rline(hd, 10 + lk, hy - 22, 36 + lk, hy - 32, { ...o, strokeWidth: 4 }); }
    } else {
      rell(hd, 0, hy, 86, 86, { ...o, fill: PAPER, fillStyle: "solid" });
      if (kind === "human") rpath(hd, `M-40 ${hy - 14} Q-30 ${hy - 50} 0 ${hy - 46} Q30 ${hy - 50} 40 ${hy - 14}`, { ...o, strokeWidth: 5 });
      if (kind === "dev") {
        rpath(hd, `M-42 ${hy - 6} Q-44 ${hy - 52} 0 ${hy - 50} Q44 ${hy - 52} 42 ${hy - 6} Q20 ${hy - 30} -8 ${hy - 28} Q-30 ${hy - 26} -42 ${hy - 6}`, { ...o, strokeWidth: 4, fill: col, fillStyle: "hachure", hachureGap: 9 });
        [-18, 18].forEach((ex) => rell(hd, ex + lk, hy - 2, 30, 26, { ...o, strokeWidth: 3 }));
      }
      [-14, 14].forEach((ex) => el("circle", { cx: ex + lk * (kind === "dev" ? 1.4 : 1), cy: hy - (kind === "dev" ? 2 : 6), r: 5, fill: col }, hd));
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
  const BS = 1.07, BX = -37.8, BYo = -265;
  const P = (k, m = 1, fx = 540, fy = 960) => { const s = BS * m; return { s, x: BS * fx + BX - s * (k * SW + fx), y: BS * fy + BYo - s * fy }; };
  const jolt = (k, m, fx, fy, t) => [[12, -8], [-10, 7], [6, -4], [-3, 2], [0, 0]].forEach(([dx, dy], i) => { const p = P(k, m, fx, fy); cam({ s: p.s, x: p.x + dx, y: p.y + dy }, t + i * 0.045, 0.045, "none"); });
  TL_.captionY = 1272;
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
    show(g, tc - d);
    a.to({ x: 1080 + 230 }, tc - d, d, "power2.in");
    tw(BG, { attr: { fill: toDark ? LT.PAPER : DT.PAPER } }, { attr: { fill: Pn.PAPER }, duration: 0.001 }, tc);
    hide(g, tc + 0.02);
  };

  // section switch times: the wipe covers the frame just before each section's first line
  const SWT = { 1: c("v3") - 0.03, 2: c("v8") - 0.03, 3: c("v13") - 0.03, 4: c("v16") - 0.03, 5: c("v19") - 0.03 };
  THEME_SW = [[SWT[1], "light"], [SWT[2], "dark"], [SWT[3], "light"], [SWT[4], "dark"], [SWT[5], "light"]];
  const END_T = c("v21", "_end") + 3;

  // ====================================================================================================
  // S0 DARK: v1-v2
  // ====================================================================================================
  const S0 = section(0, true, 0, SWT[1]);
  // ---- v1: his real merge heatmap fills; the counter rolls to 954 ----
  const hm = G(S0.mid), hmA = A(hm, { x: 0, y: 0, o: 1 });
  win(hm, 72, 430, 936, 600, "github.com/valorengels");
  const cnt = T(hm, "0", 100, 618, 112, EX.green);
  T(hm, "code changes merged", 380, 576, 42, INK);
  T(hm, "in the last 26 weeks", 380, 626, 40, INK2);
  const LV = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"].map(dk);
  const lv = (n) => (n === 0 ? 0 : n <= 3 ? 1 : n <= 7 ? 2 : n <= 13 ? 3 : 4);
  const days = [...HEAT].map((ch) => ch.charCodeAt(0) - 48);
  const CELL = 30, GAP = 4.6, HX0 = 96, HY0 = 690;
  const cols = [];
  const HR = rng(17);
  for (let w = 0; w < 26; w++) {
    const cg = G(hm, { "data-deco": 1 });
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d; if (i >= days.length) break;
      const x = HX0 + w * (CELL + GAP) + (HR() - 0.5) * 2, y = HY0 + d * (CELL + GAP) + (HR() - 0.5) * 2;
      el("rect", { x, y, width: CELL, height: CELL, rx: 6, fill: LV[lv(days[i])], transform: `rotate(${((HR() - 0.5) * 6).toFixed(1)} ${x + 15} ${y + 15})` }, cg);
    }
    cols.push(cg);
  }
  T(hm, "May", HX0, HY0 + 7 * (CELL + GAP) + 52, 42, INK2); T(hm, "Oct", HX0 + 22 * (CELL + GAP), HY0 + 7 * (CELL + GAP) + 52, 42, INK2);
  const csum = (n) => days.slice(0, n * 7).reduce((a, b) => a + b, 0);
  const W0 = 9, tFill1 = c("v1", "changes") + 0.1;
  cols.forEach((cg, w) => { if (w >= W0) show(cg, (tFill1 * (w - W0 + 1)) / (26 - W0)); });
  cnt.textContent = String(csum(W0));
  kit.counter(cnt, csum(W0), 954, 0.02, tFill1, (v) => String(Math.round(v)), "power1.out");
  const hmRing = rell(S0.fx, 200, 590, 250, 124, { stroke: EX.green, strokeWidth: 4, roughness: 1.4 });
  drawIn(hmRing, c("v1", "changes") + 0.15, 0.3);
  const n6 = note(S0.fx, ["in six months!"], 600, 1116, 54, EX.orange, c("v1", "six") - 0.05, { rot: -4, cps: 34 });
  const ar6 = arrow(S0.fx, 760, 1066, 800, 1020, { stroke: EX.orange, strokeWidth: 3.5 }, 0.2);
  drawIn(ar6, c("v1", "months") + 0.05, 0.2);
  // the engineer: a human typing at a laptop... then a scribble on "not" and the robot underneath
  laptop(S0.back, 300, 1196, 190);
  const v0 = figure(S0.fig, { ...HP, ...VP }, "robot", HX, GY, HS);
  const tag0 = tag(v0);
  v0.key(0, "htype"); for (let i = 1; i < 13; i++) v0.key(i * 0.3, i % 2 ? "htype2" : "htype");
  const scrG = G(S0.fx);
  const R0 = rng(41), sp = [];
  const headY = GY - 167 * HS - 194 * HS;
  for (let i = 0; i < 9; i++) sp.push(`${(HX - 40 + R0() * 80).toFixed(1)} ${(headY - 38 + i * 10 + R0() * 6).toFixed(1)}`);
  drawIn(rpath(scrG, "M" + sp.join(" L"), { stroke: EX.red, strokeWidth: 6, roughness: 1.8 }), c("v1", "not") - 0.06, 0.22);
  v0.key(c("v1", "human") - 0.02, "oops");
  hide(scrG, c("v1", "human") + 0.04, 0.12);
  headline(S0.top, "1 engineer", 0.02, c("v1", "hes") - 0.2, EX.blue, 100);
  headline(S0.top, "NOT human", c("v1", "hes") + 0.02, c("v2", "valor") - 0.3, EX.red, 108);
  cam(P(0, 1.0), 0, 0.01, "none");
  cam(P(0, 1.03, 540, 330), 0.02, c("v1", "hes") - 0.1, "sine.inOut");
  jolt(0, 1.03, 540, 330, c("v1", "human") + 0.04);
  // ---- v2: "Valor"; nobody approves his merges; how could that be safe? ----
  const t2 = c("v2");
  cam(P(0, 1.0), t2 + 0.05, 0.5, "expo.out");
  v0.key(c("v2", "valor") - 0.1, "wave");
  tw(tag0, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.2, ease: "expo.out" }, c("v2", "valor") - 0.05);
  headline(S0.top, "Valor", c("v2", "valor") - 0.05, c("v2", "no") - 0.12, EX.blue, 120);
  [hmRing, n6, ar6].forEach((n) => hide(n, c("v2", "name"), 0.2));
  hmA.to({ y: -60, o: 0 }, c("v2", "no") - 0.3, 0.24, "power2.in");
  // the merge card: his branch joins main; "approved by" stays empty
  const mg = G(S0.mid), mgA = A(mg, { x: 40, y: 0, o: 0 });
  const mgT = c("v2", "no") - 0.05;
  mgA.to({ o: 1, x: 0 }, mgT, 0.32, "expo.out");
  drawIn(win(mg, 320, 430, 700, 600, "merge: his change"), mgT, 0.4);
  const mainL = rline(mg, 370, 600, 970, 600, { strokeWidth: 5 });
  const brL = rpath(mg, "M450 600 Q520 690 620 690 L760 690 Q840 690 880 606", { stroke: EX.blue, strokeWidth: 5 });
  [[450, 600, INK], [620, 690, EX.blue], [760, 690, EX.blue]].forEach(([x, y, col]) => rell(mg, x, y, 26, 26, { stroke: col, fill: PAPER, fillStyle: "solid", strokeWidth: 4 }));
  T(mg, "main", 372, 574, 44, INK2); T(mg, "his change", 548, 756, 44, EX.blue);
  drawIn(mainL, mgT + 0.15, 0.3); drawIn(brL, mgT + 0.3, 0.45);
  const mNode = G(mg, { opacity: 0 });
  rell(mNode, 884, 600, 44, 44, { stroke: EX.green, fill: EX.greenF, fillStyle: "solid", strokeWidth: 4 });
  show(mNode, c("v2", "merges") - 0.05);
  T(mg, "approved by:", 370, 880, 48);
  rline(mg, 680, 890, 960, 890, { stroke: INK2, strokeWidth: 3 });
  const hum = G(mg, { opacity: 0 });   // a little human on "human", crossed out on "approves"
  rell(hum, 820, 816, 40, 40, { strokeWidth: 3.5 });
  rpath(hum, "M790 878 Q820 836 850 878", { strokeWidth: 3.5 });
  show(hum, c("v2", "human") - 0.05);
  drawIn(xmark(mg, 820, 846, 44), c("v2", "approves") - 0.02, 0.22);
  note(mg, ["nobody!"], 700, 984, 64, EX.red, c("v2", "before") - 0.05, { rot: -4, cps: 26 });
  v0.key(c("v2", "no") - 0.05, "point");
  v0.key(c("v2", "wanted") - 0.1, "think");
  // "how could that ever be safe": a shield with a question mark
  const sh = G(S0.fx), shA = A(sh, { x: 660, y: 1190, s: 0.5, o: 0, r: -6 });
  rpath(sh, "M0 -100 L84 -70 Q86 28 0 96 Q-86 28 -84 -70 Z", { stroke: EX.orange, fill: cx("#ffd8a8"), fillStyle: "hachure", strokeWidth: 5, hachureGap: 14 });
  T(sh, "?", 0, 40, 120, EX.orange, { ...MID, ...HALO() });
  shA.to({ o: 1, s: 1, r: 4 }, c("v2", "safe") - 0.12, 0.3, "back.out(2)");
  note(S0.fx, ["safe??"], 780, 1210, 64, EX.orange, c("v2", "safe") - 0.04, { rot: 4, cps: 22 });
  cam(P(0, 1.05, 640, 800), c("v2", "so") - 0.1, 2.4, "sine.inOut");

  // ====================================================================================================
  // S1 LIGHT: v3-v7
  // ====================================================================================================
  wipe(SWT[1], false, 1);
  const S1 = section(1, false, SWT[1], SWT[2]);
  cam(P(1, 1.0), SWT[1], 0.001, "none");
  const v1f = figure(S1.fig, VP, "robot", HX, GY, HS);
  show(tag(v1f), SWT[1]);
  v1f.key(0, "stand");
  // ---- v3: the chat with Tom ----
  const ph = G(S1.mid), phA = GA(ph, { x: 0, y: 30, o: 0 });
  const tPh = SWT[1] + 0.06;
  phA.to({ o: 1, y: 0 }, tPh, 0.3, "expo.out");
  drawIn(win(ph, 320, 430, 700, 660, null, 0), tPh, 0.4);
  const tomPh = photo(ph, 410, 516, 48);
  const tomPA = A(tomPh, { x: 0, y: 0, s: 1 });
  T(ph, "Tom", 482, 512, 56);
  const tomSub = T(ph, "typing...", 484, 560, 42, INK2);
  const onl = T(ph, "online", 484, 560, 42, EX.green, { opacity: 0 });
  rline(ph, 340, 594, 1000, 594, { strokeWidth: 2.5, roughness: 0.8 });
  rr(ph, 540, 630, 460, 92, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 2.5 });   // his reply yesterday
  T(ph, "shipped the export fix", 562, 688, 38, INK);
  const bub = rr(ph, 350, 770, 560, 176, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5 });
  const RQ = ["add dark mode to", "the settings page"];
  const rqL = RQ.map((_, i) => T(ph, "", 378, 836 + i * 62, 50));
  const tTy0 = c("v3", "one") - 0.05;
  show(bub, tTy0 - 0.08, 0.08);
  typeLines(rqL, RQ, tTy0, c("v3", "tom") - 0.1, 5);
  hide(tomSub, c("v3", "sends")); show(onl, c("v3", "sends") + 0.01);
  tomPA.to({ s: 1.14 }, c("v3", "tom") - 0.05, 0.14, "power2.out").to({ s: 1 }, c("v3", "tom") + 0.1, 0.25, "back.out(2)");
  const nTom = note(S1.fx, ["he built Valor"], 520, 395, 50, EX.violet, c("v3", "built") - 0.1, { rot: -3, cps: 28 });
  const arTom = arrow(S1.fx, 510, 384, 450, 466, { stroke: EX.violet, strokeWidth: 3.5 }, 0.25);
  drawIn(arTom, c("v3", "him") + 0.05, 0.22);
  [nTom, arTom].forEach((n) => hide(n, c("v4", "eyes") - 0.2, 0.2));
  v1f.key(c("v3", "text") - 0.1, "point");
  v1f.key(c("v3", "teammate") - 0.1, "stand");
  // "like to any teammate": the chats he works in
  const chW = G(S1.mid);
  [["Telegram", 480], ["Slack", 700], ["email", 880]].forEach(([s, x], i) => {
    const pg = pill(chW, s, x, 1160, EX.blue, EX.blueF, 44), pa = A(pg, { x: 0, y: 0, o: 0 });
    pa.to({ o: 1 }, c("v3", "any") - 0.05 + i * 0.12, 0.2, "back.out(2)");
  });
  // ---- v4: eyes (read), then a salute (on it) ----
  const reE = G(ph), reEA = A(reE, { x: 420, y: 1000, s: 0.3, o: 0 });
  rr(reE, -62, -40, 124, 80, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  [-22, 22].forEach((dx) => { rell(reE, dx, 0, 36, 46, { strokeWidth: 3, fill: PAPER, fillStyle: "solid" }); el("circle", { cx: dx + 5, cy: 6, r: 8, fill: INK }, reE); });
  reEA.to({ o: 1, s: 1 }, c("v4", "eyes") - 0.04, 0.26, "back.out(2.4)");
  const stRead = note(ph, ["read"], 500, 1014, 44, EX.blue, c("v4", "read") - 0.05, { cps: 20 });
  const reS = G(ph), reSA = A(reS, { x: 420, y: 1000, s: 0.3, o: 0 });
  rr(reS, -62, -40, 124, 80, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  rell(reS, 0, 2, 58, 58, { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 3 });
  [-10, 10].forEach((dx) => el("circle", { cx: dx, cy: 0, r: 4, fill: INK }, reS));
  rpath(reS, "M-9 14 Q0 20 9 14", { strokeWidth: 3, roughness: 0.4 });
  rpath(reS, "M8 -30 L40 -8 L32 2 L2 -18 Z", { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 3 });
  reEA.to({ o: 0, s: 0.6 }, c("v4", "salute") - 0.06, 0.1, "power2.in");
  reSA.to({ o: 1, s: 1 }, c("v4", "salute") + 0.02, 0.26, "back.out(2.4)");
  hide(stRead, c("v4", "salute") - 0.04, 0.1);
  note(ph, ["on it: task started"], 500, 1014, 44, EX.green, c("v4", "hes") - 0.1, { cps: 30 });
  v1f.key(c("v4", "eyes") - 0.05, "point");
  v1f.key(c("v4", "salute") - 0.04, "salute");
  v1f.key(c("v4", "on") + 0.3, "stand");
  cam(P(1, 1.04, 660, 840), c("v4", "eyes") - 0.2, 0.7, "power3.out");
  cam(P(1, 1.0), c("v5") - 0.25, 0.4, "power3.inOut");
  // ---- the request becomes a sticky note pinned at the top (carried through v5-v7) ----
  const stk = G(S1.top), stkA = GA(stk, { x: 760, y: 344, s: 0.6, o: 0, r: 3 });
  rr(stk, -250, -78, 500, 156, { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 2.5 });
  T(stk, "the request:", -222, -24, 38, INK2);
  T(stk, "dark settings page", -222, 40, 50, INK);
  const tV5 = c("v5") - 0.15;
  phA.to({ o: 0, y: -40 }, tV5 - 0.05, 0.25, "power2.in");
  hide(chW, tV5 - 0.05, 0.2);
  stkA.to({ o: 1, s: 1, r: 3 }, tV5 + 0.1, 0.32, "back.out(1.6)");
  // ---- v5: the judge (one quick AI call): clear or vague? ----
  const jd = G(S1.mid), jdA = GA(jd, { x: 0, y: 30, o: 0 });
  const tJ = c("v5") - 0.02;
  jdA.to({ o: 1, y: 0 }, tJ, 0.3, "expo.out");
  drawIn(win(jd, 320, 470, 700, 640, "judge"), tJ, 0.4);
  pill(jd, "1 quick AI call", 530, 600, EX.violet, EX.violetF, 42);
  note(jd, ["costs under 5 cents"], 360, 700, 40, INK2, c("v5", "call") + 0.1, { cps: 34 });
  const GX = 670, GYc = 1000, GR = 220;
  const arc1 = rarc(jd, GX, GYc, GR * 2, GR * 2, Math.PI, Math.PI * 1.5, { stroke: EX.green, strokeWidth: 7 });
  const arc2 = rarc(jd, GX, GYc, GR * 2, GR * 2, Math.PI * 1.5, Math.PI * 2, { stroke: EX.orange, strokeWidth: 7 });
  for (let i = 0; i <= 10; i++) { const an = Math.PI + (i * Math.PI) / 10; rline(jd, GX + Math.cos(an) * (GR - 34), GYc + Math.sin(an) * (GR - 34), GX + Math.cos(an) * (GR - 14), GYc + Math.sin(an) * (GR - 14), { strokeWidth: 2.5, roughness: 0.6, stroke: INK2 }); }
  T(jd, "clear", GX - GR - 10, GYc + 64, 50, EX.green);
  T(jd, "vague", GX + GR + 10, GYc + 64, 50, EX.orange, END);
  drawIn(arc1, tJ + 0.25, 0.4); drawIn(arc2, tJ + 0.4, 0.4);
  const ndl = G(jd), ndA = GA(ndl, { x: GX, y: GYc, r: 0 });
  rline(ndl, 0, 0, 0, -GR + 46, { strokeWidth: 7, roughness: 0.8 });
  rell(ndl, 0, 0, 34, 34, { fill: INK, fillStyle: "solid", strokeWidth: 3 });
  ndA.to({ r: -34 }, c("v5", "judges") - 0.05, 0.5, "sine.inOut").to({ r: 22 }, c("v5", "request"), 0.5, "sine.inOut")
    .to({ r: -56 }, c("v5", "clear") - 0.08, 0.3, "power3.out").to({ r: 64 }, c("v5", "vague") - 0.12, 0.34, "back.out(1.8)");
  const ringC = rell(jd, GX - GR + 52, GYc + 48, 190, 86, { stroke: EX.green, strokeWidth: 3.5 }); drawIn(ringC, c("v5", "clear") - 0.02, 0.22); hide(ringC, c("v5", "or"), 0.12);
  drawIn(rell(jd, GX + GR - 54, GYc + 48, 200, 86, { stroke: EX.orange, strokeWidth: 4 }), c("v5", "vague") - 0.02, 0.24);
  v1f.key(c("v5", "judges") - 0.1, "think");
  v1f.key(c("v5", "vague") - 0.05, "point");
  // ---- v6: he reads the code, then asks one question ----
  jdA.to({ o: 0, y: -40 }, c("v6", "he") - 0.35, 0.22, "power2.in");
  const cd = G(S1.mid), cdA = GA(cd, { x: 0, y: 30, o: 0 });
  const tC = c("v6", "he") - 0.12;
  cdA.to({ o: 1, y: 0 }, tC, 0.3, "expo.out");
  drawIn(win(cd, 320, 470, 700, 700, "the app's code"), tC, 0.4);
  ["theme.ts", "SettingsPage.tsx", "Appearance.tsx", "layout.tsx", "colors.ts"].forEach((f, i) => {
    const y = 600 + i * 66;
    const hl = rr(cd, 346, y - 42, 520, 56, { stroke: "none", fill: EX.yellowF, fillStyle: "solid", boil: false });
    const ts = c("v6", "reads") + i * 0.22;
    tw(hl, { opacity: 0 }, { opacity: 0.85, duration: 0.06 }, ts); tw(hl, { opacity: 0.85 }, { opacity: 0, duration: 0.15, immediateRender: false }, ts + 0.24);
    M(cd, f, 366, y, 40, INK);
    drawIn(tick(cd, 930, y - 14, 0.9), ts + 0.2, 0.14);
  });
  const qn = G(cd), qnA = A(qn, { x: 0, y: 40, o: 0, r: -2 });
  rr(qn, 350, 930, 640, 210, { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 2.5 });
  T(qn, "1 question:", 380, 984, 40, INK2);
  T(qn, "follow the phone, or always", 380, 1036, 44, INK);
  T(qn, "dark?   my default: phone", 380, 1090, 44, INK);
  qnA.to({ o: 1, y: 0, r: -2 }, c("v6", "asks") - 0.1, 0.32, "back.out(1.5)");
  const n1q = note(S1.fx, ["just one!"], 56, 906, 48, EX.blue, c("v6", "cant") - 0.15, { rot: -5, cps: 24 });
  v1f.key(c("v6", "reads") - 0.1, "think"); v1f.key(c("v6", "asks") - 0.1, "pointUp");
  // ---- v7: a bad idea? he says so first ----
  cdA.to({ o: 0, y: -40 }, c("v7", "and") - 0.1, 0.22, "power2.in");
  hide(n1q, c("v7", "and") - 0.1, 0.2);
  drawIn(rell(S1.fx, 812, 370, 330, 84, { stroke: EX.red, strokeWidth: 5, roughness: 1.5 }), c("v7", "bad") - 0.06, 0.26);
  note(S1.fx, ["?!"], 420, 386, 110, EX.red, c("v7", "idea") - 0.02, { cps: 12 });
  v1f.key(c("v7", "bad") - 0.05, "oops");
  const sb = G(S1.mid), sbA = GA(sb, { x: 0, y: 30, o: 0 });
  rpath(sb, "M340 500 L1000 500 Q1020 500 1020 520 L1020 860 Q1020 880 1000 880 L420 880 L310 980 L360 880 L340 880 Q320 880 320 860 L320 520 Q320 500 340 500 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  T(sb, "wait! dark on just ONE page", 356, 590, 46, INK);
  T(sb, "would look broken.", 356, 652, 46, INK);
  note(sb, ["simpler: one switch,", "the whole app"], 356, 756, 52, EX.green, c("v7", "before") - 0.1, { cps: 30 });
  sbA.to({ o: 1, y: 0 }, c("v7", "and") + 0.15, 0.3, "back.out(1.4)");
  v1f.key(c("v7", "says") - 0.1, "pointUp");
  cam(P(1, 1.03, 620, 700), c("v7", "says") - 0.2, 1.4, "sine.inOut");

  // ====================================================================================================
  // S2 DARK: v8-v12
  // ====================================================================================================
  wipe(SWT[2], true, -1);
  const S2 = section(2, true, SWT[2], SWT[3]);
  cam(P(2, 1.0), SWT[2], 0.001, "none");
  const v2f = figure(S2.fig, VP, "robot", HX, GY, HS);
  show(tag(v2f), SWT[2]);
  v2f.key(0, "stand");
  // ---- v8: the plan; a fresh critic, walled off from Valor's reasoning, tries to prove it wrong ----
  const pn = G(S2.mid), pnA = GA(pn, { x: 0, y: 30, o: 0 });
  const tP = SWT[2] + 0.06;
  pnA.to({ o: 1, y: 0 }, tP, 0.3, "expo.out");
  drawIn(win(pn, 320, 400, 700, 480, "plan.md"), tP, 0.4);
  const PLAN = ["1. one switch, whole app", "2. every page reads it", "3. test light and dark"];
  const pnL = PLAN.map((_, i) => T(pn, "", 350, 540 + i * 84, 46));
  typeLines(pnL, PLAN, c("v8", "writes") - 0.1, c("v8", "brand") - 0.15, 9);
  v2f.key(c("v8", "writes") - 0.1, "pen"); v2f.key(c("v8", "brand") - 0.15, "point");
  // his reasoning: a thought cloud over Valor
  const cl = G(S2.fx), clA = A(cl, { x: 205, y: 900, s: 0.4, o: 0 });
  rell(cl, 0, 0, 230, 104, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  rell(cl, -40, 70, 26, 20, { strokeWidth: 2.5 }); rell(cl, -56, 96, 14, 12, { strokeWidth: 2.5 });
  T(cl, "his notes", 0, 14, 42, INK, MID);
  clA.to({ o: 1, s: 1 }, c("v8", "plan") - 0.1, 0.3, "back.out(2)");
  // the critic walks in; a wall goes up between them on "never saw"
  const crit = figure(S2.fig, CP, "robot", 1330, GY, 0.66, EX.red);
  crit.key(0, "walk");
  crit.a.to({ x: 985 }, c("v8", "brand") - 0.1, 0.55, "power2.out");
  crit.key(c("v8", "brand") + 0.45, "stand");
  const nCr = note(S2.fx, ["a fresh AI"], 660, 950, 60, EX.red, c("v8", "new") - 0.05, { rot: -3, cps: 34 });
  const wall = G(S2.fx), wallA = A(wall, { x: 0, y: 0, o: 1 });
  rr(wall, 560, 960, 64, 400, { stroke: INK2, fill: INK2, fillStyle: "cross-hatch", strokeWidth: 4, hachureGap: 16, fillWeight: 1.5 });
  for (let i = 1; i < 8; i++) rline(wall, 562, 960 + i * 50, 622, 960 + i * 50, { stroke: INK, strokeWidth: 3, roughness: 0.8 });
  drawIn(wall, c("v8", "never") - 0.1, 0.35);
  const nCr2 = note(S2.fx, ["never saw", "his reasoning"], 660, 1012, 44, EX.red, c("v8", "saw") - 0.05, { rot: -3, cps: 40 });
  // "tries to prove the plan wrong": the critic walks up to the plan and marks it in red
  [nCr, nCr2].forEach((n) => hide(n, c("v8", "tries") - 0.1, 0.15));
  crit.a.to({ x: 800 }, c("v8", "tries") - 0.05, 0.4, "power2.inOut");
  crit.key(c("v8", "tries") - 0.05, "walk");
  [0, 1, 2, 3, 4].forEach((i) => crit.key(c("v8", "prove") - 0.05 + i * 0.18, i % 2 ? "reach" : "reach2"));
  drawIn(scribble(pn, 350, 720, 556, EX.red, 31), c("v8", "prove") - 0.02, 0.22);
  drawIn(rell(pn, 576, 608, 500, 82, { stroke: EX.red, strokeWidth: 4, roughness: 1.6 }), c("v8", "plan") + 0.05, 0.25);
  const crQ = note(pn, ["prove it."], 700, 830, 54, EX.red, c("v8", "wrong") - 0.05, { rot: -6, cps: 36 });
  crit.a.to({ x: 990 }, c("v9", "if") - 0.1, 0.4, "power2.inOut");
  crit.key(c("v9", "if") - 0.1, "walk"); crit.key(c("v9", "if") + 0.3, "stand");
  wallA.to({ o: 0 }, c("v9", "if") - 0.1, 0.2); clA.to({ o: 0 }, c("v9", "if") - 0.1, 0.2);
  hide(crQ, c("v9", "plan") - 0.3, 0.15);
  v2f.key(c("v8", "tries") - 0.05, "think");
  // ---- v9: money, logins, stored data: two rounds ----
  const rk = G(S2.mid), rkA = GA(rk, { x: 0, y: 30, o: 0 });
  const tR = c("v9", "if") + 0.05;
  rkA.to({ o: 1, y: 0 }, tR, 0.3, "expo.out");
  drawIn(win(rk, 320, 920, 550, 380, "if it touches", 64), tR, 0.35);
  [
    ["money", c("v9", "money"), (g, x, y) => { rell(g, x, y, 84, 84, { stroke: EX.orange, fill: cx("#ffd8a8"), fillStyle: "hachure", strokeWidth: 4, hachureGap: 10 }); T(g, "$", x, y + 20, 58, EX.orange, { ...MID, ...HALO() }); }],
    ["logins", c("v9", "logins"), (g, x, y) => { rr(g, x - 34, y - 4, 68, 52, { stroke: EX.violet, fill: EX.violetF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 10 }); rpath(g, `M${x - 20} ${y - 4} L${x - 20} ${y - 24} Q${x} ${y - 52} ${x + 20} ${y - 24} L${x + 20} ${y - 4}`, { stroke: EX.violet, strokeWidth: 4 }); }],
    ["stored data", c("v9", "stored"), (g, x, y) => { rell(g, x, y - 26, 76, 24, { stroke: EX.blue, strokeWidth: 4 }); rpath(g, `M${x - 38} ${y - 26} L${x - 38} ${y + 26} Q${x} ${y + 44} ${x + 38} ${y + 26} L${x + 38} ${y - 26}`, { stroke: EX.blue, fill: EX.blueF, fillStyle: "hachure", strokeWidth: 4, hachureGap: 10 }); rpath(g, `M${x - 38} ${y} Q${x} ${y + 18} ${x + 38} ${y}`, { stroke: EX.blue, strokeWidth: 3 }); }],
  ].forEach(([lb, t, draw], i) => {
    const g = G(rk), a = A(g, { x: 0, y: 0, o: 0 });
    const x = 395 + i * 175, y = 1090;
    draw(g, x, y);
    lb.split(" ").forEach((w, k, arr) => T(g, arr.length > 1 ? w : lb, x, y + 104 + k * 42, 40, INK, MID));
    a.to({ o: 1 }, t - 0.08, 0.2, "back.out(2)");
  });
  const rd = G(S2.mid), rdA = GA(rd, { x: 0, y: 20, o: 0, r: 2 });
  rr(rd, 740, 730, 250, 130, { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 2.5 });
  T(rd, "rounds:", 760, 818, 40, INK);
  T(rd, "1", 920, 820, 60, INK, MID);
  rdA.to({ o: 1, y: 0, r: 2 }, c("v9", "plan") - 0.25, 0.3, "back.out(1.4)");
  drawIn(scratch(rd, 900, 772, 40, 56, EX.red, 5), c("v9", "two") - 0.12, 0.18);
  note(rd, ["2"], 966, 822, 66, EX.red, c("v9", "two") + 0.04, { anchor: "middle", cps: 10 });
  drawIn(scribble(pn, 350, 720, 640, EX.red, 33), c("v9", "rounds") - 0.05, 0.2);
  drawIn(scribble(pn, 350, 720, 724, EX.red, 34), c("v9", "of") - 0.05, 0.2);
  [0, 1, 2].forEach((i) => crit.key(c("v9", "rounds") - 0.1 + i * 0.16, i % 2 ? "pen" : "pen2"));
  crit.key(c("v9", "that") + 0.3, "stand");
  v2f.key(c("v9", "money") - 0.08, "point"); v2f.key(c("v9", "two") - 0.05, "pointUp");
  // ---- v10: he builds it; three checks at the same time ----
  const tB = c("v10", "then") - 0.12;
  [pnA, rkA, rdA].forEach((a, i) => a.to({ o: 0, y: -50 }, tB - 0.15 + i * 0.04, 0.22, "power2.in"));
  crit.a.to({ x: 1330 }, tB - 0.1, 0.4, "power2.in");
  const lp = G(S2.back), lpA = A(lp, { x: 0, y: 0, o: 0 });
  laptop(lp, 300, 1196, 190);
  lpA.to({ o: 1 }, tB, 0.2);
  [0, 1, 2, 3, 4, 5].forEach((i) => v2f.key(tB + i * 0.2, i % 2 ? "type2" : "type"));
  const cm = G(S2.mid), cmA = GA(cm, { x: 0, y: 30, o: 0 });
  cmA.to({ o: 1, y: 0 }, c("v10", "then") - 0.05, 0.3, "back.out(1.4)");
  rr(cm, 320, 400, 700, 170, { fill: PAPER, fillStyle: "solid", stroke: EX.blue, strokeWidth: 4 });
  T(cm, "his change", 350, 464, 44, INK2);
  M(cm, "a3f9c21", 990, 464, 42, INK2, END);
  const cmL = M(cm, "+ one theme switch", 350, 530, 44, EX.blue);
  typeOn(cmL, c("v10", "builds"), 0.6);
  const LN = [["tests", c("v10", "tests"), EX.green, EX.greenF], ["code review", c("v10", "review"), EX.violet, EX.violetF], ["docs", c("v10", "docs"), EX.blue, EX.blueF]];
  const lanes = LN.map(([lb, tw_, col, colF], i) => {
    const y = 620 + i * 150;
    const g = G(cm);
    rr(g, 320, y, 700, 120, { fill: PAPER, fillStyle: "solid" });
    T(g, lb, 350, y + 74, 48, INK);
    rr(g, 640, y + 40, 330, 44, { stroke: INK2, strokeWidth: 2.5 });
    const clip = el("clipPath", { id: `lane${i}`, clipPathUnits: "userSpaceOnUse" }, defs);
    const cr = el("rect", { x: 640, y: y + 36, width: 0, height: 52 }, clip);
    const barG = G(g, { "clip-path": `url(#lane${i})` });
    rr(barG, 642, y + 42, 326, 40, { stroke: col, fill: colF, fillStyle: "hachure", strokeWidth: 2, hachureGap: 9, fillWeight: 2.5 });
    const t0 = c("v10", "three") + 0.1, t1 = c("v12", "all") - 0.2 + i * 0.06;
    const k1 = t0 + (t1 - t0) * (0.55 + i * 0.12);
    tw(cr, { attr: { width: 0 } }, { attr: { width: 150 + i * 30 }, duration: k1 - t0, ease: "power1.inOut" }, t0);
    tw(cr, { attr: { width: 150 + i * 30 } }, { attr: { width: 330 }, duration: t1 - k1, ease: "power1.in" }, k1);
    const ring = rr(g, 316, y - 6, 704, 132, { stroke: col, strokeWidth: 4.5, roughness: 1.5 });
    drawIn(ring, tw_ - 0.05, 0.24); hide(ring, tw_ + 0.7, 0.2);
    drawIn(tick(g, 1000, y + 60, 1.1), c("v12", "pass") - 0.25 + i * 0.12, 0.16);
    return { g, y };
  });
  const nAt = note(S2.fx, ["all at once!"], 560, 350, 56, EX.orange, c("v10", "same") - 0.05, { rot: -3, cps: 28 });
  hide(nAt, c("v11", "the") - 0.05, 0.2);
  cam(P(2, 1.02, 640, 820), c("v10", "three") - 0.1, 1.8, "sine.inOut");
  // ---- v11: Valor's own report is not trusted; the reviewer re-runs every test ----
  const vs = G(S2.fx), vsA = A(vs, { x: 200, y: 840, o: 0, r: -4, s: 0.6 });
  rr(vs, -92, -92, 184, 184, { fill: EX.yellowF, fillStyle: "solid", stroke: cx("#e8b93a"), strokeWidth: 2.5 });
  T(vs, "Valor:", -72, -38, 38, INK2);
  T(vs, "tests", -72, 14, 44, INK);
  T(vs, "pass!", -72, 64, 44, INK);
  vsA.to({ o: 1, s: 1 }, c("v11", "reviewer") - 0.1, 0.28, "back.out(1.8)");
  v2f.key(c("v11", "reviewer"), "proud");
  drawIn(scratch(vs, -82, -80, 164, 160, EX.red, 9), c("v11", "word") - 0.1, 0.24);
  const nNo = note(S2.fx, ["not trusted"], 100, 994, 40, EX.red, c("v11", "for") - 0.05, { rot: -5, cps: 30 });
  v2f.key(c("v11", "word") + 0.05, "oops");
  // the re-run: 248 dots go green
  const rrn = G(S2.mid), rrnA = A(rrn, { x: 0, y: 30, o: 0 });
  const tRR = c("v11", "runs") - 0.15;
  [1, 2].forEach((i) => tw(lanes[i].g, { opacity: 1 }, { opacity: 0, duration: 0.15 }, tRR - 0.1));
  rrnA.to({ o: 1, y: 0 }, tRR, 0.28, "expo.out");
  rr(rrn, 320, 760, 700, 420, { fill: PAPER, fillStyle: "solid", stroke: EX.red, strokeWidth: 3.5 });
  T(rrn, "the reviewer runs them again", 350, 820, 44, EX.red);
  const rrC = T(rrn, "0 / 248", 990, 1150, 48, INK, END);
  const dots = G(rrn, { "data-deco": 1 });
  const DR = rng(5);
  const dotEls = [];
  for (let i = 0; i < 248; i++) {
    const col = i % 31, row = Math.floor(i / 31);
    dotEls.push(el("circle", { cx: 362 + col * 20.6 + (DR() - 0.5) * 2, cy: 866 + row * 30 + (DR() - 0.5) * 2, r: 7, fill: "none", stroke: INK2, "stroke-width": 2 }, dots));
  }
  const dp = { v: 0 }, tD0 = c("v11", "every") - 0.05, tD1 = c("v11", "itself") + 0.3;
  const paint = () => { const n = Math.round(dp.v); dotEls.forEach((d, i) => { const on = i < n; d.setAttribute("fill", on ? EX.green : "none"); d.setAttribute("stroke", on ? EX.green : INK2); }); rrC.textContent = `${n} / 248`; };
  paint();
  B.fromTo(dp, { v: 0 }, { v: 248, duration: tD1 - tD0, ease: "power1.in", immediateRender: false, onUpdate: paint }, tD0);
  // ---- v12: all three pass; it merges; no pull request, no human click ----
  const tM = c("v12", "when") - 0.1;
  rrnA.to({ o: 0, y: -30 }, tM - 0.2, 0.2, "power2.in");
  vsA.to({ o: 0 }, tM - 0.2, 0.2); hide(nNo, tM - 0.2, 0.2);
  [1, 2].forEach((i) => tw(lanes[i].g, { opacity: 0 }, { opacity: 1, duration: 0.2 }, tM));
  v2f.key(c("v12", "pass") - 0.1, "point");
  cmA.to({ o: 0, y: -40 }, c("v12", "the") - 0.2, 0.22, "power2.in");
  const gm = G(S2.mid), gmA = A(gm, { x: 0, y: 30, o: 0 });
  gmA.to({ o: 1, y: 0 }, c("v12", "the") - 0.02, 0.28, "expo.out");
  drawIn(win(gm, 320, 420, 700, 480, "main"), c("v12", "the"), 0.35);
  const mL2 = rline(gm, 360, 590, 990, 590, { strokeWidth: 6 });
  const bL2 = rpath(gm, "M420 590 Q480 690 580 690 L780 690 Q860 690 900 596", { stroke: EX.blue, strokeWidth: 6 });
  drawIn(mL2, c("v12", "the") + 0.1, 0.25); drawIn(bL2, c("v12", "code") - 0.05, 0.4);
  stamp(gm, "MERGED", 670, 810, 420, 120, EX.green, cx("#8ce99a"), c("v12", "merges") - 0.06, -5, 84, 61);
  jolt(2, 1.02, 640, 820, c("v12", "merges") + 0.07);
  const noPR = G(gm), noPRA = A(noPR, { x: 0, y: 0, o: 0 });
  pill(noPR, "pull request", 500, 980, INK2, EX.grayF, 44, "solid");
  noPRA.to({ o: 1 }, c("v12", "no") - 0.12, 0.18);
  drawIn(xmark(noPR, 500, 980, 60), c("v12", "request") - 0.1, 0.18);
  const noCl = G(gm), noClA = A(noCl, { x: 0, y: 0, o: 0 });
  pill(noCl, "human click", 820, 980, INK2, EX.grayF, 44, "solid");
  noClA.to({ o: 1 }, c("v12", "human") - 0.2, 0.18);
  drawIn(xmark(noCl, 820, 980, 60), c("v12", "click") - 0.1, 0.18);
  v2f.key(c("v12", "merges") - 0.05, "cheer"); v2f.key(c("v12", "no") + 0.2, "proud");

  // ====================================================================================================
  // S3 LIGHT: v13-v15
  // ====================================================================================================
  wipe(SWT[3], false, 1);
  const S3 = section(3, false, SWT[3], SWT[4]);
  cam(P(3, 1.0), SWT[3], 0.001, "none");
  const v3f = figure(S3.fig, VP, "robot", HX, GY, HS);
  show(tag(v3f), SWT[3]);
  v3f.key(0, "stand");
  // ---- v13: the receipt prints ----
  const rct = G(S3.mid), rcA = GA(rct, { x: 0, y: 0, o: 1 });
  const slot = rr(S3.top, 330, 392, 600, 30, { fill: INK, fillStyle: "solid", strokeWidth: 3 });
  drawIn(slot, SWT[3] + 0.04, 0.2);
  const rcClip = el("clipPath", { id: "rcclip", clipPathUnits: "userSpaceOnUse" }, defs);
  const rcR = el("rect", { x: 300, y: 410, width: 700, height: 0 }, rcClip);
  const rIn = G(rct, { "clip-path": "url(#rcclip)" });
  const RX = 370, RW = 520;
  rpath(rIn, `M${RX} 410 L${RX + RW} 410 L${RX + RW} 1180 ` + Array.from({ length: 13 }, (_, i) => `L${(RX + RW - (i + 0.5) * (RW / 13)).toFixed(1)} ${i % 2 ? 1180 : 1206} `).join("") + `L${RX} 1180 Z`, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  T(rIn, "ONE REAL FEATURE", RX + RW / 2, 486, 48, INK, MID);
  rline(rIn, RX + 30, 520, RX + RW - 30, 520, { strokeWidth: 2.5, strokeLineDash: [10, 10], roughness: 0.6 });
  const RL = [["AI calls", "69"], ["turns", "4"], ["fix round 1", "$0.89"], ["fix round 2", "$0.85"], ["everything else", "$1.23"]];
  const rlV = RL.map(([a, b], i) => { const y = 590 + i * 70 + (i >= 2 ? 26 : 0); M(rIn, a, RX + 30, y, 40, INK); return M(rIn, b, RX + RW - 30, y, 40, INK, END); });
  rlV[0].textContent = "0";
  kit.counter(rlV[0], 0, 69, c("v13", "took") - 0.1, c("v13", "69") - c("v13", "took") + 0.15, (v) => String(Math.round(v)), "power2.out");
  rline(rIn, RX + 30, 950, RX + RW - 30, 950, { strokeWidth: 2.5, strokeLineDash: [10, 10], roughness: 0.6 });
  T(rIn, "TOTAL", RX + 30, 1044, 56, INK);
  const tot = M(rIn, "—", RX + RW - 30, 1044, 60, INK, END);
  kit.counter(tot, 0, 2.97, VTIME.two - 0.08, VTIME.nineSeven - VTIME.two + 0.1, (v) => (v < 0.005 ? "—" : "$" + v.toFixed(2)), "power2.out");
  drawIn(rell(rct, RX + RW - 106, 1026, 230, 98, { stroke: EX.red, strokeWidth: 4.5 }), VTIME.nineSeven + 0.04, 0.24);
  const tPr0 = SWT[3] + 0.16, tPr1 = c("v13", "cost") - 0.1;   // the paper feeds out in steps
  tw(rcR, { attr: { height: 0 } }, { attr: { height: 820 }, duration: tPr1 - tPr0, ease: "steps(14)" }, tPr0);
  const n3 = note(S3.fx, ["under $3!"], 650, 1290, 60, EX.green, VTIME.cents - 0.1, { rot: -5, cps: 22 });
  v3f.key(c("v13", "real") - 0.1, "point"); v3f.key(c("v13", "69") - 0.05, "oops"); v3f.key(VTIME.nineSeven - 0.02, "cheer");
  // ---- v14: why trust it? the ledger, written in pen ----
  rcA.to({ o: 0, y: -60 }, c("v14", "so") - 0.15, 0.25, "power2.in");
  hide(slot, c("v14", "so") - 0.15, 0.2); hide(n3, c("v14", "so") - 0.15, 0.2);
  headline(S3.top, "why trust it?", c("v14", "so") - 0.02, c("v14", "every") - 0.1, INK, 130, 800, 40);
  v3f.key(c("v14", "why") - 0.1, "think");
  const nb = G(S3.mid), nbA = GA(nb, { x: 0, y: 30, o: 0 });
  const tN = c("v14", "every") - 0.12;
  nbA.to({ o: 1, y: 0 }, tN, 0.3, "expo.out");
  rr(nb, 330, 400, 690, 900, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  for (let i = 0; i < 9; i++) rell(nb, 330, 450 + i * 98, 34, 46, { strokeWidth: 3, fill: PAPER, fillStyle: "solid" });
  T(nb, "the ledger", 390, 474, 54, INK);
  pill(nb, "pen only", 920, 458, EX.blue, EX.blueF, 38, "solid");
  const ROWS = ["request received", "judged: vague", "question asked", "plan written", "critique done", "change built", "checks passed", "merged"];
  const rowY = (i) => 556 + i * 74;
  for (let i = 0; i < 10; i++) rline(nb, 380, rowY(i) + 18, 990, rowY(i) + 18, { stroke: cx("#a5d8ff"), strokeWidth: 2, roughness: 0.6 });
  const tR0 = c("v14", "step") - 0.05, tR1 = c("v14", "pen") - 0.25;
  const rowT = ROWS.map((_, i) => tR0 + ((tR1 - tR0) * i) / ROWS.length);
  ROWS.forEach((s, i) => { const nn = M(nb, String(i + 1), 388, rowY(i), 42, INK2); show(nn, rowT[i]); const e = T(nb, s, 450, rowY(i), 46, EX.blue); typeOn(e, rowT[i], 0.3); });
  const penG = G(S3.fx), penA = GA(penG, { x: 450, y: rowY(0) - 4, r: 0, o: 0 });   // the pen follows the writing
  rpath(penG, "M0 0 L-14 -40 L46 -170 L74 -156 L14 -26 Z", { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 3 });
  rpath(penG, "M0 0 L-14 -40 L14 -26 Z", { fill: INK, fillStyle: "solid", strokeWidth: 2 });
  penA.to({ o: 1 }, tR0 - 0.1, 0.1);
  ROWS.forEach((s, i) => penA.to({ x: 450 + s.length * 21, y: rowY(i) - 4 }, rowT[i], ((tR1 - tR0) / ROWS.length) * 0.9, "power1.inOut"));
  const nPen = note(S3.fx, ["pen, not pencil"], 560, 380, 52, EX.orange, c("v14", "pen") - 0.15, { rot: -3, cps: 30 });
  // "rows can be added": row 9 and a green plus
  const n9 = M(nb, "9", 388, rowY(8), 42, INK2); show(n9, c("v14", "added") - 0.25);
  const r9 = T(nb, "report sent", 450, rowY(8), 46, EX.green); typeOn(r9, c("v14", "added") - 0.25, 0.35);
  note(nb, ["+"], 960, rowY(8) + 6, 70, EX.green, c("v14", "added") - 0.02, { cps: 8, anchor: "middle" });
  penA.to({ x: 450 + 11 * 21, y: rowY(8) - 4 }, c("v14", "added") - 0.25, 0.35, "power1.inOut");
  penA.to({ x: 1100, y: 1250, o: 0 }, c("v14", "none") - 0.32, 0.25, "power2.in");
  // "none can be erased": an eraser rubs row 6 and bounces off
  const er = G(S3.fx), erA = GA(er, { x: 1150, y: rowY(5) - 16, r: -12, o: 0 });
  rr(er, -70, -30, 140, 60, { fill: cx("#ffc9c9"), fillStyle: "solid", stroke: EX.red, strokeWidth: 3 });
  rline(er, -24, -30, -24, 30, { stroke: EX.red, strokeWidth: 2.5 });
  const tE = c("v14", "none") - 0.15;
  erA.to({ o: 1, x: 820 }, tE, 0.25, "power2.out").to({ x: 760 }, tE + 0.25, 0.1, "sine.inOut").to({ x: 840 }, tE + 0.35, 0.1, "sine.inOut").to({ x: 1100, r: 20, y: rowY(5) - 120, o: 0 }, tE + 0.48, 0.3, "back.in(2)");
  const nNope = note(S3.fx, ["nope."], 820, rowY(5) - 128, 64, EX.red, c("v14", "erased") - 0.05, { rot: -6, cps: 14 });
  v3f.key(c("v14", "every"), "point"); v3f.key(c("v14", "added") - 0.1, "pointUp"); v3f.key(c("v14", "none") - 0.05, "stand");
  cam(P(3, 1.03, 650, 840), c("v14", "every"), 3.0, "sine.inOut");
  // ---- v15: not even Valor can change one; the database refuses ----
  hide(nPen, c("v15", "not") - 0.1, 0.2); hide(nNope, c("v15", "not") - 0.1, 0.2);
  note(S3.fx, ["Valor: change row 6?"], 380, 380, 50, EX.blue, c("v15", "valor") - 0.1, { cps: 34 });
  v3f.key(c("v15", "valor") - 0.1, "pen");
  const r6S = rline(nb, 446, rowY(5) - 14, 740, rowY(5) - 18, { stroke: EX.blue, strokeWidth: 5, roughness: 1.2 });
  drawIn(r6S, c("v15", "change") - 0.05, 0.2);
  hide(r6S, c("v15", "the") - 0.05, 0.1);
  stamp(S3.fx, "REFUSED", 680, 900, 520, 140, EX.red, cx("#ffc9c9"), c("v15", "refuses") - 0.08, -8, 96, 71);
  jolt(3, 1.03, 650, 840, c("v15", "refuses") + 0.05);
  v3f.key(c("v15", "refuses") - 0.05, "oops");

  // ====================================================================================================
  // S4 DARK: v16-v18
  // ====================================================================================================
  wipe(SWT[4], true, -1);
  const S4 = section(4, true, SWT[4], SWT[5]);
  cam(P(4, 1.0), SWT[4], 0.001, "none");
  const v4f = figure(S4.fig, VP, "robot", HX, GY, HS);
  show(tag(v4f), SWT[4]);
  v4f.key(0, "stand");
  // ---- v16: Tom texts "stop" ----
  const ch4 = G(S4.mid), ch4A = GA(ch4, { x: 0, y: 30, o: 0 });
  ch4A.to({ o: 1, y: 0 }, SWT[4] + 0.06, 0.3, "expo.out");
  drawIn(win(ch4, 320, 400, 700, 520, null, 0), SWT[4] + 0.06, 0.35);
  photo(ch4, 410, 484, 46);
  T(ch4, "Tom", 480, 498, 54);
  const ty4 = T(ch4, "typing...", 482, 542, 42, INK2); hide(ty4, c("v16", "stop") + 0.05);
  rr(ch4, 540, 590, 460, 84, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 2.5 });
  T(ch4, "merged: one theme switch", 560, 644, 36, INK);
  rline(ch4, 340, 556, 1000, 556, { strokeWidth: 2.5, roughness: 0.8 });
  const stb = rr(ch4, 350, 700, 260, 110, { fill: EX.grayF, fillStyle: "solid", strokeWidth: 2.5 });
  const stT = T(ch4, "stop", 384, 776, 66, INK);
  show(stb, c("v16", "tom") - 0.05, 0.08);
  typeOn(stT, c("v16", "word") - 0.05, c("v16", "stop") - c("v16", "word"));
  const okR = G(ch4), okRA = A(okR, { x: 470, y: 862, s: 0.3, o: 0 });
  rr(okR, -110, -38, 220, 76, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  T(okR, "stopped", 0, 14, 42, EX.red, MID);
  okRA.to({ o: 1, s: 1 }, c("v16", "thats") - 0.1, 0.24, "back.out(2.2)");
  const stopA = stamp(S4.fx, "STOP", 810, 760, 300, 150, EX.red, cx("#f29a9a"), c("v16", "stop") - 0.1, -6, 104, 81);
  jolt(4, 1.0, 540, 960, c("v16", "stop") + 0.03);
  v4f.key(c("v16", "tom") - 0.1, "point"); v4f.key(c("v16", "stop") - 0.08, "freeze");
  // the ledger strip: row 10, in red
  const lg4 = G(S4.mid), lg4A = GA(lg4, { x: 0, y: 30, o: 0 });
  lg4A.to({ o: 1, y: 0 }, c("v16", "texts"), 0.3, "expo.out");
  rr(lg4, 320, 950, 700, 310, { fill: PAPER, fillStyle: "solid" });
  T(lg4, "the ledger", 350, 990, 44, INK2);
  [["8", "merged"], ["9", "report sent"]].forEach(([n, s], i) => { M(lg4, n, 358, 1066 + i * 66, 42, INK2); T(lg4, s, 420, 1066 + i * 66, 48, INK); });
  const n10 = M(lg4, "10", 344, 1204, 42, INK2); show(n10, c("v16", "more") - 0.15);
  const r10 = T(lg4, "task stopped", 420, 1204, 52, EX.red); typeOn(r10, c("v16", "more") - 0.15, 0.4);
  drawIn(scribble(lg4, 420, 720, 1222, EX.red, 77), c("v16", "row") + 0.05, 0.22);
  // ---- v17: every call and every action checks that row first, and is refused; the work shuts down ----
  const t17 = c("v17") - 0.1;
  v4f.key(t17, "stand");
  ch4A.to({ o: 0, y: -40 }, t17 - 0.15, 0.22, "power2.in");
  stopA.to({ o: 0, s: 0.9 }, t17 - 0.15, 0.22, "power2.in");
  lg4A.to({ y: -540 }, t17, 0.45, "power3.inOut");
  const wl = G(S4.mid), wlA = A(wl, { x: 0, y: 0, o: 0 });
  wlA.to({ o: 1 }, t17 + 0.2, 0.2);
  drawIn(rr(wl, 760, 790, 70, 420, { stroke: EX.red, fill: cx("#f29a9a"), fillStyle: "hachure", strokeWidth: 5, hachureGap: 14, fillWeight: 3 }), t17 + 0.2, 0.35);
  const tS = c("v17", "within") - 0.35;
  const fly = (lb, yy, t, tChk) => {
    const g = G(S4.mid), a = GA(g, { x: 330, y: yy, o: 0, s: 0.6 });
    pill(g, lb, 0, 0, EX.blue, EX.blueF, 46, "solid");
    a.to({ o: 1, x: 470, s: 1 }, t, 0.35, "back.out(1.6)");
    const dl = rline(S4.fx, 520, yy - 40, 560, 690, { stroke: INK2, strokeWidth: 3, strokeLineDash: [8, 10], roughness: 0.6 });
    drawIn(dl, tChk, 0.2); hide(dl, c("v17", "gets") - 0.02, 0.1);
    a.to({ x: 600 }, c("v17", "gets") - 0.2, 0.18, "power2.in").to({ x: 430, r: -10 }, c("v17", "refused") - 0.02, 0.3, "back.out(1.6)");
    const xx = G(g, { opacity: 0 }); xmark(xx, 0, 0, 52); show(xx, c("v17", "refused") + 0.02);
    a.to({ o: 0 }, tS - 0.1, 0.2);
  };
  fly("AI call", 900, c("v17", "ai") - 0.1, c("v17", "checks") - 0.05);
  fly("action", 1080, c("v17", "action") - 0.15, c("v17", "row") - 0.1);
  const nRf = note(S4.fx, ["refused!"], 1010, 1300, 56, EX.red, c("v17", "gets") - 0.05, { rot: -5, cps: 30, anchor: "end" });
  v4f.key(c("v17", "every") + 0.1, "point");
  // the running work shuts down, one task after another
  wlA.to({ o: 0 }, tS - 0.1, 0.2);
  hide(nRf, c("v18") - 0.25, 0.2);
  const tk = G(S4.mid), tkA = A(tk, { x: 0, y: 30, o: 0 });
  tkA.to({ o: 1, y: 0 }, tS, 0.28, "expo.out");
  ["writing code", "running tests", "searching web"].forEach((s, i) => {
    const y = 800 + i * 150;
    rr(tk, 320, y, 700, 120, { fill: PAPER, fillStyle: "solid" });
    const run = G(tk), stp = G(tk, { opacity: 0 });
    T(tk, s, 350, y + 74, 48, INK);
    pill(run, "running", 900, y + 60, EX.green, EX.greenF, 38, "solid");
    pill(stp, "stopped", 900, y + 60, EX.red, EX.redF, 38, "solid");
    const ts = c("v17", "seconds") - 0.1 + i * 0.36;
    hide(run, ts, 0.06); show(stp, ts);
    drawIn(scribble(tk, 350, 640, y + 62, EX.red, 90 + i, 5), ts, 0.18);
  });
  const sw4 = G(S4.fx), sw4A = A(sw4, { x: 200, y: 800, o: 0, s: 0.6 });   // a stopwatch: within seconds
  rell(sw4, 0, 0, 110, 110, { fill: PAPER, fillStyle: "solid", strokeWidth: 4 });
  rline(sw4, 0, -56, 0, -72, { strokeWidth: 5 });
  const hand = G(sw4), handA = A(hand, { x: 0, y: 0, r: 0 });
  rline(hand, 0, 0, 0, -40, { stroke: EX.red, strokeWidth: 4.5, boil: false });
  sw4A.to({ o: 1, s: 1 }, c("v17", "within") - 0.1, 0.24, "back.out(2)");
  handA.to({ r: 270 }, c("v17", "within"), 1.4, "none");
  v4f.key(c("v17", "seconds") - 0.1, "oops"); v4f.key(c("v17", "shuts") - 0.05, "freeze");
  // ---- v18: a message already sent can't be pulled back ----
  const t18 = c("v18") - 0.1;
  tkA.to({ o: 0, y: -40 }, t18 - 0.15, 0.22, "power2.in");
  sw4A.to({ o: 0 }, t18 - 0.15, 0.2);
  lg4A.to({ o: 0 }, t18 - 0.15, 0.2);
  v4f.key(t18, "stand");
  const ob = G(S4.mid), obA = A(ob, { x: 0, y: 30, o: 0 });   // his outbox: the message leaves on "message"
  obA.to({ o: 1, y: 0 }, t18 + 0.02, 0.28, "expo.out");
  win(ob, 330, 780, 690, 250, "outbox");
  T(ob, "to: the team", 360, 906, 46, INK2);
  T(ob, "release notes", 360, 976, 52, INK);
  const obS = G(ob, { opacity: 0 }); pill(obS, "sent", 930, 950, EX.green, EX.greenF, 42, "solid"); show(obS, c("v18", "sent") - 0.05);
  const env = G(S4.mid), envA = GA(env, { x: 880, y: 930, s: 0.5, o: 0, r: 0 });
  rr(env, -110, -70, 220, 140, { fill: EX.blueF, fillStyle: "solid", stroke: EX.blue, strokeWidth: 4 });
  rpath(env, "M-104 -64 L0 10 L104 -64", { stroke: EX.blue, strokeWidth: 4 });
  envA.to({ o: 1, s: 1, y: 900 }, t18 + 0.05, 0.22, "back.out(1.8)")
    .to({ x: 900, y: 650, r: 12, s: 0.9 }, c("v18", "message") + 0.05, 0.5, "power2.inOut")
    .to({ x: 1050, y: 120, r: 24, s: 0.7 }, c("v18", "sent") - 0.1, 0.45, "power2.in");
  drawIn(rpath(S4.fx, "M880 860 Q890 740 920 660 Q960 590 990 510", { stroke: INK2, strokeWidth: 3, strokeLineDash: [10, 12], roughness: 0.8 }), c("v18", "message") + 0.1, 0.9);
  headline(S4.top, "already sent", c("v18", "already") - 0.05, null, INK, 84, 560, 40);
  const ret = arrow(S4.fx, 1010, 600, 760, 760, { stroke: EX.orange, strokeWidth: 5, strokeLineDash: [14, 12] }, -0.15);
  drawIn(ret, c("v18", "pulled") - 0.2, 0.32);
  drawIn(xmark(S4.fx, 892, 690, 58, EX.red, 9), c("v18", "back") - 0.05, 0.2);
  note(S4.fx, ["can't undo it"], 360, 1120, 58, EX.orange, c("v18", "cant") - 0.05, { rot: -3, cps: 36 });
  v4f.key(c("v18", "message") - 0.1, "point"); v4f.key(c("v18", "pulled") - 0.1, "shrug");

  // ====================================================================================================
  // S5 LIGHT: v19-v21
  // ====================================================================================================
  wipe(SWT[5], false, 1);
  const S5 = section(5, false, SWT[5], null);
  cam(P(5, 1.0), SWT[5], 0.001, "none");
  const v5f = figure(S5.fig, VP, "robot", HX, GY, HS);
  show(tag(v5f), SWT[5]);
  v5f.key(0, "stand");
  // ---- v19: 954 / 0 / 1 ----
  // each tile calls back to its scene: the activity grid, the crossed-out "human click", the STOP stamp
  const STAT = [["954", "changes", EX.green, VTIME.nine], ["0", "human clicks", INK, VTIME.zero], ["1", "word to stop", EX.red, VTIME.one]];
  const stG = STAT.map(([n, lb, col, t], i) => {
    const y = 420 + i * 270;
    const g = G(S5.mid), a = A(g, { x: 0, y: 20, o: 0 });
    rr(g, 320, y, 700, 230, { fill: PAPER, fillStyle: "solid" });
    const nt = T(g, n, 345, y + 160, 128, col);
    T(g, lb, 612, y + 76, 46, INK);
    if (i === 0) a.to({ o: 1, y: 0 }, SWT[5] + 0.04, 0.28, "back.out(1.4)");
    else a.to({ o: 0.3, y: 0 }, SWT[5] + 0.1 + i * 0.08, 0.28, "power2.out").to({ o: 1 }, t - 0.12, 0.16, "power2.out");
    if (i > 0) { const nh = G(g); nt.parentNode.removeChild(nt); nh.appendChild(nt); show(nh, t - 0.12, 0.08); }
    if (i === 0) { nt.textContent = "0"; kit.counter(nt, 0, 954, SWT[5] + 0.1, VTIME.changes - SWT[5] - 0.1, (v) => String(Math.round(v)), "power2.out"); }
    return { g, a, y };
  });
  const LVL = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const mg0 = G(stG[0].g, { "data-deco": 1 });
  for (let w = 0; w < 26; w++) {
    const cg = G(mg0);
    for (let d = 0; d < 4; d++) el("rect", { x: 612 + w * 14.6, y: stG[0].y + 110 + d * 14.6, width: 11.5, height: 11.5, rx: 2.5, fill: LVL[lv(days[w * 7 + d] || 0)] }, cg);
    show(cg, SWT[5] + 0.12 + (w * (VTIME.changes - SWT[5] - 0.2)) / 26);
  }
  const hc = G(stG[1].g);
  pill(hc, "human click", 740, stG[1].y + 160, INK2, EX.grayF, 42, "solid");
  drawIn(xmark(stG[1].g, 740, stG[1].y + 160, 56), VTIME.clicks - 0.05, 0.2);
  stamp(stG[2].g, "STOP", 720, stG[2].y + 162, 210, 84, EX.red, "#f29a9a", VTIME.word - 0.06, -6, 60, 83);
  v5f.key(VTIME.nine - 0.05, "point"); v5f.key(VTIME.zero - 0.05, "proud"); v5f.key(VTIME.stops - 0.05, "cheer");
  // ---- v20: valorengels.com ----
  const t20 = c("v20") - 0.12;
  stG.forEach((s, i) => s.a.to({ o: 0, y: -40 }, t20 - 0.15 + i * 0.04, 0.2, "power2.in"));
  const bw = G(S5.mid, { opacity: 0 });
  show(bw, t20 + 0.05);
  drawIn(win(bw, 60, 400, 960, 440, null, 76), t20 + 0.05, 0.45);
  const bwB = G(bw, { opacity: 0 });
  [0, 1, 2].forEach((i) => rell(bwB, 96 + i * 26, 438, 15, 15, { stroke: INK2, strokeWidth: 2.2, roughness: 0.6 }));
  rr(bwB, 200, 416, 760, 46, { stroke: INK2, strokeWidth: 2.2 });
  T(bwB, "https://valorengels.com", 226, 453, 40, INK2, { "data-deco": 1 });
  show(bwB, t20 + 0.3);
  const url = T(bw, "valorengels.com", 540, 650, 100, INK, MID);
  typeOn(url, c("v20", "whole") - 0.05, 0.7);
  drawIn(scribble(bw, 150, 930, 690, EX.blue, 99, 5), c("v20", "link") - 0.05, 0.35);
  note(bw, ["his whole design, public"], 540, 784, 48, EX.green, c("v20", "public") - 0.1, { anchor: "middle", cps: 34 });
  v5f.key(c("v20", "design") - 0.1, "point"); v5f.key(c("v20", "screen") - 0.05, "proud");
  // ---- v21: Follow (the cursor clicks it), then "send it to a developer" ----
  const fb = G(S5.mid), fbA = GA(fb, { x: 540, y: 960, s: 0.4, o: 0, r: -2 });
  const fbOff = G(fb), fbOn = G(fb, { opacity: 0 });
  rr(fbOff, -200, -66, 400, 132, { fill: EX.blueF, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  T(fbOff, "+ Follow", 0, 24, 66, INK, MID);
  rr(fbOn, -200, -66, 400, 132, { fill: PAPER, fillStyle: "solid", stroke: INK, strokeWidth: 5 });
  T(fbOn, "Following", 22, 22, 60, INK, MID);
  tick(fbOn, -142, 0, 1, EX.green, 6);
  const tF = c("v21", "follow") - 0.35;
  fbA.to({ o: 1, s: 1 }, tF, 0.4, "back.out(2)");
  const cur = G(S5.fx), curA = GA(cur, { x: 900, y: 1300, o: 0 });
  rpath(cur, "M0 0 L0 54 L13 42 L23 64 L33 60 L23 37 L41 37 Z", { stroke: INK, fill: PAPER, fillStyle: "solid", strokeWidth: 3.4, roughness: 0.7 });
  const tCk = c("v21", "follow") + 0.2;
  curA.to({ o: 1 }, tCk - 0.56, 0.01).to({ x: 600, y: 975 }, tCk - 0.54, 0.48, "power3.out");
  curA.to({ s: 0.84 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.12, "back.out(3)");
  fbA.to({ s: 0.92 }, tCk, 0.06, "power2.in").to({ s: 1 }, tCk + 0.06, 0.16, "back.out(3)");
  hide(fbOff, tCk + 0.04, 0.08); show(fbOn, tCk + 0.04);
  const crg = G(S5.fx), cra = GA(crg, { x: 600, y: 975, s: 0.3, o: 0 });
  rell(crg, 0, 0, 90, 90, { stroke: EX.blue, strokeWidth: 3.5, roughness: 1.2 });
  cra.to({ o: 1 }, tCk + 0.02, 0.01).to({ s: 1.4, o: 0 }, tCk + 0.03, 0.42, "power2.out");
  curA.to({ o: 0, x: 700, y: 1120 }, tCk + 0.7, 0.3, "power2.in");
  v5f.key(c("v21", "follow") - 0.1, "wave");
  // the developer who still reads every line, and a paper plane to him
  const devW = G(S5.fig, { opacity: 0 });
  const dev = figure(devW, { stand: { ...VP.stand, m: "flat", look: -1 }, read: { la: [-50, -150], ra: [50, 150], ll: [-9, -4], rl: [9, 4], m: "flat", look: 0 } }, "dev", 880, GY, 0.72);
  dev.key(0, "stand"); dev.key(c("v21", "reads") - 0.15, "read");
  show(devW, c("v21", "developer") - 0.2, 0.25);
  const devN = note(S5.fx, ["a developer"], 770, 1010, 46, INK2, c("v21", "developer") - 0.05, { cps: 30 });
  const pln = G(S5.fx), plA = GA(pln, { x: 620, y: 1010, s: 0.6, o: 0, r: -10 });
  rpath(pln, "M-50 10 L50 -20 L-10 30 Z", { fill: PAPER, fillStyle: "solid", strokeWidth: 3.5 });
  rpath(pln, "M-10 30 L0 6 L50 -20", { strokeWidth: 3 });
  plA.to({ o: 1, s: 1 }, c("v21", "send") - 0.15, 0.15).to({ x: 830, y: 1100, r: 20 }, c("v21", "send"), 0.55, "power2.inOut").to({ o: 0 }, c("v21", "send") + 0.56, 0.12);
  // his scroll of code unrolls to the floor on "every line"
  const scClip = el("clipPath", { id: "scclip", clipPathUnits: "userSpaceOnUse" }, defs);
  const scR = el("rect", { x: 780, y: 1120, width: 200, height: 0 }, scClip);
  const scIn = G(S5.fx, { "clip-path": "url(#scclip)" });
  rr(scIn, 800, 1120, 150, 236, { fill: PAPER, fillStyle: "solid", strokeWidth: 3 });
  for (let i = 0; i < 9; i++) rline(scIn, 814, 1146 + i * 24, 854 + ((i * 37) % 80), 1146 + i * 24, { stroke: INK2, strokeWidth: 3, roughness: 0.6 });
  tw(scR, { attr: { height: 0 } }, { attr: { height: 240 }, duration: 0.7, ease: "power2.out" }, c("v21", "every") - 0.25);
  hide(devN, c("v21", "reads") - 0.1, 0.15);
  // the end card stays alive: Valor keeps waving, Tom pops in with a thumbs-up, sparkles around the address
  v5f.key(c("v21", "send") - 0.05, "point");
  for (let k = 0; k < 8; k++) v5f.key(c("v21", "line") + 0.2 + k * 0.42, k % 2 ? "stand" : "wave");
  const tp = G(S5.fx), tpA = A(tp, { x: 0, y: 0, o: 0 });
  photo(tp, 560, 1196, 54);
  rr(tp, 628, 1178, 50, 46, { fill: cx("#ffd8a8"), fillStyle: "solid", strokeWidth: 3 });
  rr(tp, 640, 1132, 20, 50, { fill: cx("#ffd8a8"), fillStyle: "solid", strokeWidth: 3 });
  T(tp, "Tom", 560, 1300, 42, INK, MID);
  tpA.to({ o: 1 }, c("v21", "more") - 0.1, 0.25, "back.out(2)");
  const star = (x, y, r, t, col) => { const g = G(S5.fx), a = GA(g, { x, y, s: 0.2, o: 0 }); rpath(g, `M0 ${-r} Q4 -4 ${r} 0 Q4 4 0 ${r} Q-4 4 ${-r} 0 Q-4 -4 0 ${-r} Z`, { stroke: col, fill: col, fillStyle: "solid", strokeWidth: 2.5 }); a.to({ o: 1, s: 1 }, t, 0.3, "back.out(2.5)"); for (let k = 1; k < 9; k++) a.to({ s: k % 2 ? 0.75 : 1 }, t + 0.3 + k * 0.5, 0.25, "sine.inOut"); };
  star(100, 372, 24, c("v20", "link") + 0.1, EX.orange); star(1000, 368, 18, c("v20", "screen"), EX.blue); star(990, 880, 22, c("v21", "like"), EX.violet);

  cam(P(5, 1.02, 560, 820), c("v21", "follow"), 4, "sine.inOut");

  // ---------- the boil clock (the board holds still from "shuts down" to the next line: the work has stopped) ----------
  const FZ = c("v17", "shuts") - 0.02, FZ1 = c("v18") - 0.15;
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
  const CA = A(CAM, { x: 0, y: 0, s: 1 });
  camQ.sort((a, b) => a[0] - b[0]).forEach(([t, p, dur, ease]) => CA.to(p, t, dur, ease));
  return {};
}
