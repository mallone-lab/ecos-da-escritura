# JONAS — sound design + final mix: voice (compressed, on top), music (ducked under the voice), beds and foley
# from the same timeline as the picture. Writes out/mix.wav.
import sys, os, json
LIB = os.environ['LIB']; LIB = LIB[1] + ':' + LIB[2:] if len(LIB) > 2 and LIB[0] == '/' and LIB[2] == '/' else LIB; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, noise, norm, brown, thump, whoosh, creak, heartbeat, compress, add, limit
HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'out/timeline.json')))
C, T, VO, B = TL['CUT'], TL['T'], TL['VO'], TL['BEAT']
DUR = TL['DUR'] + .2; N = int(DUR * SR); tt = np.arange(N) / SR
rng = np.random.default_rng(7)
def curve(keys): return np.interp(tt, [k[0] for k in keys], [k[1] for k in keys])
def st(x): return np.stack([x, np.roll(x, 1777)], 1) if x.ndim == 1 else x
def put(buf, x, at, g=1., pan=0.): add(buf, x if x.ndim == 1 else x.mean(1), at, g, pan)
def fit(x): x = x[:N]; return np.pad(x, (0, N - len(x))) if len(x) < N else x

# ---------- materials
def knife(d=.45, v=1.):          # palette knife through wet paint
    n = noise(d); x = t_(d); grain = 1 + 4.8 * np.abs(bp(rng.standard_normal(len(n)), 30, 120, 1))
    e = np.minimum(1, x / .03) * np.exp(-np.maximum(0, x - d * .6) / (d * .15))
    return norm((bp(n, 900, 4200) * grain + bp(noise(d), 250, 700) * .5) * e) * v
def plink(v=1., f=1800):
    d = .14; x = t_(d); fr = f * (1 + 1.2 * np.exp(-x / .012)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_exp(d, .03) * v
def thunder(v=1.):
    d = 3.2; x = t_(d); crack = hp(noise(d), 1500) * env_exp(d, .05) * 1.2
    roll = lp(brown(d), 260) * (np.exp(-x / 1.1) * (1 + .6 * np.sin(2 * np.pi * 3.3 * x) ** 2))
    return norm(crack + roll * 1.4 + lp(noise(d), 120) * env_exp(d, .4)) * v
def splash(v=1.):
    d = 1.3; out = norm(bp(noise(d), 300, 6500) * env_exp(d, .14)) + np.pad(thump(.9, 65), (0, int(d * SR) - len(thump(.9, 65))))
    for k in range(30): s = int((.05 + rng.random() ** 1.5 * .9) * SR); p = plink(.15 + rng.random() * .3, 1200 + rng.random() * 2500); out[s:s + len(p)] += p[:len(out) - s]
    return norm(out) * v
def stepf(v=1., surf='stone'):
    d = .14; x = t_(d)
    if surf == 'sand': y = lp(noise(d), 1400) * env_exp(d, .05)
    elif surf == 'wood': y = bp(noise(d), 300, 2500) * env_exp(d, .02) + np.sin(2 * np.pi * 160 * x) * env_exp(d, .03) * .6
    else: y = bp(noise(d), 600, 5000) * env_exp(d, .015) + lp(noise(d), 300) * env_exp(d, .02)
    return norm(y) * v
def coins(v=1.):
    d = .8; out = np.zeros(int(d * SR))
    for k in range(6):
        s = int(k * .07 * SR + rng.random() * 800); dd = .3; x = t_(dd); f = 3200 + rng.random() * 2600
        y = (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * f * 2.7 * x)) * env_exp(dd, .06); out[s:s + len(y)] += y[:len(out) - s]
    return norm(out) * v
def gull(v=1.):
    d = .55; x = t_(d); f = 1500 + 700 * np.sin(np.pi * x / d) ** 2 - 500 * x / d
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + .35 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    return norm(bp(y * np.sin(np.pi * x / d) ** 1.5 * (1 + .5 * np.sin(2 * np.pi * 28 * x)), 800, 5000)) * v
def cloth(d=.5, v=1.):
    n = noise(d); m = np.abs(bp(rng.standard_normal(len(n)), 6, 30, 1)); m /= m.max() + 1e-9
    return norm(bp(n, 800, 5000) * m * np.sin(np.pi * t_(d) / d)) * v
def cricket(d, v=1.):
    x = t_(d); chirp = (np.sin(2 * np.pi * 4300 * x) * (np.sin(2 * np.pi * 30 * x) > .2) * (np.sin(2 * np.pi * 1.6 * x) > .3))
    return lp(chirp, 6000) * v

