// SANSÃO — timing, music, sound (Juízes 13–16)
export const START = .7, TAIL = 1.6, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .45, l03: .5, l04: .5, l05: .7, l06: .8, l07: .9, l08: .8, l09: 1.2 };
export const SHOTS = [['temple1', null], ['field', 'l02'], ['room', 'l04'], ['mill', 'l06'], ['temple2', 'l07'], ['collapse', 'l09', .5], ['close', 'l10']];
export const TRANS = { field: 1, room: 1, mill: 1, temple2: 1, close: 1 };
export const T = { lion: 'l03+1.6', cut: 'l05+3.2', pray: 'l08+0.1', fall: 'l09+0.6' };
export const SILENCE = [['l07e+0.15', 'l08-0.05']];
export const MUSIC = [['cut:temple1', 'dark'], ['cut:field', 'call'], ['l03', 'storm'], ['cut:room', 'dark'], ['T:cut', 'tension'], ['cut:mill', 'walk'], ['cut:temple2', 'dark'], ['l07e+0.15', 'silence'], ['l08-0.05', 'turn'], ['T:fall', 'storm'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:lion', 'boom'], ['T:cut', 'stab'], ['T:fall', 'boom'], ['T:fall+0.05', 'cym']];
export const SFX = [['l01+0.4', 'chain', .45, -.3], ['l01+2.6', 'chain', .35, .3], ['T:lion-0.4', 'roar', .7, .3], ['T:lion', 'thump', .8], ['T:cut', 'snip', .5], ['T:cut+0.35', 'snip', .45], ['T:cut+0.7', 'snip', .4],
  ['cut:mill+0.3', 'stone', .5], ['cut:mill+2.6', 'stone', .5], ['cut:mill+0.5', 'chain', .3], ['l07+3.5', 'chain', .4], ['T:fall-0.4', 'crack', .8], ['T:fall', 'collapse', 1.0], ['T:fall+0.8', 'collapse', .7, .4]];
export const BEDS = [['crowd', [['cut:temple1', .14], ['cut:field', .14], ['cut:field+0.05', 0], ['cut:temple2', 0], ['cut:temple2+0.05', .14], ['l07e+0.15', .14], ['l07e+0.16', 0], ['T:fall', 0], ['dur', 0]]],
  ['wind', [['cut:field', 0], ['cut:field+0.05', .22], ['cut:room', .22], ['cut:room+0.05', 0], ['cut:close', 0], ['cut:close+0.1', .15], ['dur', .12]]],
  ['room', [['cut:room', 0], ['cut:room+0.05', .25], ['cut:mill', .25], ['cut:mill+0.05', 0], ['dur', 0]]], ['cave', [['cut:mill', 0], ['cut:mill+0.05', .3], ['cut:temple2', .3], ['cut:temple2+0.05', 0], ['dur', 0]]]];
