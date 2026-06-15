#!/usr/bin/env bash
#
# ── Деплой сайта AquaCore на хостинг reg.ru ──────────────────────────────
#
# Сайт собирается автоматически на GitHub (workflow build-dist.yml) и
# складывается в ветку `regru-dist` уже в виде готовых HTML/CSS/JS.
# Этот скрипт запускается НА ХОСТИНГЕ reg.ru и просто забирает готовую
# сборку — Node.js на хостинге не нужен.
#
# Первый запуск (по SSH на хостинге):
#   curl -fsSL https://raw.githubusercontent.com/adriaaante/AquaCore-site/main/deploy.sh -o ~/aquacore-deploy.sh
#   chmod +x ~/aquacore-deploy.sh
#   ~/aquacore-deploy.sh
#
# Каждое обновление сайта — одна команда:
#   ~/aquacore-deploy.sh
#
# Папку сайта можно переопределить на лету (если домен привязан к другому
# каталогу):
#   WEB_ROOT=~/www/другая-папка ~/aquacore-deploy.sh
#
set -euo pipefail

REPO_URL="https://github.com/adriaaante/AquaCore-site.git"
BRANCH="regru-dist"

# Служебная папка с копией сборки (не каталог сайта).
DIST_DIR="${DIST_DIR:-$HOME/.aquacore-dist}"

# Каталог сайта на хостинге. У reg.ru сайты обычно живут в ~/www/<домен>.
# Отдельная папка — чтобы не мешать другим сайтам на этом же хостинге.
WEB_ROOT="${WEB_ROOT:-$HOME/www/aqua-core.ru}"

echo "→ Забираю свежую сборку (ветка $BRANCH)..."
if [ ! -d "$DIST_DIR/.git" ]; then
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$DIST_DIR"
else
  git -C "$DIST_DIR" fetch --depth 1 origin "$BRANCH"
  git -C "$DIST_DIR" reset --hard "origin/$BRANCH"
fi

echo "→ Копирую сайт в $WEB_ROOT ..."
mkdir -p "$WEB_ROOT"
if command -v rsync >/dev/null 2>&1; then
  # telegram-secret.php создаётся вручную на хостинге — НЕ удаляем его при синхронизации.
  rsync -a --delete --exclude='.git' --exclude='telegram-secret.php' "$DIST_DIR"/ "$WEB_ROOT"/
else
  # На случай, если rsync на тарифе нет.
  find "$WEB_ROOT" -mindepth 1 -maxdepth 1 ! -name '.well-known' ! -name 'telegram-secret.php' -exec rm -rf {} +
  cp -a "$DIST_DIR"/. "$WEB_ROOT"/
  rm -rf "$WEB_ROOT/.git"
fi

echo "✅ Готово: сайт обновлён в $WEB_ROOT"
echo "   Версия сборки: $(git -C "$DIST_DIR" log -1 --format='%h · %ci')"
