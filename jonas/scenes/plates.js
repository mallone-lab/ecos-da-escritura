// Painted plates: each set is first drawn as a flat, value-planned illustration (Ref), then converted to knife strokes.
// Every plate is drawn in full colour; the film shows the first half through grey (grey: ~.85) and re-lays colour later.
import { Ref, paintRef, rnd } from '../engine/plate.js';
import { KNIFE, BRUSH, DAB } from '../engine/impasto.js';
import { P, E, lin, rad, lerp, hash } from './common.js';

export const SW = 2112, SH = 1188;

const cloudBank = (R, x, y, w, h, col, und, g = 'sky', maxR = 30) => R.fill(c => { c.ellipse(x, y, w, h, 0, 0, 7); c.ellipse(x - w * .55, y + h * .25, w * .6, h * .7, 0, 0, 7); c.ellipse(x + w * .6, y + h * .3, w * .55, h * .6, 0, 0, 7); }, lin(0, y - h, 0, y + h, [[0, col], [.65, col], [1, und]]), { dir: -3, fallback: -3, group: g, maxR, detail: 1.6, aj: .3 });
const reflect = (st, x, yTop, len, w, col, a0 = .8, rev = 0) => {          // knife-dab reflection stacks
  const n = Math.round(len / 10);
  for (let i = 0; i < n; i++) { const f = i / n; if (rnd() < f * .4) continue; const c = col.map(v => v * (1 - f * .35));
    st.push({ x: x + (rnd() - .5) * w * .5, y: yTop + f * len, ang: (rnd() - .5) * .1, len: w * (1 - f * .5) * (.55 + rnd() * .6), wid: 7 + rnd() * 5, c, c2: c.map(v => v * .85), type: KNIFE, hgt: .7, alpha: a0 * (1 - f * .7), seed: rnd() * 999, rev, skew: rnd() - .5 }); }
};

