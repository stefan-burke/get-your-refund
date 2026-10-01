import { frozenObject } from "#utils/fp/object.js";

const DEFAULTS = frozenObject({
  sticky_mobile_nav: true,
  horizontal_nav: true,
  collapse_menu: "mobile",
  language_switcher: "footer",
  show_breadcrumbs: false,
  externalLinksTargetBlank: false,
  homepage_footer_markdown: null,
  placeholder_images: true,
  enable_theme_switcher: false,
  timezone: "Europe/London",
  list_item_fields: ["thumbnail", "link", "date", "subtitle"],
  nav_thumbnails: false,
  navigation_content_anchor: false,
  screenshots: {},
  use_visual_editor: false,
  default_image_widths: [240, 480, 900, 1300],
  search_collections: ["news", "pages", "guide-pages", "guide-categories"],
  linkify_urls: true,
  disable_liquid_cache: false,
});

export { DEFAULTS };
