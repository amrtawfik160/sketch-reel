// Explainer reel runtime. The project's scenes.js defines `function scene(ctx)`;
// boot() loads fonts, builds the stage, calls scene(ctx), then wires formulas, rewind and the follow card.
// Every tween goes on ctx.B (the build timeline). The main timeline plays B, rewinds it, then shows the end card.
const K = {
  bg: "#0d1117", panel: "#11161d", white: "#e6edf3", soft: "#c9d1d9", dim: "#8b949e", label: "#a5aeb8", line: "#30363d",
  teal: "#39c5bb", gold: "#e3b341", green: "#3fb950", red: "#f85149", blue: "#58a6ff", purple: "#b083f0", orange: "#d97757",
};
const SERIF = "KaTeX_Main", MONO = "KaTeX_Typewriter", SANS = "Jakarta";
const NS = "http://www.w3.org/2000/svg";
const FXW = 840; // widest formula row, px: 120 px clear on each side

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function txt(parent, s, attrs) {
  const t = el("text", attrs, parent);
  t.textContent = s;
  return t;
}
function arrowHead(parent, x, y, angle, color) {
  return el("path", { d: "M0 0 L-16 -9 L-16 9Z", fill: color, transform: `translate(${x},${y}) rotate(${angle})` }, parent);
}
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeKit(B, D) {
  const pos = new Map();
  const kit = { pos };
  // Blurred copy behind a rect; pulse() makes it glow.
  kit.haloFor = (r, color) => {
    const h = el("rect", { fill: "none", stroke: color, "stroke-width": 9, filter: "url(#glow)", opacity: 0 }, null);
    ["x", "y", "width", "height", "rx", "ry"].forEach((k) => r.hasAttribute(k) && h.setAttribute(k, r.getAttribute(k)));
    r.parentNode.insertBefore(h, r);
    r._halo = h;
    return h;
  };
  // A rounded label. Measures its text, so call it only inside scene() (fonts are loaded by then).
  kit.chip = (text, color, font = SERIF, size = 30, parent = D) => {
    const g = el("g", { opacity: 0 }, parent);
    const r = el("rect", { rx: 12, ry: 12, fill: K.panel, stroke: color, "stroke-width": 3 }, g);
    const t = txt(g, text, { "font-family": font, "font-size": size, fill: color, "text-anchor": "middle", y: size * 0.34 });
    const w = t.getComputedTextLength() + 32, h = size + 26;
    r.setAttribute("x", -w / 2); r.setAttribute("y", -h / 2); r.setAttribute("width", w); r.setAttribute("height", h);
    g._w = w; g._h = h; g._r = r; g._t = t;
    kit.haloFor(r, color);
    return g;
  };
  // Centered rows of chips → Map(chip → [x, y]); out.rows = row count.
  kit.flow = (list, { top = 545, maxW = 860, gap = 12, rowH = 70, cx = 540 } = {}) => {
    const rows = [];
    let cur = [], w = 0;
    list.forEach((c) => {
      if (cur.length && w + gap + c._w > maxW) { rows.push(cur); cur = []; w = 0; }
      w += (cur.length ? gap : 0) + c._w; cur.push(c);
    });
    if (cur.length) rows.push(cur);
    const out = new Map();
    rows.forEach((row, ri) => {
      const total = row.reduce((a, c) => a + c._w, 0) + gap * (row.length - 1);
      let x = cx - total / 2;
      row.forEach((c) => { out.set(c, [x + c._w / 2, top + ri * rowH]); x += c._w + gap; });
    });
    out.rows = rows.length;
    return out;
  };
  // Position tracking keeps every move a fromTo with explicit start values (seek-safe, rewind-safe).
  kit.popIn = (c, xy, at, dur = 0.35) => {
    B.fromTo(c, { x: xy[0], y: xy[1], scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: dur, ease: "back.out(2.4)" }, at);
    pos.set(c, xy);
  };
  kit.moveTo = (c, xy, at, dur = 0.45, ease = "power3.inOut") => {
    const p = pos.get(c);
    if (!p) throw new Error("moveTo before popIn/place");
    B.fromTo(c, { x: p[0], y: p[1], scale: p[2] ?? 1 }, { x: xy[0], y: xy[1], scale: xy[2] ?? 1, duration: dur, ease, immediateRender: false }, at);
    pos.set(c, xy);
  };
  kit.place = (c, xy) => { B.set(c, { x: xy[0], y: xy[1], scale: xy[2] ?? 1 }, 0); pos.set(c, xy); };
  kit.pulse = (target, at, prop = "stroke-width", from = 3, to = 8) => {
    B.fromTo(target, { attr: { [prop]: from } }, { attr: { [prop]: to }, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at);
    if (target._halo) B.fromTo(target._halo, { opacity: 0 }, { opacity: 0.95, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at);
  };
  // Hidden until `at` (round caps would otherwise show as dots), then drawn along its length.
  kit.drawPath = (p, at, dur = 0.5, ease = "power2.inOut") => {
    const len = p.getTotalLength();
    B.fromTo(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len, opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
    B.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: dur, ease, immediateRender: false }, at);
  };
  kit.fadeIn = (t, at, dur = 0.3, to = 1) => B.fromTo(t, { opacity: 0 }, { opacity: to, duration: dur, ease: "power2.out" }, at);
  kit.fadeOut = (t, at, dur = 0.3, from = 1) => B.fromTo(t, { opacity: from }, { opacity: 0, duration: dur, ease: "power2.in", immediateRender: false }, at);
  // A glowing dot that travels a path; its position comes from a tweened proxy value.
  kit.dotAlong = (path, at, dur, color, parent = D) => {
    const d = el("circle", { r: 10, fill: color, opacity: 0, filter: "url(#glow)" }, parent);
    const core = el("circle", { r: 7, fill: color, opacity: 0 }, parent);
    const L = path.getTotalLength(), pr = { v: 0 };
    const place = () => { const q = path.getPointAtLength(pr.v * L); [d, core].forEach((c) => { c.setAttribute("cx", q.x); c.setAttribute("cy", q.y); }); };
    place();
    B.fromTo([d, core], { opacity: 0 }, { opacity: 1, duration: 0.08 }, at);
    B.fromTo(pr, { v: 0 }, { v: 1, duration: dur, ease: "power1.inOut", onUpdate: place }, at);
    B.fromTo([d, core], { opacity: 1 }, { opacity: 0, duration: 0.12, immediateRender: false }, at + dur);
  };
  // A rolling number written into a <text>; fmt(v) formats it.
  kit.counter = (textEl, from, to, at, dur, fmt = (v) => Math.round(v).toLocaleString("en-US"), ease = "power2.out") => {
    const o = { v: from };
    B.fromTo(o, { v: from }, { v: to, duration: dur, ease, onUpdate: () => (textEl.textContent = fmt(o.v)), immediateRender: false }, at);
  };
  // Camera: scale s around (540,960), framing focus point (fx,fy) at screen (540, sy).
  kit.camAt = (s, fx, fy, sy = 1000) => ({ scale: s, x: 540 - (540 + s * (fx - 540)), y: sy - (960 + s * (fy - 960)) });
  kit.toScreen = (p, c) => [540 + c.scale * (p[0] - 540) + c.x, 960 + c.scale * (p[1] - 960) + c.y];

  // An actor owns its node's transform and opacity attributes: translate(x,y) rotate(r) scale(s), opacity o.
  // Scale and rotation pivot on the node's local (0,0), so draw its content centered there.
  // Every change is a fromTo on a proxy that starts from the tracked previous state (seek-safe).
  // Call to() in time order per actor, and never also fade the same node with GSAP opacity.
  kit.actor = (node, { x = 0, y = 0, s = 1, r = 0, o = 1 } = {}) => {
    const P = { x, y, s, r, o };
    const apply = () => { node.setAttribute("transform", `translate(${P.x},${P.y}) rotate(${P.r}) scale(${P.s})`); node.setAttribute("opacity", P.o); };
    apply();
    let cur = { ...P };
    const a = { node, P };
    a.to = (vals, at, dur = 0.35, ease = "power3.inOut") => {
      const nx = { ...cur, ...vals };
      B.fromTo(P, { ...cur }, { ...nx, duration: dur, ease, onUpdate: apply, immediateRender: false }, at);
      cur = nx;
      return a;
    };
    // Hidden at creation; pops to scale s (default 1) at `at`.
    a.pop = (at, s = cur.s || 1, dur = 0.3) => { Object.assign(P, { s: s * 0.2, o: 0 }); cur = { ...cur, s: s * 0.2, o: 0 }; apply(); return a.to({ s, o: 1 }, at, dur, "back.out(2.4)"); };
    a.hide = () => { P.o = 0; cur.o = 0; apply(); return a; };
    a.cur = () => ({ ...cur });
    return a;
  };
  // A stick figure. Hip at the group origin, feet 124*scale below. Move it with kit.actor(fig.g).
  // Poses are absolute segment angles in degrees (0 = straight down, 90 = right, 180 = up); fig.pose() tweens
  // between them (seek-safe: every tween starts from the tracked previous pose). Call pose/face in time order.
  // A brand logo from assets/logos.json (Simple Icons glyphs in brand colours, plus Slack in its four colours), centred on
  // 0,0 and `size` px wide. Very dark brand colours (GitHub, Notion, X) draw in white so they show on the dark ground.
  // Register a project's own mark with kit.logo.add(name, { size, parts: [[d, fill, transform?]], keep: true to keep dark fills }).
  const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; };
  kit.logo = (parent, name, size = 64, { mono } = {}) => {
    const L = kit.logo.lib[name];
    if (!L) throw new Error("no logo " + name);
    const g = el("g", {}, parent), k = size / L.size;
    const inner = el("g", { transform: `scale(${k}) translate(${-L.size / 2},${-L.size / 2})` }, g);
    L.parts.forEach(([d, fill, tf]) => el("path", { d, fill: mono || (!L.keep && lum(fill) < 0.2 ? K.white : fill), ...(tf ? { transform: tf } : {}) }, inner));
    return g;
  };
  kit.logo.lib = typeof LOGOS !== "undefined" ? { ...LOGOS } : {};
  kit.logo.add = (name, def) => { kit.logo.lib[name] = def; };
  kit.POSES = {
    stand: { la1: -14, la2: -8, ra1: 14, ra2: 8, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 0, tilt: 0 },
    think: { la1: -14, la2: -8, ra1: 32, ra2: -158, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 0, tilt: -10 },
    point: { la1: -14, la2: -8, ra1: 100, ra2: 98, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 4, tilt: 0 },
    cheer: { la1: -150, la2: -168, ra1: 150, ra2: 168, ll1: -16, ll2: -10, rl1: 16, rl2: 10, lean: 0, tilt: 0 },
    slump: { la1: -4, la2: 2, ra1: 4, ra2: -2, ll1: -8, ll2: -4, rl1: 8, rl2: 4, lean: 16, tilt: 22 },
    type: { la1: 28, la2: 96, ra1: 40, ra2: 100, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 6, tilt: 8 },
    shrug: { la1: -62, la2: -150, ra1: 62, ra2: 150, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 0, tilt: 8 },
    skeptic: { la1: -52, la2: 42, ra1: 32, ra2: -158, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: -4, tilt: -12 },
    thumbs: { la1: -14, la2: -8, ra1: 70, ra2: 168, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 0, tilt: 0 },
    crouch: { la1: -40, la2: 20, ra1: 40, ra2: -20, ll1: -60, ll2: 20, rl1: 60, rl2: -20, lean: 8, tilt: 6 },
    jump: { la1: -140, la2: -160, ra1: 140, ra2: 160, ll1: -30, ll2: 20, rl1: 30, rl2: -20, lean: 0, tilt: -6 },
    dance1: { la1: -120, la2: -170, ra1: 30, ra2: 60, ll1: -24, ll2: -6, rl1: 14, rl2: 30, lean: -6, tilt: -10 },
    dance2: { la1: -30, la2: -60, ra1: 120, ra2: 170, ll1: -14, ll2: -30, rl1: 24, rl2: 6, lean: 6, tilt: 10 },
    walk1: { la1: 20, la2: 34, ra1: -18, ra2: -8, ll1: -26, ll2: -10, rl1: 24, rl2: 40, lean: 4, tilt: 0 },
    walk2: { la1: -18, la2: -8, ra1: 20, ra2: 34, ll1: 24, ll2: 40, rl1: -26, rl2: -10, lean: 4, tilt: 0 },
    hold: { la1: 60, la2: 150, ra1: -60, ra2: -150, ll1: -10, ll2: -6, rl1: 10, rl2: 6, lean: 0, tilt: 0 },
  };
  kit.stickman = (parent = D, { color = K.white, sw = 9, scale = 1.35, pose = "stand", smile = 0.4 } = {}) => {
    const g = el("g", {}, parent);
    const s = el("g", { transform: `scale(${scale})` }, g);
    const st = { stroke: color, "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" };
    const limbs = ["torso", "la", "ra", "ll", "rl"].reduce((o, k) => ((o[k] = el("path", st, s)), o), {});
    const headG = el("g", {}, s);
    el("circle", { ...st, r: 36, cx: 0, cy: 0, fill: K.bg }, headG);
    const eyes = el("g", {}, headG);
    const eL = el("circle", { r: 5.5, cy: -6, fill: color }, eyes), eR = el("circle", { r: 5.5, cy: -6, fill: color }, eyes);
    const mouth = el("path", { ...st, "stroke-width": sw * 0.6 }, headG);
    const oMouth = el("ellipse", { rx: 7, ry: 9, cy: 14, fill: "none", stroke: color, "stroke-width": sw * 0.55, opacity: 0 }, headG);
    const P = { ...kit.POSES[pose], smile, look: 0.3, o: 0 };
    const v = (a, L) => [Math.sin((a * Math.PI) / 180) * L, Math.cos((a * Math.PI) / 180) * L];
    const draw = () => {
      const n = v(180 + P.lean, 108), neck = [n[0], n[1]];
      const hd = v(180 + P.lean + P.tilt * 0.4, 40), head = [neck[0] + hd[0], neck[1] + hd[1]];
      const sh = [neck[0] + v(P.lean, 12)[0], neck[1] + v(P.lean, 12)[1]];
      const seg = (o, a1, a2, L1, L2) => { const e = v(a1, L1), h = v(a2, L2); const m = [o[0] + e[0], o[1] + e[1]]; return `M${o[0]} ${o[1]} L${m[0]} ${m[1]} L${m[0] + h[0]} ${m[1] + h[1]}`; };
      limbs.torso.setAttribute("d", `M0 0 L${neck[0]} ${neck[1]}`);
      limbs.la.setAttribute("d", seg(sh, P.la1, P.la2, 56, 54));
      limbs.ra.setAttribute("d", seg(sh, P.ra1, P.ra2, 56, 54));
      limbs.ll.setAttribute("d", seg([0, 0], P.ll1, P.ll2, 64, 62));
      limbs.rl.setAttribute("d", seg([0, 0], P.rl1, P.rl2, 64, 62));
      headG.setAttribute("transform", `translate(${head[0]},${head[1]}) rotate(${P.tilt})`);
      eL.setAttribute("cx", -12 + P.look * 8); eR.setAttribute("cx", 12 + P.look * 8);
      const mx = P.look * 6;
      mouth.setAttribute("d", `M${mx - 13} 13 Q${mx} ${13 + P.smile * 14} ${mx + 13} 13`);
      mouth.setAttribute("opacity", 1 - P.o); oMouth.setAttribute("opacity", P.o); oMouth.setAttribute("cx", mx);
    };
    draw();
    let cur = { ...P };
    const fig = { g, head: headG, P };
    // Tween to a named pose (or an object of overrides, e.g. {smile: -1}).
    fig.pose = (p, at, dur = 0.25, ease = "power2.out") => {
      const to = { ...cur, ...(typeof p === "string" ? { o: 0, ...kit.POSES[p] } : p) };
      B.fromTo(P, { ...cur }, { ...to, duration: dur, ease, onUpdate: draw, immediateRender: false }, at);
      cur = to;
    };
    fig.face = (smile, at, o = 0, look = cur.look) => fig.pose({ smile, o, look }, at, 0.15);
    // Alternate two poses (walk, dance) n times starting at `at`.
    fig.cycle = (a, b, at, n, step = 0.18) => { for (let i = 0; i < n; i++) fig.pose(i % 2 ? b : a, at + i * step, step, "sine.inOut"); };
    const bl = { b: 1 }, blApply = () => eyes.setAttribute("transform", `translate(0,-6) scale(1,${bl.b}) translate(0,6)`);
    fig.blink = (at) => B.fromTo(bl, { b: 1 }, { b: 0.1, duration: 0.06, yoyo: true, repeat: 1, onUpdate: blApply, immediateRender: false }, at);
    return fig;
  };
  return kit;
}

