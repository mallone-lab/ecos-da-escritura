// DAVI E GOLIAS — horizontal (1920x1080). Timing, music, sound (1 Samuel 17)
export const START = .8, TAIL = 2.0, ENDCARD = 4.2, MAXC = 70;
export const GAP = { l01: 1.0, l02: .6, l03: .5, l04: .9, l05: .6, l06: .6, l07: .3, l08: .9, l09: .7, l10: .9, l11: 1.1, l12: 1.0, l13: 1.0 };
export const SHOTS = [['hook', null], ['valley', 'l02'], ['shout', 'l03'], ['camp', 'l05'], ['saul', 'l07'], ['stones', 'l09'], ['face', 'l10'], ['sling', 'l11', .3], ['fall', 'l12', .2], ['glory', 'l13'], ['close', 'l14']];
export const TRANS = { valley: 1, shout: 1, camp: 1, saul: 1, stones: 1, face: 1, glory: 1, close: 1 };
export const T = { release: 'l11+2.5', hit: 'l12+0.4' };
export const SILENCE = [['l11e+0.25', 'T:hit']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:valley', 'tension'], ['cut:shout', 'storm'], ['cut:camp', 'call'], ['cut:saul', 'dark'], ['l08', 'rise'], ['cut:stones', 'call'], ['cut:face', 'tension'], ['cut:sling', 'storm'], ['l11e+0.25', 'silence'], ['T:hit', 'turn'], ['cut:glory', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['l03+0.2', 'stab'], ['T:hit', 'boom'], ['T:hit+0.05', 'cym'], ['l01+0.3', 'boom']];
export const SFX = [['l01+0.3', 'thump', .6], ['l03+0.3', 'roar', .25], ['l03+4.0', 'cheer', .3, .5], ['cut:camp+0.4', 'step_sand', .3], ['cut:camp+0.9', 'step_sand', .3], ['cut:stones+1.4', 'plink', .4], ['cut:stones+2.2', 'plink', .4], ['cut:stones+3.0', 'plink', .4], ['cut:stones+3.8', 'plink', .4], ['cut:stones+4.6', 'plink', .4],
  ['cut:sling+0.4', 'step_sand', .4], ['cut:sling+0.75', 'step_sand', .4], ['cut:sling+1.1', 'step_sand', .4], ['T:release-1.0', 'whoosh', .35], ['T:release-0.5', 'whoosh', .4], ['T:release', 'whoosh', .6], ['T:hit', 'thump', 1.0], ['T:hit+0.9', 'collapse', .5], ['cut:glory+0.3', 'cheer', .6]];
export const BEDS = [['wind', [['cut:hook', .25], ['dur', .2]]], ['crowd', [['cut:hook', 0], ['cut:valley', .1], ['cut:shout', .16], ['cut:saul', .12], ['cut:saul+0.05', 0], ['cut:stones', 0], ['cut:face', .12], ['l11e+0.25', .12], ['l11e+0.26', 0], ['T:hit', 0], ['cut:glory', .3], ['cut:close', 0], ['dur', 0]]], ['room', [['cut:saul', 0], ['cut:saul+0.05', .2], ['cut:stones', .2], ['cut:stones+0.05', 0], ['dur', 0]]]];
