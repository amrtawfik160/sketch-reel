// Excalidraw DARK theme for the explainer-reel runtime, loaded between lib.js and scenes.js (lines.py PRELUDE, after rough.js).
// Excalidraw draws dark mode by putting `filter: invert(93%) hue-rotate(180deg)` over its light scene. dk() applies that exact
// filter math (sRGB) to each light-theme colour, so every ink, fill and sticky note is the colour Excalidraw itself would show:
// canvas #ffffff -> #121212, ink #1e1e1e -> #d3d3d3, the pastel fills -> their deep, same-hue versions.
// It re-skins the runtime's chrome too: K (so kit helpers draw in light ink on the dark canvas), the captions, and the follow card.

function dk(hex) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const iv = c.map((v) => v * (1 - 0.93) + (1 - v) * 0.93);               // invert(93%)
  const M = [[-0.574, 1.43, 0.144], [0.426, 0.43, 0.144], [0.426, 1.43, -0.856]]; // hue-rotate(180deg)
  const out = M.map((r) => Math.max(0, Math.min(1, r[0] * iv[0] + r[1] * iv[1] + r[2] * iv[2])));
  return "#" + out.map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

const INK = dk("#1e1e1e"), INK2 = dk("#495057"), PAPER = dk("#ffffff");
// Excalidraw's palette (light values in, dark values out): stroke colours, and the fills that pair with them
const EXL = {
  blue: "#1971c2", blueF: "#a5d8ff", green: "#2f9e44", greenT: "#2b8a3e", greenF: "#b2f2bb", red: "#e03131", redF: "#ffc9c9",
  orange: "#f08c00", orangeT: "#e8590c", yellowF: "#ffec99", violet: "#6741d9", violetF: "#d0bfff", gray: "#868e96", grayF: "#e9ecef",
};
const EX = Object.fromEntries(Object.entries(EXL).map(([k, v]) => [k, dk(v)]));
const HAND = "Excalifont", CODE = "ComicShanns";
Object.assign(K, {
  bg: PAPER, panel: PAPER, white: INK, soft: INK2, dim: INK2, label: INK2, line: dk("#ced4da"),
  teal: EX.blue, gold: EX.orange, green: EX.green, red: EX.red, blue: EX.violet, purple: EX.violet,
});

const __exBoot = boot;
boot = (s) => {
  const st = document.createElement("style");
  st.textContent =
    '@font-face{font-family:"Excalifont";src:url("fonts/Excalifont-Latin.woff2") format("woff2");' +
    "unicode-range:U+20-7e,U+a0-a3,U+a5-a6,U+a8-ab,U+ad-b1,U+b4,U+b6-b8,U+ba-ff,U+131,U+152-153,U+2bc,U+2c6,U+2da,U+2dc,U+304,U+308,U+2013-2014,U+2018-201a,U+201c-201e,U+2020,U+2022,U+2024-2026,U+2030,U+2039-203a,U+20ac,U+2122,U+2212;}" +
    '@font-face{font-family:"Excalifont";src:url("fonts/Excalifont-LatinExt.woff2") format("woff2");' +
    "unicode-range:U+100-130,U+132-137,U+139-149,U+14c-151,U+154-17e,U+192,U+1fc-1ff,U+218-21b,U+237,U+1e80-1e85,U+1ef2-1ef3,U+2113;}" +
    '@font-face{font-family:"ComicShanns";src:url("fonts/ComicShanns-Latin.woff2") format("woff2");}' +
    `body,#root{background:${PAPER} !important;color:${INK};}` +
    "#vignette{display:none;}" +
    '.fb{font-family:"Excalifont",sans-serif !important;font-weight:400 !important;border-radius:30px !important;}' +
    "#fbtn{transform:rotate(-1.5deg);}" +
    `#foff{background:${EX.blueF} !important;color:${INK} !important;border:5px solid ${INK};box-sizing:border-box;font-size:66px !important;}` +
    `#fon{background:${PAPER} !important;color:${INK} !important;border:5px solid ${INK} !important;font-size:60px !important;}` +
    `#fring{border-color:${EX.blue} !important;border-radius:30px !important;}` +
    `#fsub{font-family:"Excalifont",sans-serif !important;font-style:normal !important;color:${INK2} !important;font-size:50px !important;}`;
  document.head.appendChild(st);
  Promise.all(["48px Excalifont", "48px ComicShanns"].map((f) => document.fonts.load(f))).then(() => __exBoot(s));
};

