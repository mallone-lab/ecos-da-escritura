// A TORRE DE BABEL — timing, music, sound (Gênesis 11:1–9)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .5, l04: .8, l05: .6, l06: .6, l07: 1.0 };
export const SHOTS = [['hook', null], ['plain', 'l02'], ['plan', 'l03'], ['rise', 'l04'], ['descend', 'l05', .3], ['scatter', 'l06'], ['ruin', 'l07'], ['close', 'l08']];
export const TRANS = { plain: 1, plan: 1, rise: 1, scatter: 1, ruin: 1, close: 1 };
export const T = { down: 'l05+1.2', confuse: 'l05+3.0', grace: 'l08+2.4' };
export const SILENCE = [['l07e+0.3', 'cut:close']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:plain', 'call'], ['cut:plan', 'walk'], ['cut:rise', 'tension'], ['cut:descend', 'storm'], ['cut:scatter', 'tension'], ['cut:ruin', 'dark'], ['l07e+0.3', 'silence'], ['cut:close', 'end'], ['T:grace', 'turn'], ['end', 'ring']];
export const HITS = [['T:down', 'boom'], ['T:confuse', 'stab'], ['l04+3.0', 'glock']];
export const SFX = [['cut:plan+0.5', 'thump', .4], ['cut:plan+1.4', 'thump', .4], ['cut:rise+0.4', 'thump', .4], ['cut:rise+1.3', 'thump', .4], ['cut:rise+2.2', 'thump', .4], ['cut:rise+3.1', 'thump', .4],
  ['T:down', 'wave', .6], ['T:confuse', 'cheer', .55], ['T:confuse+1.5', 'cheer', .4, .4], ['cut:scatter+0.5', 'step_sand', .4], ['cut:scatter+0.8', 'step_sand', .4, .3], ['cut:scatter+1.1', 'step_sand', .4, -.3], ['cut:ruin+0.5', 'crack', .4]];
export const BEDS = [['wind', [['cut:hook', .25], ['dur', .2]]], ['crowd', [['cut:hook', .08], ['cut:plain', .14], ['cut:descend', .14], ['T:confuse', .3], ['cut:ruin', .3], ['cut:ruin+0.3', 0], ['dur', 0]]]];