// ================= inside the fish =================
export const BELLY = { w: SW, h: SH, jonas: [1056, 905], vp: [1056, 560] };
export function buildBelly() {
  const R = new Ref(SW, SH, .5);
  R.fill(P([[0, 0], [SW, 0], [SW, SH], [0, SH]]), rad(1056, 620, 40, 1150, [[0, '#8a4636'], [.35, '#5a2420'], [.75, '#2a0c10'], [1, '#14060a']]), { dir: { radial: [1056, 600] , off: 90 }, group: 'bg', maxR: 50, detail: 1.8 });
  // ribs: far (small) to near (large), arches over a vanishing point
  const [vx, vy] = BELLY.vp;
  for (let i = 0; i < 7; i++) {
    const d = 1 - i / 6, s = lerp(1.18, .28, d), floor = lerp(1250, 700, d);
    const rx = 1060 * s, ry = 760 * s, wdt = 95 * s + 8;
    const path = c => { c.moveTo(vx - rx, floor); c.lineTo(vx - rx, vy + 20 * s); c.ellipse(vx, vy + 20 * s, rx, ry, 0, Math.PI, 2 * Math.PI); c.lineTo(vx + rx, floor); };
    R.line(path, lin(0, vy - ry, 0, floor, [[0, '#d8a080'], [.45, '#b06a56'], [1, '#5a2226']]), wdt, { dir: 'edge', group: 'rib' + i, maxR: 18 * s + 4, cap: 'butt' });
    R.line(path, 'rgba(255,220,190,.35)', wdt * .25, { dir: 'edge', group: 'rib' + i, maxR: 6 });
  }
  // floor: wet, dark flesh; a pool where the light falls
  R.fill(P([[0, 900], [SW, 900], [SW, SH], [0, SH]]), lin(0, 880, 0, SH, [[0, '#4a1c1c'], [1, '#22090b']]), { dir: 0, fallback: 0, group: 'floor', maxR: 26, aj: .3 });
  R.fill(E(1056, 960, 420, 70), lin(0, 900, 0, 1030, [[0, '#9a6052'], [1, '#5a2c2a']]), { dir: 0, group: 'pool', maxR: 16, aj: .2 });
  R.tint(E(1056, 520, 520, 520), rad(1056, 520, 10, 520, [[0, 'rgba(255,200,140,.35)'], [1, 'rgba(255,200,140,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 11,
    rev: (x, y) => Math.hypot(x - BELLY.jonas[0], (y - BELLY.jonas[1]) * 1.4) / 520 + hash(x * .13 + y) * .25 });
  reflect(st, 1056, 930, 120, 220, [.95, .7, .5], .5, 0);
  return { strokes: st, ref: R, w: SW, h: SH };
}

// ================= the hill (the call; and the ending) =================
export const HILL = { w: SW, h: 1600, hz: 1050, jonas: [860, 1262], sun: [1560, 1020] };
export function buildHill() {
  const W = SW, H = HILL.h, hz = HILL.hz, R = new Ref(W, H, .5);
  R.fill(P([[0, 0], [W, 0], [W, hz + 40], [0, hz + 40]]), lin(0, 0, 0, hz, [[0, '#262c52'], [.35, '#4c4a78'], [.62, '#b07a86'], [.84, '#eaa46c'], [1, '#f8d494']]), { dir: -4, fallback: -4, group: 'sky', maxR: 48, detail: 2.4, aj: .3 });
  R.tint(E(HILL.sun[0], HILL.sun[1], 420, 260), rad(HILL.sun[0], HILL.sun[1], 10, 420, [[0, 'rgba(255,236,170,.95)'], [1, 'rgba(255,200,120,0)']]));
  cloudBank(R, 420, 300, 300, 50, '#3e3c66', '#c88a7a'); cloudBank(R, 1500, 220, 360, 56, '#3a3a62', '#b8807a'); cloudBank(R, 980, 620, 260, 34, '#7a6684', '#f0ae7c'); cloudBank(R, 1850, 760, 220, 28, '#9a7a8a', '#f6c088');
  R.fill(E(HILL.sun[0], HILL.sun[1], 46, 46), '#fff2c4', { group: 'sun', maxR: 8 });
  // far plain + ridges
  R.fill(c => { c.moveTo(0, hz); for (let x = 0; x <= W; x += 60) c.lineTo(x, hz - 40 - Math.sin(x / 180) * 18 - Math.sin(x / 67) * 6); c.lineTo(W, hz + 120); c.lineTo(0, hz + 120); c.closePath(); }, lin(0, hz - 60, 0, hz + 120, [[0, '#7a5c7a'], [1, '#9a6a6a']]), { dir: 0, group: 'far', maxR: 14 });
  R.fill(c => { c.moveTo(0, hz + 60); for (let x = 0; x <= W; x += 50) c.lineTo(x, hz + 40 - Math.sin(x / 260 + 1) * 40); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); }, lin(0, hz, 0, H, [[0, '#6a4a52'], [1, '#2e2230']]), { dir: 0, group: 'mid', maxR: 26 });
  // the hilltop where Jonah stands: a rocky crest, lit on top by the low sun
  const crest = c => { c.moveTo(-50, H); c.lineTo(-50, 1330); c.bezierCurveTo(300, 1300, 560, 1240, 860, 1262); c.bezierCurveTo(1100, 1280, 1350, 1340, 1500, H); c.closePath(); };
  R.fill(crest, lin(0, 1240, 0, H, [[0, '#7a5240'], [.25, '#4a3230'], [1, '#1e161c']]), { dir: 8, fallback: 8, group: 'crest', maxR: 30, detail: 1.4 });
  R.line(c => { c.moveTo(150, 1316); c.bezierCurveTo(380, 1290, 600, 1245, 860, 1262); c.bezierCurveTo(1060, 1276, 1250, 1320, 1400, 1420); }, '#d8945c', 10, { dir: 'edge', group: 'rim', maxR: 4 });
  [[420, 1360, 70, 30], [1150, 1380, 90, 40], [640, 1450, 110, 46]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), lin(0, y - h, 0, y + h, [[0, '#8a6048'], [1, '#2e2024']]), { dir: 0, group: 'rock' + i, maxR: 12 }));
  const st = paintRef(R, { R: [24, 12, 6, 3], T: 12, seed: 21 });
  return { strokes: st, ref: R, w: W, h: H };
}

