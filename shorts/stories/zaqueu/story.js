// ZAQUEU — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'O MAIS ODIADO<br><b>SUBIU NUMA ÁRVORE</b>';
export const COVER = 'Ele subiu <b>numa árvore</b><small>e Jesus o chamou pelo nome</small>';
export const COVER_T = 40.0;
export const BOOK = 'Lucas 19:1–10';
export const REFS = [['l02', 'l02', 'Lucas 19:2'], ['l03', 'l04', 'Lucas 19:3–4'], ['l05', 'l05', 'Lucas 19:5'], ['l06', 'l06', 'Lucas 19:7'], ['l07', 'l07', 'Lucas 19:8'], ['l08', 'l08', 'Lucas 19:9']];
export const QUOTES = ['l05'];
const PW = 1188, PH = 2112, GY = 1700, TREE = [820, 760];
const ZAQ = { robe: '#6a3a5a', mantle: '#c49a3a', skin: '#b07a58', hair: '#2a1a14' };
const JESUS = { robe: '#efe8d8', mantle: '#a83a3a', skin: '#b07a58', hair: '#3a2a20' };
const PAL = ['#6e5a42', '#7a6248', '#5a6070', '#7a5a4a', '#8a7a5a'];

function buildStreet() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1300], [0, 1300]]), lin(0, 0, 0, 1300, [[0, '#5a7aaa'], [.6, '#c8c0b0'], [1, '#f0d8a8']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  [[0, 700, 360, '#e0c8a0'], [330, 900, 300, '#d4b890'], [1000, 820, 200, '#d8c0a0']].forEach(([x, y, w, c], i) => { R.fill(P([[x, GY - 60], [x, y], [x + w, y], [x + w, GY - 60]]), lin(x, 0, x + w, 0, [[0, c], [1, '#9a7a58']]), { dir: 90, group: 'h' + i, maxR: 14 }); R.fill(P([[x + w * .35, GY - 60], [x + w * .35, GY - 260], [x + w * .65, GY - 260], [x + w * .65, GY - 60]]), '#4a3428', { dir: 90, group: 'hd' + i, maxR: 6 }); });
  R.fill(P([[0, GY - 80], [PW, GY - 80], [PW, PH], [0, PH]]), lin(0, GY - 80, 0, PH, [[0, '#c8a878'], [1, '#7a5a3a']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  // the sycamore-fig: thick trunk, wide low branches, a heavy crown
  R.fill(c => { c.moveTo(TREE[0] - 70, GY); c.bezierCurveTo(TREE[0] - 60, 1300, TREE[0] - 30, 1100, TREE[0] - 20, 900); c.lineTo(TREE[0] + 40, 900); c.bezierCurveTo(TREE[0] + 50, 1100, TREE[0] + 70, 1300, TREE[0] + 90, GY); c.closePath(); }, lin(TREE[0] - 70, 0, TREE[0] + 90, 0, [[0, '#7a6048'], [1, '#3a2a1e']]), { dir: 90, group: 'trunk', maxR: 10 });
  R.line(c => { c.moveTo(TREE[0], 1000); c.quadraticCurveTo(TREE[0] - 200, 900, TREE[0] - 330, 820); c.moveTo(TREE[0] + 10, 950); c.quadraticCurveTo(TREE[0] + 180, 860, TREE[0] + 300, 820); }, '#4a3424', 46, { dir: 'edge', group: 'branch', maxR: 8 });
  [[TREE[0], 560, 380, 260], [TREE[0] - 280, 700, 220, 170], [TREE[0] + 260, 690, 200, 160]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), lin(0, y - h, 0, y + h, [[0, '#8aa860'], [1, '#3a5a2a']]), { dir: 'edge', group: 'crown' + i, maxR: 16 }));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1101, rev: (x, y) => Math.hypot(x - 420, (y - 1600) * 1.1) / 650 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildHouse() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, PW, 0, [[0, '#5a4434'], [1, '#8a6a4c']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(P([[700, 500], [1000, 500], [1000, 900], [700, 900]]), lin(0, 500, 0, 900, [[0, '#e8c890'], [1, '#c89060']]), { dir: 90, group: 'win', maxR: 10 });
  R.fill(P([[0, 1560], [PW, 1560], [PW, PH], [0, PH]]), lin(0, 1560, 0, PH, [[0, '#7a5a40'], [1, '#3a2a1e']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.fill(P([[140, 1400], [1040, 1400], [1080, 1460], [100, 1460]]), lin(0, 1400, 0, 1460, [[0, '#9a6a3a'], [1, '#5a3a20']]), { dir: 0, group: 'table', maxR: 8 });
  R.fill(P([[160, 1460], [190, 1460], [190, 1640], [160, 1640]]), '#4a3020', { group: 'leg1', maxR: 4 }); R.fill(P([[1000, 1460], [1030, 1460], [1030, 1640], [1000, 1640]]), '#4a3020', { group: 'leg2', maxR: 4 });
  R.tint(P([[700, 900], [1000, 900], [700, 1700], [200, 1700]]), 'rgba(255,210,150,.22)');
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1102 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { street: buildStreet, house: buildHouse };

function crowd(K, t, o, { n = 12, y = GY + 60, x0 = 60, x1 = 1100, murmur = 0, seed = 7000, H = 400 } = {}) {
  for (let i = 0; i < n; i++) { const px = lerp(x0, x1, i / (n - 1)) + (hash(i + seed) - .5) * 40, py = y + (i % 2) * 40; person(K.dyn, px, py, H * (.9 + hash(i * 3) * .2), { f: hash(i * 5 + seed) > .5 ? 1 : -1, armF: [lerp(.3, 1.4 + Math.sin(t * 4 + i) * .2, murmur * (i % 3 ? 1 : 0)), .3], head: -.1, pal: { robe: PAL[i % 5], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: seed + i * 7 }); }
  K.flush({ ...o, run: .15 });
}
function zaqInTree(K, o, wave = 0) { person(K.dyn, TREE[0] - 170, 840, 250, { f: -1, kneel: .6, lean: .3, head: .45, armF: [lerp(1.4, 2.5, wave), .4], armB: [.9, .6], pal: ZAQ, seed: 81 }); K.flush({ ...o, run: .15 }); }

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: 700, y: key(t, [[0, 1000], [K.C('tax'), 1150]]), zoom: key(t, [[0, 1.4], [K.C('tax'), 1.2]]) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.street, o); zaqInTree(K, o);
  crowd(K, t, o, { n: 9, y: GY + 120, x0: 120, x1: 1100, H: 420 });
  return { ...GREYW, expo: .9 * ss(seg(t, 0, .8)) };
};
S.tax = (t, x, K) => {
  const a = K.C('tax'), b = K.C('crowd');
  const cam = { x: 594, y: lerp(1300, 1330, seg(t, a, b)), zoom: lerp(1.25, 1.38, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.house, o);
  for (let k = 0; k < 9; k++) K.dyn.push({ x: 520 + (k % 3) * 34 + (k / 3 | 0) * 12, y: 1390 - (k / 3 | 0) * 14, ang: 0, len: 30, wid: 18, c: hex('#e8c050'), type: 2, seed: 7100 + k });
  K.flush({ ...o, alpha: x.a });
  person(K.dyn, 380, 1640, 330, { f: 1, pal: ZAQ, armF: [1.3 + Math.sin(t * 3) * .1, .5], lean: .1, seed: 81 });
  person(K.dyn, 820, 1660, 430, { f: -1, pal: { robe: '#5a5a4a', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, armF: [1.1, .6], head: .2, seed: 7150 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.crowd = (t, x, K) => {
  const a = K.C('crowd'), b = K.C('climb');
  const cam = { x: 420, y: lerp(1300, 1340, seg(t, a, b)), zoom: lerp(1.3, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.street, o);
  // Zaqueu jumping behind the wall of backs
  const hop = Math.abs(Math.sin((t - a) * 3.4)) * 190;
  person(K.dyn, 330, GY - hop, 300, { f: 1, pal: ZAQ, armF: [2.2, .3], head: -.3, seed: 81 }); K.flush({ ...o, alpha: x.a, run: .15 });
  crowd(K, t, { ...o, alpha: x.a }, { n: 7, y: GY + 80, x0: 60, x1: 760, H: 470, seed: 7200 });
  return { ...GREYW };
};
S.climb = (t, x, K) => {
  const a = K.C('climb'), b = K.C('look');
  const cam = { x: 700, y: lerp(1300, 1050, eio(seg(t, a, b))), zoom: lerp(1.25, 1.35, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.street, o);
  const run = seg(t, a, a + 1.2), up = ss(seg(t, a + 1.2, a + 2.8));
  if (up <= 0) { person(K.dyn, lerp(300, TREE[0] - 120, run), GY, 300, { f: 1, pal: ZAQ, phase: (t - a) * 9, stride: 1, lean: .2, seed: 81 }); K.flush({ ...o, alpha: x.a, run: .15 }); }
  else if (up < 1) { person(K.dyn, lerp(TREE[0] - 120, TREE[0] - 170, up), lerp(GY, 840, up), 280, { f: 1, pal: ZAQ, armF: [2.8, .2], armB: [2.4, .3], lean: -.1, kneel: up * .6, seed: 81 }); K.flush({ ...o, alpha: x.a, run: .15 }); }
  else zaqInTree(K, { ...o, alpha: x.a });
  return { ...GREYW };
};
S.look = (t, x, K) => {
  const a = K.C('look'), nm = K.T.name, dn = K.T.down;
  const cam = { x: 700, y: key(t, [[a, 1500], [nm - .2, 1100], [dn + .6, 1300]]), zoom: key(t, [[a, 1.3], [nm, 1.35], [dn + 1, 1.15]]) };
  const o = { t, cam, grey: 1, reveal: nm, revDur: .35 };
  K.plate(K.PL.street, { ...o, revC: [420, 1600, 520] });
  const g = eo(seg(t, nm, nm + 2.5));
  rays(K.dyn, { x: 520, y: -200, ang: Math.PI / 2 - .1, n: 9, spread: .4, len: 1900, wid: 120, alpha: .22 * g, grow: .3 + .7 * g, seed: 7300 }); K.flush({ t, cam, grey: 0, run: .6 });
  const down = ss(seg(t, dn - .4, dn + .5));
  if (down < 1) zaqInTree(K, o, ss(seg(t, nm, nm + .6)) * (1 - down));
  if (down > 0) { person(K.dyn, lerp(TREE[0] - 170, 620, down), lerp(840, GY, down), lerp(250, 320, down), { f: -1, pal: ZAQ, armF: [lerp(2.5, 1.0, down), .3], seed: 81 }); K.flush({ ...o, run: .15 }); }
  person(K.dyn, 420, GY + 20, 440, { f: 1, pal: JESUS, head: lerp(0, -.55, ss(seg(t, a + .8, a + 1.8))) * (1 - down * .6), armF: [lerp(.3, 1.6, ss(seg(t, nm - .3, nm + .3))) * (1 - down * .5), .2], seed: 61 }); K.flush({ t, cam, grey: 0, run: .15 });
  crowd(K, t, o, { n: 4, y: GY + 160, x0: 60, x1: 260, H: 480, seed: 7400 });
  const post = lerpPost(GREYW, WARM, ss(seg(t, nm, nm + 3)));
  return { ...post };
};
S.murmur = (t, x, K) => {
  const a = K.C('murmur'), b = K.C('give');
  const cam = { x: 594, y: 1340, zoom: lerp(1.15, 1.25, ss(seg(t, a, b))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.street, o);
  person(K.dyn, 520, GY - 20, 420, { f: 1, pal: JESUS, armF: [.6, .3], seed: 61 }); person(K.dyn, 700, GY - 20, 330, { f: -1, pal: ZAQ, seed: 81 }); K.flush({ ...o, alpha: x.a, run: .15 });
  crowd(K, t, { ...o, alpha: x.a }, { n: 8, y: GY + 150, x0: 60, x1: 1120, H: 470, murmur: 1, seed: 7500 });
  return { ...WARM };
};
const house = (t, x, K, close) => {
  const a = K.C(close ? 'close' : 'give');
  const cam = close ? { x: 594, y: lerp(1300, 1260, seg(t, a, a + 9)), zoom: lerp(1.15, 1.3, ss(seg(t, a, a + 9))) } : { x: 594, y: 1320, zoom: lerp(1.2, 1.3, ss(seg(t, a, K.C('close')))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.house, o);
  rays(K.dyn, { x: 850, y: 600, ang: 2.1, n: 7, spread: .3, len: 1300, wid: 110, alpha: .16, seed: 7600 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  const give = close ? 1 : ss(seg(t, a + .6, a + 2.2));
  for (let k = 0; k < 8; k++) { const fl = close ? 1 : seg(t, a + .8 + k * .2, a + 1.4 + k * .2); K.dyn.push({ x: lerp(560, 760 + (k % 3) * 60, fl), y: lerp(1390, 1470 + (k % 2) * 30, fl) - Math.sin(fl * Math.PI) * 60, ang: 0, len: 26, wid: 18, c: hex('#e8c050'), type: 2, seed: 7700 + k }); }
  K.flush({ ...o, alpha: x.a });
  person(K.dyn, 420, 1640, 340, { f: 1, pal: ZAQ, armF: [lerp(.6, 1.4, give), .2], armB: [lerp(.4, 1.1, give), .3], seed: 81 });
  [[780, 1680, -1], [930, 1700, -1]].forEach(([px, py, f], i) => person(K.dyn, px, py, 420, { f, kneel: .4, armF: [1.4, .3], pal: { robe: '#6a6050', mantle: '#4a4236', skin: '#a07050', hair: '#2a2018' }, seed: 7750 + i * 7 }));
  if (close) person(K.dyn, 220, 1660, 440, { f: 1, pal: JESUS, armF: [.6, .3], seed: 61 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [.5, -.6, .6] };
};
S.give = (t, x, K) => house(t, x, K, false);
S.close = (t, x, K) => house(t, x, K, true);
