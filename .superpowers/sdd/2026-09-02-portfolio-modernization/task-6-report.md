# Task 6 report: Link validation, specialized-area bridges, and final QA

## Outcome

Task 6 adds a real local link checker, visible portfolio return links for the three Party Games and safe historical course landing pages, a dependency-light Playwright behavior suite, and final responsive/theme/navigation/filter/focus QA. Public routes and existing content classifications remain unchanged.

## TDD RED/GREEN evidence

1. **Internal links**
   - RED: `sh tests/link_check.sh` exited 1 and reported `/teaching/2024/spring/java-1004/samples.html` and `/teaching/2024/spring/java-1004/supplementary.html`.
   - GREEN: corrected those repeated authored legacy navigation targets to include `/legacy/`; the checker then printed `internal links passed`.
   - An earlier checker run hit a shell quote-parsing syntax error. That harness error was corrected and was not counted as RED evidence.
2. **Specialized-area bridges and mobile hero cleanup**
   - RED: new `tests/site_smoke.sh` assertions for all six landing-page bridges and one mobile `.hero h1` declaration exited 1 before the HTML/CSS changes.
   - GREEN: the smoke suite printed `project filter behavior passed` and `primary site structure passed`.
3. **Critical Concepts failed portrait rendering**
   - RED: in-app browser inspection found a completed remote portrait with `naturalWidth: 0`, `hidden: false`, and a visible broken-image icon.
   - GREEN: the generated image now has meaningful alt text and hides only on load failure. The failed-image branch was observed with `naturalWidth: 0`, `hidden: true`, and `display: none`; author text and destination link remained visible.
4. **Skip-link focus**
   - RED: the Playwright suite passed 5/6 tests; activating the skip link left `document.activeElement.id` empty instead of `main-content`.
   - GREEN: adding `tabindex="-1"` to all five primary `<main>` landmarks produced 6/6 passing browser tests.

## Link-check implementation and results

`tests/link_check.sh` scans HTML for quoted root-relative `href` and `src` values, ignores fragments, protocol-relative and external/contact schemes, strips queries/fragments, decodes `%20`, and accepts files or directories containing `index.html`. It prints each normalized missing target and exits 1 when any exist.

Final result: `internal links passed`; no generated JavaDoc file was edited.

## Specialized pages changed

Visible `Back to Griffin Newbold` links were added or normalized on:

- `party_games/memory.html`
- `party_games/pong.html`
- `party_games/tetris.html`
- `teaching/2024/fall/adv-swe-4156/index.html`
- `teaching/2024/spring/java-1004/index.html`
- `teaching/2024/spring/java-1004/legacy/index.html` (normalized the existing footer return link)

The two genuine missing legacy navigation targets were also corrected in:

- `teaching/2024/spring/java-1004/legacy/index.html`
- `teaching/2024/spring/java-1004/legacy/exammaterials.html`
- `teaching/2024/spring/java-1004/legacy/officehours.html`
- `teaching/2024/spring/java-1004/legacy/samples.html`
- `teaching/2024/spring/java-1004/legacy/supplementary.html`
- `teaching/2024/spring/java-1004/legacy/syllabus.html`

At 390×844, each Party Games link was fixed and visible inside the viewport; each course link was rendered outside course navigation at the page footer.

## Browser automation and matrix

No repository-local package or Playwright setup existed. The bundled workspace contains Playwright and the machine has an installed Chrome channel, so `tests/browser/portfolio.spec.js` uses Node's built-in test runner and `require('playwright')` without adding npm/build infrastructure.

In-app browser visual matrix:

| Viewport | Routes | Themes | Result |
| --- | --- | --- | --- |
| 1440×900 | Home, Work, Teaching, About, Critical Concepts | Light and dark | Passed visual, identity, overflow, navigation continuity, and console checks |
| 390×844 | Home, Work, Teaching, Courses, About, Critical Concepts | Light and dark | Passed visual, identity, overflow, typography, framing, and console checks |

The standalone suite loaded `/`, `/projects.html`, `/teaching.html`, `/courses.html`, `/contact.html`, and `/cc/` at 1440×900 and 390×844. It also verified dark-theme persistence, mobile navigation open/close, keyboard skip-link focus, and all project filters. Filter counts observed in the in-app browser were All 13, Software 2, Academic 6, and Early work 5. Both the portfolio and Critical Concepts mobile menus transitioned from closed to open to closed with synchronized ARIA state.

