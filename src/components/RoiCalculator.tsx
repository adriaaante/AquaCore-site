"use client";

import { useState } from "react";
import { Icons } from "./Icons";

// Ориентировочные рычаги роста, заложенные в систему (консервативная оценка).
const LEVERS = [
  { label: "Повторные визиты по лояльности", pct: 0.08 },
  { label: "Допродажи (химия, воск, доп. услуги)", pct: 0.06 },
  { label: "Меньше простоев и потерь на кассе", pct: 0.04 },
];
const UPLIFT = LEVERS.reduce((s, l) => s + l.pct, 0); // 0.18
const SUBSCRIPTION_YEAR = 50000;

const rub = (n: number) => Math.round(n).toLocaleString("ru-RU") + " ₽";

export function RoiCalculator() {
  const [cars, setCars] = useState(30);
  const [check, setCheck] = useState(800);
  const [days, setDays] = useState(26);

  const revenueMonth = cars * check * days;
  const extraMonth = revenueMonth * UPLIFT;
  const extraYear = extraMonth * 12;
  const paybackDays = extraMonth > 0 ? Math.max(1, Math.ceil(SUBSCRIPTION_YEAR / (extraMonth / 30))) : 0;

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      <div className="grid lg:grid-cols-2">
        {/* Ввод */}
        <div className="p-7 sm:p-9">
          <h3 className="text-lg font-bold text-ink">Параметры вашей мойки</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Подвигайте ползунки — расчёт обновится сразу.
          </p>
          <div className="mt-7 space-y-7">
            <Slider
              label="Машин в день"
              value={cars}
              min={5}
              max={150}
              step={1}
              suffix=""
              onChange={setCars}
            />
            <Slider
              label="Средний чек"
              value={check}
              min={300}
              max={3000}
              step={50}
              suffix=" ₽"
              onChange={setCheck}
            />
            <Slider
              label="Рабочих дней в месяц"
              value={days}
              min={20}
              max={31}
              step={1}
              suffix=""
              onChange={setDays}
            />
          </div>
        </div>

        {/* Результат */}
        <div className="bg-ink p-7 text-white sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">
            Оценка с AquaCore
          </p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              +{rub(extraMonth)}
            </span>
            <span className="pb-1.5 text-sm text-slate-300">/ месяц</span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            это <span className="font-semibold text-white">+{rub(extraYear)}</span> в год
            к выручке
          </p>

          <div className="mt-6 space-y-2.5">
            {LEVERS.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-300">{l.label}</span>
                <span className="font-semibold text-brand-200">+{Math.round(l.pct * 100)}%</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Icons.bolt className="h-4 w-4 text-brand-300" />
              <span>
                Подписка <span className="font-semibold">{rub(SUBSCRIPTION_YEAR)}/год</span>{" "}
                окупается примерно за{" "}
                <span className="font-semibold text-brand-200">{paybackDays} дн.</span>
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Ориентировочный расчёт по консервативным рычагам, заложенным в систему.
            Реальный результат зависит от вашей мойки — на демонстрации посчитаем точнее.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
          {value.toLocaleString("ru-RU")}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-500"
      />
    </div>
  );
}
