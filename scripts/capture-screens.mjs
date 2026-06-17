/**
 * Перевыпуск маркетинговых скриншотов AquaCore.
 *
 * Снимает экраны с ЛОКАЛЬНО запущенного приложения AquaCore на демо-данных и
 * кладёт JPEG в public/screens. Это тот самый скрипт, которого раньше не было в
 * репозитории, — теперь он версионируется, чтобы скрины можно было пересобрать.
 *
 * Предусловия (см. README → «Перегенерация скриншотов»):
 *   1. Приложение AquaCore запущено: http://localhost:3000 (pnpm dev), с
 *      demo-данными (pnpm db:seed && pnpm tsx prisma/seed-demo.ts).
 *   2. Модули «Клиентский кабинет» и «Уведомления» включены для демо-мойки.
 *   3. Один demo-клиент привязан к CLIENT-пользователю (вход — только Telegram).
 *
 * Авторизация без UI: на лету подписываем session-cookie тем же AUTH_SECRET и
 * алгоритмом, что и приложение (next-auth/jwt encode) — детерминированно и без
 * флейки логин-форм. Клиентские экраны иначе недоступны (вход только через бота).
 *
 * Запуск (значения по умолчанию подходят для стандартного seed-demo):
 *   AUTH_SECRET=... MANAGER_USER_ID=... ADMIN_USER_ID=... CLIENT_USER_ID=... \
 *   MANAGER_CUSTOMER_ID=... WASH_ID=... WASH_SLUG=main \
 *   node scripts/capture-screens.mjs
 */
import { chromium } from "playwright";
import { encode } from "next-auth/jwt";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdir } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
const OUT_DIR = process.env.OUT_DIR ?? join(__dirname, "..", "public", "screens");
const AUTH_SECRET = process.env.AUTH_SECRET;
const WASH_SLUG = process.env.WASH_SLUG ?? "main";
const WASH_ID = process.env.WASH_ID;
const IDS = {
  manager: process.env.MANAGER_USER_ID,
  admin: process.env.ADMIN_USER_ID,
  client: process.env.CLIENT_USER_ID,
};
const MANAGER_CUSTOMER_ID = process.env.MANAGER_CUSTOMER_ID;

if (!AUTH_SECRET) throw new Error("AUTH_SECRET is required (use the app's value)");

// Имя cookie сессии next-auth v5 при работе по http (без префикса __Secure-).
const SESSION_COOKIE = "authjs.session-token";

const ROLE = { manager: "MANAGER", admin: "ADMIN", client: "CLIENT" };

async function mintSessionCookie(who) {
  const id = IDS[who];
  if (!id) throw new Error(`missing user id for ${who}`);
  const value = await encode({
    salt: SESSION_COOKIE,
    secret: AUTH_SECRET,
    maxAge: 60 * 60 * 12,
    token: {
      sub: id,
      id,
      role: ROLE[who],
      washId: WASH_ID ?? null,
      isSuperAdmin: false,
      mustChangePassword: false,
    },
  });
  return value;
}

function cookiesFor(sessionValue) {
  const base = { domain: "localhost", path: "/" };
  const list = [{ ...base, name: "wash", value: WASH_SLUG }];
  if (sessionValue)
    list.push({ ...base, name: SESSION_COOKIE, value: sessionValue, httpOnly: true });
  return list;
}

const DESKTOP = { width: 1280, deviceScaleFactor: 2 }; // → 2560px по ширине
const MOBILE = { width: 414, deviceScaleFactor: 2 }; // → 828px по ширине (как у текущих)

