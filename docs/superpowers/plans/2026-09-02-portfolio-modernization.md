# Portfolio Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mixed legacy and modern page systems with one coherent, accessible, static portfolio that gives professional and academic work equal weight.

**Architecture:** Five primary HTML pages share one CSS design system, one explicit theme controller, one mobile-navigation controller, and consistent semantic header/footer markup. Critical Concepts keeps its own editorial content model but uses the same theme contract and a clear bridge to the primary portfolio; games, generated JavaDoc, historical course pages, and PDFs retain their existing functionality and URLs.

**Tech Stack:** Static HTML5, CSS custom properties, vanilla JavaScript, POSIX shell tests, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-02-portfolio-modernization-design.md`

## Global Constraints

- The deployed site must run directly on GitHub Pages without a build step, framework, database, or server runtime.
- Preserve `/`, `/projects.html`, `/teaching.html`, `/courses.html`, `/contact.html`, `/cc/`, existing course microsite URLs, game URLs, JavaDoc URLs, and downloadable resource URLs.
- Professional engineering and academic/teaching work receive comparable prominence.
- Primary pages must not load Bootstrap, jQuery, or Popper.
- Theme selection uses `localStorage` key `griffin-theme`, with `prefers-color-scheme` as the first-visit default.
- All essential content remains available without JavaScript; JavaScript may enhance theme, mobile navigation, and project filters.
- Do not invent employment details, contact information, dates, project outcomes, repositories, or credentials.
- Maintain WCAG AA text contrast, visible keyboard focus, reduced-motion support, and no horizontal overflow at 320 CSS pixels.

## File Responsibility Map

- `style.css`: all primary-site tokens, primitives, components, page layouts, themes, and responsive rules.
- `scripts/theme.js`: theme initialization, explicit user selection, storage, and accessible control state.
- `scripts/navigation.js`: mobile navigation open/close state only.
- `scripts/projects.js`: optional progressive-enhancement project filtering only.
- `index.html`: current identity, selected work, teaching/academic preview, short biography, contact prompt.
- `projects.html`: complete visible project index and optional category filters.
- `teaching.html`: teaching roles, terms, and resource groups.
- `courses.html`: compact compatibility index for courses and existing microsites.
- `contact.html`: About and Contact content, portrait, credentials, interests, and external contact links.
- `cc/style.css`: Critical Concepts-specific editorial components using the shared theme contract.
- `cc/scripts/navigation.js`: Critical Concepts mobile navigation and disclosure state.
- `tests/site_smoke.sh`: primary shell, dependency, sidebar, carousel, heading, and image checks.
- `tests/link_check.sh`: local target validation for internal links and media.
- `tests/browser/portfolio.spec.js`: browser behavior, responsive overflow, and theme checks when Playwright is available.

---

### Task 1: Shared semantic shell and structural tests

**Files:**
- Modify: `tests/site_smoke.sh`
- Create: `scripts/navigation.js`
- Modify: `scripts/theme.js`
- Modify: `style.css`
- Modify: `index.html`
- Modify: `projects.html`
- Modify: `teaching.html`
- Modify: `courses.html`
- Modify: `contact.html`
- Delete: `legacy.css`

**Interfaces:**
- Consumes: existing route paths and `griffin-theme` storage key.
- Produces: `[data-site-nav]`, `[data-nav-toggle]`, `[data-theme-toggle]`, `#main-content`, `.site-header`, `.site-footer`, and `window.GriffinTheme.set(theme)`.

- [ ] **Step 1: Strengthen the failing structural test**

Replace `tests/site_smoke.sh` with checks that require the shared shell and reject legacy structures:

```sh
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
```

- [ ] **Step 2: Run the structural test and confirm the expected failure**

Run: `sh tests/site_smoke.sh`

Expected: FAIL on `projects.html` because it still contains legacy navigation/sidebar/pagination and does not include `scripts/navigation.js`.

- [ ] **Step 3: Implement the explicit theme controller**

Rewrite `scripts/theme.js` as a readable module that initializes before paint and updates existing controls without injecting buttons:

```js
(function () {
  const storageKey = 'griffin-theme';
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      button.setAttribute('aria-pressed', String(dark));
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? 'Dark' : 'Light';
    });
  }

  setTheme(localStorage.getItem(storageKey) || systemTheme);
  addEventListener('DOMContentLoaded', () => {
    setTheme(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    });
  });

  window.GriffinTheme = { set: setTheme };
}());
```

- [ ] **Step 4: Implement mobile navigation behavior**

Create `scripts/navigation.js`:

```js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-nav-toggle]').forEach((toggle) => {
    const nav = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!nav) return;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.dataset.open = 'false';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.dataset.open = String(open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  });
});
```

