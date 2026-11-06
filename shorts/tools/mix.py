# Ecos da Escritura — sound design + final mix for a Short. python tools/mix.py <slug>
# Voice on top (compressed), music ducked ~8 dB under it, beds with gain keys, foley at timeline times,
# a palette-knife scrape on every paint-over cut, and true digital silence where the plan asks for it.
import sys, os, json
LIB = os.environ['LIB']; LIB = LIB[1] + ':' + LIB[2:] if len(LIB) > 2 and LIB[0] == '/' and LIB[2] == '/' else LIB; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, whoosh, creak, heartbeat, compress, add, limit
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); slug = sys.argv[1]; D = os.path.join(ROOT, 'stories', slug)
TL = json.load(open(os.path.join(D, 'out/timeline.json'), encoding='utf-8'))
DUR = TL['DUR'] + .2; N = int(DUR * SR); tt = np.arange(N) / SR
rng = np.random.default_rng(sum(map(ord, slug)))
def fit(x): x = x[:N]; return np.pad(x, (0, N - len(x))) if len(x) < N else x
def put(buf, x, at, g=1., pan=0.): add(buf, x if x.ndim == 1 else x.mean(1), at, g, pan)

def knife(d=.45, v=1.):
    n = noise(d); x = t_(d); g = 1 + 4.8 * np.abs(bp(rng.standard_normal(len(n)), 30, 120, 1))
    return norm((bp(n, 900, 4200) * g + bp(noise(d), 250, 700) * .5) * np.minimum(1, x / .03) * np.exp(-np.maximum(0, x - d * .6) / (d * .15))) * v
def plink(v=1., f=1800):
    d = .14; x = t_(d); fr = f * (1 + 1.2 * np.exp(-x / .012)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_exp(d, .03) * v
def boom(v=1.):
    d = 3.0; x = t_(d); return norm(hp(noise(d), 1500) * env_exp(d, .05) * 1.2 + lp(brown(d), 260) * np.exp(-x / 1.1) * 1.4 + lp(noise(d), 120) * env_exp(d, .4)) * v
def splash(v=1.):
    d = 1.2; out = norm(bp(noise(d), 300, 6500) * env_exp(d, .14)); out[:int(.35 * SR)] += thump(.9, 65)[:int(.35 * SR)]
    for k in range(25): s = int((.05 + rng.random() ** 1.5 * .8) * SR); p = plink(.15 + rng.random() * .3, 1200 + rng.random() * 2500); out[s:s + len(p)] += p[:len(out) - s]
    return norm(out) * v
def step(v=1., surf='stone'):
    d = .14; x = t_(d)
    y = lp(noise(d), 1400) * env_exp(d, .05) if surf == 'sand' else (bp(noise(d), 300, 2500) * env_exp(d, .02) + np.sin(2 * np.pi * 160 * x) * env_exp(d, .03) * .6 if surf == 'wood' else bp(noise(d), 600, 5000) * env_exp(d, .015) + lp(noise(d), 300) * env_exp(d, .02))
    return norm(y) * v
def cloth(d=.5, v=1.):
    n = noise(d); m = np.abs(bp(rng.standard_normal(len(n)), 6, 30, 1)); m /= m.max() + 1e-9
    return norm(bp(n, 800, 5000) * m * np.sin(np.pi * t_(d) / d)) * v
def roar(v=1., d=1.6):     # lion: a growl with a throaty tremolo
    x = t_(d); f0 = 85 + 25 * np.sin(np.pi * x / d)
    saw = 2 * ((np.cumsum(f0) / SR) % 1) - 1
    y = bp(saw, 120, 1800) * (1 + .6 * np.sin(2 * np.pi * 23 * x)) + bp(noise(d), 200, 1500) * .6
    return norm(y * np.sin(np.pi * x / d) ** .7) * v
def coins(v=1.):
    d = .8; out = np.zeros(int(d * SR))
    for k in range(6):
        s = int(k * .07 * SR + rng.random() * 800); dd = .3; x = t_(dd); f = 3200 + rng.random() * 2600
        y = (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * f * 2.7 * x)) * env_exp(dd, .06); out[s:s + len(y)] += y[:len(out) - s]
    return norm(out) * v
