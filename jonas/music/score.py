# JONAS — original score. D dorian, 66 bpm, 4/4, written from out/timeline.json (same grid as the picture).
# Grey half: cello drone, harp, a pizzicato motif that walks DOWN (the flight). Storm: timpani, low strings, horn.
# After the prayer the same motif walks UP in D major; harp + glockenspiel lay the colour back in.
import sys, json, os
LIB = os.environ['LIB']; LIB = LIB[1] + ':' + LIB[2:] if len(LIB) > 2 and LIB[0] == '/' and LIB[2] == '/' else LIB; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, limit
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(HERE, 'out/timeline.json')))
C, T, B, DUR = TL['CUT'], TL['T'], TL['BEAT'], TL['DUR'] + .5
BAR = B * 4
S.seed(5)
ev = []
def e(t, inst, p, d, v, pan=0., **k):
    if k: ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, **k))
    else: ev.append((t, inst, p, d, v, pan))
def pad(t0, t1, inst, ps, v, pan=0., att=.8):
    for p in ps: e(t0, inst, p, t1 - t0, v, pan, attack=att)
def arp(t0, ps, step, inst='harp', v=.45, pan=-.25, d=1.6):
    for i, p in enumerate(ps): e(t0 + i * step, inst, p, d, v, pan)

# 1 · belly (grey): low cello drone, harp drops like water
pad(.2, C['title'] + .4, 'cellos', ['D2', 'A2'], .38, -.1, att=1.6)
for i, p in enumerate(['A4', 'F4', 'E4', 'D4', 'C4']): e(1.6 + i * BAR * .55, 'harp', p, 2.5, .32, -.3)
# 2 · title: timpani + a rising harp in D dorian
e(C['title'], 'timpani', 'D3', 2.5, .7, 0); e(C['title'], 'contrabass', 'D2', 4.5, .55, 0, attack=.05)
arp(C['title'] + .05, ['D3', 'A3', 'D4', 'E4', 'F4', 'A4', 'C5', 'D5'], .11, v=.5)
pad(C['title'] + B * 2, C['hill'] + .3, 'violas', ['D4', 'A4'], .3, .2, att=1.2)
# 3 · the call: harp arpeggios (Dm - G - C - Am), flute line
ch = [['D3', 'A3', 'D4', 'F4', 'A4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['A2', 'E3', 'A3', 'C4', 'E4']]
for i in range(8):
    if C['hill'] + i * B * 2 < C['pano'] - 1.2: arp(C['hill'] + i * B * 2, ch[i % 4], B / 2.5, v=.4)
pad(C['hill'], C['pano'], 'cellos', ['D2'], .3, -.1, att=1.5)
fl = [('A4', 2), ('D5', 2), ('C5', 1), ('A4', 3)]
tt = C['hill'] + B
for p, d in fl: e(tt, 'flute', p, d * B * .97, .42, .2, attack=.15); tt += d * B
# 4-5 · Nineveh, then the flight: pizzicato motif walking down, one note per beat
pad(C['pano'], C['storm'], 'cellos', ['D2', 'A2'], .26, -.1, att=1.2)
e(C['pano'], 'horn', 'A3', BAR * 1.5, .3, .2, attack=.6)
down = ['D4', 'C4', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3']
tt = T['whip'] - B * 2; i = 0
while tt < C['storm'] - B:
    k = i % 8; oct_ = 0 if i < 16 else -12
    e(tt, 'cellos_pizz', S.midi(down[k]) + oct_, .8, .6 - .02 * (i % 4), -.15)
    if k % 4 == 0: e(tt, 'violins_pizz', S.midi(down[k]) + 12, .5, .35, .3)
    tt += B; i += 1
e(T['whip'], 'timpani', 'A2', 1.5, .5, 0)
# 6 · storm: timpani rolls, low strings, high strings ache, horn on the thunder
st0, st1 = C['storm'], C['deck'] + (T['throwAt'] - C['deck'])
pad(st0, C['hold'], 'contrabass', ['D2'], .6, 0, att=.1); pad(st0, C['hold'], 'cellos', ['D2', 'A2'], .55, -.1, att=.1)
pad(st0, C['hold'], 'violins', ['E5', 'F5'], .32, .35, att=1.5)
for th in [T['thunder1'], T['thunder2'], T['thunder3']]: e(th, 'horn', 'D3', 1.6, .7, .1); e(th, 'horn', 'A3', 1.6, .6, .15); e(th, 'gran_cassa', 'hit', None, .85, 0)
tt = st0
while tt < C['hold'] - .2:
    v = .35 + .25 * np.sin((tt - st0) * .9) ** 2
    e(tt, 'timpani', 'D3' if int((tt - st0) / .125) % 2 else 'A2', .2, v, 0); tt += .125
# 7 · the hold: everything drops to one low cello (muffled storm in the mix)
pad(C['hold'], C['deck'] + .5, 'cellos', ['D2'], .35, -.1, att=.3)
# 8 · deck: pulse on every beat, building; horn at the lots; hit at the throw; then the sea goes quiet
pad(C['deck'], T['throwAt'], 'contrabass', ['D2'], .55, 0, att=.5); pad(C['deck'], T['throwAt'], 'cellos', ['A2', 'D3'], .5, -.1, att=.5)
pad(T['lots'], T['throwAt'], 'violins', ['F5', 'G5'], .35, .35, att=2)
tt = C['deck']
while tt < T['throwAt'] - .05:
    k = (tt - C['deck']) / (T['throwAt'] - C['deck']); e(tt, 'timpani', 'D3', .5, .3 + .5 * k, 0); tt += B
e(T['lots'], 'horn', 'D3', 2.5, .65, .1); e(T['lots'], 'horn', 'F3', 2.5, .55, .15)
e(T['throwAt'], 'gran_cassa', 'hit', None, 1, 0); e(T['throwAt'], 'sus_cymbal', 'hit', None, .5, .1)
for p in ['D2', 'A2']: e(T['throwAt'], 'contrabass', p, 3.5, .7, 0)
pad(T['calm'], C['under'] + 1, 'cellos', ['A2'], .3, -.1, att=1.5)
# 9 · under the water: a deep swell for the fish
pad(C['under'], C['black'], 'violas', ['D4', 'E4'], .2, .2, att=1.5)
e(72.6, 'contrabass', 'D2', 2.5, .6, 0, attack=1.2); e(72.6, 'cellos', 'D2', 2.5, .5, -.1, attack=1.2)
e(T['swallow'], 'timpani', 'D3', 1.2, .75, 0); e(T['swallow'], 'gran_cassa', 'hit', None, .7, 0)
# --- silence C['black'] .. T['silence1'] (enforced below)
# 10 · belly again: a cello alone, the motif turned upward; at the prayer the colour arrives (D major)
up = ['D3', 'E3', 'F3', 'G3', 'A3']
for i, p in enumerate(up): e(T['silence1'] + 1.0 + i * B * 1.2, 'cellos', p, B * 1.15, .45, -.1, attack=.08)
o = T['orou']
arp(o, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6'], .07, v=.55, d=3)
for i, p in enumerate(['D6', 'F#6', 'A6']): e(o + .1 + i * .5, 'glockenspiel', p, 2.5, .45, .2)
pad(o, C['beach'] + .4, 'violins', ['F#4', 'A4', 'D5'], .38, .3, att=2.5); pad(o, C['beach'] + .4, 'violas', ['D4', 'A3'], .35, .15, att=2.5)
pad(o, C['beach'] + .4, 'cellos', ['D3', 'A2'], .4, -.15, att=2); pad(o, C['beach'] + .4, 'contrabass', ['D2'], .45, 0, att=2)
for i in range(8): e(o + 2.2 + i * B * 1.5, 'glockenspiel', ['A5', 'D6', 'F#6', 'E6', 'D6', 'A5', 'B5', 'A5'][i], 1.8, .28, .2)
# 11 · beach: harp in D major, flute sings the resolved line; "e dessa vez Jonas foi": pizz walks UP
bch = [['D3', 'A3', 'D4', 'F#4', 'A4'], ['G2', 'D3', 'G3', 'B3', 'D4'], ['B2', 'F#3', 'B3', 'D4', 'F#4'], ['A2', 'E3', 'A3', 'C#4', 'E4']]
for i in range(6): arp(C['beach'] + i * B * 2, bch[i % 4], B / 2.5, v=.4)
pad(C['beach'], C['city'], 'cellos', ['D3'], .3, -.1, att=1)
tt = C['beach'] + B * 2
for p, d in [('F#5', 2), ('E5', 1), ('D5', 1), ('A4', 3), ('B4', 1), ('D5', 4)]: e(tt, 'flute', p, d * B * .97, .4, .2, attack=.15); tt += d * B
upm = ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4']
tt = 100.4; i = 0
while tt < C['city'] - .1: e(tt, 'cellos_pizz', upm[i % 8], .8, .6, -.15); tt += B; i += 1
# 12 · Nineveh: the ensemble; warning (minor), then the city kneels (major, softening)
e(C['city'], 'timpani', 'D3', 1.5, .7, 0)
pad(C['city'], 110.0, 'cellos', ['D3', 'A3'], .5, -.1, att=.4); pad(C['city'], 110.0, 'contrabass', ['D2'], .5, 0, att=.4)
pad(C['city'], 110.0, 'horn', ['D4', 'F4'], .4, .15, att=.6)
tt = C['city'] + B
while tt < 109.8: e(tt, 'timpani', 'A2', .4, .35, 0); tt += B * 2
pad(110.0, C['pano2'], 'violins', ['F#4', 'A4', 'D5'], .32, .3, att=2); pad(110.0, C['pano2'], 'violas', ['D4'], .3, .1, att=2)
pad(110.0, C['pano2'], 'cellos', ['B2', 'F#3'], .35, -.1, att=2)
for i in range(6): arp(111.0 + i * B * 2, bch[(i + 2) % 4], B / 2.5, v=.3)
# 13 · "E Deus teve compaixão": the full D major chord
cp = T['compassion']
for p in ['D2', 'A2']: e(cp, 'contrabass', p, 4.5, .6, 0, attack=.3)
for p in ['D3', 'A3', 'F#4']: e(cp, 'cellos', p, 4.5, .5, -.15, attack=.3)
for p in ['D5', 'F#5', 'A5']: e(cp, 'violins', p, 4.2, .42, .3, attack=.3)
e(cp, 'horn', 'D4', 4, .45, .1, attack=.2); e(cp, 'horn', 'A3', 4, .4, .15, attack=.2)
arp(cp, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6', 'F#6'], .06, v=.5, d=3)
e(cp, 'glockenspiel', 'D6', 3, .45, .2); e(cp, 'timpani', 'D3', 2, .55, 0)
# 14 · the hill at sundown: cello solo over a soft pad, ends on D as the light goes out
pad(C['hill2'], T['lightOut1'] + 1, 'violas', ['A3', 'D4'], .22, .15, att=2); pad(C['hill2'], T['lightOut1'] + 1, 'cellos', ['D2'], .25, -.1, att=2)
tt = C['hill2'] + B
for p, d in [('A3', 2), ('D4', 2), ('F#4', 1), ('E4', 1), ('D4', 2), ('B3', 2), ('A3', 3), ('C#4', 1), ('D4', 4)]: e(tt, 'cellos', p, d * B * .97, .5, -.1, attack=.12); tt += d * B
for i in range(4): arp(C['hill2'] + B * 2 + i * BAR, bch[i % 4], B / 2.5, v=.3)
# end card: one harp chord and a glockenspiel, left to ring
arp(C['end'] + .7, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'], .08, v=.45, d=5)
e(C['end'] + .7, 'glockenspiel', 'D6', 5, .4, .2)

mix = S.render(ev, dur=DUR)
mix = S.room(mix, size=.6, mix=.24)
g0, g1 = int((C['black'] + .1) * SR), int(T['silence1'] * SR)
mix[g0 - 4800:g0] *= np.linspace(1, 0, 4800)[:, None]; mix[g0:g1] = 0
mix = np.stack([limit(mix[:, 0], .9), limit(mix[:, 1], .9)], 1)
sf.write(os.path.join(HERE, 'music/score.wav'), mix.astype(np.float32), SR)
print('score', round(mix.shape[0] / SR, 2), 's peak', round(float(np.abs(mix).max()), 3))
print('\n'.join(S.credits(sorted({x[1] if isinstance(x, tuple) else x['inst'] for x in ev}))))
