#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
pages="index.html projects.html teaching.html courses.html contact.html"

for page in $pages; do
  file="$root/$page"
  test -f "$file"
  grep -q 'class="site-header"' "$file"
  grep -q 'id="main-content"' "$file"
  grep -q 'class="site-footer"' "$file"
  grep -q 'scripts/theme.js' "$file"
  grep -q 'scripts/navigation.js' "$file"
  grep -q 'data-theme-toggle' "$file"
  grep -q 'data-nav-toggle' "$file"
  test "$(grep -o '<h1[ >]' "$file" | wc -l | tr -d ' ')" = "1"
  ! grep -Eq 'bootstrap|jquery|popper|profile-container|prev-next-buttons' "$file"
done

test -f "$root/scripts/theme.js"
test -f "$root/scripts/navigation.js"
test ! -f "$root/legacy.css"
grep -q 'griffin-theme' "$root/scripts/theme.js"
echo "primary site structure passed"
