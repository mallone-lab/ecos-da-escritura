// More moving things for the Shorts: lion, pig, chariot with horse, walls of water, a column that falls.
import { KNIFE, BRUSH, DAB, LINE, hex, mixc, shade } from '../engine/impasto.js';
import { hash, clamp, lerp } from './common.js';
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const seg2 = (out, a, b, wid, c, o) => out.push({ x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, ang: Math.atan2(b[1] - a[1], b[0] - a[0]), len: Math.hypot(b[0] - a[0], b[1] - a[1]) + wid * .3, wid, c, type: KNIFE, ...o });

// ---- lion, side view. (x,y) = ground under the body centre, S = body length. lie 0..1 (standing -> lying down), mouth 0..1, look (head tilt)
export function lion(out, x, y, S, o = {}) {
  const f = o.f ?? 1, lie = clamp(o.lie ?? 0), mouth = clamp(o.mouth ?? 0), seed = o.seed ?? 300, alpha = o.alpha ?? 1, rev = o.rev ?? 0, ph = o.phase ?? 0, st = o.stride ?? 0;
  const fur = hex(o.fur || '#c08a48'), mane = hex(o.mane || '#6a3e22'), dk = hex('#3a2416');
  const so = { alpha, rev };
  const P = (lx, ly) => [x + lx * f, y + ly];
  const bodyY = -S * lerp(.36, .17, lie), legL = S * lerp(.3, .1, lie);
  // legs (far pair darker), walk swing; lying: folded forward under the chest
  [[.24, 1, .78], [-.26, -1, .78], [.18, -1, 1], [-.3, 1, 1]].forEach(([u, s, k], i) => {
    const sw = Math.sin(ph) * .35 * st * s, top = P(u * S, bodyY + S * .06), ft = P(u * S + Math.sin(sw) * legL + (lie > .5 && u > 0 ? S * .16 : 0), -S * .015);
    seg2(out, top, ft, S * .12, shade(fur, k * (i < 2 ? .78 : 1)), { ...so, seed: seed + i, taper: -.15 });
    out.push({ ...so, x: ft[0] + f * S * .04, y: ft[1], ang: 0, len: S * .12, wid: S * .06, c: shade(fur, .72), type: DAB, seed: seed + 10 + i });
  });
  // body: hindquarters + chest as round masses, a lit back plane, a shaded belly
  const hq = P(-S * .22, bodyY), ch = P(S * .18, bodyY - S * .01);
  out.push({ ...so, x: hq[0], y: hq[1], ang: 0, len: S * .46, wid: S * .34, c: shade(fur, 1.05), c2: shade(fur, .85), type: DAB, seed: seed + 20, hgt: 1.1 });
  out.push({ ...so, x: ch[0], y: ch[1], ang: 0, len: S * .46, wid: S * .38, c: shade(fur, 1.02), c2: shade(fur, .85), type: DAB, seed: seed + 21, hgt: 1.1 });
  out.push({ ...so, x: (hq[0] + ch[0]) / 2, y: bodyY - S * .12, ang: 0, len: S * .6, wid: S * .1, c: shade(fur, 1.25), type: KNIFE, seed: seed + 24, alpha: alpha * .9 });
  out.push({ ...so, x: (hq[0] + ch[0]) / 2, y: bodyY + S * .1, ang: 0, len: S * .5, wid: S * .1, c: shade(fur, .75), type: KNIFE, seed: seed + 25 });
  // tail with a dark tuft
  const t0 = P(-S * .44, bodyY - S * .04), t1 = P(-S * .66, bodyY + S * .12 + Math.sin(ph * .5 + seed) * S * .04);
  seg2(out, t0, t1, S * .04, fur, { ...so, seed: seed + 22, bend: .3 });
  out.push({ ...so, x: t1[0], y: t1[1], ang: 0, len: S * .08, wid: S * .07, c: dk, type: DAB, seed: seed + 23 });
  // head inside a full mane
  const look = o.look ?? 0, hx = S * .42, hy = bodyY - S * .16 + look * S * .05;
  const mc = P(hx - S * .03, hy + S * .02);
  out.push({ ...so, x: mc[0], y: mc[1], ang: 0, len: S * .42, wid: S * .44, c: mane, c2: shade(mane, .75), type: DAB, seed: seed + 30, hgt: 1.25 });
  for (let k = 0; k < 7; k++) { const a = -1.9 + k * .55, p = P(hx - S * .06 + Math.cos(a) * S * .17, hy + Math.sin(a) * S * .19); out.push({ ...so, x: p[0], y: p[1], ang: a * f, len: S * .14, wid: S * .1, c: shade(mane, 1.1 + hash(k + seed) * .25), type: KNIFE, taper: .4, seed: seed + 31 + k, hgt: 1.2 }); }
  const hd = P(hx + S * .06, hy);
  out.push({ ...so, x: hd[0], y: hd[1], ang: 0, len: S * .22, wid: S * .2, c: shade(fur, 1.1), c2: shade(fur, .9), type: DAB, seed: seed + 40, hgt: 1.1 });
  const mz = P(hx + S * .15, hy + S * .05);
  out.push({ ...so, x: mz[0], y: mz[1], ang: 0, len: S * .12, wid: S * .1, c: hex('#e6c49a'), type: DAB, seed: seed + 41 });
  if (mouth > .05) { const jw = P(hx + S * .15, hy + S * .11 + mouth * S * .05); out.push({ ...so, x: jw[0], y: jw[1], ang: 0, len: S * .1, wid: S * .03 + mouth * S * .06, c: hex('#5a1a18'), type: DAB, seed: seed + 42 }); }
  const ey = P(hx + S * .1, hy - S * .04); out.push({ ...so, x: ey[0], y: ey[1], ang: 0, len: S * .026, wid: S * .02, c: dk, type: DAB, seed: seed + 43 });
  const ns = P(hx + S * .21, hy + S * .02); out.push({ ...so, x: ns[0], y: ns[1], ang: 0, len: S * .04, wid: S * .03, c: dk, type: DAB, seed: seed + 44 });
}

