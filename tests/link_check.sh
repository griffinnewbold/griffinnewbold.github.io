#!/bin/sh
set -eu

root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
values_file=$(mktemp)
missing_file=$(mktemp)
trap 'rm -f "$values_file" "$missing_file"' EXIT HUP INT TERM

find "$root" -path "$root/.git" -prune -o -type f -name '*.html' -print |
  LC_ALL=C sort |
  while IFS= read -r page; do
    grep -Eoi '(href|src)[[:space:]]*=[[:space:]]*"[^"]*"' "$page" |
      sed -E 's/^[^=]*=[[:space:]]*"([^"]*)"$/\1/' || true
    grep -Eoi "(href|src)[[:space:]]*=[[:space:]]*'[^']*'" "$page" |
      sed -E "s/^[^=]*=[[:space:]]*'([^']*)'$/\\1/" || true
  done |
  LC_ALL=C sort -u > "$values_file"

while IFS= read -r value; do
  case "$value" in
    ''|'#'*|'//'*|mailto:*|tel:*|http:*|https:*) continue ;;
    /*) ;;
    *) continue ;;
  esac

  target=${value%%\#*}
  target=${target%%\?*}
  target=$(printf '%s' "$target" | sed 's/%20/ /g')
  local_target=$root$target

  if [ -f "$local_target" ] || { [ -d "$local_target" ] && [ -f "$local_target/index.html" ]; }; then
    continue
  fi

  printf 'Missing target: %s\n' "$target" >> "$missing_file"
done < "$values_file"

if [ -s "$missing_file" ]; then
  cat "$missing_file"
  missing_targets=$(wc -l < "$missing_file" | tr -d ' ')
  printf 'Internal link check failed: %s missing target(s).\n' "$missing_targets" >&2
  exit 1
fi

echo "internal links passed"
