// Ecos da Escritura — Shorts runner (1080x1920). A story module supplies plates and shot functions; the runner paints,
// transitions (paint-over sweeps), captions, scripture references, the hook title, the end card and the cover mode.
import { Impasto, Strokes, F, hex } from './engine/impasto.js';
import { clamp, lerp, ss, seg, eo, eio, hash } from './scenes/common.js';
export let W = 1080, H = 1920; export const NEVER = 1e6, G = .86;
export const GREYW = { expo: .96, sat: .9, contrast: 1.07, vig: .4, spec: .24, shin: 26, lift: [.012, .012, .022] };
export const WARM = { expo: 1.02, sat: 1.07, contrast: 1.04, vig: .3, spec: .26, shin: 26 };
export const key = (t, ks) => { if (t <= ks[0][0]) return ks[0][1]; for (let i = 0; i < ks.length - 1; i++) { const [t0, v0, e] = ks[i], [t1, v1] = ks[i + 1]; if (t < t1) { const k = (e || eio)((t - t0) / (t1 - t0)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); } } return ks[ks.length - 1][1]; };
export const pulse = (t, at, d = .25) => t < at ? 0 : Math.exp(-(t - at) / d);
export const lerpPost = (a, b, k) => { const o = {}; for (const n of new Set([...Object.keys(a), ...Object.keys(b)])) { const va = a[n] ?? b[n], vb = b[n] ?? a[n]; o[n] = Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], k)) : lerp(va, vb, k); } return o; };
export const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
export const about = (px, py, a) => mul([1, 0, 0, 1, px, py], mul([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0], [1, 0, 0, 1, -px, -py]));

