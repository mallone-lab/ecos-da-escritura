// JONAS — single source of truth for picture, voice, subtitles, score and foley.
// Music grid: 66 bpm, 4/4. Cuts land on beats (snapped), voice lines are placed by hand around them.
export const BPM = 66, BEAT = 60 / BPM, BAR = BEAT * 4;
export const snap = t => Math.round(t / BEAT) * BEAT;

// voice line start times (s). Durations come from voice/dur.json (edge-tts, pt-BR-AntonioNeural).
export const LINE_AT = {
  l01: 0.9, l02: 7.6,
  l03: 17.4, l04: 25.0, l05: 31.0, l06: 35.6,
  l07: 43.4, l08: 47.0,
  l09: 56.9, l10: 61.0, l11: 65.8,
  l12: 71.2,
  l13: 79.4, l14: 85.9, l15: 90.2,
  l16: 94.0, l17: 97.4,
  l18: 103.8, l19: 110.2,
  l20: 118.2,
  l21: 122.6, l22: 130.6,
};

const C = {                      // shot cuts (snapped to the beat grid)
  belly1: 0, title: snap(10.9), hill: snap(16.4), pano: snap(24.5), port: snap(34.8),
  storm: snap(42.6), hold: snap(52.1), deck: snap(56.3), under: snap(70.5),
  black: snap(75.4), belly2: snap(77.3), beach: snap(93.1), city: snap(103.1),
  pano2: snap(117.3), hill2: snap(121.6), end: snap(135.5),
};
export const CUT = C;
export const SHOTS = [
  ['belly1', C.belly1], ['title', C.title], ['hill', C.hill], ['pano', C.pano], ['port', C.port],
  ['storm', C.storm], ['hold', C.hold], ['deck', C.deck], ['under', C.under], ['black', C.black],
  ['belly2', C.belly2], ['beach', C.beach], ['city', C.city], ['pano2', C.pano2], ['hill2', C.hill2], ['end', C.end],
];
export const T = {
  lamp: 0.25,                     // the faint glow inside the fish
  whip: snap(32.7),               // whip-pan east -> west on "lado contrário"
  boardStart: 37.4,               // Jonah walks up the plank
  thunder1: C.storm, thunder2: snap(46.6), thunder3: snap(50.2),
  lots: 58.0,                     // the lot (a pebble) lands
  throwAt: snap(66.1),            // the sailors throw him
  splash: snap(67.0),
  calm: 68.0,                     // the sea calms over ~2 s
  swallow: snap(74.6),            // the fish's mouth closes
  silence0: C.black, silence1: snap(78.2),   // hard silence; first sound after = heartbeat at silence1
  kneel: 80.4,                    // Jonah gets to his knees
  orou: 83.9,                     // "Ele orou." -> raking light + colour wave
  colour1: 92.6,                  // colour wave complete
  spit: C.beach + .2,
  rise: 99.5,                     // "Jonas foi" — he gets up and walks
  kneelCrowd0: 111.0, kneelCrowd1: 116.0,
  compassion: 118.2,
  lightOut0: 133.2, lightOut1: 135.5,
  endIn: C.end, DUR: C.end + 8.5,
};
export const DUR = T.DUR;

// ---- the vertical Short (1080x1920): source segments [from, to] played back to back (each holds whole voice lines)
export const SHORT_SEGS = [[0.5, 10.4], [17.2, 24.4], [30.9, 34.7], [43.2, 46.6], [65.6, 75.3], [77.9, 92.6], [122.3, 135.0], [136.6, 140.0]];
