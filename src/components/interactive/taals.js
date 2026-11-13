/**
 * Taal definitions for the interactive TaalTrainer.
 *
 * Each taal: { name, cols, khaliIndex, defaultBpm, beats: [{ bol, marker? }] }
 *  - marker "X" = Sam, a number = Taali (clap), "0" = Khali (wave)
 *  - cols controls the grid width (use a value Tailwind knows: 3, 4 or 6)
 *
 * Pure data, safe to import from client or server components.
 */

export const TEENTAAL = {
  name: "Teentaal",
  beats: 16,
  cols: 4,
  khaliIndex: 8, // matra 9
  defaultBpm: 80,
  theka: [
    { bol: "Dha", marker: "X" }, // 1  Sam
    { bol: "Dhin" }, // 2
    { bol: "Dhin" }, // 3
    { bol: "Dha" }, // 4
    { bol: "Dha", marker: "2" }, // 5  Taali
    { bol: "Dhin" }, // 6
    { bol: "Dhin" }, // 7
    { bol: "Dha" }, // 8
    { bol: "Dha", marker: "0" }, // 9  Khali
    { bol: "Tin" }, // 10
    { bol: "Tin" }, // 11
    { bol: "Ta" }, // 12
    { bol: "Ta", marker: "3" }, // 13 Taali
    { bol: "Dhin" }, // 14
    { bol: "Dhin" }, // 15
    { bol: "Dha" }, // 16
  ],
};

// Dadra, 6 matras, 2 vibhags of 3. Mainly for accompaniment.
export const DADRA = {
  name: "Dadra",
  beats: 6,
  cols: 3,
  khaliIndex: 3, // matra 4
  defaultBpm: 90,
  theka: [
    { bol: "Dha", marker: "X" }, // 1  Sam
    { bol: "Dhin" }, // 2
    { bol: "Na" }, // 3
    { bol: "Dha", marker: "0" }, // 4  Khali
    { bol: "Tin" }, // 5
    { bol: "Na" }, // 6
  ],
};

// Bhajani, 8 matras, light taal used for bhajans/kirtans.
// Theka as notated on the Resonance lesson sheet.
export const BHAJANI = {
  name: "Bhajani",
  beats: 8,
  cols: 4,
  khaliIndex: 4, // matra 5
  defaultBpm: 90,
  theka: [
    { bol: "Dhin", marker: "X" }, // 1  Sam
    { bol: "NaDhin" }, // 2
    { bol: "Dhin" }, // 3
    { bol: "NaGe" }, // 4
    { bol: "Dhin", marker: "0" }, // 5  Khali
    { bol: "NaTin" }, // 6
    { bol: "Tin" }, // 7
    { bol: "NaGe" }, // 8
  ],
};

export const TAALS = {
  teentaal: TEENTAAL,
  dadra: DADRA,
  bhajani: BHAJANI,
};
