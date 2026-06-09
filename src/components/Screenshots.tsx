"use client";

import { useEffect, useState } from "react";
import { shots, type Shot } from "@/config/screens";
import { Icons } from "./Icons";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const src = (file: string) => `${base}/screens/${file}`;

const ROLES = ["Все", "Управляющий", "Администратор", "Исполнитель", "Клиент"] as const;

export function Screenshots() {
  const [role, setRole] = useState<(typeof ROLES)[number]>("Все");
  const [active, setActive] = useState<Shot | null>(null);

  const list = role === "Все" ? shots : shots.filter((s) => s.role === role);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <div>
      {/* Фильтр по ролям */}
      <div className="flex flex-wrap justify-center gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              role === r
                ? "bg-brand-gradient text-white shadow-brand"
                : "border border-slate-200 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Сетка карточек */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <button
            key={s.file}
            type="button"
            onClick={() => setActive(s)}
            className="card card-hover group text-left"
          >
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={src(s.file)}
                alt={s.title}
                loading="lazy"
                className={`w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] ${
                  s.device === "mobile" ? "h-72" : "h-48"
                }`}
              />
              <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {s.role}
              </span>
              <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-600 opacity-0 shadow-card transition-opacity group-hover:opacity-100">
                <Icons.scan className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{s.caption}</p>
          </button>
        ))}
      </div>

      {/* Лайтбокс */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-auto bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActive(null)}
        >
          <div
            className="relative my-auto w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">{active.role}</p>
                <h3 className="text-lg font-bold">{active.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Закрыть"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Icons.close className="h-5 w-5" />
              </button>
            </div>
            <img
              src={src(active.file)}
              alt={active.title}
              className={`mx-auto w-full rounded-2xl border border-white/10 bg-white shadow-brand ${
                active.device === "mobile" ? "max-w-sm" : ""
              }`}
            />
            <p className="mt-3 text-center text-sm text-slate-300">{active.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