## Visual findings and fixes

- Consolidated duplicate mobile `.hero h1` declarations while preserving the final intended `clamp(3.2rem, 19vw, 6.6rem)` size.
- Prevented broken remote portrait icons in randomized Critical Concepts cards while retaining valid portraits and adding meaningful alt text. Added an asset query suffix so the revised script is not masked by a stale cached copy.
- Fixed skip-link focus by making primary main landmarks programmatically focusable.
- Fixed Memory's malformed `Go Home!` anchor while adding its always-visible portfolio bridge.
- No other clipping, horizontal overflow, unreadable borders/type, image-framing defect, or primary-page console warning/error was observed in the required matrix.

## GitHub Pages compatibility

- `CNAME` is unchanged byte-for-byte and remains `www.griffinnewbold.dev`.
- No package/build output is required; no `package.json` or build infrastructure was added.
- Primary HTML/CSS/JS contains no `/Users/`, `file://`, or Windows filesystem path.
- Local public resources use repository-relative or root-relative web paths and pass `tests/link_check.sh`.
- Existing public routes, project IDs, and the Academic classification for COMS 4156 remain unchanged.

## Final commands and output

```text
$ sh tests/site_smoke.sh
project filter behavior passed
primary site structure passed

$ sh tests/link_check.sh
internal links passed

$ git diff --check
(no output; exit 0)

$ node --check cc/scripts/index.js && node --check scripts/theme.js && node --check scripts/navigation.js && node --check scripts/projects.js
(no output; exit 0)

$ git diff --exit-code HEAD -- CNAME && test ! -f package.json && ! rg -n '(/Users/|file://|[A-Za-z]:\\\\)' index.html projects.html teaching.html courses.html contact.html style.css scripts cc
(no output; exit 0)

$ NODE_PATH=/Users/griffin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules /Users/griffin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/browser/portfolio.spec.js
tests 6; pass 6; fail 0; duration_ms 5069.781167
```

## Self-review

- Confirmed no generated JavaDoc changes.
- Confirmed no Professional filter or COMS 4156 reclassification.
- Confirmed no invented contact, employment, project, or date details.
- Confirmed specialized bridges do not alter course scripts, assignments, or course navigation structure.
- Reviewed changed-file scope and whitespace; changes are limited to Task 6 verification, bridges, link corrections, and browser-found QA defects.

## Concerns and unresolved limitations

- The historical Memory game logs a pre-existing `ReferenceError: updateTimer is not defined` during `newBoard()`. Task 6 did not alter legacy game behavior beyond links, so this remains documented rather than expanded into a game repair.
- The committed Playwright artifact intentionally has no repository dependency lockfile. It is runnable in this workspace via the exact bundled-runtime command above, or in another environment where `playwright` and a Chrome channel are already available.
- Visual QA used the in-app Chromium browser and installed Chrome for the standalone suite; Safari and Firefox were not exercised.
- No push was performed during the user-requested bounded wrap-up; the commit remains on the current `codex/modernize-personal-site` branch.

## Independent-review fixes

The first independent review found no production defect but identified false-green gaps in the QA harness. The follow-up changes:

- resolve both root-relative and document-relative `href`/`src` values, including `.`/`..`, query strings, fragments, and percent-encoded spaces;
- add `tests/link_check_test.sh`, which proves valid relative files/directories pass while missing and root-escaping targets fail with source-page diagnostics;
- correct two authored Critical Concepts citations that omitted `https://` and repair favicon, stylesheet, and script references in six authored legacy Java course pages;
- expand responsive browser coverage to 320×844;
- assert HTTP success and route identity;
- exercise both primary and Critical Concepts navigation through button close, Escape close, and link-activation close paths; and
- assert exact project-filter counts, category integrity, and a single synchronized pressed state.

Generated JavaDoc was scanned but not edited. After fixing a BSD `awk` portability defect in the new normalizer and a mistaken descendant selector in the strengthened filter assertion, fresh results were:

```text
$ sh tests/link_check_test.sh && sh tests/link_check.sh
link checker behavior passed
internal links passed

$ NODE_PATH=<workspace Playwright modules> <workspace node> --test tests/browser/portfolio.spec.js
tests 8; pass 8; fail 0
```