/** @type {Array<{file:string,who:keyof typeof ROLE|null,url:string,device:'desktop'|'mobile',shot:string,storage?:Record<string,string>,clipFrom?:string,clipTo?:string}>} */
const TARGETS = [
  { file: "manager-client-card.jpg", who: "manager", url: `/manager/clients/${MANAGER_CUSTOMER_ID}`, device: "desktop", shot: "page" },
  // Архив — в режиме «С фото» (layout хранится в localStorage, общий с доской).
  { file: "admin-archive.jpg", who: "admin", url: "/admin/archive", device: "desktop", shot: "page", storage: { "aquacore.board.layout": "photo" } },
  { file: "manager-notifications.jpg", who: "manager", url: "/manager/settings", device: "desktop", shot: "notifications" },
  // «Ссылка для клиентов и модули» — карточки «Ссылка для входа» + «Дополнительные модули».
  { file: "manager-client-link.jpg", who: "manager", url: "/manager/settings", device: "desktop", shot: "cardClip", clipFrom: "Ссылка для входа", clipTo: "Дополнительные модули", linkText: "https://aqua-core.ru/w/main" },
  { file: "client-bonuses.jpg", who: "client", url: "/client/bonuses", device: "mobile", shot: "page" },
];

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const t of TARGETS) {
      const vp = t.device === "desktop" ? DESKTOP : MOBILE;
      const vh = t.shot === "cardClip" ? 2200 : t.device === "desktop" ? 900 : 896;
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vh },
        deviceScaleFactor: vp.deviceScaleFactor,
        locale: "ru-RU",
        reducedMotion: "reduce",
      });
      const sessionValue = t.who ? await mintSessionCookie(t.who) : null;
      await context.addCookies(cookiesFor(sessionValue));
      if (t.storage)
        await context.addInitScript((kv) => {
          for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v);
        }, t.storage);
      const page = await context.newPage();
      const dest = join(OUT_DIR, t.file);

      await page.goto(APP_URL + t.url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      // Спрятать dev-индикатор Next.js (значок «N errors») — он только в dev.
      await page.addStyleTag({ content: "nextjs-portal{display:none !important}" });
      // Дождаться подгрузки всех картинок (фото машин в архиве грузятся лениво).
      await page
        .waitForFunction(() => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0), { timeout: 8000 })
        .catch(() => {});

      if (t.shot === "cardClip") {
        // Регион из двух соседних карточек настроек. Убираем «липкую» шапку,
        // чтобы не перекрывала, и клипаем по их bounding box.
        await page.addStyleTag({ content: "header{position:static !important}" });
        // В dev ссылка строится из window.location.origin (localhost). Для
        // витрины показываем продакшн-домен — именно его видит реальная мойка.
        if (t.linkText)
          await page.evaluate((txt) => {
            const el = Array.from(document.querySelectorAll("code")).find((c) => /\/w\//.test(c.textContent || ""));
            if (el) el.textContent = txt;
          }, t.linkText);
        await page.waitForTimeout(300);
        const cardOf = (title) =>
          page.getByText(title, { exact: true }).locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        const a = await cardOf(t.clipFrom).boundingBox();
        const b = await cardOf(t.clipTo).boundingBox();
        if (!a || !b) throw new Error(`cardClip boxes not found for ${t.file}`);
        const x = Math.min(a.x, b.x) - 16;
        const y = a.y - 16;
        await page.screenshot({
          path: dest,
          type: "jpeg",
          quality: 82,
          clip: { x: Math.max(0, x), y: Math.max(0, y), width: Math.max(a.width, b.width) + 32, height: b.y + b.height - a.y + 32 },
        });
      } else if (t.shot === "notifications") {
        // Тугой кадр карточки матрицы маршрутизации (клиент + персонал по ролям).
        // element.screenshot сам проматывает к элементу и снимает его целиком.
        // Нейтрализуем «липкую» шапку, иначе она перекрывает верх карточки.
        await page.addStyleTag({
          content: `*{position:static !important}`,
        });
        const card = page
          .getByText("Маршрутизация уведомлений", { exact: true })
          .locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        await card.waitFor({ timeout: 10000 });
        await card.scrollIntoViewIfNeeded();
        await card.screenshot({ path: dest, type: "jpeg", quality: 82 });
      } else {
        await page.screenshot({ path: dest, type: "jpeg", quality: 82, fullPage: true });
      }
      console.log("✓", t.file);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
