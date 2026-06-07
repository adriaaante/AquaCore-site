import type { NextConfig } from "next";

/**
 * Статический экспорт: `next build` создаёт папку `out/` с чистыми
 * HTML/CSS/JS-файлами, которые можно залить на любой хостинг (в т.ч. reg.ru),
 * без запуска Node.js-сервера.
 *
 * basePath:
 *   - на своём домене / reg.ru сайт лежит в корне → basePath не нужен;
 *   - на GitHub Pages сайт открывается по адресу /AquaCore-site, поэтому
 *     при сборке в Actions выставляется переменная PAGES=true и добавляется
 *     префикс пути, чтобы CSS/JS грузились корректно.
 */
const isPages = process.env.PAGES === "true";
const basePath = isPages ? "/AquaCore-site" : "";

const nextConfig: NextConfig = {
  output: "export",
  // Обязательно для статического экспорта (нет сервера оптимизации картинок).
  images: { unoptimized: true },
  // Каждая страница как отдельная папка с index.html — дружелюбно к Apache/Nginx
  // на shared-хостинге (reg.ru), ссылки вида /tarify/ работают без доп. настройки.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
