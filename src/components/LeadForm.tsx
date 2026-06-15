"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { Icons } from "./Icons";

type Status = "idle" | "sending" | "ok" | "error";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Серверный приёмник заявок на хостинге: шлёт в Telegram и на почту. */
const FORM_ENDPOINT = `${base}/send.php`;

/** Русские сообщения для встроенной валидации браузера (по умолчанию они на
 *  языке браузера, напр. «Please fill out this field»). */
function ruValidate(el: HTMLInputElement | HTMLTextAreaElement) {
  const v = el.validity;
  if (v.valueMissing) {
    el.setCustomValidity(
      el.type === "checkbox"
        ? "Подтвердите согласие на обработку персональных данных"
        : "Пожалуйста, заполните это поле",
    );
  } else if (v.typeMismatch || v.patternMismatch) {
    el.setCustomValidity("Проверьте правильность ввода");
  } else {
    el.setCustomValidity("");
  }
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    // 1) Telegram — через send.php на хостинге.
    const telegram = fetch(FORM_ENDPOINT, { method: "POST", body: data })
      .then((r) => r.json())
      .then((j) => !!j.success)
      .catch(() => false);

    // 2) Письмо — через web3forms прямо из браузера (бесплатный тариф разрешает
    //    только client-side). Публичный ключ берём у send.php.
    const email = (async () => {
      try {
        const cfg = await fetch(FORM_ENDPOINT).then((r) => r.json());
        const key = cfg?.web3forms_key;
        if (!key) return false;
        const r = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: key,
            subject: "Новая заявка с сайта AquaCore",
            from_name: "Сайт AquaCore",
            "Имя": data.get("name") || "—",
            "Телефон": data.get("phone") || "—",
            "Город/мойка": data.get("company") || "—",
            "Комментарий": data.get("message") || "—",
          }),
        });
        const j = await r.json();
        return !!j.success;
      } catch {
        return false;
      }
    })();

    const [tgOk, emailOk] = await Promise.all([telegram, email]);
    if (tgOk || emailOk) {
      setStatus("ok");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white">
          <Icons.check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-ink">Заявка отправлена!</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Мы свяжемся с вами в ближайшее время и проведём демонстрацию.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-5"
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Ваше имя" placeholder="Иван" required />
        <Field
          name="phone"
          label="Телефон"
          placeholder="+7 999 000-00-00"
          type="tel"
          required
        />
      </div>
      <Field name="company" label="Город и название мойки" placeholder="Москва, «АкваСити»" />
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Комментарий</span>
        <textarea
          name="message"
          rows={3}
          placeholder="Сколько постов, что хотите автоматизировать..."
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      {/* honeypot от спама */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          name="consent"
          required
          onInvalid={(e) => ruValidate(e.currentTarget)}
          onChange={(e) => ruValidate(e.currentTarget)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
        />
        <span>
          Отправляя форму, я даю{" "}
          <a href="/soglasie/" className="text-brand-600 underline hover:no-underline">
            согласие на обработку персональных данных
          </a>{" "}
          и принимаю{" "}
          <a href="/privacy/" className="text-brand-600 underline hover:no-underline">
            Политику конфиденциальности
          </a>
          .
        </span>
      </label>

      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Отправляем..." : "Получить демонстрацию"}
        <Icons.arrow className="h-4 w-4" />
      </button>

      {status === "error" && (
        <p className="text-sm text-rose-600">
          Не удалось отправить. Напишите нам на{" "}
          <a className="underline" href={`mailto:${site.contacts.email}`}>
            {site.contacts.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-ink-soft">
        {label}
        {required && <span className="text-brand-500"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onInvalid={(e) => ruValidate(e.currentTarget)}
        onInput={(e) => ruValidate(e.currentTarget)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
