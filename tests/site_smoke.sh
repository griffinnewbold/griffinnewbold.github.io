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

# Mobile navigation is visible by default and collapses only after JavaScript opts in.
grep -q "document.documentElement.classList.add('js-enabled')" "$root/scripts/navigation.js"
grep -A4 '^\.nav-toggle {' "$root/style.css" | grep -q 'display: none;'
grep -q "^  \.js-enabled \.nav-toggle {" "$root/style.css"
grep -q "^  \.js-enabled \.site-nav\[data-open='false'\] {" "$root/style.css"
! grep -q "^  \.site-nav\[data-open='false'\] {" "$root/style.css"

grep -q 'id="selected-work"' "$root/index.html"
grep -q 'id="teaching-preview"' "$root/index.html"
grep -q 'class="bio-summary"' "$root/index.html"
grep -q 'class="profile-portrait"' "$root/contact.html"
! grep -qi 'recent graduate\|this past semester\|throughout the summer' "$root/index.html" "$root/contact.html"

test "$(grep -o 'data-project-card' "$root/projects.html" | wc -l | tr -d ' ')" -ge 13
grep -q 'data-project-filter="all"' "$root/projects.html"
grep -q 'scripts/projects.js' "$root/projects.html"
! grep -q 'projects_script.js' "$root/projects.html"
test ! -f "$root/scripts/projects_script.js"

echo "primary site structure passed"
