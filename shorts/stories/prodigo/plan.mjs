// O FILHO PRÓDIGO — timing, music, sound (Lucas 15:11–32)
export const START = .7, TAIL = 1.8, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .5, l03: .6, l04: .6, l05: 1.1, l06: .8, l07: .9 };
export const SHOTS = [['pig1', null], ['house', 'l02'], ['far', 'l03'], ['pig2', 'l04'], ['road', 'l06', .6], ['feast', 'l07'], ['close', 'l08']];
export const TRANS = { house: 1, far: 1, pig2: 1, road: 1, feast: 1, close: 1 };
export const T = { bag: 'l02+3.0', rise: 'l05+1.6', see: 'l06+1.2', run: 'l06+1.9', meet: 'l06+3.9', ring: 'l07+1.6' };
export const SILENCE = [['l05e+0.2', 'cut:road']];
export const MUSIC = [['cut:pig1', 'dark'], ['cut:house', 'call'], ['cut:far', 'walk'], ['cut:pig2', 'dark'], ['l05e+0.2', 'silence'], ['cut:road', 'rise'], ['T:see', 'turn'], ['cut:feast', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:rise', 'glock'], ['T:meet', 'cym']];
export const SFX = [['l01+0.4', 'grunt', .45, .3], ['l01+2.4', 'grunt', .35, -.3], ['T:bag', 'coins', .55, .2], ['cut:far+1.2', 'coins', .3, -.3], ['cut:far+3.0', 'coins', .25, .3],
  ['cut:pig2+0.5', 'grunt', .4, .4], ['cut:pig2+3.0', 'grunt', .35, -.2], ['T:rise', 'cloth', .4], ['T:run', 'step_stone', .35], ['T:run+0.3', 'step_stone', .35], ['T:run+0.6', 'step_stone', .35], ['T:run+0.9', 'step_stone', .35], ['T:run+1.2', 'step_stone', .35],
  ['T:meet', 'cloth', .6], ['T:ring', 'coins', .2], ['cut:feast+0.4', 'cheer', .25]];
export const BEDS = [['wind', [['cut:pig1', .2], ['cut:house', .2], ['cut:house+0.05', .12], ['cut:far', .12], ['cut:far+0.05', .2], ['l05e+0.2', .2], ['l05e+0.21', 0], ['cut:road', 0], ['cut:road+0.05', .2], ['cut:feast', .2], ['cut:feast+0.05', .08], ['dur', .12]]],
  ['night', [['cut:far', 0], ['cut:far+0.05', .12], ['cut:pig2', .12], ['cut:pig2+0.05', 0], ['cut:close', 0], ['cut:close+0.2', .1], ['dur', .1]]],
  ['crowd', [['cut:feast', 0], ['cut:feast+0.3', .14], ['cut:close', .14], ['cut:close+0.3', 0], ['dur', 0]]], ['fire', [['cut:feast', 0], ['cut:feast+0.05', .1], ['cut:close', .1], ['cut:close+0.05', 0], ['dur', 0]]]];