def stone(v=1., d=1.6):    # a heavy stone dragged
    x = t_(d); return norm(lp(brown(d), 500) * (1 + 1.5 * np.abs(bp(rng.standard_normal(len(x)), 8, 30, 1)) * 4) * np.sin(np.pi * x / d)) * v
def crack(v=1.):
    d = .6; return norm(hp(noise(d), 800) * env_exp(d, .03) + lp(brown(d), 200) * env_exp(d, .2)) * v
def collapse(v=1., d=4.):
    x = t_(d); y = lp(brown(d), 300) * np.minimum(1, x / .2) * np.exp(-x / 1.6) * 1.5
    for k in range(40): s = int(rng.random() ** 1.3 * (d - .6) * SR); c = crack(.3 + rng.random() * .6); y[s:s + len(c)] += c[:len(y) - s]
    return norm(y) * v
def chain(v=1.):
    d = .6; out = np.zeros(int(d * SR))
    for k in range(5):
        s = int((k * .09 + rng.random() * .03) * SR); dd = .15; x = t_(dd); f = 2400 + rng.random() * 1800
        y = (np.sin(2 * np.pi * f * x) + .6 * np.sin(2 * np.pi * f * 1.7 * x)) * env_exp(dd, .03) + hp(noise(dd), 3000) * env_exp(dd, .005); out[s:s + len(y)] += y[:len(out) - s]
    return norm(out) * v
def snip(v=1.):
    d = .12; return norm(hp(noise(d), 3000) * env_exp(d, .01) + np.sin(2 * np.pi * 3800 * t_(d)) * env_exp(d, .008)) * v
def grunt(v=1.):           # pig
    d = .35; x = t_(d); f0 = 160 + 60 * np.sin(np.pi * x / d)
    saw = 2 * ((np.cumsum(f0) / SR) % 1) - 1; return norm(bp(saw, 200, 1600) * (np.sin(2 * np.pi * 30 * x) > -.3) * np.sin(np.pi * x / d)) * v
def hooves(v=1., d=3.):
    out = np.zeros(int(d * SR)); t = 0.
    while t < d - .1:
        for o in (0, .07, .16, .22):
            s = int((t + o) * SR); y = lp(noise(.06), 900) * env_exp(.06, .012) + np.sin(2 * np.pi * 90 * t_(.06)) * env_exp(.06, .02); out[s:s + len(y)] += y[:len(out) - s]
        t += .42
    return norm(out) * v
def wave(v=1., d=2.5):     # a wall of water rising
    x = t_(d); return norm(bp(noise(d), 120, 3000) * np.sin(np.pi * x / d) ** 1.5 + lp(brown(d), 150) * np.sin(np.pi * x / d)) * v
def cheer(v=1., d=2.):
    x = t_(d); return norm(bp(noise(d), 300, 3000) * (1 + 2 * np.abs(bp(rng.standard_normal(len(x)), 3, 12, 1)) * 5) * np.sin(np.pi * x / d)) * v
def gull(v=1.):
    d = .55; x = t_(d); f = 1500 + 700 * np.sin(np.pi * x / d) ** 2 - 500 * x / d
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + .35 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    return norm(bp(y * np.sin(np.pi * x / d) ** 1.5 * (1 + .5 * np.sin(2 * np.pi * 28 * x)), 800, 5000)) * v
def fire(d): x = np.arange(int(d * SR)) / SR; c = (rng.random(len(x)) > .9993) * rng.random(len(x)) * 3; return norm(lp(brown(d), 400) * .6 + bp(c, 1500, 6000))
SFX = dict(knife=knife, plink=plink, boom=boom, splash=splash, cloth=cloth, roar=roar, coins=coins, stone=stone, crack=crack, collapse=collapse, chain=chain, snip=snip, grunt=grunt,
           hooves=hooves, wave=wave, cheer=cheer, gull=gull, thump=lambda v=1.: thump(v, 60), whoosh=lambda v=1.: whoosh(.5, v), creak=creak, heart=heartbeat,
           step_stone=lambda v=1.: step(v, 'stone'), step_sand=lambda v=1.: step(v, 'sand'), step_wood=lambda v=1.: step(v, 'wood'))
