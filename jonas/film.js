// JONAS — o homem que fugiu de Deus. Every frame is repainted from knife strokes.
import { Impasto, Strokes, F, hex, shade } from './engine/impasto.js';
import { SHOTS, CUT, T, DUR, BEAT, SHORT_SEGS } from './timeline.mjs';
import { buildBelly, BELLY, buildHill, HILL, buildPano, PANO, buildStorm, STORM, buildHold, HOLD, buildUnder, UNDER, buildBeach, BEACH, buildCity, CITY, buildTitle, buildFish, FISH } from './scenes/plates.js';
import { person, fish, ship, sea, rays, rain, bolt, motes, ROBES } from './scenes/actors.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';

const NEVER = 1e6, G = .86, W = innerWidth, H = innerHeight;
const VERT = H > W, SHORT = new URLSearchParams(location.search).get('short') === '1';
const SEGS = SHORT ? SHORT_SEGS : [[0, DUR]];
const SDUR = SEGS.reduce((a, [f, t]) => a + t - f, 0);
const srcT = tau => { for (const [f, t] of SEGS) { if (tau < t - f) return f + tau; tau -= t - f; } return SEGS[SEGS.length - 1][1]; };
// vertical framing: per shot a zoom factor, the plate height (camera stays inside the painting) and an optional focus x
let CUR = 'belly1', CURT = 0;
const VCFG = {
  belly1: { k: 1.4, ph: 1188 }, belly2: { k: 1.4, ph: 1188 }, black: { k: 1.4, ph: 1188 }, title: { k: 1.6, ph: 1188 },
  hill: { k: 1.45, ph: 1600, fx: () => 900 }, hill2: { k: 1.45, ph: 1600, fx: () => 900 }, end: { k: 1.45, ph: 1600, fx: () => 900 },
  pano: { k: 1.57, ph: 1188, pw: 4224, fx: c => c.x - 250 }, port: { k: 1.57, ph: 1188, pw: 4224, fx: c => c.x - 250 }, pano2: { k: 1.5, ph: 1188, pw: 4224, fx: () => 3655 },
  storm: { k: 1.4, ph: 1188 }, hold: { k: 1.4, ph: 1188, fx: () => 1050 }, under: { k: 1.6, ph: 1500 },
  deck: { k: 1.1, ph: 1188, fx: c => c.x + 380 * ss(seg(CURT, 66.0, 67.3)) }, beach: { k: 1.4, ph: 1188 }, city: { k: 1.4, ph: 1188 },
};
const vcache = new WeakMap();
function vcam(c) {
  if (!VERT || !c) return c; if (vcache.has(c)) return vcache.get(c);
  const g = VCFG[CUR] || { k: 1.5, ph: 1188 }, pw = g.pw || 2112;
  const z = Math.max(c.zoom * g.k, H / g.ph + .02, W / pw + .02), hw = W / 2 / z, hh = H / 2 / z;
  const v = { x: clamp(g.fx ? g.fx(c) : c.x, hw, pw - hw), y: clamp(c.y, hh, g.ph - hh), zoom: z, rot: (c.rot || 0) * .6 };
  vcache.set(c, v); return v;
}
const TR = (x, y) => [1, 0, 0, 1, x, y];
const key = (t, ks) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0, e] = ks[i], [t1, v1] = ks[i + 1]; if (t < t1) { const k = (e || eio)((t - t0) / (t1 - t0)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); } } return ks[ks.length - 1][1]; };
const pulse = (t, at, d = .25) => t < at ? 0 : Math.exp(-(t - at) / d);

let E, PL = {}, dyn, cap, refEl, card, titleSub, cues = [];
const GREYW = { expo: .96, sat: .9, contrast: 1.07, vig: .4, spec: .24, shin: 26, lift: [.012, .012, .022] };
const WARM = { expo: 1.02, sat: 1.07, contrast: 1.04, vig: .3, spec: .26, shin: 26 };

