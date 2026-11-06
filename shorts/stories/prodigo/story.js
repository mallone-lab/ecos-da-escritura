// O FILHO PRÓDIGO — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { pig } from '../../scenes/actors2.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'GASTOU TUDO.<br><b>E VOLTOU.</b>';
export const COVER = 'O pai <b>correu</b><small>quando ele voltou</small>';
export const COVER_T = 34.6;
export const BOOK = 'Lucas 15:11–32';
export const REFS = [['l02', 'l02', 'Lucas 15:11–12'], ['l03', 'l03', 'Lucas 15:13'], ['l04', 'l04', 'Lucas 15:14–16'], ['l05', 'l05', 'Lucas 15:17–18'], ['l06', 'l06', 'Lucas 15:20'], ['l07', 'l07', 'Lucas 15:22–24']];
export const QUOTES = [];
const PW = 1188, PH = 2112;
const SON = { robe: '#7a6a52', mantle: '#5a4a3a', skin: '#b07a58', hair: '#3a2a22' };
const RAGS = { robe: '#6a6050', mantle: '#4a4236', skin: '#a07050', hair: '#2a2018' };
const FATHER = { robe: '#5a6a8a', mantle: '#c4a060', skin: '#a87a58', hair: '#e8e0d0' };
const BEST = { robe: '#f0e6cc', mantle: '#a83a3a', skin: '#b07a58', hair: '#3a2a22' };

