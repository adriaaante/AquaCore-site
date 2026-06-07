import type { NextConfig } from "next";

/**
 * Статический экспорт: `next build` создаёт папку `out/` с чистыми
 * HTML/CSS/JS-файлами, которые можно залить на любой хостинг (в т.ч. reg.ru),
 * без запуска Node.js-сервера.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Обязательно для статического экспорта (нет сервера оптимизации картинок).
  images: { unoptimized: true },
  // Каждая страница как отдельная папка с index.html — дружелюбно к Apache/Nginx
  // на shared-хостинге (reg.ru), ссылки вида /tarify/ работают без доп. настройки.
  trailingSlash: true,
};

export default nextConfig;
