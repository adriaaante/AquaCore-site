import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icons } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/Section";
import { PricingCards } from "@/components/Pricing";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Тарифы — программа для автомойки и шиномонтажа",
  description:
    "Тарифы AquaCore: базовый — 50 000 ₽ в год (огромный функционал управления мойкой и шиномонтажом), расширенный с клиентским кабинетом и уведомлениями в Telegram — 90 000 ₽ в год.",
};

const compare: { feature: string; basic: boolean; pro: boolean }[] = [
  { feature: "Доска мойки в реальном времени", basic: true, pro: true },
  { feature: "Клиенты, автомобили и история", basic: true, pro: true },
  { feature: "Программа лояльности и акции", basic: true, pro: true },
  { feature: "Прайс-лист с классами авто", basic: true, pro: true },
  { feature: "Зарплата сотрудников", basic: true, pro: true },
  { feature: "Касса и сверка смены", basic: true, pro: true },
  { feature: "Отчёты, аналитика, экспорт в Excel", basic: true, pro: true },
  { feature: "Аудит и контроль злоупотреблений", basic: true, pro: true },
  { feature: "Распознавание госномеров", basic: true, pro: true },
  { feature: "Кабинеты управляющего, админа, исполнителя", basic: true, pro: true },
  { feature: "Модуль «Клиентский кабинет» (история, бонусы)", basic: false, pro: true },
  { feature: "Онлайн-запись клиентов", basic: false, pro: true },
  { feature: "Постоянная ссылка и QR-код для входа клиентов", basic: false, pro: true },
  { feature: "Модуль «Уведомления в Telegram» (чек, «машина готова», события по ролям)", basic: false, pro: true },
  { feature: "Подключение и онбординг под ключ", basic: false, pro: true },
];

const pricingFaq = [
  {
    q: "Есть ли бесплатный период?",
    a: "Да, первые 14 дней — бесплатно и без привязки карты. Этого достаточно, чтобы настроить систему и оценить её на реальных визитах. Оплата — только если решите продолжить.",
  },
  {
    q: "Это разовый платёж или подписка?",
    a: "Цена указана за год использования системы. Вы платите фиксированную сумму и пользуетесь всем функционалом тарифа в течение года.",
  },
  {
    q: "Почему базовый тариф — самый подходящий?",
    a: "Потому что он уже включает практически весь функционал для управления мойкой: доску, клиентов, лояльность, зарплату, кассу, аналитику, аудит и распознавание номеров. Этого достаточно, чтобы навести порядок и увеличить доход. Кабинет клиента и уведомления в Telegram — приятное дополнение, но не обязательное для старта.",
  },
  {
    q: "Можно ли перейти с базового на расширенный позже?",
    a: "Да. Начните с базового тарифа, а когда захотите подключить клиентский кабинет и уведомления в Telegram — перейдёте на расширенный без потери данных.",
  },
  {
    q: "Как устроены модули?",
    a: "Система модульная. Базовый тариф — это полноценное ядро управления мойкой. Сверху по подписке подключаются модули «Клиентский кабинет» и «Уведомления в Telegram». Тариф «С кабинетом» — это базовый плюс оба модуля. Модули можно включить в любой момент одной галочкой в настройках, данные при этом не теряются.",
  },
  {
    q: "Как оформляется покупка?",
    a: "С каждой мойкой мы заключаем отдельный договор на использование программного обеспечения: вы оставляете заявку, мы проводим демонстрацию, согласуем условия, подписываем договор и выставляем счёт. Информация на сайте не является публичной офертой — все условия фиксируются в вашем договоре.",
  },
  {
    q: "Есть ли скрытые платежи?",
    a: "Нет. Стоимость прозрачна: базовый — 50 000 ₽ в год, с клиентским кабинетом — 90 000 ₽ в год. Внутри тарифа функции не блокируются доплатами.",
  },
];

export default function TarifyPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden pt-[72px]">
        <section className="bg-hero-radial py-16 sm:py-20">
          <div className="container-x text-center">
            <Reveal>
              <span className="eyebrow">
                <Icons.tag className="h-3.5 w-3.5" /> Тарифы
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Прозрачная цена, максимум пользы
              </h1>
              <p className="lead mx-auto mt-5 max-w-2xl">
                Первые 14 дней — бесплатно, без карты. Базовый тариф уже включает огромный
                функционал — и никаких скрытых доплат за отдельные функции.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container-x">
            <PricingCards />
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-ink-muted">
              Указанные цены носят справочный характер и не являются публичной
              офертой (ст. 437 ГК РФ). Доступ к системе предоставляется по
              отдельному договору, заключаемому с каждым заказчиком; итоговые
              условия фиксируются в договоре.
            </p>
          </div>
        </section>

        <section className="section bg-slate-50">
          <div className="container-x">
            <SectionHeading
              eyebrow="Сравнение"
              title="Что входит в каждый тариф"
            />
            <Reveal className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 font-bold text-ink">Возможность</th>
                    <th className="px-4 py-4 text-center font-bold text-brand-700">
                      Базовый
                      <span className="block text-xs font-normal text-ink-muted">50 000 ₽/год</span>
                    </th>
                    <th className="px-4 py-4 text-center font-bold text-ink">
                      С кабинетом
                      <span className="block text-xs font-normal text-ink-muted">90 000 ₽/год</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i % 2 ? "bg-slate-50/40" : "bg-white"}
                    >
                      <td className="px-5 py-3.5 text-ink-soft">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">
                        <Mark on={row.basic} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Mark on={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Reveal>
            <p className="mt-6 text-center text-sm text-ink-muted">
              Не уверены, какой тариф выбрать?{" "}
              <Link href="/#zayavka" className="font-semibold text-brand-600 hover:underline">
                Оставьте заявку — поможем определиться
              </Link>
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Об оплате" title="Частые вопросы по тарифам" />
            <div className="mt-12">
              <Faq items={pricingFaq} />
            </div>
          </div>
        </section>

        <section className="section bg-ink text-white">
          <div className="container-x text-center">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Начните зарабатывать больше уже в этом месяце
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                Оставьте заявку — покажем систему и рассчитаем выгоду для вашей мойки.
              </p>
              <Link href="/#zayavka" className="btn-primary mt-8">
                Оставить заявку <Icons.arrow className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Mark({ on }: { on: boolean }) {
  return on ? (
    <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-brand-50 text-brand-600">
      <Icons.check className="h-4 w-4" />
    </span>
  ) : (
    <span className="text-slate-300">—</span>
  );
}