- [ ] **Step 5: Replace all five primary-page shells**

Use this header structure on each page, changing only `aria-current="page"`:

```html
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <a class="wordmark" href="/" aria-label="Griffin Newbold home">GN<span>.</span></a>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>Menu</button>
  <nav class="site-nav" id="site-nav" data-site-nav data-open="false" aria-label="Primary navigation">
    <a href="/">Home</a><a href="/projects.html">Work</a><a href="/teaching.html">Teaching</a><a href="/contact.html">About</a><a href="/resources/griffinnewbold_resume.pdf">Resume</a>
  </nav>
  <button class="theme-toggle" type="button" aria-pressed="false" data-theme-toggle><span aria-hidden="true">◐</span><span data-theme-label>Light</span></button>
</header>
```

Add `id="main-content"` to each `main`, add the shared footer, and load `/scripts/theme.js` in `head` plus `/scripts/navigation.js` before `</body>`. Remove Bootstrap, jQuery, Popper, legacy navigation, sidebars, and floating theme controls.

- [ ] **Step 6: Implement the shared CSS system and remove compatibility CSS**

Format `style.css` into readable sections for tokens, reset, typography, shell, components, pages, and responsive states. Include `:focus-visible`, `.skip-link`, closed/open mobile navigation selectors, and exact light/dark tokens. Delete `legacy.css` only after no HTML file references it.

- [ ] **Step 7: Run the structural test**

Run: `sh tests/site_smoke.sh`

Expected: PASS with `primary site structure passed`.

- [ ] **Step 8: Commit the shared shell**

```bash
git add tests/site_smoke.sh scripts/theme.js scripts/navigation.js style.css index.html projects.html teaching.html courses.html contact.html legacy.css
git commit -m "refactor: unify portfolio page shell"
```

---

### Task 2: Homepage and About content architecture

**Files:**
- Modify: `tests/site_smoke.sh`
- Modify: `index.html`
- Modify: `contact.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: shared shell classes from Task 1.
- Produces: `.selected-work`, `.teaching-preview`, `.bio-summary`, `.profile-portrait`, and stable homepage section IDs.

- [ ] **Step 1: Add failing content-placement checks**

Append these assertions to `tests/site_smoke.sh`:

```sh
grep -q 'id="selected-work"' "$root/index.html"
grep -q 'id="teaching-preview"' "$root/index.html"
grep -q 'class="bio-summary"' "$root/index.html"
grep -q 'class="profile-portrait"' "$root/contact.html"
! grep -qi 'recent graduate\|this past semester\|throughout the summer' "$root/index.html" "$root/contact.html"
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `sh tests/site_smoke.sh`

Expected: FAIL because the required homepage sections and About portrait do not yet exist.

- [ ] **Step 3: Rebuild the homepage content**

Use one hero CTA to `/projects.html`, one text link to `/contact.html`, a `#selected-work` list with three representative existing projects, a `#teaching-preview` section linking to Teaching and Critical Concepts, and `.bio-summary` containing current role, Columbia education, teaching experience, and DC-area location. Use facts already present in the repository; do not add unverified project metrics or employment claims.

- [ ] **Step 4: Rebuild Contact as About and Contact**

Create one `h1` labeled “About”, use `/resources/profile-picture.jpg` once with `class="profile-portrait"`, and organize existing facts into Professional, Academic, and Contact sections. Preserve existing GitHub, LinkedIn, email, and resume destinations exactly as found in the current file.

- [ ] **Step 5: Style the homepage and About layouts**

Add open-grid sections rather than repeated cards. At widths below 800px, place the biography and portrait in one column and keep the first viewport headline within the viewport width.

- [ ] **Step 6: Run tests and commit**

Run: `sh tests/site_smoke.sh && git diff --check`

Expected: both commands exit 0.

```bash
git add tests/site_smoke.sh index.html contact.html style.css
git commit -m "feat: restructure homepage and about page"
```

---

### Task 3: Visible project index and progressive filters

**Files:**
- Modify: `tests/site_smoke.sh`
- Modify: `projects.html`
- Create: `scripts/projects.js`
- Modify: `style.css`
- Delete: `scripts/projects_script.js`

**Interfaces:**
- Consumes: `.site-header`, `.site-footer`, and CSS tokens from Task 1.
- Produces: `[data-project-filter]`, `[data-project-card]`, each card's `data-category`, and accessible pressed-state filtering.

- [ ] **Step 1: Add failing project-index checks**

Append:

```sh
test "$(grep -o 'data-project-card' "$root/projects.html" | wc -l | tr -d ' ')" -ge 13
grep -q 'data-project-filter="all"' "$root/projects.html"
grep -q 'scripts/projects.js' "$root/projects.html"
! grep -q 'projects_script.js' "$root/projects.html"
test ! -f "$root/scripts/projects_script.js"
```

