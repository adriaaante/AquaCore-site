"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Icons } from "./Icons";

const nav = [
  { label: "Направления", href: "/#napravleniya" },
  { label: "Возможности", href: "/vozmozhnosti/" },
  { label: "Выгоды", href: "/#vygody" },
  { label: "Тарифы", href: "/tarify/" },
  { label: "Как начать", href: "/#kak-nachat" },
  { label: "Вопросы", href: "/#faq" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/85 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="AquaCore — на главную">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/#zayavka" className="btn-primary">
            Оставить заявку
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-ink lg:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
        >
          {open ? <Icons.close className="h-5 w-5" /> : <Icons.menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="lg:hidden">
          <div className="container-x flex flex-col gap-1 border-t border-slate-200 bg-white pb-6 pt-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#zayavka"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
