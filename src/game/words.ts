export type Puzzle = {
  id: string;                 // usado pra salvar progresso
  center: string;             // letra obrigatória
  letters: string[];          // 7 letras (inclui center)
  words: string[];            // dicionário permitido (estático)
  title?: string;
};

export const PUZZLE: Puzzle = {
  id: "meu-puzzle-001",
  title: "Puzzle de teste",
  center: "a",
  letters: ["a", "e", "i", "l", "m", "r", "t"],
  // Troque aqui depois pelas suas palavras.
  // Regras recomendadas: min 4 letras, sem acentos, minúsculas.
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
    "meter", // <- essa não usa 'a' (vai ser filtrada)
    "tirar",
    "maria",
    "latir",
    "trama",
    "trilhar",
  ],
};