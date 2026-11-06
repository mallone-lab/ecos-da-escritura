// ELIAS NO MONTE CARMELO — timing, music, sound (1 Reis 18)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .5, l04: .6, l05: .6, l06: 1.2, l07: .9 };
export const SHOTS = [['hook', null], ['drought', 'l02'], ['carmel', 'l03'], ['baal', 'l04'], ['water', 'l05'], ['pray', 'l06'], ['fire', 'l07', .4], ['close', 'l08']];
export const TRANS = { drought: 1, carmel: 1, baal: 1, water: 1, pray: 1, close: 1 };
export const T = { pour1: 'l05+0.8', pour2: 'l05+1.9', pour3: 'l05+3.0', fire: 'l07+0.3' };
export const SILENCE = [['l06e+0.3', 'T:fire']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:drought', 'dark'], ['cut:carmel', 'call'], ['cut:baal', 'tension'], ['cut:water', 'walk'], ['cut:pray', 'dark'], ['l06e+0.3', 'silence'], ['T:fire', 'turn+storm'], ['cut:close', 'triumph'], ['l08+3.0', 'end'], ['end', 'ring']];
export const HITS = [['T:fire', 'boom'], ['T:fire+0.05', 'cym']];
export const SFX = [['cut:baal+0.3', 'cheer', .5], ['cut:baal+2.5', 'cheer', .4, .3], ['T:pour1', 'splash', .4], ['T:pour2', 'splash', .45], ['T:pour3', 'splash', .5],
  ['T:fire', 'boom', 1.0], ['T:fire+0.1', 'collapse', .6], ['cut:close+0.3', 'cheer', .45], ['cut:close+0.6', 'cloth', .4]];
export const BEDS = [['wind', [['cut:hook', .25], ['dur', .2]]], ['crowd', [['cut:hook', .12], ['cut:drought', .12], ['cut:drought+0.05', 0], ['cut:carmel', 0], ['cut:carmel+0.05', .14], ['l06e+0.3', .1], ['l06e+0.31', 0], ['T:fire', 0], ['cut:close', .2], ['dur', .1]]],
  ['fire', [['T:fire', 0], ['T:fire+0.1', .35], ['dur', .2]]]];
