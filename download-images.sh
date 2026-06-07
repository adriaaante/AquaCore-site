#!/usr/bin/env bash
#
# Скачивает AI-изображения сайта в public/images/ для локального размещения.
# Запускать на своём компьютере (где нет ограничений сети), затем закоммитить
# файлы и заменить ссылки в src/config/site.ts на "/images/hero.jpg" и т.д.
#
# Использование:  bash download-images.sh
#
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/public/images"
mkdir -p "$DIR"

declare -A IMAGES=(
  ["hero.jpg"]="https://d8j0ntlcm91z4.cloudfront.net/user_3Di09CVa1BatdZIdE0tir1KKUxw/hf_20260607_080210_642eae28-0c25-4473-84c2-342f8bb57cc6.png"
  ["anpr.jpg"]="https://d8j0ntlcm91z4.cloudfront.net/user_3Di09CVa1BatdZIdE0tir1KKUxw/hf_20260607_080212_b3ac1707-4ae4-4364-aa96-8cdb0abf5561.png"
  ["client.jpg"]="https://d8j0ntlcm91z4.cloudfront.net/user_3Di09CVa1BatdZIdE0tir1KKUxw/hf_20260607_080213_43184d8b-6011-47d8-b723-461ee44468f8.png"
)

for name in "${!IMAGES[@]}"; do
  echo "→ Скачиваю $name ..."
  curl -fsSL "${IMAGES[$name]}" -o "$DIR/$name"
done

echo ""
echo "Готово. Файлы в public/images/:"
ls -la "$DIR"
echo ""
echo "Теперь в src/config/site.ts замените значения images.hero/anpr/client на:"
echo '  hero:   "/images/hero.jpg"'
echo '  anpr:   "/images/anpr.jpg"'
echo '  client: "/images/client.jpg"'
