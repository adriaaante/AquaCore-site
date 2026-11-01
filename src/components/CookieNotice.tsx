"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, hit, loadMetrika, onConsentChange, setConsent } from "@/lib/metrika";

/**
 * Выбор cookie (152-ФЗ): необходимые работают всегда, аналитические
 * (Яндекс.Метрика) — только после «Принять все». Пока выбора нет, счётчик не
 * грузится. Вернуть панель — «Настройки cookie» в подвале (CookieSettingsLink).
 * Здесь же — переходы между страницами без перезагрузки уходят в Метрику как hit.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const path = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setVisible(getConsent() === null);
    sync();
    if (getConsent() === "all") loadMetrika();
    return onConsentChange(sync);
  }, []);

  useEffect(() => {
    if (last.current !== null && last.current !== path) hit(window.location.href);
    last.current = path;
  }, [path]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
          Мы используем cookie: технические нужны, чтобы сайт работал,
          аналитические (Яндекс.Метрика) включаем только с вашего согласия.
          Подробнее — в{" "}
          <a
            href="/privacy/"
            className="font-semibold text-brand-700 underline hover:no-underline"
          >
            Политике конфиденциальности
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setConsent("all")}
            className="btn-primary !px-5 !py-2.5 text-sm"
          >
            Принять все
          </button>
          <button
            type="button"
            onClick={() => setConsent("necessary")}
            className="px-3 py-2 text-xs text-ink-muted hover:text-ink"
          >
            Только необходимые
          </button>
        </div>
      </div>
    </div>
  );
}

/** «Настройки cookie» в подвале — снова показывает выбор. */
export function CookieSettingsLink() {
  return (
    <button type="button" onClick={() => setConsent(null)} className="hover:text-brand-600">
      Настройки cookie
    </button>
  );
}
