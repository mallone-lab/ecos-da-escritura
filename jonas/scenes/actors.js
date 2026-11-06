// Moving things, rebuilt every frame from fixed seeds: people, the fish, the ship, the sea, light, rain, lightning.
import { KNIFE, BRUSH, DAB, LINE, hex, mixc, shade } from '../engine/impasto.js';
import { hash, clamp, lerp } from './common.js';

const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const seg2 = (out, a, b, wid, c, o) => out.push({ x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, ang: Math.atan2(b[1] - a[1], b[0] - a[0]), len: Math.hypot(b[0] - a[0], b[1] - a[1]) + wid * .35, wid, c, type: KNIFE, ...o });

export const ROBES = {
  jonas: { robe: '#5b6f86', mantle: '#b9894a', skin: '#b07a58', hair: '#3a2a22' },
  sailor: { robe: '#7a5a40', mantle: '#4a3a30', skin: '#9a6a4a', hair: '#2a2020' },
  sack: { robe: '#6e5a42', mantle: '#5a4a36', skin: '#a07050', hair: '#2a2220' },
};

// ---- a robed figure. (x,y) = feet on the ground, H = standing height. Facing f = +1 right / -1 left.
// pose: phase/stride (walk), kneel 0..1, lie (radians, rotates the whole body about the feet), lean,
// armF / armB: [shoulder angle from straight down, elbow bend] (positive = forward), head (tilt), look (-1 down .. 1 up)
export function person(out, x, y, H, o = {}) {
  const f = o.f ?? 1, k = clamp(o.kneel ?? 0), ph = o.phase ?? 0, st = o.stride ?? 0, seed = o.seed ?? 1;
  const pal = o.pal || ROBES.jonas, alpha = o.alpha ?? 1, rev = o.rev ?? 0, lie = o.lie ?? 0, lean = (o.lean ?? 0) + k * .12;
  const C = hex(pal.robe), M = hex(pal.mantle), S = hex(pal.skin), Hr = hex(pal.hair);
  const P = (lx, ly) => { const [a, b] = rot(lx * f, ly, lie * f); return [x + a, y + b]; };   // local: +x forward, -y up
  const so = { alpha, rev, seed };
  const bob = -Math.abs(Math.sin(ph)) * H * .02 * st;
  const hipY = -H * lerp(.5, .22, k) + bob, shY = -H * lerp(.8, .55, k) + bob;
  const shX = Math.sin(lean) * H * .3, hipX = Math.sin(lean) * H * .05 - k * H * .04;
  // feet / legs (walk): two short dark strokes under the hem
  for (const s of [1, -1]) {
    const a = Math.sin(ph) * .42 * st * s;
    const fx = hipX + Math.sin(a) * H * .45 * (1 - k), fy = 0;
    if (k < .5) seg2(out, P(hipX + Math.sin(a) * H * .25, -H * .2), P(fx, fy - H * .015), H * .055, shade(hex('#3a2c24'), s > 0 ? 1 : .8), { ...so, seed: seed + s });
    out.push({ ...so, x: P(fx + H * .04 * (k > .5 ? -1.6 : 1), fy)[0], y: P(fx, fy - H * .02)[1], ang: lie * f, len: H * .09, wid: H * .04, c: hex('#2a201a'), type: DAB, seed: seed + s * 3 });
  }
  // robe: three tapered planes, lit side toward the light (screen left), hem swings with the walk
  const sw = Math.sin(ph) * H * .03 * st;
  const hemY = k > .3 ? -H * .015 : -H * .07, hemW = H * lerp(.3, .44, k);
  const cols = [shade(C, 1.25), C, shade(C, .72)];
  for (let i = 0; i < 3; i++) {
    const u = (i - 1) / 1.5;
    const top = P(shX + u * H * .07, shY + H * .03), bot = P(hipX + u * hemW * .5 + sw + (k * H * .12), hemY);
    out.push({ ...so, x: (top[0] + bot[0]) / 2, y: (top[1] + bot[1]) / 2, ang: Math.atan2(bot[1] - top[1], bot[0] - top[0]), len: Math.hypot(bot[0] - top[0], bot[1] - top[1]) * 1.06,
      wid: H * .12, c: cols[f > 0 ? i : 2 - i], c2: shade(cols[f > 0 ? i : 2 - i], .88), type: KNIFE, taper: -.5, seed: seed + 10 + i, hgt: 1.1 });
  }
  // belt
  const bl = P(hipX - H * .1, hipY + H * .04), br = P(hipX + H * .1, hipY + H * .04);
  seg2(out, bl, br, H * .03, shade(M, .7), { ...so, seed: seed + 15 });
  // mantle over the shoulders and down the back
  const m0 = P(shX - H * .05, shY - H * .01), m1 = P(hipX - H * .1, hipY - H * .02);
  out.push({ ...so, x: (m0[0] + m1[0]) / 2, y: (m0[1] + m1[1]) / 2, ang: Math.atan2(m1[1] - m0[1], m1[0] - m0[0]), len: Math.hypot(m1[0] - m0[0], m1[1] - m0[1]) * 1.05, wid: H * .095, c: M, c2: shade(M, .8), type: KNIFE, taper: .45, seed: seed + 20, hgt: 1.15 });
  // arms: back arm first (behind the robe), front arm last
  const arm = (side, ang, bend, wcol, sd) => {
    const s0 = P(shX + side * H * .02, shY + H * .02);
    const a1 = ang, a2 = ang + bend;
    const e = P(shX + side * H * .02 + Math.sin(a1) * H * .17, shY + H * .02 + Math.cos(a1) * H * .17);
    const hnd = P(shX + side * H * .02 + Math.sin(a1) * H * .17 + Math.sin(a2) * H * .16, shY + H * .02 + Math.cos(a1) * H * .17 + Math.cos(a2) * H * .16);
    seg2(out, s0, e, H * .07, wcol, { ...so, seed: sd });
    seg2(out, e, hnd, H * .058, shade(wcol, 1.05), { ...so, seed: sd + 1 });
    out.push({ ...so, x: hnd[0], y: hnd[1], ang: 0, len: H * .045, wid: H * .04, c: S, type: DAB, seed: sd + 2 });
    return hnd;
  };
  const aB = o.armB || [.15 - Math.sin(ph) * .4 * st, .2], aF = o.armF || [.1 + Math.sin(ph) * .4 * st, .25];
  const hb = arm(-1, aB[0], aB[1], shade(C, .7), seed + 30);
  // head
  const tilt = (o.head ?? 0) + lean * .5, look = o.look ?? 0;
  const neck = P(shX + H * .015, shY - H * .03);
  const hc = P(shX + H * .03 + Math.sin(tilt) * H * .06, shY - H * .1 + (1 - Math.cos(tilt)) * H * .02);
  out.push({ ...so, x: neck[0], y: neck[1], ang: 0, len: H * .05, wid: H * .05, c: shade(S, .8), type: DAB, seed: seed + 40 });
  out.push({ ...so, x: hc[0], y: hc[1], ang: lie * f, len: H * .085, wid: H * .1, c: S, c2: shade(S, .82), type: DAB, seed: seed + 41 });
  // beard (toward the face) and head-cloth (back of the head)
  const bd = P(shX + H * .045 + Math.sin(tilt) * H * .06, shY - H * .06 - look * H * .01);
  out.push({ ...so, x: bd[0], y: bd[1], ang: lie * f + .3 * f, len: H * .06, wid: H * .05, c: Hr, type: DAB, seed: seed + 42 });
  const hcl = P(shX + H * .005 + Math.sin(tilt) * H * .05, shY - H * .125);
  out.push({ ...so, x: hcl[0], y: hcl[1], ang: (lie + .5 + tilt) * f, len: H * .12, wid: H * .085, c: shade(M, 1.12), c2: M, type: KNIFE, taper: .2, seed: seed + 43, hgt: 1.15 });
  const hf = arm(1, aF[0], aF[1], shade(C, 1.15), seed + 35);
  return { head: hc, hands: [hf, hb], top: P(shX, shY - H * .2) };
}

