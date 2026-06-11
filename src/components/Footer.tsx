import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { Icons } from "./Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            Программа для автомойки и шиномонтажа: операционная доска, распознавание
            номеров, лояльность, контроль кассы, зарплата и аналитика — в одной системе.
            Всё просто, аналитика под рукой, бизнес приносит больше.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Разделы</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            <li>
              <Link href="/vozmozhnosti/" className="hover:text-brand-600">
                Возможности
              </Link>
            </li>
            <li>
              <Link href="/tarify/" className="hover:text-brand-600">
                Тарифы
              </Link>
            </li>
            <li>
              <Link href="/#vygody" className="hover:text-brand-600">
                Выгоды для бизнеса
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-brand-600">
                Частые вопросы
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Контакты</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            <li>
              <a
                href={`mailto:${site.contacts.email}`}
                className="inline-flex items-center gap-2 hover:text-brand-600"
              >
                <Icons.mail className="h-4 w-4 text-brand-500" />
                {site.contacts.email}
              </a>
            </li>
            <li>
              <a
                href={site.contacts.phoneHref}
                className="inline-flex items-center gap-2 hover:text-brand-600"
              >
                <Icons.phone className="h-4 w-4 text-brand-500" />
                {site.contacts.phone}
              </a>
            </li>
            <li>
              <a
                href={site.contacts.telegramHref}
                className="inline-flex items-center gap-2 hover:text-brand-600"
              >
                <Icons.telegram className="h-4 w-4 text-brand-500" />
                Telegram
              </a>
            </li>
          </ul>
          <Link href="/#zayavka" className="btn-primary mt-5">
            Оставить заявку
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Документы</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            <li>
              <Link href="/privacy/" className="hover:text-brand-600">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/usloviya/" className="hover:text-brand-600">
                Правовая информация
              </Link>
            </li>
            <li>
              <Link href="/soglasie/" className="hover:text-brand-600">
                Согласие на обработку данных
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col gap-3 py-6 text-xs leading-relaxed text-ink-muted lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-0.5">
            <p>{site.legal.orgName}</p>
            <p>
              ИНН {site.legal.inn} · ОГРНИП {site.legal.ogrnip} ·{" "}
              <Link href="/usloviya/" className="hover:text-brand-600 hover:underline">
                полные реквизиты
              </Link>
            </p>
          </div>
          <p className="lg:text-right">
            © {year} {site.name}. Все права защищены.
            <span className="block">
              Информация на сайте не является публичной офертой (ст. 437 ГК РФ).
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