// Word-by-word captions: chunks pop in, the spoken word turns gold. Lives on the main timeline (never rewinds).
function buildCaptions(svg, tl) {
  const Y = T.captionY || 1450, MAXW = 840; // 120 px clear on each side (phone crop + app buttons)
  const g = el("g", { id: "captions" }, svg);
  T.captions.forEach((c) => {
    const cg = el("g", { opacity: 0 }, g);
    let size = 70;
    const ws = c.words.map((w) => txt(cg, w.w, { "font-family": SANS, "font-weight": 800, "font-size": size, fill: K.white, stroke: "#05080c", "stroke-width": 12, "paint-order": "stroke", "stroke-linejoin": "round", y: Y }));
    const lay = () => {
      const wd = ws.map((t) => t.getComputedTextLength()), gap = size * 0.3;
      const total = wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
      let x = 540 - total / 2;
      ws.forEach((t, i) => { t.setAttribute("x", x); x += wd[i] + gap; });
      return total;
    };
    const total = lay();
    if (total > MAXW) { size = Math.floor((size * MAXW) / total); ws.forEach((t) => t.setAttribute("font-size", size)); lay(); }
    const popD = Math.max(0.03, Math.min(0.14, c.t1 - 0.06 - c.t0)); // short chunks pop faster so they never overlap their fade
    tl.fromTo(cg, { opacity: 0, scale: 0.8, svgOrigin: `540 ${Y - 24}` }, { opacity: 1, scale: 1, duration: popD, ease: "back.out(3)" }, c.t0);
    tl.fromTo(cg, { opacity: 1 }, { opacity: 0, duration: 0.04, immediateRender: false }, c.t1 - 0.05);
    c.words.forEach((w, i) => {
      tl.fromTo(ws[i], { fill: K.white }, { fill: K.gold, duration: 0.02 }, w.t);
      if (i < c.words.length - 1) tl.fromTo(ws[i], { fill: K.gold }, { fill: K.white, duration: 0.02, immediateRender: false }, c.words[i + 1].t);
    });
  });
}

