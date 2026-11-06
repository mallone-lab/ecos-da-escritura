// NOÉ E A ARCA — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes, sea, rain, bolt } from '../../scenes/actors.js';
import { lion, pig } from '../../scenes/actors2.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'TODOS ZOMBARAM.<br><b>ATÉ A CHUVA CAIR.</b>';
export const COVER = 'Todos <b>zombaram</b><small>até a primeira gota cair</small>';
export const COVER_T = 41.0;
export const BOOK = 'Gênesis 6 – 9';
export const REFS = [['l02', 'l02', 'Gênesis 6:9–11'], ['l03', 'l03', 'Gênesis 6:14'], ['l04', 'l04', 'Gênesis 6:22'], ['l05', 'l05', 'Gênesis 7:15–16'], ['l06', 'l06', 'Gênesis 7:12, 19'], ['l07', 'l07', 'Gênesis 9:13']];
export const QUOTES = [];
const PW = 1188, PH = 2112;
const NOAH = { robe: '#6a5a46', mantle: '#8a3a2a', skin: '#a87a58', hair: '#e0d8c8' };
const MOCK = ['#5a4a5a', '#6a5a42', '#4a5a6a', '#7a5a4a'];

// the ark: a long hull with planks, a house on the deck, a door. built 0..1 shows ribs first, then planks
function ark(K, x, y, S, { roll = 0, built = 1, door = 1 } = {}) {
  const d = K.dyn, rot = (lx, ly) => [x + lx * Math.cos(roll) - ly * Math.sin(roll), y + lx * Math.sin(roll) + ly * Math.cos(roll)];
  const wood = hex('#7a5232'), dk = hex('#3e2816');
  for (let i = 0; i < 11; i++) { const u = (i / 10 - .5), [px, py] = rot(u * S * .9, -S * .14); d.push({ x: px, y: py, ang: Math.PI / 2 + roll, len: S * .28, wid: S * .028, c: dk, type: 0, seed: 3000 + i }); }
  for (let r = 0; r < 6; r++) for (let k = 0; k < 8; k++) {
    const idx = r * 8 + k; if (idx / 48 > built) continue;
    const u = (k + .5) / 8 - .5, wr = .7 + r * .055, lx = u * S * wr, ly = -r * S * .045 - Math.pow(Math.abs(u) * 2, 3) * S * .04 * (1 + r * .4);
    const [px, py] = rot(lx, ly); d.push({ x: px, y: py, ang: roll, len: S * .13, wid: S * .05, c: r % 2 ? wood : shade(wood, .85), c2: dk, type: 0, seed: 3020 + idx });
  }
  if (built > .95) {
    const [hx, hy] = rot(0, -S * .34); d.push({ x: hx, y: hy, ang: roll, len: S * .5, wid: S * .14, c: shade(wood, 1.15), c2: wood, type: 0, seed: 3100 });
    const [rx, ry] = rot(0, -S * .43); d.push({ x: rx, y: ry, ang: roll, len: S * .58, wid: S * .05, c: dk, type: 0, seed: 3101 });
    const [dx, dy] = rot(-S * .02, -S * .16 - S * .05 * door); d.push({ x: dx, y: dy, ang: roll, len: S * .08, wid: S * .12 * (1 - door * .0) , c: door > .5 ? shade(wood, .7) : hex('#120c08'), type: 0, seed: 3102 });
  }
}
function buildSky(top, mid, low, seed) {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 1200], [0, 1200]]), lin(0, 0, 0, 1200, [[0, top], [.6, mid], [1, low]]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  return R;
}
function buildPlain() {
  const R = buildSky('#4a5a7a', '#a8a0a0', '#d8c098');
  R.fill(c => { c.moveTo(0, 1180); for (let x = 0; x <= PW; x += 40) c.lineTo(x, 1150 - Math.sin(x / 210) * 40); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, 1100, 0, PH, [[0, '#a8946a'], [.5, '#7a6a4a'], [1, '#3a3020']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  R.fill(P([[0, 1150], [260, 1110], [260, 1180], [0, 1200]]), '#6a6070', { dir: 90, group: 'city', maxR: 8 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 701 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildStormSky() {
  const R = buildSky('#141a24', '#2e3a46', '#56646a');
  for (let i = 0; i < 8; i++) R.fill(E(hash(i * 3.1) * PW, 120 + hash(i * 7.3) * 600, 300, 90), '#1c222c', { dir: -6, group: 'sky', maxR: 30 });
  R.fill(P([[0, 1150], [PW, 1150], [PW, PH], [0, PH]]), lin(0, 1150, 0, PH, [[0, '#3a4a50'], [1, '#121c22']]), { dir: 0, group: 'sea', maxR: 24 });
  const st = paintRef(R, { R: [22, 11, 5.5], T: 14, seed: 702 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildMountain() {
  const R = buildSky('#5a7ab4', '#c8b8c0', '#f4d8a8');
  R.fill(c => { c.moveTo(-50, PH); c.lineTo(-50, 1500); c.bezierCurveTo(200, 1380, 420, 1250, 594, 1240); c.bezierCurveTo(780, 1250, 1000, 1380, PW + 50, 1480); c.lineTo(PW + 50, PH); c.closePath(); }, lin(0, 1240, 0, PH, [[0, '#8a9a6a'], [.4, '#6a6a48'], [1, '#3a3426']]), { dir: 5, fallback: 5, group: 'mount', maxR: 30 });
  R.fill(P([[0, 1200], [PW, 1200], [PW, 1300], [0, 1300]]), lin(0, 1200, 0, 1300, [[0, '#8aa8b8'], [1, '#6a8a9a']]), { dir: 0, group: 'water', maxR: 12 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 703, rev: (x, y) => Math.hypot(x - 594, y - 900) / 700 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { plain: buildPlain, storm: buildStormSky, mount: buildMountain };

export const S = {};
S.mock = (t, x, K) => {
  const cam = { x: 594, y: lerp(1250, 1300, seg(t, 0, K.C('walk'))), zoom: lerp(1.15, 1.28, ss(seg(t, 0, K.C('walk')))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  ark(K, 640, 1440, 900, { built: 1 }); K.flush({ ...o, run: .15 });
  person(K.dyn, 760, 1300, 260, { f: -1, pal: NOAH, armF: [.4, .2], head: -.3, seed: 31 }); K.flush({ ...o, run: .15 });
  [[200, 1640, 1], [330, 1680, 1], [900, 1660, -1], [1020, 1700, -1]].forEach(([px, py, f], i) => person(K.dyn, px, py, 400, { f, pal: { robe: MOCK[i], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, armF: [1.5 + Math.sin(t * 4 + i) * .15, .1], armB: [.4 + Math.abs(Math.sin(t * 5 + i)) * .4, 1.2], lean: -.1 + Math.sin(t * 5 + i) * .05, head: -.2, seed: 40 + i * 5 }));
  K.flush({ ...o, run: .15 });
  // the first drop
  const dp = seg(t, K.T.drop - .6, K.T.drop); if (dp > 0 && dp < 1) { K.dyn.push({ x: 594, y: lerp(300, 1500, dp), ang: Math.PI / 2, len: 40, wid: 10, c: [.85, .9, .95], type: 3, seed: 3200 }); K.flush(K.grey({ t, cam })); }
  return { ...GREYW, expo: .88 * ss(seg(t, 0, .8)) };
};
S.walk = (t, x, K) => {
  const a = K.C('walk'), b = K.C('build');
  const cam = { x: lerp(560, 620, seg(t, a, b)), y: 1300, zoom: lerp(1.2, 1.3, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  rays(K.dyn, { x: 900, y: -100, ang: 1.9, n: 9, spread: .4, len: 1800, wid: 110, alpha: .2, seed: 3300 }); K.flush(K.col({ t, cam, alpha: x.a, run: .6 }));
  person(K.dyn, 560, 1620, 460, { f: 1, pal: NOAH, phase: (t - a) * 4, stride: .6, head: -.35, armF: [.5, .3], seed: 31 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.build = (t, x, K) => {
  const a = K.C('build'), b = K.C('animals');
  const cam = { x: 594, y: lerp(1300, 1250, seg(t, a, b)), zoom: lerp(1.3, 1.1, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  ark(K, 594, 1520, 1000, { built: lerp(.15, .99, seg(t, a, b)) }); K.flush({ ...o, alpha: x.a, run: .15 });
  const ham = Math.abs(Math.sin((t - a) * Math.PI / .9));
  person(K.dyn, 300, 1640, 420, { f: 1, pal: NOAH, armF: [lerp(1.0, 2.4, ham), .4], lean: .1, seed: 31 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.animals = (t, x, K) => {
  const a = K.C('animals'), b = K.C('flood'), dr = K.T.door;
  const cam = { x: 594, y: lerp(1300, 1260, seg(t, a, b)), zoom: lerp(1.12, 1.22, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  ark(K, 594, 1460, 1000, { built: 1, door: 1 - ss(seg(t, dr, dr + 1.2)) }); K.flush({ ...o, alpha: x.a, run: .15 });
  // ramp + animals two by two, walking up into the door
  K.dyn.push({ x: 720, y: 1560, ang: -.5, len: 420, wid: 40, c: hex('#6a4a2e'), type: 0, seed: 3400 }); K.flush({ ...o, alpha: x.a });
  const pairs = [['lion', '#c08a48'], ['pig', '#e8e0d0'], ['pig', '#c89a8a'], ['lion', '#b07a40']];
  pairs.forEach(([kind, c], i) => {
    const u = clamp((t - a) * .16 - i * .22 + .1, 0, 1), px = lerp(1000, 610, u), py = lerp(1780, 1400, u), sc = lerp(1.35, .7, u);
    if (u >= 1 || t > dr) return;
    for (const k of [0, 1]) { const ox = k * 120 * sc, oy = k * 30 * sc; if (kind === 'lion') lion(K.dyn, px + ox, py + oy, 230 * sc, { f: -1, fur: c, phase: t * 4 + k, stride: .6, seed: 3500 + i * 20 + k }); else pig(K.dyn, px + ox, py + oy, 200 * sc, { f: -1, skin: c, phase: t * 5 + k, seed: 3600 + i * 20 + k }); }
  });
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: lerp(.96, .8, ss(seg(t, dr, dr + 1.5))) };
};
S.flood = (t, x, K) => {
  const a = K.C('flood');
  const cam = { x: 594 + Math.sin(t * .9) * 20, y: 1150, zoom: 1.08, rot: Math.sin(t * .8) * .02 };
  const o = K.grey({ t, cam });
  K.plate(K.PL.storm, o);
  if ((t - a) % 3 < .3) { bolt(K.dyn, 300 + ((t - a) / 3 | 0) * 300, 0, 1000, 70 + ((t - a) / 3 | 0), 1 - ((t - a) % 3) / .3); K.flush(K.col({ t, cam, run: 0 })); }
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: 1150, by: 1300, rows: 6, amp: 1.2, seed: 3700 }); K.flush({ ...o, run: .3 });
  ark(K, 594, 1290 + Math.sin(t * 1.4) * 20, 820, { roll: Math.sin(t * 1.1) * .08 }); K.flush({ ...o, run: .2 });
  sea(K.dyn, t, { x0: -100, x1: 1300, hy: 1310, by: 2300, rows: 14, amp: 1.3, seed: 3710 }); K.flush({ ...o, run: .3 });
  rain(K.dyn, t, { W: 1080, H: 1920, n: 320, alpha: .5, seed: 9 }); K.flush(K.grey({ t, hgt: .4 }));
  return { ...GREYW, expo: .78 + ((t - a) % 3 < .25 ? .4 : 0) };
};
const mountain = (t, x, K, close) => {
  const a = K.C(close ? 'close' : 'bow'), bw = K.T.bow;
  const cam = close ? { x: 594, y: lerp(1150, 1250, ss(seg(t, a, a + 8))), zoom: lerp(1.05, 1.2, ss(seg(t, a, a + 8))) } : { x: 594, y: key(t, [[a, 1250], [bw + 2, 1000]]), zoom: key(t, [[a, 1.25], [bw + 2.5, 1.0]]) };
  const o = close ? K.col({ t, cam, appear: x.appear }) : { t, cam, grey: 1, reveal: bw, revDur: .35 };
  K.plate(K.PL.mount, close ? o : { ...o, revC: [594, 900, 600] });
  // the rainbow: laid band by band in colour
  const g = close ? 1 : eo(seg(t, bw, bw + 2.5));
  const cols = ['#d84a3a', '#f08a3a', '#f4d050', '#6ab45a', '#3a8ad0', '#6a4ab0'];
  cols.forEach((c, i) => { const r = 720 - i * 34; for (let k = 0; k < 26; k++) { const u = k / 25, an = Math.PI * (1 + u); if (u > g) continue; K.dyn.push({ x: 594 + Math.cos(an) * r, y: 1180 + Math.sin(an) * r, ang: an + Math.PI / 2, len: r * Math.PI / 25 * 1.3, wid: 32, c: hex(c), type: 1, seed: 3800 + i * 30 + k, alpha: .8, hgt: .6 }); } });
  K.flush({ t, cam, grey: 0, alpha: x.a, run: .4 });
  ark(K, 594, 1330, 640, { roll: -.04 }); K.flush({ ...o, alpha: x.a, run: .15 });
  person(K.dyn, 760, 1430, 300, { f: -1, pal: NOAH, head: -.5, armF: [2.4, .2], armB: [2.2, .2], kneel: close ? 1 : 0, seed: 31 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const post = close ? WARM : lerpPost(GREYW, WARM, ss(seg(t, bw, bw + 3)));
  return { ...post };
};
S.bow = (t, x, K) => mountain(t, x, K, false);
S.close = (t, x, K) => mountain(t, x, K, true);