export async function setup(canvas) {
  await document.fonts.load('600 100px "Cormorant Garamond"'); await document.fonts.load('italic 500 40px "Cormorant Garamond"');
  E = new Impasto(canvas, { W, H }); dyn = new Strokes(16384);
  if (VERT) { const d = E.draw.bind(E), u = E.under.bind(E); E.draw = (b, o = {}) => d(b, { ...o, cam: vcam(o.cam) }); E.under = (tx, w, h, o = {}) => u(tx, w, h, { ...o, cam: vcam(o.cam) }); }
  const up = (b, sweep = true) => {
    const a = b.strokes.data();
    if (sweep) for (let i = 0; i < b.strokes.n; i++) a[i * F + 14] = a[i * F] / b.w * .45 + hash(i * .37) * .08;   // paint-over sweep, left to right
    return { b: E.batch(a), tex: E.texture(b.ref.ctx.canvas), w: b.w, h: b.h };
  };
  PL.belly = up(buildBelly()); PL.hill = up(buildHill()); PL.pano = up(buildPano()); PL.storm = up(buildStorm());
  PL.hold = up(buildHold()); PL.under = up(buildUnder()); PL.beach = up(buildBeach()); PL.city = up(buildCity()); PL.title = up(buildTitle(), false);
  const fb = buildFish(); PL.fishB = up(fb.body, false); PL.fishJ = up(fb.jaw, false);
  cues = await (await fetch('cues.json')).json();
  const css = document.createElement('style');
  css.textContent = `.cap{position:fixed;left:0;right:0;bottom:64px;text-align:center;pointer-events:none}
  .cap span{display:inline-block;max-width:1360px;font:600 50px/1.18 "Cormorant Garamond",serif;color:#f5ead2;padding:10px 30px 14px;background:rgba(12,9,8,.5);border-radius:6px;text-shadow:0 2px 8px rgba(0,0,0,.6)}
  .cap span.q{font-style:italic;font-weight:500;color:#f8e2a8}
  .ref{position:fixed;left:64px;top:52px;font:italic 500 34px "Cormorant Garamond",serif;color:#efe0bf;letter-spacing:.04em;text-shadow:0 2px 6px rgba(0,0,0,.7);opacity:0}
  .tsub{position:fixed;left:0;right:0;top:640px;text-align:center;font:italic 500 56px "Cormorant Garamond",serif;color:#efe2c4;letter-spacing:.03em;text-shadow:0 2px 10px rgba(0,0,0,.8);opacity:0}
  .card{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;color:#f3e6c8;text-shadow:0 2px 12px rgba(0,0,0,.8)}
  .card .a{font:600 104px "Cormorant Garamond",serif;letter-spacing:.06em}.card .b{font:italic 500 44px "Cormorant Garamond",serif;margin-top:18px;color:#e8c888}.card .c{font:500 34px "Cormorant Garamond",serif;margin-top:36px;color:#cfc2a6;letter-spacing:.05em}`;
  if (VERT) css.textContent += `.cap{bottom:300px}.cap span{max-width:940px;font-size:56px}.ref{top:190px;left:60px;font-size:38px}.tsub{top:1150px;font-size:50px}.card .a{font-size:72px}.card .b{font-size:40px}.card .c{font-size:34px}`;
  document.head.appendChild(css);
  cap = document.createElement('div'); cap.className = 'cap'; document.body.appendChild(cap);
  refEl = document.createElement('div'); refEl.className = 'ref'; document.body.appendChild(refEl);
  titleSub = document.createElement('div'); titleSub.className = 'tsub'; titleSub.textContent = 'o homem que fugiu de Deus'; document.body.appendChild(titleSub);
  card = document.createElement('div'); card.className = 'card'; card.innerHTML = '<div class="a">ECOS DA ESCRITURA</div><div class="b">Histórias da Bíblia. Lições para hoje.</div><div class="c">Jonas 1 – 4</div>'; document.body.appendChild(card);
  window.DUR = SDUR;
  window.EV = SHOTS.map(([id, t]) => ({ t, type: 'cut', id }));
  window.TEXTS = tau => texts(srcT(tau));
  return frame;
}

function plate(pl, o) {
  const app = o.appear;
  const ua = app === undefined ? 1 : seg(o.t, app + .25, app + .6);
  if (ua > 0) E.under(pl.tex, pl.w, pl.h, { ...o, alpha: (o.alpha ?? 1) * ua });
  E.draw(pl.b, { ...o, appear: app === undefined ? -1e6 : app, appDur: .14 });
}
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const about = (px, py, a) => mul([1, 0, 0, 1, px, py], mul([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0], [1, 0, 0, 1, -px, -py]));
// the great fish: (x,y) body centre, L length, f facing, mouth 0..1, sway = slow body roll
function drawFish(x, y, L, f, mouth, o, sway = 0) {
  const s = L / FISH.w, M = mul([1, 0, 0, 1, x, y], mul([f * s, 0, 0, s, 0, 0], mul(about(600, 260, sway), [1, 0, 0, 1, -600, -260])));
  plate(PL.fishB, { ...o, M });
  if (mouth > 0) { const [hx, hy] = FISH.hinge; dyn.push({ x: 1040, y: 300 + mouth * 40, ang: 0, len: 250, wid: 30 + mouth * 150, c: hex('#3a1216'), c2: hex('#16060a'), type: 2, seed: 77, hgt: .6 }); E.drawNow(dyn.data(), { ...o, M, run: 0 }); dyn.clear(); }
  plate(PL.fishJ, { ...o, M: mul(M, about(FISH.hinge[0], FISH.hinge[1], mouth * .62)) });
  return [x + f * s * (FISH.mouth[0] - 600), y + s * (FISH.mouth[1] - 260)];
}
const flush = o => { if (dyn.n) E.drawNow(dyn.data(), o); dyn.clear(); };
const grey = (o, g = G) => ({ ...o, grey: g, reveal: NEVER });
const col = o => ({ ...o, grey: 0 });

