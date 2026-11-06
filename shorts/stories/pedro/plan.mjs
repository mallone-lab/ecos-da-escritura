// PEDRO ANDA SOBRE AS ÁGUAS — timing, music, sound (Mateus 14:22–33)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .6, l04: .6, l05: .6, l06: .9, l07: .9 };
export const SHOTS = [['hook', null], ['hill', 'l02'], ['storm', 'l03'], ['jesus', 'l04'], ['come', 'l05'], ['walk', 'l06'], ['save', 'l07', .4], ['close', 'l08']];
export const TRANS = { hill: 1, storm: 1, come: 1, close: 1 };
export const T = { step: 'l06+1.0', sink: 'l06+4.2', grab: 'l07+1.8' };
export const SILENCE = [['l06e+0.2', 'l07-0.05']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:hill', 'call'], ['cut:storm', 'storm'], ['cut:jesus', 'dark'], ['cut:come', 'tension'], ['cut:walk', 'rise'], ['T:sink', 'storm'], ['l06e+0.2', 'silence'], ['l07-0.05', 'tension'], ['T:grab', 'turn'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:grab', 'boom'], ['T:step', 'glock'], ['T:sink', 'stab']];
export const SFX = [['cut:storm+0.2', 'boom', .7], ['cut:storm+3.5', 'boom', .5, .3], ['cut:storm+1.0', 'creak', .3], ['l03+3.6', 'cheer', .45], ['T:step', 'splash', .3], ['T:sink', 'splash', .7], ['T:grab', 'splash', .4]];
export const BEDS = [['gale', [['cut:hook', .3], ['cut:hill', .3], ['cut:hill+0.05', 0], ['cut:storm', 0], ['cut:storm+0.05', .55], ['T:grab', .5], ['T:grab+2.0', 0], ['dur', 0]]],
  ['rain', [['cut:hook', .15], ['cut:hill', .15], ['cut:hill+0.05', 0], ['cut:storm', 0], ['cut:storm+0.05', .3], ['T:grab', .3], ['T:grab+2.0', 0], ['dur', 0]]],
  ['sea', [['cut:hook', .5], ['cut:hill', .5], ['cut:hill+0.05', .15], ['cut:storm', .15], ['cut:storm+0.05', .7], ['T:grab', .7], ['T:grab+2.0', .25], ['dur', .25]]], ['crowd', [['cut:hill', 0], ['cut:hill+0.05', .14], ['cut:storm', .14], ['cut:storm+0.05', 0], ['dur', 0]]]];
