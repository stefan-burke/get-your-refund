/**
 * Centralized configuration validation.
 *
 * All validation runs at module load time. Errors are collected from every
 * validator before throwing so users see every problem at once rather than
 * discovering them one build failure at a time.
 *
 * Exports validated values for use by other modules.
 */
import config from "#data/config.json" with { type: "json" };
import languages from "#data/languages.json" with { type: "json" };
import site from "#data/site.json" with { type: "json" };
import { baseLanguageErrors, languageFieldErrors } from "#utils/i18n.js";

const PLACEHOLDER_SITE_NAMES = ["change me", "example site", "your site name"];
const PLACEHOLDER_HOSTS = ["example.com", "example.org", "example.net"];

/** @param {unknown} value */
const isBlank = (value) =>
  typeof value !== "string" || value.trim().length === 0;

/** @type {Array<(url: string, label: string) => string[]>} */
const RAW_URL_ERROR_COLLECTORS = [
  (url, label) =>
    url.trim() === url
      ? []
      : [`${label} must not have leading or trailing whitespace: ${url}`],
  (url, label) =>
    url.endsWith("/") ? [`${label} must not end with a slash: ${url}`] : [],
];

/** @type {Array<(url: URL, label: string) => string[]>} */
const PARSED_URL_ERROR_COLLECTORS = [
  (url, label) =>
    ["http:", "https:"].includes(url.protocol)
      ? []
      : [`${label} must use http or https protocol, got: ${url.href}`],
  (url, label) =>
    url.search || url.hash
      ? [`${label} must not include a query string or fragment: ${url.href}`]
      : [],
  (url, label) => {
    const hostname = url.hostname.toLowerCase();
    const isPlaceholder =
      hostname.endsWith(".example") ||
      PLACEHOLDER_HOSTS.some(
        (placeholder) =>
          hostname === placeholder || hostname.endsWith(`.${placeholder}`),
      );
    return isPlaceholder
      ? [`${label} uses a placeholder hostname: ${url.href}`]
      : [];
  },
];

/**
 * @param {unknown} value
 * @param {string} label
 * @param {string} missingError
 */
const getSiteUrlErrors = (value, label, missingError) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [missingError];
  }
  const rawErrors = RAW_URL_ERROR_COLLECTORS.flatMap((collectErrors) =>
    collectErrors(value, label),
  );
  if (!URL.canParse(value)) {
    return [...rawErrors, `${label} is not a valid URL: ${value}`];
  }

  const parsedUrl = new URL(value);
  return [
    ...rawErrors,
    ...PARSED_URL_ERROR_COLLECTORS.flatMap((collectErrors) =>
      collectErrors(parsedUrl, label),
    ),
  ];
};

const siteUrlErrors = getSiteUrlErrors(
  site.url,
  "site.json 'url'",
  "site.json is missing the 'url' field",
);

const deploymentSiteUrlErrors =
  process.env.SITE_URL === undefined
    ? []
    : getSiteUrlErrors(
        process.env.SITE_URL,
        "SITE_URL",
        "SITE_URL must be a non-empty URL",
      );

const siteNameErrors = isBlank(site.name)
  ? ["site.json is missing the 'name' field"]
  : PLACEHOLDER_SITE_NAMES.includes(site.name.trim().toLowerCase())
    ? [`site.json 'name' is still a placeholder: ${site.name}`]
    : [];

const siteDescriptionErrors = isBlank(site.description)
  ? ["site.json is missing the 'description' field"]
  : [];

/**
 * config.json settings that take one of a fixed set of values (null keeps
 * the default).
 * @type {Record<string, string[]>}
 */
const CONFIG_CHOICES = {
  collapse_menu: ["mobile", "always", "never"],
  language_switcher: ["footer", "header"],
};

const configChoiceErrors = Object.entries(config)
  .filter(
    ([key, value]) =>
      key in CONFIG_CHOICES &&
      value !== null &&
      !CONFIG_CHOICES[key].includes(`${value}`),
  )
  .map(
    ([key, value]) =>
      `config.json '${key}' must be one of ${CONFIG_CHOICES[key].join(", ")}, got: ${value}`,
  );

const errors = [
  ...baseLanguageErrors(languages),
  ...languageFieldErrors(languages),
  ...siteNameErrors,
  ...siteDescriptionErrors,
  ...siteUrlErrors,
  ...deploymentSiteUrlErrors,
  ...configChoiceErrors,
];

if (errors.length > 0) {
  const heading =
    errors.length === 1
      ? "Configuration error:"
      : `Configuration errors (${errors.length}):`;
  const body = errors.map((msg, i) => `  ${i + 1}. ${msg}`).join("\n");
  throw new Error(`${heading}\n${body}`);
}

// SITE_URL lets a deployment (e.g. the SharedServices workflow) override
// the canonical origin without editing site.json. Both values are validated
// so every build fails at the configuration boundary on a bad public URL.
export const siteUrl =
  process.env.SITE_URL === undefined ? site.url : process.env.SITE_URL;