// ---- the great fish (side view). (x,y) = centre of the body, L = length, f = facing (+1 head right), mouth 0..1
export function fish(out, x, y, L, o = {}) {
  const f = o.f ?? 1, mouth = clamp(o.mouth ?? 0), tp = o.tail ?? 0, alpha = o.alpha ?? 1, rev = o.rev ?? 0, seed = o.seed ?? 500;
  const top = hex(o.top || '#2b3c4a'), belly = hex(o.belly || '#7d8c86'), dark = hex('#141c24');
  const N = 22;
  const prof = u => Math.pow(Math.sin(Math.PI * clamp(u * .92 + .04)), .75) * (1 - u * .35);   // u: 0 tail .. 1 head
  const spine = u => { const sx = (u - .5) * L, wig = Math.sin(tp - u * 3.2) * L * .025 * (1 - u); return [x + sx * f, y + wig]; };
  for (let i = 0; i < N; i++) {
    const u = (i + .5) / N, [sx, sy] = spine(u), w = prof(u) * L * .17;
    if (u > .8 && mouth > 0) continue;
    // dorsal (dark) and ventral (pale) knife planes
    out.push({ x: sx, y: sy - w * .45, ang: 0, len: L / N * 1.9, wid: w * 1.05, c: top, c2: shade(top, .8), type: KNIFE, seed: seed + i, alpha, rev, hgt: 1.1 });
    out.push({ x: sx, y: sy + w * .5, ang: 0, len: L / N * 1.9, wid: w * .85, c: belly, c2: shade(belly, .85), type: KNIFE, seed: seed + 40 + i, alpha, rev });
  }
  // head with the mouth: upper jaw stays, lower jaw swings down
  const [hx, hy] = spine(.9), hw = prof(.9) * L * .17;
  const jaw = mouth * .65;
  if (mouth > 0) {
    // throat (dark red inside)
    out.push({ x: hx + f * L * .02, y: hy + hw * .1, ang: 0, len: L * .17, wid: hw * (.6 + mouth * 1.3), c: hex('#3a1216'), c2: hex('#1a0608'), type: DAB, seed: seed + 90, alpha, rev });
    const up = [hx + f * L * .1, hy - hw * .35];
    out.push({ x: hx, y: hy - hw * .55, ang: 0, len: L * .24, wid: hw * 1.0, c: top, c2: shade(top, .8), type: KNIFE, taper: -.6 * f, seed: seed + 91, alpha, rev, hgt: 1.15 });
    const lj = rot(L * .22 * f, 0, jaw * f);
    out.push({ x: hx - f * L * .02 + lj[0] * .5, y: hy + hw * .35 + lj[1] * .5, ang: Math.atan2(lj[1], lj[0]), len: L * .22, wid: hw * .7, c: belly, c2: shade(belly, .8), type: KNIFE, taper: -.5, seed: seed + 92, alpha, rev });
  } else {
    out.push({ x: hx + f * L * .03, y: hy, ang: 0, len: L * .2, wid: hw * 1.7, c: top, c2: belly, type: KNIFE, taper: -.7 * f, seed: seed + 93, alpha, rev, hgt: 1.15 });
    out.push({ x: hx + f * L * .06, y: hy + hw * .25, ang: 0, len: L * .12, wid: hw * .08, c: dark, type: KNIFE, seed: seed + 94, alpha, rev });
  }
  // eye
  out.push({ x: hx + f * L * .01, y: hy - hw * .45, ang: 0, len: L * .016, wid: L * .016, c: hex('#d8d0b0'), type: DAB, seed: seed + 95, alpha, rev });
  // fins and tail
  const [tx, ty] = spine(.02), ta = Math.sin(tp) * .35;
  for (const s of [-1, 1]) out.push({ x: tx - f * L * .05, y: ty + s * L * .06, ang: (Math.PI + s * .6 + ta) * (f > 0 ? 1 : -1) + (f > 0 ? 0 : Math.PI), len: L * .17, wid: L * .07, c: shade(top, 1.1), type: KNIFE, taper: .85, seed: seed + 96 + s, alpha, rev });
  const [px, py] = spine(.62);
  out.push({ x: px, y: py + prof(.62) * L * .12, ang: (f > 0 ? 2.5 : .64), len: L * .12, wid: L * .04, c: shade(belly, .8), type: KNIFE, taper: .8, seed: seed + 99, alpha, rev });
  const [dx, dy] = spine(.5);
  out.push({ x: dx, y: dy - prof(.5) * L * .2, ang: (f > 0 ? -2.7 : -.44), len: L * .14, wid: L * .05, c: shade(top, .9), type: KNIFE, taper: .8, seed: seed + 100, alpha, rev });
  return { mouth: [hx + f * L * .1, hy] };
}

