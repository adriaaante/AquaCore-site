import Link from "next/link";
import { site } from "@/config/site";
import { benefits, faq, keyFeatures, scenarios, steps } from "@/config/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icons } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, FeatureCard } from "@/components/Section";
import { DashboardMock } from "@/components/DashboardMock";
import { PricingCards } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import { Screenshots } from "@/components/Screenshots";
import { LeadForm } from "@/components/LeadForm";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <Pain />
        <MultiService />
        <ProductShots />
        <KeyFeatures />
        <Anpr />
        <Loyalty />
        <Benefits />
        <Analytics />
        <Roles />
        <Security />
        <Integrations />
        <Pricing />
        <Steps />
        <FaqSection />
        <CtaForm />
      </main>
      <Footer />
    </>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */
function Hero() {
  return (
    <section className="relative bg-hero-radial pt-[72px]">
      <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <span className="eyebrow">
            <Icons.sparkles className="h-3.5 w-3.5" /> Программа для автомойки и шиномонтажа
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Мойка и шиномонтаж под полным контролем — и{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">доход растёт</span>
          </h1>
          <p className="lead mt-5 max-w-xl">
            AquaCore — единая система: доска заказов в реальном времени, распознавание
            госномеров, программа лояльности, контроль кассы, зарплата и аналитика. С ней всё
            просто, аналитика под рукой, а бизнес начинает приносить больше дохода.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#zayavka" className="btn-primary">
              Оставить заявку <Icons.arrow className="h-4 w-4" />
            </Link>
            <Link href="/vozmozhnosti/" className="btn-secondary">
              Смотреть возможности
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <Icons.check className="h-4 w-4 text-brand-500" /> от 50 000 ₽ в год
            </span>
            <span className="inline-flex items-center gap-2">
              <Icons.check className="h-4 w-4 text-brand-500" /> запуск за день
            </span>
            <span className="inline-flex items-center gap-2">
              <Icons.check className="h-4 w-4 text-brand-500" /> на русском языке
            </span>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-gradient opacity-10 blur-2xl" />
          <DashboardMock />
          <img
            src={site.images.hero}
            alt="Современная автомойка AquaCore"
            loading="eager"
            className="mt-5 h-40 w-full rounded-2xl border border-slate-200 object-cover shadow-card sm:h-48"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── PAIN ───────────────────────────── */
function Pain() {
  const items = [
    { icon: "cash" as const, t: "Деньги «утекают»", d: "Нет прозрачной кассы — сложно понять, куда уходит выручка." },
    { icon: "users" as const, t: "Клиенты не возвращаются", d: "Без лояльности человек моется там, где ближе или дешевле сегодня." },
    { icon: "doc" as const, t: "Учёт в тетради", d: "Нет истории, отчётов и понимания, какие услуги реально прибыльны." },
    { icon: "clock" as const, t: "Очереди и хаос", d: "Ручной приём тормозит поток машин в час пик." },
  ];
  return (
    <section className="section bg-slate-50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Знакомо?"
          title="Типичные проблемы автомойки"
          text="Эти «дыры» каждый месяц съедают прибыль. AquaCore закрывает их в одной системе."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = Icons[it.icon];
            return (
              <Reveal key={it.t} delay={(i % 4) * 70}>
                <div className="card h-full">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{it.t}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{it.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── MULTI-SERVICE ────────────────────────── */
function MultiService() {
  return (
    <section id="napravleniya" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Одна программа — все направления"
          title="Не только мойка: ещё и шиномонтаж, и детейлинг"
          text="AquaCore не привязан к одному виду работ. Мойка, шиномонтаж и детейлинг живут в одной системе и одной базе клиентов — а вся аналитика по доходу всегда под рукой."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((s, i) => {
            const Icon = Icons[s.icon];
            return (
              <Reveal key={s.title} delay={(i % 4) * 70}>
                <div className="card card-hover h-full">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-white shadow-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10 text-center">
          <p className="text-sm text-ink-muted">
            Один абонемент закрывает всё направление авто-ухода — без зоопарка из
            нескольких программ.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── PRODUCT SHOTS ──────────────────────── */
function ProductShots() {
  return (
    <section id="skrinshoty" className="section bg-slate-50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Как это выглядит"
          title="Реальные экраны системы, а не картинки"
          text="Это скриншоты работающего приложения AquaCore. Нажмите на любой, чтобы рассмотреть детально."
        />
        <div className="mt-12">
          <Screenshots />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── KEY FEATURES ───────────────────────── */
function KeyFeatures() {
  return (
    <section id="vozmozhnosti" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Возможности"
          title="Огромный функционал уже в базовом тарифе"
          text="Десятки инструментов для управления мойкой — без доплат за каждую функцию."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((f, i) => {
            const Icon = Icons[f.icon];
            return (
              <FeatureCard
                key={f.title}
                index={i}
                icon={<Icon className="h-6 w-6" />}
                title={f.title}
                text={f.text}
              />
            );
          })}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/vozmozhnosti/" className="btn-secondary">
            Все возможности подробно <Icons.arrow className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── ANPR ───────────────────────────── */
function Anpr() {
  return (
    <section className="section bg-ink text-white">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
            <Icons.scan className="h-3.5 w-3.5" /> Распознавание номеров
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Узнаёт клиента ещё до того, как он вышел из машины
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Камера считывает госномер на въезде, а система сама находит зарегистрированного
            клиента: подтягивает его автомобиль, историю визитов, баланс бонусов и положенную
            скидку. Администратору остаётся подтвердить заказ.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Авто-подстановка карточки клиента по номеру",
              "Поддержка ГОСТ-номеров и кириллицы",
              "Меньше ручного ввода — быстрее приём машин",
              "Предупреждение о повторном визите за день",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-slate-200">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-500/20 text-brand-300">
                  <Icons.check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120} className="relative">
          <img
            src={site.images.anpr}
            alt="Распознавание госномера на въезде на мойку"
            loading="lazy"
            className="w-full rounded-2xl border border-white/10 object-cover shadow-brand"
          />
          <div className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 backdrop-blur">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Распознан клиент</p>
            <p className="font-mono text-lg font-bold">А123ВС 777</p>
            <p className="text-xs text-brand-300">Иван · 14 визитов · скидка 10%</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── LOYALTY ──────────────────────────── */
function Loyalty() {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-sm">
            <img
              src={site.images.client}
              alt="Довольный клиент автомойки с приложением лояльности"
              loading="lazy"
              className="w-full rounded-2xl border border-slate-200 object-cover shadow-card"
            />
            <div className="absolute -right-4 -top-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-brand">
              <p className="text-xs text-ink-muted">Баланс бонусов</p>
              <p className="text-2xl font-extrabold text-brand-600">+1 240 ₽</p>
            </div>
            <div className="absolute -bottom-4 left-4 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-card">
              <p className="text-xs font-semibold text-ink">Уровень «Серебро» · −5%</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <span className="eyebrow">
            <Icons.gift className="h-3.5 w-3.5" /> Лояльность
          </span>
          <h2 className="mt-5 h-title">Клиент выбирает вас — раз за разом</h2>
          <p className="lead mt-4">
            Программа лояльности превращает случайных посетителей в постоянных. Чем больше человек
            моется у вас — тем выгоднее ему возвращаться именно к вам, а не к соседней мойке.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { t: "Кешбэк бонусами", d: "Процент с каждой мойки возвращается на бонусный счёт." },
              { t: "Уровни скидок", d: "Скидка растёт вместе с суммой трат клиента." },
              { t: "Гибкие акции", d: "По дням, времени, услугам и классам авто." },
              { t: "Снижение оттока", d: "Бонусы «сгорают» — повод приехать снова." },
            ].map((b) => (
              <div key={b.t} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <h3 className="font-bold text-ink">{b.t}</h3>
                <p className="mt-1 text-sm text-ink-muted">{b.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── BENEFITS ─────────────────────────── */
function Benefits() {
  return (
    <section id="vygody" className="section bg-slate-50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Выгода для бизнеса"
          title="Почему доход на мойке вырастет"
          text="Не «волшебные обещания», а конкретные рычаги, заложенные в систему."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = Icons[b.icon];
            return (
              <FeatureCard
                key={b.title}
                index={i}
                icon={<Icon className="h-6 w-6" />}
                title={b.title}
                text={b.text}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── ANALYTICS ─────────────────────────── */
function Analytics() {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow">
            <Icons.chart className="h-3.5 w-3.5" /> Отчётность
          </span>
          <h2 className="mt-5 h-title">Автоматическая отчётность вместо тетрадей</h2>
          <p className="lead mt-4">
            Система сама считает всё, что важно владельцу. Открыли дашборд — и видите реальную
            картину по выручке, расходам и клиентам за любой период.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Выручка, ФОТ, маржа, средний чек и новые клиенты",
              "Z-отчёты по сменам с разбивкой по способам оплаты",
              "Выгрузка визитов в Excel за любой период",
              "Рейтинг самых прибыльных услуг и лучших клиентов",
              "Загрузка по часам — видно пики и простои",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icons.check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── ROLES ──────────────────────────── */
function Roles() {
  const roles = [
    { icon: "chart" as const, t: "Менеджер", d: "Аналитика, цены, сотрудники, лояльность и настройки — вход по email." },
    { icon: "board" as const, t: "Администратор", d: "Доска мойки, приём и оплата, смена и касса — быстрый вход по PIN." },
    { icon: "car" as const, t: "Исполнитель", d: "Простая очередь задач с крупными кнопками и заработком в реальном времени." },
    { icon: "phone" as const, t: "Клиент", d: "Личный кабинет: история, бонусы, оценки и онлайн-запись." },
  ];
  return (
    <section className="section bg-slate-50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Роли и кабинеты"
          title="Свой удобный интерфейс для каждого"
          text="Один продукт — четыре роли. Каждый видит только то, что нужно ему для работы."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => {
            const Icon = Icons[r.icon];
            return (
              <Reveal key={r.t} delay={(i % 4) * 70}>
                <div className="card card-hover h-full text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-brand">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{r.t}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{r.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SECURITY ─────────────────────────── */
function Security() {
  const items = [
    { icon: "shield" as const, t: "Неизменяемый аудит", d: "Кто, что и когда сделал — фиксируется навсегда. Изменить задним числом нельзя." },
    { icon: "bolt" as const, t: "Детектор злоупотреблений", d: "15+ признаков: крупные скидки, расхождения по кассе, возвраты, оплаты без исполнителя." },
    { icon: "cash" as const, t: "Сверка кассы", d: "Система знает ожидаемый остаток. Любое расхождение — на виду, с комментарием." },
    { icon: "lock" as const, t: "Защита данных", d: "«Мягкое» удаление с восстановлением 30 дней и изоляция данных каждой мойки." },
  ];
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Контроль"
          title="Прозрачность, которая защищает вашу прибыль"
          text="AquaCore не просто учитывает — он помогает находить и устранять потери."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = Icons[it.icon];
            return (
              <FeatureCard
                key={it.t}
                index={i}
                icon={<Icon className="h-6 w-6" />}
                title={it.t}
                text={it.d}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── INTEGRATIONS ───────────────────────── */
function Integrations() {
  const items = [
    { icon: "bell" as const, t: "SMS клиентам", d: "«Машина готова» и чек после оплаты — через SMS Aero или SMS.ru." },
    { icon: "telegram" as const, t: "Telegram руководителю", d: "Алерты о низких оценках и расхождениях по кассе прямо в мессенджер." },
    { icon: "scan" as const, t: "Распознавание номеров", d: "Своё решение распознавания без привязки к одному поставщику." },
    { icon: "mail" as const, t: "Email", d: "Подтверждение почты и восстановление доступа для сотрудников." },
  ];
  return (
    <section className="section bg-slate-50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Интеграции"
          title="Подключается к привычным каналам"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = Icons[it.icon];
            return (
              <Reveal key={it.t} delay={(i % 4) * 70}>
                <div className="card card-hover h-full">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{it.t}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{it.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PRICING ──────────────────────────── */
function Pricing() {
  return (
    <section id="tarify" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Тарифы"
          title="Честная цена за огромный функционал"
          text="Базовый тариф уже включает почти всё. Дешевле аналогов — и без скрытых доплат."
        />
        <div className="mt-12">
          <PricingCards />
        </div>
        <p className="mt-6 text-center text-sm text-ink-muted">
          Нужна помощь с выбором?{" "}
          <Link href="/tarify/" className="font-semibold text-brand-600 hover:underline">
            Сравнить тарифы подробно
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────── STEPS ───────────────────────────── */
function Steps() {
  return (
    <section id="kak-nachat" className="section bg-ink text-white">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
            Как начать
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Запуск за 4 простых шага
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={(i % 4) * 80}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="text-3xl font-extrabold text-brand-400">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── FAQ ────────────────────────────── */
function FaqSection() {
  return (
    <section id="faq" className="section">
      <FaqJsonLd />
      <div className="container-x">
        <SectionHeading eyebrow="Вопросы и ответы" title="Частые вопросы" />
        <div className="mt-12">
          <Faq items={faq} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA FORM ─────────────────────────── */
function CtaForm() {
  return (
    <section id="zayavka" className="section bg-slate-50">
      <div className="container-x">
        <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-card lg:grid-cols-2 lg:p-12">
          <Reveal>
            <span className="eyebrow">Заявка</span>
            <h2 className="mt-4 h-title">Покажем AquaCore на примере вашей мойки</h2>
            <p className="lead mt-4">
              Оставьте контакты — проведём демонстрацию, ответим на вопросы и поможем рассчитать
              выгоду для вашего бизнеса.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <a
                href={`mailto:${site.contacts.email}`}
                className="flex items-center gap-3 text-ink-soft hover:text-brand-600"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icons.mail className="h-5 w-5" />
                </span>
                {site.contacts.email}
              </a>
              <a
                href={site.contacts.phoneHref}
                className="flex items-center gap-3 text-ink-soft hover:text-brand-600"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icons.phone className="h-5 w-5" />
                </span>
                {site.contacts.phone}
              </a>
              <a
                href={site.contacts.telegramHref}
                className="flex items-center gap-3 text-ink-soft hover:text-brand-600"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icons.telegram className="h-5 w-5" />
                </span>
                Telegram
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <LeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
