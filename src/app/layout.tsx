import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { CookieNotice } from "@/components/CookieNotice";
import { OrganizationJsonLd, SoftwareAppJsonLd } from "@/components/JsonLd";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — программа для автомойки и шиномонтажа №1 по соотношению цена/возможности`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
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
    images: [{ url: site.images.hero, width: 1200, height: 675, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — система управления автомойкой и шиномонтажом`,
    description: site.description,
    images: [site.images.hero],
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
    <html lang="ru">
      <body>
        <OrganizationJsonLd />
        <SoftwareAppJsonLd />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
