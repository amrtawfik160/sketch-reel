// Render [[id, latex], ...] to {id: katex html}. Usage: node render_tex.js <in.json> <out.json>
const path = require("path"), fs = require("fs"), os = require("os");
const katex = require(path.join(os.homedir(), ".cache/explainer-reel/node_modules/katex"));
const rows = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const out = {};
for (const [id, tex] of rows) out[id] = katex.renderToString(tex, { throwOnError: true, output: "html", trust: true, strict: "ignore" });
fs.writeFileSync(process.argv[3], JSON.stringify(out));