// ---- a small sailing ship (side view). (x,y) = waterline centre, S = hull length. roll in radians.
export function ship(out, x, y, S, o = {}) {
  const r = o.roll ?? 0, alpha = o.alpha ?? 1, rev = o.rev ?? 0, seed = o.seed ?? 700, sail = o.sail ?? 1;
  const P = (lx, ly) => { const [a, b] = rot(lx, ly, r); return [x + a, y + b]; };
  const wood = hex('#6a4a32'), dk = hex('#3a281c'), lt = hex('#9a7048');
  // hull: horizontal planks, curving up at both ends
  for (let i = 0; i < 4; i++) {
    const yy = -S * .02 - i * S * .045, w = S * (.82 - i * .02 + (i === 3 ? .12 : 0));
    for (let k = 0; k < 6; k++) {
      const u = (k + .5) / 6 - .5, lx = u * w, ly = yy - Math.pow(Math.abs(u) * 2, 3) * S * .06 * (1 + i * .3);
      const p = P(lx, ly), slope = Math.atan(3 * Math.sign(u) * Math.pow(Math.abs(u) * 2, 2) * S * .06 * (1 + i * .3) * 2 / S) + r;
      out.push({ x: p[0], y: p[1], ang: slope, len: w / 6 * 1.25, wid: S * .05, c: i % 2 ? wood : shade(wood, .85), c2: i === 3 ? lt : dk, type: KNIFE, seed: seed + i * 10 + k, alpha, rev });
    }
  }
  // bow and stern posts
  for (const s of [-1, 1]) { const a = P(s * S * .44, -S * .1), b = P(s * S * .5, -S * .26); seg2(out, a, b, S * .035, dk, { alpha, rev, seed: seed + 60 + s }); }
  // mast + yard + sail
  const m0 = P(0, -S * .18), m1 = P(0, -S * .78);
  out.push({ x: (m0[0] + m1[0]) / 2, y: (m0[1] + m1[1]) / 2, ang: Math.atan2(m1[1] - m0[1], m1[0] - m0[0]), len: S * .6, wid: S * .022, c: dk, type: KNIFE, seed: seed + 70, alpha, rev });
  const y0 = P(-S * .3, -S * .72), y1 = P(S * .3, -S * .72);
  seg2(out, y0, y1, S * .018, dk, { alpha, rev, seed: seed + 71 });
  if (sail > 0) {
    const billow = (o.billow ?? .4);
    for (let k = 0; k < 5; k++) {
      const u = (k + .5) / 5 - .5, a = P(u * S * .58, -S * .7), b = P(u * S * .52 + billow * S * .06, -S * (.7 - .42 * sail));
      out.push({ x: (a[0] + b[0]) / 2 + billow * S * .03, y: (a[1] + b[1]) / 2, ang: Math.atan2(b[1] - a[1], b[0] - a[0]), len: Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.05, wid: S * .13, c: shade(hex('#d8c8a4'), 1 - k * .05), c2: hex('#b8a47e'), type: KNIFE, bend: billow * .25, seed: seed + 80 + k, alpha, rev });
    }
  }
  // rigging
  for (const [a, b] of [[[0, -S * .78], [S * .46, -S * .24]], [[0, -S * .78], [-S * .46, -S * .24]]]) { const p = P(...a), q = P(...b); out.push({ x: (p[0] + q[0]) / 2, y: (p[1] + q[1]) / 2, ang: Math.atan2(q[1] - p[1], q[0] - p[0]), len: Math.hypot(q[0] - p[0], q[1] - p[1]), wid: Math.max(1.5, S * .006), c: dk, type: LINE, seed: seed + 90, alpha: alpha * .8, rev }); }
  return { deck: (u) => P(u * S * .4, -S * .19), P };
}