function boot(scene) {
  const fonts = ["86px KaTeX_Main", "italic 36px KaTeX_Main", "36px KaTeX_Typewriter", "800 84px Jakarta", "66px KaTeX_Math"];
  Promise.all(fonts.map((f) => document.fonts.load(f))).then(() => {
    const svg = el("svg", { width: 1080, height: 1920, viewBox: "0 0 1080 1920" }, document.getElementById("stage"));
    const defs = el("defs", {}, svg);
    const gf = el("filter", { id: "glow", x: "-60%", y: "-60%", width: "220%", height: "220%" }, defs);
    el("feGaussianBlur", { stdDeviation: 7 }, gf);
    // Safe frame: scenes draw on the full 1080x1920 canvas; this group shrinks them toward the center so
    // phones that crop the sides of a 9:16 video (about 100 px each) and the app buttons never cover them.
    const S = T.safe || 1;
    // The clip keeps props parked just off the 1080x1920 canvas hidden, as they were before the shrink.
    el("rect", { x: 0, y: 0, width: 1080, height: 1920 }, el("clipPath", { id: "safeclip", clipPathUnits: "userSpaceOnUse" }, defs));
    const SAFE = el("g", { id: "safe", transform: `translate(540 960) scale(${S}) translate(-540 -960)`, "clip-path": "url(#safeclip)" }, svg);
    const CAM = el("g", { id: "cam" }, SAFE);
    // Formula row: shrink any formula wider than the safe width.
    document.querySelectorAll(".fx > .katex").forEach((k) => {
      const w = k.getBoundingClientRect().width;
      if (w > FXW) k.style.transform = `scale(${FXW / w})`;
    });
    const D = el("g", { id: "diagram" }, CAM);
    const B = gsap.timeline({ paused: true });
    const cue = (l, w = "_start") => {
      const c = T.cues[l];
      if (!c || !(w in c)) throw new Error("missing cue " + l + "/" + w);
      return c[w];
    };
    const kit = makeKit(B, D);
    const ret = scene({ svg, defs, SAFE, CAM, D, B, cue, kit, K, el, txt, arrowHead, rng, SERIF, MONO, SANS }) || {};
    // Readability lint: text under MIN_PX on the phone (font-size × SAFE) fails `hyperframes check` as a console error.
    // Pure texture (a fake UI tag, a tick label nobody needs to read) opts out with data-deco on the text or a parent.
    const MIN_PX = 28;
    const tiny = [...SAFE.querySelectorAll("text")].filter((t) => !t.closest("[data-deco]") && (+t.getAttribute("font-size") || 99) * S < MIN_PX);
    if (tiny.length) console.error(`[reel-lint] ${tiny.length} text(s) under ${MIN_PX}px on screen: ` + tiny.slice(0, 8).map((t) => `"${(t.textContent || "(typed)").slice(0, 24)}" at ${t.getAttribute("font-size")}`).join(", ") + `. Use font-size >= ${Math.ceil(MIN_PX / S)}, or mark pure texture with data-deco.`);

    // Formulas: the old one lifts out before the new one rises in.
    const ids = T.formulas;
    ids.forEach((id, i) => {
      const at = i === 0 && ret.firstFormulaAt != null ? ret.firstFormulaAt : cue(id) - 0.06;
      if (at <= 0.01) B.fromTo("#fx_" + id, { opacity: 1, y: 0, scale: 1 }, { opacity: 1, duration: 0.01 }, 0); // visible on frame one
      else B.fromTo("#fx_" + id, { opacity: 0, y: 22, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" }, at);
      if (i < ids.length - 1) B.fromTo("#fx_" + id, { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.2, ease: "power2.in", immediateRender: false }, cue(ids[i + 1]) - 0.3);
    });

    const tl = gsap.timeline({ paused: true });
    if (T.rewind) {
      const rw0 = T.rewind.start, rwD = T.rewind.dur;
      const target = ret.rewindTarget != null ? ret.rewindTarget : cue(T.lines[1]) - 0.2;
      tl.fromTo(B, { time: 0 }, { time: rw0, duration: rw0, ease: "none" }, 0);
      tl.fromTo(B, { time: rw0 }, { time: target, duration: rwD, ease: "power2.inOut", immediateRender: false }, rw0);
      tl.fromTo("#rw", { opacity: 0 }, { opacity: 0.85, duration: 0.15, immediateRender: false }, rw0);
      tl.fromTo("#rw", { opacity: 0.85 }, { opacity: 0.25, duration: 0.2, yoyo: true, repeat: Math.max(1, Math.floor(rwD / 0.2) - 2), ease: "steps(1)", immediateRender: false }, rw0 + 0.15);
      tl.fromTo("#rw", { opacity: 0.85 }, { opacity: 0, duration: 0.2, immediateRender: false }, rw0 + rwD);
      tl.fromTo("#world", { x: 0 }, { x: 5, duration: 0.05, yoyo: true, repeat: Math.max(1, Math.floor(rwD / 0.05) - 1), ease: "none", immediateRender: false }, rw0);
      tl.set("#world", { x: 0 }, rw0 + rwD + 0.01);
    } else {
      tl.fromTo(B, { time: 0 }, { time: T.total, duration: T.total, ease: "none" }, 0);
    }
    if (T.follow != null) {
      const f0 = T.follow - 0.3;
      tl.fromTo("#world", { opacity: 1 }, { opacity: 0.07, duration: 0.45, ease: "power2.inOut", immediateRender: false }, f0);
      tl.fromTo("#fcard", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, f0 + 0.05);
      tl.fromTo("#fbtn", { scale: 0.5 }, { scale: 1, duration: 0.55, ease: "back.out(2.2)" }, f0 + 0.05);
      tl.fromTo("#fptr", { x: 260, y: 260, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, f0 + 0.35);
      tl.fromTo("#fbtn", { scale: 1 }, { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, f0 + 0.85);
      tl.fromTo("#fptr", { scale: 1 }, { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, f0 + 0.85);
      tl.fromTo("#fon", { opacity: 0 }, { opacity: 1, duration: 0.15 }, f0 + 0.92);
      tl.fromTo("#foff", { opacity: 1 }, { opacity: 0, duration: 0.15, immediateRender: false }, f0 + 0.92);
      tl.fromTo("#fring", { scale: 0.6, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.6, ease: "power2.out" }, f0 + 0.9);
      tl.fromTo("#fsub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, f0 + 0.5);
    }
    if (T.captions) buildCaptions(svg, tl);
    window.__timelines["main"] = tl;
    window.__hfForceTimelineRebind && window.__hfForceTimelineRebind();
  });
}
