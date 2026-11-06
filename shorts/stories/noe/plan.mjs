// NOÉ E A ARCA — timing, music, sound (Gênesis 6–9)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .5, l04: .6, l05: .7, l06: 1.0, l07: .9 };
export const SHOTS = [['mock', null], ['walk', 'l02'], ['build', 'l03'], ['animals', 'l05'], ['flood', 'l06'], ['bow', 'l07', .6], ['close', 'l08']];
export const TRANS = { walk: 1, build: 1, animals: 1, bow: 1, close: 1 };
export const T = { door: 'l05+3.2', drop: 'l01+2.6', bow: 'l07+1.0' };
export const SILENCE = [['l06e+0.3', 'cut:bow']];
export const MUSIC = [['cut:mock', 'dark'], ['cut:walk', 'call'], ['cut:build', 'walk'], ['cut:animals', 'call'], ['cut:flood', 'storm'], ['l06e+0.3', 'silence'], ['cut:bow', 'turn'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:door', 'boom'], ['T:drop', 'glock']];
export const SFX = [['T:drop', 'plink', .5], ['T:drop+0.6', 'plink', .4, .3], ['cut:build+0.4', 'thump', .4], ['cut:build+1.3', 'thump', .4], ['cut:build+2.2', 'thump', .4], ['cut:build+3.1', 'thump', .4], ['cut:build+4.0', 'thump', .4], ['cut:build+5.6', 'thump', .4],
  ['cut:animals+0.6', 'roar', .25, .3], ['cut:animals+1.8', 'grunt', .3, -.3], ['T:door', 'stone', .6], ['T:door+1.4', 'thump', .9], ['cut:flood+0.2', 'boom', .8], ['cut:flood+3.0', 'boom', .5, .4], ['cut:flood+1.5', 'creak', .3]];
export const BEDS = [['crowd', [['cut:mock', .14], ['cut:walk', .14], ['cut:walk+0.05', 0], ['dur', 0]]], ['wind', [['cut:mock', .2], ['cut:flood', .2], ['cut:flood+0.05', 0], ['cut:bow', 0], ['cut:bow+0.05', .2], ['dur', .15]]],
  ['gale', [['cut:flood', 0], ['cut:flood+0.05', .5], ['l06e+0.3', .5], ['l06e+0.31', 0], ['dur', 0]]], ['rain', [['cut:flood', 0], ['cut:flood+0.05', .3], ['l06e+0.3', .3], ['l06e+0.31', 0], ['dur', 0]]],
  ['sea', [['cut:flood', 0], ['cut:flood+0.05', .6], ['l06e+0.3', .6], ['l06e+0.31', 0], ['dur', 0]]]];