// ================= panorama: the port of Jope (west) ... Nineveh (east) =================
export const PANO = { w: SW * 2, h: SH, hz: 640, ship: [820, 892], quay: [1180, 905], nin: 3600 };
export function buildPano() {
  const W = PANO.w, H = SH, hz = PANO.hz, R = new Ref(W, H, .5);
  R.fill(P([[0, 0], [W, 0], [W, hz + 40], [0, hz + 40]]), lin(0, 0, 0, hz, [[0, '#4a6890'], [.55, '#9aa6b4'], [.85, '#e6c49a'], [1, '#f6dcaa']]), { dir: -3, fallback: -3, group: 'sky', maxR: 48, detail: 2.4, aj: .3 });
  R.tint(E(3700, hz, 900, 420), rad(3700, hz, 10, 900, [[0, 'rgba(255,214,140,.9)'], [1, 'rgba(255,190,120,0)']]));
  cloudBank(R, 500, 180, 340, 50, '#6a7898', '#d8b8a0'); cloudBank(R, 1700, 140, 300, 44, '#7a84a0', '#e0bc98'); cloudBank(R, 2700, 220, 320, 40, '#8a8aa4', '#f0c08c'); cloudBank(R, 3800, 160, 380, 52, '#9a88a0', '#f8c888');
  // sea (west) with the coast running in diagonally
  R.fill(P([[0, hz], [1500, hz], [1350, H], [0, H]]), lin(0, hz, 0, H, [[0, '#7aa0aa'], [.3, '#3e7484'], [1, '#1e4656']]), { dir: 0, fallback: 0, group: 'sea', maxR: 22, aj: .25 });
  // land
  R.fill(c => { c.moveTo(1500, hz); for (let x = 1500; x <= W; x += 80) c.lineTo(x, hz - 6 - Math.sin(x / 300) * 10); c.lineTo(W, H); c.lineTo(1350, H); c.closePath(); }, lin(0, hz, 0, H, [[0, '#cfae7e'], [.4, '#b08a5a'], [1, '#6a4c34']]), { dir: 0, fallback: 0, group: 'land', maxR: 30, detail: 1.5 });
  // distant hills east, in haze
  R.fill(c => { c.moveTo(2400, hz + 4); for (let x = 2400; x <= W; x += 60) c.lineTo(x, hz - 30 - Math.sin(x / 210) * 26 - Math.sin(x / 90) * 8); c.lineTo(W, hz + 4); c.closePath(); }, lin(0, hz - 70, 0, hz, [[0, '#a88a8a'], [1, '#c4a08a']]), { dir: 0, group: 'hills', maxR: 12 });
  // the road from the coast to the east
  R.fill(c => { c.moveTo(1450, 1000); c.bezierCurveTo(2000, 900, 2600, 760, 3300, 652); c.lineTo(3340, 652); c.bezierCurveTo(2700, 780, 2100, 960, 1560, 1188); c.lineTo(1420, 1188); c.closePath(); }, '#dcc296', { dir: 'edge', group: 'road', maxR: 14 });
  // NINEVEH: wall with towers and gate, ziggurat behind
  const N0 = 3150, N1 = 4150, wt = 520, wb = hz + 6;
  R.fill(P([[3480, wb - 120], [3480, 420], [3540, 420], [3540, 360], [3610, 360], [3610, 300], [3680, 300], [3680, 360], [3750, 360], [3750, 420], [3810, 420], [3810, wb - 120]]), lin(3480, 0, 3810, 0, [[0, '#d8b080'], [1, '#9a7050']]), { dir: 90, group: 'zig', maxR: 10 });
  R.fill(P([[N0, wb], [N0, wt], [N1, wt], [N1, wb]]), lin(0, wt, 0, wb, [[0, '#d6aa76'], [1, '#a87a50']]), { dir: 90, group: 'wall', maxR: 14 });
  for (let x = N0; x < N1; x += 40) R.fill(P([[x, wt], [x, wt - 18], [x + 22, wt - 18], [x + 22, wt]]), '#c8986a', { dir: 90, group: 'wall', maxR: 5 });
  [3150, 3420, 3700, 3980, 4150].forEach((x, i) => R.fill(P([[x - 40, wb], [x - 40, wt - 50], [x + 40, wt - 50], [x + 40, wb]]), lin(x - 40, 0, x + 40, 0, [[0, '#e4bc88'], [1, '#a07450']]), { dir: 90, group: 'tw' + i, maxR: 8 }));
  R.fill(c => { c.moveTo(3610, wb); c.lineTo(3610, 580); c.ellipse(3655, 580, 45, 40, 0, Math.PI, 2 * Math.PI); c.lineTo(3700, wb); c.closePath(); }, '#3a2a26', { dir: 90, group: 'gate', maxR: 6 });
  // palms
  [[2950, 690, 1], [3080, 676, .8], [4100, 700, 1.1]].forEach(([x, y, s], i) => { R.line(c => { c.moveTo(x, y); c.quadraticCurveTo(x + 10 * s, y - 80 * s, x + 4 * s, y - 150 * s); }, '#5a4030', 9 * s, { dir: 'edge', group: 'palm' + i, maxR: 4 }); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55; R.line(c => { c.moveTo(x + 4 * s, y - 150 * s); c.quadraticCurveTo(x + 4 * s + Math.cos(a) * 50 * s, y - 150 * s + Math.sin(a) * 50 * s - 10, x + 4 * s + Math.cos(a) * 90 * s, y - 150 * s + Math.sin(a) * 60 * s + 30 * s); }, '#4a6a3a', 10 * s, { dir: 'edge', group: 'palm' + i, maxR: 4 }); } });
  // JOPE: houses on the shore, stone quay into the sea
  [[1380, 560, 160, 120, '#e6dcc4'], [1530, 590, 130, 100, '#d8c8a8'], [1640, 540, 180, 150, '#e8d8b8'], [1800, 600, 120, 90, '#ccb894'], [1300, 610, 110, 80, '#d4c4a4']].forEach(([x, y, w, h, col], i) => {
    R.fill(P([[x, y + h], [x, y], [x + w, y], [x + w, y + h]]), lin(x, 0, x + w, 0, [[0, col], [1, '#a89474']]), { dir: 90, group: 'h' + i, maxR: 10 });
    R.fill(P([[x + w * .4, y + h], [x + w * .4, y + h * .55], [x + w * .6, y + h * .55], [x + w * .6, y + h]]), '#4a3a30', { dir: 90, group: 'hd' + i, maxR: 4 });
    R.fill(P([[x + w * .15, y + h * .2], [x + w * .3, y + h * .2], [x + w * .3, y + h * .35], [x + w * .15, y + h * .35]]), '#5a4a3e', { dir: 90, group: 'hw' + i, maxR: 3 });
  });
  R.fill(P([[950, 930], [1450, 850], [1560, 1000], [1020, 1060]]), lin(0, 850, 0, 1060, [[0, '#c4ae88'], [1, '#7a6a52']]), { dir: -10, group: 'quay', maxR: 14 });
  R.fill(P([[950, 930], [1020, 1060], [1020, 1110], [950, 980]]), '#5a4c3c', { dir: 90, group: 'quayF', maxR: 6 });
  const st = paintRef(R, { R: [24, 12, 6, 3], T: 12, seed: 31 });
  reflect(st, 1000, 960, 160, 260, [.55, .62, .66], .45);
  return { strokes: st, ref: R, w: W, h: H };
}