# ---------- beds (each a full-length stereo layer with a gain curve)
def bed(x): return st(fit(x))
wind = bed(norm(bp(brown(DUR) + noise(DUR) * .05, 150, 1600)) * (1 + .4 * np.sin(2 * np.pi * .07 * tt[:int(DUR * SR)])))
gale = bed(norm(bp(noise(DUR), 300, 3000) * (1 + .8 * np.abs(np.sin(2 * np.pi * .13 * np.arange(int(DUR * SR)) / SR)))))
rainb = bed(norm(bp(noise(DUR), 1500, 9000)))
surfx = norm(lp(brown(DUR), 500)) * (.55 + .45 * np.sin(2 * np.pi * .11 * np.arange(int(DUR * SR)) / SR) ** 2); seab = bed(surfx)
under = bed(norm(lp(brown(DUR), 160)))
belly = bed(norm(lp(brown(DUR), 90)))
crowd = bed(norm(bp(noise(DUR), 200, 1400) * (1 + .6 * np.abs(bp(rng.standard_normal(int(DUR * SR)), 2, 8, 1)) * 6)))
amb = np.zeros((N, 2))
s0, s1 = C['black'], T['silence1']
amb += belly * curve([(0, .35), (C['title'], .35), (C['title'] + .1, 0), (s1, 0), (s1 + .01, .3), (C['beach'] - .4, .3), (C['beach'], 0), (DUR, 0)])[:, None]
amb += wind * curve([(0, 0), (C['title'], 0), (C['title'] + .1, .12), (C['hill'], .2), (C['pano'], .25), (C['storm'] - .1, .2), (C['storm'], 0), (C['city'], 0), (C['city'] + .1, .18), (C['hill2'], .2), (T['lightOut1'], .14), (DUR, .05)])[:, None]
amb += gale * curve([(0, 0), (C['storm'] - .01, 0), (C['storm'], .5), (C['hold'], .5), (C['hold'] + .05, .08), (C['deck'], .08), (C['deck'] + .05, .5), (T['calm'], .45), (T['calm'] + 2.4, 0), (DUR, 0)])[:, None]
amb += rainb * curve([(0, 0), (C['storm'] - .01, 0), (C['storm'], .25), (C['hold'], .25), (C['hold'] + .05, .04), (C['deck'], .04), (C['deck'] + .05, .25), (T['calm'], .25), (T['calm'] + 2.4, 0), (DUR, 0)])[:, None]
amb += seab * curve([(0, 0), (C['title'], 0), (C['title'] + .1, .25), (C['hill'], 0), (T['whip'], 0), (T['whip'] + .3, .3), (C['storm'] - .1, .3), (C['storm'], .8), (C['hold'], .8), (C['hold'] + .05, .2), (C['deck'], .2), (C['deck'] + .05, .8), (T['calm'] + 2.4, .3), (C['under'], .3), (C['under'] + .05, 0), (C['beach'] - .8, 0), (C['beach'], .35), (C['city'], .35), (C['city'] + .1, 0), (DUR, 0)])[:, None]
amb += under * curve([(0, 0), (C['under'], 0), (C['under'] + .05, .5), (C['black'], .5), (C['black'] + .05, 0), (DUR, 0)])[:, None]
amb += crowd * curve([(0, 0), (C['city'], 0), (C['city'] + .3, .14), (113, .14), (116.5, .03), (C['pano2'], 0), (DUR, 0)])[:, None]
fx = np.zeros((N, 2))
# heartbeat (belly): every two beats; the first sound after the silence is this heartbeat
for t in np.arange(.3, C['title'], B * 2): put(fx, heartbeat(.8), t)
for t in np.arange(s1, T['orou'] + 4, B * 2): put(fx, heartbeat(.9 * (1 - max(0, t - T['orou']) / 5)), t)
for t in [2.2, 4.9, 8.1, 80.2, 82.7]: put(fx, plink(.4, 1100 + rng.random() * 600), t, 1, rng.random() - .5)
# palette-knife scrapes on every paint-over cut and on the title
for c in ['title', 'hill', 'pano', 'hold', 'deck', 'under', 'beach', 'city', 'pano2', 'hill2']: put(fx, knife(.5, .35), C[c] - .02, 1, -.2)
put(fx, knife(1.2, .3), C['title'] + .45, 1, .2)
put(fx, whoosh(.6, .5), T['whip'] - .05, 1, -.4)
# the port: gulls (J-cut before the whip lands), coins, footsteps on stone then wood
for t in [T['whip'] - .3, 34.0, 36.4, 39.1, 41.8]: put(fx, gull(.18), t, 1, rng.random() * 1.4 - .7)
put(fx, coins(.25), 37.6, 1, .2)
t = 35.0 + .28
while t < 41.0: put(fx, stepf(.22, 'stone' if t < 39.6 else 'wood'), t, 1, .2); t += np.pi / 5.6
for t in [41.2, 42.0]: put(fx, creak(.25), t, 1, -.3)
# storm: thunder on every flash, the ship groaning
for th in [T['thunder1'], T['thunder2'], T['thunder3'], 59.4, 63.7]: put(fx, thunder(.9 if th < 56 else .7), th, 1, rng.random() * .6 - .3)
for t in np.arange(C['storm'] + .7, C['hold'] + 4, 1.9): put(fx, creak(.3 if t < C['hold'] else .18), t + rng.random() * .4, 1, rng.random() - .5)
put(fx, creak(.2), C['hold'] + 1.1, 1, .5)                       # the lamp chain
# deck: the lot falls, the throw, the splash, the sea settles
put(fx, stepf(.5, 'wood'), T['lots'], 1, .2)
put(fx, cloth(.5, .4), T['throwAt'] - .1, 1, .2); put(fx, whoosh(.5, .35), T['throwAt'] + .2, 1, .4)
put(fx, splash(1.), T['splash'] - .01, 1, .3)
# under: bubbles, the fish's swell, the jaws closing
for k in range(30): put(fx, plink(.18 + rng.random() * .2, 600 + rng.random() * 900), C['under'] + rng.random() * 4, 1, rng.random() - .5)
put(fx, lp(whoosh(2.0, .6), 400), 72.4, 1, .4); put(fx, thump(1, 48), T['swallow'], 1, 0)
# prayer: the colour is re-laid by the knife — a run of scrapes rising across the wave
for k in range(12): put(fx, knife(.3 + rng.random() * .2, .22), T['orou'] + .1 + k * .55 + rng.random() * .1, 1, rng.random() * 1.2 - .6)
# beach: gulls (J-cut), landing on the sand, steps toward the light
for t in [C['beach'] - .7, 95.2, 98.0, 101.7]: put(fx, gull(.15), t, 1, rng.random() * 1.2 - .6)
put(fx, lp(splash(.5), 2500), T['spit'] + .1, 1, -.3); put(fx, thump(.7, 80), T['spit'] + 1.05, 1, 0)
t = 100.6 + .2
while t < C['city']: put(fx, stepf(.25, 'sand'), t, 1, .1); t += np.pi / 5.4
# Nineveh: cloth and knees as the city kneels (king first, then in a wave)
put(fx, cloth(.7, .35), 112.5, 1, .5)
for k in range(24): put(fx, cloth(.35, .16), 113.2 + k * .14 + rng.random() * .1, 1, rng.random() * 1.6 - .8)
# ending: crickets as the light goes out
cr = cricket(T['lightOut1'] + 4 - (T['lightOut0'] - 2), .05); put(fx, cr, T['lightOut0'] - 2, 1, .4)

