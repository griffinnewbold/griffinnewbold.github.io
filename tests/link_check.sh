#!/bin/sh
set -eu

root=${LINK_CHECK_ROOT:-$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)}
missing_file=$(mktemp)
trap 'rm -f "$missing_file"' EXIT HUP INT TERM

normalize_path() {
  awk -v input="$1" '
    BEGIN {
      count = split(input, parts, "/")
      depth = 0
      escaped = 0
      for (i = 1; i <= count; i += 1) {
        part = parts[i]
        if (part == "" || part == ".") continue
        if (part == "..") {
          if (depth == 0) escaped = 1
          else depth -= 1
          continue
        }
        depth += 1
        normalized[depth] = part
      }
      if (escaped) exit 1
      for (i = 1; i <= depth; i += 1) {
        if (i > 1) printf "/"
        printf "%s", normalized[i]
      }
      printf "\n"
    }
  '
}

find "$root" -path "$root/.git" -prune -o -type f -name '*.html' -print |
  LC_ALL=C sort |
  while IFS= read -r page; do
    source=${page#"$root"/}
    case "$source" in
      */*) source_dir=${source%/*} ;;
      *) source_dir=. ;;
    esac

    {
    grep -Eoi '(href|src)[[:space:]]*=[[:space:]]*"[^"]*"' "$page" |
      sed -E 's/^[^=]*=[[:space:]]*"([^"]*)"$/\1/' || true
    grep -Eoi "(href|src)[[:space:]]*=[[:space:]]*'[^']*'" "$page" |
      sed -E "s/^[^=]*=[[:space:]]*'([^']*)'$/\\1/" || true
    } | while IFS= read -r value; do
      case "$value" in
        ''|'#'*|'//'* ) continue ;;
      esac
      if printf '%s\n' "$value" | grep -Eiq '^[[:alpha:]][[:alnum:]+.-]*:'; then
        continue
      fi

      target=${value%%\#*}
      target=${target%%\?*}
      target=$(printf '%s' "$target" | sed 's/%20/ /g')
      [ -n "$target" ] || continue

      case "$target" in
        /*) candidate=${target#/} ;;
        *) candidate=$source_dir/$target ;;
      esac

      if ! normalized=$(normalize_path "$candidate"); then
        printf 'Missing target: %s -> %s (path escapes site root)\n' "$source" "$target" >> "$missing_file"
        continue
      fi
      local_target=$root/$normalized

      if [ -f "$local_target" ] || { [ -d "$local_target" ] && [ -f "$local_target/index.html" ]; }; then
        continue
      fi

      printf 'Missing target: %s -> %s (%s)\n' "$source" "$target" "$normalized" >> "$missing_file"
    done
  done

if [ -s "$missing_file" ]; then
  cat "$missing_file"
  missing_targets=$(wc -l < "$missing_file" | tr -d ' ')
  printf 'Internal link check failed: %s missing target(s).\n' "$missing_targets" >&2
  exit 1
fi

echo "internal links passed"