// ---- pig, side view
export function pig(out, x, y, S, o = {}) {
  const f = o.f ?? 1, seed = o.seed ?? 400, alpha = o.alpha ?? 1, rev = o.rev ?? 0, ph = o.phase ?? 0, nod = Math.sin(ph) * .5 + .5;
  const sk = hex(o.skin || '#c89a8a'), so = { alpha, rev }; const P = (lx, ly) => [x + lx * f, y + ly];
  [[.25, .8], [-.25, .8], [.2, 1], [-.3, 1]].forEach(([u, k], i) => { const a = P(u * S, -S * .2), b = P(u * S, -S * .01); seg2(out, a, b, S * .08, shade(sk, k * .8), { ...so, seed: seed + i }); });
  const c = P(0, -S * .3); out.push({ ...so, x: c[0], y: c[1], ang: 0, len: S * .85, wid: S * .4, c: shade(sk, 1.08), c2: shade(sk, .85), type: DAB, seed: seed + 10, hgt: 1.1 });
  const h = P(S * .42, -S * .3 + nod * S * .08); out.push({ ...so, x: h[0], y: h[1], ang: 0, len: S * .26, wid: S * .24, c: sk, type: DAB, seed: seed + 11 });
  const sn = P(S * .56, -S * .28 + nod * S * .1); out.push({ ...so, x: sn[0], y: sn[1], ang: 0, len: S * .08, wid: S * .1, c: shade(sk, .8), type: DAB, seed: seed + 12 });
  const ea = P(S * .38, -S * .44 + nod * S * .08); out.push({ ...so, x: ea[0], y: ea[1], ang: -.6 * f, len: S * .1, wid: S * .06, c: shade(sk, .9), type: KNIFE, taper: .8, seed: seed + 13 });
}