// ================= storm sky (the sea itself is painted live) =================
export const STORM = { w: SW, h: SH, hz: 600 };
export function buildStorm() {
  const R = new Ref(SW, SH, .5), hz = STORM.hz;
  R.fill(P([[0, 0], [SW, 0], [SW, hz + 60], [0, hz + 60]]), lin(0, 0, 0, hz, [[0, '#161c26'], [.6, '#2e3a46'], [1, '#56646a']]), { dir: -8, fallback: -8, group: 'sky', maxR: 48, detail: 2 });
  for (let i = 0; i < 9; i++) { const x = hash(i * 3.1) * SW, y = 80 + hash(i * 7.3) * 380, w = 260 + hash(i) * 260; cloudBank(R, x, y, w, 60 + hash(i * 2) * 40, i % 2 ? '#1e242e' : '#262e38', '#5a666c', 'sky', 36); }
  R.fill(P([[0, hz], [SW, hz], [SW, SH], [0, SH]]), lin(0, hz, 0, SH, [[0, '#3a4a50'], [1, '#162228']]), { dir: 0, fallback: 0, group: 'sea', maxR: 24 });
  const st = paintRef(R, { R: [24, 12, 6], T: 14, seed: 41 });
  return { strokes: st, ref: R, w: SW, h: SH };
}

