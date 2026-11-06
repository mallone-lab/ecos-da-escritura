// A TORRE DE BABEL — plates and shots (1080x1920)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'ELES QUERIAM<br><b>CHEGAR AO CÉU</b>';
export const COVER = 'Uma torre <b>até o céu</b><small>e o que Deus fez</small>';
export const COVER_T = 40.5;
export const BOOK = 'Gênesis 11:1–9';
export const REFS = [['l02', 'l02', 'Gênesis 11:1'], ['l03', 'l03', 'Gênesis 11:4'], ['l05', 'l05', 'Gênesis 11:5–7'], ['l06', 'l06', 'Gênesis 11:8'], ['l07', 'l07', 'Gênesis 11:9']];
export const QUOTES = [];
const PW = 1188, PH = 2112, GY = 1650;
const PAL = ['#6e5a42', '#7a6248', '#5a6070', '#7a5a4a', '#8a7a5a'];

function buildPlain() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, GY - 200], [0, GY - 200]]), lin(0, 0, 0, GY - 200, [[0, '#3a5a8a'], [.5, '#a8a8b0'], [1, '#f0c890']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  for (let i = 0; i < 6; i++) R.fill(E(hash(i * 3.1) * PW, 150 + hash(i * 7.3) * 700, 260, 50), lin(0, 0, 0, 900, [[0, '#8a8ca8'], [1, '#e8c0a0']]), { dir: -3, group: 'sky', maxR: 30 });
  R.fill(c => { c.moveTo(0, GY - 220); for (let x = 0; x <= PW; x += 40) c.lineTo(x, GY - 230 - Math.sin(x / 200) * 20); c.lineTo(PW, PH); c.lineTo(0, PH); c.closePath(); }, lin(0, GY - 240, 0, PH, [[0, '#c8a878'], [.4, '#a8885a'], [1, '#5a4430']]), { dir: 0, fallback: 0, group: 'ground', maxR: 30 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 801, rev: (x, y) => y / 1100 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { plain: buildPlain };

// the tower: tiers of brick strokes, narrowing as it climbs; a ramp spirals round it. h = number of tiers (fractional grows the top tier)
function tower(K, x, y, h, { scale = 1, gold = 0, crack = 0, t = 0 } = {}) {
  const d = K.dyn, bh = 120 * scale, w0 = 760 * scale, brick = hex('#a87a52');
  for (let k = 0; k < Math.ceil(h); k++) {
    const part = Math.min(1, h - k), w = w0 * (1 - k * .075), yb = y - k * bh, rows = 4;
    for (let r = 0; r < rows; r++) { if (r / rows > part) break; const yy = yb - (r + .5) * bh / rows, n = Math.max(3, Math.round(w / (70 * scale)));
      for (let i = 0; i < n; i++) { const u = (i + (r % 2) * .5) / n - .5; if (Math.abs(u) > .5) continue; const c = shade(brick, (.75 + .35 * (u + .5)) * (1 - k * .02));
        d.push({ x: x + u * w + (crack ? (hash(k * 9 + i) - .5) * crack * 30 : 0), y: yy, ang: crack * (hash(k + i * 3) - .5) * .3, len: w / n * 1.05, wid: bh / rows * 1.1, c, c2: shade(c, .85), type: 0, seed: 4000 + k * 97 + r * 13 + i }); } }
    d.push({ x, y: yb - bh * part + 4, ang: 0, len: w * 1.04, wid: 10 * scale, c: hex('#5a3e28'), type: 0, seed: 4900 + k });
    if (part > .5) for (let i = 0; i < 3; i++) d.push({ x: x - w * .5 + w * (i + .5) / 3, y: yb - bh * .45, ang: 0, len: 22 * scale, wid: 34 * scale, c: hex('#2a1c14'), type: 2, seed: 4950 + k * 3 + i });
  }
  // the gilded top: pride in gold
  if (gold > 0) { const k = Math.ceil(h) - 1, w = w0 * (1 - k * .075) * .5, yy = y - h * bh - 30 * scale; d.push({ x, y: yy, ang: 0, len: w, wid: 60 * scale, c: hex('#f2c24a'), c2: hex('#c8902a'), type: 0, seed: 4990, hgt: 1.3, alpha: gold }); d.push({ x, y: yy, ang: 0, len: w * 3, wid: 260 * scale, c: hex('#ffd070'), type: 2, seed: 4991, alpha: .14 * gold, hgt: 0 }); }
}
function workers(K, t, n, x0, x1, y0, y1, H, seed, o = {}) {
  for (let i = 0; i < n; i++) { const r = hash(i * 3.3 + seed), u = ((r + t * .03 * (i % 2 ? 1 : -1)) % 1 + 1) % 1, y = lerp(y0, y1, hash(i * 7.7 + seed));
    person(K.dyn, lerp(x0, x1, u), y, H * lerp(.6, 1, (y - y0) / Math.max(1, y1 - y0)), { f: i % 2 ? 1 : -1, phase: t * 4 + i, stride: o.walk ?? .7, armF: o.arms ? [2.3 + Math.sin(t * 3 + i) * .2, .2] : [1.0, 1.2], pal: { robe: PAL[i % 5], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: seed + i * 7 }); }
}
// confusion: little scribbles of unknown letters over the heads
function babble(K, t, pts) { for (const [x, y, s] of pts) for (let k = 0; k < 4; k++) { const a = hash(s + k) * 6.28 + t * 2; K.dyn.push({ x: x + Math.cos(a) * 30, y: y - 40 - k * 16 + Math.sin(t * 3 + k) * 6, ang: a, len: 26, wid: 4, c: [.95, .92, .85], type: 3, seed: s * 10 + k, alpha: .9 }); } }

export const S = {};
S.hook = (t, x, K) => {
  const cam = { x: 594, y: key(t, [[0, 1200], [K.C('plain'), 1000]]), zoom: key(t, [[0, 1.1], [K.C('plain'), 1.02]]) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.plain, o);
  tower(K, 594, GY - 200, 10.5, { scale: .9, t }); K.flush({ ...o, run: .15 });
  tower(K, 594, GY - 200, 10.5, { scale: .9, gold: 1 }); K.dyn.clear(); { const k = 10, w = 760 * .9 * (1 - k * .075) * .5, yy = GY - 200 - 10.5 * 108 - 27; K.dyn.push({ x: 594, y: yy, ang: 0, len: w, wid: 54, c: hex('#f2c24a'), c2: hex('#c8902a'), type: 0, seed: 4990, hgt: 1.3 }); K.dyn.push({ x: 594, y: yy, ang: 0, len: w * 3, wid: 240, c: hex('#ffd070'), type: 2, seed: 4991, alpha: .16, hgt: 0 }); }
  K.flush(K.col({ t, cam, run: .2 }));
  workers(K, t, 10, 100, 1100, GY - 120, GY + 60, 150, 4100, { walk: .6 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .9 * ss(seg(t, 0, .8)) };
};
S.plain = (t, x, K) => {
  const a = K.C('plain'), b = K.C('plan');
  const cam = { x: 594, y: lerp(1400, 1440, seg(t, a, b)), zoom: lerp(1.3, 1.42, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  workers(K, t, 14, 150, 1050, GY - 80, GY + 140, 300, 4200, { walk: .3 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.plan = (t, x, K) => {
  const a = K.C('plan'), b = K.C('rise');
  const cam = { x: 594, y: lerp(1420, 1380, seg(t, a, b)), zoom: lerp(1.35, 1.25, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  tower(K, 594, GY - 160, lerp(.3, 1.5, seg(t, a, b)), { scale: 1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  [[300, 1760, 1], [480, 1790, 1], [760, 1780, -1], [900, 1750, -1]].forEach(([px, py, f], i) => person(K.dyn, px, py, 380, { f, armF: [i % 2 ? 2.6 : 1.2, .2], head: -.4, pal: { robe: PAL[i], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 4300 + i * 7 }));
  K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.rise = (t, x, K) => {
  const a = K.C('rise'), b = K.C('descend'), k = seg(t, a, b);
  const cam = { x: 594, y: lerp(1300, 990, eio(k)), zoom: lerp(1.15, 1.0, k) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  const h = lerp(2, 10.5, k);
  tower(K, 594, GY - 200, h, { scale: .9 }); K.flush({ ...o, alpha: x.a, run: .15 });
  workers(K, t, 10, 150, 1050, GY - 120, GY + 40, 150, 4400, { walk: .6 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.descend = (t, x, K) => {
  const a = K.C('descend'), dn = K.T.down;
  const cam = { x: 594, y: key(t, [[a, 990], [dn + 1.5, 1000]]), zoom: key(t, [[a, 1.0], [K.C('scatter'), 1.06]]) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.plain, o);
  const g = eo(seg(t, dn - .6, dn + 1.2));
  rays(K.dyn, { x: 594, y: -300, ang: Math.PI / 2, n: 13, spread: .45, len: 1800 * g, wid: 140, alpha: .3 * g, seed: 4500 }); K.flush(K.col({ t, cam, run: .6 }));
  tower(K, 594, GY - 200, 10.5, { scale: .9, crack: ss(seg(t, K.T.confuse - .3, K.T.confuse + .6)) * .6 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .96 + .15 * g };
};
S.scatter = (t, x, K) => {
  const a = K.C('scatter'), b = K.C('ruin');
  const cam = { x: 594, y: lerp(1350, 1300, seg(t, a, b)), zoom: lerp(1.3, 1.1, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  tower(K, 594, GY - 200, 10.5, { scale: .9, crack: .6 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const u = seg(t, a, b), pts = [];
  for (let i = 0; i < 12; i++) { const ang = (i / 12) * Math.PI * 2, r = lerp(80, 620, ss(u)) * (.7 + hash(i) * .5), px = 594 + Math.cos(ang) * r, py = 1700 + Math.sin(ang) * r * .25;
    person(K.dyn, px, py, 300, { f: Math.cos(ang) > 0 ? 1 : -1, phase: (t - a) * 5 + i, stride: u > .05 ? 1 : 0, armF: [lerp(1.5, .3, u) + Math.sin(t * 6 + i) * .4, .3], pal: { robe: PAL[i % 5], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, seed: 4600 + i * 7 }); pts.push([px, py - 300, 4700 + i]); }
  K.flush({ ...o, alpha: x.a, run: .15 });
  babble(K, t, pts); K.flush({ ...o, alpha: x.a * (1 - ss(seg(t, b - 1, b))) });
  return { ...GREYW };
};
S.ruin = (t, x, K) => {
  const a = K.C('ruin');
  const cam = { x: 594, y: lerp(1000, 1100, seg(t, a, K.C('close'))), zoom: 1.04 };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.plain, o);
  tower(K, 594, GY - 200, 7.3, { scale: .9, crack: 1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .7, light: [.8, -.3, .4], vig: .55 };
};
S.close = (t, x, K) => {
  const a = K.C('close'), gr = K.T.grace;
  const cam = { x: 594, y: lerp(1350, 1300, seg(t, a, a + 8)), zoom: lerp(1.15, 1.3, ss(seg(t, a, a + 8))) };
  const o = { t, cam, grey: 1, reveal: gr, revDur: .35, appear: x.appear };
  K.plate(K.PL.plain, { ...o, revC: [594, 300, 500] });
  tower(K, 594, GY - 200, 7.3, { scale: .9, crack: 1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const g = eo(seg(t, gr - .3, gr + 2.2));
  rays(K.dyn, { x: 594, y: -200, ang: Math.PI / 2, n: 11, spread: .4, len: 1900 * (.3 + .7 * g), wid: 130, alpha: .26 * g, seed: 4800 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  person(K.dyn, 594, 1740, 380, { f: 1, kneel: 1, head: -.45, armF: [lerp(.8, 2.6, g), .2], armB: [lerp(.6, 2.4, g), .3], pal: { robe: PAL[2], mantle: '#8a6a3a', skin: '#a07050', hair: '#2a2220' }, seed: 4850 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const post = lerpPost(GREYW, WARM, ss(seg(t, gr, gr + 3)));
  return { ...post };
};
