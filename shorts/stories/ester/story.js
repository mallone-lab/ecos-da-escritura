// ESTER — plates and shots (horizontal 1920x1080; plates 2112x1188)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'UMA JOVEM ÓRFÃ.<br><b>UM DECRETO DE MORTE.</b>';
export const COVER = 'Se eu morrer,<br><b>morri</b><small>a coragem de Ester</small>';
export const COVER_T = 66.0;
export const BOOK = 'Livro de Ester';
export const REFS = [['l02', 'l02', 'Ester 2:7'], ['l03', 'l03', 'Ester 2:17'], ['l04', 'l04', 'Ester 3:2–5'], ['l05', 'l05', 'Ester 3:8–13'], ['l06', 'l06', 'Ester 4:14'], ['l07', 'l07', 'Ester 4:11'], ['l08', 'l08', 'Ester 4:16'], ['l09', 'l09', 'Ester 5:2'], ['l10', 'l10', 'Ester 7:3–6'], ['l11', 'l11', 'Ester 7:10; 8:11'], ['l12', 'l12', 'Ester 9:22']];
export const QUOTES = ['l06', 'l08'];
const PW = 2112, PH = 1188, FL = 1000;
const ESTER = { robe: '#2a5a9a', mantle: '#e8d8b0', skin: '#c08a68', hair: '#2a1a14' };
const KING = { robe: '#5a2e5e', mantle: '#c49a3a', skin: '#a07050', hair: '#2a2020' };
const HAMAN = { robe: '#8a2a2a', mantle: '#2a2224', skin: '#a07050', hair: '#1a1414' };
const MORD = { robe: '#6a6050', mantle: '#4a4236', skin: '#a87a58', hair: '#d8d0c0' };
const FOLK = ['#6e5a42', '#7a6248', '#5a6070', '#7a5a4a', '#8a7a5a'];

