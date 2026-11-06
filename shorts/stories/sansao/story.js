// SANSÃO — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { lion, column } from '../../scenes/actors2.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'O HOMEM MAIS FORTE<br><b>PERDEU TUDO</b>';
export const COVER = 'Perdeu <b>tudo</b><small>por causa de um segredo</small>';
export const COVER_T = 47.0;
export const BOOK = 'Juízes 13 – 16';
export const REFS = [['l02', 'l02', 'Juízes 13:5'], ['l03', 'l03', 'Juízes 14:6'], ['l04', 'l04', 'Juízes 16:4–5'], ['l05', 'l05', 'Juízes 16:16–19'], ['l06', 'l06', 'Juízes 16:21'], ['l07', 'l08', 'Juízes 16:22–28'], ['l09', 'l09', 'Juízes 16:30']];
export const QUOTES = ['l08'];
const PW = 1188, PH = 2112;
const SAM = { robe: '#8a6a4a', mantle: '#6a4a32', skin: '#b07a58', hair: '#c08a3a' };
const DAL = { robe: '#8a2a3a', mantle: '#c49a3a', skin: '#c08a68', hair: '#2a1a14' };
const PHIL = { robe: '#4a4a5a', mantle: '#7a6a4a', skin: '#a07050', hair: '#2a2020' };

