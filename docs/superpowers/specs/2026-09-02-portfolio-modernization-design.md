# Portfolio Modernization Design

## Purpose

Rebuild Griffin Newbold's website as one coherent, evolving portfolio that represents professional software work and academic/teaching work with equal weight. The finished site must remain a static GitHub Pages site, preserve established public URLs, support light and dark themes, and be straightforward to maintain without a framework or build step.

## Current Problems

The current modernization branch contains two competing page systems. The homepage uses a new semantic header and custom layout, while Projects, Teaching, Courses, and Contact retain Bootstrap grids, duplicated profile sidebars, floating theme buttons, and Previous/Next content controls. Critical Concepts uses a third navigation and styling model. This produces inconsistent spacing, navigation, hierarchy, interaction behavior, and mobile presentation.

The compatibility stylesheet disguises some of these differences but does not resolve them. The modernization must replace the legacy structures rather than add further overrides.

## Product Principles

- Present the site as a living portfolio, not a historical archive.
- Give professional engineering and academic/teaching work comparable prominence.
- Favor direct, scannable content over carousels and hidden panels.
- Use links for navigation and buttons only for actions.
- Maintain a restrained typography-led visual identity in both light and dark modes.
- Preserve useful historical material without allowing it to dominate current work.
- Keep all implementation static and compatible with GitHub Pages.
- Preserve existing public routes and resource URLs wherever possible.

## Information Architecture

The global navigation will contain:

- Home (`/`)
- Work (`/projects.html`)
- Teaching (`/teaching.html`)
- About (`/contact.html`)
- Resume (`/resources/griffinnewbold_resume.pdf`)
- Theme control

Courses will no longer be a primary navigation item. `/courses.html` will remain available as a compatibility route and course index, and Teaching will link to it where appropriate.

The global footer will contain concise site navigation plus GitHub, LinkedIn, email/contact, and resume destinations. Contact details will be maintained in one place rather than repeated across pages.

## Shared Site Shell

The five primary pages will use the same semantic structure:

1. A skip link targeting the main content.
2. A global header with wordmark, navigation, active-page state, mobile menu control, and integrated theme control.
3. A `main` element with a page-specific introduction and content.
4. A global footer with identity, contact, and navigation links.

`scripts/navigation.js` will own only mobile-menu state. `scripts/theme.js` will own theme initialization, persistence, and the explicit theme control. Theme controls will exist in HTML instead of being injected as floating buttons.

`style.css` will be the design-system and primary-page stylesheet. It will define tokens, typography, layout primitives, navigation, footer, buttons, links, project entries, resource lists, biography sections, focus states, responsive behavior, and reduced-motion behavior.

`legacy.css` will be removed when no primary page depends on it. Bootstrap, jQuery, and Popper will be removed from the five primary pages. Specialized historical pages may retain their dependencies when removal would add risk without improving the portfolio experience.

## Homepage

The homepage will contain:

1. A concise introduction naming Griffin as a software engineer and educator.
2. A selected-work section containing a small number of current or representative projects.
3. A teaching and academic section linking to teaching resources and Critical Concepts.
4. A short biography that incorporates current role, Columbia education, teaching experience, and location previously repeated in the sidebar.
5. A concise contact prompt and the global footer.

Redundant pathways and calls to action will be removed. The first viewport will have one primary work action and one secondary contact or biography action. Homepage copy will avoid time-sensitive phrases unless they are intentionally maintained as current-status content.

## Work Page

`projects.html` will become a visible project index rather than a thirteen-panel Previous/Next carousel. Every project will remain accessible on initial page load.

Projects will be grouped or filterable using these categories:

- Professional and research
- Software projects
- Academic projects
- Early work and experiments

Each entry will contain a title, period, concise description, technologies, category, and available repository/demo links. Existing project images will be retained only when they clarify the project. Recent and representative work will receive stronger hierarchy; older projects will remain available in a compact presentation.

If client-side filters are included, the unfiltered project list will remain complete and usable without JavaScript. Filter controls will use real buttons with pressed states and keyboard support.

`scripts/projects_script.js` and the Previous/Next controls will be removed after the static project index is complete.

## Teaching and Courses

`teaching.html` will become the primary academic landing page. It will organize content by teaching role and term, with structured resource lists for course sites, notes, reviews, examples, and exam materials.

`courses.html` will remain at its current URL as a compatibility course index. It will link into the Teaching page and existing course microsites without duplicating long narrative content. Existing course microsite and PDF URLs will not change.

