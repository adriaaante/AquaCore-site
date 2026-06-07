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
download-images.sh        локализация AI-изображений
```

## ⚙️ Что отредактировать под себя
Откройте **`src/config/site.ts`** и замените заглушки:
- `contacts.phone`, `contacts.telegram`, `contacts.whatsappHref` — ваши контакты;
- `web3formsAccessKey` — ключ с [web3forms.com](https://web3forms.com) для приёма заявок с формы
  (бесплатно). Пока ключ не вставлен, форма открывает почтовый клиент и пишет на ваш email;
- `url` — ваш домен (для SEO).

Email `adriaaante@gmail.com` уже подставлен.

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

### Вариант А. Автоматически по SSH (рекомендуется)
Если на вашем тарифе reg.ru есть SSH-доступ и Node.js:
```bash
# один раз — склонировать проект на хостинг
git clone <URL-репозитория> ~/aquacore-site
cd ~/aquacore-site
chmod +x deploy.sh

# при необходимости укажите каталог сайта (корень домена)
# по умолчанию ~/public_html
nano deploy.sh   # поправьте WEB_ROOT, если нужно

# каждое обновление сайта — одной командой:
./deploy.sh
```
Скрипт сам забирает свежий код, собирает сайт и копирует файлы в каталог домена.
Можно переопределить переменные на лету:
```bash
WEB_ROOT=~/www/site/public_html ./deploy.sh
```

### Вариант Б. Вручную (если нет Node.js на хостинге)
Соберите сайт на своём компьютере и залейте папку через файл-менеджер/FTP:
```bash
npm install
npm run build
# содержимое папки out/ загрузите в корень сайта на reg.ru (public_html)
```

## Изображения
Фотографии (герой, распознавание номеров, клиент) сгенерированы ИИ и временно подключены по
ссылкам на внешний CDN. Чтобы разместить их у себя (надёжнее):
```bash
bash download-images.sh           # скачает файлы в public/images/
```
затем в `src/config/site.ts` замените `images.hero/anpr/client` на `"/images/hero.jpg"` и т.д.
Моки интерфейса (дашборд и карточки) нарисованы кодом и не требуют внешних файлов.
