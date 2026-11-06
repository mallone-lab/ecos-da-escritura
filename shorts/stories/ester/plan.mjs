// ESTER — horizontal (1920x1080). Timing, music, sound (Ester 2–9)
export const START = .8, TAIL = 2.0, ENDCARD = 4.2, MAXC = 70;
export const GAP = { l01: 1.0, l02: .6, l03: .7, l04: .6, l05: .9, l06: .9, l07: .9, l08: 1.3, l09: .9, l10: .9, l11: .8, l12: 1.0 };
export const SHOTS = [['hook', null], ['home', 'l02'], ['crown', 'l03'], ['gate', 'l04'], ['decree', 'l05'], ['message', 'l06'], ['doors', 'l07'], ['fast', 'l08'], ['throne', 'l09', .5], ['banquet', 'l10'], ['fall', 'l11'], ['feast', 'l12'], ['close', 'l13']];
export const TRANS = { home: 1, crown: 1, gate: 1, decree: 1, message: 1, doors: 1, fast: 1, banquet: 1, fall: 1, feast: 1, close: 1 };
export const T = { scepter: 'l09+3.0', ring: 'l05+2.6' };
export const SILENCE = [['l08e+0.3', 'l09']];
export const MUSIC = [['cut:hook', 'dark'], ['cut:home', 'call'], ['cut:crown', 'warm'], ['cut:gate', 'tension'], ['cut:decree', 'storm'], ['cut:message', 'dark'], ['cut:doors', 'tension'], ['cut:fast', 'dark'], ['l08e+0.3', 'silence'], ['l09', 'tension'], ['T:scepter', 'turn'], ['cut:banquet', 'tension'], ['cut:fall', 'storm'], ['cut:feast', 'triumph'], ['cut:close', 'end'], ['end', 'ring']];
export const HITS = [['T:ring', 'boom'], ['T:scepter', 'glock'], ['l10+3.0', 'stab']];
export const SFX = [['cut:crown+1.5', 'cheer', .35], ['cut:gate+0.5', 'cloth', .4], ['T:ring', 'thump', .6], ['cut:doors+0.5', 'step_stone', .5], ['cut:doors+1.3', 'step_stone', .5], ['l09+0.4', 'step_stone', .4], ['l09+1.1', 'step_stone', .4], ['l09+1.8', 'step_stone', .4], ['T:scepter', 'coins', .2],
  ['l10+3.2', 'crack', .4], ['cut:fall+0.4', 'thump', .6], ['cut:feast+0.3', 'cheer', .6], ['cut:feast+3.0', 'cheer', .45, .4]];
export const BEDS = [['room', [['cut:hook', .2], ['dur', .2]]], ['crowd', [['cut:hook', 0], ['cut:crown', 0], ['cut:crown+0.3', .12], ['cut:gate', .2], ['cut:decree', .2], ['cut:decree+0.05', 0], ['cut:feast', 0], ['cut:feast+0.3', .3], ['cut:close', .3], ['cut:close+0.3', 0], ['dur', 0]]],
  ['fire', [['cut:fast', 0], ['cut:fast+0.05', .12], ['l08e+0.3', .12], ['l08e+0.31', 0], ['cut:feast', 0], ['cut:feast+0.05', .1], ['cut:close', .1], ['cut:close+0.05', 0], ['dur', 0]]]];
