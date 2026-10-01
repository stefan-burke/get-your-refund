/**
 * Site configuration types
 *
 * Types for site-wide configuration after defaults are applied.
 */

/**
 * Screenshot configuration (optional feature)
 */
export type ScreenshotConfig = {
  enabled?: boolean;
  autoCapture?: boolean;
  collections?: string[];
  pages?: string[];
  outputDir?: string;
  port?: number;
  viewport?: string;
  timeout?: number;
  limit?: number;
};

/**
 * Site configuration after defaults are applied.
 * Values with defaults in DEFAULTS are guaranteed non-null.
 */
export type SiteConfig = {
  // Guaranteed by DEFAULTS (never null after config loading)
  sticky_mobile_nav: boolean;
  horizontal_nav: boolean;
  collapse_menu: "mobile" | "always" | "never";
  language_switcher: "footer" | "header";
  show_breadcrumbs: boolean;
  externalLinksTargetBlank: boolean;
  placeholder_images: boolean;
  enable_theme_switcher: boolean;
  timezone: string;
  list_item_fields: string[];
  navigation_content_anchor: boolean;
  nav_thumbnails: boolean;
  use_visual_editor: boolean;
  default_image_widths: number[];
  search_collections: string[];
  linkify_urls: boolean;
  disable_liquid_cache: boolean;

  // Guaranteed by DEFAULTS ({} when unset; pickNonNull strips null overrides)
  screenshots: ScreenshotConfig;

  // Optional (may be null)
  homepage_footer_markdown: string | null;

  // Optional, no default: set per-site in config.json to enable phone
  // linkification (digit count of a phone number to match)
  phoneNumberLength?: number;

  // Derived (computed from other config values)
  internal_link_suffix: string;
};

/**
 * Site info from site.json
 */
export type SiteInfo = {
  url: string;
  name: string;
  description: string;
  logo?: string;
  socials?: Record<string, string>;
};
