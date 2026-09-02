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

grep -q 'id="teaching-roles"' "$root/teaching.html"
grep -q 'id="course-resources"' "$root/teaching.html"
grep -q 'class="resource-list"' "$root/teaching.html"
! grep -q 'teaching_script.js' "$root/teaching.html"
! grep -q 'courses_script.js' "$root/courses.html"
test ! -f "$root/scripts/teaching_script.js"
test ! -f "$root/scripts/courses_script.js"

review_row=$(grep 'href="/resources/reviews.pdf"' "$root/teaching.html")
printf '%s\n' "$review_row" | grep -q 'resource-term">2022–2023<'
! printf '%s\n' "$review_row" | grep -q '2022–2024'

cc_page_count=$(find "$root/cc" -name '*.html' -type f | wc -l | tr -d ' ')
test "$cc_page_count" = "35"

find "$root/cc" -name '*.html' -type f | while IFS= read -r page; do
  masthead=$(sed -n '/<header class="cc-masthead">/,/<\/header>/p' "$page")
  cc_nav=$(printf '%s\n' "$masthead" | sed -n '/<nav class="cc-nav"/,/<\/nav>/p')
  search_form=$(printf '%s\n' "$cc_nav" | sed -n '/<form class="cc-search"/,/<\/form>/p')

  test "$(grep -o 'class="cc-masthead"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'class="cc-portfolio-link"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'data-theme-toggle' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'data-cc-nav-toggle' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'id="cc-nav"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'src="/cc/scripts/navigation.js"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -Eo 'src="(\.\./)?scripts/search-query\.js"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'href="/cc/style.css"' "$page" | wc -l | tr -d ' ')" = "1"

  test "$(grep -o 'class="cc-search"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'onsubmit="searchFiles(event)"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(printf '%s\n' "$masthead" | grep -o 'class="cc-search"' | wc -l | tr -d ' ')" = "1"
  test "$(printf '%s\n' "$cc_nav" | grep -o 'class="cc-search"' | wc -l | tr -d ' ')" = "1"
  test "$(printf '%s\n' "$search_form" | grep -o 'onsubmit="searchFiles(event)"' | wc -l | tr -d ' ')" = "1"

  test "$(grep -o 'href="/"' "$page" | wc -l | tr -d ' ')" = "1"
  test "$(printf '%s\n' "$masthead" | grep -o 'href="/"' | wc -l | tr -d ' ')" = "1"
  test "$(grep -o 'href="/cc/"' "$page" | wc -l | tr -d ' ')" = "2"
  test "$(printf '%s\n' "$masthead" | grep -o 'href="/cc/"' | wc -l | tr -d ' ')" = "2"
  test "$(printf '%s\n' "$cc_nav" | grep -o 'href="/cc/"' | wc -l | tr -d ' ')" = "1"
  for destination in /cc/about.html /cc/about.html#Authors /cc/about.html#Works /cc/debates.html /cc/opinions.html; do
    test "$(grep -Fo "href=\"$destination\"" "$page" | wc -l | tr -d ' ')" = "1"
    test "$(printf '%s\n' "$masthead" | grep -Fo "href=\"$destination\"" | wc -l | tr -d ' ')" = "1"
    test "$(printf '%s\n' "$cc_nav" | grep -Fo "href=\"$destination\"" | wc -l | tr -d ' ')" = "1"
  done

  ! grep -q '/cc//' "$page"
done

about_file="$root/cc/about.html"
author_index=$(sed -n '/<ul id="author-index"/,/<\/ul>/p' "$about_file")
work_index=$(sed -n '/<ul id="work-index"/,/<\/ul>/p' "$about_file")

test "$(printf '%s\n' "$author_index" | grep -o 'href="/cc/authors/[^"]*"' | wc -l | tr -d ' ')" = "12"
for author in smith kant wollstonecraft tocqueville mill marx nietzsche dubois ambedkar fanon arendt foucault; do
  printf '%s\n' "$author_index" | grep -q "href=\"/cc/authors/$author.html\""
done

test "$(printf '%s\n' "$work_index" | grep -o 'href="/cc/works/[^"]*"' | wc -l | tr -d ' ')" = "12"
for author in smith kant wollstonecraft tocqueville mill marx nietzsche dubois ambedkar fanon arendt foucault; do
  printf '%s\n' "$work_index" | grep -q "href=\"/cc/works/works-by-$author.html\""
done

echo "primary site structure passed"