function buildTemple() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#4a3a3a'], [.5, '#8a6a52'], [1, '#3a2a22']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(P([[0, 230], [PW, 230], [PW, 330], [0, 330]]), lin(0, 230, 0, 330, [[0, '#c8a47a'], [1, '#6a4a34']]), { dir: 0, group: 'roof', maxR: 12 });
  R.fill(P([[0, 330], [PW, 330], [PW, 560], [0, 560]]), lin(0, 330, 0, 560, [[0, '#3a2a26'], [1, '#5a4434']]), { dir: 0, group: 'gallery', maxR: 16 });
  [[90], [1098]].forEach(([x], i) => R.fill(P([[x - 80, 1720], [x - 70, 330], [x + 70, 330], [x + 80, 1720]]), lin(x - 80, 0, x + 80, 0, [[0, '#c8b090'], [1, '#6a5a44']]), { dir: 90, group: 'sidecol' + i, maxR: 12 }));
  R.fill(P([[0, 1720], [PW, 1720], [PW, PH], [0, PH]]), lin(0, 1720, 0, PH, [[0, '#9a7a5a'], [1, '#3a2a1e']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.tint(E(594, 1100, 500, 700), rad(594, 1100, 10, 700, [[0, 'rgba(255,200,130,.25)'], [1, 'rgba(255,200,130,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 501, rev: (x, y) => Math.hypot(x - 594, (y - 1400) * 1.2) / 650 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildField() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1150], [0, 1150]]), lin(0, 0, 0, 1150, [[0, '#4a6aa0'], [.6, '#c8c0b0'], [1, '#f0d8a8']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(c => { c.moveTo(0, 1150); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 1110 - Math.sin(x / 200 + 1) * 70); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1050, 0, PH, [[0, '#a8a070'], [.5, '#8a8048'], [1, '#4a4426']]), { dir: 0, fallback: 0, group: 'hill', maxR: 30 });
  for (let r = 0; r < 4; r++) R.line(c => { c.moveTo(0, 1300 + r * 90); c.lineTo(PW, 1260 + r * 100); }, '#5a6a32', 22, { dir: 0, group: 'vine' + r, maxR: 6 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 502 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildRoom() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), rad(800, 900, 30, 1300, [[0, '#7a4a32'], [.6, '#3a2018'], [1, '#160c08']]), { dir: 90, fallback: 90, group: 'bg', maxR: 40 });
  [[200, 1], [700, .8]].forEach(([x, k], i) => R.fill(P([[x - 140 * k, 0], [x + 140 * k, 0], [x + 100 * k, 1500], [x - 100 * k, 1500]]), lin(x - 140, 0, x + 140, 0, [[0, '#6a2a2a'], [1, '#3a1414']]), { dir: 90, group: 'drape' + i, maxR: 14 }));
  R.fill(P([[0, 1560], [PW, 1560], [PW, PH], [0, PH]]), lin(0, 1560, 0, PH, [[0, '#6a4430'], [1, '#2a1a10']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.fill(E(560, 1640, 440, 110), lin(0, 1530, 0, 1750, [[0, '#a87a4a'], [1, '#6a4428']]), { dir: 0, group: 'cushion', maxR: 12 });
  R.fill(P([[930, 1200], [990, 1200], [980, 1560], [940, 1560]]), '#3a2a1e', { dir: 90, group: 'stand', maxR: 4 });
  R.fill(E(960, 1180, 46, 22), '#c89a4a', { group: 'lamp', maxR: 4 });
  R.tint(E(960, 1130, 520, 520), rad(960, 1130, 10, 520, [[0, 'rgba(255,190,110,.45)'], [1, 'rgba(255,190,110,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 503 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildMill() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), lin(0, 0, 0, PH, [[0, '#1e1a18'], [.6, '#3a322a'], [1, '#1a1612']]), { dir: 90, fallback: 90, group: 'wall', maxR: 40 });
  R.fill(P([[0, 1450], [PW, 1450], [PW, PH], [0, PH]]), lin(0, 1450, 0, PH, [[0, '#5a4a3a'], [1, '#2a2018']]), { dir: 0, fallback: 0, group: 'floor', maxR: 24 });
  R.fill(E(594, 1500, 260, 80), lin(0, 1420, 0, 1580, [[0, '#9a8a74'], [1, '#5a4c3c']]), { dir: 0, group: 'stoneTop', maxR: 10 });
  R.fill(P([[334, 1500], [854, 1500], [854, 1620], [334, 1620]]), lin(0, 1500, 0, 1620, [[0, '#7a6a58'], [1, '#3a3028']]), { dir: 0, group: 'stoneSide', maxR: 10 });
  R.fill(E(594, 1620, 260, 80), '#3a3028', { group: 'stoneSide', maxR: 10 });
  R.fill(P([[560, 1500], [628, 1500], [628, 1250], [560, 1250]]), '#4a3a2a', { dir: 90, group: 'axle', maxR: 6 });
  R.tint(P([[700, 0], [900, 0], [700, 1600], [300, 1600]]), lin(0, 0, 0, 1600, [[0, 'rgba(220,210,190,.35)'], [1, 'rgba(220,210,190,.05)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 504 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { temple: buildTemple, field: buildField, room: buildRoom, mill: buildMill };

const COLS = [[360, 1720], [828, 1720]], CW = 120, CH = 1390;
function crowdGallery(K, t, o, fall = 0) {
  for (let i = 0; i < 22; i++) { const x = 30 + i * 52 + (hash(i) - .5) * 14, y = 520 + (i % 2) * 18 + fall * fall * (600 + hash(i * 3) * 700); K.dyn.push({ x, y, ang: 0, len: 46, wid: 70, c: hex(['#4a4a5a', '#6a5a42', '#5a3a3a'][i % 3]), type: 0, seed: 1100 + i }); K.dyn.push({ x, y: y - 48, ang: 0, len: 30, wid: 32, c: hex('#9a6a4a'), type: 2, seed: 1130 + i }); }
  K.flush({ ...o, run: .15 });
}
function samsonPillars(K, t, o, { push = 0, fall = 0, hairLen = .2, hairCol, hairGrey = 1 }) {
  const fx = fall > 0 ? 1 : 0;
  column(K.dyn, COLS[0][0], COLS[0][1], CW, CH, { fall, dir: -1, seed: 1200 }); column(K.dyn, COLS[1][0], COLS[1][1], CW, CH, { fall, dir: 1, seed: 1240 });
  K.flush({ ...o, run: .2 });
  person(K.dyn, 594, 1720, 470, { f: 1, bare: 1, band: '#d8ccb0', hairLen, hairCol, armF: [lerp(.6, 1.57, push), lerp(.5, 0, push)], armB: [lerp(.5, 1.57, push), 0], lean: -.05 + push * .05, head: lerp(.3, -.4, push), seed: 81, pal: SAM });
  K.flush({ ...o, run: .15 });
}
export const S = {};
S.temple1 = (t, x, K) => {
  const cam = { x: 594, y: lerp(1200, 1260, seg(t, 0, K.C('field'))), zoom: lerp(1.12, 1.24, ss(seg(t, 0, K.C('field')))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.temple, o); crowdGallery(K, t, o);
  samsonPillars(K, t, o, { push: .2, hairLen: .15 });
  return { ...GREYW, expo: .85 * ss(seg(t, 0, .8)), light: [-.3, -.7, .6] };
};
S.field = (t, x, K) => {
  const a = K.C('field'), b = K.C('room'), li = K.T.lion;
  const cam = { x: lerp(560, 620, seg(t, a, b)), y: lerp(1300, 1340, seg(t, a, b)), zoom: lerp(1.2, 1.32, ss(seg(t, a, b))), rot: t > li && t < li + .5 ? Math.sin((t - li) * 50) * .01 * (1 - (t - li) * 2) : 0 };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.field, o);
  // the lion leaps, Samson catches it; it falls
  const leap = seg(t, li - .7, li), down = ss(seg(t, li, li + .8));
  if (t > li - 1.6) lion(K.dyn, lerp(980, 760, leap) - down * 40, lerp(1650, 1560, Math.sin(leap * Math.PI)) + down * 90, 360, { f: -1, lie: down, mouth: 1 - down, phase: t * 6, stride: 1 - down, seed: 1300 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  const fight = ss(seg(t, li - .3, li + .1));
  person(K.dyn, 450, 1660, 470, { f: 1, bare: 1, hairLen: 1, armF: [lerp(.3, 2.2, fight), lerp(.3, .1, fight)], armB: [lerp(.2, 1.8, fight), .2], lean: .12 * fight, pal: SAM, seed: 81 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  // the hair: the only colour
  person(K.dyn, 450, 1660, 470, { f: 1, bare: 1, hairLen: 1, armF: [lerp(.3, 2.2, fight), lerp(.3, .1, fight)], armB: [lerp(.2, 1.8, fight), .2], lean: .12 * fight, pal: SAM, seed: 81, alpha: 0 });
  K.dyn.clear();
  hairOnly(K, 450, 1660, 470, 1, .12 * fight, { t, cam, grey: 0, alpha: x.a });
  return { ...GREYW };
};
// redraw only the hair strokes in colour over the grey figure
function hairOnly(K, x, y, H, len, lean, o, col = '#c08a3a') {
  const shX = Math.sin(lean) * H * .3, shY = -H * .8;
  for (let k = 0; k < 3; k++) { const a0 = [x + shX - H * (.015 + k * .02), y + shY - H * .14], a1 = [x + shX - H * (.045 + k * .022), y + shY - H * .1 + len * H * (.42 - k * .07)];
    K.dyn.push({ x: (a0[0] + a1[0]) / 2, y: (a0[1] + a1[1]) / 2, ang: Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), len: Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) * 1.05, wid: H * .036, c: hex(col).map(v => v * (1.1 - k * .12)), c2: hex(col).map(v => v * .8), type: 0, taper: .55, seed: 81 + 50 + k, hgt: 1.2 }); }
  K.dyn.push({ x: x + shX + H * .005, y: y + shY - H * .115, ang: 0, len: H * .1, wid: H * .06, c: hex(col), type: 2, seed: 81 + 44 });
  K.flush({ ...o, run: .15 });
}
S.room = (t, x, K) => {
  const a = K.C('room'), b = K.C('mill'), cu = K.T.cut;
  const cam = { x: lerp(640, 600, seg(t, a, b)), y: lerp(1350, 1380, seg(t, a, b)), zoom: lerp(1.25, 1.42, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.room, o);
  const cut = ss(seg(t, cu, cu + 1.2)), len = lerp(1, .12, cut);
  // Delilah seated; Samson asleep, his head on her lap
  person(K.dyn, 560, 1640, 400, { f: -1, kneel: 1, beard: false, bare: 1, hairLen: .6, hairCol: '#2a1a14', pal: DAL, armF: [1.2, .8], head: .25, seed: 91 });
  person(K.dyn, 980, 1655, 470, { f: 1, lie: -1.48, bare: 1, hairLen: len, pal: SAM, head: -.1, seed: 81 });
  if (t > cu - 1.5) person(K.dyn, 300, 1660, 430, { f: 1, pal: PHIL, armF: [1.2 + Math.sin(t * 8) * .1 * (t > cu && t < cu + 1.2 ? 1 : 0), .6], lean: .25, seed: 95, alpha: ss(seg(t, cu - 1.5, cu - .9)) });
  K.flush({ ...o, alpha: x.a, run: .15 });
  // cut locks fall and lose their gold
  for (let k = 0; k < 6; k++) { const fl = seg(t, cu + k * .15, cu + 1.4 + k * .15); if (fl > 0) K.dyn.push({ x: 520 + k * 18 + Math.sin(fl * 5 + k) * 20, y: lerp(1590, 1690, fl), ang: fl * 3 + k, len: 60, wid: 14, c: hex('#c08a3a'), type: 0, seed: 1400 + k }); }
  K.flush({ t, cam, grey: cut * .86, reveal: cut > 0 ? 1e6 : -1e6, alpha: x.a });
  // the lamp flame
  K.dyn.push({ x: 960, y: 1150 + Math.sin(t * 9) * 3, ang: -Math.PI / 2, len: 40, wid: 22, c: hex('#ffd070'), type: 2, seed: 1450, hgt: .4 }); K.flush(K.col({ t, cam, alpha: x.a }));
  return { ...GREYW, expo: .85, light: [.6, -.6, .6] };
};
S.mill = (t, x, K) => {
  const a = K.C('mill'), b = K.C('temple2');
  const cam = { x: 594, y: lerp(1260, 1300, seg(t, a, b)), zoom: lerp(1.2, 1.32, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.mill, o);
  // Samson, blinded, pushes the beam round the millstone
  const ang = (t - a) * .45, bx = 594 + Math.cos(ang) * 420, by = 1500 + Math.sin(ang) * 110;
  K.dyn.push({ x: (594 + bx) / 2, y: (1270 + by - 220) / 2, ang: Math.atan2(by - 220 - 1270, bx - 594), len: Math.hypot(bx - 594, by - 220 - 1270), wid: 26, c: hex('#5a4030'), type: 0, seed: 1500 });
  K.flush({ ...o, alpha: x.a });
  const f = Math.sin(ang) > 0 ? -1 : 1;
  person(K.dyn, bx, by + 140, 430, { f, bare: 1, band: '#d8ccb0', hairLen: .15, lean: .35, armF: [1.4, .2], armB: [1.3, .2], phase: (t - a) * 3, stride: .5, head: .3, pal: SAM, seed: 81 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .8, light: [.4, -.8, .55] };
};
S.temple2 = (t, x, K) => {
  const a = K.C('temple2'), pr = K.T.pray;
  const cam = { x: 594, y: key(t, [[a, 1150], [pr, 1240], [K.C('collapse'), 1280]]), zoom: key(t, [[a, 1.0], [pr, 1.28], [K.C('collapse'), 1.35]]) };
  const o = { t, cam, grey: 1, reveal: pr, revDur: .35, appear: x.appear };
  K.plate(K.PL.temple, { ...o, revC: [594, 1400, 600] }); crowdGallery(K, t, o);
  const grow = ss(seg(t, a + .3, a + 3.5)), push = ss(seg(t, K.L('l07') + 3.6, K.L('l07') + 4.6));
  samsonPillars(K, t, o, { push, hairLen: lerp(.15, .9, grow) });
  if (t < pr) hairOnly(K, 594, 1720, 470, lerp(.15, .9, grow), -.05 + push * .05, { t, cam, grey: 0, alpha: grow });
  const g = eo(seg(t, pr, pr + 2.5));
  rays(K.dyn, { x: 594, y: -200, ang: Math.PI / 2, n: 11, spread: .5, len: 1900, wid: 130, alpha: .22 * g, grow: .3 + .7 * g, seed: 1600 }); K.flush({ t, cam, grey: 0, run: .6 });
  const rk = Math.sin(Math.PI * seg(t, pr - .2, pr + 4));
  const post = lerpPost(GREYW, WARM, ss(seg(t, pr, pr + 3)));
  return { ...post, light: [-.3, -.7, lerp(.6, .17, rk)], norm: 3.2 + rk * 2.4 };
};
S.collapse = (t, x, K) => {
  const fa = K.T.fall, fall = ss(seg(t, fa, fa + 2.2)), sh = t > fa ? Math.exp(-(t - fa) * 1.5) : 0;
  const cam = { x: 594 + Math.sin(t * 40) * 14 * sh, y: lerp(1280, 1150, ss(seg(t, fa, fa + 2.5))) + Math.cos(t * 37) * 10 * sh, zoom: lerp(1.35, 1.0, ss(seg(t, fa, fa + 2.5))), rot: Math.sin(t * 23) * .02 * sh };
  const o = K.col({ t, cam });
  K.plate(K.PL.temple, o); crowdGallery(K, t, o, fall);
  samsonPillars(K, t, o, { push: 1, fall, hairLen: .9 });
  // roof beams and dust
  for (let i = 0; i < 9; i++) { const fl = seg(t, fa + i * .08, fa + 1.8 + i * .08); if (fl > 0) K.dyn.push({ x: 100 + i * 120 + (hash(i) - .5) * 80, y: lerp(280, 1700, fl * fl), ang: fl * (hash(i * 2) - .5) * 4, len: 260, wid: 50, c: hex('#9a7a5a'), type: 0, seed: 1700 + i }); }
  K.flush({ ...o, run: .2 });
  if (t > fa) { for (let i = 0; i < 30; i++) { const r = hash(i * 1.3), age = clamp((t - fa - r * .8) / 2.5); if (age > 0) K.dyn.push({ x: 594 + (hash(i * 7) - .5) * 1200 * (.4 + age), y: 1700 - age * 500 * hash(i * 3), ang: 0, len: 200 + age * 300, wid: 160 + age * 240, c: hex('#c8b090'), type: 2, seed: 1750 + i, alpha: (1 - age) * .6, hgt: .3 }); } K.flush(K.col({ t, cam })); }
  return { ...WARM, expo: 1 + sh * .3, light: [-.3, -.7, .5] };
};
S.close = (t, x, K) => {
  const a = K.C('close');
  const cam = { x: 594, y: lerp(1150, 1200, seg(t, a, a + 8)), zoom: lerp(1.0, 1.12, ss(seg(t, a, a + 8))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.temple, o);
  column(K.dyn, COLS[0][0], COLS[0][1], CW, CH, { fall: 1, dir: -1, seed: 1200 }); column(K.dyn, COLS[1][0], COLS[1][1], CW, CH, { fall: 1, dir: 1, seed: 1240 }); K.flush({ ...o, alpha: x.a, run: .2 });
  rays(K.dyn, { x: 594, y: -200, ang: Math.PI / 2, n: 11, spread: .5, len: 1900, wid: 130, alpha: .24, seed: 1600 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  motes(K.dyn, t, { x0: 100, x1: 1100, y0: 300, y1: 1800, n: 60, rise: 20, size: 10, col: [.95, .85, .65], alpha: .45, seed: 33 }); K.flush({ t, cam, grey: 0, alpha: x.a });
  return { ...WARM, light: [-.3, -.7, .6] };
};
