// JOSÉ DO EGITO — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'VENDIDO PELOS<br><b>PRÓPRIOS IRMÃOS</b>';
export const COVER = 'Vendido pelos <b>irmãos</b><small>e chegou ao palácio</small>';
export const COVER_T = 41.0;
export const BOOK = 'Gênesis 37 – 50';
export const REFS = [['l02', 'l02', 'Gênesis 37:3'], ['l03', 'l03', 'Gênesis 37:24–28'], ['l04', 'l04', 'Gênesis 39:20'], ['l05', 'l05', 'Gênesis 41:41'], ['l06', 'l06', 'Gênesis 42:6'], ['l07', 'l07', 'Gênesis 45:1–15'], ['l08', 'l08', 'Gênesis 50:20']];
export const QUOTES = ['l08'];
const PW = 1188, PH = 2112;
const COAT = ['#c83a2a', '#e8b030', '#2a6ab0'];
const JOSE = { robe: '#d8c8a8', mantle: '#8a6a4a', skin: '#b07a58', hair: '#3a2a22' };
const VIZIER = { robe: '#efe6cc', mantle: '#d4a03a', skin: '#b07a58', hair: '#2a2020' };
const BRO = ['#6a5a42', '#5a4a3a', '#7a6248', '#4e4a40'];