# ---------- voice
vo = np.zeros((N, 2)); vmask = np.zeros(N)
for L in VO:
    y, sr = sf.read(os.path.join(HERE, 'voice', L['id'] + '.wav'), dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    y = soxr.resample(y, sr, SR); y = hp(y, 80)
    y = compress(y / (np.abs(y).max() + 1e-9) * .9, thr=.22, ratio=3.2)
    put(vo, y, L['t'], 1, 0); s = int(L['t'] * SR); vmask[s:s + len(y)] = 1
rms = lambda x: float(np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2)))
music, sr = sf.read(os.path.join(HERE, 'music/score.wav'), dtype='float32'); music = np.stack([fit(music[:, 0]), fit(music[:, 1])], 1)
# duck music and beds ~8 dB under the voice (smoothed)
d = uniform_filter1d(vmask, int(.35 * SR)); duck = 1 - .6 * np.clip(d * 1.6, 0, 1)
vo *= .28 / rms(vo)
music *= .085 / rms(music)                  # voice ~10 dB above the music
mix = vo + music * duck[:, None] + fx * .5 * (1 - .3 * d)[:, None] + amb * .45 * duck[:, None]
# the silence: digital zero, nothing but itself
g0, g1 = int((s0 + .12) * SR), int((s1 - .005) * SR); mix[g0 - 2400:g0] *= np.linspace(1, 0, 2400)[:, None]; mix[g0:g1] = 0
mix = np.stack([limit(mix[:, 0], .95), limit(mix[:, 1], .95)], 1)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out/mix.wav'), mix.astype(np.float32), SR)
# band check: 20-120 Hz vs the rest
from scipy.signal import welch
f, P = welch(mix.mean(1), SR, nperseg=8192); lo = P[(f > 20) & (f < 120)].sum(); hi = P[(f >= 120) & (f < 8000)].sum()
print('mix', round(N / SR, 2), 's  peak', round(float(np.abs(mix).max()), 3), ' low/rest dB', round(10 * np.log10(lo / hi), 1))
