import { $ } from "./dom";

export function toast(message: string, kind: "ok" | "warn" | "info" = "info") {
  const root = $("#toast-root");
  const el = document.createElement("div");
  el.className = `toast toast--${kind}`;
  el.textContent = message;
  root.appendChild(el);

  requestAnimationFrame(() => el.classList.add("is-in"));

  setTimeout(() => {
    el.classList.remove("is-in");
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 250);
  }, 1800);
}