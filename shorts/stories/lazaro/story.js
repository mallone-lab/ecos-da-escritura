// A RESSURREIÇÃO DE LÁZARO — plates and shots (horizontal 1920x1080; plates 2112x1188)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'MORTO HAVIA 4 DIAS.<br><b>E JESUS CHEGOU ATRASADO.</b>';
export const COVER = '<b>Lázaro,</b><br>vem para fora!<small>4 dias depois</small>';
export const COVER_T = 72.5;
export const BOOK = 'João 11';
export const REFS = [['l02', 'l02', 'João 11:1–3'], ['l03', 'l03', 'João 11:6'], ['l04', 'l04', 'João 11:17'], ['l05', 'l05', 'João 11:21'], ['l06', 'l06', 'João 11:25'], ['l07', 'l07', 'João 11:32–35'], ['l08', 'l08', 'João 11:39'], ['l09', 'l10', 'João 11:41–44'], ['l11', 'l11', 'João 11:45']];
export const QUOTES = ['l06'];
const PW = 2112, PH = 1188, GY = 1020, TOMB = [1500, 800];
const JESUS = { robe: '#efe8d8', mantle: '#a83a3a', skin: '#b07a58', hair: '#3a2a20' };
const MARTA = { robe: '#6a4a3a', mantle: '#c8a46a', skin: '#c08a68', hair: '#2a1a14' };
const MARIA = { robe: '#3a4a6a', mantle: '#d8c8a8', skin: '#c08a68', hair: '#2a1a14' };
const LAZ = { robe: '#e8e4d8', mantle: '#d8d2c4', skin: '#b08a70', hair: '#3a2a20' };
const FOLK = ['#6e5a42', '#5a6070', '#7a5a4a', '#8a7a5a', '#4a4a4a'];

