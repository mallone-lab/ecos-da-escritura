// timeline.mjs + voice timings -> out/timeline.json and subtitle cues (cues.json, jonas.srt input).
// Subtitles: each voice line is split at clause punctuation into cues of <= 2 short lines; cue times follow the
// Whisper word timestamps when the word counts agree, else they are shared out by character count.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TL = await import('file:///' + path.join(HERE, 'timeline.mjs').replace(/\\/g, '/'));
const lines = JSON.parse(fs.readFileSync(path.join(HERE, 'lines.json'), 'utf8'));
const dur = JSON.parse(fs.readFileSync(path.join(HERE, 'voice/dur.json'), 'utf8'));
const words = JSON.parse(fs.readFileSync(path.join(HERE, 'voice/words.json'), 'utf8'));
const MAXC = 64;   // characters per cue (two lines of ~32)

function split(text) {
  if (text.length <= MAXC) return [text];
  // candidate split points after . ? : ; , …
  const parts = []; let cur = '';
  for (const tok of text.split(/(?<=[.?:;,…])\s+/)) {
    if (cur && (cur + ' ' + tok).length > MAXC) { parts.push(cur); cur = tok; } else cur = cur ? cur + ' ' + tok : tok;
  }
  if (cur) parts.push(cur);
  // merge a very short tail into the previous part
  if (parts.length > 1 && parts[parts.length - 1].length < 14) { const t = parts.pop(); parts[parts.length - 1] += ' ' + t; }
  return parts;
}
const cues = [], VO = [];
for (const L of lines) {
  const t0 = TL.LINE_AT[L.id], d = dur[L.id]; if (t0 === undefined) throw new Error('no time for ' + L.id);
  VO.push({ id: L.id, t: t0, d });
  const parts = L.subs || split(L.text), W = words[L.id] || [];
  const nw = parts.map(p => p.split(/\s+/).length), tot = nw.reduce((a, b) => a + b, 0);
  let starts;
  if (W.length === tot) { let k = 0; starts = parts.map((p, i) => { const s = Math.max(0, W[k][1]); k += nw[i]; return s; }); }
  else { const tc = parts.reduce((a, p) => a + p.length, 0); let acc = 0; starts = parts.map(p => { const s = acc / tc * d; acc += p.length; return s; }); }
  parts.forEach((p, i) => {
    const a = t0 + (i ? starts[i] - .05 : 0), b = i < parts.length - 1 ? t0 + starts[i + 1] - .05 : t0 + d + .45;
    cues.push({ t0: +a.toFixed(3), t1: +b.toFixed(3), text: p, line: L.id });
  });
}
// minimum hold 1.8 s: extend into the gap before the next cue
for (let i = 0; i < cues.length; i++) {
  const c = cues[i], nx = cues[i + 1];
  const need = Math.max(1.8, 0);
  if (c.t1 - c.t0 < need) c.t1 = Math.min(c.t0 + need, nx ? nx.t0 - .02 : c.t0 + need);
  if (nx && c.t1 > nx.t0 - .02) c.t1 = nx.t0 - .02;
}
// overlap check of voice lines
VO.sort((a, b) => a.t - b.t);
for (let i = 0; i + 1 < VO.length; i++) if (VO[i].t + VO[i].d > VO[i + 1].t - .25) console.warn('voice overlap/tight:', VO[i].id, (VO[i].t + VO[i].d).toFixed(2), '->', VO[i + 1].id, VO[i + 1].t);
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
const out = { SHORT_SEGS: TL.SHORT_SEGS, BPM: TL.BPM, BEAT: TL.BEAT, BAR: TL.BAR, CUT: TL.CUT, SHOTS: TL.SHOTS, T: TL.T, DUR: TL.DUR, VO, CUES: cues };
fs.writeFileSync(path.join(HERE, 'out/timeline.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(HERE, 'cues.json'), JSON.stringify(cues.map(({ t0, t1, text }) => ({ t0, t1, text })), null, 1));
for (const c of cues) if (c.t1 - c.t0 < 1.8) console.warn('short cue', c.t0, c.text);
console.log('timeline: DUR', TL.DUR.toFixed(2), 's,', cues.length, 'cues,', VO.length, 'voice lines');