- [ ] **Step 2: Verify failure**

Run: `sh tests/site_smoke.sh`

Expected: FAIL because projects are still carousel panels and the old script exists.

- [ ] **Step 3: Convert all project panels into visible entries**

Retain all thirteen project titles and factual content. Replace `id="divN" class="content"` wrappers with `<article class="project-entry" data-project-card data-category="...">`. Shorten each description to an outcome-focused summary, retain technologies and dates, and preserve working image/demo/repository links.

- [ ] **Step 4: Add filter controls and enhancement script**

Create controls for `all`, `professional`, `software`, `academic`, and `early`. In `scripts/projects.js`, toggle the `hidden` property and `aria-pressed` state:

```js
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('[data-project-filter]');
  const projects = document.querySelectorAll('[data-project-card]');
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.projectFilter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    projects.forEach((project) => { project.hidden = category !== 'all' && project.dataset.category !== category; });
  }));
});
```

- [ ] **Step 5: Style filters and project entries**

Use a compact filter row and open list with strong title/date hierarchy. Do not use a uniform card grid. Images use stable aspect ratios and never exceed their entry width.

- [ ] **Step 6: Remove old behavior, verify, and commit**

Delete `scripts/projects_script.js` after `rg 'projects_script'` shows no consumers.

Run: `sh tests/site_smoke.sh && git diff --check`

```bash
git add tests/site_smoke.sh projects.html scripts/projects.js scripts/projects_script.js style.css
git commit -m "feat: replace project carousel with visible index"
```

---

### Task 4: Teaching and Courses restructuring

**Files:**
- Modify: `tests/site_smoke.sh`
- Modify: `teaching.html`
- Modify: `courses.html`
- Modify: `style.css`
- Delete: `scripts/teaching_script.js`
- Delete: `scripts/courses_script.js`

**Interfaces:**
- Consumes: primary shell and `.resource-list` styles.
- Produces: `#teaching-roles`, `#course-resources`, `.resource-list`, and a complete compatibility course index.

- [ ] **Step 1: Add failing teaching checks**

Append:

```sh
grep -q 'id="teaching-roles"' "$root/teaching.html"
grep -q 'id="course-resources"' "$root/teaching.html"
grep -q 'class="resource-list"' "$root/teaching.html"
! grep -q 'teaching_script.js' "$root/teaching.html"
! grep -q 'courses_script.js' "$root/courses.html"
test ! -f "$root/scripts/teaching_script.js"
test ! -f "$root/scripts/courses_script.js"
```

- [ ] **Step 2: Verify failure**

Run: `sh tests/site_smoke.sh`

Expected: FAIL because both pages still use hidden panels and legacy scripts.

- [ ] **Step 3: Rebuild Teaching**

Create directly visible sections for teaching roles, COMS 1004 resources, COMS 1002 material, and Advanced Software Engineering. Preserve every current PDF and course-site URL. Use `.resource-list` rows with resource title, type, term, and link.

- [ ] **Step 4: Rebuild Courses as a compatibility index**

Use one introductory paragraph and grouped links to the existing Spring 2024 Java and Fall 2024 Advanced Software Engineering microsites. Preserve any unique course information not represented on Teaching, but remove duplicate biography and narrative text.

- [ ] **Step 5: Remove legacy scripts and style resource lists**

After `rg 'teaching_script|courses_script' -g '*.html'` returns no matches, delete both scripts. Style resources as open bordered rows with clear hover/focus states and one-column mobile behavior.

- [ ] **Step 6: Verify and commit**

Run: `sh tests/site_smoke.sh && git diff --check`

```bash
git add tests/site_smoke.sh teaching.html courses.html scripts/teaching_script.js scripts/courses_script.js style.css
git commit -m "feat: restructure teaching and course resources"
```

---

### Task 5: Critical Concepts integration

**Files:**
- Modify: `tests/site_smoke.sh`
- Modify: `cc/style.css`
- Create: `cc/scripts/navigation.js`
- Modify: all authored `cc/**/*.html`

**Interfaces:**
- Consumes: `griffin-theme` theme contract from Task 1.
- Produces: `.cc-portfolio-link`, `[data-cc-nav-toggle]`, `#cc-nav`, and explicit `[data-theme-toggle]` controls on every Critical Concepts page.

- [ ] **Step 1: Add failing Critical Concepts checks**

Append:

```sh
for page in $(find "$root/cc" -name '*.html' -type f); do
  grep -q 'class="cc-portfolio-link"' "$page"
  grep -q 'data-theme-toggle' "$page"
  grep -q '/cc/scripts/navigation.js' "$page"
  ! grep -q '/cc//' "$page"
done
```

