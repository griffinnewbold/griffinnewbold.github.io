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

project_file="$root/projects.html"
test "$(grep -o 'data-project-card' "$project_file" | wc -l | tr -d ' ')" = "13"
test "$(grep -o 'id="div[0-9][0-9]*"' "$project_file" | wc -l | tr -d ' ')" = "13"
for number in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
  test "$(grep -o "id=\"div$number\"" "$project_file" | wc -l | tr -d ' ')" = "1"
  grep -q "<article id=\"div$number\" class=\"project-entry\" data-project-card data-category=\"" "$project_file"
done

test "$(grep -o '<button type="button" data-project-filter=' "$project_file" | wc -l | tr -d ' ')" = "4"
test "$(grep -o 'data-project-filter=' "$project_file" | wc -l | tr -d ' ')" = "4"
grep -q '<button type="button" data-project-filter="all" aria-pressed="true">' "$project_file"
for category in academic software early; do
  grep -q "data-project-card data-category=\"$category\"" "$project_file"
  grep -q "<button type=\"button\" data-project-filter=\"$category\" aria-pressed=\"false\">" "$project_file"
done
for category in $(grep -o 'data-project-card data-category="[^"]*"' "$project_file" | sed 's/.*="\([^"]*\)"/\1/' | sort -u); do
  grep -q "data-project-filter=\"$category\"" "$project_file"
done
! grep -q 'data-project-filter="professional"' "$project_file"
grep -A2 '<article id="div10" class="project-entry" data-project-card data-category="academic">' "$project_file" | grep -q '10 / Academic'
! grep -Eq '<article[^>]*data-project-card[^>]*hidden|<article[^>]*hidden[^>]*data-project-card' "$project_file"

project_targets=$(grep -o 'href="/projects.html#div[0-9][0-9]*"' "$root/index.html" | sed 's/.*#\(div[0-9][0-9]*\)"/\1/')
test "$(printf '%s\n' "$project_targets" | wc -l | tr -d ' ')" = "3"
test "$(printf '%s\n' "$project_targets" | sort -u | wc -l | tr -d ' ')" = "3"
expected_project_targets=$(printf '%s\n' div6 div10 div12 | sort)
test "$(printf '%s\n' "$project_targets" | sort -u)" = "$expected_project_targets"
for target in $project_targets; do
  test "$(grep -o "id=\"$target\"" "$project_file" | wc -l | tr -d ' ')" = "1"
done

grep -q 'scripts/projects.js' "$root/projects.html"
! grep -q 'projects_script.js' "$root/projects.html"
test ! -f "$root/scripts/projects_script.js"
node "$root/tests/projects_filter.test.js"

echo "primary site structure passed"