function buildTomb() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 720], [0, 720]]), lin(0, 0, 0, 640, [[0, '#5a7aaa'], [.6, '#c8c0b8'], [1, '#f0d8b0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(900, PH); c.bezierCurveTo(1000, 500, 1400, 300, PW + 50, 280); c.lineTo(PW + 50, PH); c.closePath(); }, lin(900, 300, PW, PH, [[0, '#b8a888'], [1, '#6a5a44']]), { dir: 70, fallback: 70, group: 'rock', maxR: 26 });
  R.fill(c => { c.moveTo(0, 680); for (let x = 0; x <= 1000; x += 40) c.lineTo(x, 660 - Math.sin(x / 200) * 30); c.lineTo(1000, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 620, 0, PH, [[0, '#a89a6a'], [1, '#5a4a32']]), { dir: 0, fallback: 0, group: 'ground', maxR: 28 });
  R.fill(P([[0, GY - 40], [PW, GY - 40], [PW, PH], [0, PH]]), lin(0, GY - 40, 0, PH, [[0, '#b0946a'], [1, '#6a5038']]), { dir: 0, fallback: 0, group: 'path', maxR: 24 });
  R.fill(c => { c.moveTo(TOMB[0] - 150, GY - 40); c.lineTo(TOMB[0] - 150, TOMB[1] - 60); c.ellipse(TOMB[0], TOMB[1] - 60, 150, 140, 0, Math.PI, 2 * Math.PI); c.lineTo(TOMB[0] + 150, GY - 40); c.closePath(); }, '#120c0a', { dir: 90, group: 'cave', maxR: 8 });
  [[300, 760], [520, 720]].forEach(([x, y], i) => { R.fill(P([[x - 12, GY - 40], [x - 8, y], [x + 8, y], [x + 12, GY - 40]]), '#4a3a28', { group: 'olive' + i, maxR: 4 }); R.fill(E(x, y - 40, 120, 80), '#6a7a5a', { dir: 'edge', group: 'olive' + i, maxR: 10 }); });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1701, rev: (x, y) => Math.hypot(x - TOMB[0], (y - TOMB[1]) * 1.2) / 900 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildHouse() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, PW, 0, [[0, '#3a3030'], [1, '#6a5444']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(P([[1450, 300], [1700, 300], [1700, 600], [1450, 600]]), lin(0, 300, 0, 600, [[0, '#c8c0b0'], [1, '#a0907a']]), { dir: 90, group: 'win', maxR: 10 });
  R.fill(P([[0, GY], [PW, GY], [PW, PH], [0, PH]]), lin(0, GY, 0, PH, [[0, '#5a4434'], [1, '#2a1c14']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.fill(P([[600, GY - 120], [1300, GY - 120], [1320, GY - 60], [580, GY - 60]]), lin(0, GY - 120, 0, GY - 60, [[0, '#a89a7a'], [1, '#5a4a3a']]), { dir: 0, group: 'bed', maxR: 8 });
  R.tint(P([[1450, 600], [1700, 600], [1300, 1188], [700, 1188]]), 'rgba(230,220,200,.16)');
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1702 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { tomb: buildTomb, house: buildHouse };

const jesus = (K, x, y, H, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? 1, pal: JESUS, armF: o.armF || [.3, .3], armB: o.armB, head: o.head, lean: o.lean, phase: o.phase, stride: o.stride, seed: 161 });
const woman = (K, x, y, H, pal, o = {}) => person(K.dyn, x, y, H, { f: o.f ?? -1, pal, beard: false, armF: o.armF || [.3, .3], armB: o.armB, kneel: o.kneel, head: o.head, lean: o.lean, phase: o.phase, stride: o.stride, seed: o.seed });
function stone(K, x, y, r, roll = 0) { const sx = x + roll * 310, a = roll * 2.4; for (let k = 0; k < 10; k++) { const an = a + k / 10 * Math.PI * 2; K.dyn.push({ x: sx + Math.cos(an) * r * .55, y: y + Math.sin(an) * r * .55, ang: an + Math.PI / 2, len: r * .7, wid: r * .45, c: shade(hex('#a89a84'), .8 + hash(k) * .3), type: 0, seed: 1800 + k }); } K.dyn.push({ x: sx, y, ang: a, len: r * .9, wid: r * .9, c: hex('#9a8e7a'), type: 2, seed: 1811 }); }
function mourners(K, t, o, n = 8, x0 = 200, x1 = 1000, seed = 1850, arms = 0) { for (let i = 0; i < n; i++) person(K.dyn, lerp(x0, x1, i / (n - 1)) + (hash(i + seed) - .5) * 30, GY + 30 + (i % 2) * 30, 380, { f: 1, beard: hash(i * 3) > .5, head: lerp(.4, -.2, arms), armF: [lerp(1.2, 2.4, arms * (i % 2)), lerp(1.0, .2, arms)], pal: { robe: FOLK[i % 5], mantle: '#3a3a3a', skin: '#a07050', hair: '#2a2220' }, seed: seed + i * 7 }); K.flush({ ...o, run: .15 }); }

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: lerp(1300, 1400, seg(t, 0, K.C('sick'))), y: 700, zoom: lerp(1.1, 1.25, ss(seg(t, 0, K.C('sick')))) };
  const o = K.grey({ t, cam }); K.plate(K.PL.tomb, o);
  stone(K, TOMB[0], GY - 170, 260); K.flush({ ...o, run: .1 });
  jesus(K, 700, GY + 20, 300, { f: 1, phase: t * 4, stride: .7 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .88 * ss(seg(t, 0, .8)) };
};
S.sick = (t, x, K) => {
  const a = K.C('sick'), b = K.C('wait');
  const cam = { x: lerp(950, 1050, seg(t, a, b)), y: 720, zoom: lerp(1.25, 1.35, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.house, o);
  person(K.dyn, 1280, GY - 120, 400, { f: 1, lie: -1.5, pal: LAZ, head: -.1, seed: 162 });
  woman(K, 600, GY + 20, 420, MARTA, { f: 1, armF: [1.2, .6], seed: 163 }); woman(K, 1450, GY + 20, 400, MARIA, { f: -1, kneel: .8, head: .4, seed: 164 });
  person(K.dyn, 380, GY + 20, 400, { f: -1, pal: { robe: '#5a5a4a', mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, phase: (t - a) * 5, stride: seg(t, a + 3, b) > 0 ? 1 : 0, seed: 165 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .85 };
};
S.wait = (t, x, K) => {
  const a = K.C('wait'), b = K.C('tomb'), u = seg(t, a, b);
  const cam = { x: 600, y: 720, zoom: 1.3 };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.tomb, o);
  jesus(K, 620, GY + 30, 420, { f: 1, head: .1 }); for (let i = 0; i < 4; i++) person(K.dyn, 300 + i * 120 + (i > 1 ? 380 : 0), GY + 40, 380, { f: i > 1 ? -1 : 1, kneel: i % 2, pal: { robe: FOLK[i], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 166 + i * 7 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, light: [lerp(-.8, .8, u), -.5, .5], expo: lerp(1, .85, u) };
};
S.tomb = (t, x, K) => {
  const a = K.C('tomb'), b = K.C('martha');
  const cam = { x: lerp(1300, 1200, seg(t, a, b)), y: 720, zoom: lerp(1.15, 1.2, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.tomb, o);
  stone(K, TOMB[0], GY - 170, 260); K.flush({ ...o, alpha: x.a, run: .1 });
  mourners(K, t, { ...o, alpha: x.a }, 7, 500, 1180);
  return { ...GREYW, expo: .9 };
};
S.martha = (t, x, K) => {
  const a = K.C('martha'), b = K.C('life'), run = seg(t, a, a + 2.2);
  const cam = { x: lerp(700, 800, seg(t, a, b)), y: 720, zoom: lerp(1.3, 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.tomb, o);
  jesus(K, 620, GY + 30, 440, { f: 1 }); woman(K, lerp(1300, 880, run), GY + 30, 420, MARTA, { f: -1, phase: (t - a) * 8, stride: run < 1 ? 1 : 0, armF: [run < 1 ? .4 : 1.4, .3], lean: run < 1 ? .2 : 0, seed: 163 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.life = (t, x, K) => {
  const a = K.C('life'), b = K.C('wept'), g = ss(seg(t, a + .5, a + 2.5));
  const cam = { x: 750, y: lerp(700, 680, seg(t, a, b)), zoom: lerp(1.4, 1.6, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam }); K.plate(K.PL.tomb, o);
  rays(K.dyn, { x: 640, y: -250, ang: Math.PI / 2, n: 7, spread: .25, len: 1400, wid: 110, alpha: .2 * g, seed: 1860 }); K.flush(K.col({ t, cam, run: .6 }));
  jesus(K, 620, GY + 30, 440, { f: 1, armF: [1.1, .2] }); K.flush(K.col({ t, cam, run: .15 }));
  woman(K, 880, GY + 30, 420, MARTA, { f: -1, head: -.1, seed: 163 }); K.flush({ ...o, run: .15 });
  return { ...GREYW };
};
S.wept = (t, x, K) => {
  const a = K.C('wept'), b = K.C('stone');
  const cam = { x: lerp(700, 760, seg(t, a, b)), y: 740, zoom: lerp(1.35, 1.5, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear }); K.plate(K.PL.tomb, o);
  const weep = ss(seg(t, K.L('l07') + 2.3, K.L('l07') + 3.2));
  jesus(K, 620, GY + 30, 440, { f: 1, head: .45 * weep, armF: [lerp(.6, 1.1, weep), lerp(.3, 1.4, weep)] }); K.flush(K.col({ t, cam, run: .15 }));
  if (weep > .5) { K.dyn.push({ x: 620 + 440 * .1, y: GY + 30 - 440 * .83 + (t * 60 % 30), ang: Math.PI / 2, len: 12, wid: 6, c: hex('#d8e8f0'), type: 2, seed: 1870 }); K.flush(K.col({ t, cam })); }
  woman(K, 830, GY + 30, 420, MARIA, { f: -1, kneel: 1, lean: .5, head: .6, armF: [1.3, .4], seed: 164 }); mourners(K, t, o, 5, 1050, 1500, 1900);
  return { ...GREYW };
};
const tombShot = (t, x, K, mode) => {
  const a = K.C(mode), rl = K.T.roll, sh = K.T.shout, em = K.T.emerge;
  const cam = mode === 'stone' ? { x: lerp(1150, 1250, seg(t, a, K.C('call'))), y: 700, zoom: 1.15 }
    : mode === 'call' ? { x: lerp(1000, 1150, ss(seg(t, a, sh))), y: lerp(720, 700, seg(t, a, sh)), zoom: lerp(1.15, 1.3, ss(seg(t, a, sh))) }
    : mode === 'out' ? { x: key(t, [[a, 1300], [em + 3, 1350]]), y: 700, zoom: key(t, [[a, 1.4], [em + 4, 1.2]]) }
    : mode === 'believe' ? { x: 1100, y: 700, zoom: lerp(1.05, 1.12, seg(t, a, K.C('close'))) }
    : { x: lerp(1100, 1200, seg(t, a, a + 12)), y: lerp(700, 660, seg(t, a, a + 12)), zoom: lerp(1.1, 1.25, ss(seg(t, a, a + 12))) };
  const turn = mode === 'out';
  const o = turn ? { t, cam, grey: 1, reveal: em, revDur: .35 } : (mode === 'believe' || mode === 'close') ? K.col({ t, cam, appear: x.appear }) : K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.tomb, turn ? { ...o, revC: [TOMB[0], TOMB[1], 800] } : o);
  const roll = mode === 'stone' ? ss(seg(t, rl, rl + 1.4)) : 1;
  stone(K, TOMB[0], GY - 170, 260, roll); K.flush({ ...o, run: .1 });
  if (mode === 'stone') { [[TOMB[0] - 330, 1], [TOMB[0] - 200, 1]].forEach(([px, f], i) => person(K.dyn, px + roll * 420, GY + 20, 400, { f: -f, lean: .35, armF: [1.4, .1], armB: [1.3, .1], pal: { robe: FOLK[i], mantle: '#3a3a3a', skin: '#a07050', hair: '#2a2220' }, seed: 1880 + i * 7 })); woman(K, 780, GY + 30, 420, MARTA, { f: 1, armF: [1.3, .2], seed: 163 }); }
  const raise = mode === 'call' ? ss(seg(t, sh - .7, sh)) : mode === 'out' ? 1 - ss(seg(t, em + 2, em + 3)) : 0;
  jesus(K, 960, GY + 30, 470, { f: 1, armF: [lerp(.3, 2.0, raise), .1], lean: -.05 * raise }); K.flush(mode === 'stone' || mode === 'call' ? { ...o, grey: 0, run: .15 } : { ...o, run: .15 });
  if (mode === 'out' || mode === 'believe' || mode === 'close') {
    const come = mode === 'out' ? seg(t, em, em + 3.5) : 1, H = 420;
    person(K.dyn, lerp(TOMB[0], TOMB[0] - 160, come), lerp(GY - 60, GY + 30, come), lerp(330, H, come), { f: -1, pal: LAZ, band: '#d8d2c4', bare: 1, hairCol: '#e8e4d8', armF: [.05, 0], armB: [.05, 0], phase: (t - em) * 3, stride: mode === 'out' && come < 1 ? .25 : 0, seed: 162, alpha: mode === 'out' ? ss(seg(t, em - .2, em + .4)) : 1 });
    for (let k = 0; k < 6; k++) { const px = lerp(TOMB[0], TOMB[0] - 160, come), py = lerp(GY - 60, GY + 30, come) - (k + 1) * H * .12; K.dyn.push({ x: px, y: py, ang: .2 * (k % 2 ? 1 : -1), len: H * .2, wid: 6, c: hex('#b8b0a0'), type: 3, seed: 1890 + k, alpha: mode === 'out' ? ss(seg(t, em - .2, em + .4)) : 1 }); }
    K.flush({ ...o, run: .15 });
    const g = mode === 'out' ? eo(seg(t, em, em + 2.5)) : 1; rays(K.dyn, { x: TOMB[0] - 80, y: -250, ang: Math.PI / 2 + .1, n: 9, spread: .35, len: 1500 * (.3 + .7 * g), wid: 120, alpha: .22 * g, seed: 1895 }); K.flush({ t, cam, grey: 0, run: .6 });
  }
  if (mode === 'call' || mode === 'believe' || mode === 'close') mourners(K, t, o, 6, 200, 720, 1900, mode === 'believe' ? 1 : 0);
  const post = turn ? lerpPost(GREYW, WARM, ss(seg(t, em, em + 3))) : (mode === 'believe' || mode === 'close') ? WARM : GREYW;
  return { ...post };
};
S.stone = (t, x, K) => tombShot(t, x, K, 'stone');
S.call = (t, x, K) => tombShot(t, x, K, 'call');
S.out = (t, x, K) => tombShot(t, x, K, 'out');
S.believe = (t, x, K) => tombShot(t, x, K, 'believe');
S.close = (t, x, K) => tombShot(t, x, K, 'close');
