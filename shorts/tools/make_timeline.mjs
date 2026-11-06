// node tools/make_timeline.mjs <slug>: plan.mjs + voice timings -> stories/<slug>/out/timeline.json (+ cues.json).
// Lines play back to back with the plan's gaps; cuts snap to the 66 bpm beat; every time expression is resolved here.
import fs from 'fs'; import path from 'path'; import { fileURLToPath, pathToFileURL } from 'url';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url))), slug = process.argv[2], D = path.join(ROOT, 'stories', slug);
const plan = await import(pathToFileURL(path.join(D, 'plan.mjs')).href);
const lines = JSON.parse(fs.readFileSync(path.join(D, 'lines.json'), 'utf8'));
const dur = JSON.parse(fs.readFileSync(path.join(D, 'voice/dur.json'), 'utf8'));
const words = fs.existsSync(path.join(D, 'voice/words.json')) ? JSON.parse(fs.readFileSync(path.join(D, 'voice/words.json'), 'utf8')) : {};
const BEAT = 60 / 66, snap = t => Math.round(t / BEAT) * BEAT;
const LINES = {}; let t = plan.START ?? .7;
for (const L of lines) { LINES[L.id] = { t: +t.toFixed(3), d: dur[L.id], e: +(t + dur[L.id]).toFixed(3) }; t += dur[L.id] + (plan.GAP?.[L.id] ?? .5); }
const lastE = LINES[lines[lines.length - 1].id].e;
const END0 = +(lastE + (plan.TAIL ?? 1.6)).toFixed(3), DUR = +(END0 + (plan.ENDCARD ?? 3.6)).toFixed(3);
const CUT = {}, SHOTS = [];
for (const [id, at, lead] of plan.SHOTS) { const c = at === null ? 0 : at === 'end' ? END0 : snap(LINES[at].t - (lead ?? .45)); CUT[id] = +c.toFixed(3); SHOTS.push([id, CUT[id]]); }
const R = e => { if (typeof e === 'number') return e; const m = /^(cut:|T:)?([a-zA-Z0-9_]+)([+-][\d.]+)?$/.exec(e); if (!m) throw new Error('bad time ' + e);
  const [, kind, name, off] = m; let b; if (kind === 'cut:') b = CUT[name]; else if (kind === 'T:') b = T[name]; else if (name === 'end') b = END0; else if (name === 'dur') b = DUR;
  else { const lm = /^(l\d+)(e?)$/.exec(name); if (!lm || !LINES[lm[1]]) throw new Error('unknown time ' + e); b = lm[2] ? LINES[lm[1]].e : LINES[lm[1]].t; }
  if (b === undefined) throw new Error('unknown time ' + e); return +(b + (off ? +off : 0)).toFixed(3); };
const T = {}; for (const [k, v] of Object.entries(plan.T || {})) T[k] = R(v);
// subtitles
const MAXC = plan.MAXC ?? 58;
function split(text) {
  if (text.length <= MAXC) return [text];
  const parts = []; let cur = '';
  for (const tok of text.split(/(?<=[.?!:;,…])\s+/)) { if (cur && (cur + ' ' + tok).length > MAXC) { parts.push(cur); cur = tok; } else cur = cur ? cur + ' ' + tok : tok; }
  if (cur) parts.push(cur);
  for (let i = 0; i < parts.length - 1; i++) if (parts[i].length < 18 && (parts[i] + ' ' + parts[i + 1]).length <= MAXC + 12) { parts[i + 1] = parts[i] + ' ' + parts[i + 1]; parts.splice(i, 1); i--; }
  for (let i = 0; i < parts.length - 1; i++) { const m = /\s(Mas|E|Então|Porque|Até)[,]?$/.exec(parts[i]); if (m) { parts[i] = parts[i].slice(0, m.index); parts[i + 1] = m[0].trim() + ' ' + parts[i + 1]; } }
  for (let i = parts.length - 1; i > 0; i--) if (parts[i].length < 18) { parts[i - 1] += ' ' + parts[i]; parts.splice(i, 1); }
  return parts;
}
const cues = [];
for (const L of lines) {
  const t0 = LINES[L.id].t, d = LINES[L.id].d, parts = L.subs || split(L.text), W = words[L.id] || [];
  const nw = parts.map(p => p.split(/\s+/).length), tot = nw.reduce((a, b) => a + b, 0);
  let starts; if (W.length === tot) { let k = 0; starts = parts.map((p, i) => { const s = Math.max(0, W[k][1]); k += nw[i]; return s; }); }
  else { const tc = parts.reduce((a, p) => a + p.length, 0); let acc = 0; starts = parts.map(p => { const s = acc / tc * d; acc += p.length; return s; }); }
  parts.forEach((p, i) => cues.push({ t0: +(t0 + (i ? starts[i] - .05 : 0)).toFixed(3), t1: +(i < parts.length - 1 ? t0 + starts[i + 1] - .05 : t0 + d + .45).toFixed(3), text: p, line: L.id }));
}
for (let i = 0; i < cues.length; i++) { const c = cues[i], nx = cues[i + 1]; if (c.t1 - c.t0 < 1.8) c.t1 = Math.min(c.t0 + 1.8, nx ? nx.t0 - .02 : c.t0 + 1.8); if (nx && c.t1 > nx.t0 - .02) c.t1 = nx.t0 - .02; }
for (const c of cues) if (c.t1 - c.t0 < 1.75) console.warn(slug, 'short cue', c.t0, c.text);
const res = a => (a || []).map(x => [R(x[0]), ...x.slice(1)]);
const out = { slug, BEAT, LINES, CUT, SHOTS, T, END0, DUR, CUES: cues,
  MUSIC: res(plan.MUSIC), HITS: res(plan.HITS), SFX: res(plan.SFX), SILENCE: (plan.SILENCE || []).map(([a, b]) => [R(a), R(b)]),
  BEDS: (plan.BEDS || []).map(([kind, keys]) => [kind, keys.map(([tt, g]) => [R(tt), g])]), TRANS: Object.keys((plan.TRANS) || {}).map(id => CUT[id]) };
fs.mkdirSync(path.join(D, 'out'), { recursive: true });
fs.writeFileSync(path.join(D, 'out/timeline.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(D, 'cues.json'), JSON.stringify(cues.map(({ t0, t1, text }) => ({ t0, t1, text })), null, 1));
console.log(slug, 'DUR', DUR, 's', cues.length, 'cues');
