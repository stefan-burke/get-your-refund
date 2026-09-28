# 530a Accounts — GetYourRefund

Static rebuild of [530a.getyourrefund.org](https://530a.getyourrefund.org), the
Code for America guide to 530A ("Trump") investment accounts for children, in
English and Spanish. Built from [CfA Static](https://github.com/codeforamerica/cfa-static);
template updates arrive only through a reviewed `upstream` merge.

## Status

Migration in progress from the WordPress/Elementor original. Scraped source
material (page inventories, raw HTML, images, style notes) lives in the
gitignored `.mirror-scratch/` directory and is the ground truth for content.

- Migrated: `/en/`, `/es/`, `/en/how-to-signup/`, `/en/privacy-policy/`
- Remaining: the other 20 sitemap pages (see `.mirror-scratch/INDEX.md`), plus
  restoring the temporarily-deferred internal links listed in `upstream.txt`
- Deferred: `/en/elementor-page-675/` is an empty WordPress placeholder and is
  not being migrated

## Customisations from template defaults

- **Collections/CMS:** pages only (no news, no guides, no galleries). Managed
  via `npm run customise-cms`; `cms_config` is saved in `src/_data/site.json`.
- **Languages:** `en` (default) + `es` in `src/_data/languages.json`, page
  pairs in `src/_data/translations.json`. Each locale's content is converted
  from its own scraped page — the two locales are NOT symmetric (different
  footer links, copy, and meta). The es privacy page keeps its distinct slug
  `/es/politica-de-privacidad/`.
- **Locale-aware chrome:** the header menu (`src/_includes/navigation.html`)
  and footer copy (`src/snippets/footer-content-en.md` /
  `footer-content-es.md`, picked by `pageLanguage.code`) differ per locale,
  matching the live site's per-locale footer link rows.
- **Theme:** `src/css/theme.scss` carries the 530a palette (navy `#011E29`,
  cream `#FFFFF5`, mint `#E8FDF7`, sand `#EBECDB`, teal `#007C7C`, amber
  `#FFAE00`), Geologica/Inter self-hosted in `src/css/_fonts.scss` +
  `src/assets/fonts/` (downloaded from Bunny Fonts), navy sticky header with a
  `<details>` "Menu" disclosure, full-bleed mint/sand home columns, navy CTA
  band, and a two-column navy footer. Column arrangements are configured in
  `src/_data/blockLayouts.json` under the `gyr-home` / `gyr-signup` page tags.
- **Config toggles:** breadcrumbs, search, theme switcher, and placeholder
  images off; external links open in a new tab (as on the live site).

## Working on it

- [Site Builder Reference](docs/developer-reference.md), [CLAUDE.md](CLAUDE.md)
- Generated block reference:
  [skills/cfa-static-site-builder/references/blocks.md](skills/cfa-static-site-builder/references/blocks.md);
  live gallery at `/blocks/` was removed with the demo pages — regenerate
  reference material with `npm run generate-references` if needed
- Site data in `src/_data/`, content in `src/pages/`

## Checks

```sh
npm run build        # Eleventy build + Pagefind + internal link check
npm run check:a11y   # axe WCAG 2.2 AA audit of built pages
npm run lint:scss    # stylelint (theme changed? run this too)
```

Node 22 (see `package.json` `engines`); this checkout was built with Node
v22.23.3 at `/tmp/node22/bin`.

## Deployment

Not configured yet. The template's SharedServices and GitHub Pages workflows
are present under `.github/workflows/`; see the [CfA Static deployment
docs](https://github.com/codeforamerica/cfa-static#deployment) before enabling
either.
