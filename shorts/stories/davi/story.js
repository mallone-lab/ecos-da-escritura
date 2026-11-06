// DAVI E GOLIAS — plates and shots (horizontal 1920x1080; plates 2112x1188)
import { Ref, paintRef } from '../../engine/plate.js';
import { hex, mixc, shade } from '../../engine/impasto.js';
import { P, E, lin, rad, lerp, clamp, ss, seg, eo, eio, hash } from '../../scenes/common.js';
import { person, rays, motes } from '../../scenes/actors.js';
import { GREYW, WARM, key, lerpPost } from '../../runner.js';

export const HOOK = 'QUASE 3 METROS.<br><b>E UM MENINO COM UMA FUNDA.</b>';
export const COVER = 'O <b>gigante</b><br>caiu<small>com uma só pedra</small>';
export const COVER_T = 81.6;
export const BOOK = '1 Samuel 17';
export const REFS = [['l02', 'l02', '1 Samuel 17:3'], ['l03', 'l04', '1 Samuel 17:8–16'], ['l05', 'l06', '1 Samuel 17:17–26'], ['l07', 'l08', '1 Samuel 17:33–37'], ['l09', 'l09', '1 Samuel 17:39–40'], ['l10', 'l10', '1 Samuel 17:43–45'], ['l11', 'l12', '1 Samuel 17:48–49'], ['l13', 'l13', '1 Samuel 17:47']];
export const QUOTES = ['l08', 'l13'];
const PW = 2112, PH = 1188;
const GOL = { robe: '#7a6a52', mantle: '#a8864a', skin: '#9a6a4a', hair: '#2a1a14' };
const DAVI = { robe: '#c8b08a', mantle: '#5a7a4a', skin: '#c08a68', hair: '#5a3a22' };
const SAUL = { robe: '#5a2e5e', mantle: '#c49a3a', skin: '#a07050', hair: '#2a2020' };
const SOLD = ['#6a5a42', '#5a6070', '#7a5a4a', '#8a7a5a'];

