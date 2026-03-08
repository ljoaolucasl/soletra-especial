export type Puzzle = {
  id: string;
  center: string;
  letters: string[];
  words: string[];
  title?: string;
};

export const PUZZLE: Puzzle = {
  id: "meu-puzzle-001",
  title: "Puzzle de teste",
  center: "a",
  letters: ["a", "e", "i", "l", "m", "r", "t"],
  words: [
    "alma",
    "amarelar",
    "amar",
    "armar",
    "areia",
    "arial",
    "alar",
    "real",
    "rima",
    "matar",
    "martelar",
    "meter",
    "tirar",
    "maria",
    "latir",
    "trama",
    "trilhar",
  ],
};