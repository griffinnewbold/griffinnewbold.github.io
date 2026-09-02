#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
for page in index.html projects.html teaching.html courses.html contact.html; do
  test -f "$root/$page"
  grep -q 'style.css' "$root/$page"
  grep -q 'scripts/theme.js' "$root/$page"
  grep -q 'data-theme-toggle' "$root/$page"
done
test -f "$root/scripts/theme.js"
grep -q 'localStorage' "$root/scripts/theme.js"
echo "static site smoke checks passed"
