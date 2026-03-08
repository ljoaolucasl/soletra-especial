import type { Round } from "../game/rounds";
import { $ } from "./dom";

export function renderRoundNav(params: {
  rounds: Round[];
  currentIndex: number;
  unlockedIndex: number;
  specialsFound: Record<string, boolean>;
  highlightNext?: boolean;
  onSelect: (index: number) => void;
}) {
  const { rounds, currentIndex, unlockedIndex, specialsFound, highlightNext, onSelect } = params;

  const root = $("#round-nav");
  root.innerHTML = "";

  const nextUnlocked = Math.min(unlockedIndex, rounds.length - 1);

  rounds.forEach((r, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "round-btn";

    const locked = idx > unlockedIndex;
    const isCurrent = idx === currentIndex;
    const done = Boolean(specialsFound[r.id]);

    btn.disabled = locked;

    if (locked) btn.classList.add("is-locked");
    if (isCurrent) btn.classList.add("is-current");
    if (done) btn.classList.add("is-done");

    // ✅ brilho no recém liberado
    const isFreshUnlocked = highlightNext && idx === nextUnlocked && idx !== currentIndex;
    if (isFreshUnlocked) btn.classList.add("is-unlocked");

    btn.textContent = `Rodada ${idx + 1}`;
    btn.title = r.title;

    btn.addEventListener("click", () => onSelect(idx));
    root.appendChild(btn);
  });
}

export function renderHoneycomb(round: Round, order: string[]) {
  const root = $("#honeycomb");
  root.innerHTML = "";

  const center = round.center.toLowerCase();
  const letters = order.map((c) => c.toLowerCase());

  const outer = letters.filter((c) => c !== center);
  const outerCount = outer.length;

  // cria centro
  const centerBtn = document.createElement("button");
  centerBtn.type = "button";
  centerBtn.className = "hex hex--center";
  centerBtn.dataset.letter = center;
  centerBtn.textContent = center.toUpperCase();
  centerBtn.setAttribute("aria-label", `Letra central ${center.toUpperCase()}`);
  root.appendChild(centerBtn);

  // cria outer em círculo
  outer.forEach((ch, i) => {
    const angle = (360 / outerCount) * i;

    const b = document.createElement("button");
    b.type = "button";
    b.className = "hex";
    b.dataset.letter = ch;
    b.style.setProperty("--angle", `${angle}deg`);
    b.textContent = ch.toUpperCase();
    b.setAttribute("aria-label", `Letra ${ch.toUpperCase()}`);
    root.appendChild(b);
  });

  // display letras
  $("#letters-display").textContent = `Centro: ${round.center.toUpperCase()} • Letras: ${round.letters
    .map((c) => c.toUpperCase())
    .join(" ")}`;
}

export function renderKeyboard(letters: string[]) {
  const root = $("#keyboard");
  root.innerHTML = "";

  const row = document.createElement("div");
  row.className = "kbrow";

  letters
    .map((c) => c.toUpperCase())
    .forEach((ch) => {
      const b = document.createElement("button");
      b.className = "kb";
      b.type = "button";
      b.dataset.key = ch;
      b.textContent = ch;
      row.appendChild(b);
    });

  root.appendChild(row);
}

export function renderCurrent(value: string) {
  const cur = $("#current");
  cur.textContent = value.toUpperCase();
  cur.classList.remove("bump");
  void cur.offsetWidth;
  cur.classList.add("bump");
}

export function renderStats(params: {
  score: number;
  rank: string;
  foundCount: number;
  total: number;
  pangramCount: number;
  pangramTotal: number;
}) {
  $("#score").textContent = String(params.score);
  $("#rank").textContent = params.rank;
  $("#found-count").textContent = String(params.foundCount);
  $("#progress-pill").textContent = `${params.foundCount} / ${params.total}`;
  $("#pangram-status").textContent =
    params.pangramTotal > 0 ? `Pangramas: ${params.pangramCount}/${params.pangramTotal}` : "";
}

export function renderFoundList(found: string[]) {
  const ul = $("#found-list");
  ul.innerHTML = "";
  const sorted = [...found].sort((a, b) => a.localeCompare(b));
  for (const w of sorted) {
    const li = document.createElement("li");
    li.className = "found__item";
    li.textContent = w.toUpperCase();
    ul.appendChild(li);
  }
}

export function renderTips(lines: string[]) {
  const el = $("#tips");
  el.innerHTML = "";
  for (const line of lines) {
    const p = document.createElement("div");
    p.className = "tip";
    p.textContent = line;
    el.appendChild(p);
  }
}

export function openHelp(open: boolean) {
  const dlg = $("#help") as HTMLDialogElement;
  if (open && !dlg.open) dlg.showModal();
  if (!open && dlg.open) dlg.close();
}

export function setHint(text: string) {
  $("#hint").textContent = text;
}

export function openCelebrate(open: boolean) {
  const dlg = $("#celebrate") as HTMLDialogElement;
  if (open && !dlg.open) dlg.showModal();
  if (!open && dlg.open) dlg.close();
}

export function setCelebrate(text: { title: string; body: string; hint: string }) {
  $("#celebrate-title").textContent = text.title;
  $("#celebrate-text").textContent = text.body;
  $("#celebrate-hint").textContent = text.hint;
}