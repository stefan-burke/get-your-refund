import { afterEach, describe, expect, test, vi } from "vitest";
import { initGyrMenu } from "#public/ui/gyr-menu.js";

const MENU_HTML = `
<details class="gyr-menu">
  <summary class="gyr-menu-button">Menu</summary>
  <nav class="gyr-menu-panel" aria-label="Menu">
    <div class="gyr-menu-strip">
      <summary class="gyr-menu-close" aria-label="Close menu">
        <svg aria-hidden="true"></svg>
      </summary>
    </div>
    <ul><li><a href="/en/">Home</a></li></ul>
  </nav>
</details>
`;

const openMenu = () => {
  document.body.innerHTML = MENU_HTML;
  const details = document.querySelector("details.gyr-menu");
  details.open = true;
  initGyrMenu();
  return details;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("gyr-menu overlay enhancement", () => {
  test("close toggle fades the overlay out, then unsets open", () => {
    vi.useFakeTimers();
    const details = openMenu();
    document.querySelector("summary.gyr-menu-close").click();
    expect(details.open).toBe(true);
    expect(details.classList.contains("gyr-menu-closing")).toBe(true);
    vi.advanceTimersByTime(300);
    expect(details.open).toBe(false);
    expect(details.classList.contains("gyr-menu-closing")).toBe(false);
  });

  test("Escape closes an open menu and refocuses the Menu button", () => {
    vi.useFakeTimers();
    const details = openMenu();
    const button = document.querySelector("summary.gyr-menu-button");
    const focusSpy = vi.spyOn(button, "focus");
    details.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    vi.advanceTimersByTime(300);
    expect(details.open).toBe(false);
    expect(focusSpy).toHaveBeenCalled();
  });

  test("Escape does nothing while the menu is closed", () => {
    document.body.innerHTML = MENU_HTML;
    const details = document.querySelector("details.gyr-menu");
    initGyrMenu();
    details.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(details.open).toBe(false);
  });

  test("a second close request while closing is ignored", () => {
    vi.useFakeTimers();
    const details = openMenu();
    document.querySelector("summary.gyr-menu-close").click();
    document.querySelector("summary.gyr-menu-close").click();
    vi.advanceTimersByTime(300);
    expect(details.open).toBe(false);
    expect(details.classList.contains("gyr-menu-closing")).toBe(false);
  });
});
