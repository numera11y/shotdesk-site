import { translations } from "./translations.js";

const languageButton = document.querySelector("#languageToggle");
const header = document.querySelector(".site-header");
const menuButton = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#site-nav");
const pathParts = window.location.pathname.split("/").filter(Boolean);
const baseIndex = pathParts[0] === "shotdesk-site" ? 1 : 0;
let locale = pathParts[baseIndex] === "fr" ? "fr-FR" : "en-US";

function applyLocale(nextLocale) {
  locale = nextLocale;
  try {
    localStorage.setItem("shotdesk-site-locale", locale);
  } catch {
    // The language toggle remains usable if browser storage is disabled.
  }
  document.documentElement.lang = locale;
  for (const element of document.querySelectorAll("[data-copy]")) {
    const key = element.dataset.copy;
    if (translations[locale][key]) element.textContent = translations[locale][key];
  }
  if (languageButton) {
    languageButton.textContent = locale === "en-US" ? "FR" : "EN";
    languageButton.setAttribute("aria-label", locale === "en-US" ? "Switch to French" : "Passer en anglais");
  }
}

function setMenuOpen(open) {
  if (!header || !menuButton) return;
  header.classList.toggle("is-menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? (locale === "fr-FR" ? "Fermer la navigation" : "Close navigation") : translations[locale].menuLabel);
  if (open) header.classList.remove("is-hidden");
}

function languagePath(nextLocale) {
  const parts = [...pathParts];
  if (nextLocale === "fr-FR" && parts[baseIndex] !== "fr") parts.splice(baseIndex, 0, "fr");
  if (nextLocale === "en-US" && parts[baseIndex] === "fr") parts.splice(baseIndex, 1);
  const trailingSlash = window.location.pathname.endsWith("/") || parts.length === baseIndex;
  return `/${parts.join("/")}${trailingSlash ? "/" : ""}${window.location.search}${window.location.hash}`;
}

languageButton?.addEventListener("click", () => {
  const nextLocale = locale === "en-US" ? "fr-FR" : "en-US";
  window.location.assign(languagePath(nextLocale));
});
menuButton?.addEventListener("click", () => setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true"));
siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) setMenuOpen(false);
});
document.addEventListener("click", (event) => {
  if (header?.classList.contains("is-menu-open") && event.target instanceof Node && !header.contains(event.target)) setMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("is-menu-open")) {
    setMenuOpen(false);
    menuButton?.focus();
  }
});
applyLocale(locale);

if (header) {
  let previousY = window.scrollY;
  let scheduled = false;
  const revealHeader = () => header.classList.remove("is-hidden");
  header.addEventListener("focusin", revealHeader);
  header.addEventListener("pointerenter", revealHeader);
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      const currentY = window.scrollY;
      if (header.classList.contains("is-menu-open")) {
        revealHeader();
        previousY = currentY;
        scheduled = false;
        return;
      }
      if (currentY < 72 || currentY < previousY - 4) revealHeader();
      else if (currentY > previousY + 4 && !header.contains(document.activeElement)) header.classList.add("is-hidden");
      previousY = currentY;
      scheduled = false;
    });
  }, { passive: true });
}
