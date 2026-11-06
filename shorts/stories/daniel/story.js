// DANIEL NA COVA DOS LEÕES — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { lion } from '../../scenes/actors2.js';
import { GREYW, WARM, key, pulse, lerpPost, NEVER } from '../../runner.js';

export const HOOK = 'UMA NOITE COM<br><b>LEÕES FAMINTOS</b>';
export const COVER = 'Trancado com <b>leões</b><small>e ele sobreviveu</small>';
export const COVER_T = 44.5;
export const BOOK = 'Daniel 6';
export const REFS = [['l02', 'l02', 'Daniel 6:10'], ['l03', 'l03', 'Daniel 6:7'], ['l05', 'l05', 'Daniel 6:16–17'], ['l07', 'l07', 'Daniel 6:19–20'], ['l08', 'l08', 'Daniel 6:22']];
export const QUOTES = ['l08'];
const PW = 1188, PH = 2112;

// ---------- plates
function buildDen() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#2a2830'], [.5, '#4a4038'], [1, '#2a2018']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  for (let r = 0; r < 18; r++) for (let c = 0; c < 6; c++) { const w = 210, h = 120, x = c * w - (r % 2) * 100, y = r * h; R.fill(P([[x + 6, y + 6], [x + w - 6, y + 6], [x + w - 6, y + h - 6], [x + 6, y + h - 6]]), lin(0, y, 0, y + h, [[0, hash(r * 7 + c) > .5 ? '#6a5a4a' : '#5a4e44'], [1, '#3a3028']]), { dir: 0, group: 'wall', maxR: 14 }); }
  R.fill(E(594, 260, 250, 200), rad(594, 240, 10, 260, [[0, '#c8d4e8'], [.5, '#6a7ea4'], [1, '#2c3a5a']]), { group: 'sky', maxR: 12 });
  R.tint(P([[380, 300], [808, 300], [1060, 1700], [130, 1700]]), lin(0, 300, 0, 1700, [[0, 'rgba(240,220,170,.55)'], [1, 'rgba(240,220,170,.08)']]));
  R.fill(c => { c.moveTo(0, 1500); c.bezierCurveTo(300, 1450, 900, 1450, PW, 1500); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1450, 0, PH, [[0, '#a88a62'], [1, '#5a4430']]), { dir: 0, fallback: 0, group: 'floor', maxR: 26 });
  R.fill(E(594, 1640, 380, 90), lin(0, 1550, 0, 1730, [[0, '#d8bc8a'], [1, '#a08060']]), { dir: 0, group: 'pool', maxR: 14 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 201, rev: (x, y) => y / 900 + hash(x * .3 + y) * .3 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildRoom() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, PW, 0, [[0, '#5a4434'], [1, '#8a6a4c']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  // the open window toward Jerusalem: hills under a sunset
  const win = c => { c.moveTo(640, 1250); c.lineTo(640, 640); c.ellipse(840, 640, 200, 200, 0, Math.PI, 2 * Math.PI); c.lineTo(1040, 1250); c.closePath(); };
  R.fill(win, lin(0, 440, 0, 1250, [[0, '#6a7ab0'], [.45, '#e8a070'], [.7, '#f8d090'], [1, '#c89060']]), { dir: -3, group: 'win', maxR: 12 });
  R.fill(c => { c.moveTo(640, 1080); for (let x = 640; x <= 1040; x += 20) c.lineTo(x, 1040 - Math.sin(x / 50) * 25); c.lineTo(1040, 1250); c.lineTo(640, 1250); c.closePath(); }, '#8a6a7a', { dir: 0, group: 'hills', maxR: 6 });
  R.fill(P([[760, 1010], [760, 960], [790, 960], [790, 930], [830, 930], [830, 970], [880, 970], [880, 1010]]), '#c4a07a', { dir: 90, group: 'city', maxR: 4 });
  R.line(win, '#3a2a20', 34, { dir: 'edge', group: 'frame', maxR: 6 });
  R.fill(P([[600, 1250], [1080, 1250], [1100, 1300], [580, 1300]]), '#a08060', { dir: 0, group: 'sill', maxR: 6 });
  R.fill(P([[0, 1560], [PW, 1560], [PW, PH], [0, PH]]), lin(0, 1560, 0, PH, [[0, '#7a5a40'], [1, '#3a2a1e']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.fill(P([[160, 1600], [980, 1600], [1060, 1800], [80, 1800]]), lin(0, 1600, 0, 1800, [[0, '#8a3a2a'], [1, '#5a2418']]), { dir: 0, group: 'rug', maxR: 14 });
  R.tint(P([[640, 1250], [1040, 1250], [700, 1900], [-200, 1900]]), 'rgba(255,200,130,.28)');
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 202 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildPalace() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#3a2a3a'], [.6, '#6a4a3a'], [1, '#3a2620']]), { dir: 90, fallback: 90, group: 'bg', maxR: 40 });
  [[60, 1], [330, .8], [860, .8], [1130, 1]].forEach(([x, k], i) => R.fill(P([[x - 70 * k, 1500], [x - 60 * k, 260], [x + 60 * k, 260], [x + 70 * k, 1500]]), lin(x - 70, 0, x + 70, 0, [[0, '#d8b88a'], [.5, '#b89068'], [1, '#6a4a34']]), { dir: 90, group: 'col' + i, maxR: 14 }));
  R.fill(P([[0, 180], [PW, 180], [PW, 300], [0, 300]]), lin(0, 180, 0, 300, [[0, '#c8a070'], [1, '#7a5a3a']]), { dir: 0, group: 'beam', maxR: 12 });
  R.fill(P([[380, 1500], [808, 1500], [760, 1380], [428, 1380]]), '#8a6a4a', { dir: 0, group: 'dais', maxR: 10 });
  R.fill(P([[480, 1380], [480, 980], [530, 940], [660, 940], [710, 980], [710, 1380]]), lin(480, 0, 710, 0, [[0, '#e0b050'], [1, '#9a6a24']]), { dir: 90, group: 'throne', maxR: 10 });
  R.fill(P([[520, 1380], [520, 1060], [670, 1060], [670, 1380]]), '#6a2a4a', { dir: 90, group: 'cush', maxR: 8 });
  R.fill(P([[0, 1500], [PW, 1500], [PW, PH], [0, PH]]), lin(0, 1500, 0, PH, [[0, '#8a6a4a'], [1, '#3a2a1e']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.fill(P([[440, 1500], [748, 1500], [900, PH], [290, PH]]), lin(0, 1500, 0, PH, [[0, '#8a2a2a'], [1, '#4a1414']]), { dir: 90, group: 'carpet', maxR: 14 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 203 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildMouth() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 900], [0, 900]]), lin(0, 0, 0, 900, [[0, '#3a4a7a'], [.6, '#c8a0a8'], [1, '#f6c890']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 880); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 860 - Math.sin(x / 120) * 30); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 850, 0, PH, [[0, '#9a7a62'], [1, '#4a3a2c']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  R.fill(E(594, 1500, 330, 120), rad(594, 1520, 10, 330, [[0, '#0a0606'], [1, '#2a1c16']]), { group: 'hole', maxR: 10 });
  R.fill(E(860, 1400, 190, 120), lin(0, 1280, 0, 1520, [[0, '#b8a68a'], [1, '#6a5a48']]), { dir: 0, group: 'stone', maxR: 12 });
  [[180, 1260, 120, 60], [1000, 1700, 140, 70]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), lin(0, y - h, 0, y + h, [[0, '#a48a70'], [1, '#4a3a2c']]), { dir: 0, group: 'rock' + i, maxR: 10 }));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 204 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { den: buildDen, room: buildRoom, palace: buildPalace, mouth: buildMouth };

// ---------- shots
const DAN = [594, 1590], DH = 400;
const LIONS = [[230, 1730, 400, 1, 0], [960, 1700, 380, -1, 1.7], [250, 1420, 300, 1, 3.1], [930, 1410, 290, -1, 4.4]];
function lions(K, t, { calm = 0, prowl = 1, rev } = {}) {
  LIONS.forEach(([x, y, s, f, p], i) => {
    const dx = Math.sin(t * .35 + p) * 60 * prowl * (1 - calm);
    lion(K.dyn, x + dx, y, s, { f: Math.cos(t * .35 + p) * f > -2 ? f : -f, lie: calm, phase: t * 2.2 + p, stride: prowl * (1 - calm) * .6, mouth: (1 - calm) * Math.max(0, Math.sin(t * .9 + p * 2)) ** 6, look: calm * .4, seed: 300 + i * 50, rev });
  });
}
export const S = {};
S.den1 = (t, x, K) => {
  const cam = { x: 594, y: key(t, [[0, 1240], [K.C('window'), 1320]]), zoom: key(t, [[0, 1.18, z => z], [K.C('window'), 1.32]]) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.den, o);
  lions(K, t); K.flush({ ...o, alpha: x.a, run: .15 });
  person(K.dyn, DAN[0], DAN[1], DH, { f: 1, kneel: 1, lean: -.05, head: -.3, armF: [2.6, .2], armB: [2.4, .3], seed: 21 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .82 * ss(seg(t, 0, .8)), light: [-.2, -.8, .6] };
};
S.window = (t, x, K) => {
  const k = seg(t, K.C('window'), K.C('palace'));
  const pray = K.C('window2') <= t;
  const cam = pray ? { x: lerp(560, 600, ss(seg(t, K.C('window2'), K.C('den2')))), y: lerp(1300, 1250, seg(t, K.C('window2'), K.C('den2'))), zoom: lerp(1.15, 1.32, ss(seg(t, K.C('window2'), K.C('den2')))) }
    : { x: lerp(620, 560, k), y: lerp(1050, 1250, eio(k)), zoom: lerp(1.0, 1.1, k) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.room, o);
  // the window light is the only colour
  rays(K.dyn, { x: 860, y: 650, ang: Math.PI * .72, n: 9, spread: .35, len: 1500, wid: 110, alpha: .2, seed: 210 }); K.flush(K.col({ t, cam, alpha: x.a, run: .6 }));
  const kneel = pray ? ss(seg(t, K.L('l04') + 1.0, K.L('l04') + 2.2)) : 0, lift = pray ? ss(seg(t, K.L('l04') + 1.8, K.L('l04') + 2.8)) : 0;
  person(K.dyn, 450, 1600, 470, { f: 1, kneel, head: -.25 * lift, armF: [lerp(.2, 2.5, lift), .3], armB: [lerp(.1, 2.3, lift), .3], seed: 22 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, light: [.6, -.6, .6] };
};
S.window2 = S.window;
S.palace = (t, x, K) => {
  const night = t >= K.C('palaceN');
  const a = night ? K.C('palaceN') : K.C('palace'), b = night ? K.C('mouth') : K.C('window2');
  const cam = night ? { x: 594, y: lerp(1200, 1260, seg(t, a, b)), zoom: lerp(1.05, 1.18, ss(seg(t, a, b))) } : { x: 594, y: lerp(1150, 1250, eio(seg(t, a, b))), zoom: lerp(1.0, 1.08, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.palace, o);
  const kingPal = { robe: '#5a2e5e', mantle: '#c49a3a', skin: '#a07050', hair: '#2a2020' };
  if (!night) {
    person(K.dyn, 594, 1395, 380, { f: 1, crown: 1, pal: kingPal, armF: [lerp(.2, 1.1, ss(seg(t, K.L('l03') + 2.6, K.L('l03') + 3.4))), .2], seed: 31 });
    [[250, 1720, 1], [900, 1740, -1]].forEach(([px, py, f], i) => person(K.dyn, px, py, 430, { f, pal: { robe: '#4a4a5a', mantle: '#8a7a5a', skin: '#a07050', hair: '#2a2020' }, armF: [1.3 + Math.sin(t * 1.5 + i) * .1, .5], lean: .1, seed: 35 + i * 3 }));
  } else {
    const wk = (t - a) * .32, px = 594 + Math.sin(wk * Math.PI) * 260, f = Math.cos(wk * Math.PI) > 0 ? 1 : -1;
    person(K.dyn, px, 1700, 470, { f, crown: 1, pal: kingPal, phase: (t - a) * 5, stride: .9, head: .2, armF: [.9, 1.4], seed: 31 });
  }
  K.flush({ ...o, alpha: x.a, run: .15 });
  return night ? { ...GREYW, expo: .55, light: [-.7, -.4, .5], vig: .6 } : { ...GREYW };
};
S.palaceN = S.palace;
S.den2 = (t, x, K) => {
  const a = K.C('den2'), st = K.T.stone;
  const cam = { x: 594, y: key(t, [[a, 1300], [st - .3, 1280], [st + 1.2, 760], [K.C('palaceN'), 740]]), zoom: key(t, [[a, 1.22], [K.C('palaceN'), 1.12]]) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.den, o);
  lions(K, t + 20, { prowl: .7 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const land = eo(seg(t, a + .1, a + .9));
  person(K.dyn, DAN[0], lerp(1000, DAN[1], land), DH, { f: 1, kneel: land, lie: (1 - land) * -.6, armF: [1.6, .3], armB: [1.2, .3], seed: 21 }); K.flush({ ...o, alpha: x.a, run: .15 });
  // the stone slides over the opening
  const sk = ss(seg(t, st, st + 1.5));
  K.dyn.push({ x: lerp(1150, 594, sk), y: 260, ang: 0, len: 560, wid: 470, c: hex('#5a5048'), c2: hex('#3a322c'), type: 2, seed: 77, hgt: 1.2 });
  K.flush({ ...o, alpha: x.a });
  return { ...GREYW, expo: lerp(.85, .62, sk), light: [-.2, -.8, .6] };
};
S.mouth = (t, x, K) => {
  const a = K.C('mouth');
  const cam = { x: 594, y: key(t, [[a, 1150], [K.L('l07') + 2.5, 1300]]), zoom: key(t, [[a, 1.0], [K.C('den3'), 1.22]]) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mouth, o);
  const run = seg(t, a, a + 1.6), arrive = ss(seg(t, a + 1.4, a + 2.2));
  const px = lerp(80, 470, run), py = lerp(1300, 1470, run);
  person(K.dyn, px, py, 360, { f: 1, crown: 1, pal: { robe: '#5a2e5e', mantle: '#c49a3a', skin: '#a07050', hair: '#2a2020' }, phase: t * 7, stride: 1 - arrive, kneel: arrive * .8, lean: .25 * arrive, head: .35 * arrive, armF: [lerp(.3, 1.9, arrive), .9], seed: 31 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .92 };
};
S.den3 = (t, x, K) => {
  const a = K.C('den3'), ang = K.T.angel;
  const cam = { x: 594, y: key(t, [[a, 1000], [ang + 2.5, 1300]]), zoom: key(t, [[a, 1.05], [ang + 2.5, 1.22]]) };
  const o = { t, cam, grey: 1, reveal: ang, revDur: .35 };
  K.plate(K.PL.den, { ...o, revC: [594, 260, 700] });
  const g = eo(seg(t, ang, ang + 2.5));
  rays(K.dyn, { x: 594, y: 200, ang: Math.PI / 2, n: 11, spread: .55, len: 1700, wid: 130, alpha: .26 * g, grow: .3 + .7 * g, seed: 230 }); K.flush({ t, cam, grey: 0, run: .6 });
  lions(K, t, { calm: 1, rev: 0 }); K.flush({ ...o, run: .15 });
  person(K.dyn, DAN[0], DAN[1], DH, { f: 1, kneel: 1, lean: -.1, head: -.4, armF: [2.6, .2], armB: [2.4, .3], seed: 21 }); K.flush({ ...o, run: .15 });
  motes(K.dyn, t, { x0: 200, x1: 1000, y0: 300, y1: 1600, n: 40, rise: 30, size: 9, col: [1, .86, .55], alpha: .45 * g, seed: 13 }); K.flush({ t, cam, grey: 0 });
  const rk = Math.sin(Math.PI * seg(t, ang - .2, ang + 4));
  const post = lerpPost(GREYW, WARM, ss(seg(t, ang, ang + 3)));
  return { ...post, expo: post.expo * (1 + .1 * g), light: [-.2, -.7, lerp(.6, .18, rk)], norm: 3.2 + rk * 2.4 };
};
S.close = (t, x, K) => {
  const a = K.C('close');
  const cam = { x: 594, y: lerp(1320, 1430, ss(seg(t, a, a + 8))), zoom: lerp(1.25, 1.5, ss(seg(t, a, a + 8))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.den, o);
  rays(K.dyn, { x: 594, y: 200, ang: Math.PI / 2, n: 11, spread: .55, len: 1700, wid: 130, alpha: .22, seed: 230 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  lions(K, t, { calm: 1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  person(K.dyn, DAN[0], DAN[1], DH, { f: 1, kneel: 1, head: lerp(-.4, 0, ss(seg(t, a, a + 2))), armF: [lerp(2.6, .8, ss(seg(t, a, a + 2))), .6], armB: [lerp(2.4, .6, ss(seg(t, a, a + 2))), .6], seed: 21 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [-.2, -.7, .6] };
};
