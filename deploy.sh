#!/usr/bin/env bash
###############################################################################
#  AquaCore-site — деплой на reg.ru (или любой хостинг с SSH и Node.js)
#
#  ЧТО ДЕЛАЕТ:
#    1) забирает свежий код из ветки на GitHub
#    2) ставит зависимости и собирает статический сайт (папка out/)
#    3) копирует готовые файлы в каталог сайта (WEB_ROOT)
#
#  КАК ПОЛЬЗОВАТЬСЯ (один раз):
#    - зайдите в SSH-консоль reg.ru
#    - склонируйте репозиторий, напр.:  git clone <URL> ~/aquacore-site
#    - откройте этот файл и при необходимости поправьте переменные ниже
#    - дайте права:  chmod +x deploy.sh
#
#  КАЖДОЕ ОБНОВЛЕНИЕ:
#    - просто выполните в консоли:   ./deploy.sh
#    - сайт обновится автоматически
###############################################################################
set -euo pipefail

# ─────────────────────────── НАСТРОЙКИ ───────────────────────────
# Папка с проектом (где лежит этот скрипт). Обычно менять не нужно.
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ветка, из которой брать код.
BRANCH="${BRANCH:-claude/inspiring-fermat-AWUMl}"

# Каталог, который отдаёт ваш сайт (корень домена на reg.ru).
# Частые варианты: ~/public_html  или  ~/www/ВАШ-ДОМЕН/public_html
WEB_ROOT="${WEB_ROOT:-$HOME/public_html}"
# ──────────────────────────────────────────────────────────────────

echo "==> Проект:   $REPO_DIR"
echo "==> Ветка:    $BRANCH"
echo "==> Сайт в:   $WEB_ROOT"
echo ""

cd "$REPO_DIR"

echo "==> [1/4] Получаю свежий код из ветки $BRANCH ..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> [2/4] Устанавливаю зависимости ..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "==> [3/4] Собираю статический сайт ..."
npm run build   # next build с output:"export" создаёт папку out/

if [ ! -d "$REPO_DIR/out" ]; then
  echo "!! Папка out/ не создана. Сборка не удалась." >&2
  exit 1
fi

echo "==> [4/4] Копирую файлы в $WEB_ROOT ..."
mkdir -p "$WEB_ROOT"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$REPO_DIR/out/" "$WEB_ROOT/"
else
  # Фолбэк без rsync: очистить и скопировать
  find "$WEB_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -r "$REPO_DIR/out/." "$WEB_ROOT/"
fi

echo ""
echo "✅ Готово! Сайт обновлён: $WEB_ROOT"