// LIGHT + DARK (this project): the light theme is Excalidraw's own light mode (white canvas, #1e1e1e ink, the raw palette);
// the dark theme is the dk() version above. scenes.js sets THEME_SW = [[t, "light" | "dark"], ...] (the reel starts dark) and
// CAPFIX = [[word, approx t, measured t], ...] for caption words the transcriber timed wrong.
const DT = { INK, INK2, PAPER, EX };
const LT = { INK: "#1e1e1e", INK2: "#495057", PAPER: "#ffffff", EX: EXL };
let THEME_SW = [], CAPFIX = [];
const themeAt = (t) => { let m = "dark"; for (const [ts, n] of THEME_SW) if (t >= ts) m = n; return m === "light" ? LT : DT; };

// Captions in Excalifont: ink words with a canvas-coloured halo, the spoken word in Excalidraw's blue; each phrase takes the
// palette of the theme on screen when it starts (switches happen between lines, so no phrase spans one).
function buildCaptions(svg, tl) {
  const Y = T.captionY || 1450, MAXW = 840;
  const g = el("g", { id: "captions" }, svg);
  const caps = T.captions.map((c) => ({ ...c, words: c.words.map((w) => ({ ...w })) }));
  const nrm = (s) => s.toLowerCase().replace(/[^a-z0-9-]/g, "");
  caps.forEach((c) => c.words.forEach((w) => {
    const f = CAPFIX.find(([wd, ta]) => nrm(wd) === nrm(w.w) && Math.abs(ta - w.t) < 0.6);
    if (f) w.t = f[2];
  }));
  caps.forEach((c, i) => {
    c.t0 = Math.min(c.t0, c.words[0].t - 0.04);
    if (i > 0) caps[i - 1].t1 = Math.min(caps[i - 1].t1, c.t0);
    if (i > 0 && c.words[0].t - 0.04 > c.t0) c.t0 = c.words[0].t - 0.04;
  });
  caps.forEach((c, i) => { if (i + 1 < caps.length) c.t1 = Math.min(c.t1, caps[i + 1].t0); });
  // merge a phrase shown too briefly to read into its neighbour (same line: no gap between them, short enough together)
  const chars = (c) => c.words.reduce((a, w) => a + w.w.length + 1, 0);
  const LS = Object.values(T.cues || {}).map((q) => q._start);
  const lineStart = (c) => LS.some((s) => Math.abs(c.words[0].t - s) < 0.08);
  for (let i = caps.length - 1; i > 0; i--) {
    const a = caps[i - 1], b = caps[i];
    if ((b.t1 - b.t0 < 0.55 || a.t1 - a.t0 < 0.55) && !lineStart(b) && Math.abs(a.t1 - b.t0) < 0.02 && chars(a) + chars(b) <= 30 && a.words.length + b.words.length <= 5) {
      a.words.push(...b.words); a.t1 = b.t1; caps.splice(i, 1);
    }
  }
  if (caps.length) caps[caps.length - 1].t1 = Math.max(caps[caps.length - 1].t1, T.total - 0.05);   // the closing words hold to the end
  const wp = svg.querySelector("#wipes"); if (wp) svg.appendChild(wp);   // the wipe band passes over the outgoing caption
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
    const popD = Math.max(0.03, Math.min(0.12, c.t1 - 0.06 - c.t0));
    tl.fromTo(cg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: popD, ease: "power2.out" }, c.t0);
    tl.fromTo(cg, { opacity: 1 }, { opacity: 0, duration: 0.04, immediateRender: false }, c.t1 - 0.05);
    c.words.forEach((w, i) => {
      tl.fromTo(ws[i], { fill: P.INK }, { fill: P.EX.blue, duration: 0.02 }, w.t);
      if (i < c.words.length - 1) tl.fromTo(ws[i], { fill: P.EX.blue }, { fill: P.INK, duration: 0.02, immediateRender: false }, c.words[i + 1].t);
    });
  });
}
