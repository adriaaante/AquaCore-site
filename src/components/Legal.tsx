import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Icons } from "./Icons";

/** Обёртка для юридических страниц (политика, оферта, согласие). */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden pt-[72px]">
        <section className="border-b border-slate-200 bg-hero-radial py-12 sm:py-16">
          <div className="container-x">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
            >
              <Icons.arrow className="h-4 w-4 rotate-180" /> На главную
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            {updated ? (
              <p className="mt-2 text-sm text-ink-muted">Редакция от {updated}</p>
            ) : null}
          </div>
        </section>
        <section className="py-14 sm:py-20">
          <div className="container-x">
            <article className="legal mx-auto max-w-3xl">{children}</article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
