// RUTE — plates and shots (horizontal 1920x1080; plates 2112x1188)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'ELA PODIA VOLTAR.<br><b>MAS ESCOLHEU FICAR.</b>';
export const COVER = 'Aonde você for,<br><b>eu irei</b><small>a fidelidade de Rute</small>';
export const COVER_T = 74.0;
export const BOOK = 'Livro de Rute';
export const REFS = [['l02', 'l02', 'Rute 1:1'], ['l03', 'l04', 'Rute 1:3–5'], ['l05', 'l06', 'Rute 1:8–14'], ['l07', 'l07', 'Rute 1:16'], ['l08', 'l09', 'Rute 2:2–12'], ['l10', 'l10', 'Rute 4:13'], ['l11', 'l11', 'Rute 4:17; Mateus 1:5']];
export const QUOTES = ['l07'];
const PW = 2112, PH = 1188, GY = 1020;
const RUTE = { robe: '#7a4a5a', mantle: '#c8a46a', skin: '#c08a68', hair: '#3a2014' };
const NOEMI = { robe: '#4a4a5a', mantle: '#6a5a4a', skin: '#a87a58', hair: '#c8c0b0' };
const ORFA = { robe: '#5a6a5a', mantle: '#8a7a5a', skin: '#b07a58', hair: '#2a1a14' };
const BOAZ = { robe: '#5a5a7a', mantle: '#a8763a', skin: '#a87a58', hair: '#4a3a2a' };

