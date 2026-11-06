// DANIEL NA COVA DOS LEÕES — timing, music, sound (Daniel 6)
export const START = .7, TAIL = 1.6, ENDCARD = 3.6;
export const GAP = { l01: .8, l02: .45, l03: .5, l04: .7, l05: .5, l06: 2.0, l07: 1.2, l08: .8 };
export const SHOTS = [['den1', null], ['window', 'l02'], ['palace', 'l03'], ['window2', 'l04', .3], ['den2', 'l05'], ['palaceN', 'l06'], ['mouth', 'l07', .3], ['den3', 'l08', .7], ['close', 'l09']];
export const TRANS = { window: 1, palace: 1, window2: 1, den2: 1, palaceN: 1, mouth: 1, close: 1 };
export const T = { stone: 'l05+1.7', angel: 'l08+0.1', run: 'cut:mouth' };
export const SILENCE = [['l07e+0.2', 'cut:den3']];
export const MUSIC = [['cut:den1', 'dark'], ['cut:window', 'call'], ['cut:palace', 'tension'], ['cut:window2', 'dark'], ['cut:den2', 'tension'], ['cut:palaceN', 'dark'], ['cut:mouth', 'tension'], ['l07e+0.2', 'silence'], ['cut:den3', 'turn'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['l03+0.1', 'stab'], ['T:stone', 'boom'], ['l04+2.4', 'glock']];
export const SFX = [['l01+0.3', 'roar', .5, .3], ['l01+3.6', 'roar', .35, -.4], ['cut:den2+0.4', 'thump', .7], ['T:stone', 'stone', .7, .2], ['T:stone+1.55', 'thump', .9],
  ['l04+1.6', 'cloth', .35], ['cut:palace+0.3', 'step_stone', .3], ['cut:palaceN+0.8', 'step_stone', .3, .3], ['cut:palaceN+1.6', 'step_stone', .3, -.2], ['cut:palaceN+2.4', 'step_stone', .3, .3],
  ['cut:mouth+0.1', 'step_stone', .45], ['cut:mouth+0.4', 'step_stone', .45], ['cut:mouth+0.7', 'step_stone', .45], ['cut:den3+0.3', 'roar', .18, -.4]];
export const BEDS = [['cave', [['cut:den1', .35], ['cut:window', .35], ['cut:window+0.05', 0], ['cut:den2', 0], ['cut:den2+0.05', .35], ['cut:palaceN', .35], ['cut:palaceN+0.05', 0], ['cut:den3', 0], ['cut:den3+0.05', .3], ['dur', .3]]],
  ['room', [['cut:window', 0], ['cut:window+0.05', .25], ['cut:den2', .25], ['cut:den2+0.05', 0], ['cut:palaceN', 0], ['cut:palaceN+0.05', .25], ['cut:mouth', .25], ['cut:mouth+0.05', 0], ['dur', 0]]],
  ['wind', [['cut:mouth', 0], ['cut:mouth+0.05', .25], ['l07e+0.2', .25], ['l07e+0.21', 0], ['dur', 0]]],
  ['night', [['cut:palaceN', 0], ['cut:palaceN+0.05', .12], ['cut:mouth', .12], ['cut:mouth+0.05', 0], ['dur', 0]]]];