Previous/Next controls will be removed from both pages. All important sections will be directly visible and linkable. `scripts/teaching_script.js` and `scripts/courses_script.js` will be removed when they no longer have consumers.

## About and Contact

`contact.html` will serve as the About and Contact destination while preserving its existing URL. It will incorporate:

- Current professional role
- Columbia education
- Teaching experience
- General location
- Professional and academic interests
- One intentional portrait placement
- Concise contact, GitHub, LinkedIn, and resume links

The repeated left sidebar will be removed from every primary page. Information from it will be placed only where it supports the current page's purpose.

## Critical Concepts

Critical Concepts will retain its academic-project identity and routes under `/cc/`. It will receive a consistent bridge back to the portfolio and an integrated theme control.

Its section navigation will continue to expose Home, About, Debates, Op Eds, Authors, Works, and Search. Bootstrap navigation may be replaced after confirming dropdown and search behavior can be preserved with simpler HTML and JavaScript. The malformed `/cc//authors/kant.html` link will be corrected.

The automatically injected floating theme button will be removed. External images will be reviewed for availability, stability, attribution, and whether they should be replaced by repository-hosted assets.

## Specialized Areas

Party Games will remain visually and functionally independent. Each game will provide a dependable route back to the portfolio where this can be added without changing game behavior.

Generated JavaDoc will not be restyled file by file. A portfolio-facing documentation index may link to the generated output, but generated assets and internal JavaDoc navigation will remain untouched.

Historical course microsites and downloadable PDFs will keep their URLs and functionality. They may receive a lightweight portfolio return link if it does not conflict with their course-specific navigation.

## Theme Behavior

On first visit, the site will use `prefers-color-scheme`. An explicit choice will be stored in `localStorage` under `griffin-theme` and will override the system preference on later visits. The theme control will communicate its current state and available action to assistive technology.

Both themes will use shared semantic tokens for background, surface, text, muted text, borders, accent, focus, and media treatment. Theme changes will not hide content, reduce contrast, or alter layout.

## Accessibility and Responsive Behavior

- Every primary page will contain one `h1` and a logical heading hierarchy.
- All informative images will have useful alternative text; decorative images will use empty alternative text.
- Keyboard focus will be clearly visible.
- Navigation and filter controls will be fully keyboard-operable.
- Mobile navigation will expose accurate expanded state and close after navigation.
- Page content will not require horizontal scrolling at 320 CSS pixels.
- Motion will respect `prefers-reduced-motion`.
- Light and dark foreground/background combinations will meet WCAG AA contrast for normal text.

## Content Editing

Copy will be shortened and rewritten for clarity while preserving factual meaning. Outdated phrases such as "recent graduate," future-tense job references, and elapsed-year claims will be removed or made current. Spelling and grammar errors will be corrected.

The implementation will not invent employment details, contact information, project outcomes, dates, repositories, or credentials. Existing facts may be reorganized, but uncertain or missing current information will be surfaced for Griffin's review.

## Testing and Verification

The static test suite will verify:

- Every primary page includes the shared header, main content, footer, theme script, and navigation script.
- Every internal link resolves to a tracked file, directory index, or explicitly allowed external destination.
- Primary pages do not load Bootstrap, jQuery, or Popper.
- Primary pages do not include profile sidebars or legacy Previous/Next controls.
- Each primary page has exactly one `h1` and no duplicate IDs.
- Every image has an `alt` attribute.
- Theme preference behavior and mobile-menu state work in a browser.
- Project filtering, if implemented, preserves a complete no-JavaScript project list.
- The page has no horizontal overflow at desktop and mobile widths.

Visual verification will cover the homepage, Work, Teaching, About, and Critical Concepts in light and dark modes at desktop and mobile widths. Existing games, PDFs, historical course pages, and JavaDoc entry points will receive link and smoke checks.

## Delivery Order

1. Shared shell, tokens, navigation, footer, and structural tests.
2. Homepage and About/Contact restructuring.
3. Work page and project-index replacement.
4. Teaching and Courses restructuring.
5. Critical Concepts bridge and navigation cleanup.
6. Specialized-area return links, content cleanup, accessibility audit, link validation, and final visual QA.

Each stage will be independently testable and committed separately. The work will continue on `codex/modernize-personal-site`, replacing the compatibility-layer approach before the pull request is merged.
