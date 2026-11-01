// Согласие на cookie и Яндекс.Метрика. По 152-ФЗ аналитика — только с согласия:
// счётчик грузится кодом после «Принять все» (CookieNotice), тегом в <head> его нет.
// Счётчик «AquaCore» — аккаунт владельца в Метрике, создан 01.11.2026 через API (см. CLAUDE.md).
export const YM_ID = 113977705;

export type Consent = "all" | "necessary";
// Новый ключ: прежнее уведомление («Оставаясь на сайте, вы соглашаетесь») согласием на аналитику не было.
const KEY = "aquacore.consent-v2";
const EVT = "aquacore:consent";

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return "necessary";
  }
}

export function setConsent(v: Consent | null) {
  try {
    if (v) window.localStorage.setItem(KEY, v);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* приватный режим — выбор живёт до перезагрузки */
  }
  window.dispatchEvent(new Event(EVT));
  if (v === "all") loadMetrika();
}

export function onConsentChange(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}

type Ym = ((id: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};
declare global {
  interface Window {
    ym?: Ym;
  }
}

/** Вебвизор выключен: он пишет ввод в поля — включать только с правкой политики и маскированием. */
export function loadMetrika() {
  if (window.ym) return;
  const ym = ((...args: unknown[]) => {
    (ym.a = ym.a || []).push(args);
  }) as Ym;
  ym.l = Date.now();
  window.ym = ym;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(s);
  ym(YM_ID, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
}

/** Переход внутри сайта без перезагрузки. */
export function hit(url: string) {
  window.ym?.(YM_ID, "hit", url);
}

/** Цель «Заявка отправлена» (lead). Без согласия счётчика нет — цель молча не уходит. */
export function reachGoal(name: string) {
  window.ym?.(YM_ID, "reachGoal", name);
}