// ================= SHOTS =================
const S = {};
// 1 · cold open: three days in the dark, inside the fish
S.belly1 = (t, x) => {
  const cam = { x: 1056, y: key(t, [[0, 600], [CUT.title, 690]]), zoom: key(t, [[0, 1.0, x => x], [CUT.title, 1.2]]) };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.belly, o);
  motes(dyn, t, { x0: 300, x1: 1800, y0: 100, y1: 1000, n: 30, rise: -40, size: 7, col: [.7, .5, .45], alpha: .35, seed: 3 }); flush({ ...o, alpha: x.a });
  const br = Math.sin(t * 1.4) * .02;
  person(dyn, BELLY.jonas[0], BELLY.jonas[1], 300, { kneel: 1, lean: .42 + br, head: .45, armF: [.95, .95], armB: [.8, .9], seed: 11 }); flush({ ...o, alpha: x.a, run: .15 });
  const hb = pulse((t + 100 * BEAT) % (BEAT * 2), 0, .18);
  return { ...GREYW, expo: (.88 + hb * .05) * ss(seg(t, 0, 1.3)), light: [-.3, -.7, .7] };
};
// 2 · title over a dark, quiet sea
S.title = (t, x) => {
  const cam = { x: 1056, y: key(t, [[CUT.title, 560], [CUT.hill, 590]]), zoom: 1.02 };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.storm, o);
  sea(dyn, t, { hy: STORM.hz, amp: .22, speed: .5, seed: 310 }); flush({ ...o, alpha: x.a });
  E.draw(PL.title.b, { t, cam: { x: W / 2, y: H / 2, zoom: 1 }, M: TR(210, 150), grey: 0, appear: CUT.title + .45, appDur: .16 });
  return { ...GREYW, expo: .78, light: [-.6, -.5, .6] };
};
// 3 · the call: tilt up from the hilltop into a sky that speaks
S.hill = (t, x) => {
  const k = eio(seg(t, CUT.hill, CUT.pano - .3));
  const cam = { x: lerp(880, 1000, k), y: lerp(1170, 900, k), zoom: lerp(1.2, 1.0, k) };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.hill, o);
  const g = eo(seg(t, 17.2, 19.4));
  rays(dyn, { x: 1700, y: -150, ang: 2.2, n: 11, spread: .38, len: 1900, wid: 110, alpha: .2 * g, grow: .4 + .6 * g, seed: 901 }); flush(col({ t, cam, alpha: x.a, run: .6 }));
  const look = ss(seg(t, 17.6, 18.6));
  person(dyn, HILL.jonas[0], HILL.jonas[1], 370, { f: 1, head: -.35 * look, armF: [.15 + .5 * look, .3], armB: [.1, .2], seed: 21 }); flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW, expo: .98 + .06 * g };
};
// 4+5 · Nineveh in the east ... whip-pan west to the port of Jope; Jonah boards the ship to Tarshish
S.pano = (t, x) => {
  const wk = eio(seg(t, T.whip, T.whip + .6));
  let cx = lerp(lerp(3290, 3190, seg(t, CUT.pano, T.whip)), 1330, wk), cy = 560, zoom = 1.05;
  if (t > T.whip + .6) { const k = eio(seg(t, T.whip + .6, 41.2)); cx = lerp(1330, 1120, k); cy = lerp(560, 760, k); zoom = lerp(1.05, 1.42, k); }
  const cam = { x: cx, y: cy, zoom };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.pano, o);
  // ship at the quay; leaves for Tarshish at the end
  const sail = seg(t, 41.0, 43);
  ship(dyn, PANO.ship[0] - ss(sail) * 160, PANO.ship[1] + Math.sin(t * 1.3) * 4, 520, { roll: Math.sin(t * 1.1) * .015, billow: .2 + sail * .5, seed: 701 });
  flush({ ...o, alpha: x.a, run: .2 });
  // Jonah in the east: faces Nineveh, then turns his back and walks west
  if (t < T.whip + .4) {
    const tw = 31.9, walking = t > tw + .3;
    const px = walking ? 2980 - (t - tw - .3) * 120 : 2980;
    person(dyn, px, 1010, 330, { f: t < tw ? 1 : -1, phase: (t - tw) * 5.2, stride: walking ? 1 : 0, head: t < tw ? 0 : .2, seed: 31 });
  }
  // Jonah at the port: along the quay, up the plank, on deck
  if (t > T.whip + .6) {
    let px, py, st = 1, ph = (t - 35) * 5.6;
    const plank0 = [1070, 985], plank1 = [905, 795];
    if (t < 39.6) { const k = seg(t, 35.0, 39.6); px = lerp(1520, plank0[0], k); py = lerp(955, plank0[1], k); }
    else if (t < 41.0) { const k = seg(t, 39.6, 41.0); px = lerp(plank0[0], plank1[0], k); py = lerp(plank0[1], plank1[1], k); }
    else { px = plank1[0] - 40 - ss(sail) * 160; py = plank1[1] - 2; st = 0; }
    const plk = [[1080, 990], [890, 800]];
    if (t < 41.2) dyn.push({ x: (plk[0][0] + plk[1][0]) / 2, y: (plk[0][1] + plk[1][1]) / 2, ang: Math.atan2(plk[1][1] - plk[0][1], plk[1][0] - plk[0][0]), len: 270, wid: 16, c: hex('#7a5a3a'), type: 0, seed: 777 });
    person(dyn, px, py, 230, { f: -1, phase: ph, stride: st, seed: 32, lean: t > 39.6 && t < 41 ? .12 : 0 });
  }
  flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.port = S.pano;
