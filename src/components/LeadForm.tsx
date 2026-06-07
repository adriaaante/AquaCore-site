"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { Icons } from "./Icons";

type Status = "idle" | "sending" | "ok" | "error";

const KEY_PLACEHOLDER = "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const keyReady =
    site.web3formsAccessKey && site.web3formsAccessKey !== KEY_PLACEHOLDER;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Если ключ Web3Forms не настроен — открываем почтовый клиент с заполненным письмом.
    if (!keyReady) {
      const subject = encodeURIComponent("Заявка на AquaCore с сайта");
      const body = encodeURIComponent(
        `Имя: ${data.get("name") || ""}\n` +
          `Телефон: ${data.get("phone") || ""}\n` +
          `Город / мойка: ${data.get("company") || ""}\n` +
          `Комментарий: ${data.get("message") || ""}`,
      );
      window.location.href = `mailto:${site.contacts.email}?subject=${subject}&body=${body}`;
      setStatus("ok");
      return;
    }

    setStatus("sending");
    try {
      data.append("access_key", site.web3formsAccessKey);
      data.append("subject", "Новая заявка на AquaCore");
      data.append("from_name", "Сайт AquaCore");
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
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
          {keyReady
            ? "Мы свяжемся с вами в ближайшее время и проведём демонстрацию."
            : "Откроется ваш почтовый клиент — отправьте письмо, и мы свяжемся с вами."}
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
      <p className="text-xs text-ink-muted">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
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
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
