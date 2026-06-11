"use client";

import { useEffect, useState } from "react";

const KEY = "aquacore.cookie-consent";

/**
 * Уведомление об использовании cookie (152-ФЗ: информирование посетителя об
 * обработке данных, собираемых автоматически). Показывается до подтверждения,
 * выбор запоминается на устройстве.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* приватный режим — просто не показываем повторно в сессии */
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
          Мы используем файлы cookie и аналогичные технологии, чтобы сайт
          работал корректно. Оставаясь на сайте, вы соглашаетесь с{" "}
          <a
            href="/privacy/"
            className="font-semibold text-brand-700 underline hover:no-underline"
          >
            Политикой конфиденциальности
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.setItem(KEY, String(Date.now()));
            } catch {
              /* ок — скроем только на эту сессию */
            }
            setVisible(false);
          }}
          className="btn-primary shrink-0 !px-5 !py-2.5 text-sm"
        >
          Хорошо
        </button>
      </div>
    </div>
  );
}