- [ ] **Step 2: Verify failure**

Run: `sh tests/site_smoke.sh`

Expected: FAIL because pages rely on an injected floating theme control and contain no portfolio bridge.

- [ ] **Step 3: Add the explicit Critical Concepts masthead**

On every authored Critical Concepts page, add a compact masthead containing “Griffin Newbold” linked to `/`, “Critical Concepts” linked to `/cc/`, section navigation, and an explicit theme button. Remove Bootstrap dropdown markup only where the same destinations are replaced by visible Authors and Works index links.

- [ ] **Step 4: Implement mobile disclosure behavior**

Create `cc/scripts/navigation.js` using the same `aria-expanded`, `data-open`, Escape-key, and link-close behavior as the primary navigation, with selectors `[data-cc-nav-toggle]` and `#cc-nav`.

- [ ] **Step 5: Consolidate Critical Concepts styling**

Format `cc/style.css`, remove floating-toggle rules, map its palette to `[data-theme]`, retain readable editorial typography, and ensure cards and search results inherit dark-theme colors. Correct every `/cc//` path to `/cc/`.

- [ ] **Step 6: Verify and commit**

Run: `sh tests/site_smoke.sh && git diff --check`

```bash
git add tests/site_smoke.sh cc
git commit -m "refactor: integrate Critical Concepts navigation"
```

---

### Task 6: Link validation, specialized-area bridges, and final QA

**Files:**
- Create: `tests/link_check.sh`
- Create: `tests/browser/portfolio.spec.js`
- Modify: `tests/site_smoke.sh`
- Modify: `party_games/memory.html`
- Modify: `party_games/pong.html`
- Modify: `party_games/tetris.html`
- Modify: selected `teaching/2024/**/index.html` files only where a return link does not conflict with existing navigation
- Modify: primary HTML/CSS/JS files when QA finds defects

**Interfaces:**
- Consumes: all public routes and UI contracts from Tasks 1–5.
- Produces: repeatable static and browser verification commands.

- [ ] **Step 1: Write the failing internal-link checker**

Create `tests/link_check.sh` to extract root-relative `href` and `src` values, remove query strings/fragments, URL-decode spaces, ignore `mailto:`, `tel:`, `http:`, `https:`, and `#`, then require each local target to exist as a file or directory with `index.html`. Print each missing target and exit 1 when any are missing.

- [ ] **Step 2: Run it and record genuine missing targets**

Run: `sh tests/link_check.sh`

Expected: FAIL if any internal target is absent. Fix malformed paths in authored HTML; do not rewrite generated JavaDoc internals unless the target is genuinely missing from generated output.

- [ ] **Step 3: Add lightweight return links to specialized areas**

Add a visible “Back to Griffin Newbold” link to the three Party Games pages. Add the same link to historical course landing pages only when it can sit outside their course navigation without changing existing scripts or assignments. Do not modify generated JavaDoc files.

- [ ] **Step 4: Add browser verification**

Create `tests/browser/portfolio.spec.js` with Playwright tests that load `/`, `/projects.html`, `/teaching.html`, `/courses.html`, `/contact.html`, and `/cc/`; assert no horizontal overflow at 1440×900 and 390×844; toggle dark mode and assert `document.documentElement.dataset.theme === 'dark'`; reload and assert persistence; open and close mobile navigation; and exercise every project filter while confirming at least one project remains visible.

- [ ] **Step 5: Run static verification**

Run:

```bash
sh tests/site_smoke.sh
sh tests/link_check.sh
git diff --check
```

Expected: all commands exit 0 with no missing targets or whitespace errors.

- [ ] **Step 6: Run visual and interaction QA**

Serve the repository root with `python3 -m http.server 4173`, then use the in-app browser at `http://127.0.0.1:4173/`. Capture and inspect homepage, Work, Teaching, About, and Critical Concepts at 1440×900 and 390×844 in light and dark modes. Check first-viewport hierarchy, navigation continuity, copy, typography, borders, image framing, mobile overflow, focus behavior, and theme persistence.

- [ ] **Step 7: Verify GitHub Pages compatibility**

Confirm no primary-page asset uses a filesystem path, no build output is required, `CNAME` remains unchanged, and all resources are referenced by repository-relative or root-relative web paths.

- [ ] **Step 8: Commit final QA fixes**

```bash
git add tests party_games teaching index.html projects.html teaching.html courses.html contact.html style.css scripts cc
git commit -m "test: complete portfolio modernization QA"
```

- [ ] **Step 9: Push the completed branch and update the pull request**

Run: `git push origin codex/modernize-personal-site`

Expected: the remote branch advances through all six implementation commits and remains ready for pull-request review against `main`.
