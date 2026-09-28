import { onReady } from "#public/utils/on-ready.js";

/**
 * GYR 530a header menu overlay.
 *
 * The menu is a pure <details> disclosure (keyboard operable without JS):
 * the overlay's close toggle is a <summary> inside the panel's navy strip.
 * (It is not a direct child of <details>, so browsers never natively toggle
 * it — the Menu summary remains the no-JS open/close control.) This
 * enhancement adds what native details cannot do: Escape-to-close, the
 * legacy popup's 0.3s fade-out exit before `open` is unset, and focus
 * returned to the Menu button after closing via Esc or the X.
 */

const EXIT_FADE_MS = 300;

export const initGyrMenu = () => {
  for (const details of document.querySelectorAll("details.gyr-menu")) {
    const button = details.querySelector("summary.gyr-menu-button");
    const close = details.querySelector("summary.gyr-menu-close");
    let closing = false;

    const closeMenu = () => {
      if (!details.open || closing) return;
      closing = true;
      details.classList.add("gyr-menu-closing");
      window.setTimeout(() => {
        details.open = false;
        details.classList.remove("gyr-menu-closing");
        closing = false;
        button?.focus();
      }, EXIT_FADE_MS);
    };

    // preventDefault keeps native second-summary toggling from racing the
    // animated close on browsers that support it.
    close?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
    });

    details.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && details.open) closeMenu();
    });
  }
};

onReady(initGyrMenu);