// 6 · the storm
function stormShip(t, amp) { const roll = (Math.sin(t * 1.25) * .16 + Math.sin(t * 2.7) * .06) * amp, bob = Math.sin(t * 1.6) * 22 * amp; return { roll, bob }; }
const FLASH = [T.thunder1, T.thunder2, T.thunder3, 59.4, 63.7];
const flashAt = t => FLASH.reduce((a, f) => a + pulse(t, f, .22) + pulse(t, f + .14, .12) * .6, 0);
S.storm = (t, x) => {
  const cam = { x: 1056 + Math.sin(t * .9) * 30, y: 560 + Math.sin(t * 1.3) * 14, zoom: key(t, [[CUT.storm, 1.04], [CUT.hold, 1.16]]), rot: Math.sin(t * .8) * .025 };
  const o = grey({ t, cam });
  plate(PL.storm, o);
  for (const [i, f] of FLASH.entries()) if (t > f && t < f + .35) { bolt(dyn, 600 + i * 380, -40, 560, 40 + i * 13, clamp(1 - (t - f) / .35)); }
  flush(col({ t, cam, run: 0 }));
  const { roll, bob } = stormShip(t, 1);
  sea(dyn, t, { hy: STORM.hz, by: 700, rows: 9, amp: 1.2, seed: 320 }); flush({ ...o, run: .3 });
  const sh = ship(dyn, 1056, 712 + bob, 560, { roll, billow: .8, seed: 711 });
  // sailors crying out, arms up
  [[-.62, 1, 0], [-.25, -1, 1.3], [.48, -1, 2.1]].forEach(([u, f, p], i) => { const [px, py] = sh.deck(u); person(dyn, px, py, 112, { f, pal: ROBES.sailor, armF: [2.5 + Math.sin(t * 3 + p) * .25, .2], armB: [2.3 + Math.sin(t * 3.4 + p) * .25, .2], lean: -.1, seed: 120 + i * 7 }); });
  flush({ ...o, run: .2 });
  sea(dyn, t, { hy: 742, by: 1300, rows: 16, amp: 1.2, seed: 330 }); flush({ ...o, run: .3 });
  rain(dyn, t, { W, H, n: VERT ? 300 : 260, alpha: .5, seed: 6 }); flush(grey({ t, hgt: .4 }));
  return { ...GREYW, expo: .8 + flashAt(t) * .55, light: [-.4, -.7, .65] };
};
// 7 · the hold: Jonah asleep while the ship groans
S.hold = (t, x) => {
  const cam = { x: lerp(1080, 1010, ss(seg(t, CUT.hold, CUT.deck))), y: lerp(620, 760, ss(seg(t, CUT.hold, CUT.deck))), zoom: lerp(1.0, 1.32, ss(seg(t, CUT.hold, CUT.deck))), rot: Math.sin(t * 1.25) * .03 };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.hold, o);
  person(dyn, 1190, 905, 300, { f: 1, lie: -1.48, armF: [.4, .3], armB: [.2, .2], head: -.1, seed: 41, lean: Math.sin(t * 1.1) * .01 }); flush({ ...o, alpha: x.a, run: .15 });
  // the lamp swings with the sea
  const a = Math.sin(t * 1.25 - .6) * .38, L = 230, lx = HOLD.lamp[0] + Math.sin(a) * L, ly = 40 + Math.cos(a) * L;
  dyn.push({ x: (HOLD.lamp[0] + lx) / 2, y: (40 + ly) / 2, ang: Math.atan2(ly - 40, lx - HOLD.lamp[0]), len: L, wid: 3, c: hex('#2a1a10'), type: 3, seed: 5 });
  dyn.push({ x: lx, y: ly + 20, ang: Math.PI / 2, len: 54, wid: 40, c: hex('#ffd890'), c2: hex('#f0a040'), type: 2, seed: 6, hgt: 1.3 });
  dyn.push({ x: lx, y: ly + 30, ang: 0, len: 380, wid: 380, c: hex('#ffb860'), type: 2, seed: 7, alpha: .12, hgt: 0 });
  flush(col({ t, cam, alpha: x.a, run: 0 }));
  return { ...GREYW, expo: .9, light: [-.2, -.8, .6] };
};
// 8 · on deck: the lots, "throw me into the sea", the sea goes quiet
S.deck = (t, x) => {
  const calm = ss(seg(t, T.calm, T.calm + 2.4)), amp = lerp(1.25, .12, calm);
  const zk = key(t, [[CUT.deck, 1.72], [T.throwAt, 1.95], [T.throwAt + .3, 1.95], [CUT.under, 1.05]]);
  const cam = { x: key(t, [[CUT.deck, 1020], [T.throwAt, 1080], [CUT.under, 1100]]) + Math.sin(t * .9) * 18 * amp, y: key(t, [[CUT.deck, 560], [T.throwAt, 590], [CUT.under, 600]]), zoom: zk, rot: Math.sin(t * .8) * .025 * amp };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.storm, o);
  for (const [i, f] of FLASH.entries()) if (t > f && t < f + .35 && amp > .6) bolt(dyn, 700 + i * 260, -40, 520, 40 + i * 13, clamp(1 - (t - f) / .35));
  flush(col({ t, cam, alpha: x.a, run: 0 }));
  const { roll, bob } = stormShip(t, amp);
  sea(dyn, t, { hy: STORM.hz, by: 700, rows: 9, amp, seed: 320 }); flush({ ...o, alpha: x.a, run: .3 });
  const sh = ship(dyn, 1056, 712 + bob, 560, { roll, billow: .3 + .5 * amp, seed: 711 });
  const lot = ss(seg(t, T.lots, T.lots + .6)), speak = ss(seg(t, 61.2, 61.9)) * (1 - ss(seg(t, 65.2, 65.8)));
  [[-.62, 1, 0], [-.3, 1, 1.3], [.48, -1, 2.1]].forEach(([u, f, p], i) => {
    const [px, py] = sh.deck(u);
    const point = i === 2 ? lot : lot * .6, pray = (1 - lot) * (1 - calm);
    person(dyn, px, py, 112, { f, pal: ROBES.sailor, armF: [lerp(1.4, 2.5 + Math.sin(t * 3 + p) * .2, pray) * (1 - point) + point * 1.5, .2], armB: [lerp(.3, 2.3, pray), .2], lean: point * .1, head: point * .1, seed: 120 + i * 7 });
  });
  // Jonah: stands, opens his arms when he speaks, then goes over the side
  const th = seg(t, T.throwAt, T.splash);
  if (t < T.splash) {
    const [dx, dy] = sh.deck(.12);
    const fx = lerp(dx, 1560, th), fy = th > 0 ? lerp(dy, 760, th) - Math.sin(th * Math.PI) * 120 : dy;
    person(dyn, fx, fy, 112, { f: -1, armF: [lerp(.2, 1.35, speak) + th * 1.5, .2], armB: [lerp(.1, 1.2, speak) + th * 1.5, .2], head: -.15 * speak, lie: -th * 2.2, seed: 42 });
  }
  flush({ ...o, alpha: x.a, run: .2 });
  // splash
  if (t > T.splash && t < T.splash + 1.6) { const k = (t - T.splash) / 1.6; for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (hash(i * 3.3) - .5) * 1.6, r = (40 + hash(i) * 140) * Math.sin(Math.min(1, k * 2) * Math.PI / 2); dyn.push({ x: 1560 + Math.cos(a) * r, y: 760 + Math.sin(a) * r * (1 - k) + k * k * 160, ang: a, len: 30 + hash(i * 7) * 40, wid: 16, c: [.9, .92, .9], type: 2, seed: 900 + i, alpha: 1 - k }); } }
  sea(dyn, t, { hy: 742, by: 1300, rows: 16, amp, seed: 330 }); flush({ ...o, alpha: x.a, run: .3 });
  rain(dyn, t, { W, H, n: VERT ? 300 : 260, alpha: .5 * (1 - calm), seed: 6 }); flush(grey({ t, hgt: .4, alpha: x.a }));
  return { ...GREYW, expo: lerp(.8, .98, calm) + flashAt(t) * .5 * (1 - calm), light: [-.4, -.7, .65] };
};
// 9 · under the water: sinking; the great fish
S.under = (t, x) => {
  const k = seg(t, CUT.under, CUT.black);
  const cam = { x: 1056, y: lerp(560, 820, eio(k)), zoom: 1.02 };
  const o = grey({ t, cam, appear: x.appear });
  plate(PL.under, o);
  rays(dyn, { x: 700, y: -60, ang: 1.75, n: 9, spread: .6, len: 1300, wid: 90, alpha: .14, col: '#d8f0e8', seed: 950 }); flush(grey({ t, cam, alpha: x.a, run: .6 }));
  const jy = lerp(260, 880, ss(k * 1.15)), jx = 900 + Math.sin(t * .8) * 20;
  const sw = T.swallow;
  const fx = key(t, [[72.0, 2950, x => x], [sw, 1690, eo], [CUT.black, 1000]]), mouth = ss(seg(t, 72.9, 73.9)) * (1 - ss(seg(t, sw - .12, sw + .08)));
  const fs_ = 1700 / FISH.w, mx = fx - fs_ * (FISH.mouth[0] - 600) + 60, my = jy + 10 + fs_ * (FISH.mouth[1] - 260);
  const pull = ss(seg(t, sw - 1.1, sw - .1));
  const jx2 = lerp(jx, mx, pull), jy2 = lerp(jy, my + 60, pull);
  if (t < sw - .1) { person(dyn, jx2, jy2, 250, { f: 1, lie: -.4 - k * .9, armF: [2.6, .2], armB: [2.4, .3], head: .3, seed: 43 }); motes(dyn, t, { x0: jx2 - 60, x1: jx2 + 60, y0: jy2 - 400, y1: jy2 - 150, n: 14, rise: 120, size: 12, col: [.85, .95, .95], alpha: .6, seed: 9 }); }
  flush({ ...o, alpha: x.a, run: .2 });
  drawFish(fx, jy + 10, 1700, -1, mouth, { ...o, appear: undefined }, Math.sin(t * .9) * .03);
  return { ...GREYW, expo: .95 * (1 - ss(seg(t, sw + .2, CUT.black))) + .05 };
};
// 10 · inside the fish again — silence; prayer; colour comes back stroke by stroke
S.belly2 = (t, x) => {
  const cam = { x: 1056, y: key(t, [[CUT.black, 700], [T.orou, 760], [CUT.beach, 680]]), zoom: key(t, [[CUT.black, 1.12, x => x], [T.orou, 1.42], [T.orou + 2, 1.42], [CUT.beach, 1.18]]) };
  const o = { t, cam, grey: 1, reveal: T.orou, revDur: .35 };
  plate(PL.belly, { ...o, revC: [BELLY.jonas[0], BELLY.jonas[1] - 150, 420] });
  const kneelUp = ss(seg(t, T.kneel, T.kneel + 1.6)), lift = ss(seg(t, T.orou - .7, T.orou + .4));
  const g = eo(seg(t, T.orou, T.orou + 2.5));
  rays(dyn, { x: 1056, y: -260, ang: Math.PI / 2, n: 9, spread: .5, len: 1400, wid: 120, alpha: .22 * g, grow: .3 + .7 * g, seed: 960 }); flush({ t, cam, grey: 0, run: .6 });
  person(dyn, BELLY.jonas[0], BELLY.jonas[1], 300, { kneel: 1, lean: lerp(.42, -.12, kneelUp), head: lerp(.45, -.5, kneelUp), armF: [lerp(.95, 2.75, lift), lerp(.95, .15, lift)], armB: [lerp(.8, 2.55, lift), lerp(.9, .2, lift)], seed: 11 });
  flush({ ...o, run: .15 });
  motes(dyn, t, { x0: 500, x1: 1600, y0: 200, y1: 1000, n: 40, rise: 30, size: 8, col: [1, .86, .55], alpha: .45 * g, seed: 13 }); flush({ t, cam, grey: 0 });
  // raking light: drops to a grazing angle at the prayer, then settles
  const rk = Math.sin(Math.PI * seg(t, T.orou - .2, T.orou + 4.5));
  const fadeUp = ss(seg(t, CUT.black + .2, T.silence1 + .4));
  const post = lerpPost(GREYW, WARM, ss(seg(t, T.orou, T.colour1)));
  return { ...post, expo: post.expo * lerp(.1, 1, fadeUp) * (1 + .12 * g), light: [-.5, -.6, lerp(.7, .16, rk)], norm: 3.2 + rk * 2.5, spec: post.spec + rk * .2 };
};
S.black = S.belly2;
function lerpPost(a, b, k) { const o = {}; for (const n of new Set([...Object.keys(a), ...Object.keys(b)])) { const va = a[n] ?? b[n], vb = b[n] ?? a[n]; o[n] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], k)) : lerp(va, vb, k); } return o; }
// 11 · the beach at sunrise: thrown up on dry land; the second call; this time he goes
S.beach = (t, x) => {
  const k = ss(seg(t, CUT.beach, 98)), wk = seg(t, 100.6, CUT.city);
  const cam = { x: lerp(840, 1050, k) + wk * 140, y: lerp(780, 620, k), zoom: lerp(1.36, 1.04, k) };
  const o = col({ t, cam, appear: x.appear });
  plate(PL.beach, o);
  // foam lines breathing on the shore
  for (let i = 0; i < 18; i++) { const u = i / 17, xx = u * 2112, yy = 812 + u * 50 + Math.sin(t * .9 + i) * 10; dyn.push({ x: xx, y: yy, ang: .02, len: 150, wid: 9, c: [.96, .95, .9], type: 0, seed: 600 + i, alpha: .55 + .3 * Math.sin(t * .9 + i) }); }
  // the fish backs away into the sea
  const fk = seg(t, 95, 98.5);
  const g = eo(seg(t, 97.6, 99.5));
  flush({ ...o, alpha: x.a, run: .2 });
  if (fk < 1) drawFish(330 - fk * 260, 690 + fk * 60, 560, 1, 1 - ss(seg(t, 94.6, 95.4)), { ...o, appear: undefined, alpha: (1 - ss(fk)) * x.a }, Math.sin(t) * .02);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) { const xx = 20 + i * 44 + (r % 2) * 20, yy = 772 + r * 16 + Math.sin(t * 1.3 + i + r) * 4, c = r === 3 ? [.93, .93, .88] : [.25 + r * .05, .47 + r * .04, .56]; dyn.push({ x: xx, y: yy, ang: .03, len: 70, wid: 20, c, c2: c.map(v => v * .9), type: 0, seed: 640 + i + r * 20, alpha: r === 3 ? .7 : 1 }); }
  flush({ ...o, alpha: x.a, run: .2 });
  rays(dyn, { x: BEACH.sun[0], y: BEACH.sun[1], ang: Math.PI * .93, n: 9, spread: .42, len: 900, wid: 70, alpha: .2 * g, grow: .5 + .5 * g, seed: 970 }); flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  // Jonah: tumbles out onto the sand, lies, rises, walks toward the light
  const out = seg(t, T.spit, T.spit + 1.1);
  const lying = 1 - ss(seg(t, 98.6, 100.2));
  let px = lerp(560, BEACH.jonas[0], eo(out)), py = lerp(730, BEACH.jonas[1], eo(out)) - Math.sin(out * Math.PI) * 120;
  if (t > 100.6) px += (t - 100.6) * 140;
  person(dyn, px, py, 290, { f: 1, lie: -1.5 * lying * (out < 1 ? out : 1), kneel: lying > .02 && lying < .98 ? .6 : 0, phase: (t - 100.6) * 5.4, stride: t > 100.6 ? 1 : 0, head: -.3 * g, seed: 44 });
  flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [-.7, -.4, .55] };
};
// 12 · Nineveh: the warning; from the king to the least, the city kneels
const CROWD = []; { for (let r = 0; r < 4; r++) for (let i = 0; i < 11; i++) { const y = 920 + r * 70, x = 640 + i * 105 + (r % 2) * 50 + (hash(r * 11 + i) - .5) * 40; CROWD.push({ x, y, H: 175 + r * 34, f: x < 1200 ? -1 : (hash(i + r) > .3 ? -1 : 1), seed: 200 + r * 20 + i, pal: { ...ROBES.sack, robe: ['#6e5a42', '#7a6248', '#5e4c3a', '#84694a'][(i + r) % 4] } }); } }
S.city = (t, x) => {
  const k = eio(seg(t, 109.4, 112.6));
  const cam = { x: lerp(620, 1056, k), y: lerp(760, 640, k), zoom: lerp(1.42, 1.0, k) * (1 + .05 * ss(seg(t, 112.6, CUT.pano2))) };
  const o = col({ t, cam, appear: x.appear });
  plate(PL.city, o);
  const kingK = ss(seg(t, 112.5, 113.6));
  person(dyn, CITY.king[0], 822, 300, { f: -1, kneel: kingK, head: .35 * kingK, lean: .1 * kingK, armF: [lerp(.2, 1.6, kingK), .4], pal: { robe: '#5a2e5e', mantle: '#c49a3a', skin: '#a07050', hair: '#2a2020' }, seed: 61 });
  dyn.push({ x: CITY.king[0] - 6, y: 822 - lerp(300 * .93, 300 * .66, kingK) - 10, ang: 0, len: 46, wid: 20, c: hex('#f0c040'), type: 0, seed: 62, hgt: 1.3 });
  for (const p of CROWD) { const d = Math.hypot(p.x - CITY.king[0], (p.y - 880) * 2); const kt = 113.2 + d / 520; const kn = ss(seg(t, kt, kt + .9)); person(dyn, p.x, p.y, p.H, { f: p.f, kneel: kn, head: .4 * kn, lean: .15 * kn, armF: [lerp(.15, 1.4, kn), .5], pal: p.pal, seed: p.seed }); }
  // Jonah on the step, proclaiming
  const proclaim = ss(seg(t, 103.6, 104.3)) * (1 - ss(seg(t, 109.6, 110.4)));
  person(dyn, CITY.jonas[0] + 20, 832, 300, { f: 1, armF: [lerp(.2, 2.7 + Math.sin(t * 2) * .12, proclaim), .2], armB: [.25, .3], head: -.15 * proclaim, seed: 45 });
  flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: [-.6, -.6, .6] };
};
// 13 · the same view of Nineveh, now in colour: "and God had compassion"
S.pano2 = (t, x) => {
  const cam = { x: lerp(3290, 3330, seg(t, CUT.pano2, CUT.hill2)), y: 560, zoom: lerp(1.08, 1.2, ss(seg(t, CUT.pano2, CUT.hill2))) };
  const o = col({ t, cam, appear: x.appear });
  plate(PL.pano, o);
  const g = eo(seg(t, T.compassion - .2, T.compassion + 2.2));
  rays(dyn, { x: 3560, y: -380, ang: Math.PI / 2, n: 13, spread: .7, len: 1300, wid: 120, alpha: .24 * g, grow: .3 + .7 * g, seed: 980 }); flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  return { ...WARM, expo: 1.03 + .05 * g };
};
// 14 · the hill again at sundown, in colour; the light goes out
S.hill2 = (t, x) => {
  const k = ss(seg(t, CUT.hill2, T.lightOut0));
  const cam = { x: lerp(1060, 940, k), y: lerp(1010, 1150, k), zoom: lerp(1.0, 1.28, k) };
  const o = col({ t, cam, appear: x.appear });
  plate(PL.hill, o);
  person(dyn, HILL.jonas[0], HILL.jonas[1], 370, { f: 1, kneel: 1, lean: .05, head: lerp(0, -.25, ss(seg(t, 130.4, 131.6))), armF: [.7, .9], armB: [.6, .9], seed: 21 }); flush({ ...o, alpha: x.a, run: .15 });
  const out = ss(seg(t, T.lightOut0, T.lightOut1));
  return { ...WARM, expo: lerp(1.02, .32, out), light: [-.9, -.2, lerp(.6, .1, out)], norm: 3.2 + out * 3, spec: .26 + out * .3, vig: .3 + out * .4 };
};
S.end = (t, x) => { const p = S.hill2(t, { a: 1 }); return { ...p, expo: p.expo * (1 - ss(seg(t, DUR - .9, DUR - .1))) }; };