function buildPrison() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#2a2622'], [.6, '#4a4036'], [1, '#2a221a']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  for (let r = 0; r < 16; r++) for (let c = 0; c < 5; c++) { const w = 260, h = 130, x = c * w - (r % 2) * 120, y = r * h; R.fill(P([[x + 8, y + 8], [x + w - 8, y + 8], [x + w - 8, y + h - 8], [x + 8, y + h - 8]]), hash(r * 5 + c) > .5 ? '#5a5046' : '#4c443c', { dir: 0, group: 'wall', maxR: 14 }); }
  R.fill(P([[760, 420], [960, 420], [960, 640], [760, 640]]), lin(0, 420, 0, 640, [[0, '#e8e4d0'], [1, '#b8c0c8']]), { group: 'win', maxR: 8 });
  for (let k = 0; k < 4; k++) R.fill(P([[790 + k * 48, 420], [806 + k * 48, 420], [806 + k * 48, 640], [790 + k * 48, 640]]), '#1a1614', { dir: 90, group: 'bar' + k, maxR: 3 });
  R.tint(P([[760, 640], [960, 640], [560, 1750], [140, 1750]]), lin(0, 640, 0, 1750, [[0, 'rgba(240,226,190,.5)'], [1, 'rgba(240,226,190,.1)']]));
  R.fill(P([[0, 1620], [PW, 1620], [PW, PH], [0, PH]]), lin(0, 1620, 0, PH, [[0, '#7a6a4a'], [1, '#3a3020']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.fill(E(380, 1700, 300, 60), lin(0, 1640, 0, 1760, [[0, '#c8b07a'], [1, '#8a7448']]), { dir: 10, group: 'straw', maxR: 8 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 301 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildField() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1200], [0, 1200]]), lin(0, 0, 0, 1200, [[0, '#4a6a9a'], [.6, '#b8b4b0'], [1, '#e8d0a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 1150); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 1120 - Math.sin(x / 160) * 50); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1080, 0, PH, [[0, '#9aa070'], [.5, '#7a7a4a'], [1, '#4a4a2a']]), { dir: 0, fallback: 0, group: 'hill', maxR: 30 });
  [[220, 1240, 1], [930, 1210, .8]].forEach(([x, y, s], i) => { R.fill(P([[x - 150 * s, y], [x, y - 180 * s], [x + 150 * s, y]]), lin(x - 150, 0, x + 150, 0, [[0, '#d8c8a0'], [1, '#8a7a5a']]), { dir: 60, group: 'tent' + i, maxR: 10 }); R.fill(P([[x - 20 * s, y], [x, y - 70 * s], [x + 20 * s, y]]), '#3a2a20', { group: 'td' + i, maxR: 4 }); });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 302 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildPit() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#6a6058'], [.3, '#4a4038'], [1, '#141010']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  for (let r = 0; r < 14; r++) { const y = 300 + r * 130, w = 1188 - r * 40; for (let c = 0; c < 6; c++) R.fill(P([[594 - w / 2 + c * w / 6 + 6, y + 6], [594 - w / 2 + (c + 1) * w / 6 - 6, y + 6], [594 - w / 2 + (c + 1) * w / 6 - 6, y + 124], [594 - w / 2 + c * w / 6 + 6, y + 124]]), lin(0, y, 0, y + 130, [[0, hash(r * 6 + c) > .5 ? '#6a5e52' : '#5a5046'], [1, '#2a2420']]), { dir: 0, group: 'wall', maxR: 12 }); }
  R.fill(E(594, 140, 560, 170), lin(0, 0, 0, 300, [[0, '#c8d4dc'], [1, '#e8dcc0']]), { group: 'sky', maxR: 14 });
  R.fill(E(594, 1720, 420, 110), lin(0, 1620, 0, 1830, [[0, '#5a4a38'], [1, '#2a2018']]), { dir: 0, group: 'bottom', maxR: 14 });
  R.tint(P([[300, 200], [888, 200], [800, 1760], [390, 1760]]), lin(0, 200, 0, 1900, [[0, 'rgba(230,220,200,.4)'], [1, 'rgba(230,220,200,.05)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 303 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildPalace() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#2a4a7a'], [.5, '#c89a5a'], [1, '#6a4a2a']]), { dir: 90, fallback: 90, group: 'bg', maxR: 40 });
  [[90, 1], [340, .85], [848, .85], [1098, 1]].forEach(([x, k], i) => {
    R.fill(P([[x - 80 * k, 1520], [x - 70 * k, 340], [x + 70 * k, 340], [x + 80 * k, 1520]]), lin(x - 80, 0, x + 80, 0, [[0, '#f0d8a8'], [.5, '#d4b07a'], [1, '#8a6a42']]), { dir: 90, group: 'col' + i, maxR: 14 });
    R.fill(c => { c.moveTo(x - 70 * k, 340); c.quadraticCurveTo(x - 140 * k, 220, x - 100 * k, 180); c.lineTo(x + 100 * k, 180); c.quadraticCurveTo(x + 140 * k, 220, x + 70 * k, 340); c.closePath(); }, '#3a7a6a', { dir: 90, group: 'cap' + i, maxR: 10 });
    for (let b = 0; b < 4; b++) R.fill(P([[x - 72 * k, 600 + b * 220], [x + 72 * k, 600 + b * 220], [x + 72 * k, 620 + b * 220], [x - 72 * k, 620 + b * 220]]), b % 2 ? '#2a5aa0' : '#c84a2a', { dir: 0, group: 'col' + i, maxR: 4 });
  });
  R.fill(P([[0, 100], [PW, 100], [PW, 180], [0, 180]]), lin(0, 100, 0, 180, [[0, '#e8c070'], [1, '#9a7038']]), { dir: 0, group: 'beam', maxR: 10 });
  R.fill(P([[330, 1520], [858, 1520], [800, 1380], [388, 1380]]), lin(0, 1380, 0, 1520, [[0, '#e8c888'], [1, '#a07a4a']]), { dir: 0, group: 'dais', maxR: 10 });
  R.fill(P([[480, 1380], [480, 1000], [708, 1000], [708, 1380]]), lin(480, 0, 708, 0, [[0, '#f4d060'], [1, '#a87a20']]), { dir: 90, group: 'throne', maxR: 10 });
  R.fill(P([[0, 1520], [PW, 1520], [PW, PH], [0, PH]]), lin(0, 1520, 0, PH, [[0, '#c8a070'], [1, '#6a4a2c']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.tint(E(594, 900, 600, 700), rad(594, 900, 10, 700, [[0, 'rgba(255,220,150,.35)'], [1, 'rgba(255,220,150,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 304, rev: (x, y) => Math.hypot(x - 594, (y - 1200) * 1.2) / 650 + hash(x * .2 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { prison: buildPrison, field: buildField, pit: buildPit, palace: buildPalace };

export const S = {};
const prison = (t, x, K, a, b, hook) => {
  const cam = { x: 594, y: lerp(1280, 1330, seg(t, a, b)), zoom: lerp(hook ? 1.2 : 1.25, hook ? 1.32 : 1.4, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.prison, o);
  person(K.dyn, 400, 1690, 430, { f: 1, kneel: 1, lean: .45, head: .55 - .3 * ss(seg(t, a + 2, a + 4)), armF: [.9, 1.0], armB: [.8, .9], pal: JOSE, seed: 41 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  motes(K.dyn, t, { x0: 300, x1: 900, y0: 640, y1: 1600, n: 30, rise: -15, size: 7, col: [.9, .88, .8], alpha: .35, seed: 7 }); K.flush(K.grey({ t, cam }));
  return { ...GREYW, expo: (hook ? .85 * ss(seg(t, 0, .8)) : .85), light: [.4, -.8, .6] };
};
S.prison1 = (t, x, K) => prison(t, x, K, 0, K.C('field'), true);
S.prison2 = (t, x, K) => prison(t, x, K, K.C('prison2'), K.C('palace1'), false);
S.field = (t, x, K) => {
  const a = K.C('field'), b = K.C('pit');
  const cam = { x: lerp(560, 620, seg(t, a, b)), y: 1300, zoom: lerp(1.18, 1.3, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.field, o);
  const give = ss(seg(t, K.L('l02') + 1.6, K.L('l02') + 2.6));
  person(K.dyn, 800, 1640, 440, { f: -1, pal: { robe: '#6a5440', mantle: '#4a3a2c', skin: '#a07858', hair: '#e0d8c8' }, lean: .1, armF: [lerp(.3, 1.4, 1 - give * .3), .3], seed: 51 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  // the coat: the only colour in the grey world
  person(K.dyn, 420, 1660, 400, { f: 1, stripes: give > .5 ? COAT : null, pal: JOSE, armF: [lerp(.3, .9, give), .6], head: -.1, seed: 52 });
  K.flush({ t, cam, grey: give > .5 ? 0 : .86, reveal: give > .5 ? -1e6 : 1e6, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.pit = (t, x, K) => {
  const a = K.C('pit'), b = K.C('prison2'), tear = K.T.tear, drop = K.T.drop;
  const cam = { x: 594, y: key(t, [[a, 980], [drop - .2, 980], [drop + 1.2, 1250]]), zoom: key(t, [[a, 1.0], [drop + 1.2, 1.1]]) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.pit, o);
  // José falls to the bottom and looks up
  const fall = ss(seg(t, drop - .55, drop));
  person(K.dyn, 594, lerp(500, 1700, fall), 300, { f: 1, lie: (1 - fall) * .5, kneel: fall > .99 ? .7 : 0, head: -.6, armF: [2.4, .2], armB: [2.0, .3], pal: JOSE, seed: 53, alpha: t > drop - .55 ? 1 : 0 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  // brothers looking down over the rim
  for (let i = 0; i < 4; i++) { const xx = 280 + i * 210, yy = 300 - Math.abs(i - 1.5) * 25; K.dyn.push({ x: xx, y: yy - 30, ang: 0, len: 190, wid: 90, c: hex(BRO[i]), type: 0, seed: 600 + i, hgt: 1.1 }); K.dyn.push({ x: xx, y: yy + 30, ang: 0, len: 84, wid: 92, c: hex('#9a6a4a'), c2: hex('#7a5038'), type: 2, seed: 610 + i }); K.dyn.push({ x: xx, y: yy + 78, ang: 0, len: 60, wid: 46, c: hex('#2a2020'), type: 2, seed: 620 + i }); K.dyn.push({ x: xx - 18, y: yy + 22, ang: 0, len: 10, wid: 9, c: hex('#141010'), type: 2, seed: 630 + i }); K.dyn.push({ x: xx + 18, y: yy + 22, ang: 0, len: 10, wid: 9, c: hex('#141010'), type: 2, seed: 634 + i }); }
  // the torn coat falls in pieces and loses its colour
  const fade = ss(seg(t, tear, tear + 1.2));
  for (let k = 0; k < 3; k++) { const fl = seg(t, tear + k * .2, tear + 2.2 + k * .2); K.dyn.push({ x: 450 + k * 140 + Math.sin(fl * 6 + k) * 40, y: lerp(320, 1700, fl * fl), ang: fl * 4 + k, len: 120, wid: 60, c: hex(COAT[k]), type: 0, seed: 640 + k, alpha: t > tear ? 1 : 0 }); }
  K.flush({ t, cam, grey: fade * .86, reveal: NEVER_(fade), alpha: x.a });
  return { ...GREYW, expo: .9 };
};
const NEVER_ = f => f > 0 ? 1e6 : -1e6;
const palace = (t, x, K, mode) => {
  const a = K.C(mode === 1 ? 'palace1' : mode === 2 ? 'palace2' : mode === 3 ? 'palace3' : 'close');
  const rv = K.T.reveal;
  let cam;
  if (mode === 1) cam = { x: 594, y: key(t, [[a, 1080], [K.C('palace2'), 1260]]), zoom: key(t, [[a, 1.0], [K.C('palace2'), 1.16]]) };
  else if (mode === 2) cam = { x: 594, y: lerp(1330, 1370, seg(t, a, K.C('palace3'))), zoom: lerp(1.3, 1.36, seg(t, a, K.C('palace3'))) };
  else if (mode === 3) cam = { x: 594, y: lerp(1380, 1420, seg(t, a, K.C('close'))), zoom: lerp(1.35, 1.55, ss(seg(t, a, K.C('close')))) };
  else cam = { x: 594, y: lerp(1250, 1300, seg(t, a, a + 8)), zoom: lerp(1.25, 1.45, ss(seg(t, a, a + 8))) };
  const o = mode === 1 ? { t, cam, grey: 1, reveal: rv, revDur: .35, appear: x.appear } : K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.palace, mode === 1 ? { ...o, revC: [594, 1300, 650] } : o);
  const g = mode === 1 ? eo(seg(t, rv, rv + 2.5)) : 1;
  rays(K.dyn, { x: 594, y: -200, ang: Math.PI / 2, n: 11, spread: .55, len: 1800, wid: 130, alpha: .2 * g, grow: .3 + .7 * g, seed: 330 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  const oo = mode === 1 ? { t, cam, grey: 1, reveal: rv, revDur: .35 } : K.col({ t, cam });
  if (mode === 1) {
    person(K.dyn, 594, 1385, 380, { f: 1, crown: 1, pal: { robe: '#f0e8d0', mantle: '#2a5aa0', skin: '#a07050', hair: '#2a2020' }, armF: [lerp(.2, 1.3, ss(seg(t, rv + 1.8, rv + 2.8))), .2], seed: 61 });
    person(K.dyn, 334, 1640, 440, { f: 1, pal: ss(seg(t, rv + 2.5, rv + 3.5)) > .5 ? VIZIER : JOSE, head: -.1, seed: 62 });
  } else {
    // José on the dais in Egyptian white and gold; the brothers kneel before him
    const bow = mode === 2 ? ss(seg(t, K.T.bow - 1.2, K.T.bow)) : 1, emb = mode === 3 ? ss(seg(t, K.T.embrace - .6, K.T.embrace + .6)) : 0;
    const jx = mode >= 3 ? lerp(594, 520, emb) : 594, jy = mode >= 3 ? lerp(1385, 1640, emb) : 1385;
    if (mode < 4) BRO.forEach((c, i) => { const bx = 250 + i * 230, by = 1650 + (i % 2) * 30; const up = mode === 3 && i === 1 ? emb : 0; person(K.dyn, i === 1 && mode === 3 ? lerp(bx, 650, emb) : bx, by, 400, { f: i < 2 ? 1 : -1, kneel: bow * (1 - up), lean: .2 * bow * (1 - up), head: .45 * bow * (1 - up), armF: [lerp(.2, 1.3, bow * (1 - up)) + up * 1.2, .5], pal: { robe: c, mantle: '#5a4a36', skin: '#a07050', hair: '#2a2220' }, seed: 70 + i * 5 }); });
    person(K.dyn, jx, jy, mode >= 3 ? 440 : 380, { f: 1, pal: VIZIER, armF: [lerp(.3, 1.35, emb), .4], armB: [lerp(.2, 1.2, emb), .5], head: mode === 3 ? .15 * emb : -.1, seed: 62 });
  }
  K.flush({ ...oo, alpha: x.a, run: .15 });
  motes(K.dyn, t, { x0: 200, x1: 1000, y0: 300, y1: 1700, n: 36, rise: 25, size: 8, col: [1, .86, .55], alpha: .4 * g, seed: 23 }); K.flush({ t, cam, grey: 0 });
  const post = mode === 1 ? lerpPost(GREYW, WARM, ss(seg(t, rv, rv + 3))) : WARM;
  const rk = mode === 1 ? Math.sin(Math.PI * seg(t, rv - .2, rv + 4)) : 0;
  return { ...post, light: [-.3, -.7, lerp(.6, .2, rk)], norm: 3.2 + rk * 2.2 };
};
S.palace1 = (t, x, K) => palace(t, x, K, 1);
S.palace2 = (t, x, K) => palace(t, x, K, 2);
S.palace3 = (t, x, K) => palace(t, x, K, 3);
S.close = (t, x, K) => palace(t, x, K, 4);
