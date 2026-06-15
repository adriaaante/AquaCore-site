# Заметки для будущих сессий — сайт AquaCore

Краткая память по проекту, чтобы не разбираться заново.

## Что это
Маркетинговый сайт AquaCore (`aqua-core.ru`). Next.js 15 + **статический экспорт**
(`output: "export"` → папка `out/`). На хостинге обычные HTML/CSS/JS, Node.js там не нужен.

Не путать с основным приложением — оно в **отдельном репозитории `AquaCore`**
(Next.js + Prisma + Resend для писем сброса пароля/подтверждения email).

## Деплой (важно понимать цепочку)
1. `push` в **`main`** → GitHub Action `.github/workflows/build-dist.yml`
2. Action собирает статику и публикует её в ветку **`regru-dist`** (готовые файлы).
3. На хостинге reg.ru скрипт **`~/aquacore-deploy.sh`** забирает `regru-dist`
   и копирует в корень сайта (rsync, исключая `telegram-secret.php`).

Вывод: **изменения на живом сайте появляются только после `~/aquacore-deploy.sh`**,
а он работает только после успешной сборки Action (ветка `regru-dist` обновилась).

Файлы из `public/` (в т.ч. `send.php`) копируются в корень `out/` при сборке и
попадают на хостинг как есть.

### Хостинг reg.ru
- Корень сайта: `/var/www/u3544543/data/www/aqua-core.ru`
- Обновление сайта: `~/aquacore-deploy.sh`
- Секреты живут только на хостинге в `telegram-secret.php` (рядом с `send.php`),
  в git его НЕТ; deploy.sh его не перезаписывает.

## Заявки с формы → Telegram + почта
- Форма: `src/components/LeadForm.tsx` → POST на `/send.php`.
- `public/send.php` (PHP на хостинге) отправляет заявку:
  1. в **Telegram-группу** через бота (серверно);
  2. **письмом через Resend API** (серверно) — тот же сервис, что в приложении AquaCore.
- Ответ send.php (новый формат): `{"success":bool,"telegram":bool,"email":bool}`.
  Если в ответе поле `mail` (а не `email`) — на хостинге СТАРАЯ версия send.php,
  нужно прогнать деплой.
- `web3forms` (client-side) остался в LeadForm только как запасной путь, если
  Resend на хостинге не настроен.

### Конфиг в `telegram-secret.php` (на хостинге, не в git)
```php
$TELEGRAM_BOT_TOKEN = '...';                       // токен бота от @BotFather
$TELEGRAM_CHAT_ID   = '...';                        // id группы
$RESEND_API_KEY     = 're_...';                     // ТОТ ЖЕ аккаунт Resend, что у приложения
$EMAIL_FROM         = 'AquaCore <info@aqua-core.ru>'; // домен подтверждён в Resend
$MAIL_TO            = 'zajdeladrian@yandex.ru';     // куда приходят заявки
```

### Ключевые факты про почту
- Домен **`aqua-core.ru` уже подтверждён в Resend** (то же приложение шлёт от
  `info@aqua-core.ru`). Поэтому ДОПОЛНИТЕЛЬНАЯ верификация домена/DNS НЕ нужна —
  достаточно использовать тот же `RESEND_API_KEY`, что и у приложения.
- `EMAIL_FROM` — адрес отправителя (от кого письмо), должен быть на подтверждённом домене.
- `MAIL_TO` — куда падает заявка (получатель). Сейчас `zajdeladrian@yandex.ru`.
- В приложении AquaCore письма (сброс пароля/подтверждение email) уходят на
  адрес самого пользователя (`to: user.email`) — единого «ящика для всех» там нет.

## Проверка после изменений
```bash
~/aquacore-deploy.sh
curl -s -X POST https://aqua-core.ru/send.php \
  -d "name=Тест&phone=+70000000000&message=проверка"; echo
# ожидаем: {"success":true,"telegram":true,"email":true}
```

## История ветки
Ранее `origin/main` на GitHub содержал устаревшую несвязанную линию (без send.php,
Telegram, скриншотов; деплой на GitHub Pages). Актуальная линия сайта — это рабочая
ветка; `main` приведён к ней. Сборку для reg.ru делает `build-dist.yml`, а не Pages.
