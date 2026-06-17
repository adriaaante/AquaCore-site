# AquaCore — сайт

Продающий сайт системы управления автомойкой **AquaCore**. Построен на **Next.js 15** с
**статическим экспортом** — на выходе обычные HTML/CSS/JS, которые работают на любом хостинге
(в том числе на виртуальном хостинге reg.ru) без Node.js-сервера.

## Технологии
- Next.js 15 (App Router) + React 19 + TypeScript
- TailwindCSS 3
- Статический экспорт (`output: "export"`) → папка `out/`

## Структура
```
src/
├── app/                  страницы: / , /vozmozhnosti , /tarify
├── components/           шапка, подвал, секции, форма заявки, моки интерфейса
└── config/
    ├── site.ts           ← КОНТАКТЫ, ЦЕНЫ, ССЫЛКИ (правьте здесь)
    └── content.ts        тексты возможностей, выгод, FAQ
public/                   логотип, изображения, robots.txt, sitemap.xml
deploy.sh                 авто-деплой на reg.ru по SSH
```

## ⚙️ Что отредактировать под себя
Откройте **`src/config/site.ts`** и замените заглушки:
- `contacts.telegram`, `contacts.whatsappHref` — ваши контакты;
- `web3formsAccessKey` — ключ с [web3forms.com](https://web3forms.com) для приёма заявок с формы
  (бесплатно). Пока ключ не вставлен, форма открывает почтовый клиент и пишет на ваш email;
- `url` — ваш домен (для SEO).

Email `info@aqua-core.ru` и телефон `+7 925 904-01-11` уже подставлены.

## Локальный запуск
```bash
npm install
npm run dev      # http://localhost:3000
```

## Сборка статики
```bash
npm run build    # создаст папку out/ с готовым сайтом
npm run serve    # предпросмотр собранной статики
```

## 🚀 Деплой на reg.ru

Сайт собирается автоматически на GitHub: каждый push в `main` обновляет
ветку `regru-dist` с готовыми HTML/CSS/JS (workflow `build-dist.yml`).
Node.js на хостинге не нужен.

### Первый раз (SSH-консоль reg.ru)
```bash
curl -fsSL https://raw.githubusercontent.com/adriaaante/AquaCore-site/main/deploy.sh -o ~/aquacore-deploy.sh
chmod +x ~/aquacore-deploy.sh
~/aquacore-deploy.sh
```
Сайт ляжет в отдельную папку `~/www/aqua-core.ru` (не мешает другим сайтам
на хостинге). Другой каталог: `WEB_ROOT=~/www/папка ~/aquacore-deploy.sh`.

### Каждое обновление — одна команда
```bash
~/aquacore-deploy.sh
```

### Привязка домена (панель reg.ru)
1. Хостинг → панель управления (ISPmanager) → «WWW-домены» → «Создать»:
   домен `aqua-core.ru`, корневая директория `www/aqua-core.ru`.
2. Если домен зарегистрирован в reg.ru — в карточке домена включите
   DNS-серверы хостинга (ns1/ns2.hosting.reg.ru) или пропишите A-запись
   на IP хостинга (указан в письме об активации и в панели).
3. В ISPmanager выпустите бесплатный SSL Let's Encrypt
   («SSL-сертификаты» → Let's Encrypt) и включите редирект на HTTPS.

## Изображения и видео
Скриншоты интерфейса в `public/screens/` сняты с работающего приложения AquaCore
на демо-данных; видеоролики в `public/videos/` смонтированы из реальных записей
экрана и сгенерированных сцен. Превью для соцсетей — `public/og.jpg`.

### Перегенерация скриншотов (`scripts/capture-screens.mjs`)
Скрипт снимает экраны с локально запущенного приложения. Тяжёлые зависимости
(`playwright`, `next-auth`) намеренно НЕ в `package.json`, чтобы не утяжелять
сборку сайта (`npm ci` в Pages) — ставятся разово при перегенерации.

```bash
# 1. В репозитории приложения AquaCore: поднять Postgres, накатить демо-данные,
#    запустить dev-сервер (см. его README). Включить модули «Клиентский кабинет»
#    и «Уведомления» для демо-мойки и привязать одного demo-клиента к CLIENT-юзеру
#    (вход в кабинет — только через Telegram).
# 2. В этом репозитории — поставить инструменты съёмки:
npm i --no-save playwright next-auth@5.0.0-beta.25 && npx playwright install chromium
# 3. Снять кадры (IDs берутся из демо-базы; AUTH_SECRET — из .env приложения):
AUTH_SECRET=… MANAGER_USER_ID=… ADMIN_USER_ID=… CLIENT_USER_ID=… \
MANAGER_CUSTOMER_ID=… WASH_ID=… WASH_SLUG=main \
node scripts/capture-screens.mjs
```
Кадры сохраняются прямо в `public/screens/`. Список и подписи — в
`src/config/screens.ts`.
