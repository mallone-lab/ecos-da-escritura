// GIDEÃO E OS 300 — horizontal (1920x1080). Timing, music, sound (Juízes 6–7)
export const START = .8, TAIL = 2.0, ENDCARD = 4.2, MAXC = 70;
export const GAP = { l01: 1.0, l02: .7, l03: .8, l04: .8, l05: .8, l06: .7, l07: .9, l08: 1.2, l09: .9, l10: 1.0 };
export const SHOTS = [['hook', null], ['raid', 'l02'], ['press', 'l03'], ['doubt', 'l04'], ['army', 'l05'], ['leave', 'l06'], ['water', 'l07'], ['night', 'l08'], ['torch', 'l09', .3], ['flee', 'l10'], ['close', 'l11']];
export const TRANS = { raid: 1, press: 1, doubt: 1, army: 1, leave: 1, water: 1, night: 1, close: 1 };
export const T = { angel: 'l03+2.8', smash: 'l09+1.6', shout: 'l09+3.2' };
export const SILENCE = [['l08e+0.3', 'T:smash']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:raid', 'storm'], ['cut:press', 'dark'], ['T:angel', 'call'], ['cut:doubt', 'dark'], ['cut:army', 'tension'], ['cut:leave', 'walk'], ['cut:water', 'call'], ['cut:night', 'dark'], ['l08e+0.3', 'silence'], ['T:smash', 'turn+storm'], ['cut:flee', 'storm'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:smash', 'boom'], ['T:smash+0.05', 'cym'], ['T:shout', 'stab'], ['T:angel', 'glock']];
export const SFX = [['cut:raid+0.4', 'hooves', .5, .3], ['cut:raid+1.0', 'cheer', .3, .4], ['cut:press+0.5', 'thump', .3], ['cut:press+1.3', 'thump', .3], ['cut:press+2.1', 'thump', .3], ['cut:leave+0.4', 'step_sand', .3], ['cut:leave+0.9', 'step_sand', .3, .3],
  ['cut:water+1.0', 'splash', .3], ['cut:water+2.6', 'plink', .4], ['T:smash', 'crack', 1.0], ['T:smash+0.08', 'crack', .9, .4], ['T:smash+0.16', 'crack', .9, -.4], ['T:shout', 'cheer', .9], ['cut:flee+0.3', 'hooves', .6], ['cut:flee+1.2', 'cheer', .5, .5]];
export const BEDS = [['wind', [['cut:hook', .25], ['dur', .2]]], ['crowd', [['cut:hook', .1], ['cut:raid', .2], ['cut:press', .2], ['cut:press+0.05', 0], ['cut:army', 0], ['cut:army+0.05', .25], ['cut:night', .2], ['cut:night+0.05', 0], ['T:shout', 0], ['cut:flee', .3], ['cut:close', 0], ['dur', 0]]],
  ['night', [['cut:night', 0], ['cut:night+0.05', .14], ['T:smash', .14], ['T:smash+0.01', 0], ['dur', 0]]], ['fire', [['cut:raid', 0], ['cut:raid+0.05', .2], ['cut:press', .2], ['cut:press+0.05', 0], ['T:smash', 0], ['T:smash+0.05', .3], ['cut:close', .3], ['cut:close+0.05', 0], ['dur', 0]]]];
