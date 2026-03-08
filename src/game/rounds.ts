export type Round = {
  id: string;
  title: string;
  center: string;
  letters: string[];
  words: string[];
  specialWord: string;
  specialMessage: string;
};

export const ROUNDS: Round[] = [
  {
    id: "r1-lirio",
    title: "Rodada 1 • Flores",
    center: "l",
    letters: ["l", "i", "r", "o", "a", "e", "u"],
    specialWord: "lirio",
    specialMessage: "Um começo delicado… como um lírio. 💗",
    words: [
      "lirio",
      "aula",
      "luar",
      "leia",
      "real",
      "lira",
      "oleo",
      "oral",
      "loira",
      "loiro",
    ],
  },

  {
    id: "r2-casamento",
    title: "Rodada 2 • Noivos",
    center: "a",
    letters: ["a", "c", "s", "m", "e", "n", "t", "o"],
    specialWord: "casamento",
    specialMessage: "Agora é oficial no coração: caminho de aliança. 💍",
    words: [
      "casamento",
      "casa",
      "cama",
      "canto",
      "canta",
      "conta",
      "costa",
      "mesa",
      "manso",
      "santo",
      "antes",
      "massa",
      "mata",
      "macaco",
    ],
  },

  {
    id: "r3-yasmin",
    title: "Rodada 3 • Ela",
    center: "a",
    letters: ["a", "y", "s", "m", "i", "n", "l"],
    specialWord: "yasmin",
    specialMessage: "O nome que deixa tudo mais bonito. ✨",
    words: [
      "yasmin",
      "mina",
      "mala",
      "sala",
      "alma",
      "lima",
      "mansa",
      "nasal",
      "animal",
      "lamina",
    ],
  },

  {
    id: "r4-joao",
    title: "Rodada 4 • Nós",
    center: "o",
    letters: ["o", "j", "a", "i", "e", "r", "u"],
    specialWord: "joao",
    specialMessage: "Agora é sobre nós — lado a lado. 🤍",
    words: [
      "joao",
      "joia",
      "ouro",
      "jarro",
      "orai",
    ],
  },

  {
    id: "r5-jesus",
    title: "Rodada 5 • Vida com Deus",
    center: "e",
    letters: ["e", "j", "s", "u", "r", "i", "o"],
    specialWord: "jesus",
    specialMessage: "Com Jesus no centro, o futuro fica seguro. 🙏💗",
    words: [
      "jesus",
      "jure",
      "seio",
      "reis",
      "serie",
      "serei",
    ],
  },
];