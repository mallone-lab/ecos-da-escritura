# Ecos da Escritura — score by moods, one grid (66 bpm). python tools/score.py <slug>
# The channel's palette: D dorian in the grey world (cello drone, harp drops, a pizzicato motif walking DOWN),
# D major once colour returns (harp, glockenspiel, strings, the motif walking UP). Moods are laid section by section.
import sys, json, os
LIB = os.environ['LIB']; LIB = LIB[1] + ':' + LIB[2:] if len(LIB) > 2 and LIB[0] == '/' and LIB[2] == '/' else LIB; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, limit
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); slug = sys.argv[1]; D = os.path.join(ROOT, 'stories', slug)
TL = json.load(open(os.path.join(D, 'out/timeline.json'), encoding='utf-8'))
B = TL['BEAT']; DUR = TL['DUR'] + .6
S.seed(sum(map(ord, slug)))
ev = []
def e(t, inst, p, d, v, pan=0., att=0.):
    ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, attack=att) if att else (t, inst, p, d, v, pan))
def pad(t0, t1, inst, ps, v, pan=0., att=.8):
    for p in ps: e(t0, inst, p, max(.2, t1 - t0), v, pan, att)
def arp(t0, ps, step, inst='harp', v=.42, pan=-.25, d=1.6):
    for i, p in enumerate(ps): e(t0 + i * step, inst, p, d, v, pan)
