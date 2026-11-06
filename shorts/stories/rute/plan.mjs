// RUTE — horizontal (1920x1080). Timing, music, sound (Livro de Rute)
export const START = .8, TAIL = 2.0, ENDCARD = 4.2, MAXC = 70;
export const GAP = { l01: 1.0, l02: .6, l03: .7, l04: 1.0, l05: .7, l06: .9, l07: 1.2, l08: .7, l09: .8, l10: .8, l11: 1.0 };
export const SHOTS = [['hook', null], ['road', 'l02'], ['wed', 'l03'], ['grief', 'l04'], ['part', 'l05'], ['vow', 'l07', .4], ['field', 'l08'], ['boaz', 'l09'], ['wedding', 'l10'], ['child', 'l11'], ['close', 'l12']];
export const TRANS = { road: 1, wed: 1, grief: 1, part: 1, field: 1, boaz: 1, wedding: 1, child: 1, close: 1 };
export const T = { gold: 'l08+0.4', kiss: 'l06+0.8', cling: 'l06+2.4' };
export const SILENCE = [['l06e+0.3', 'l07-0.05']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:road', 'walk'], ['cut:wed', 'call'], ['cut:grief', 'dark'], ['cut:part', 'tension'], ['l06e+0.3', 'silence'], ['l07-0.05', 'end'], ['T:gold', 'turn'], ['cut:boaz', 'warm'], ['cut:wedding', 'triumph'], ['cut:child', 'warm'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:gold', 'glock'], ['T:cling', 'glock']];
export const SFX = [['cut:road+0.4', 'step_sand', .3], ['cut:road+0.9', 'step_sand', .3], ['cut:road+1.4', 'step_sand', .3], ['T:kiss', 'cloth', .4], ['T:cling', 'cloth', .5], ['cut:field+0.6', 'cloth', .3], ['cut:field+2.0', 'cloth', .3, .3], ['cut:wedding+0.4', 'cheer', .4]];
export const BEDS = [['wind', [['cut:hook', .25], ['cut:field', .25], ['cut:field+0.05', .15], ['dur', .15]]], ['night', [['cut:field', 0], ['cut:field+0.05', .08], ['cut:wedding', .08], ['cut:wedding+0.05', 0], ['dur', 0]]], ['crowd', [['cut:wedding', 0], ['cut:wedding+0.3', .15], ['cut:child', .15], ['cut:child+0.3', 0], ['dur', 0]]]];
