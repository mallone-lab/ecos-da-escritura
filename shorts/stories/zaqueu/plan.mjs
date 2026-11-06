// ZAQUEU — timing, music, sound (Lucas 19:1–10)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .5, l04: .6, l05: .7, l06: .6, l07: .8, l08: .9 };
export const SHOTS = [['hook', null], ['tax', 'l02'], ['crowd', 'l03'], ['climb', 'l04'], ['look', 'l05', .3], ['murmur', 'l06'], ['give', 'l07'], ['close', 'l08']];
export const TRANS = { tax: 1, crowd: 1, climb: 1, murmur: 1, give: 1, close: 1 };
export const T = { name: 'l05+2.6', down: 'l05+4.6' };
export const SILENCE = [['l04e+0.2', 'cut:look']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:tax', 'walk'], ['cut:crowd', 'tension'], ['cut:climb', 'rise'], ['l04e+0.2', 'silence'], ['cut:look', 'dark'], ['T:name', 'turn'], ['cut:murmur', 'tension'], ['cut:give', 'warm'], ['cut:close', 'triumph'], ['l09', 'end'], ['end', 'ring']];
export const HITS = [['T:name', 'glock']];
export const SFX = [['cut:tax+0.5', 'coins', .5], ['cut:tax+2.2', 'coins', .4, .3], ['cut:crowd+0.3', 'step_sand', .3], ['cut:crowd+0.8', 'step_sand', .3], ['cut:climb+0.6', 'cloth', .5], ['cut:climb+1.6', 'creak', .3],
  ['T:down', 'cloth', .5], ['T:down+0.5', 'thump', .5], ['cut:give+0.8', 'coins', .6], ['cut:give+2.4', 'coins', .5, -.3], ['cut:close+0.4', 'cheer', .3]];
export const BEDS = [['crowd', [['cut:hook', .15], ['cut:tax', .15], ['cut:tax+0.05', 0], ['cut:crowd', 0], ['cut:crowd+0.05', .25], ['l04e+0.2', .2], ['l04e+0.21', 0], ['cut:look', 0], ['cut:look+0.3', .08], ['cut:murmur', .3], ['cut:give', .3], ['cut:give+0.05', 0], ['dur', 0]]],
  ['wind', [['cut:hook', .15], ['dur', .12]]], ['room', [['cut:tax', 0], ['cut:tax+0.05', .2], ['cut:crowd', .2], ['cut:crowd+0.05', 0], ['cut:give', 0], ['cut:give+0.05', .2], ['dur', .2]]]];