// ================= the ship's hold =================
export const HOLD = { w: SW, h: SH, jonas: [1000, 905], lamp: [1380, 250] };
export function buildHold() {
  const R = new Ref(SW, SH, .5);
  R.fill(P([[0, 0], [SW, 0], [SW, SH], [0, SH]]), rad(1100, 600, 30, 1200, [[0, '#4a3020'], [.6, '#24160e'], [1, '#100a06']]), { dir: 90, fallback: 90, group: 'bg', maxR: 44 });
  // curved ribs of the hull, left and right
  for (let i = 0; i < 6; i++) {
    for (const s of [-1, 1]) {
      const x = 1056 + s * (260 + i * 150), sc = 1 - i * .08;
      R.line(c => { c.moveTo(x - s * 120 * sc, 1188); c.quadraticCurveTo(x + s * 90, 600, x - s * 80, -40); }, lin(0, 0, 0, SH, [[0, '#3a2414'], [.5, '#7a5232'], [1, '#4a2e1a']]), 46 * sc, { dir: 'edge', group: 'rib' + i + s, maxR: 10 });
    }
  }
  // deck beams overhead
  [60, 170].forEach((y, i) => R.fill(P([[0, y], [SW, y - 20], [SW, y + 40], [0, y + 60]]), lin(0, y, 0, y + 60, [[0, '#6a4a2e'], [1, '#2a1a10']]), { dir: 0, group: 'beam' + i, maxR: 10 }));
  // floor planks
  R.fill(P([[0, 930], [SW, 930], [SW, SH], [0, SH]]), lin(0, 930, 0, SH, [[0, '#6a4a30'], [1, '#2e1e12']]), { dir: 0, fallback: 0, group: 'floor', maxR: 18 });
  for (let k = 0; k < 5; k++) R.line(c => { c.moveTo(0, 960 + k * 50); c.lineTo(SW, 955 + k * 52); }, '#2a1a10', 4, { dir: 0, group: 'floor', maxR: 3 });
  // cargo: jars left, sacks right, Jonah's bed of sacks in the middle
  [[330, 900, 70], [440, 920, 62], [240, 930, 58], [520, 940, 50]].forEach(([x, y, r], i) => R.fill(c => { c.ellipse(x, y - r, r * .8, r, 0, 0, 7); c.rect(x - r * .25, y - r * 2.3, r * .5, r * .4); }, lin(x - r, 0, x + r, 0, [[0, '#b07a4a'], [1, '#5a3a22']]), { dir: 90, group: 'jar' + i, maxR: 8 }));
  [[1600, 900, 120, 70], [1760, 930, 110, 64], [1680, 840, 100, 56], [1880, 900, 90, 60]].forEach(([x, y, w, h], i) => R.fill(E(x, y, w, h), lin(0, y - h, 0, y + h, [[0, '#a89070'], [1, '#5a4a36']]), { dir: 0, group: 'sack' + i, maxR: 9 }));
  R.fill(E(1010, 925, 230, 48), lin(0, 880, 0, 970, [[0, '#9a8464'], [1, '#4a3c2c']]), { dir: 0, group: 'bed', maxR: 10 });
  R.tint(E(HOLD.lamp[0], HOLD.lamp[1] + 200, 600, 500), rad(HOLD.lamp[0], HOLD.lamp[1] + 60, 10, 600, [[0, 'rgba(255,190,110,.45)'], [1, 'rgba(255,190,110,0)']]));
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 51 });
  return { strokes: st, ref: R, w: SW, h: SH };
}

