// A RESSURREIÇÃO DE LÁZARO — horizontal (1920x1080). Timing, music, sound (João 11)
export const START = .8, TAIL = 2.0, ENDCARD = 4.2, MAXC = 70;
export const GAP = { l01: 1.0, l02: .7, l03: .9, l04: .8, l05: .7, l06: .9, l07: 1.2, l08: .9, l09: 1.4, l10: .9, l11: 1.0 };
export const SHOTS = [['hook', null], ['sick', 'l02'], ['wait', 'l03'], ['tomb', 'l04'], ['martha', 'l05'], ['life', 'l06'], ['wept', 'l07'], ['stone', 'l08'], ['call', 'l09'], ['out', 'l10', .3], ['believe', 'l11'], ['close', 'l12']];
export const TRANS = { sick: 1, wait: 1, tomb: 1, martha: 1, wept: 1, stone: 1, believe: 1, close: 1 };
export const T = { roll: 'l08+1.0', shout: 'l09+2.6', emerge: 'l10+0.3' };
export const SILENCE = [['l09e+0.2', 'T:emerge']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:sick', 'dark'], ['cut:wait', 'walk'], ['cut:tomb', 'dark'], ['cut:martha', 'tension'], ['cut:life', 'call'], ['cut:wept', 'dark'], ['cut:stone', 'tension'], ['cut:call', 'storm'], ['l09e+0.2', 'silence'], ['T:emerge', 'turn'], ['cut:believe', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:shout', 'boom'], ['T:emerge', 'glock'], ['T:roll+1.4', 'boom']];
export const SFX = [['cut:sick+0.6', 'cloth', .3], ['cut:martha+0.3', 'step_sand', .4], ['cut:martha+0.7', 'step_sand', .4], ['cut:martha+1.1', 'step_sand', .4], ['T:roll', 'stone', .8], ['T:roll+1.4', 'thump', .8],
  ['T:emerge+0.3', 'step_sand', .25], ['T:emerge+1.2', 'step_sand', .25], ['T:emerge+2.1', 'step_sand', .25], ['cut:believe+0.3', 'cheer', .5]];
export const BEDS = [['wind', [['cut:hook', .25], ['l09e+0.2', .25], ['l09e+0.21', 0], ['T:emerge', 0], ['T:emerge+0.5', .2], ['dur', .2]]], ['crowd', [['cut:tomb', 0], ['cut:tomb+0.3', .12], ['cut:martha', .12], ['cut:martha+0.05', 0], ['cut:wept', 0], ['cut:wept+0.3', .14], ['l09e+0.2', .14], ['l09e+0.21', 0], ['cut:believe', 0], ['cut:believe+0.3', .3], ['cut:close', 0], ['dur', 0]]], ['room', [['cut:sick', 0], ['cut:sick+0.05', .2], ['cut:wait', .2], ['cut:wait+0.05', 0], ['dur', 0]]]];
