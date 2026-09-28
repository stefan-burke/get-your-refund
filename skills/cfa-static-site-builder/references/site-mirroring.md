# Site Mirroring

Read this reference when rebuilding an existing website as a CfA Static fork
by mirroring a live source site page-for-page. It records the process that
produced the 530a Accounts mirror (WordPress + Elementor → CfA Static) and
the judgment rules that kept the copy faithful. For template mechanics —
blocks, layouts, theming — read [project setup](project-setup.md),
[content authoring](content-authoring.md), and the generated block reference
first.

## 1. Scrape the source site

1. Crawl the source sitemap; save per page: raw HTML (`html/<path>.html`),
   a content inventory in DOM order (`inventory/<path>.md`: sections, exact
   text, images, buttons/CTAs, nav + footer lists, tables, meta description),
   downloaded assets with original filenames, and extracted palette/
   typography notes. Keep everything in a gitignored scratch directory — it
   is read-only ground truth, never shipped.
2. Audit the extractor against the raw HTML before trusting it: naive DOM
   walkers silently drop inline `<a href>`s inside `<p>` content and inline
   `<strong>` markers (list items, headings, and button links survive). List
   every content anchor per page with its resolved href and status
   (already-linked / MISSING-HREF / WRONG-HREF) and treat that audit as the
   authoritative href source during conversion.
3. Record page pairing (en/es or other locales), oddities, and pages that are
   empty placeholders in an index file.

## 2. Map pages to the existing block vocabulary

Convert each locale's page from ITS OWN inventory — locales on real sites are
not symmetric (different copy, footer links, contact addresses); never derive
one locale from another. Reuse existing block types in this order of
preference:

- Page-top "current as of…" notice → `callout` (`variant: warning`, `compact: true`).
- Hero with heading + photo → `split-image` (`compact: true`); two-column
  intro bands and three-up step cards → `blockLayouts.json` claim queues
  keyed on a page tag, themed in `theme.scss` (full-bleed via
  `margin-inline: calc(50% - 50vw)`).
- Prose → `markdown`; Q&A/accordion runs → `faqs` with inline `items`;
  standalone buttons → `link-button`; closing bands → `cta`; long legal text
  → `markdown` blocks per h2 plus `table-of-contents`. When the source renders
  Q&A runs as collapsed accordions (Elementor accordion widgets, chevron
  icons), the `faqs` block already matches: it renders native
  `<details>/<summary>` rows, collapsed by default, through a forked include
  (documented diff from the template's historical open definition list).
- Cross-check every link against the raw HTML, restore audit MISSING-HREF
  anchors inline, and re-add `<strong>` bold the extractor lost.

## 3. Theme

1. Rebuild `src/css/theme.scss` from the extracted palette as token
   overrides, plus only the component treatments tokens cannot express
   (button radius/padding/hover, callout borders, sticky header, footer band).
2. Google-Fonts `@import url(...)` does not work — the theme file compiles
   last into the CSS bundle, so the `@import` is never at the stylesheet top.
   Self-host instead: download woff2 from Bunny Fonts into `src/assets/fonts/`
   and append `@font-face` rules to `src/css/_fonts.scss`.
3. The media transform wraps content images with an inline `max-width`;
   countermand small fixed icons with `!important` in the theme.

## 4. Locale-aware chrome

- Footer copy: one snippet per locale (`footer-content-<code>.md`), selected
  in the footer include by `pageLanguage.code`; repoint the base layout's
  footer-snippet hook the same way.
- Header menu: branch on `pageLanguage.code` in `navigation.html` and mirror
  the live nav verbatim per locale, including submenus and external entries.
- Pair all equivalent routes in `translations.json` (distinct slugs per
  locale are fine). `check:links` counts `<link rel="alternate" hreflang>`
  targets, so a pair whose pages are not all built yet fails the build — add
  each group when both pages exist, or temporarily withhold it.

## 5. Live-site quirk rules

Decide per case; document each in an upstream notes file:

- Text: verbatim, including typos and stale claims — flag quirks for the
  source site's team instead of silently fixing them.
- Links: internal links become site-relative; normalize the source site's
  locale-less URLs to the default locale (matches its own redirect behavior).
  Preserve live 404 targets verbatim as absolute URLs (the internal-link
  checker skips scheme'd hrefs) so the mirror reproduces the live behavior.
- Empty placeholder pages: build a no-content page (`no_index: true`,
  scraped title) so the URL parity holds; record the decision.
- Breadcrumb trails: when the source shows a breadcrumb on inner pages, leave
  the template's breadcrumb feature on (`show_breadcrumbs` in
  `src/_data/config.json`) and restyle it to match; suppress it per page with
  `no_breadcrumbs: true` where the source has none (e.g. legal pages). Pages
  whose trail names differ from their titles use `eleventyNavigation.parent`.
- Deliberately dropped source features (tracking pixels, third-party seals
  that cannot be scraped): list them as conscious diffs in a per-page
  visual-notes file.

## 6. Validate and compare

1. `npm run build` (includes `check:links`), `npm run check:a11y`, and
   `npm run lint:scss` after theme work.
2. Serve `_site`, screenshot every route at desktop and mobile (full-page),
   and capture the matching live pages; fix theme-level mismatches and
   re-capture.
3. Quantify with pixelmatch (threshold 0.1, `includeAA: true`): because
   reflow makes full-page heights diverge, compare the common top segment
   (crop both to width × min height) and a top 800px band; report both.
   Force scroll-through before screenshots — `data-reveal` fades are caught
   mid-transition otherwise. The noise floor for pages without a hero photo
   is ~6-7%; the organic mask on source hero photos is not reproducible and
   accounts for most of the remaining band difference.
4. Commit in logical slices (identity/config, theme/chrome, pages per
   locale, link restoration) and push.
