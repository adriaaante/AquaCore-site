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

/** @type {Array<{file:string,who:keyof typeof ROLE|null,url:string,device:'desktop'|'mobile',shot:'page'|'login'|'notifications'}>} */
const TARGETS = [
  { file: "manager-client-card.jpg", who: "manager", url: `/manager/clients/${MANAGER_CUSTOMER_ID}`, device: "desktop", shot: "page" },
  { file: "admin-archive.jpg", who: "admin", url: "/admin/archive", device: "desktop", shot: "page" },
  { file: "manager-notifications.jpg", who: "manager", url: "/manager/settings", device: "desktop", shot: "notifications" },
  { file: "client-bonuses.jpg", who: "client", url: "/client/bonuses", device: "mobile", shot: "page" },
  { file: "login-telegram.jpg", who: null, url: `/login?w=${WASH_SLUG}`, device: "mobile", shot: "login" },
];

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const t of TARGETS) {
      const vp = t.device === "desktop" ? DESKTOP : MOBILE;
      const context = await browser.newContext({
        viewport: { width: vp.width, height: t.device === "desktop" ? 900 : 896 },
        deviceScaleFactor: vp.deviceScaleFactor,
        locale: "ru-RU",
        reducedMotion: "reduce",
      });
      const sessionValue = t.who ? await mintSessionCookie(t.who) : null;
      await context.addCookies(cookiesFor(sessionValue));
      const page = await context.newPage();
      const dest = join(OUT_DIR, t.file);

      await page.goto(APP_URL + t.url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      // Спрятать dev-индикатор Next.js (значок «N errors») — он только в dev.
      await page.addStyleTag({ content: "nextjs-portal{display:none !important}" });

      if (t.shot === "login") {
        // Показать вкладку входа через Telegram (не запускаем сам логин).
        await page.getByRole("button", { name: /Клиент \(Telegram\)/ }).click();
        await page.getByRole("button", { name: /Войти через Telegram/ }).waitFor({ timeout: 10000 });
        await page.waitForTimeout(500);
        await page.screenshot({ path: dest, type: "jpeg", quality: 82 });
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