function buildRoad() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 720], [0, 720]]), lin(0, 0, 0, 640, [[0, '#4a6a9a'], [.6, '#c0b4b0'], [1, '#f0d0a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 640); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 610 - Math.sin(x / 260) * 40); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 580, 0, PH, [[0, '#a89470'], [.5, '#8a7450'], [1, '#4a3a24']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  R.fill(c => { c.moveTo(PW + 50, 900); c.bezierCurveTo(1400, 800, 900, 700, 300, 640); c.lineTo(360, 630); c.bezierCurveTo(1000, 720, 1500, 860, PW + 50, 1000); c.closePath(); }, '#d8c49a', { dir: 'edge', group: 'road', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1501 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildHouse() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, PW, 0, [[0, '#4a3a34'], [1, '#7a5e4a']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(P([[1400, 300], [1700, 300], [1700, 640], [1400, 640]]), lin(0, 300, 0, 640, [[0, '#d8c8a8'], [1, '#b89a74']]), { dir: 90, group: 'win', maxR: 10 });
  R.fill(P([[0, GY], [PW, GY], [PW, PH], [0, PH]]), lin(0, GY, 0, PH, [[0, '#6a4e38'], [1, '#2a1c12']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.tint(P([[1400, 640], [1700, 640], [1300, 1188], [700, 1188]]), 'rgba(255,220,170,.2)');
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1502 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildField() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 600], [0, 600]]), lin(0, 0, 0, 600, [[0, '#5a7ab4'], [.6, '#d8c0a8'], [1, '#f8d8a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 600); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 570 - Math.sin(x / 300) * 30); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 540, 0, PH, [[0, '#e8c860'], [.5, '#d4a83a'], [1, '#8a6a24']]), { dir: 90, fallback: 90, group: 'wheat', maxR: 18, detail: 1.3 });
  for (let k = 0; k < 9; k++) R.line(c => { c.moveTo(0, 700 + k * 55); c.lineTo(PW, 690 + k * 58); }, 'rgba(160,110,30,.5)', 10, { dir: 0, group: 'wheat', maxR: 4 });
  R.fill(c => { c.moveTo(1700, 600); c.lineTo(1720, 400); c.lineTo(1750, 600); c.closePath(); }, '#4a3a28', { dir: 90, group: 'tree', maxR: 6 }); R.fill(E(1730, 380, 160, 110), '#5a7a3a', { dir: 'edge', group: 'tree', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1503, rev: (x, y) => Math.hypot(x - 900, (y - 900) * 1.2) / 900 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { road: buildRoad, house: buildHouse, field: buildField };
const woman = (K, x, y, H, pal, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? 1, pal, beard: false, armF: o.armF || [.3, .3], armB: o.armB, kneel: o.kneel, head: o.head, lean: o.lean, phase: o.phase, stride: o.stride, seed: o.seed });

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: lerp(900, 1050, seg(t, 0, K.C('road'))), y: 700, zoom: lerp(1.15, 1.3, ss(seg(t, 0, K.C('road')))) };
  const o = K.grey({ t, cam }); K.plate(K.PL.road, o);
  woman(K, 1150, 920, 360, NOEMI, { f: 1, phase: t * 3, stride: .5, head: .2, seed: 111 }); woman(K, 900, 960, 400, RUTE, { f: 1, head: -.1, seed: 112 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .88 * ss(seg(t, 0, .8)) };
};
S.road = (t, x, K) => {
  const a = K.C('road'), b = K.C('wed'), u = seg(t, a, b);
  const cam = { x: lerp(1500, 1100, u), y: 760, zoom: 1.2 };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.road, o);
  [[0, NOEMI, 360], [80, { robe: '#5a5a4a', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, 420], [-90, { robe: '#6a5a42', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, 330], [-170, { robe: '#5a6070', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, 320]].forEach(([ox, pal, H], i) =>
    person(K.dyn, lerp(1700, 1250, u) + ox, lerp(950, 860, u), H, { f: -1, pal, beard: i === 1, phase: (t - a) * 5 + i, stride: 1, seed: 120 + i * 7 }));
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.wed = (t, x, K) => {
  const a = K.C('wed'), b = K.C('grief');
  const cam = { x: 1056, y: 700, zoom: lerp(1.2, 1.3, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.house, o);
  [[700, ORFA, 1, 0], [860, { robe: '#5a6070', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, -1, 1], [1200, RUTE, 1, 0], [1360, { robe: '#6a5a42', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, -1, 1]].forEach(([px, pal, f, man], i) =>
    person(K.dyn, px, GY + 40, man ? 470 : 420, { f, pal, beard: !!man, armF: [.9, .5], seed: 130 + i * 7 }));
  woman(K, 1030, GY + 40, 380, NOEMI, { f: 1, seed: 111 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.grief = (t, x, K) => {
  const a = K.C('grief'), b = K.C('part');
  const cam = { x: lerp(1000, 1060, seg(t, a, b)), y: 760, zoom: lerp(1.35, 1.5, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.house, o);
  woman(K, 1060, GY + 40, 400, NOEMI, { f: 1, kneel: 1, lean: .4, head: .6, armF: [1.0, 1.2], seed: 111 }); woman(K, 820, GY + 40, 420, ORFA, { f: 1, head: .4, seed: 113 }); woman(K, 1300, GY + 40, 430, RUTE, { f: -1, head: .4, armF: [.8, .6], seed: 112 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .82 };
};
S.part = (t, x, K) => {
  const a = K.C('part'), b = K.C('vow'), kiss = K.T.kiss, cling = K.T.cling;
  const cam = { x: lerp(1000, 1100, seg(t, a, b)), y: 760, zoom: lerp(1.25, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.road, o);
  const leave = seg(t, kiss + .8, kiss + 4), hold = ss(seg(t, cling - .4, cling + .4));
  woman(K, 1150, 960, 380, NOEMI, { f: -1, armF: [.6 + hold * .7, .4], seed: 111 });
  woman(K, lerp(1000, 300, leave), lerp(960, 880, leave), lerp(420, 330, leave), ORFA, { f: leave > 0 ? -1 : 1, phase: (t - kiss) * 5, stride: leave > 0 && leave < 1 ? 1 : 0, armF: [t < kiss + .8 ? 1.3 : .3, .3], seed: 113 });
  woman(K, lerp(1320, 1220, hold), 970, 430, RUTE, { f: -1, armF: [lerp(.3, 1.4, hold), .3], armB: [lerp(.2, 1.2, hold), .3], lean: .15 * hold, seed: 112 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.vow = (t, x, K) => {
  const a = K.C('vow'), b = K.C('field');
  const cam = { x: 1200, y: lerp(720, 700, seg(t, a, b)), zoom: lerp(1.55, 1.75, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam }); K.plate(K.PL.road, o);
  rays(K.dyn, { x: 1250, y: -200, ang: Math.PI / 2, n: 7, spread: .3, len: 1300, wid: 110, alpha: .16 * ss(seg(t, a, a + 1.5)), seed: 1550 }); K.flush(K.col({ t, cam, run: .6 }));
  woman(K, 1120, 960, 380, NOEMI, { f: 1, head: .1, seed: 111 }); woman(K, 1330, 970, 430, RUTE, { f: -1, armF: [1.2, .2], armB: [1.0, .3], head: -.1, seed: 112 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .95 };
};
const field = (t, x, K, mode) => {
  const a = K.C(mode), gd = K.T.gold;
  const cam = mode === 'field' ? { x: key(t, [[a, 800], [gd + 3, 950]]), y: 760, zoom: key(t, [[a, 1.4], [gd + 3, 1.15]]) } : mode === 'boaz' ? { x: lerp(1000, 1100, seg(t, a, K.C('wedding'))), y: 760, zoom: lerp(1.3, 1.4, ss(seg(t, a, K.C('wedding')))) } : { x: lerp(1000, 1060, seg(t, a, a + 10)), y: lerp(700, 650, seg(t, a, a + 10)), zoom: lerp(1.05, 1.2, ss(seg(t, a, a + 10))) };
  const o = mode === 'field' ? { t, cam, grey: 1, reveal: gd, revDur: .35, appear: x.appear } : K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.field, mode === 'field' ? { ...o, revC: [900, 950, 650] } : o);
  // reapers in the distance, Ruth gleaning behind them
  for (let i = 0; i < 5; i++) person(K.dyn, 1300 + i * 140, 760 + (i % 2) * 20, 220, { f: -1, lean: .4, kneel: .3, armF: [1.5 + Math.sin(t * 3 + i) * .4, .3], pal: { robe: ['#6a5a42', '#5a6070', '#7a5a4a'][i % 3], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2020' }, seed: 1560 + i * 7 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  const glean = Math.abs(Math.sin(t * 1.4));
  woman(K, 900, 1040, 460, RUTE, { f: 1, kneel: mode === 'close' ? 0 : glean * .7, lean: mode === 'close' ? 0 : .35 * glean, head: mode === 'close' ? -.2 : .4 * glean, armF: [mode === 'close' ? .4 : lerp(.8, 1.4, glean), .4], seed: 112 });
  if (mode === 'boaz') { const turn = ss(seg(t, a + 1.5, a + 2.5)); person(K.dyn, 1300, 1040, 500, { f: -1, pal: BOAZ, armF: [lerp(.3, 1.2, turn), .3], seed: 141 }); }
  K.flush({ ...o, alpha: x.a, run: .15 });
  const post = mode === 'field' ? lerpPost(GREYW, WARM, ss(seg(t, gd, gd + 3))) : WARM;
  return { ...post, light: [-.7, -.5, .5] };
};
S.field = (t, x, K) => field(t, x, K, 'field');
S.boaz = (t, x, K) => field(t, x, K, 'boaz');
S.close = (t, x, K) => field(t, x, K, 'close');
S.wedding = (t, x, K) => {
  const a = K.C('wedding'), b = K.C('child');
  const cam = { x: 1056, y: 720, zoom: lerp(1.2, 1.3, ss(seg(t, a, b))) };
  const o = K.col({ t, cam, appear: x.appear }); K.plate(K.PL.house, o);
  for (let k = 0; k < 8; k++) K.dyn.push({ x: 500 + k * 160, y: 260 + Math.sin(t * 2 + k) * 4, ang: 0, len: 34, wid: 44, c: hex(['#ffcc60', '#ff9a50', '#ffe080'][k % 3]), type: 2, seed: 1570 + k, hgt: .6 });
  K.flush({ ...o, alpha: x.a, run: .3 });
  person(K.dyn, 1180, GY + 40, 500, { f: -1, pal: BOAZ, armF: [1.0, .6], seed: 141 }); woman(K, 960, GY + 40, 440, RUTE, { f: 1, armF: [1.0, .6], seed: 112 });
  woman(K, 700, GY + 40, 380, NOEMI, { f: 1, armF: [2.2, .3], seed: 111 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM };
};
S.child = (t, x, K) => {
  const a = K.C('child'), b = K.C('close');
  const cam = { x: 1056, y: lerp(760, 700, seg(t, a, b)), zoom: lerp(1.45, 1.3, ss(seg(t, a, b))) };
  const o = K.col({ t, cam, appear: x.appear }); K.plate(K.PL.house, o);
  rays(K.dyn, { x: 1550, y: 470, ang: 2.4, n: 7, spread: .3, len: 1100, wid: 110, alpha: .18, seed: 1580 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  woman(K, 1000, GY + 40, 400, NOEMI, { f: 1, armF: [1.2, 1.2], armB: [1.0, 1.2], head: .3, seed: 111 });
  K.dyn.push({ x: 1000 + 400 * .2, y: GY + 40 - 400 * .55, ang: 0, len: 70, wid: 42, c: hex('#e8dcc0'), type: 2, seed: 1590 }); K.dyn.push({ x: 1000 + 400 * .25, y: GY + 40 - 400 * .58, ang: 0, len: 22, wid: 22, c: hex('#d0a080'), type: 2, seed: 1591 });
  woman(K, 1250, GY + 40, 440, RUTE, { f: -1, head: .1, seed: 112 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM };
};
