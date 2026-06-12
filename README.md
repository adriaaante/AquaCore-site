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

Email `info@aqua-core.ru` и телефон `+7 966 127-77-67` уже подставлены.

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
