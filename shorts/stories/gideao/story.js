// GIDEÃO E OS 300 — plates and shots (horizontal 1920x1080; plates 2112x1188)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = '32 MIL SOLDADOS.<br><b>DEUS DISSE: É DEMAIS.</b>';
export const COVER = 'Só <b>300</b><small>contra um exército inteiro</small>';
export const COVER_T = 66.0;
export const BOOK = 'Juízes 6 – 7';
export const REFS = [['l02', 'l02', 'Juízes 6:1–6'], ['l03', 'l03', 'Juízes 6:11–12'], ['l04', 'l04', 'Juízes 6:15'], ['l05', 'l06', 'Juízes 7:2–3'], ['l07', 'l07', 'Juízes 7:5–7'], ['l08', 'l09', 'Juízes 7:16–20'], ['l10', 'l10', 'Juízes 7:21']];
export const QUOTES = [];
const PW = 2112, PH = 1188, GY = 1000;
const GID = { robe: '#6a6a4a', mantle: '#8a5a3a', skin: '#a87a58', hair: '#3a2a1e' };
const SOLD = ['#6a5a42', '#5a6070', '#7a5a4a', '#8a7a5a', '#5a5a4a'];
const MID = ['#3a2a3a', '#4a3a2a', '#2a2a3a'];