MIN = [['D3', 'A3', 'D4', 'F4', 'A4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['A2', 'E3', 'A3', 'C4', 'E4']]
MAJ = [['D3', 'A3', 'D4', 'F#4', 'A4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['B2', 'F#3', 'B3', 'D4', 'F#4'], ['A2', 'E3', 'A3', 'C#4', 'E4']]
DOWN = ['D4', 'C4', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3']; UP = ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4']

def dark(a, b):
    pad(a, b + .3, 'cellos', ['D2', 'A2'], .36, -.1, 1.4)
    for i, p in enumerate(['A4', 'F4', 'E4', 'D4', 'C4', 'A3']):
        if a + 1 + i * B * 2.2 < b - .5: e(a + 1 + i * B * 2.2, 'harp', p, 2.4, .3, -.3)
def call(a, b):
    pad(a, b + .2, 'cellos', ['D2'], .3, -.1, 1.2)
    i = 0
    while a + i * B * 2 < b - 1: arp(a + i * B * 2, MIN[i % 4], B / 2.5, v=.38); i += 1
    t = a + B
    for p, d in [('A4', 2), ('D5', 2), ('C5', 1), ('A4', 3), ('G4', 2), ('A4', 4)]:
        if t + d * B > b + .2: break
        e(t, 'flute', p, d * B * .97, .4, .2, .15); t += d * B
def walk(a, b, notes=DOWN, pz='cellos_pizz'):
    pad(a, b + .2, 'cellos', ['D2', 'A2'], .24, -.1, 1.0)
    t, i = a, 0
    while t < b - .1:
        e(t, pz, notes[i % 8], .8, .58 - .02 * (i % 4), -.15)
        if i % 4 == 0: e(t, 'violins_pizz', S.midi(notes[i % 8]) + 12, .5, .32, .3)
        t += B; i += 1
def tension(a, b):
    pad(a, b + .2, 'contrabass', ['D2'], .5, 0, .6); pad(a, b + .2, 'cellos', ['A2', 'D3'], .45, -.1, .6)
    pad(a + B * 2, b + .2, 'violins', ['F5', 'G5'], .3, .35, 2)
    t = a
    while t < b - .05: k = (t - a) / max(1, b - a); e(t, 'timpani', 'D3', .5, .28 + .45 * k, 0); t += B
def storm(a, b):
    pad(a, b + .2, 'contrabass', ['D2'], .6, 0, .1); pad(a, b + .2, 'cellos', ['D2', 'A2'], .55, -.1, .1)
    pad(a, b + .2, 'violins', ['E5', 'F5'], .3, .35, 1.5)
    e(a, 'horn', 'D3', 1.8, .7, .1); e(a, 'horn', 'A3', 1.8, .6, .15); e(a, 'gran_cassa', 'hit', None, .85, 0)
    t = a
    while t < b - .1: e(t, 'timpani', 'D3' if int((t - a) / .125) % 2 else 'A2', .2, .33 + .22 * np.sin((t - a) * .9) ** 2, 0); t += .125
def turn(a, b):
    arp(a, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6'], .07, v=.55, d=3)
    for i, p in enumerate(['D6', 'F#6', 'A6']): e(a + .1 + i * .5, 'glockenspiel', p, 2.5, .45, .2)
    pad(a, b + .4, 'violins', ['F#4', 'A4', 'D5'], .36, .3, 2.2); pad(a, b + .4, 'violas', ['D4', 'A3'], .33, .15, 2.2)
    pad(a, b + .4, 'cellos', ['D3', 'A2'], .38, -.15, 2); pad(a, b + .4, 'contrabass', ['D2'], .42, 0, 2)
    i = 0
    while a + 2.2 + i * B * 1.5 < b - .5: e(a + 2.2 + i * B * 1.5, 'glockenspiel', ['A5', 'D6', 'F#6', 'E6', 'D6', 'A5', 'B5', 'A5'][i % 8], 1.8, .26, .2); i += 1
def warm(a, b):
    pad(a, b + .3, 'cellos', ['D3'], .3, -.1, 1); pad(a, b + .3, 'violas', ['A3', 'D4'], .22, .15, 2)
    i = 0
    while a + i * B * 2 < b - 1: arp(a + i * B * 2, MAJ[i % 4], B / 2.5, v=.38); i += 1
    t = a + B * 2
    for p, d in [('F#5', 2), ('E5', 1), ('D5', 1), ('A4', 3), ('B4', 1), ('D5', 4)]:
        if t + d * B > b + .3: break
        e(t, 'flute', p, d * B * .97, .4, .2, .15); t += d * B
def rise(a, b): walk(a, b, UP)
def triumph(a, b):
    for p in ['D2', 'A2']: e(a, 'contrabass', p, b - a + .5, .6, 0, .3)
    for p in ['D3', 'A3', 'F#4']: e(a, 'cellos', p, b - a + .5, .5, -.15, .3)
    for p in ['D5', 'F#5', 'A5']: e(a, 'violins', p, b - a + .3, .42, .3, .3)
    e(a, 'horn', 'D4', b - a, .45, .1, .2); e(a, 'horn', 'A3', b - a, .4, .15, .2)
    arp(a, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6', 'F#6'], .06, v=.5, d=3)
    e(a, 'glockenspiel', 'D6', 3, .45, .2); e(a, 'timpani', 'D3', 2, .55, 0)
def end(a, b):
    pad(a, b + 1, 'violas', ['A3', 'D4'], .22, .15, 2); pad(a, b + 1, 'cellos', ['D2'], .25, -.1, 2)
    t = a + B
    for p, d in [('A3', 2), ('D4', 2), ('F#4', 1), ('E4', 1), ('D4', 4)]:
        if t > b: break
        e(t, 'cellos', p, d * B * .97, .48, -.1, .12); t += d * B
def ring(a, b):
    arp(a + .3, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'], .08, v=.45, d=5); e(a + .3, 'glockenspiel', 'D6', 5, .4, .2)
MOODS = dict(dark=dark, call=call, walk=walk, tension=tension, storm=storm, turn=turn, warm=warm, rise=rise, triumph=triumph, end=end, ring=ring, silence=lambda a, b: None)
M = TL['MUSIC'] + [[TL['DUR'], None]]
for (a, mood), (b, _) in zip(M[:-1], M[1:]):
    for m in mood.split('+'): MOODS[m](a, b)
for t, kind in TL['HITS']:
    if kind == 'boom': e(t, 'timpani', 'D3', 1.5, .75, 0); e(t, 'gran_cassa', 'hit', None, .8, 0)
    elif kind == 'stab': e(t, 'horn', 'D3', 1.6, .7, .1); e(t, 'horn', 'F3', 1.6, .6, .15)
    elif kind == 'cym': e(t, 'sus_cymbal', 'hit', None, .5, .1)
    elif kind == 'swell': e(t, 'contrabass', 'D2', 2.5, .6, 0, 1.2); e(t, 'cellos', 'D2', 2.5, .5, -.1, 1.2)
    elif kind == 'glock': e(t, 'glockenspiel', 'A6', 2, .5, .2)
mix = S.render(ev, dur=DUR)
mix = S.room(mix, size=.6, mix=.24)
for a, b in TL['SILENCE']:
    g0, g1 = int(a * SR), int(b * SR); mix[max(0, g0 - 4800):g0] *= np.linspace(1, 0, min(4800, g0))[:, None]; mix[g0:g1] = 0
mix = np.stack([limit(mix[:, 0], .9), limit(mix[:, 1], .9)], 1)
sf.write(os.path.join(D, 'out/score.wav'), mix.astype(np.float32), SR)
print(slug, 'score', round(mix.shape[0] / SR, 2), 's')
