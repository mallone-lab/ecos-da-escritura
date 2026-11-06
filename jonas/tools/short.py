# The vertical Short: cut out/mix.wav and the subtitle cues to the same source segments the page plays (SHORT_SEGS).
# Each join gets a 40 ms fade and a soft palette-knife scrape so the cut reads as a repaint, not a glitch.
import sys, os, json
LIB = os.environ['LIB']; LIB = LIB[1] + ':' + LIB[2:] if len(LIB) > 2 and LIB[0] == '/' and LIB[2] == '/' else LIB; sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio.sfx import SR, t_, bp, noise, norm, add, limit
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(HERE, 'out/timeline.json')))
SEGS = TL['SHORT_SEGS']
mix, sr = sf.read(os.path.join(HERE, 'out/mix.wav'), dtype='float32')
parts, f = [], int(.04 * SR)
for a, b in SEGS:
    x = mix[int(a * SR):int(b * SR)].copy(); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; parts.append(x)
out = np.concatenate(parts)
rng = np.random.default_rng(3); acc = 0.
for a, b in SEGS[:-1]:
    acc += b - a; d = .35; n = noise(d); x = t_(d)
    k = norm(bp(n, 900, 4200) * (1 + 4 * np.abs(bp(rng.standard_normal(len(n)), 30, 120, 1))) * np.minimum(1, x / .02) * np.exp(-x / .12)) * .12
    add(out, k, acc - .03, 1, 0)
out = np.stack([limit(out[:, 0], .95), limit(out[:, 1], .95)], 1)
sf.write(os.path.join(HERE, 'out/short_mix.wav'), out, SR)
cues = json.load(open(os.path.join(HERE, 'cues.json'), encoding='utf-8')); sc = []; acc = 0.
for a, b in SEGS:
    for c in cues:
        t0, t1 = max(c['t0'], a), min(c['t1'], b)
        if t1 - t0 > .5: sc.append({'t0': round(t0 - a + acc, 3), 't1': round(t1 - a + acc, 3), 'text': c['text']})
    acc += b - a
json.dump(sc, open(os.path.join(HERE, 'out/short_cues.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('short', round(len(out) / SR, 2), 's,', len(sc), 'cues')
