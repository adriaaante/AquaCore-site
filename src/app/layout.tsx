import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { site } from "@/config/site";
import { CookieNotice } from "@/components/CookieNotice";
import { OrganizationJsonLd, SoftwareAppJsonLd } from "@/components/JsonLd";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Фирменный шрифт с кириллицей. next/font скачивает файлы при сборке и
// раздаёт их с нашего же домена — без запросов к Google в рантайме.
// Он же определяет переменную --font-sans, на которую ссылается Tailwind.
const fontSans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — программа для автомойки и шиномонтажа: полный функционал от 50 000 ₽ в год`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "./" },
  keywords: [
    "программа для автомойки",
    "CRM для автомойки",
    "автоматизация автомойки",
    "учёт на автомойке",
    "программа для шиномонтажа",
    "CRM для шиномонтажа",
    "автоматизация шиномонтажа",
    "программа для автосервиса",
    "распознавание номеров автомойка",
    "программа лояльности автомойка",
    "AquaCore",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — система управления автомойкой и шиномонтажом`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — программа для автомойки и шиномонтажа` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — система управления автомойкой и шиномонтажом`,
    description: site.description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [{ url: `${base}/icon.svg`, type: "image/svg+xml" }],
    apple: `${base}/icon.svg`,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={fontSans.variable}>
      <body>
        <OrganizationJsonLd />
        <SoftwareAppJsonLd />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
