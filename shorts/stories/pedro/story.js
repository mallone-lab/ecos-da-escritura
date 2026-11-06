// PEDRO ANDA SOBRE AS ÁGUAS — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes, sea, ship, rain } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'ELE ANDOU<br><b>SOBRE A ÁGUA</b>';
export const COVER = 'Andou sobre <b>a água</b><small>até olhar para o vento</small>';
export const COVER_T = 44.5;
export const BOOK = 'Mateus 14:22–33';
export const REFS = [['l02', 'l02', 'Mateus 14:22'], ['l03', 'l03', 'Mateus 14:25–26'], ['l04', 'l04', 'Mateus 14:27'], ['l05', 'l05', 'Mateus 14:28–29'], ['l06', 'l06', 'Mateus 14:29–30'], ['l07', 'l07', 'Mateus 14:30–31']];
export const QUOTES = ['l04'];
const PW = 1188, PH = 2112, HZ = 760;
const JESUS = { robe: '#efe8d8', mantle: '#a83a3a', skin: '#b07a58', hair: '#3a2a20' };
const PEDRO = { robe: '#5a6a7a', mantle: '#7a5a3a', skin: '#a87a58', hair: '#4a3a2a' };

function buildLake() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, HZ + 30], [0, HZ + 30]]), lin(0, 0, 0, HZ, [[0, '#0e141e'], [.6, '#2a3444'], [1, '#5a6470']]), { dir: -6, fallback: -6, group: 'sky', maxR: 44 });
  for (let i = 0; i < 7; i++) R.fill(E(hash(i * 3.1) * PW, 100 + hash(i * 7.3) * 500, 280, 70), '#1a2230', { dir: -6, group: 'sky', maxR: 30 });
  R.fill(P([[0, HZ], [PW, HZ], [PW, PH], [0, PH]]), lin(0, HZ, 0, PH, [[0, '#3a4a54'], [1, '#0e1a20']]), { dir: 0, group: 'lake', maxR: 24 });
  const st = paintRef(R, { R: [22, 11, 5.5], T: 14, seed: 1001, rev: (x, y) => Math.hypot(x - 594, (y - 1300) * 1.2) / 600 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildHill() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 900], [0, 900]]), lin(0, 0, 0, 900, [[0, '#3a4a7a'], [.6, '#c8909a'], [1, '#f0c090']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  R.fill(P([[0, 880], [PW, 880], [PW, 1100], [0, 1100]]), lin(0, 880, 0, 1100, [[0, '#8a9aaa'], [1, '#4a6a7a']]), { dir: 0, group: 'lake', maxR: 16 });
  R.fill(c => { c.moveTo(0, 1100); c.bezierCurveTo(300, 1050, 800, 1150, PW, 1080); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1080, 0, PH, [[0, '#8a9a5a'], [.5, '#6a7a3a'], [1, '#3a4422']]), { dir: 0, fallback: 0, group: 'hill', maxR: 30 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1002 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { lake: buildLake, hill: buildHill };

function glow(K, x, y, H, a, cam) { rays(K.dyn, { x: x + 60, y: y - H * 3, ang: Math.PI / 2 + .02, n: 7, spread: .16, len: H * 3.4, wid: H * .32, alpha: .2 * a, col: '#ffe6b0', seed: 6000 }); K.flush({ t: 0, cam, grey: 0, run: .6 }); }
function jesus(K, x, y, H, o, arm = 0) { person(K.dyn, x, y, H, { f: -1, pal: JESUS, armF: [lerp(.3, 1.5, arm), .1], armB: [lerp(.2, 1.2, arm), .2], seed: 61 }); K.flush({ ...o, grey: 0, run: .15 }); }
function boat(K, t, x, y, S, amp, o) {
  const roll = Math.sin(t * 1.3) * .1 * amp, bob = Math.sin(t * 1.6) * 16 * amp;
  const sh = ship(K.dyn, x, y + bob, S, { roll, sail: 0, seed: 6100 });
  [[-.55, 1], [-.2, 1], [.15, -1], [.45, -1]].forEach(([u, f], i) => { const [px, py] = sh.deck(u); person(K.dyn, px, py, S * .22, { f, armF: [2.3 + Math.sin(t * 4 + i) * .2, .2], pal: { robe: ['#6a5a42', '#5a6070', '#7a5a4a', '#8a7a5a'][i], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 6200 + i * 7 }); });
  K.flush({ ...o, run: .2 }); return sh;
}
export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: 594, y: lerp(1250, 1300, seg(t, 0, K.C('hill'))), zoom: lerp(1.1, 1.2, ss(seg(t, 0, K.C('hill')))) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.lake, o);
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: HZ, by: 2300, rows: 22, amp: .8, seed: 6300 }); K.flush({ ...o, run: .3 });
  glow(K, 850, 1500, 380, 1, cam); jesus(K, 850, 1500, 380, { t, cam }, .6);
  person(K.dyn, 380, 1640, 440, { f: 1, pal: PEDRO, armF: [1.2, .2], armB: [.8, .4], lean: .1, seed: 62 }); K.flush({ ...o, run: .15 });
  rain(K.dyn, t, { W: 1080, H: 1920, n: 200, alpha: .35, seed: 4 }); K.flush(K.grey({ t, hgt: .4 }));
  return { ...GREYW, expo: .9 * ss(seg(t, 0, .8)) };
};
S.hill = (t, x, K) => {
  const a = K.C('hill'), b = K.C('storm');
  const cam = { x: 594, y: lerp(1300, 1250, seg(t, a, b)), zoom: lerp(1.2, 1.12, seg(t, a, b)) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.hill, o);
  ship(K.dyn, lerp(700, 400, seg(t, a, b)), 980, 260, { sail: .8, billow: .3, seed: 6400 }); K.flush({ ...o, alpha: x.a, run: .2 });
  for (let i = 0; i < 14; i++) person(K.dyn, 80 + (i % 7) * 160 + (i >= 7 ? 70 : 0), 1550 + (i >= 7 ? 160 : 0), i >= 7 ? 330 : 260, { f: i % 2 ? 1 : -1, kneel: hash(i) > .5 ? 1 : 0, pal: { robe: ['#6a5a42', '#5a6070', '#7a5a4a', '#8a7a5a'][i % 4], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 6500 + i * 7 });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.storm = (t, x, K) => {
  const a = K.C('storm');
  const cam = { x: 594 + Math.sin(t * .9) * 20, y: 1200, zoom: 1.1, rot: Math.sin(t * .8) * .02 };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.lake, o);
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: HZ, by: 1300, rows: 8, amp: 1.2, seed: 6300 }); K.flush({ ...o, alpha: x.a, run: .3 });
  const seeJ = ss(seg(t, K.L('l03') + 2.4, K.L('l03') + 3.4));
  if (seeJ > 0) { glow(K, 300, 1050, 160, seeJ, cam); person(K.dyn, 300, 1050, 160, { f: 1, pal: JESUS, seed: 61, alpha: seeJ }); K.flush({ t, cam, grey: 0, run: .15 }); }
  boat(K, t, 700, 1300, 640, 1, o);
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: 1320, by: 2400, rows: 14, amp: 1.25, seed: 6310 }); K.flush({ ...o, alpha: x.a, run: .3 });
  rain(K.dyn, t, { W: 1080, H: 1920, n: 300, alpha: .5, seed: 5 }); K.flush(K.grey({ t, hgt: .4 }));
  return { ...GREYW, expo: .82 };
};
S.jesus = (t, x, K) => {
  const a = K.C('jesus');
  const cam = { x: 594, y: lerp(1300, 1280, seg(t, a, K.C('come'))), zoom: lerp(1.25, 1.4, ss(seg(t, a, K.C('come')))) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.lake, o);
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: HZ, by: 2400, rows: 22, amp: 1.1, seed: 6300 }); K.flush({ ...o, run: .3 });
  glow(K, 594, 1640, 520, 1, cam); jesus(K, 594, 1640, 520, { t, cam }, ss(seg(t, a + .4, a + 1.2)));
  rain(K.dyn, t, { W: 1080, H: 1920, n: 260, alpha: .4, seed: 6 }); K.flush(K.grey({ t, hgt: .4 }));
  return { ...GREYW, expo: .86 };
};
// Pedro steps out, walks, looks at the wind, sinks; Jesus takes his hand
const walkShot = (t, x, K, mode) => {
  const a = K.C(mode === 'come' ? 'come' : mode === 'walk' ? 'walk' : mode === 'save' ? 'save' : 'close');
  const st = K.T.step, sk = K.T.sink, gb = K.T.grab;
  const calm = mode === 'close' ? 1 : ss(seg(t, gb, gb + 2.5)), amp = lerp(1.15, .15, calm);
  const cam = mode === 'close' ? { x: 594, y: lerp(1300, 1260, seg(t, a, a + 8)), zoom: lerp(1.2, 1.32, ss(seg(t, a, a + 8))) } : { x: 594 + Math.sin(t * .9) * 14 * amp, y: 1300, zoom: mode === 'save' ? lerp(1.35, 1.2, ss(seg(t, gb, gb + 3))) : 1.18, rot: Math.sin(t * .8) * .015 * amp };
  const o = mode === 'save' ? { t, cam, grey: 1, reveal: gb, revDur: .3 } : mode === 'close' ? K.col({ t, cam, appear: x.appear }) : K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.lake, mode === 'save' ? { ...o, revC: [594, 1500, 600] } : o);
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: HZ, by: 1640, rows: 13, amp, seed: 6300 }); K.flush({ ...o, alpha: x.a, run: .3 });
  if (mode === 'come' || mode === 'walk') boat(K, t, 250, 1420, 620, amp, o);
  // Pedro's path: from the boat toward Jesus; when he sinks, the water rises to his chest
  const walkU = mode === 'come' ? 0 : ss(seg(t, st, sk)), sink = mode === 'come' ? 0 : ss(seg(t, sk, sk + 1.6)) * (1 - ss(seg(t, gb, gb + 1.2)));
  const px = lerp(360, 560, walkU), py = lerp(1360, 1600, walkU) + sink * 160;
  const reach = mode === 'save' || mode === 'close' ? ss(seg(t, gb - .6, gb)) : 0;
  const jx = 820, jy = 1640;
  if (mode !== 'come' || true) { const g = mode === 'save' ? 1 : 1; glow(K, jx, jy, 470, g, cam); person(K.dyn, jx, jy, 470, { f: -1, pal: JESUS, armF: [lerp(.6, 1.45, reach), lerp(.2, 0, reach)], armB: [.3, .3], lean: .1 * reach, seed: 61 }); K.flush({ t, cam, grey: 0, run: .15 }); }
  if (mode !== 'come' || t > st - .5) { person(K.dyn, mode === 'come' ? 360 : px, mode === 'come' ? 1360 : py, 430, { f: 1, pal: PEDRO, phase: (t - st) * 4, stride: walkU > 0 && walkU < 1 && !sink ? .8 : 0, armF: [lerp(.4, 2.4, Math.max(sink, reach)), .2], armB: [lerp(.3, 2.0, sink), .3], head: lerp(0, -.4, sink), lean: -.1 * sink, seed: 62 }); K.flush({ ...o, alpha: x.a, run: .15 }); }
  else if (mode === 'come') { person(K.dyn, 360, 1360, 430, { f: 1, pal: PEDRO, armF: [1.4, .2], seed: 62 }); K.flush({ ...o, alpha: x.a, run: .15 }); }
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: 1680, by: 2400, rows: 9, amp, seed: 6310 }); K.flush({ ...o, alpha: x.a, run: .3 });
  if (sink > .02) { for (let i = 0; i < 10; i++) { const c = mixc(hex('#2a3a44'), hex('#7a9494'), hash(i) * .6); K.dyn.push({ x: px + (i - 4.5) * 34, y: py - 430 * .3 + Math.sin(t * 3 + i) * 8 + (i % 2) * 20, ang: Math.sin(t * 2 + i) * .2, len: 90, wid: 40, c, c2: shade(c, .85), type: 0, seed: 6700 + i, alpha: sink }); } K.flush({ ...o, alpha: x.a, run: .2 }); }
  if (amp > .4) { rain(K.dyn, t, { W: 1080, H: 1920, n: 260, alpha: .45 * (1 - calm), seed: 7 }); K.flush(K.grey({ t, hgt: .4 })); }
  const post = mode === 'save' ? lerpPost(GREYW, WARM, ss(seg(t, gb, gb + 3))) : mode === 'close' ? WARM : GREYW;
  return { ...post, expo: post.expo * (mode === 'save' || mode === 'close' ? 1 : .86) };
};
S.come = (t, x, K) => walkShot(t, x, K, 'come');
S.walk = (t, x, K) => walkShot(t, x, K, 'walk');
S.save = (t, x, K) => walkShot(t, x, K, 'save');
S.close = (t, x, K) => walkShot(t, x, K, 'close');