dl = int(DUR * SR) + 1
BEDS = {'wind': lambda: norm(bp(brown(DUR) + noise(DUR) * .05, 150, 1600)), 'gale': lambda: norm(bp(noise(DUR), 300, 3000) * (1 + .8 * np.abs(np.sin(2 * np.pi * .13 * np.arange(dl - 1) / SR)))),
        'rain': lambda: norm(bp(noise(DUR), 1500, 9000)), 'sea': lambda: norm(lp(brown(DUR), 500)) * (.55 + .45 * np.sin(2 * np.pi * .11 * np.arange(dl - 1) / SR) ** 2),
        'cave': lambda: norm(lp(brown(DUR), 90)), 'crowd': lambda: norm(bp(noise(DUR), 200, 1400) * (1 + 6 * np.abs(bp(rng.standard_normal(dl - 1), 2, 8, 1)))),
        'night': lambda: lp(np.sin(2 * np.pi * 4300 * np.arange(dl - 1) / SR) * (np.sin(2 * np.pi * 30 * np.arange(dl - 1) / SR) > .2) * (np.sin(2 * np.pi * 1.6 * np.arange(dl - 1) / SR) > .3), 6000) * .5,
        'fire': lambda: fire(DUR), 'room': lambda: norm(lp(brown(DUR), 250)) * .5}
amb = np.zeros((N, 2))
for kind, keys in TL['BEDS']:
    x = fit(BEDS[kind]()); g = np.interp(tt, [k[0] for k in keys], [k[1] for k in keys])
    amb += np.stack([x, np.roll(x, 1777)], 1) * g[:, None]
fx = np.zeros((N, 2))
for row in TL['SFX']:
    t, kind = row[0], row[1]; v = row[2] if len(row) > 2 else .6; pan = row[3] if len(row) > 3 else 0
    put(fx, SFX[kind](v), t, 1, pan)
for t in TL['TRANS']: put(fx, knife(.5, .35), t - .02, 1, -.2)
put(fx, knife(1.0, .25), .1, 1, .2)                       # the hook title is laid in with the knife
vo = np.zeros((N, 2)); vm = np.zeros(N)
for lid, L in TL['LINES'].items():
    y, sr = sf.read(os.path.join(D, 'voice', lid + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    y = hp(soxr.resample(y, sr, SR), 80); y = compress(y / (np.abs(y).max() + 1e-9) * .9, thr=.22, ratio=3.2)
    put(vo, y, L['t'], 1, 0); s = int(L['t'] * SR); vm[s:s + len(y)] = 1
rms = lambda x: float(np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)))
mu, sr = sf.read(os.path.join(D, 'out/score.wav'), dtype='float32'); mu = np.stack([fit(mu[:, 0]), fit(mu[:, 1])], 1)
d = uniform_filter1d(vm, int(.35 * SR)); duck = 1 - .6 * np.clip(d * 1.6, 0, 1)
vo *= .28 / rms(vo); mu *= .085 / rms(mu)
mix = vo + mu * duck[:, None] + fx * .5 * (1 - .3 * d)[:, None] + amb * .45 * duck[:, None]
for a, b in TL['SILENCE']:
    g0, g1 = int(a * SR), int(b * SR); mix[max(0, g0 - 2400):g0] *= np.linspace(1, 0, min(2400, g0))[:, None]; mix[g0:g1] = vo[g0:g1]
mix = np.stack([limit(mix[:, 0], .95), limit(mix[:, 1], .95)], 1)
sf.write(os.path.join(D, 'out/mix.wav'), mix.astype(np.float32), SR)
print(slug, 'mix', round(N / SR, 2), 's peak', round(float(np.abs(mix).max()), 3))