function buildHall() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#2a3a5a'], [.55, '#8a6a52'], [1, '#3a2a20']]), { dir: 90, fallback: 90, group: 'bg', maxR: 40 });
  for (let k = 0; k < 7; k++) { const x = 140 + k * 305; R.fill(P([[x - 55, FL], [x - 45, 160], [x + 45, 160], [x + 55, FL]]), lin(x - 55, 0, x + 55, 0, [[0, '#e8d0a8'], [.5, '#c4a07a'], [1, '#6a5038']]), { dir: 90, group: 'col' + k, maxR: 12 }); R.fill(P([[x - 80, 160], [x + 80, 160], [x + 60, 110], [x - 60, 110]]), '#3a6a8a', { dir: 0, group: 'cap' + k, maxR: 6 }); }
  R.fill(P([[0, 60], [PW, 60], [PW, 120], [0, 120]]), lin(0, 60, 0, 120, [[0, '#e0c080'], [1, '#8a6a3a']]), { dir: 0, group: 'beam', maxR: 8 });
  R.fill(P([[1560, FL], [1600, 860], [1900, 860], [1940, FL]]), '#9a7a5a', { dir: 0, group: 'dais', maxR: 8 });
  R.fill(P([[1660, 860], [1660, 540], [1840, 540], [1840, 860]]), lin(1660, 0, 1840, 0, [[0, '#f0c850'], [1, '#a07020']]), { dir: 90, group: 'throne', maxR: 8 });
  R.fill(P([[0, FL], [PW, FL], [PW, PH], [0, PH]]), lin(0, FL, 0, PH, [[0, '#a07a5a'], [1, '#4a3424']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.fill(P([[200, FL], [1700, FL], [1760, PH], [140, PH]]), lin(0, FL, 0, PH, [[0, '#8a2a2a'], [1, '#4a1414']]), { dir: 0, group: 'carpet', maxR: 14 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1301, rev: (x, y) => Math.hypot(x - 1300, (y - 850) * 1.2) / 900 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildGate() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 700], [0, 700]]), lin(0, 0, 0, 700, [[0, '#5a7aaa'], [.6, '#c8c0b0'], [1, '#f0d8a8']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(P([[0, 220], [PW, 220], [PW, FL], [0, FL]]), lin(0, 220, 0, FL, [[0, '#d8b888'], [1, '#9a7a52']]), { dir: 90, group: 'wall', maxR: 20 });
  for (let x = 0; x < PW; x += 60) R.fill(P([[x, 220], [x, 190], [x + 34, 190], [x + 34, 220]]), '#c8a070', { dir: 90, group: 'wall', maxR: 5 });
  R.fill(c => { c.moveTo(860, FL); c.lineTo(860, 560); c.ellipse(1056, 560, 196, 180, 0, Math.PI, 2 * Math.PI); c.lineTo(1252, FL); c.closePath(); }, '#2a1c16', { dir: 90, group: 'arch', maxR: 8 });
  for (let k = 0; k < 6; k++) R.fill(P([[k * 360 + 60, 380], [k * 360 + 110, 380], [k * 360 + 110, 460], [k * 360 + 60, 460]]), '#3a6a8a', { group: 'tile' + k, maxR: 4 });
  R.fill(P([[0, FL], [PW, FL], [PW, PH], [0, PH]]), lin(0, FL, 0, PH, [[0, '#c8a878'], [1, '#7a5a3a']]), { dir: 0, fallback: 0, group: 'ground', maxR: 24 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1302 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildRoom() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, PW, 0, [[0, '#3a2a3a'], [1, '#7a5a4a']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(c => { c.moveTo(1300, 900); c.lineTo(1300, 420); c.ellipse(1450, 420, 150, 150, 0, Math.PI, 2 * Math.PI); c.lineTo(1600, 900); c.closePath(); }, lin(0, 270, 0, 900, [[0, '#6a7aa8'], [1, '#e8b880']]), { dir: -3, group: 'win', maxR: 10 });
  R.line(c => { c.moveTo(1300, 900); c.lineTo(1300, 420); c.ellipse(1450, 420, 150, 150, 0, Math.PI, 2 * Math.PI); c.lineTo(1600, 900); }, '#2a1c16', 26, { dir: 'edge', group: 'frame', maxR: 5 });
  R.fill(P([[0, FL], [PW, FL], [PW, PH], [0, PH]]), lin(0, FL, 0, PH, [[0, '#6a4a34'], [1, '#2a1a10']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.fill(P([[300, FL], [900, FL], [960, 1120], [240, 1120]]), lin(0, FL, 0, 1120, [[0, '#2a4a7a'], [1, '#1a2a4a']]), { dir: 0, group: 'rug', maxR: 12 });
  R.tint(P([[1300, 900], [1600, 900], [1100, 1188], [500, 1188]]), 'rgba(255,200,140,.22)');
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1303 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { hall: buildHall, gate: buildGate, room: buildRoom };

const ester = (K, x, y, H, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? 1, pal: ESTER, beard: false, bare: 1, hairLen: .55, hairCol: '#2a1a14', crown: o.crown, kneel: o.kneel, head: o.head, armF: o.armF || [.3, .3], armB: o.armB, lean: o.lean, phase: o.phase, stride: o.stride, seed: 101 });
const king = (K, x, y, H, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? -1, pal: KING, crown: 1, armF: o.armF || [.3, .3], head: o.head, lean: o.lean, seed: 102 });
const haman = (K, x, y, H, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? -1, pal: HAMAN, helmet: '#5a1a1a', armF: o.armF || [.4, .4], kneel: o.kneel, lean: o.lean, head: o.head, lie: o.lie, seed: 103 });
const mord = (K, x, y, H, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? 1, pal: MORD, armF: o.armF || [.3, .4], kneel: o.kneel, head: o.head, seed: 104 });
function scepter(K, x, y, len, ang, o) { K.dyn.push({ x: x + Math.cos(ang) * len / 2, y: y + Math.sin(ang) * len / 2, ang, len, wid: 12, c: hex('#f2c24a'), c2: hex('#c8902a'), type: 0, seed: 1350, hgt: 1.3 }); K.dyn.push({ x: x + Math.cos(ang) * len, y: y + Math.sin(ang) * len, ang: 0, len: 34, wid: 34, c: hex('#ffd860'), type: 2, seed: 1351, hgt: 1.4 }); K.flush({ ...o, grey: 0, reveal: -1e6, run: .1 }); }
const hall = (t, x, K, cam, grey = true) => { const o = grey ? K.grey({ t, cam, appear: x.appear }) : K.col({ t, cam, appear: x.appear }); K.plate(K.PL.hall, o); return { ...o, alpha: x.a }; };

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: lerp(600, 760, seg(t, 0, K.C('home'))), y: 640, zoom: lerp(1.2, 1.35, ss(seg(t, 0, K.C('home')))) };
  const o = hall(t, { a: 1 }, K, cam);
  ester(K, 520, 1060, 520, { head: -.1 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .85 * ss(seg(t, 0, .8)) };
};
S.home = (t, x, K) => {
  const a = K.C('home'), b = K.C('crown');
  const cam = { x: lerp(1350, 1450, seg(t, a, b)), y: 680, zoom: lerp(1.3, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.room, o);
  mord(K, 1250, 1060, 480, { f: 1, armF: [.9, .6] }); ester(K, 1560, 1060, 420, { f: -1, head: .1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.crown = (t, x, K) => {
  const a = K.C('crown'), b = K.C('gate'), put = ss(seg(t, a + 1.5, a + 2.6));
  const cam = { x: lerp(1500, 1560, seg(t, a, b)), y: 680, zoom: lerp(1.3, 1.45, ss(seg(t, a, b))) };
  const o = hall(t, x, K, cam);
  king(K, 1750, 860, 440, { armF: [lerp(.3, 1.5, put), .2] }); ester(K, 1430, 1060, 440, { f: 1, crown: put > .9 ? 1 : 0, kneel: lerp(.6, 0, put), head: .2 * (1 - put) }); K.flush({ ...o, run: .15 });
  return { ...GREYW };
};
S.gate = (t, x, K) => {
  const a = K.C('gate'), b = K.C('decree'), bow = ss(seg(t, a + .8, a + 1.8));
  const cam = { x: lerp(1000, 1100, seg(t, a, b)), y: 680, zoom: lerp(1.1, 1.2, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.gate, o);
  haman(K, 1100, 1040, 470, { f: -1 }); for (let i = 0; i < 6; i++) person(K.dyn, 300 + i * 110, 1060 + (i % 2) * 20, 420, { f: 1, kneel: bow, lean: .4 * bow, head: .6 * bow, pal: { robe: FOLK[i % 5], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 1360 + i * 7 });
  mord(K, 1500, 1060, 460, { f: -1, head: -.15 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.decree = (t, x, K) => {
  const a = K.C('decree'), b = K.C('message'), rg = K.T.ring;
  const cam = { x: 1560, y: 660, zoom: lerp(1.35, 1.6, ss(seg(t, a, b))) };
  const o = hall(t, x, K, cam);
  king(K, 1750, 860, 440, { armF: [lerp(.3, 1.4, ss(seg(t, rg - .6, rg))), .2] }); haman(K, 1430, 1060, 470, { f: 1, armF: [1.3, .3], lean: .1 });
  K.flush({ ...o, run: .15 });
  K.dyn.push({ x: 1600, y: 1060 - 470 * .5, ang: .1, len: 70, wid: 50, c: hex('#e8dcc0'), type: 0, seed: 1370 }); K.flush(o);
  return { ...GREYW, expo: lerp(.95, .7, seg(t, rg, b)), vig: .55 };
};
S.message = (t, x, K) => {
  const a = K.C('message'), b = K.C('doors');
  const cam = { x: lerp(1300, 1380, seg(t, a, b)), y: 700, zoom: lerp(1.35, 1.5, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.room, o);
  ester(K, 1450, 1060, 460, { f: -1, head: .3, armF: [.9, 1.0] }); person(K.dyn, 1100, 1060, 420, { f: 1, pal: { robe: '#5a5a4a', mantle: '#3a3a2a', skin: '#a07050', hair: '#2a2220' }, armF: [1.2, .3], seed: 1380 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.doors = (t, x, K) => {
  const a = K.C('doors'), b = K.C('fast');
  const cam = { x: 1056, y: lerp(700, 660, seg(t, a, b)), zoom: lerp(1.2, 1.35, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.gate, o);
  K.dyn.push({ x: 1056, y: 780, ang: Math.PI / 2, len: 440, wid: 380, c: hex('#5a3a22'), c2: hex('#3a2414'), type: 0, seed: 1390 }); K.flush({ ...o, alpha: x.a });
  [[800, 1], [1310, -1]].forEach(([px, f], i) => person(K.dyn, px, 1060, 470, { f, spear: 1, helmet: '#7a6a58', pal: { robe: '#4a4a5a', mantle: '#7a6a4a', skin: '#a07050', hair: '#2a2020' }, armF: [.5, .3], seed: 1395 + i * 7 }));
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .85 };
};
S.fast = (t, x, K) => {
  const a = K.C('fast'), b = K.C('throne');
  const cam = { x: lerp(1000, 1060, seg(t, a, b)), y: 760, zoom: lerp(1.4, 1.6, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.room, o);
  ester(K, 1000, 1060, 470, { kneel: 1, head: .45, lean: .2, armF: [1.4, .9], armB: [1.2, .9] }); K.flush({ ...o, alpha: x.a, run: .15 });
  for (let k = 0; k < 3; k++) { K.dyn.push({ x: 700 + k * 90, y: 1040 - 70, ang: -Math.PI / 2 + Math.sin(t * 6 + k) * .1, len: 34, wid: 18, c: hex('#ffd070'), type: 2, seed: 1400 + k, hgt: .4 }); K.dyn.push({ x: 700 + k * 90, y: 1060 - 30, ang: Math.PI / 2, len: 70, wid: 18, c: hex('#e8e0d0'), type: 0, seed: 1410 + k }); }
  K.flush(K.col({ t, cam, alpha: x.a }));
  return { ...GREYW, expo: .75, light: [-.6, -.4, .5] };
};
S.throne = (t, x, K) => {
  const a = K.C('throne'), sc = K.T.scepter;
  const cam = { x: key(t, [[a, 900], [sc - .5, 1350], [sc + 2.5, 1250]]), y: 660, zoom: key(t, [[a, 1.25], [sc, 1.4], [sc + 3, 1.15]]) };
  const o = { t, cam, grey: 1, reveal: sc, revDur: .35 };
  K.plate(K.PL.hall, { ...o, revC: [1700, 800, 700] });
  const walk = seg(t, a + .3, sc - .3), kneel = ss(seg(t, sc - .5, sc + .3));
  ester(K, lerp(500, 1450, walk), 1060, 480, { phase: (t - a) * 4, stride: walk > 0 && walk < 1 ? .6 : 0, kneel: kneel * .7, head: .3 * kneel, armF: [lerp(.3, 1.3, ss(seg(t, sc + .4, sc + 1.2))), .2] });
  const ext = ss(seg(t, sc - .8, sc)); king(K, 1750, 860, 440, { armF: [lerp(.3, 1.45, ext), .05], lean: .1 * ext }); K.flush({ ...o, run: .15 });
  const ang = Math.PI + .25 - ext * .2, hx = 1750 - Math.sin(lerp(.3, 1.45, ext)) * 440 * .3; scepter(K, hx, 860 - 440 * .72, 210, ang, { t, cam });
  const g = eo(seg(t, sc, sc + 2.5)); rays(K.dyn, { x: 1600, y: -250, ang: Math.PI / 2 + .1, n: 9, spread: .35, len: 1500 * (.3 + .7 * g), wid: 120, alpha: .2 * g, seed: 1420 }); K.flush({ t, cam, grey: 0, run: .6 });
  return { ...lerpPost(GREYW, WARM, ss(seg(t, sc, sc + 3))) };
};
S.banquet = (t, x, K) => {
  const a = K.C('banquet'), b = K.C('fall'), point = ss(seg(t, K.L('l10') + 2.6, K.L('l10') + 3.3));
  const cam = { x: lerp(1000, 1060, seg(t, a, b)), y: 700, zoom: lerp(1.25, 1.35, ss(seg(t, a, b))) };
  const o = hall(t, x, K, cam, false);
  K.dyn.push({ x: 1056, y: 990, ang: 0, len: 900, wid: 60, c: hex('#9a6a3a'), c2: hex('#5a3a20'), type: 0, seed: 1430 }); for (let k = 0; k < 6; k++) K.dyn.push({ x: 700 + k * 140, y: 955, ang: 0, len: 50, wid: 40, c: hex(['#c84a3a', '#e8c050', '#7aa04a'][k % 3]), type: 2, seed: 1440 + k }); K.flush(o);
  king(K, 1056, 1060, 470, { f: 1, armF: [.6, .5] }); ester(K, 760, 1060, 440, { f: 1, crown: 1, armF: [lerp(.4, 1.55, point), .05] }); haman(K, 1400, 1060, 460, { f: -1, lean: -.1 * point, head: -.2 * point });
  K.flush({ ...o, run: .15 });
  return { ...WARM, expo: .95 };
};
S.fall = (t, x, K) => {
  const a = K.C('fall'), b = K.C('feast');
  const cam = { x: lerp(1200, 1100, seg(t, a, b)), y: 700, zoom: lerp(1.3, 1.2, seg(t, a, b)) };
  const o = hall(t, x, K, cam, false);
  const fl = ss(seg(t, a + .3, a + 1.3));
  haman(K, 1350, 1060, 460, { f: -1, kneel: fl, lean: .5 * fl, head: .6 * fl }); king(K, 1056, 1060, 480, { f: 1, armF: [lerp(.3, 1.5, fl), .1] });
  [[1600, -1], [1740, -1]].forEach(([px, f], i) => person(K.dyn, px, 1060, 470, { f, spear: 1, helmet: '#7a6a58', pal: { robe: '#4a4a5a', mantle: '#7a6a4a', skin: '#a07050', hair: '#2a2020' }, phase: (t - a) * 4, stride: fl < 1 ? .6 : 0, seed: 1450 + i * 7 }));
  K.flush({ ...o, run: .15 });
  return { ...WARM };
};
S.feast = (t, x, K) => {
  const a = K.C('feast'), b = K.C('close');
  const cam = { x: lerp(1000, 1100, seg(t, a, b)), y: 680, zoom: lerp(1.1, 1.2, ss(seg(t, a, b))) };
  const o = K.col({ t, cam, appear: x.appear }); K.plate(K.PL.gate, o);
  for (let k = 0; k < 10; k++) { const lx = 250 + k * 170; K.dyn.push({ x: lx, y: 300 + Math.sin(t * 2 + k) * 5, ang: 0, len: 40, wid: 54, c: hex(['#ffcc60', '#ff9a50', '#ffe080'][k % 3]), type: 2, seed: 1460 + k, hgt: .6 }); }
  K.flush({ ...o, alpha: x.a, run: .3 });
  for (let i = 0; i < 12; i++) person(K.dyn, 200 + i * 145, 1060 + (i % 2) * 30, 400, { f: i % 2 ? 1 : -1, phase: t * 6 + i, stride: .4, armF: [2.4 + Math.sin(t * 5 + i) * .3, .2], armB: [1.6 + Math.cos(t * 5 + i) * .3, .2], pal: { robe: ['#c84a3a', '#2a6ab0', '#e8b030', '#4a8a5a', '#8a4a8a'][i % 5], mantle: '#e8d8b0', skin: '#a07050', hair: '#2a2220' }, seed: 1470 + i * 7 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM };
};
S.close = (t, x, K) => {
  const a = K.C('close');
  const cam = { x: lerp(1400, 1440, seg(t, a, a + 10)), y: lerp(700, 680, seg(t, a, a + 10)), zoom: lerp(1.3, 1.5, ss(seg(t, a, a + 10))) };
  const o = K.col({ t, cam, appear: x.appear }); K.plate(K.PL.room, o);
  rays(K.dyn, { x: 1450, y: 420, ang: 2.3, n: 7, spread: .3, len: 1100, wid: 120, alpha: .18, seed: 1480 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  ester(K, 1500, 1060, 480, { f: 1, crown: 1, head: -.2 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [.6, -.5, .5] };
};