function buildPigpen() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1000], [0, 1000]]), lin(0, 0, 0, 1000, [[0, '#5a6a8a'], [.7, '#b0a8a0'], [1, '#d8c0a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 1000); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 980 - Math.sin(x / 180) * 40); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 940, 0, PH, [[0, '#8a7a5a'], [.4, '#5a4a32'], [1, '#2a2016']]), { dir: 0, fallback: 0, group: 'mud', maxR: 30 });
  for (let k = 0; k < 9; k++) R.fill(P([[k * 140 + 20, 1260], [k * 140 + 44, 1260], [k * 140 + 44, 1060], [k * 140 + 20, 1060]]), '#4a3a2a', { dir: 90, group: 'post' + k, maxR: 4 });
  [1100, 1200].forEach((y, i) => R.fill(P([[0, y], [PW, y - 20], [PW, y], [0, y + 20]]), '#5a4632', { dir: 0, group: 'rail' + i, maxR: 4 }));
  R.fill(P([[620, 1700], [1080, 1700], [1040, 1790], [660, 1790]]), lin(0, 1700, 0, 1790, [[0, '#6a5034'], [1, '#3a2a1a']]), { dir: 0, group: 'trough', maxR: 8 });
  [[300, 1560, 160, 40], [800, 1900, 220, 50]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), '#3a3024', { dir: 0, group: 'pud' + i, maxR: 8 }));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 601 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildHouse() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1100], [0, 1100]]), lin(0, 0, 0, 1100, [[0, '#4a6aa0'], [.6, '#e0b090'], [1, '#f6d8a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(P([[0, 1100], [PW, 1100], [PW, PH], [0, PH]]), lin(0, 1100, 0, PH, [[0, '#a89a6a'], [1, '#5a4a30']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  R.fill(P([[120, 1500], [120, 900], [900, 900], [900, 1500]]), lin(120, 0, 900, 0, [[0, '#e8d4b0'], [1, '#a88a64']]), { dir: 90, group: 'wall', maxR: 18 });
  R.fill(P([[90, 900], [930, 900], [930, 850], [90, 850]]), '#7a5a3e', { dir: 0, group: 'roof', maxR: 8 });
  R.fill(P([[420, 1500], [420, 1180], [600, 1180], [600, 1500]]), '#4a3020', { dir: 90, group: 'door', maxR: 8 });
  R.fill(P([[200, 1020], [330, 1020], [330, 1130], [200, 1130]]), lin(0, 1020, 0, 1130, [[0, '#ffd27a'], [1, '#e08a3c']]), { dir: 90, group: 'win', maxR: 6 });
  R.fill(c => { c.moveTo(1040, 1500); c.lineTo(1060, 900); c.lineTo(1090, 900); c.lineTo(1100, 1500); c.closePath(); }, '#5a4030', { dir: 90, group: 'trunk', maxR: 6 });
  R.fill(E(1070, 820, 200, 170), lin(0, 650, 0, 990, [[0, '#7a9a5a'], [1, '#3a5a2a']]), { dir: 'edge', group: 'tree', maxR: 14 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 602, rev: (x, y) => Math.hypot(x - 510, (y - 1450) * 1.2) / 600 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildFar() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1000], [0, 1000]]), lin(0, 0, 0, 1000, [[0, '#141a30'], [1, '#4a3a5a']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 1000); for (let x = 0; x <= PW; x += 30) c.lineTo(x, 960 - (x > 500 && x < 1000 ? 80 + Math.sin(x / 20) * 20 : 0)); c.lineTo(PW, 1100); c.lineTo(0, 1100); c.closePath(); }, '#2a2236', { dir: 0, group: 'city', maxR: 10 });
  for (let k = 0; k < 18; k++) R.fill(E(520 + hash(k) * 460, 900 + hash(k * 3) * 120, 7, 9), '#ffcc70', { group: 'light' + k, maxR: 2 });
  R.fill(P([[0, 1050], [PW, 1050], [PW, PH], [0, PH]]), lin(0, 1050, 0, PH, [[0, '#3a3242'], [1, '#14101a']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  R.fill(P([[700, 1050], [760, 1050], [1100, PH], [200, PH]]), lin(0, 1050, 0, PH, [[0, '#6a5a6a'], [1, '#3a3038']]), { dir: 90, group: 'road', maxR: 16 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 603 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildRoad() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 500], [0, 500]]), lin(0, 0, 0, 500, [[0, '#5a7ab0'], [1, '#f2c890']]), { dir: -3, fallback: -3, group: 'sky', maxR: 40 });
  R.fill(P([[0, 450], [PW, 450], [PW, PH], [0, PH]]), lin(0, 450, 0, PH, [[0, '#b8a874'], [.5, '#8a8a52'], [1, '#4a4a2a']]), { dir: 0, fallback: 0, group: 'hill', maxR: 30 });
  // the house at the top of the hill
  R.fill(P([[700, 470], [700, 360], [880, 360], [880, 470]]), '#e8d4b0', { dir: 90, group: 'h', maxR: 6 });
  R.fill(P([[690, 360], [890, 360], [890, 345], [690, 345]]), '#7a5a3e', { group: 'hr', maxR: 4 });
  R.fill(P([[720, 380], [750, 380], [750, 410], [720, 410]]), '#ffd27a', { group: 'hw', maxR: 3 });
  // the road winding down toward us
  R.fill(c => { c.moveTo(770, 470); c.bezierCurveTo(500, 700, 900, 1000, 560, 1300); c.bezierCurveTo(300, 1550, 700, 1800, 600, PH + 20); c.lineTo(980, PH + 20); c.bezierCurveTo(1020, 1800, 560, 1550, 720, 1300); c.bezierCurveTo(1040, 1000, 600, 700, 800, 470); c.closePath(); }, lin(0, 470, 0, PH, [[0, '#e8d8b0'], [1, '#b89a6a']]), { dir: 'edge', group: 'road', maxR: 16 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 604, rev: (x, y) => Math.hypot(x - 700, (y - 900) * .8) / 700 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { pigpen: buildPigpen, house: buildHouse, far: buildFar, road: buildRoad };
// point on the road centre at u (0 = the house, 1 = bottom of the frame)
const bez = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
const roadAt = u => u < .5 ? bez([785, 470], [550, 700], [960, 1000], [640, 1300], u * 2) : bez([640, 1300], [300, 1550], [860, 1800], [790, PH], u * 2 - 1);

export const S = {};
const PIGS = [[720, 1600, 280, -1, 0], [960, 1620, 250, -1, 1.4], [200, 1700, 260, 1, 2.6]];
const pigpen = (t, x, K, hook) => {
  const a = hook ? 0 : K.C('pig2'), b = hook ? K.C('house') : K.C('road');
  const cam = { x: 594, y: lerp(1280, 1330, seg(t, a, b)), zoom: lerp(1.25, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.pigpen, o);
  PIGS.forEach(([px, py, s, f, p], i) => pig(K.dyn, px + Math.sin(t * .4 + p) * 30, py, s, { f, phase: t * 3 + p, seed: 1800 + i * 20 }));
  K.flush({ ...o, alpha: x.a, run: .15 });
  const rise = hook ? 0 : ss(seg(t, K.T.rise - .6, K.T.rise + .8));
  person(K.dyn, 430, 1560, 430, { f: 1, kneel: 1 - rise, lean: lerp(.45, -.05, rise), head: lerp(.55, -.3, rise), armF: [lerp(.9, .3, rise), lerp(1, .3, rise)], armB: [.8, .9], pal: RAGS, seed: 71 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: hook ? .88 * ss(seg(t, 0, .8)) : .9, light: [-.4, -.7, .6] };
};
S.pig1 = (t, x, K) => pigpen(t, x, K, true);
S.pig2 = (t, x, K) => pigpen(t, x, K, false);
// the father's house: in the grey world only the lit window keeps its colour
S.house = (t, x, K) => {
  const a = K.C('house'), b = K.C('far');
  const cam = { x: lerp(560, 520, seg(t, a, b)), y: lerp(1250, 1300, seg(t, a, b)), zoom: lerp(1.15, 1.28, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.house, o);
  K.dyn.push({ x: 265, y: 1075, ang: 0, len: 130, wid: 110, c: hex('#ffd27a'), c2: hex('#e08a3c'), type: 0, seed: 1900 }); K.dyn.push({ x: 265, y: 1075, ang: 0, len: 360, wid: 300, c: hex('#ffc060'), type: 2, seed: 1901, alpha: .12, hgt: 0 }); K.flush(K.col({ t, cam, alpha: x.a }));
  const give = ss(seg(t, K.T.bag - .6, K.T.bag + .2)), leave = seg(t, K.T.bag + .9, b);
  person(K.dyn, 400, 1560, 430, { f: 1, pal: FATHER, armF: [lerp(.3, 1.2, give * (1 - leave)), .3], lean: .05, head: .1 + .2 * leave, seed: 72 });
  const sx = 680 + leave * 500;
  person(K.dyn, sx, 1580, 440, { f: leave > 0 ? 1 : -1, pal: SON, phase: leave * 12, stride: leave > 0 ? 1 : 0, armF: [lerp(.3, 1.2, give), .3], seed: 73 });
  if (give > .3) K.dyn.push({ x: sx + (leave > 0 ? 40 : -60), y: 1580 - 220, ang: 0, len: 44, wid: 52, c: hex('#8a6a3a'), type: 2, seed: 1902 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.far = (t, x, K) => {
  const a = K.C('far'), b = K.C('pig2');
  const cam = { x: 594, y: lerp(1300, 1250, seg(t, a, b)), zoom: lerp(1.15, 1.25, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.far, o);
  const u = seg(t, a, b), py = lerp(1900, 1250, u), H = lerp(440, 160, u);
  person(K.dyn, lerp(640, 735, u), py, H, { f: 1, pal: SON, phase: (t - a) * 5, stride: 1, seed: 73 });
  // coins slipping away behind him
  for (let k = 0; k < 8; k++) { const ts = a + .5 + k * .45; if (t > ts) { const fl = seg(t, ts, ts + .5); K.dyn.push({ x: lerp(640, 735, seg(ts, a, b)) - 20 + k * 3, y: lerp(lerp(1900, 1250, seg(ts, a, b)) - H * .4, lerp(1900, 1250, seg(ts, a, b)), fl), ang: 0, len: 14, wid: 14, c: hex('#e8c050'), type: 2, seed: 1950 + k }); } }
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .8, light: [.3, -.8, .5] };
};
S.road = (t, x, K) => {
  const a = K.C('road'), see = K.T.see, run = K.T.run, meet = K.T.meet;
  const cam = { x: 640, y: key(t, [[a, 1300], [see, 1000], [meet, 1050], [K.C('feast'), 1080]]), zoom: key(t, [[a, 1.15], [see, 1.0], [meet, 1.15], [K.C('feast'), 1.25]]) };
  const o = { t, cam, grey: 1, reveal: run, revDur: .35, appear: x.appear };
  K.plate(K.PL.road, { ...o, revC: [785, 470, 450] });
  // the son walks up the road; the father sees him and runs down to meet him
  const su = lerp(1, .55, seg(t, a, meet)), [sx, sy] = roadAt(su);
  const fu = t < run ? 0 : lerp(0, .53, ss(seg(t, run, meet))), [fx, fy] = roadAt(fu);
  const H = u => lerp(110, 520, u * u);
  const hug = ss(seg(t, meet - .3, meet + .4));
  person(K.dyn, sx, sy, H(su), { f: -1, pal: RAGS, phase: (t - a) * 4, stride: 1 - hug, lean: .2 * (1 - hug), head: .3 * (1 - hug), armF: [lerp(.2, 1.4, hug), .4], seed: 71 });
  person(K.dyn, fx + (hug > 0 ? 30 : 0), fy, H(Math.max(fu, .05)), { f: 1, pal: FATHER, phase: (t - run) * 8, stride: t > run && hug < .5 ? 1 : 0, lean: t > run ? .25 * (1 - hug) : 0, armF: [lerp(t > see ? .9 : .2, 1.5, hug), .3], armB: [lerp(.2, 1.3, hug), .3], seed: 72 });
  K.flush({ ...o, run: .15 });
  const g = eo(seg(t, run, run + 2.5));
  rays(K.dyn, { x: 785, y: 300, ang: Math.PI / 2 - .25, n: 9, spread: .5, len: 1700, wid: 110, alpha: .18 * g, grow: .3 + .7 * g, seed: 1960 }); K.flush({ t, cam, grey: 0, run: .6 });
  const post = lerpPost(GREYW, WARM, ss(seg(t, run, run + 3)));
  return { ...post };
};
S.feast = (t, x, K) => {
  const a = K.C('feast'), rg = K.T.ring;
  const cam = { x: lerp(520, 560, seg(t, a, K.C('close'))), y: 1300, zoom: lerp(1.2, 1.35, ss(seg(t, a, K.C('close')))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.house, o);
  // lanterns, guests, the father puts the best robe and a ring on his son
  for (let k = 0; k < 7; k++) { const lx = 160 + k * 120, ly = 900 + Math.sin(k) * 20; K.dyn.push({ x: lx, y: ly + Math.sin(t * 2 + k) * 4, ang: 0, len: 34, wid: 44, c: hex(['#ffcc60', '#ff9a50', '#ffe080'][k % 3]), type: 2, seed: 2000 + k, hgt: .6 }); K.dyn.push({ x: lx, y: ly, ang: 0, len: 150, wid: 150, c: hex('#ffc060'), type: 2, seed: 2010 + k, alpha: .1, hgt: 0 }); }
  K.flush({ ...o, alpha: x.a, run: .3 });
  [[150, 1640, 1], [930, 1660, -1], [1040, 1600, -1]].forEach(([px, py, f], i) => person(K.dyn, px, py, 380, { f, pal: { robe: ['#7a5a8a', '#4a7a6a', '#8a6a3a'][i], mantle: '#c49a3a', skin: '#a07050', hair: '#2a2220' }, armF: [2.4 + Math.sin(t * 3 + i) * .3, .3], seed: 2020 + i * 5 }));
  const robe = ss(seg(t, a + .6, a + 1.4));
  person(K.dyn, 420, 1600, 440, { f: 1, pal: FATHER, armF: [lerp(1.2, 1.5, ss(seg(t, rg - .4, rg))), .2], seed: 72 });
  person(K.dyn, 640, 1610, 450, { f: -1, pal: robe > .5 ? BEST : RAGS, armF: [lerp(.3, 1.3, ss(seg(t, rg - .4, rg))), .2], head: -.05, seed: 71 });
  if (t > rg) K.dyn.push({ x: 560, y: 1600 - 450 * .45, ang: 0, len: 22, wid: 22, c: hex('#ffd040'), type: 2, seed: 2050, hgt: 1.4 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [-.5, -.6, .55] };
};
S.close = (t, x, K) => {
  const a = K.C('close');
  const cam = { x: 640, y: lerp(900, 760, ss(seg(t, a, a + 9))), zoom: lerp(1.05, 1.3, ss(seg(t, a, a + 9))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.road, o);
  const [fx, fy] = roadAt(.08);
  person(K.dyn, fx, fy, 150, { f: 1, pal: FATHER, head: .25, armF: [.3, .3], seed: 72 }); K.flush({ ...o, alpha: x.a, run: .15 });
  rays(K.dyn, { x: 785, y: 300, ang: Math.PI / 2 - .25, n: 9, spread: .5, len: 1700, wid: 110, alpha: .16, seed: 1960 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  return { ...WARM };
};
