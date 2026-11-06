// MOISÉS E O MAR VERMELHO — timing, music, sound (Êxodo 12–14)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .9, l02: .5, l03: .5, l04: .6, l05: 1.1, l06: .9, l07: .9 };
export const SHOTS = [['shore1', null], ['egypt', 'l02'], ['desert', 'l03'], ['shore2', 'l04'], ['moses', 'l05'], ['part', 'l06', .6], ['corridor', 'l07'], ['close', 'l08']];
export const TRANS = { egypt: 1, desert: 1, shore2: 1, moses: 1, corridor: 1, close: 1 };
export const T = { open: 'l06+1.4' };
export const SILENCE = [['l05e+0.25', 'cut:part']];
export const MUSIC = [['cut:shore1', 'dark'], ['cut:egypt', 'call'], ['cut:desert', 'storm'], ['cut:shore2', 'tension'], ['cut:moses', 'dark'], ['l05e+0.25', 'silence'], ['cut:part', 'turn'], ['cut:corridor', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['l03+0.1', 'stab'], ['T:open', 'boom'], ['l05+0.2', 'glock']];
export const SFX = [['cut:desert+0.1', 'hooves', .7, .2], ['cut:shore1+0.6', 'hooves', .18, .5], ['cut:part+0.2', 'whoosh', .5], ['T:open', 'wave', .9], ['T:open+1.4', 'wave', .6, .3],
  ['cut:corridor+0.4', 'step_sand', .3], ['cut:corridor+0.9', 'step_sand', .3], ['cut:corridor+1.4', 'step_sand', .3], ['cut:corridor+1.9', 'step_sand', .3]];
export const BEDS = [['sea', [['cut:shore1', .35], ['cut:egypt', .35], ['cut:egypt+0.05', 0], ['cut:shore2', 0], ['cut:shore2+0.05', .35], ['l05e+0.25', .35], ['l05e+0.26', 0], ['cut:part', 0], ['cut:part+0.05', .4], ['dur', .25]]],
  ['crowd', [['cut:shore1', .08], ['cut:egypt', .1], ['cut:desert', .1], ['cut:desert+0.05', 0], ['cut:shore2', 0], ['cut:shore2+0.05', .2], ['cut:moses', .15], ['l05e+0.25', .1], ['l05e+0.26', 0], ['cut:corridor', 0], ['cut:corridor+0.3', .08], ['dur', .05]]],
  ['wind', [['cut:shore1', .2], ['cut:part', .2], ['cut:part+0.05', .35], ['cut:corridor', .3], ['dur', .15]]], ['fire', [['cut:shore1', .12], ['cut:egypt', .12], ['cut:egypt+0.05', 0], ['dur', 0]]]];
