export const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;
export const $$ = <T extends HTMLElement>(sel: string) => Array.from(document.querySelectorAll(sel)) as T[];