import "./styles.scss";

import couplePhotoUrl from "./resources/foto_nossa.jpeg";
import { ROUNDS } from "./game/rounds";
import { buildDictionary, checkWord, computeMaxScore, isPangram, rankFromScore } from "./game/rules";
import { clearCampaign, loadCampaign, saveCampaign } from "./game/storage";
import type { CampaignState } from "./game/types";
import { normalizeWord, shuffle } from "./game/utils";

import { $ } from "./ui/dom";
import { toast } from "./ui/toast";
import {
  openHelp,
  openCelebrate,
  renderCurrent,
  renderFoundList,
  renderHoneycomb,
  renderKeyboard,
  renderRoundNav,
  renderStats,
  renderTips,
  setCelebrate,
  setHint,
} from "./ui/render";

const CAMPAIGN_ID = "noivos-campanha-v1";

function main() {
  const rounds = ROUNDS;

  const saved = loadCampaign(CAMPAIGN_ID);

  let state: CampaignState =
    saved ??
    ({
      version: 2,
      campaignId: CAMPAIGN_ID,
      currentRoundIndex: 0,
      unlockedRoundIndex: 0,
      totalScore: 0,
      foundByRound: {},
      specialsFound: {},
      updatedAt: Date.now(),
    } as CampaignState);

  for (const r of rounds) {
    state.foundByRound[r.id] ??= [];
    state.specialsFound[r.id] ??= false;
  }

  let current = "";
  let lettersOrder: string[] = [];

  function getRound() {
    return rounds[state.currentRoundIndex];
  }

  function ensureDefaultLettersOrder() {
    const round = getRound();
    if (lettersOrder.length === 0) {
      lettersOrder = [round.center, ...round.letters.filter((c) => c !== round.center)];
    }
  }

  function persist() {
    state.updatedAt = Date.now();
    saveCampaign(state);
  }

  function computeScoreFromFound(round: any, dict: Set<string>, found: Set<string>) {
    let total = 0;
    for (const w of found) {
      if (!dict.has(w)) continue;
      const pangram = isPangram(w, round);
      total += w.length === 4 ? 1 : w.length;
      if (pangram) total += 7;
    }
    return total;
  }

  function allSpecialsCompleted(): boolean {
    return rounds.every((r) => Boolean(state.specialsFound[r.id]));
  }

  function allWordsCompleted(): boolean {
    for (const r of rounds) {
      const dict = buildDictionary(r);
      const found = new Set<string>((state.foundByRound[r.id] ?? []).map(normalizeWord));
      if (found.size < dict.size) return false;
    }
    return true;
  }

  function applyEndgameUI() {
    const scoreEl = $("#score");
    const rankCard = $("#rank-card");
    const photoImg = $("#rank-photo") as HTMLImageElement;

    const allWords = allWordsCompleted();

    if (allWords) {
      scoreEl.textContent = "∞";
      scoreEl.classList.add("is-infinite");

      rankCard.classList.add("is-photo");
      photoImg.src = couplePhotoUrl;
    } else {
      scoreEl.classList.remove("is-infinite");
      rankCard.classList.remove("is-photo");
    }
  }

  function renderRoundNavNow(highlightNext = false) {
    renderRoundNav({
      rounds,
      currentIndex: state.currentRoundIndex,
      unlockedIndex: state.unlockedRoundIndex,
      specialsFound: state.specialsFound,
      highlightNext,
      onSelect: (idx) => {
        if (idx > state.unlockedRoundIndex) return;

        state.currentRoundIndex = idx;
        current = "";
        lettersOrder = [];
        persist();
        renderRoundNavNow(false);
        renderRound();
      },
    });
  }

  function renderRound() {
    const round = getRound();
    ensureDefaultLettersOrder();

    renderHoneycomb(round, lettersOrder);
    renderKeyboard(round.letters);
    renderCurrent(current);

    const dict = buildDictionary(round);

    const pangramsAll = [...dict].filter((w) => isPangram(w, round));
    const pangramTotal = pangramsAll.length;

    const found = new Set<string>((state.foundByRound[round.id] ?? []).map(normalizeWord));
    renderFoundList([...found]);

    const maxScore = computeMaxScore(dict, round);
    const scoreThisRound = computeScoreFromFound(round, dict, found);
    const rank = rankFromScore(scoreThisRound, maxScore);

    renderStats({
      score: state.totalScore,
      rank,
      foundCount: found.size,
      total: dict.size,
      pangramCount: pangramsAll.filter((w) => found.has(w)).length,
      pangramTotal,
    });

    renderTips([
      `Rodada atual: ${round.title}`,
      `Você libera a próxima rodada quando encontrar a palavra especial.`,
      `Centro obrigatório: ${round.center.toUpperCase()} • mínimo 4 letras.`,
    ]);

    setHint("");

    applyEndgameUI();
  }

  function addChar(raw: string) {
    const round = getRound();
    const ch = normalizeWord(raw);
    if (!ch) return;

    if (!round.letters.includes(ch)) {
      toast("Use apenas as letras desta rodada.", "warn");
      return;
    }

    current += ch;
    renderCurrent(current);
    setHint("");
  }

  function backspace() {
    if (!current) return;
    current = current.slice(0, -1);
    renderCurrent(current);
    setHint("");
  }

  function showCelebrateModal(opts: { title: string; body: string; hint: string; grand?: boolean }) {
    const dlg = $("#celebrate") as HTMLDialogElement;
    dlg.classList.toggle("is-grand", Boolean(opts.grand));

    setCelebrate({
      title: opts.title,
      body: opts.body,
      hint: opts.hint,
    });

    openCelebrate(true);
  }

  function submit() {
    const round = getRound();
    const dict = buildDictionary(round);

    const found = new Set<string>((state.foundByRound[round.id] ?? []).map(normalizeWord));
    if (!current) return;

    const res = checkWord({ raw: current, round, dict, found });

    if (!res.ok) {
      const msg =
        res.reason === "short"
          ? "Mínimo de 4 letras."
          : res.reason === "missing_center"
            ? `Precisa ter a letra do centro (${round.center.toUpperCase()}).`
            : res.reason === "invalid"
              ? "Só pode usar as letras desta rodada."
              : res.reason === "already_found"
                ? "Você já achou essa."
                : "Não está na lista desta rodada.";
      toast(msg, "warn");
      setHint(msg);
      return;
    }

    found.add(res.normalized);
    state.foundByRound[round.id] = [...found];

    state.totalScore += res.points;
    toast(res.isPangram ? `Pangrama! +${res.points}` : `Boa! +${res.points}`, "ok");

    const special = normalizeWord(round.specialWord);
    const isSpecial = res.normalized === special;

    current = "";
    renderCurrent(current);
    renderFoundList([...found]);

    let highlightNext = false;

    if (isSpecial) {
      const alreadyUnlocked = Boolean(state.specialsFound[round.id]);

      if (!alreadyUnlocked) {
        state.specialsFound[round.id] = true;

        const nextIdx = state.currentRoundIndex + 1;

        if (nextIdx < rounds.length) {
          state.unlockedRoundIndex = Math.max(state.unlockedRoundIndex, nextIdx);
          highlightNext = true;

          showCelebrateModal({
            title: "💖 VOCÊ ACHOU A PALAVRA ESPECIAL!",
            body: round.specialMessage,
            hint: `✅ Rodada ${nextIdx + 1} foi liberada!\nClique em "Rodada ${nextIdx + 1}" lá em cima para continuar ✨`,
          });
        } else {
          showCelebrateModal({
            title: "💍 VOCÊ FECHOU A ÚLTIMA RODADA!",
            body: round.specialMessage,
            hint: "Agora falta descobrir as palavras restantes… ou só curtir o final ✨💗",
          });
        }

        if (allSpecialsCompleted()) {
          showCelebrateModal({
            title: "🌸💍 VOCÊ DESBLOQUEOU TODAS AS PALAVRAS ESPECIAIS! 💍🌸",
            body: "Isso aqui é a nossa história em forma de jogo. Obrigado por existir. 💗",
            hint: "Agora a missão final é completar TODAS as palavras de TODAS as rodadas… ✨",
            grand: true,
          });
        }
      } else {
        showCelebrateModal({
          title: "💖 Palavra especial (de novo)!",
          body: "Você já tinha encontrado essa palavra especial antes ✨",
          hint: "Se quiser, pode continuar completando as outras palavras da rodada.",
        });
      }
    }

    persist();
    renderRoundNavNow(highlightNext);
    renderRound();

    if (allWordsCompleted()) {
      showCelebrateModal({
        title: "💗✨ FINAL COMPLETO ✨💗",
        body: "Você completou TODAS as palavras de TODAS as rodadas!",
        hint: "Agora seus pontos viraram ∞ e o nível virou… a nossa foto. 🥹💍",
        grand: true,
      });
      applyEndgameUI();
    }
  }

  $("#btn-help").addEventListener("click", () => openHelp(true));
  $("#btn-close-help").addEventListener("click", () => openHelp(false));

  $("#btn-close-celebrate").addEventListener("click", () => openCelebrate(false));

  $("#btn-reset").addEventListener("click", () => {
    clearCampaign(CAMPAIGN_ID);
    location.reload();
  });

  $("#btn-delete").addEventListener("click", backspace);
  $("#btn-enter").addEventListener("click", submit);

  $("#btn-shuffle").addEventListener("click", () => {
    const round = getRound();
    const outer = round.letters.filter((c) => c !== round.center);
    const shuffled = shuffle([...outer]);
    lettersOrder = [round.center, ...shuffled];
    renderRound();
  });

  $("#honeycomb").addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const letter = (t as HTMLButtonElement)?.dataset?.letter;
    if (!letter) return;
    addChar(letter);
  });

  $("#keyboard").addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const key = (t as HTMLButtonElement)?.dataset?.key;
    if (!key) return;
    addChar(key);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") return submit();
    if (e.key === "Backspace") return backspace();
    if (e.key.length !== 1) return;
    addChar(e.key);
  });

  renderRoundNavNow(false);
  renderRound();
}

main();