function buildValley() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, 680], [0, 680]]), lin(0, 0, 0, 600, [[0, '#4a6a9a'], [.6, '#b8b4b0'], [1, '#f0d4a0']]), { dir: -3, fallback: -3, group: 'sky', maxR: 44 });
  for (let i = 0; i < 5; i++) R.fill(E(hash(i * 3.1) * PW, 90 + hash(i * 7.3) * 260, 300, 46), lin(0, 0, 0, 400, [[0, '#9a9ab0'], [1, '#e8c8a8']]), { dir: -3, group: 'sky', maxR: 30 });
  R.fill(c => { c.moveTo(-50, 560); c.bezierCurveTo(300, 380, 600, 400, 860, 640); c.lineTo(860, PH); c.lineTo(-50, PH); c.closePath(); }, lin(0, 400, 0, PH, [[0, '#9a9a6a'], [1, '#5a5a3a']]), { dir: 0, fallback: 0, group: 'hillL', maxR: 26 });
  R.fill(c => { c.moveTo(PW + 50, 560); c.bezierCurveTo(1800, 380, 1500, 400, 1250, 640); c.lineTo(1250, PH); c.lineTo(PW + 50, PH); c.closePath(); }, lin(0, 400, 0, PH, [[0, '#a8946a'], [1, '#6a5a3a']]), { dir: 0, fallback: 0, group: 'hillR', maxR: 26 });
  R.fill(P([[640, 560], [1460, 560], [1540, PH], [560, PH]]), lin(0, 600, 0, PH, [[0, '#b8a478'], [1, '#8a744a']]), { dir: 0, fallback: 0, group: 'valley', maxR: 24 });
  R.fill(c => { c.moveTo(1040, 600); c.bezierCurveTo(1000, 760, 1150, 900, 1020, PH); c.lineTo(1120, PH); c.bezierCurveTo(1240, 900, 1090, 760, 1070, 600); c.closePath(); }, lin(0, 600, 0, PH, [[0, '#8aa8b4'], [1, '#5a7a8a']]), { dir: 'edge', group: 'stream', maxR: 10 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1201, rev: (x, y) => Math.hypot(x - 1300, (y - 900) * 1.2) / 900 + hash(x * .3 + y) * .2 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
function buildTent() {
  const R = new Ref(PW, PH, .5);
  R.fill(P([[0, 0], [PW, 0], [PW, PH], [0, PH]]), rad(1056, 500, 30, 1300, [[0, '#9a7a5a'], [.6, '#5a4232'], [1, '#2a1c14']]), { dir: 90, fallback: 90, group: 'cloth', maxR: 40 });
  for (let k = 0; k < 7; k++) R.line(c => { c.moveTo(k * 330 - 100, 0); c.quadraticCurveTo(k * 330 + 60, 500, k * 330 - 40, PH); }, 'rgba(40,24,16,.5)', 18, { dir: 'edge', group: 'cloth', maxR: 4 });
  R.fill(P([[0, 900], [PW, 900], [PW, PH], [0, PH]]), lin(0, 900, 0, PH, [[0, '#7a5a3a'], [1, '#3a2a1a']]), { dir: 0, fallback: 0, group: 'floor', maxR: 22 });
  R.fill(P([[1300, 900], [1300, 660], [1600, 660], [1600, 900]]), lin(1300, 0, 1600, 0, [[0, '#e0b050'], [1, '#9a6a24']]), { dir: 90, group: 'throne', maxR: 10 });
  // Saul's armour on a stand
  R.fill(P([[500, 900], [500, 560], [560, 520], [640, 520], [700, 560], [700, 900]]), lin(500, 0, 700, 0, [[0, '#b8a07a'], [1, '#6a5a42']]), { dir: 90, group: 'armor', maxR: 8 });
  const st = paintRef(R, { R: [22, 11, 5.5, 2.8], T: 12, seed: 1202 });
  return { strokes: st, ref: R, w: PW, h: PH };
}
export const PLATES = { valley: buildValley, tent: buildTent };

function goliath(K, x, y, H, o = {}) { person(K.dyn, x, y, H, { f: o.f ?? -1, pal: GOL, helmet: '#8a7a58', spear: 1, armF: o.armF || [.5, .3], armB: o.armB || [.3, .3], head: o.head ?? 0, lie: o.lie ?? 0, lean: o.lean ?? 0, phase: o.phase, stride: o.stride, seed: 91 }); }
function david(K, x, y, H, o = {}) { person(K.dyn, x, y, H, { f: o.f ?? 1, pal: DAVI, beard: false, armF: o.armF || [.3, .3], armB: o.armB || [.2, .3], head: o.head ?? 0, kneel: o.kneel ?? 0, lean: o.lean ?? 0, phase: o.phase, stride: o.stride, seed: 92 }); }
function army(K, t, o, side, n, y0, H, tremble = 0) { for (let i = 0; i < n; i++) { const x = side < 0 ? 80 + i * 70 + (i % 2) * 20 : PW - 80 - i * 70 - (i % 2) * 20; const yy = y0 + (i % 3) * 18 - (side < 0 ? i : i) * 6; person(K.dyn, x, yy, H, { f: -side, pal: { robe: SOLD[i % 4], mantle: '#4a3a2a', skin: '#a07050', hair: '#2a2220' }, spear: i % 3 === 0 ? 1 : 0, armF: [.5 + Math.sin(t * 18 + i) * .04 * tremble, .4], lean: tremble * .08, seed: 1300 + i * 7 + (side > 0 ? 500 : 0) }); } K.flush({ ...o, run: .15 }); }

export const S = {};
S.hook = (t, x, K) => {
  const b = K.C('valley');
  const cam = { x: 1380, y: key(t, [[0, 640], [b, 560]]), zoom: key(t, [[0, 1.05], [b, 1.25]]) };
  const o = K.grey({ t, cam });
  K.plate(K.PL.valley, o);
  goliath(K, 1400, 1080, 900, { armF: [.6, .3], head: -.05 }); K.flush({ ...o, run: .15 });
  return { ...GREYW, expo: .9 * ss(seg(t, 0, .8)), light: [.5, -.7, .5] };
};
S.valley = (t, x, K) => {
  const a = K.C('valley'), b = K.C('shout');
  const cam = { x: 1056, y: lerp(560, 600, seg(t, a, b)), zoom: lerp(1.0, 1.06, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, o);
  army(K, t, { ...o, alpha: x.a }, -1, 9, 560, 110); army(K, t, { ...o, alpha: x.a }, 1, 9, 560, 110);
  return { ...GREYW };
};
S.shout = (t, x, K) => {
  const a = K.C('shout'), b = K.C('camp'), half = K.L('l04') - .4;
  const isrl = t > half;
  const cam = isrl ? { x: 500, y: 600, zoom: lerp(1.35, 1.45, seg(t, half, b)) } : { x: 1300, y: lerp(640, 600, seg(t, a, half)), zoom: lerp(1.3, 1.4, ss(seg(t, a, half))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, o);
  if (!isrl) { goliath(K, 1320, 980, 560, { armF: [2.6 + Math.sin(t * 3) * .1, .1], head: -.1 }); K.flush({ ...o, alpha: x.a, run: .15 }); }
  else army(K, t, { ...o, alpha: x.a }, -1, 9, 760, 260, 1);
  return { ...GREYW };
};
S.camp = (t, x, K) => {
  const a = K.C('camp'), b = K.C('saul'), ask = K.L('l06');
  const cam = { x: lerp(560, 700, seg(t, a, b)), y: 620, zoom: lerp(1.35, 1.45, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, o);
  army(K, t, { ...o, alpha: x.a }, -1, 6, 820, 300, .3);
  const walk = seg(t, a, ask - .3);
  david(K, lerp(200, 640, walk), 900, 340, { phase: (t - a) * 5, stride: walk < 1 ? 1 : 0, armF: [t > ask ? 1.6 : .9, t > ask ? .2 : 1.2], head: t > ask ? -.2 : 0 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...GREYW };
};
S.saul = (t, x, K) => {
  const a = K.C('saul'), b = K.C('stones'), speak = K.L('l08');
  const cam = { x: lerp(1100, 1000, seg(t, a, b)), y: 640, zoom: lerp(1.15, 1.3, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.tent, o);
  person(K.dyn, 1300, 1000, 520, { f: -1, crown: 1, pal: SAUL, armF: [lerp(.3, 1.1, ss(seg(t, a + .5, a + 1.5))) * (t < speak ? 1 : .4), .3], seed: 93 });
  david(K, 800, 1000, 440, { armF: [t > speak ? 1.5 + Math.sin(t * 2) * .1 : .3, .3], head: t > speak ? -.15 : .1 }); K.flush({ ...o, alpha: x.a, run: .15 });
  if (t > speak) { const g = ss(seg(t, speak, speak + 1)); rays(K.dyn, { x: 800, y: -200, ang: Math.PI / 2, n: 7, spread: .3, len: 1300, wid: 100, alpha: .16 * g, seed: 1400 }); K.flush(K.col({ t, cam, run: .6 })); }
  return { ...GREYW };
};
S.stones = (t, x, K) => {
  const a = K.C('stones'), b = K.C('face');
  const cam = { x: 1080, y: lerp(900, 880, seg(t, a, b)), zoom: lerp(1.6, 1.75, ss(seg(t, a, b))) };
  const o = K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, o);
  david(K, 1020, 1000, 330, { kneel: 1, lean: .45, head: .55, armF: [.9 + Math.sin(t * 2.5) * .25, .5] }); K.flush({ ...o, alpha: x.a, run: .15 });
  for (let k = 0; k < 5; k++) { const ap = seg(t, a + 1.4 + k * .8, a + 1.6 + k * .8); if (ap > 0) K.dyn.push({ x: 1180 + k * 30, y: 1000, ang: 0, len: 22, wid: 18, c: shade(hex('#b8b0a4'), .9 + hash(k) * .2), type: 2, seed: 1450 + k, alpha: ap }); }
  K.flush({ ...o, alpha: x.a });
  return { ...GREYW };
};
// the valley: David faces the giant; runs; the sling; the stone; the fall
const duel = (t, x, K, mode) => {
  const a = K.C(mode), rl = K.T.release, hit = K.T.hit;
  let cam;
  if (mode === 'face') cam = { x: 1056, y: lerp(640, 660, seg(t, a, K.C('sling'))), zoom: lerp(1.0, 1.08, ss(seg(t, a, K.C('sling')))) };
  else if (mode === 'sling') cam = { x: lerp(900, 1050, seg(t, a, rl)), y: 720, zoom: lerp(1.3, 1.5, ss(seg(t, a, rl))) };
  else cam = { x: 1260, y: key(t, [[a, 640], [hit + 1.5, 680]]), zoom: key(t, [[a, 1.35], [hit + 2.5, 1.12]]), rot: t > hit && t < hit + .6 ? Math.sin((t - hit) * 40) * .01 * (1 - (t - hit) / .6) : 0 };
  const o = mode === 'fall' ? { t, cam, grey: 1, reveal: hit, revDur: .3, appear: x.appear } : K.grey({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, mode === 'fall' ? { ...o, revC: [1400, 900, 700] } : o);
  const run = mode === 'sling' ? seg(t, a, rl - .9) : mode === 'fall' ? 1 : 0;
  const dx = lerp(700, 960, run), dy = 1000;
  const fall = mode === 'fall' ? ss(seg(t, hit + .1, hit + 1.4)) : 0;
  const lie = fall * -1.55;
  goliath(K, 1420, 1000, 620, { armF: mode === 'face' ? [1.2 + Math.sin(t * 2) * .1, .4] : [.6, .3], head: mode === 'face' ? .1 : 0, lie: -lie, lean: fall * .2 }); K.flush({ ...o, alpha: x.a, run: .15 });
  const spin = mode === 'sling' && t > rl - 1.2 && t < rl;
  david(K, dx, dy, 340, { phase: (t - a) * 7, stride: mode === 'sling' && run < 1 ? 1 : 0, armF: spin ? [2.9, .2] : mode === 'fall' ? [1.4, .2] : [.4, .4], head: -.25 }); K.flush({ ...o, alpha: x.a, run: .15 });
  if (spin) { const ang = (t - rl) * 24; for (let k = 0; k < 3; k++) K.dyn.push({ x: dx + 40 + Math.cos(ang - k * .4) * 60, y: dy - 400 + Math.sin(ang - k * .4) * 30, ang: ang, len: 40, wid: 5, c: hex('#3a2a1a'), type: 3, seed: 1500 + k, alpha: 1 - k * .3 }); K.flush(K.grey({ t, cam })); }
  // the stone in flight
  if (t > rl && t < hit) { const u = seg(t, rl, hit); K.dyn.push({ x: lerp(dx + 60, 1430, u), y: lerp(dy - 400, 1000 - 620 * .92, u) - Math.sin(u * Math.PI) * 40, ang: 0, len: 18, wid: 16, c: hex('#d8d0c4'), type: 2, seed: 1510 }); K.flush(K.col({ t, cam })); }
  if (mode === 'fall') { const g = eo(seg(t, hit, hit + 2.5)); rays(K.dyn, { x: dx, y: -200, ang: Math.PI / 2 - .1, n: 9, spread: .35, len: 1500 * (.3 + .7 * g), wid: 120, alpha: .2 * g, seed: 1520 }); K.flush({ t, cam, grey: 0, run: .6 });
    if (t > hit + 1.2 && t < hit + 3.5) { const k = seg(t, hit + 1.2, hit + 3.5); for (let i = 0; i < 16; i++) K.dyn.push({ x: 1300 + (hash(i) - .5) * 600 * (.4 + k), y: 1000 - k * 120 * hash(i * 3), ang: 0, len: 120 + k * 200, wid: 80 + k * 120, c: hex('#c8b090'), type: 2, seed: 1530 + i, alpha: (1 - k) * .5, hgt: .3 }); K.flush(K.col({ t, cam })); } }
  const post = mode === 'fall' ? lerpPost(GREYW, WARM, ss(seg(t, hit, hit + 3))) : GREYW;
  return { ...post, expo: post.expo * (mode === 'fall' && t > hit && t < hit + .2 ? 1.25 : 1) };
};
S.face = (t, x, K) => duel(t, x, K, 'face');
S.sling = (t, x, K) => duel(t, x, K, 'sling');
S.fall = (t, x, K) => duel(t, x, K, 'fall');
const after = (t, x, K, close) => {
  const a = K.C(close ? 'close' : 'glory');
  const cam = close ? { x: lerp(700, 760, seg(t, a, a + 10)), y: lerp(560, 520, seg(t, a, a + 10)), zoom: lerp(1.05, 1.2, ss(seg(t, a, a + 10))) } : { x: 760, y: 640, zoom: lerp(1.3, 1.2, seg(t, a, K.C('close'))) };
  const o = K.col({ t, cam, appear: x.appear });
  K.plate(K.PL.valley, o);
  rays(K.dyn, { x: 700, y: -250, ang: Math.PI / 2, n: 11, spread: .45, len: 1500, wid: 130, alpha: .22, seed: 1540 }); K.flush({ t, cam, grey: 0, alpha: x.a, run: .6 });
  if (!close) army(K, t, { ...o, alpha: x.a }, -1, 9, 620, 200);
  david(K, 760, close ? 760 : 920, close ? 260 : 400, { armF: [close ? .5 : 2.6, .2], armB: [close ? .3 : 2.2, .3], head: -.3, kneel: close ? 1 : 0 }); K.flush({ ...o, alpha: x.a, run: .15 });
  return { ...WARM, light: close ? [-.8, -.3, .45] : [-.4, -.7, .6], expo: close ? lerp(1.02, .9, seg(t, a, a + 10)) : 1.02 };
};
S.glory = (t, x, K) => after(t, x, K, false);
S.close = (t, x, K) => after(t, x, K, true);