export async function setup(canvas, story, TL, { cover = false } = {}) {
  await document.fonts.load('600 100px "Cormorant Garamond"'); await document.fonts.load('italic 500 40px "Cormorant Garamond"');
  W = innerWidth; H = innerHeight; const HZN = W > H;
  const E = new Impasto(canvas, { W, H }), dyn = new Strokes(16384), PL = {};
  const up = (b, sweep = true) => {
    const a = b.strokes.data();
    if (sweep) for (let i = 0; i < b.strokes.n; i++) a[i * F + 14] = a[i * F + 1] / b.h * .4 + a[i * F] / b.w * .15 + hash(i * .37) * .08;
    return { b: E.batch(a), tex: E.texture(b.ref.ctx.canvas), w: b.w, h: b.h };
  };
  for (const [n, fn] of Object.entries(story.PLATES)) { const r = fn(); PL[n] = up(r, r.sweep !== false); }
  const L = id => TL.LINES[id].t, Le = id => TL.LINES[id].e, C = id => TL.CUT[id], T = TL.T;
  // keep every camera inside the painting it looks at (mutates the cam object, so the live strokes drawn with it follow)
  const keepIn = (pl, c) => { if (!c || c._k) return; const z = Math.max(c.zoom, W / pl.w + .001, H / pl.h + .001); const hw = W / 2 / z, hh = H / 2 / z; c.zoom = z; c.x = clamp(c.x, hw, pl.w - hw); c.y = clamp(c.y, hh, pl.h - hh); c._k = 1; };
  const plate = (pl, o) => { keepIn(pl, o.cam); const app = o.appear; const ua = app === undefined ? 1 : seg(o.t, app + .25, app + .6); if (ua > 0) E.under(pl.tex, pl.w, pl.h, { ...o, alpha: (o.alpha ?? 1) * ua }); E.draw(pl.b, { ...o, appear: app === undefined ? -1e6 : app, appDur: .14 }); };
  const flush = o => { if (dyn.n) E.drawNow(dyn.data(), o); dyn.clear(); };
  const K = { E, dyn, PL, TL, L, Le, C, T, plate, flush, grey: (o, g = G) => ({ ...o, grey: g, reveal: NEVER }), col: o => ({ ...o, grey: 0 }) };
  // ---- text over the painting
  const css = document.createElement('style');
  css.textContent = `.cap{position:fixed;left:0;right:0;bottom:300px;text-align:center;pointer-events:none}
  .cap span{display:inline-block;max-width:940px;font:600 56px/1.16 "Cormorant Garamond",serif;color:#f5ead2;padding:10px 28px 14px;background:rgba(12,9,8,.52);border-radius:8px;text-shadow:0 2px 8px rgba(0,0,0,.6)}
  .cap span.q{font-style:italic;font-weight:500;color:#f8e2a8}
  .hook{position:fixed;left:40px;right:40px;top:200px;text-align:center;font:700 92px/1.02 "Cormorant Garamond",serif;color:#f8ecd0;letter-spacing:.03em;text-shadow:0 4px 18px rgba(0,0,0,.85),0 0 2px #000;opacity:0}
  .hook b{color:#f2c45a;font-weight:700}
  .ref{position:fixed;left:60px;top:150px;font:italic 500 38px "Cormorant Garamond",serif;color:#efe0bf;letter-spacing:.04em;text-shadow:0 2px 6px rgba(0,0,0,.8);opacity:0}
  .card{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;color:#f3e6c8;text-shadow:0 2px 12px rgba(0,0,0,.85)}
  .card .a{font:600 74px "Cormorant Garamond",serif;letter-spacing:.06em}.card .b{font:italic 500 42px "Cormorant Garamond",serif;margin-top:16px;color:#e8c888}.card .c{font:500 36px "Cormorant Garamond",serif;margin-top:34px;color:#cfc2a6;letter-spacing:.05em}
  .cover{position:fixed;left:50px;right:50px;top:170px;text-align:center;font:700 112px/.98 "Cormorant Garamond",serif;color:#fbf1d8;text-transform:uppercase;letter-spacing:.01em;text-shadow:0 6px 24px rgba(0,0,0,.9),0 0 3px #000}
  .cover b{color:#f2c45a}.cover small{display:block;margin-top:26px;font:italic 600 54px "Cormorant Garamond",serif;text-transform:none;color:#f0dcb0}
  .brand{position:fixed;left:0;right:0;bottom:120px;text-align:center;font:600 40px "Cormorant Garamond",serif;letter-spacing:.14em;color:#f3e6c8;text-shadow:0 2px 10px rgba(0,0,0,.9)}`;
  if (HZN) css.textContent += `.cap{bottom:58px}.cap span{max-width:1500px;font-size:50px}.hook{top:120px;font-size:96px}.ref{top:52px;left:64px;font-size:34px}
  .card .a{font-size:96px}.card .b{font-size:46px}
  .cover{left:90px;right:auto;width:900px;top:230px;text-align:left;font-size:124px}.cover small{font-size:60px}.brand{left:90px;right:auto;bottom:70px;text-align:left}`;
  document.head.appendChild(css);
  const el = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; document.body.appendChild(d); return d; };
  const cap = el('cap'), ref = el('ref'), hook = el('hook', story.HOOK), card = el('card', `<div class="a">ECOS DA ESCRITURA</div><div class="b">Histórias da Bíblia. Lições para hoje.</div><div class="c">${story.BOOK}</div>`);
  if (cover) { const g = el('shade'); g.style.cssText = HZN ? 'position:fixed;left:0;top:0;bottom:0;width:1200px;background:linear-gradient(90deg,rgba(8,6,4,.78),rgba(8,6,4,.45) 60%,rgba(8,6,4,0))' : 'position:fixed;left:0;right:0;top:0;height:820px;background:linear-gradient(rgba(8,6,4,.72),rgba(8,6,4,.35) 60%,rgba(8,6,4,0))'; const b = el('shade'); b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:300px;background:linear-gradient(rgba(8,6,4,0),rgba(8,6,4,.6))'; el('cover', story.COVER); el('brand', 'ECOS DA ESCRITURA'); }
  const REFS = (story.REFS || []).map(([a, b, s]) => [L(a) - .1, Le(b) + .5, s]);
  const QUOTES = new Set(story.QUOTES || []);
  const quoteText = new Set(TL.CUES.filter(c => QUOTES.has(c.line)).map(c => c.text));
  const hookOut = Le('l01') + .3;
  let last = null;
  function overlays(t) {
    if (cover) { cap.style.opacity = 0; ref.style.opacity = 0; hook.style.opacity = 0; card.style.opacity = 0; return; }
    const c = TL.CUES.find(c => t >= c.t0 && t < c.t1), k = c ? c.text : null;
    if (k !== last) { cap.innerHTML = c ? `<span class="${quoteText.has(c.text) ? 'q' : ''}">${c.text}</span>` : ''; last = k; }
    if (c) cap.style.opacity = Math.min(1, (t - c.t0) / .12, (c.t1 - t) / .12);
    const r = REFS.find(([a, b]) => t >= a && t < b); ref.textContent = r ? r[2] : ''; ref.style.opacity = r ? Math.min(1, (t - r[0]) / .3, (r[1] - t) / .3) : 0;
    hook.style.opacity = Math.min(ss(seg(t, .15, .5)), 1 - ss(seg(t, hookOut - .4, hookOut)));
    card.style.opacity = ss(seg(t, TL.END0 + .3, TL.END0 + 1.1)) * (1 - ss(seg(t, TL.DUR - .7, TL.DUR - .1)));
  }
  window.TEXTS = t => {
    const o = [];
    if (t >= .5 && t < hookOut - .4) o.push({ id: 'hook', text: story.HOOK.replace(/<[^>]+>/g, ''), x0: 40, y0: 120, x1: W - 40, y1: 520 });
    const r = REFS.find(([a, b]) => t >= a + .3 && t < b - .3); if (r) o.push({ id: 'ref', text: r[2], x0: 60, y0: 52, x1: 500, y1: 200 });
    if (t >= TL.END0 + 1.1 && t < TL.DUR - .7) o.push({ id: 'card', text: 'ECOS DA ESCRITURA ' + story.BOOK, x0: 100, y0: H / 2 - 200, x1: W - 100, y1: H / 2 + 200 });
    return o;
  };
  const TRANS = story.TRANS || {};
  window.DUR = TL.DUR;
  window.EV = TL.SHOTS.map(([id, t]) => ({ t, type: 'cut', id }));
  return tau => {
    const t = cover ? story.COVER_T : tau;
    let i = 0; while (i + 1 < TL.SHOTS.length && t >= TL.SHOTS[i + 1][1]) i++;
    const [id, t0] = TL.SHOTS[i];
    E.begin();
    if (TRANS[id] && i > 0 && t < t0 + .7) story.S[TL.SHOTS[i - 1][0]](t, { a: 1 }, K);
    let post = story.S[id](t, { appear: TRANS[id] ? t0 : undefined, a: TRANS[id] ? ss(seg(t, t0 + .3, t0 + .65)) : 1 }, K);
    if (t > TL.END0) post = { ...post, expo: post.expo * lerp(1, .3, ss(seg(t, TL.END0, TL.END0 + 1))) * (1 - ss(seg(t, TL.DUR - .8, TL.DUR - .1))) };
    E.finish(post);
    overlays(t);
  };
}