// ================= underwater =================
export const UNDER = { w: SW, h: 1500 };
export function buildUnder() {
  const H = UNDER.h, R = new Ref(SW, H, .5);
  R.fill(P([[0, 0], [SW, 0], [SW, H], [0, H]]), lin(0, 0, 0, H, [[0, '#9ac4c4'], [.08, '#4e8c98'], [.4, '#245a6c'], [.75, '#0e2a38'], [1, '#050e14']]), { dir: 0, fallback: 0, group: 'water', maxR: 48, detail: 2.2, aj: .5 });
  R.fill(c => { c.moveTo(0, 0); c.lineTo(SW, 0); for (let x = SW; x >= 0; x -= 40) c.lineTo(x, 70 + Math.sin(x / 90) * 14 + Math.sin(x / 37) * 6); c.closePath(); }, lin(0, 0, 0, 90, [[0, '#e8f0e0'], [1, '#a8d0c8']]), { dir: 0, group: 'surf', maxR: 10 });
  const st = paintRef(R, { R: [24, 12, 6], T: 14, seed: 61 });
  return { strokes: st, ref: R, w: SW, h: H };
}

// ================= the beach at sunrise =================
export const BEACH = { w: SW, h: SH, hz: 600, sun: [1500, 560], jonas: [980, 1000] };
export function buildBeach() {
  const R = new Ref(SW, SH, .5), hz = BEACH.hz;
  R.fill(P([[0, 0], [SW, 0], [SW, hz + 30], [0, hz + 30]]), lin(0, 0, 0, hz, [[0, '#6a8ab4'], [.45, '#c8a8b0'], [.8, '#f4c08a'], [1, '#fde0a8']]), { dir: -3, fallback: -3, group: 'sky', maxR: 48, detail: 2.4 });
  R.tint(E(BEACH.sun[0], BEACH.sun[1], 500, 300), rad(BEACH.sun[0], BEACH.sun[1], 10, 500, [[0, 'rgba(255,240,190,1)'], [1, 'rgba(255,210,140,0)']]));
  cloudBank(R, 600, 200, 300, 40, '#9a90b4', '#f8c8a0'); cloudBank(R, 1700, 300, 260, 30, '#b8a0b0', '#fcd0a0');
  R.fill(E(BEACH.sun[0], BEACH.sun[1], 54, 54), '#fff6d4', { group: 'sun', maxR: 8 });
  R.fill(P([[0, hz], [SW, hz], [SW, 860], [0, 800]]), lin(0, hz, 0, 860, [[0, '#d0a8a0'], [.3, '#6a92a4'], [1, '#3a6c80']]), { dir: 0, fallback: 0, group: 'sea', maxR: 20, aj: .2 });
  R.fill(c => { c.moveTo(0, 800); c.bezierCurveTo(600, 830, 1300, 880, SW, 850); c.lineTo(SW, SH); c.lineTo(0, SH); c.closePath(); }, lin(0, 800, 0, SH, [[0, '#e8cca0'], [.4, '#d4ac78'], [1, '#9a744e']]), { dir: 2, fallback: 2, group: 'sand', maxR: 28, detail: 1.4 });
  R.fill(c => { c.moveTo(0, 805); c.bezierCurveTo(600, 835, 1300, 885, SW, 855); c.lineTo(SW, 880); c.bezierCurveTo(1300, 910, 600, 860, 0, 835); c.closePath(); }, '#b49a7a', { dir: 2, group: 'wet', maxR: 8 });
  const st = paintRef(R, { R: [24, 12, 6, 3], T: 12, seed: 71 });
  reflect(st, BEACH.sun[0], hz + 10, 210, 200, [1, .9, .66], .8);
  return { strokes: st, ref: R, w: SW, h: SH };
}