// ---- war chariot with one horse at full gallop. (x,y) ground, S = length of the whole rig, f facing
export function chariot(out, x, y, S, o = {}) {
  const f = o.f ?? 1, ph = o.phase ?? 0, seed = o.seed ?? 500, alpha = o.alpha ?? 1, rev = o.rev ?? 0, so = { alpha, rev };
  const hc = hex(o.horse || '#3a2a22'), wood = hex('#7a5232'), gold = hex('#c89a3a'); const P = (lx, ly) => [x + lx * f, y + ly];
  const bob = Math.sin(ph * 2) * S * .015;
  // horse legs: gallop
  [[.36, 0], [.3, 1.6], [.08, 3.1], [.02, 4.6]].forEach(([u, p], i) => {
    const a = Math.sin(ph + p) * .7, top = P(u * S, -S * .26 + bob), kn = P(u * S + Math.sin(a) * S * .1, -S * .14), ft = P(u * S + Math.sin(a + .6) * S * .14, -S * .01 - Math.max(0, Math.sin(ph + p)) * S * .05);
    seg2(out, top, kn, S * .035, shade(hc, i % 2 ? .75 : 1), { ...so, seed: seed + i }); seg2(out, kn, ft, S * .028, shade(hc, i % 2 ? .7 : .95), { ...so, seed: seed + 10 + i });
  });
  const bd = P(S * .19, -S * .3 + bob); out.push({ ...so, x: bd[0], y: bd[1], ang: -.05 * f, len: S * .42, wid: S * .14, c: shade(hc, 1.15), c2: hc, type: KNIFE, seed: seed + 20, hgt: 1.1 });
  const nk0 = P(S * .36, -S * .33 + bob), nk1 = P(S * .46, -S * .48 + bob); seg2(out, nk0, nk1, S * .08, hc, { ...so, seed: seed + 21, taper: .3 });
  const hd = P(S * .5, -S * .47 + bob); out.push({ ...so, x: hd[0], y: hd[1], ang: .5 * f, len: S * .14, wid: S * .06, c: shade(hc, 1.1), type: KNIFE, taper: -.4, seed: seed + 22 });
  const mn = P(S * .42, -S * .45 + bob); out.push({ ...so, x: mn[0], y: mn[1], ang: -1 * f, len: S * .14, wid: S * .03, c: hex('#1a1210'), type: KNIFE, seed: seed + 23 });
  const tl = P(-S * .02, -S * .3 + bob); out.push({ ...so, x: tl[0], y: tl[1] + S * .03, ang: (Math.PI - .4) * f, len: S * .14, wid: S * .035, c: hex('#1a1210'), type: KNIFE, taper: .7, seed: seed + 24 });
  // pole, wheel, cart, driver
  seg2(out, P(S * .05, -S * .25), P(-S * .2, -S * .2), S * .02, wood, { ...so, seed: seed + 30 });
  const wc = P(-S * .3, -S * .13);
  for (let k = 0; k < 4; k++) { const a = ph * 3 + k * Math.PI / 4; out.push({ ...so, x: wc[0], y: wc[1], ang: a, len: S * .25, wid: S * .012, c: shade(wood, .7), type: LINE, seed: seed + 31 + k }); }
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; out.push({ ...so, x: wc[0] + Math.cos(a) * S * .12, y: wc[1] + Math.sin(a) * S * .12, ang: a + Math.PI / 2, len: S * .085, wid: S * .022, c: wood, type: KNIFE, seed: seed + 40 + k }); }
  const ct = P(-S * .3, -S * .26); out.push({ ...so, x: ct[0], y: ct[1], ang: 0, len: S * .22, wid: S * .12, c: gold, c2: shade(gold, .7), type: KNIFE, seed: seed + 50, hgt: 1.2 });
  const dr = P(-S * .3, -S * .44); out.push({ ...so, x: dr[0], y: dr[1], ang: Math.PI / 2, len: S * .18, wid: S * .07, c: hex('#d8ccb0'), type: KNIFE, seed: seed + 51 });
  const dh = P(-S * .29, -S * .55); out.push({ ...so, x: dh[0], y: dh[1], ang: 0, len: S * .05, wid: S * .055, c: hex('#9a6a4a'), type: DAB, seed: seed + 52 });
  const sp0 = P(-S * .27, -S * .62), sp1 = P(S * .1, -S * .52); out.push({ ...so, x: (sp0[0] + sp1[0]) / 2, y: (sp0[1] + sp1[1]) / 2, ang: Math.atan2(sp1[1] - sp0[1], sp1[0] - sp0[0]), len: S * .4, wid: S * .008, c: hex('#2a2018'), type: LINE, seed: seed + 53 });
  // dust thrown back
  for (let k = 0; k < 8; k++) { const r = hash(seed + k * 3.1), a = ((ph * .3 + r) % 1); const p = P(-S * (.45 + a * .5), -S * (.03 + a * .15)); out.push({ ...so, x: p[0], y: p[1], ang: 0, len: S * (.08 + a * .2), wid: S * (.06 + a * .14), c: hex('#c8b08a'), type: DAB, alpha: alpha * (1 - a) * .7, seed: seed + 60 + k, hgt: .4 }); }
}

