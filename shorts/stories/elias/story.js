// ELIAS NO MONTE CARMELO — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = '1 CONTRA 450.<br><b>FOGO DO CÉU.</b>';
export const COVER = '1 contra <b>450</b><small>e o fogo caiu do céu</small>';
export const COVER_T = 42.0;
export const BOOK = '1 Reis 18';
export const REFS = [['l02', 'l02', '1 Reis 18:1, 18'], ['l03', 'l03', '1 Reis 18:24'], ['l04', 'l04', '1 Reis 18:26–29'], ['l05', 'l05', '1 Reis 18:33–34'], ['l06', 'l06', '1 Reis 18:37'], ['l07', 'l07', '1 Reis 18:38'], ['l08', 'l08', '1 Reis 18:39']];
export const QUOTES = ['l06'];
const PW = 1188, PH = 2112, GY = 1500;
const ELIAS = { robe: '#7a5a3a', mantle: '#4a3a2a', skin: '#a87a58', hair: '#3a2a20' };
const BAAL = ['#7a3a4a', '#8a5a3a', '#6a4a6a', '#9a6a3a'];

function buildMount() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1000], [0, 1000]]), lin(0, 0, 0, 1000, [[0, '#7a8aa8'], [.6, '#d8c0a0'], [1, '#f0d4a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 1000); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 980 - Math.sin(x / 260) * 40); c.lineTo(PW, 1200); c.lineTo(0, 1200); c.closePath(); }, lin(0, 920, 0, 1200, [[0, '#a89080'], [1, '#8a7060']]), { dir: 0, group: 'far', maxR: 14 });
  R.fill(P([[0, 1180], [PW, 1180], [PW, PH], [0, PH]]), lin(0, 1180, 0, PH, [[0, '#b89a6a'], [.5, '#8a6a44'], [1, '#4a3420']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  for (let k = 0; k < 14; k++) R.line(c => { const x0 = hash(k) * PW, y0 = 1300 + hash(k * 3) * 700; c.moveTo(x0, y0); c.lineTo(x0 + (hash(k * 5) - .5) * 160, y0 + 40); c.lineTo(x0 + (hash(k * 7) - .5) * 220, y0 + 90); }, '#4a3420', 5, { dir: 'edge', group: 'crack' + k, maxR: 3 });
  R.fill(c => { c.moveTo(860, 1250); c.lineTo(880, 1000); c.lineTo(900, 1250); c.closePath(); R.ctx; }, '#3a2a1e', { dir: 90, group: 'tree', maxR: 4 });
  R.line(c => { c.moveTo(880, 1060); c.lineTo(950, 990); c.moveTo(885, 1100); c.lineTo(820, 1040); c.moveTo(880, 1030); c.lineTo(900, 960); }, '#3a2a1e', 8, { dir: 'edge', group: 'tree', maxR: 3 });
  R.tint(E(900, 260, 300, 300), rad(900, 260, 10, 300, [[0, 'rgba(255,240,200,.9)'], [1, 'rgba(255,220,160,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 901, rev: (x, y) => Math.hypot(x - 594, (y - 1450) * 1.2) / 600 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { mount: buildMount };

// an altar of twelve stones with wood (and, at the end, water in the trench)
function altar(K, x, y, s, { wet = 0, burn = 0 } = {}) {
  const d = K.dyn;
  if (wet > 0) d.push({ x, y: y + 12 * s, ang: 0, len: 330 * s, wid: 46 * s, c: hex('#6a8a9a'), type: 2, seed: 5000, alpha: wet * (1 - burn), hgt: .5 });
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - (r > 1 ? 1 : 0); i++) { const n = 4 - (r > 1 ? 1 : 0), xx = x + (i - (n - 1) / 2) * 62 * s, yy = y - r * 46 * s - 20 * s; if (burn > .6) continue; d.push({ x: xx, y: yy, ang: 0, len: 66 * s, wid: 50 * s, c: shade(hex('#9a9084'), .8 + hash(r * 4 + i) * .3), c2: hex('#6a6058'), type: 2, seed: 5010 + r * 4 + i, alpha: 1 - ss(seg(burn, .3, .6)) }); }
  for (let k = 0; k < 4; k++) if (burn < .4) d.push({ x: x + (hash(k) - .5) * 60 * s, y: y - 150 * s - k * 12 * s, ang: (hash(k * 3) - .5) * .4, len: 200 * s, wid: 16 * s, c: hex('#6a4a2a'), type: 0, seed: 5030 + k, alpha: 1 - ss(seg(burn, .1, .4)) });
}
function flame(K, x, y, s, t, a = 1) { for (let i = 0; i < 30; i++) { const v = (i % 10) / 10, fl = Math.sin(t * 7 + i * 1.7) * 30 * s; K.dyn.push({ x: x + fl + (hash(i) - .5) * 160 * s, y: y - v * 360 * s, ang: -Math.PI / 2 + Math.sin(t * 5 + i) * .25, len: 150 * s, wid: 80 * s * (1 - v * .5), c: mixc(hex('#ffd060'), hex('#e8481a'), hash(i * 3) * .7), c2: hex('#fff0b0'), type: 1, seed: 5100 + i, alpha: .9 * a, hgt: .5 }); } }
function crowd(K, t, o, { y0 = 1640, n = 16, arms = 0, bow = 0, seed = 5200 } = {}) {
  for (let i = 0; i < n; i++) { const px = 80 + (i % 8) * 135 + (i >= 8 ? 60 : 0), py = y0 + (i >= 8 ? 90 : 0) + hash(i) * 20; person(K.dyn, px, py, i >= 8 ? 260 : 210, { f: hash(i * 3) > .5 ? 1 : -1, kneel: bow, lean: bow * .5, head: bow * .6, armF: [lerp(.3, 2.5, arms) + Math.sin(t * 5 + i) * .2 * arms, .2], pal: { robe: BAAL[i % 4], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: seed + i * 7 }); }
  K.flush({ ...o, run: .15 });
}

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: 594, y: lerp(1300, 1340, seg(t, 0, K.C('drought'))), zoom: lerp(1.2, 1.3, ss(seg(t, 0, K.C('drought')))) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.mount, o);
  crowd(K, t, o, { y0: 1560, n: 16, arms: .6 });
  person(K.dyn, 280, 1760, 470, { f: 1, pal: ELIAS, armF: [.3, .2], head: -.1, seed: 51 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .9 * ss(seg(t, 0, .8)) };
};
S.drought = (t, x, K) => {
  const a = K.C('drought'), b = K.C('carmel');
  const cam = { x: lerp(820, 760, seg(t, a, b)), y: lerp(1100, 1180, seg(t, a, b)), zoom: lerp(1.4, 1.3, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mount, o);
  motes(K.dyn, t, { x0: 400, x1: 1188, y0: 1100, y1: 1700, n: 40, rise: -10, size: 10, col: [.85, .78, .6], alpha: .3, seed: 51 }); K.flush(K.grey({ t, cam, alpha: x.a }));
  return { ...GREYW, expo: 1.0, contrast: 1.12 };
};
S.carmel = (t, x, K) => {
  const a = K.C('carmel'), b = K.C('baal');
  const cam = { x: 594, y: lerp(1300, 1340, seg(t, a, b)), zoom: lerp(1.15, 1.25, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mount, o);
  altar(K, 330, 1420, .9); altar(K, 850, 1420, .9); K.flush({ ...o, alpha: x.a, run: .15 });
  person(K.dyn, 594, 1720, 480, { f: 1, pal: ELIAS, armF: [lerp(.3, 2.6, ss(seg(t, a + 1, a + 2))), .1], seed: 51 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.baal = (t, x, K) => {
  const a = K.C('baal'), b = K.C('water');
  const cam = { x: lerp(400, 460, seg(t, a, b)), y: 1330, zoom: lerp(1.3, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mount, o);
  altar(K, 330, 1420, .9); K.flush({ ...o, alpha: x.a, run: .15 });
  for (let i = 0; i < 9; i++) { const ang = (t - a) * 1.2 + i / 9 * Math.PI * 2, px = 330 + Math.cos(ang) * 300, py = 1560 + Math.sin(ang) * 70; person(K.dyn, px, py, 330, { f: Math.sin(ang) > 0 ? -1 : 1, phase: t * 7 + i, stride: 1, armF: [2.5 + Math.sin(t * 6 + i) * .3, .2], armB: [2.2 + Math.cos(t * 6 + i) * .3, .2], pal: { robe: BAAL[i % 4], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 5300 + i * 7 }); }
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: lerp(1, .82, seg(t, a, b)), light: [lerp(-.6, .7, seg(t, a, b)), -.6, .55] };
};
S.water = (t, x, K) => {
  const a = K.C('water'), b = K.C('pray'), pours = [K.T.pour1, K.T.pour2, K.T.pour3];
  const cam = { x: 820, y: 1300, zoom: lerp(1.45, 1.55, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mount, o);
  const wet = pours.reduce((s, p) => s + ss(seg(t, p, p + .6)) / 3, 0);
  altar(K, 850, 1420, .9, { wet }); K.flush({ ...o, alpha: x.a, run: .15 });
  [[620, 1, 0], [1080, -1, 1]].forEach(([px, f, i]) => { const pour = Math.max(...pours.map(p => Math.sin(Math.PI * clamp((t - p + .4) / 1.0, 0, 1)))); person(K.dyn, px, 1500, 360, { f, armF: [lerp(.6, 2.0, pour), .2], armB: [lerp(.5, 1.8, pour), .2], pal: { robe: '#5a5a4a', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 5400 + i * 7 });
    if (pour > .5) for (let k = 0; k < 8; k++) K.dyn.push({ x: lerp(px + f * 130, 850, k / 7), y: lerp(1200, 1380, k / 7) + Math.sin(k) * 10, ang: Math.PI / 2 * .6 * f, len: 40, wid: 14, c: hex('#9ab8c8'), type: 3, seed: 5420 + k + i * 10, alpha: .8 }); });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.pray = (t, x, K) => {
  const a = K.C('pray'), b = K.C('fire');
  const cam = { x: 700, y: lerp(1300, 1340, seg(t, a, b)), zoom: lerp(1.3, 1.5, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mount, o);
  altar(K, 850, 1420, .9, { wet: 1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  person(K.dyn, 520, 1700, 470, { f: 1, kneel: 1, pal: ELIAS, armF: [2.6, .2], armB: [2.4, .2], head: -.5, seed: 51 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .9 };
};
const fireShot = (t, x, K, close) => {
  const a = K.C(close ? 'close' : 'fire'), fi = K.T.fire;
  const sh = close ? 0 : Math.exp(-Math.max(0, t - fi) * 2) * (t > fi ? 1 : 0);
  const cam = close ? { x: 594, y: lerp(1330, 1300, seg(t, a, a + 8)), zoom: lerp(1.15, 1.25, ss(seg(t, a, a + 8))) } : { x: 690 + Math.sin(t * 40) * 12 * sh, y: key(t, [[a, 1300], [fi + 2, 1250]]) + Math.cos(t * 37) * 10 * sh, zoom: key(t, [[a, 1.4], [fi + 2.5, 1.12]]) };
  const o = close ? K.col({ t, cam, appear: x.appear }) : { t, cam, grey: 1, reveal: fi, revDur: .3 };
  K.plate(K.PL.mount, close ? o : { ...o, revC: [850, 1350, 700] });
  const burn = close ? 1 : ss(seg(t, fi, fi + 2.2));
  altar(K, 850, 1420, .9, { wet: 1, burn }); K.flush({ ...o, run: .15 });
  // the fire falls
  const fall = close ? 1 : seg(t, fi - .25, fi);
  if (!close && fall < 1) { for (let i = 0; i < 18; i++) K.dyn.push({ x: 850 + (hash(i) - .5) * 160, y: lerp(-100, 1300, fall) - i * 50, ang: Math.PI / 2, len: 200, wid: 90 - i * 3, c: mixc(hex('#fff0b0'), hex('#ffb040'), i / 18), type: 1, seed: 5500 + i, alpha: .9, hgt: .3 }); K.flush({ t, cam, grey: 0, run: .4 }); }
  if (t > fi) { flame(K, 850, 1440, close ? .9 : lerp(1.6, 1.0, ss(seg(t, fi, fi + 3))), t, close ? .7 : 1); K.flush({ t, cam, grey: 0, run: .4 }); rays(K.dyn, { x: 850, y: -200, ang: Math.PI / 2, n: 9, spread: .35, len: 1700, wid: 120, alpha: .2, seed: 5550 }); K.flush({ t, cam, grey: 0, run: .6 }); }
  if (close) crowd(K, t, o, { y0: 1640, n: 16, bow: ss(seg(t, a, a + 1.5)), seed: 5600 });
  person(K.dyn, 520, 1700, 470, { f: 1, kneel: close ? 0 : 1, pal: ELIAS, armF: [close ? 2.6 : 2.6, .2], armB: [close ? .3 : 2.4, .2], head: -.4, seed: 51 }); K.flush({ ...o, run: .15 });
  const post = close ? WARM : lerpPost(GREYW, WARM, ss(seg(t, fi, fi + 2.5)));
  return { ...post, expo: post.expo * (1 + sh * .6) };
};
S.fire = (t, x, K) => fireShot(t, x, K, false);
S.close = (t, x, K) => fireShot(t, x, K, true);
