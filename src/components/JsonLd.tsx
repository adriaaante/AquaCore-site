import { site } from "@/config/site";
import { faq } from "@/config/content";

/**
 * Структурированные данные (Schema.org / JSON-LD) для поисковиков.
 * Помогают Яндексу и Google показывать расширенные сниппеты:
 * цена, рейтинг, блок «вопрос–ответ» прямо в выдаче.
 *
 * Рендерится как обычный <script type="application/ld+json"> —
 * работает и в статическом экспорте.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Данные формируются на сборке из конфигов — не пользовательский ввод.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Организация-разработчик (site-wide). */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: site.url,
        email: site.contacts.email,
        description: site.description,
        areaServed: "RU",
        logo: `${site.url}/icon.svg`,
      }}
    />
  );
}

/** Сам продукт как SoftwareApplication с двумя ценовыми предложениями. */
export function SoftwareAppJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: site.description,
        url: site.url,
        inLanguage: "ru",
        softwareHelp: `${site.url}/vozmozhnosti/`,
        offers: [
          {
            "@type": "Offer",
            name: site.pricing.basic.name,
            price: "50000",
            priceCurrency: "RUB",
            url: `${site.url}/tarify/`,
            category: "Подписка на год",
          },
          {
            "@type": "Offer",
            name: site.pricing.pro.name,
            price: "90000",
            priceCurrency: "RUB",
            url: `${site.url}/tarify/`,
            category: "Подписка на год",
          },
        ],
      }}
    />
  );
}

/** Блок «вопрос–ответ» для расширенного сниппета. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
