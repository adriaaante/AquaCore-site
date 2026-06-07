/**
 * Самодостаточный CSS/SVG-мок дашборда AquaCore («скриншот продукта»).
 * Не зависит от внешних картинок — выглядит как реальный интерфейс.
 */
export function DashboardMock({ className = "" }: { className?: string }) {
  const kpis = [
    { label: "Выручка", value: "184 200 ₽", up: "+12%" },
    { label: "Средний чек", value: "1 280 ₽", up: "+6%" },
    { label: "Визитов", value: "144", up: "+18%" },
    { label: "Новые клиенты", value: "27", up: "+9%" },
  ];
  // Высоты столбиков графика (выручка − ФОТ), в процентах
  const bars = [42, 55, 48, 70, 64, 82, 76];
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-brand ${className}`}
    >
      {/* Шапка окна */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-medium text-ink-muted">
          AquaCore · Дашборд менеджера
        </span>
        <span className="ml-auto rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
          30 дней
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-5">
        {/* KPI-карточки */}
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[11px] text-ink-muted">{k.label}</p>
              <p className="mt-1 text-base font-extrabold text-ink">{k.value}</p>
              <p className="text-[10px] font-semibold text-emerald-600">{k.up}</p>
            </div>
          ))}
        </div>

        {/* График */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink">Выручка минус ФОТ</p>
            <p className="text-[10px] text-ink-muted">за неделю</p>
          </div>
          <div className="mt-3 flex h-28 items-end gap-2">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-md bg-brand-gradient"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] text-ink-muted">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Мини-таблица доски */}
      <div className="border-t border-slate-200 px-4 pb-4">
        <p className="py-2 text-[11px] font-semibold text-ink-muted">Доска · сейчас на мойке</p>
        <div className="space-y-1.5">
          {[
            { plate: "А123ВС 777", svc: "Комплекс + воск", st: "В работе", c: "bg-blue-100 text-blue-700" },
            { plate: "О456КУ 199", svc: "Экспресс-мойка", st: "Готово", c: "bg-emerald-100 text-emerald-700" },
            { plate: "Р789МН 750", svc: "Химчистка салона", st: "Новый", c: "bg-slate-100 text-slate-600" },
          ].map((r) => (
            <div
              key={r.plate}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
            >
              <span className="rounded-md bg-white px-2 py-1 font-mono text-[11px] font-bold text-ink ring-1 ring-slate-200">
                {r.plate}
              </span>
              <span className="truncate text-[11px] text-ink-soft">{r.svc}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.c}`}>
                {r.st}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