// ================= Nineveh: the square inside the walls =================
export const CITY = { w: SW, h: SH, gy: 880, jonas: [420, 860], king: [1700, 860] };
export function buildCity() {
  const R = new Ref(SW, SH, .5), gy = CITY.gy;
  R.fill(P([[0, 0], [SW, 0], [SW, 600], [0, 600]]), lin(0, 0, 0, 600, [[0, '#7aa0c4'], [.6, '#e4c8a0'], [1, '#f6dcaa']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44, detail: 2.2 });
  // ziggurat in haze
  R.fill(P([[700, 600], [760, 330], [860, 330], [880, 240], [1230, 240], [1250, 330], [1350, 330], [1410, 600]]), lin(0, 240, 0, 600, [[0, '#d8b494'], [1, '#c09a7a']]), { dir: 90, group: 'zig', maxR: 12 });
  R.fill(P([[1000, 240], [1000, 170], [1110, 170], [1110, 240]]), '#c8a07c', { dir: 90, group: 'zig', maxR: 6 });
  // buildings: left block, right block with stair (the king's platform), back wall with gate
  R.fill(P([[0, 620], [SW, 620], [SW, gy], [0, gy]]), lin(0, 620, 0, gy, [[0, '#c89a6a'], [1, '#9a6a44']]), { dir: 90, group: 'wall', maxR: 18 });
  for (let x = 0; x < SW; x += 46) R.fill(P([[x, 620], [x, 598], [x + 26, 598], [x + 26, 620]]), '#b88a5c', { dir: 90, group: 'wall', maxR: 5 });
  R.fill(c => { c.moveTo(980, gy); c.lineTo(980, 730); c.ellipse(1056, 730, 76, 64, 0, Math.PI, 2 * Math.PI); c.lineTo(1132, gy); c.closePath(); }, '#3a2620', { dir: 90, group: 'gate', maxR: 6 });
  R.fill(P([[0, 420], [380, 440], [380, gy], [0, gy]]), lin(0, 0, 380, 0, [[0, '#e0b07a'], [1, '#b07a4c']]), { dir: 90, group: 'bl', maxR: 16 });
  R.fill(P([[380, 440], [470, 480], [470, gy], [380, gy]]), '#7a5034', { dir: 90, group: 'bls', maxR: 8 });
  R.fill(P([[1600, 470], [SW, 440], [SW, gy], [1600, gy]]), lin(1600, 0, SW, 0, [[0, '#a87450'], [1, '#d8a878']]), { dir: 90, group: 'br', maxR: 16 });
  [[90, 520], [230, 530], [1720, 540], [1900, 520]].forEach(([x, y], i) => R.fill(P([[x, y], [x + 60, y], [x + 60, y + 90], [x, y + 90]]), '#4a3024', { dir: 90, group: 'win' + i, maxR: 4 }));
  R.fill(P([[1560, gy], [1600, 820], [1900, 820], [1940, gy]]), '#b48a62', { dir: 0, group: 'step', maxR: 8 });
  R.fill(P([[300, gy], [320, 830], [560, 830], [580, gy]]), '#b48a62', { dir: 0, group: 'step2', maxR: 8 });
  // the square
  R.fill(P([[0, gy], [SW, gy], [SW, SH], [0, SH]]), lin(0, gy, 0, SH, [[0, '#d8b080'], [1, '#9a744c']]), { dir: 0, fallback: 0, group: 'ground', maxR: 26 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 81 });
  return { strokes: st, ref: R, w: SW, h: SH };
}

// ================= title lettering =================
export function buildTitle() {
  const R = new Ref(1500, 420, 1);
  R.text('JONAS', 750, 330, '600 330px "Cormorant Garamond"', lin(0, 60, 0, 340, [[0, '#fbe6b0'], [.6, '#e8b860'], [1, '#b8803a']]), { dir: 90, fallback: 90, maxR: 12, group: 'txt' });
  const st = paintRef(R, { R: [10, 5, 2.5], T: 10, seed: 91, app: (x, y, lv) => x / 1500 * .9 + lv * .05 });
  return { strokes: st, ref: R, w: 1500, h: 420 };
}

// ================= the great fish: body (with an open notch for the mouth) + lower jaw, drawn facing right =================
export const FISH = { w: 1200, h: 520, hinge: [930, 292], mouth: [1150, 300] };
export function buildFish() {
  const R = new Ref(1200, 520, .7);
  // tail fluke
  R.fill(P([[200, 260], [40, 90], [0, 110], [90, 260], [0, 410], [40, 430]]), lin(0, 90, 0, 430, [[0, '#2a3a48'], [1, '#1c2832']]), { dir: 0, group: 'tail', maxR: 14 });
  // body: dark back, pale belly; mouth notch cut out under the upper jaw
  const body = c => { c.moveTo(170, 255); c.bezierCurveTo(330, 110, 640, 40, 900, 70); c.bezierCurveTo(1060, 90, 1170, 190, 1190, 286); c.lineTo(930, 292); c.lineTo(1080, 360); c.bezierCurveTo(980, 440, 700, 470, 470, 420); c.bezierCurveTo(330, 390, 220, 320, 170, 255); c.closePath(); };
  R.fill(body, lin(0, 50, 0, 470, [[0, '#24343f'], [.42, '#3e5664'], [.62, '#7c8e8a'], [1, '#a8b0a0']]), { dir: 0, fallback: 0, group: 'body', maxR: 22, detail: 1.3 });
  R.line(c => { c.moveTo(260, 300); c.bezierCurveTo(500, 350, 800, 345, 1000, 318); }, 'rgba(210,214,196,.5)', 14, { dir: 'edge', group: 'body', maxR: 5 });
  for (let k = 0; k < 6; k++) R.line(c => { c.moveTo(560 + k * 60, 380 - k * 4); c.lineTo(690 + k * 60, 420 - k * 8); }, 'rgba(60,70,70,.5)', 6, { dir: 'edge', group: 'body', maxR: 3 });
  R.fill(P([[560, 75], [640, 0], [700, 60]]), '#22303a', { dir: 90, group: 'dorsal', maxR: 8 });
  R.fill(P([[700, 330], [600, 450], [790, 370]]), '#55686a', { dir: 60, group: 'pec', maxR: 8 });
  R.fill(E(1015, 205, 17, 15), '#e8e0c4', { group: 'eye', maxR: 4 });
  R.fill(E(1019, 206, 8, 8), '#101418', { group: 'pupil', maxR: 3 });
  const body_ = paintRef(R, { R: [20, 10, 5, 2.5], T: 11, seed: 101 });
  const J = new Ref(1200, 520, .7);
  J.fill(c => { c.moveTo(930, 292); c.lineTo(1170, 300); c.bezierCurveTo(1130, 350, 1060, 372, 980, 372); c.closePath(); }, lin(0, 290, 0, 372, [[0, '#8e9c94'], [1, '#b4baa8']]), { dir: 0, group: 'jaw', maxR: 10 });
  const jaw = paintRef(J, { R: [10, 5, 2.5], T: 11, seed: 102 });
  return { body: { strokes: body_, ref: R, w: 1200, h: 520 }, jaw: { strokes: jaw, ref: J, w: 1200, h: 520 } };
}