const TRANS = { title: 1, hill: 1, pano: 1, hold: 1, deck: 1, under: 1, beach: 1, city: 1, pano2: 1, hill2: 1 };   // paint-over sweeps; the rest are hard cuts or continuous
function frame(tau) {
  const t = srcT(tau);
  let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][1]) i++;
  const [id, t0] = SHOTS[i];
  CUR = id; CURT = t;
  E.begin();
  const tr = TRANS[id] && i > 0 && t < t0 + .7;
  if (tr) { CUR = SHOTS[i - 1][0]; S[CUR](t, { a: 1 }); CUR = id; }
  const post = S[id](t, { appear: TRANS[id] ? t0 : undefined, a: TRANS[id] ? ss(seg(t, t0 + .3, t0 + .65)) : 1 });
  E.finish(post);
  overlays(t);
}

// ================= text over the painting =================
const REFS = [[17.4, 24.4, 'Jonas 1:2'], [35.6, 42.4, 'Jonas 1:3'], [43.4, 51.0, 'Jonas 1:4–5'], [56.9, 70.2, 'Jonas 1:7–15'], [71.2, 75.2, 'Jonas 1:17'], [85.9, 92.8, 'Jonas 2:2 · 2:9'], [94.0, 96.9, 'Jonas 2:10'], [103.8, 109.6, 'Jonas 3:4'], [110.2, 116.8, 'Jonas 3:5–6'], [118.2, 121.3, 'Jonas 3:10']];
const QUOTE = new Set(['Na minha angústia, clamei ao Senhor, e ele me respondeu.', 'A salvação vem do Senhor.', 'vá à grande cidade de Nínive e clame contra ela.', 'Ele mesmo disse: lancem-me ao mar, e o mar se acalmará.', 'e Nínive será destruída.']);
let lastCap = null;
const CLEAN = new URLSearchParams(location.search).get('clean') === '1';
function overlays(t) {
  if (CLEAN) { cap.style.opacity = 0; refEl.style.opacity = 0; titleSub.style.opacity = 0; card.style.opacity = 0; return; }
  const c = cues.find(c => t >= c.t0 && t < c.t1);
  const key_ = c ? c.text : null;
  if (key_ !== lastCap) { cap.innerHTML = c ? `<span class="${QUOTE.has(c.text) ? 'q' : ''}">${c.text}</span>` : ''; lastCap = key_; }
  if (c) { const a = Math.min(1, (t - c.t0) / .12, (c.t1 - t) / .12); cap.style.opacity = a; }
  const r = REFS.find(([a, b]) => t >= a && t < b);
  refEl.textContent = r ? r[2] : ''; refEl.style.opacity = r ? Math.min(1, (t - r[0]) / .3, (r[1] - t) / .3) : 0;
  titleSub.style.opacity = Math.min(ss(seg(t, CUT.title + 1.6, CUT.title + 2.4)), 1 - ss(seg(t, CUT.hill - .5, CUT.hill)));
  card.style.opacity = ss(seg(t, T.endIn + .6, T.endIn + 1.8)) * (1 - ss(seg(t, DUR - .9, DUR - .2)));
}
function texts(t) {
  const out = [];
  if (t >= CUT.title + 2.4 && t < CUT.hill - .5) out.push({ id: 'tsub', text: 'JONAS — o homem que fugiu de Deus', x0: 560, y0: 380, x1: 1360, y1: 720 });
  const r = REFS.find(([a, b]) => t >= a + .3 && t < b - .3); if (r) out.push({ id: 'ref', text: r[2], x0: 64, y0: 52, x1: 400, y1: 100 });
  if (t >= T.endIn + 1.8 && t < DUR - .9) out.push({ id: 'card', text: 'ECOS DA ESCRITURA Histórias da Bíblia. Lições para hoje. Jonas 1 – 4', x0: 300, y0: 400, x1: 1620, y1: 700 });
  return out;
}
