// MOISÉS E O MAR VERMELHO — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { chariot } from '../../scenes/actors2.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'UM MAR À FRENTE.<br><b>UM EXÉRCITO ATRÁS.</b>';
export const COVER = 'O mar se <b>abriu</b><small>quando não havia saída</small>';
export const COVER_T = 36.0;
export const BOOK = 'Êxodo 14';
export const REFS = [['l02', 'l02', 'Êxodo 12:40–41'], ['l03', 'l03', 'Êxodo 14:9'], ['l04', 'l04', 'Êxodo 14:10'], ['l05', 'l05', 'Êxodo 14:13–14'], ['l06', 'l06', 'Êxodo 14:21'], ['l07', 'l07', 'Êxodo 14:22']];
export const QUOTES = ['l05'];
const PW = 1188, PH = 2112, HZ = 640, BEACH = 1180;
const MOSES = { robe: '#7a6a5a', mantle: '#a83a2a', skin: '#a87a58', hair: '#e8e0d0' };
const CROWD_PALS = ['#6e5a42', '#8a7a5a', '#5a6070', '#7a5a4a', '#9a8a6a'];

function buildShore() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, HZ + 30], [0, HZ + 30]]), lin(0, 0, 0, HZ, [[0, '#1e2a4a'], [.6, '#5a6a8a'], [1, '#e8b880']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(P([[0, HZ], [PW, HZ], [PW, BEACH], [0, BEACH]]), lin(0, HZ, 0, BEACH, [[0, '#7a9aa8'], [.25, '#3e6e80'], [1, '#1e4a5a']]), { dir: 0, fallback: 0, group: 'sea', maxR: 24, aj: .25 });
  R.fill(c => { c.moveTo(0, BEACH - 10); c.bezierCurveTo(400, BEACH - 40, 800, BEACH + 20, PW, BEACH - 20); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, BEACH, 0, PH, [[0, '#d8c09a'], [.4, '#b8986a'], [1, '#6a5038']]), { dir: 2, fallback: 2, group: 'sand', maxR: 28 });
  R.fill(c => { c.moveTo(0, 1500); c.bezierCurveTo(120, 1380, 330, 1400, 420, 1500); c.lineTo(460, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1380, 0, PH, [[0, '#9a7a5a'], [1, '#3a2a1e']]), { dir: 20, group: 'rock', maxR: 16 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 401, rev: (x, y) => Math.abs(x - 594) / 500 + Math.abs(y - BEACH) / 900 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildEgypt() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1150], [0, 1150]]), lin(0, 0, 0, 1150, [[0, '#4a6a9a'], [.6, '#e0b88a'], [1, '#f6d8a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  [[300, 1150, 420], [760, 1150, 300]].forEach(([x, y, s], i) => { R.fill(P([[x - s, y], [x, y - s * .9], [x, y]]), '#e8c890', { dir: 50, group: 'py' + i, maxR: 12 }); R.fill(P([[x, y - s * .9], [x + s, y], [x, y]]), '#a8865a', { dir: -50, group: 'py' + i + 'b', maxR: 12 }); });
  R.fill(P([[0, 1150], [PW, 1150], [PW, PH], [0, PH]]), lin(0, 1150, 0, PH, [[0, '#d8b888'], [1, '#8a6a44']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  R.fill(c => { c.moveTo(PW, 1250); c.bezierCurveTo(700, 1350, 400, 1500, -50, 1700); c.lineTo(-50, 1850); c.bezierCurveTo(400, 1650, 800, 1450, PW, 1330); c.closePath(); }, '#e8d4a8', { dir: 'edge', group: 'road', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 402 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildDesert() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 900], [0, 900]]), lin(0, 0, 0, 900, [[0, '#6a5a6a'], [.7, '#c89a70'], [1, '#e0b080']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 900); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 880 - Math.sin(x / 140) * 30); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 860, 0, PH, [[0, '#c8a070'], [.5, '#a07848'], [1, '#5a4028']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  R.tint(P([[0, 700], [PW, 700], [PW, 1100], [0, 1100]]), lin(0, 700, 0, 1100, [[0, 'rgba(230,200,160,0)'], [.5, 'rgba(230,200,160,.5)'], [1, 'rgba(230,200,160,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 403 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildCorridor() {
  const R = new Ref(PW, PH, .5), vy = 560;
  R.fill(P([[0, 0], [PW, 0], [PW, vy + 40], [0, vy + 40]]), lin(0, 0, 0, vy, [[0, '#6a8ab4'], [.55, '#e8b8a0'], [1, '#fde0a8']]), { dir: -3, fallback: -3, group: 'sky', maxR: 40 });
  R.tint(E(594, vy, 300, 160), rad(594, vy, 10, 300, [[0, 'rgba(255,240,190,1)'], [1, 'rgba(255,210,140,0)']]));
  R.fill(P([[0, 0], [560, vy - 10], [520, vy + 40], [-60, PH], [0, PH]]), lin(0, 0, 560, 0, [[0, '#123848'], [.7, '#2a6a80'], [1, '#7ab4bc']]), { dir: 80, fallback: 80, group: 'wallL', maxR: 30, detail: 1.4 });
  R.fill(P([[PW, 0], [628, vy - 10], [668, vy + 40], [PW + 60, PH], [PW, PH]]), lin(PW, 0, 628, 0, [[0, '#123848'], [.7, '#2a6a80'], [1, '#7ab4bc']]), { dir: 100, fallback: 100, group: 'wallR', maxR: 30, detail: 1.4 });
  R.fill(P([[520, vy + 40], [668, vy + 40], [PW + 60, PH], [-60, PH]]), lin(0, vy, 0, PH, [[0, '#e8d0a8'], [.4, '#c8a878'], [1, '#8a6a48']]), { dir: 0, fallback: 0, group: 'path', maxR: 26 });
  R.line(c => { c.moveTo(560, vy - 10); c.lineTo(-60, PH); }, '#e8f2ee', 22, { dir: 'edge', group: 'foamL', maxR: 6 });
  R.line(c => { c.moveTo(628, vy - 10); c.lineTo(PW + 60, PH); }, '#e8f2ee', 22, { dir: 'edge', group: 'foamR', maxR: 6 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 404 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { shore: buildShore, egypt: buildEgypt, desert: buildDesert, corridor: buildCorridor };

// ---------- live elements
const CROWD = []; for (let r = 0; r < 5; r++) for (let i = 0; i < 9; i++) CROWD.push({ x: 470 + i * 80 + (r % 2) * 40 + (hash(r * 9 + i) - .5) * 30, y: BEACH + 40 + r * 55, H: 90 + r * 22, f: hash(i + r * 3) > .5 ? 1 : -1, seed: 500 + r * 20 + i, c: CROWD_PALS[(i + r) % 5] });
function crowd(K, t, fear, o) {
  for (const p of CROWD) person(K.dyn, p.x, p.y, p.H, { f: p.f, pal: { robe: p.c, mantle: '#5a4a36', skin: '#a07050', hair: '#2a2220' }, armF: [lerp(.2, 2.4 + Math.sin(t * 3 + p.seed) * .2, fear * (hash(p.seed) > .4 ? 1 : 0)), .3], armB: [lerp(.1, 2.2, fear * (hash(p.seed * 2) > .5 ? 1 : 0)), .3], head: -.2 * fear, seed: p.seed });
  K.flush({ ...o, run: .15 });
}
function pillar(K, t, x, y, h, o) {             // the pillar of fire: the only gold in the grey night
  for (let i = 0; i < 26; i++) { const v = i / 25, fl = Math.sin(t * 6 + i * 1.7) * 18 * (1 - v * .4); K.dyn.push({ x: x + fl + (hash(i) - .5) * 30, y: y - v * h, ang: -Math.PI / 2 + Math.sin(t * 4 + i) * .2, len: 120, wid: 70 * (1 - v * .5), c: mixc(hex('#ffd060'), hex('#e85a20'), hash(i * 3) * .6), c2: hex('#fff0b0'), type: 1, seed: 800 + i, alpha: .85, hgt: .5 }); }
  K.dyn.push({ x, y: y - h * .5, ang: Math.PI / 2, len: h * 1.3, wid: 380, c: hex('#ffb050'), type: 2, seed: 830, alpha: .1, hgt: 0 });
  K.flush({ ...o, grey: 0, run: .5 });
}
function moses(K, x, y, H, arm, t, o) { person(K.dyn, x, y, H, { f: 1, pal: MOSES, armF: [lerp(.3, 2.0, arm), .1], armB: [.2, .3], lean: -.05 * arm, head: -.1, seed: 61 }); K.dyn.push({ x: x + 40 + Math.sin(lerp(.3, 2.0, arm)) * H * .3, y: y - H * .55 - arm * H * .25, ang: Math.PI / 2 - .2 * arm, len: H * .9, wid: 10, c: hex('#5a3a22'), type: 0, seed: 62 }); K.flush({ ...o, run: .15 }); }
// the sea opening: depth slices from the horizon to the beach, a dry path between two rising walls
function parted(K, t, open, o) {
  if (open <= 0) return;
  for (let k = 0; k < 26; k++) {
    const d = k / 25, y = lerp(HZ + 8, BEACH + 10, Math.pow(d, 1.4)), hw = lerp(8, 300, d) * open, wh = lerp(14, 420, d) * open;
    const sand = mixc(hex('#c8a878'), hex('#e8d0a8'), 1 - d);
    K.dyn.push({ x: 594, y: y - 2, ang: 0, len: hw * 2, wid: lerp(6, 46, d), c: sand, c2: shade(sand, .9), type: 0, seed: 900 + k, hgt: .9 });
    for (const s of [-1, 1]) for (let j = 0; j < 4; j++) {
      const v = (j + .5) / 4, c = mixc(mixc(hex('#1e4a5e'), hex('#5a9aaa'), v), hex('#a8d0d0'), .3);
      K.dyn.push({ x: 594 + s * (hw + lerp(4, 40, d)), y: y - v * wh, ang: Math.PI / 2 + Math.sin(t * 1.4 + k + j) * .06, len: wh / 4 * 1.2, wid: lerp(6, 60, d), c, c2: shade(c, .85), type: 0, seed: 920 + k * 9 + j + (s > 0 ? 400 : 0), hgt: 1.1 });
    }
    for (const s of [-1, 1]) K.dyn.push({ x: 594 + s * (hw + lerp(4, 40, d)), y: y - wh - 4 + Math.sin(t * 2 + k) * 3, ang: 0, len: lerp(8, 70, d), wid: lerp(3, 18, d), c: hex('#eef2ea'), type: 0, seed: 1300 + k + (s > 0 ? 50 : 0), hgt: 1.3 });
  }
  K.flush({ ...o, run: .2 });
}

export const S = {};
const shore = (t, x, K, mode) => {
  const a = K.C({ 1: 'shore1', 2: 'shore2', 3: 'moses', 4: 'part' }[mode]);
  let cam;
  if (mode === 1) cam = { x: 594, y: lerp(1150, 1220, seg(t, a, K.C('egypt'))), zoom: lerp(1.0, 1.12, ss(seg(t, a, K.C('egypt')))) };
  else if (mode === 2) cam = { x: 640, y: 1250, zoom: lerp(1.2, 1.32, ss(seg(t, a, K.C('moses')))) };
  else if (mode === 3) cam = { x: lerp(330, 380, seg(t, a, K.C('part'))), y: 1240, zoom: lerp(1.5, 1.62, ss(seg(t, a, K.C('part')))) };
  else cam = { x: 594, y: key(t, [[a, 1240], [K.T.open + 2, 1060]]), zoom: key(t, [[a, 1.4], [K.T.open + 2.5, 1.02]]) };
  const op = mode === 4 ? K.T.open : 1e6;
  const o = mode === 4 ? { t, cam, grey: 1, reveal: op, revDur: .3 } : K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.shore, mode === 4 ? { ...o, revC: [594, BEACH, 600] } : o);
  const open = mode === 4 ? ss(seg(t, op - .4, op + 2.6)) : 0;
  parted(K, t, open, mode === 4 ? K.col({ t, cam }) : o);
  if (mode !== 4 || t < op + .5) pillar(K, t, 950, 1330, 820, { t, cam, alpha: x.a * (mode === 4 ? 1 - ss(seg(t, op, op + .8)) : 1) });
  const fear = mode === 2 ? ss(seg(t, a + .5, a + 1.5)) : mode === 1 ? .3 : mode === 3 ? .5 : 0;
  crowd(K, t, fear, { ...o, alpha: x.a });
  const arm = mode === 4 ? ss(seg(t, a + .2, a + 1.2)) : 0;
  moses(K, 250, 1430, 380, arm, t, { ...o, alpha: x.a });
  if (mode === 1) { for (let i = 0; i < 6; i++) K.dyn.push({ x: 1050 + Math.sin(t + i) * 30, y: 1900 - i * 30, ang: 0, len: 300, wid: 120, c: hex('#c8b090'), type: 2, seed: 860 + i, alpha: .35 }); K.flush(o); }
  const g = mode === 4 ? eo(seg(t, op, op + 2.5)) : 0;
  if (g > 0) { rays(K.dyn, { x: 594, y: HZ - 40, ang: -Math.PI / 2, n: 11, spread: 1.6, len: 900, wid: 90, alpha: .2 * g, grow: .4 + .6 * g, seed: 870 }); K.flush({ t, cam, grey: 0, run: .6 }); }
  const post = mode === 4 ? lerpPost(GREYW, WARM, ss(seg(t, op, op + 3))) : GREYW;
  return { ...post, expo: (mode === 1 ? .85 * ss(seg(t, 0, .8)) : post.expo) * (mode === 4 ? 1 : .92), light: [-.3, -.7, .6] };
};
S.shore1 = (t, x, K) => shore(t, x, K, 1);
S.shore2 = (t, x, K) => shore(t, x, K, 2);
S.moses = (t, x, K) => shore(t, x, K, 3);
S.part = (t, x, K) => shore(t, x, K, 4);
S.egypt = (t, x, K) => {
  const a = K.C('egypt'), b = K.C('desert');
  const cam = { x: lerp(620, 560, seg(t, a, b)), y: 1240, zoom: lerp(1.1, 1.2, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.egypt, o);
  for (let i = 0; i < 12; i++) { const u = ((i / 12 + (t - a) * .03) % 1), px = lerp(1250, -80, u), py = lerp(1280, 1780, u), H = lerp(120, 300, u); person(K.dyn, px, py, H, { f: -1, phase: (t - a) * 5 + i, stride: 1, pal: { robe: CROWD_PALS[i % 5], mantle: '#5a4a36', skin: '#a07050', hair: '#2a2220' }, seed: 700 + i }); }
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.desert = (t, x, K) => {
  const a = K.C('desert'), b = K.C('shore2');
  const cam = { x: 594, y: lerp(1250, 1280, seg(t, a, b)), zoom: lerp(1.15, 1.3, ss(seg(t, a, b))), rot: Math.sin(t * 7) * .004 };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.desert, o);
  [[1050, 360, 0], [1250, 460, .7], [1520, 620, 1.4]].forEach(([y, S0, p], i) => { const px = -300 + ((t - a) * (180 + i * 60) + i * 260) % 1500; chariot(K.dyn, px, y, S0, { f: 1, phase: t * 9 + p, seed: 950 + i * 40 }); });
  K.flush({ ...o, alpha: x.a, run: .2 });
  return { ...GREYW, expo: .9 };
};
const corridor = (t, x, K, close) => {
  const a = K.C(close ? 'close' : 'corridor');
  const cam = close ? { x: 594, y: lerp(1150, 1000, ss(seg(t, a, a + 8))), zoom: lerp(1.15, 1.3, ss(seg(t, a, a + 8))) } : { x: 594, y: lerp(1300, 1180, ss(seg(t, a, K.C('close')))), zoom: lerp(1.1, 1.15, seg(t, a, K.C('close'))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.corridor, o);
  // shimmer on the walls of water
  for (let i = 0; i < 40; i++) { const s = i % 2 ? 1 : -1, v = hash(i * 3.3), y = lerp(600, 2000, v), xx = 594 + s * lerp(40, 640, (y - 560) / 1500) + s * (hash(i) * 120 + 30); K.dyn.push({ x: xx, y: y + Math.sin(t * 1.5 + i) * 30, ang: Math.PI / 2 + s * .3, len: 140, wid: 22, c: hex('#9ccace'), type: 0, seed: 1400 + i, alpha: .4 }); }
  K.flush({ ...o, alpha: x.a, run: .3 });
  for (let i = 0; i < 14; i++) { const u = ((i / 14 + (t - a) * .025) % 1), d = 1 - u, py = lerp(620, 1900, d * d), H = lerp(30, 330, d * d), px = 594 + (hash(i * 5) - .5) * lerp(40, 600, d * d); person(K.dyn, px, py, H, { f: hash(i) > .5 ? 1 : -1, phase: (t - a) * 5 + i, stride: .8, pal: { robe: CROWD_PALS[i % 5], mantle: '#5a4a36', skin: '#a07050', hair: '#2a2220' }, seed: 1500 + i }); }
  K.flush({ ...o, alpha: x.a, run: .15 });
  rays(K.dyn, { x: 594, y: 560, ang: Math.PI / 2, n: 9, spread: .9, len: 1500, wid: 110, alpha: .14, seed: 880 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  return { ...WARM, light: [0, -.8, .55] };
};
S.corridor = (t, x, K) => corridor(t, x, K, false);
S.close = (t, x, K) => corridor(t, x, K, true);