// ---- a wall of water, rising from the sea floor. x0..x1 columns, ground y, height h (0..H), side -1 left wall / +1 right wall
export function waterWall(out, t, { x0, x1, y, h, side = 1, seed = 700, alpha = 1, rev = 0, foam = true } = {}) {
  const n = Math.max(4, Math.round(Math.abs(x1 - x0) / 34));
  for (let i = 0; i < n; i++) for (let j = 0; j < 14; j++) {
    const u = i / (n - 1), v = j / 13, xx = lerp(x0, x1, u) + Math.sin(t * 1.4 + j * .7 + i) * 6, yy = y - v * h;
    const edge = side > 0 ? u : 1 - u;                    // 0 = face toward the path
    const c = mixc(mixc(hex('#1e4a5e'), hex('#4f8ea0'), v * .7), hex('#9cc8cc'), (1 - edge) * .45);
    out.push({ x: xx, y: yy, ang: Math.PI / 2 + Math.sin(t + i + j) * .08, len: h / 12, wid: 40, c, c2: shade(c, .85), type: KNIFE, seed: seed + i * 31 + j, alpha, rev, hgt: 1.1 });
  }
  if (foam) for (let i = 0; i < n * 2; i++) { const u = i / (n * 2 - 1); out.push({ x: lerp(x0, x1, u), y: y - h - 6 + Math.sin(t * 2 + i) * 6, ang: (hash(i + seed) - .5) * .5, len: 40, wid: 16, c: hex('#eef2ea'), type: KNIFE, seed: seed + 900 + i, alpha: alpha * .9, rev, hgt: 1.3 }); }
}

// ---- a stone column of stacked drums that can topple. (x,y) base, w width, h height, fall 0..1, dir +1/-1
export function column(out, x, y, w, h, o = {}) {
  const fall = clamp(o.fall ?? 0), dir = o.dir ?? 1, seed = o.seed ?? 800, alpha = o.alpha ?? 1, rev = o.rev ?? 0;
  const stoneC = hex(o.col || '#b8a488'), n = 7;
  for (let k = 0; k < n; k++) {
    const v = (k + .5) / n, br = k / n;                      // drums higher up fly further
    const a = fall * dir * (1.2 + br * .6) * (fall > .02 ? 1 : 0), drop = fall * fall * h * .9 * (1 - br * .2);
    const [px, py] = rot(0, -v * h, a);
    const off = fall * dir * hash(seed + k) * w * 1.5 * br;
    const c = shade(stoneC, .8 + hash(seed + k * 2) * .35);
    out.push({ x: x + px + off, y: Math.min(y - w * .2, y + py + drop), ang: Math.PI / 2 + a + fall * (hash(k + seed) - .5) * 1.5, len: h / n * 1.05, wid: w, c, c2: shade(c, .78), type: KNIFE, seed: seed + k, alpha, rev, hgt: 1.15 });
    out.push({ x: x + px + off - w * .3, y: Math.min(y - w * .2, y + py + drop), ang: Math.PI / 2 + a, len: h / n * .9, wid: w * .12, c: shade(c, 1.25), type: KNIFE, seed: seed + 20 + k, alpha, rev });
  }
  // capital
  const [cx, cy] = rot(0, -h - w * .2, fall * dir * 1.9);
  out.push({ x: x + cx + fall * dir * w * 1.6, y: Math.min(y - w * .2, y + cy + fall * fall * h * .8), ang: fall * dir * 2, len: w * 1.7, wid: w * .45, c: shade(stoneC, 1.1), type: KNIFE, seed: seed + 40, alpha, rev, hgt: 1.2 });
}