// ---- the sea: rows of knife strokes riding a sum of travelling waves. Scene space; horizon hy, bottom by.
export function sea(out, t, o = {}) {
  const { x0 = -100, x1 = 2300, hy = 600, by = 1250, amp = 1, rows = 26, seed = 300, alpha = 1, rev = 0 } = o;
  const deep = hex(o.deep || '#1c2c36'), mid = hex(o.mid || '#38505a'), crest = hex(o.crest || '#7d9494'), foam = hex(o.foam || '#d8dccf');
  const speed = o.speed ?? 1;
  for (let j = 0; j < rows; j++) {
    const v = j / (rows - 1), py = lerp(hy, by, Math.pow(v, 1.6)), sc = .15 + v * 1.1;
    const step = 46 * sc + 8, n = Math.ceil((x1 - x0) / step) + 1;
    for (let i = 0; i < n; i++) {
      const r1 = hash(i * 1.7 + j * 31.3 + seed), r2 = hash(i * 5.1 + j * 7.7 + seed);
      const px = x0 + i * step + (r1 - .5) * step * .6;
      const ph = px / (220 * sc + 40);
      const w1 = Math.sin(ph - t * 1.6 * speed + j * .7), w2 = Math.sin(ph * 2.3 + t * 1.1 * speed + j * 1.9) * .4;
      const h = (w1 + w2) * amp * 22 * sc;
      const slope = Math.cos(ph - t * 1.6 * speed + j * .7) * amp * .35;
      const lit = clamp(.5 + (w1 + w2) * .35);
      const c = mixc(mixc(deep, mid, v * .6 + .2), crest, lit * .7 * Math.min(1, amp + .3));
      out.push({ x: px, y: py - h, ang: -slope + (r2 - .5) * .12, len: step * 1.5, wid: (10 + 14 * sc) * (1 + amp * .3), c, c2: shade(c, .82), type: KNIFE, seed: seed + i * 37 + j, alpha, rev, hgt: .9 + amp * .3 });
      if (amp > .45 && w1 + w2 > .95 && r2 > .35) out.push({ x: px + (r1 - .5) * 10, y: py - h - 6 * sc, ang: -slope, len: step * (.6 + r2 * .5), wid: 6 + 7 * sc, c: foam, type: KNIFE, seed: seed + 9000 + i * 37 + j, alpha: alpha * clamp((w1 + w2 - .95) * 3), rev, hgt: 1.3 });
    }
  }
}

