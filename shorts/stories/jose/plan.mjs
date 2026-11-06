// JOSÉ DO EGITO — timing, music, sound (Gênesis 37–50)
export const START = .7, TAIL = 1.6, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .6, l04: .9, l05: .6, l06: .6, l07: .9, l08: .9 };
export const SHOTS = [['prison1', null], ['field', 'l02'], ['pit', 'l03'], ['prison2', 'l04'], ['palace1', 'l05'], ['palace2', 'l06'], ['palace3', 'l07'], ['close', 'l09']];
export const TRANS = { field: 1, pit: 1, prison2: 1, palace1: 1, palace2: 1, palace3: 1, close: 1 };
export const T = { tear: 'l03+0.8', drop: 'l03+1.9', sold: 'l03+3.6', reveal: 'l05+0.3', bow: 'l06+3.2', embrace: 'l07+1.2' };
export const SILENCE = [['l04e+0.15', 'cut:palace1']];
export const MUSIC = [['cut:prison1', 'dark'], ['cut:field', 'call'], ['cut:pit', 'tension'], ['cut:prison2', 'dark'], ['l04e+0.15', 'silence'], ['cut:palace1', 'turn'], ['cut:palace2', 'warm'], ['cut:palace3', 'rise'], ['l08', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:drop', 'boom'], ['l02+1.2', 'glock']];
export const SFX = [['l01+0.2', 'chain', .4, .2], ['l01+3.0', 'chain', .3, -.2], ['l02+2.2', 'cloth', .4], ['T:tear', 'cloth', .6, .2], ['T:drop', 'thump', .9], ['T:sold', 'coins', .45, .3],
  ['cut:prison2+0.2', 'chain', .4], ['cut:prison2+0.8', 'stone', .35], ['T:bow', 'cloth', .5], ['T:bow+0.3', 'cloth', .4, .4], ['T:embrace', 'cloth', .45]];
export const BEDS = [['cave', [['cut:prison1', .32], ['cut:field', .32], ['cut:field+0.05', 0], ['cut:prison2', 0], ['cut:prison2+0.05', .32], ['l04e+0.15', .32], ['l04e+0.16', 0], ['dur', 0]]],
  ['wind', [['cut:field', 0], ['cut:field+0.05', .25], ['cut:prison2', .25], ['cut:prison2+0.05', 0], ['dur', 0]]],
  ['room', [['cut:palace1', 0], ['cut:palace1+0.05', .22], ['dur', .22]]], ['crowd', [['cut:palace1', 0], ['cut:palace1+0.3', .06], ['cut:close', .06], ['cut:close+0.3', 0], ['dur', 0]]]];