function buildPlain() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 720], [0, 720]]), lin(0, 0, 0, 640, [[0, '#4a6a9a'], [.6, '#b8b4b0'], [1, '#f0d4a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 640); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 610 - Math.sin(x / 300) * 50); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 560, 0, PH, [[0, '#a8a070'], [.5, '#8a8048'], [1, '#4a4426']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  R.fill(c => { c.moveTo(1500, PH); c.bezierCurveTo(1600, 900, 1900, 820, PW + 50, 780); c.lineTo(PW + 50, 880); c.bezierCurveTo(1950, 920, 1720, 1000, 1660, PH); c.closePath(); }, lin(0, 780, 0, PH, [[0, '#8ab0c0'], [1, '#4a7a8a']]), { dir: 'edge', group: 'stream', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1601 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildPress() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 500], [0, 500]]), lin(0, 0, 0, 500, [[0, '#7a8aa8'], [1, '#e0c8a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 40 });
  R.fill(P([[0, 450], [PW, 450], [PW, PH], [0, PH]]), lin(0, 450, 0, PH, [[0, '#8a7a5a'], [1, '#4a3a28']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  R.fill(E(1056, 900, 700, 220), lin(0, 680, 0, 1120, [[0, '#6a5a48'], [1, '#2a2018']]), { group: 'pit', maxR: 16 });
  R.line(c => c.ellipse(1056, 900, 700, 220, 0, Math.PI, 2 * Math.PI), '#a8987c', 40, { dir: 'edge', group: 'rim', maxR: 8 });
  R.fill(c => { c.moveTo(1700, 460); c.lineTo(1730, 250); c.lineTo(1760, 460); c.closePath(); }, '#4a3a28', { group: 'tree', maxR: 6 }); R.fill(E(1730, 220, 180, 120), '#6a8a4a', { dir: 'edge', group: 'tree', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1602 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildNight() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 620], [0, 620]]), lin(0, 0, 0, 620, [[0, '#0a0e1a'], [1, '#2a2a40']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(P([[0, 600], [PW, 600], [PW, PH], [0, PH]]), lin(0, 600, 0, PH, [[0, '#2a2a34'], [1, '#0e0e14']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  for (let k = 0; k < 14; k++) { const x = 300 + k * 110 + (hash(k) - .5) * 40, y = 680 + (k % 3) * 30, s = .8 + hash(k * 3) * .4; R.fill(P([[x - 60 * s, y], [x, y - 70 * s], [x + 60 * s, y]]), lin(x - 60, 0, x + 60, 0, [[0, '#8a7a6a'], [1, '#4a3a30']]), { dir: 60, group: 'tent' + k, maxR: 6 }); }
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1603, rev: (x, y) => Math.abs(y - 1000) / 600 + Math.abs(x - 1056) / 1400 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { plain: buildPlain, press: buildPress, night: buildNight };

function troops(K, t, o, { n, x0, x1, y0, y1, H, side = 1, seed = 1700, walk = 0, drink = 0, pal = SOLD, arms = 0 } = {}) {
  for (let i = 0; i < n; i++) { const u = hash(i * 1.7 + seed), v = hash(i * 3.9 + seed), y = lerp(y0, y1, v), sc = lerp(.6, 1, v);
    person(K.dyn, lerp(x0, x1, u) + walk * (t * 40 % 600) * side, y, H * sc, { f: side, pal: { robe: pal[i % pal.length], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, spear: i % 4 === 0 ? 1 : 0, phase: t * 5 + i, stride: walk, kneel: drink, lean: drink * .5, head: drink * .5, armF: [lerp(.4, 2.5 + Math.sin(t * 6 + i) * .2, arms), .3], seed: seed + i * 7 }); }
  K.flush({ ...o, run: .15 });
}
function fire(K, x, y, s, t) { for (let i = 0; i < 8; i++) K.dyn.push({ x: x + (hash(i) - .5) * 30 * s, y: y - (i % 4) * 22 * s, ang: -Math.PI / 2 + Math.sin(t * 7 + i) * .3, len: 50 * s, wid: 30 * s, c: mixc(hex('#ffd060'), hex('#e8481a'), hash(i * 3)), c2: hex('#fff0b0'), type: 1, seed: 1750 + i + x, alpha: .9, hgt: .4 }); }

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: lerp(900, 1100, seg(t, 0, K.C('raid'))), y: 720, zoom: lerp(1.1, 1.2, ss(seg(t, 0, K.C('raid')))) };
  const o = K.grey({ t, cam }); K.plate(K.PL.plain, o);
  troops(K, t, o, { n: 60, x0: 100, x1: 2000, y0: 680, y1: 1080, H: 260, seed: 1800 });
  return { ...GREYW, expo: .88 * ss(seg(t, 0, .8)) };
};
S.raid = (t, x, K) => {
  const a = K.C('raid'), b = K.C('press');
  const cam = { x: lerp(1000, 1100, seg(t, a, b)), y: 720, zoom: 1.2 };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.plain, o);
  for (let k = 0; k < 6; k++) fire(K, 500 + k * 230, 760 + (k % 2) * 40, 2.2, t);
  K.flush(K.col({ t, cam, alpha: x.a, run: .4 }));
  troops(K, t, { ...o, alpha: x.a }, { n: 12, x0: -300, x1: 900, y0: 820, y1: 1060, H: 330, walk: 1, seed: 1900, pal: MID });
  return { ...GREYW, expo: .85 };
};
S.press = (t, x, K) => {
  const a = K.C('press'), b = K.C('doubt'), an = K.T.angel;
  const cam = { x: lerp(1000, 1150, seg(t, a, b)), y: 760, zoom: lerp(1.3, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.press, o);
  const beat = Math.abs(Math.sin((t - a) * Math.PI / .8)), look = ss(seg(t, an, an + .8));
  person(K.dyn, 950, 980, 400, { f: 1, pal: GID, lean: .3 * (1 - look), armF: [lerp(lerp(.8, 2.2, beat), .6, look), .3], head: lerp(.3, -.2, look), kneel: .2, seed: 151 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const g = ss(seg(t, an - .4, an + .6));
  if (g > 0) { rays(K.dyn, { x: 1450, y: -200, ang: Math.PI / 2, n: 9, spread: .3, len: 1300, wid: 120, alpha: .22 * g, seed: 1950 }); K.flush(K.col({ t, cam, run: .6 })); person(K.dyn, 1450, 900, 470, { f: -1, pal: { robe: '#f0ece0', mantle: '#e8d8a8', skin: '#c89a78', hair: '#c8a060' }, beard: false, armF: [1.3, .2], seed: 152, alpha: g }); K.flush(K.col({ t, cam, run: .15 })); }
  return { ...GREYW };
};
S.doubt = (t, x, K) => {
  const a = K.C('doubt'), b = K.C('army');
  const cam = { x: 1000, y: lerp(760, 720, seg(t, a, b)), zoom: lerp(1.6, 1.8, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.press, o);
  person(K.dyn, 950, 980, 400, { f: 1, pal: GID, armF: [1.3, 1.2], armB: [1.1, 1.2], head: .2, lean: -.05, seed: 151 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.army = (t, x, K) => {
  const a = K.C('army'), b = K.C('leave');
  const cam = { x: 1056, y: lerp(700, 680, seg(t, a, b)), zoom: lerp(1.0, 1.05, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.plain, o);
  troops(K, t, { ...o, alpha: x.a }, { n: 90, x0: 60, x1: 2050, y0: 660, y1: 1100, H: 240, seed: 2000 });
  person(K.dyn, 1056, 1120, 330, { f: 1, pal: GID, armF: [.8, .3], seed: 151 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.leave = (t, x, K) => {
  const a = K.C('leave'), b = K.C('water'), u = seg(t, a, b);
  const cam = { x: 1056, y: 700, zoom: 1.04 };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.plain, o);
  troops(K, t, { ...o, alpha: x.a }, { n: 26, x0: 300, x1: 1600, y0: 700, y1: 1100, H: 240, seed: 2000 });
  troops(K, t, { ...o, alpha: x.a * (1 - u * .8) }, { n: 60, x0: 100, x1: 1900, y0: 660, y1: 1100, H: 240, seed: 2100, walk: 1, side: -1 });
  return { ...GREYW };
};
S.water = (t, x, K) => {
  const a = K.C('water'), b = K.C('night'), split = ss(seg(t, K.L('l07') + 3.0, K.L('l07') + 4.2));
  const cam = { x: lerp(1600, 1500, seg(t, a, b)), y: 860, zoom: lerp(1.45, 1.3, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.plain, o);
  troops(K, t, { ...o, alpha: x.a }, { n: 14, x0: 1300, x1: 1750, y0: 880, y1: 1080, H: 300, seed: 2200, drink: 1 });
  troops(K, t, { ...o, alpha: x.a }, { n: 5, x0: 1250, x1: 1700, y0: 800, y1: 860, H: 300, seed: 2300, drink: .3 });
  if (split > 0) { rays(K.dyn, { x: 1500, y: -200, ang: Math.PI / 2, n: 7, spread: .25, len: 1200, wid: 110, alpha: .18 * split, seed: 2350 }); K.flush(K.col({ t, cam, run: .6 })); }
  return { ...GREYW };
};
const night = (t, x, K, mode) => {
  const a = K.C(mode), sm = K.T.smash, sh = K.T.shout;
  const cam = mode === 'night' ? { x: 1056, y: lerp(780, 800, seg(t, a, sm)), zoom: lerp(1.0, 1.1, ss(seg(t, a, K.C('torch')))) }
    : mode === 'torch' ? { x: 1056, y: key(t, [[a, 840], [sm + 2, 760]]), zoom: key(t, [[a, 1.25], [sm, 1.35], [sm + 2.5, 1.05]]) }
    : { x: lerp(1000, 1150, seg(t, a, K.C('close'))), y: 760, zoom: 1.12 };
  const o = mode === 'torch' ? { t, cam, grey: 1, reveal: sm, revDur: .3 } : mode === 'flee' ? K.col({ t, cam, appear: x.appear }) : K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.night, mode === 'torch' ? { ...o, revC: [1056, 1100, 900] } : o);
  const lit = mode === 'night' ? 0 : ss(seg(t, sm, sm + .3));
  // the 300 in a ring around the camp, jars in hand; then torches high
  for (let i = 0; i < 26; i++) { const u = i / 25, px = lerp(-40, 2150, u), py = 1040 + Math.sin(u * Math.PI) * -60 + (i % 2) * 40, f = px < 1056 ? 1 : -1;
    person(K.dyn, px, py, 330, { f, pal: { robe: SOLD[i % 5], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, armF: [lerp(.8, 2.8, lit), .3], armB: [lerp(.6, 1.6, lit), .3], seed: 2400 + i * 7 });
    if (lit > 0) { const hx = px + f * 330 * .1, hy = py - 330 * (.8 + .3 * lit); fire(K, hx, hy, 1.2, t + i); } else K.dyn.push({ x: px + f * 40, y: py - 330 * .5, ang: 0, len: 46, wid: 52, c: hex('#9a6a4a'), type: 2, seed: 2500 + i }); }
  K.flush({ ...o, run: .15 });
  if (lit > 0) { K.dyn.push({ x: 1056, y: 900, ang: 0, len: 2400, wid: 600, c: hex('#ffb050'), type: 2, seed: 2550, alpha: .12 * lit, hgt: 0 }); K.flush({ t, cam, grey: 0 }); }
  if (t > sm && t < sm + .6) { for (let k = 0; k < 30; k++) { const r = (t - sm) / .6; K.dyn.push({ x: lerp(-40, 2150, hash(k)) + (hash(k * 3) - .5) * 200 * r, y: 900 + r * 150 * hash(k * 5), ang: hash(k) * 6, len: 22, wid: 14, c: hex('#9a6a4a'), type: 0, seed: 2600 + k, alpha: 1 - r }); } K.flush({ t, cam, grey: 0 }); }
  if (mode === 'flee') { troops(K, t, o, { n: 16, x0: 400, x1: 1600, y0: 720, y1: 860, H: 220, seed: 2700, walk: 1.4, pal: MID, side: hash(1) > .5 ? 1 : -1, arms: 1 }); }
  const post = mode === 'torch' ? lerpPost(GREYW, WARM, ss(seg(t, sm, sm + 2))) : mode === 'flee' ? WARM : GREYW;
  return { ...post, expo: post.expo * (mode === 'night' ? .7 : lerp(.7, 1, lit)) * (t > sh && t < sh + .15 ? 1.15 : 1) };
};
S.night = (t, x, K) => night(t, x, K, 'night');
S.torch = (t, x, K) => night(t, x, K, 'torch');
S.flee = (t, x, K) => night(t, x, K, 'flee');
S.close = (t, x, K) => {
  const a = K.C('close');
  const cam = { x: lerp(1000, 1060, seg(t, a, a + 10)), y: lerp(720, 680, seg(t, a, a + 10)), zoom: lerp(1.2, 1.35, ss(seg(t, a, a + 10))) };
  const o = K.col({ t, cam, appear: x.appear }); K.plate(K.PL.plain, o);
  rays(K.dyn, { x: 1056, y: -250, ang: Math.PI / 2, n: 11, spread: .4, len: 1500, wid: 130, alpha: .22, seed: 2800 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  troops(K, t, { ...o, alpha: x.a }, { n: 14, x0: 600, x1: 1500, y0: 860, y1: 960, H: 240, seed: 2900 });
  person(K.dyn, 1056, 1060, 420, { f: 1, pal: GID, armF: [2.5, .2], armB: [2.2, .3], head: -.3, seed: 151 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM };
};