// ---- divine light: long gold strokes fanning from a point
export function rays(out, o = {}) {
  const { x = 960, y = -100, n = 9, spread = .5, len = 1400, wid = 80, alpha = .25, col = '#f6d27a', seed = 900, ang = Math.PI / 2, grow = 1 } = o;
  for (let i = 0; i < n; i++) {
    const a = ang + (i / (n - 1) - .5) * spread + (hash(i + seed) - .5) * .05, L = len * (.75 + hash(i * 3 + seed) * .4) * grow;
    out.push({ x: x + Math.cos(a) * L / 2, y: y + Math.sin(a) * L / 2, ang: a, len: L, wid: wid * (.6 + hash(i * 7 + seed) * .7), c: hex(col), c2: hex('#fff0c0'), type: BRUSH, taper: .7, seed: seed + i, alpha: alpha * (.6 + hash(i * 11 + seed) * .5), hgt: .3 });
  }
}

// ---- rain (screen space)
export function rain(out, t, { W = 1920, H = 1080, n = 220, ang = 1.9, col = [.8, .84, .9], alpha = .5, speed = 1, seed = 1 } = {}) {
  const dx = Math.cos(ang), dy = Math.sin(ang);
  for (let i = 0; i < n; i++) {
    const r1 = hash(i * 1.37 + seed), r2 = hash(i * 7.11 + seed), r3 = hash(i * 3.3 + seed), near = r3 < .25;
    const v = (near ? 2600 : 1600 + r2 * 600) * speed, len = near ? 150 + r1 * 80 : 50 + r2 * 60, span = H * 1.5;
    const d = ((r2 * span + v * t) % span) - H * .25;
    out.push({ x: r1 * W * 1.4 - W * .1 + dx * d, y: d * dy, ang, len, wid: near ? 3.2 : 1.4 + r1, c: col, seed: i, type: LINE, alpha: alpha * (near ? .45 : .7), hgt: .2 });
  }
}

// ---- lightning: a branching zigzag of thin lines, seeded
export function bolt(out, x, y0, y1, seed, alpha = 1) {
  let px = x, py = y0; const n = 14;
  for (let i = 0; i < n; i++) {
    const nx = px + (hash(seed + i * 3.1) - .5) * 90, ny = py + (y1 - y0) / n;
    out.push({ x: (px + nx) / 2, y: (py + ny) / 2, ang: Math.atan2(ny - py, nx - px), len: Math.hypot(nx - px, ny - py) * 1.1, wid: 7 - i * .3, c: [1, .98, .9], type: LINE, seed: seed + i, alpha, hgt: .2 });
    if (hash(seed + i * 7.7) > .72) { const bx = nx + (hash(seed + i) - .5) * 220, by = ny + 120; out.push({ x: (nx + bx) / 2, y: (ny + by) / 2, ang: Math.atan2(by - ny, bx - nx), len: Math.hypot(bx - nx, by - ny), wid: 3, c: [.95, .95, 1], type: LINE, seed: seed + 50 + i, alpha: alpha * .8, hgt: .2 }); }
    px = nx; py = ny;
  }
}

// ---- bubbles / dust motes
export function motes(out, t, { x0 = 0, x1 = 1920, y0 = 0, y1 = 1080, n = 60, rise = 40, size = 6, col = [.85, .9, .95], alpha = .5, seed = 5 } = {}) {
  for (let i = 0; i < n; i++) {
    const r1 = hash(i * 2.3 + seed), r2 = hash(i * 4.9 + seed), r3 = hash(i * 8.1 + seed);
    const span = y1 - y0, yy = y1 - ((r2 * span + rise * (.5 + r3) * t) % span), xx = lerp(x0, x1, r1) + Math.sin(t * (.6 + r3) + i) * 12;
    out.push({ x: xx, y: yy, ang: 0, len: size * (.5 + r3), wid: size * (.5 + r3), c: col, type: DAB, seed: i + seed, alpha: alpha * (.4 + r2 * .6), hgt: .5 });
  }
}
