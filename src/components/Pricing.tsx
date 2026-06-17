import Link from "next/link";
import { site } from "@/config/site";
import { Icons } from "./Icons";
import { Reveal } from "./Reveal";

const basicIncludes = [
  "Доска мойки в реальном времени",
  "Клиенты, автомобили и история визитов",
  "Программа лояльности: кешбэк, уровни, акции",
  "Прайс-лист с классами авто и чек-листами",
  "Зарплата сотрудников по гибким правилам",
  "Касса и сверка смены, Z-отчёты",
  "Дашборд, аналитика и выгрузка в Excel",
  "Аудит действий и контроль злоупотреблений",
  "Распознавание госномеров",
  "Роли: менеджер, администратор, исполнитель",
];

const proAdds = [
  "Всё из базового тарифа",
  "Личный кабинет клиента (история, бонусы)",
  "Онлайн-запись клиентов",
  "Постоянная ссылка и QR-код для входа клиентов",
  "Уведомления в Telegram: клиенту «машина готова» и чек, сотрудникам — события по ролям",
  "Подключение и онбординг под ключ",
];

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <Reveal>
        <PlanCard
          name={site.pricing.basic.name}
          price={site.pricing.basic.price}
          period={site.pricing.basic.period}
          badge={site.pricing.basic.badge}
          highlight
          features={basicIncludes}
          subtitle="Полный порядок на мойке — всё для управления и роста."
        />
      </Reveal>
      <Reveal delay={100}>
        <PlanCard
          name={site.pricing.pro.name}
          price={site.pricing.pro.price}
          period={site.pricing.pro.period}
          badge={site.pricing.pro.badge}
          features={proAdds}
          subtitle="Базовый плюс прямая связь с клиентами и онлайн-сервис."
        />
      </Reveal>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  badge,
  features,
  subtitle,
  highlight = false,
}: {
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-7 ${
        highlight
          ? "border-brand-300 bg-white shadow-brand ring-1 ring-brand-200"
          : "border-slate-200 bg-white shadow-card"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-bold ${
            highlight ? "bg-brand-gradient text-white shadow-brand" : "bg-slate-900 text-white"
          }`}
        >
          {badge}
        </span>
      )}
      <h3 className="text-lg font-bold text-ink">{name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-4xl font-extrabold tracking-tight text-ink">{price}</span>
        <span className="pb-1 text-sm text-ink-muted">{period}</span>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <Icons.gift className="h-3.5 w-3.5" /> Первые 14 дней — бесплатно
      </p>

      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-ink-soft">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icons.check className="h-3.5 w-3.5" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/#zayavka"
        className={`mt-7 ${highlight ? "btn-primary" : "btn-secondary"}`}
      >
        {highlight ? "Выбрать базовый" : "Оставить заявку"}
        <Icons.arrow className="h-4 w-4" />
      </Link>
    </div>
  );
}
