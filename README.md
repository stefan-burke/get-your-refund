# 530a Accounts — GetYourRefund

Static rebuild of [530a.getyourrefund.org](https://530a.getyourrefund.org), the
Code for America guide to 530A ("Trump") investment accounts for children, in
English and Spanish. A fork of [CfA Static](https://github.com/codeforamerica/cfa-static);
template updates arrive only through a reviewed `upstream` merge.

## Status

Mirrors all 25 URLs of the original site's `page-sitemap.xml` from the
WordPress/Elementor original (including the empty `/en/elementor-page-675/`
placeholder, kept for URL parity and marked `no_index`). Scraped source
material (page inventories, raw HTML, images, style notes) lives in the
gitignored `.mirror-scratch/` directory and is the ground truth for content;
`upstream.txt` (also gitignored) records template friction and the small set
of conscious deviations.

## Customisations from template defaults

The site changes no template code: everything below is content, data, and
`src/css/theme.scss`.

[Diff this site's code against the template
baseline](https://github.com/stefan-burke/get-your-refund/compare/cfa-static-main..main):
the `cfa-static-main` branch mirrors the `cfa-static` tip this site has
adopted, so the direct comparison shows exactly this fork's own files.

- **Collections/CMS:** pages and snippets only. Managed via
  `npm run customise-cms`; `cms_config` is saved in `src/_data/site.json`.
- **Languages:** `en` (default, under `/en/`) and `es` in
  `src/_data/languages.json`, all 12 page pairs in
  `src/_data/translations.json`. Each language's pages live in
  `src/pages/en/` and `src/pages/es/` and were converted from their own
  scraped page — the two are not symmetric (footer links, copy, meta). The es
  privacy page keeps its distinct slug `/es/politica-de-privacidad/`.
- **Menus:** each page's `eleventyNavigation` entry builds its language's
  menu, with the sign-up pages nested under how-to-signup. The "Visit
  GetYourRefund" entries are link-only files (`visit-getyourrefund.md`,
  `visite-getyourrefund.md`).
- **Header and footer:** `logo` in `site.json`; `collapse_menu: always` and
  `language_switcher: header` in `config.json`; footer copy is the
  `footer-content` snippet, with the Spanish version at
  `src/snippets/es/footer-content.md`.
- **Redirects:** `/` and the live site's unprefixed URLs (`/how-to-signup/`,
  `/privacy-policy/`, …) redirect to their `/en/` or `/es/` page through
  `redirect_from`, as on the live site.
- **Theme:** `src/css/theme.scss` carries the 530a palette (navy `#011E29`,
  cream `#FFFFF5`, mint `#E8FDF7`, sand `#EBECDB`, teal `#007C7C`, amber
  `#FFAE00`), self-hosted Geologica/Inter (`src/assets/fonts/`), the navy
  sticky header with the menu styled as the legacy full-screen popup, full-bleed
  mint/sand home columns, the navy CTA band, FAQ accordions (`faqs` blocks
  with `collapsible: true`) on a white band, the breadcrumb trail, and the
  two-column navy footer. Column arrangements are in
  `src/_data/blockLayouts.json` under the `gyr-home` / `gyr-signup` tags.
- **Config toggles:** search, theme switcher, and placeholder images off;
  breadcrumbs on (`no_breadcrumbs: true` where the source shows none);
  external links open in a new tab, as on the live site.

## Working on it

- [Site Builder Reference](docs/developer-reference.md), [CLAUDE.md](CLAUDE.md)
- Generated block reference:
  [skills/cfa-static-site-builder/references/blocks.md](skills/cfa-static-site-builder/references/blocks.md);
  the `/blocks/` gallery page was removed with the demo pages; regenerate
  reference material with `npm run generate-references`
- Site data in `src/_data/`, content in `src/pages/`

## Checks

```sh
npm run test         # every check below plus the template's test suite
npm run build        # Eleventy build + Pagefind + internal link check
npm run check:a11y   # axe WCAG 2.2 AA audit of built pages
npm run lint:scss    # stylelint (theme changed? run this too)
```

Node 22 (see `package.json` `engines`); this site was built with Node v22.23.3.

## Deployment

Not configured yet. The template's SharedServices and GitHub Pages workflows
are present under `.github/workflows/`; see the [CfA Static deployment
docs](https://github.com/codeforamerica/cfa-static#deployment) before enabling
either.
