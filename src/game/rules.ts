import type { Round } from "./rounds";
import { normalizeWord, uniqueChars } from "./utils";

export type CheckResult =
  | { ok: true; normalized: string; isPangram: boolean; points: number }
  | { ok: false; reason: "short" | "invalid" | "missing_center" | "not_in_list" | "already_found" };

export function buildDictionary(round: Round): Set<string> {
  const letters = new Set(round.letters.map((c) => c.toLowerCase()));
  const center = round.center.toLowerCase();

  const clean = round.words
    .map(normalizeWord)
    .filter((w) => w.length >= 4)
    .filter((w) => w.includes(center))
    .filter((w) => [...w].every((ch) => letters.has(ch)));

  // garante que a specialWord esteja no dict (se ela for válida)
  const special = normalizeWord(round.specialWord);
  if (
    special.length >= 4 &&
    special.includes(center) &&
    [...special].every((ch) => letters.has(ch))
  ) {
    clean.push(special);
  }

  return new Set(clean);
}

export function isPangram(word: string, round: Round): boolean {
  const set = new Set(uniqueChars(word));
  return round.letters.every((c) => set.has(c.toLowerCase()));
}

export function scoreWord(word: string, pangram: boolean): number {
  const base = word.length === 4 ? 1 : word.length;
  return base + (pangram ? 7 : 0);
}

export function checkWord(params: {
  raw: string;
  round: Round;
  dict: Set<string>;
  found: Set<string>;
}): CheckResult {
  const { raw, round, dict, found } = params;
  const w = normalizeWord(raw);

  if (w.length < 4) return { ok: false, reason: "short" };
  if (!w.includes(round.center.toLowerCase())) return { ok: false, reason: "missing_center" };

  const letters = new Set(round.letters.map((c) => c.toLowerCase()));
  if (![...w].every((ch) => letters.has(ch))) return { ok: false, reason: "invalid" };

  if (!dict.has(w)) return { ok: false, reason: "not_in_list" };
  if (found.has(w)) return { ok: false, reason: "already_found" };

  const pangram = isPangram(w, round);
  const points = scoreWord(w, pangram);

  return { ok: true, normalized: w, isPangram: pangram, points };
}

export function computeMaxScore(dict: Set<string>, round: Round): number {
  let total = 0;
  for (const w of dict) total += scoreWord(w, isPangram(w, round));
  return total;
}

export function rankFromScore(score: number, maxScore: number): string {
  const pct = maxScore <= 0 ? 0 : (score / maxScore) * 100;
  if (pct >= 90) return "Amor da minha vida";
  if (pct >= 70) return "Esposa";
  if (pct >= 50) return "Noiva";
  if (pct >= 30) return "Namorada";
  if (pct >= 15) return "Formosa";
  if (pct >= 5) return "Linda";
  return "Bonita";
}