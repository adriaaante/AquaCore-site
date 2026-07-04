#!/usr/bin/env bash
# Эталон скрипта деплоя сайта на хостинге reg.ru (живёт там как ~/aquacore-deploy.sh).
# Забирает готовую статику из ветки regru-dist и раскладывает в корень сайта.
#
# Использование на хостинге:  ~/aquacore-deploy.sh
# Переменные можно переопределить окружением (SRC_DIR / DOCROOT).
#
# ВАЖНО (аудит 2026-07): rsync --delete обязан исключать:
#   - telegram-secret.php  — секреты живут только на хостинге, в git их нет;
#   - .well-known          — там ACME-челленджи Let's Encrypt; удаление ломает
#                            перевыпуск SSL-сертификата.
set -euo pipefail

SRC_DIR="${SRC_DIR:-$HOME/aquacore-dist}"                       # checkout ветки regru-dist
DOCROOT="${DOCROOT:-/var/www/u3544543/data/www/aqua-core.ru}"   # корень сайта

echo "==> обновляю $SRC_DIR из origin/regru-dist"
git -C "$SRC_DIR" fetch origin regru-dist
git -C "$SRC_DIR" checkout -f regru-dist
git -C "$SRC_DIR" reset --hard origin/regru-dist

echo "==> rsync в $DOCROOT"
rsync -a --delete \
  --exclude='.git' \
  --exclude='telegram-secret.php' \
  --exclude='.well-known' \
  "$SRC_DIR"/ "$DOCROOT"/

echo "==> проверка send.php"
resp=$(curl -s -m 15 -X POST https://aqua-core.ru/send.php \
  -d "name=deploy-test&phone=+70000000000&message=проверка деплоя" || true)
echo "ответ: $resp"
case "$resp" in
  *'"email":true'*) echo "✅ Деплой ОК: почта заявок работает (через reg.ru)";;
  *'"mail"'*) echo "⚠️  На хостинге СТАРЫЙ send.php (поле mail) — regru-dist не обновился?";;
  *) echo "⚠️  Проверьте ответ выше (telegram/email false — смотрите telegram-secret.php)";;
esac
