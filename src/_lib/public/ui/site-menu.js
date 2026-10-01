import { onReady } from "#public/utils/on-ready.js";

/**
 * Collapsible site menu: the WAI-ARIA disclosure pattern on the header nav.
 *
 * navigation.html renders the toggle and close buttons `hidden` and the menu
 * expanded, so without JavaScript the navigation is simply there. This reveals
 * the buttons and marks the nav `data-menu="closed"`; the stylesheet collapses
 * the menu only for a nav carrying that attribute, and only where the site's
 * `collapse_menu` setting asks for it.
 *
 * Closing returns focus to the toggle when the menu was closed from inside
 * it (Escape or the close button). Moving focus out of the open menu closes
 * it too, so a menu drawn over the page never leaves keyboard focus hidden
 * behind it (WCAG 2.4.11).
 */

onReady(() => {
  for (const nav of document.querySelectorAll("nav.site-nav")) {
    const toggle = nav.querySelector(".menu-toggle");
    if (!toggle) continue;
    const close = nav.querySelector(".menu-close");
    const isOpen = () => nav.getAttribute("data-menu") === "open";
    /** @param {boolean} open */
    const setOpen = (open) => {
      nav.setAttribute("data-menu", open ? "open" : "closed");
      toggle.setAttribute("aria-expanded", String(open));
      document.documentElement.toggleAttribute("data-menu-open", open);
    };
    const closeAndRefocus = () => {
      setOpen(false);
      if (toggle instanceof HTMLElement) toggle.focus();
    };

    toggle.removeAttribute("hidden");
    close?.removeAttribute("hidden");
    setOpen(false);
    toggle.addEventListener("click", () => setOpen(!isOpen()));
    close?.addEventListener("click", closeAndRefocus);
    nav.addEventListener("keydown", (event) => {
      const isEscape = event instanceof KeyboardEvent && event.key === "Escape";
      if (isEscape && isOpen()) closeAndRefocus();
    });
    nav.addEventListener("focusout", (event) => {
      const next = event instanceof FocusEvent ? event.relatedTarget : null;
      if (isOpen() && next instanceof Node && !nav.contains(next))
        setOpen(false);
    });
  }
});
