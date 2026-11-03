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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
if (hero && !reducedMotion.matches && "IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    hero.classList.toggle("is-ocr-visible", entry.isIntersecting);
  }, { threshold: 0.08 });
  heroObserver.observe(hero);
}

const screenStory = document.querySelector("[data-scroll-story]");
const screenTrack = screenStory?.querySelector(".screen-story-track");
const screenViewport = screenStory?.querySelector(".screen-story-viewport");
const storySlides = [...(screenStory?.querySelectorAll(".screen-slide") || [])];
const storyCurrent = document.querySelector("#screenStoryCurrent");
const storyMeterFill = document.querySelector("#screenStoryMeterFill");
const desktopStory = window.matchMedia("(min-width: 901px)");
let storyEnabled = false;
let storyFrame = 0;
let activeStoryIndex = -1;

function updateScreenStory() {
  storyFrame = 0;
  if (!storyEnabled || !screenStory || !screenTrack || !screenViewport || !storySlides.length) return;
  const travel = Math.max(1, screenStory.offsetHeight - window.innerHeight);
  const distance = Math.min(travel, Math.max(0, -screenStory.getBoundingClientRect().top));
  const position = (distance / travel) * (storySlides.length - 1);
  const nextIndex = Math.min(storySlides.length - 1, Math.round(position));
  screenTrack.style.transform = `translate3d(${-position * screenViewport.clientWidth}px, 0, 0)`;
  screenStory.classList.toggle("is-active", distance > 0 && distance < travel);
  if (storyMeterFill) storyMeterFill.style.transform = `scaleX(${(nextIndex + 1) / storySlides.length})`;
  if (nextIndex !== activeStoryIndex) {
    activeStoryIndex = nextIndex;
    if (storyCurrent) storyCurrent.textContent = String(nextIndex + 1).padStart(2, "0");
    storySlides.forEach((slide, index) => slide.classList.toggle("is-current", index === nextIndex));
  }
}

function configureScreenStory() {
  if (!screenStory || !screenTrack || !storySlides.length) return;
  storyEnabled = desktopStory.matches && !reducedMotion.matches;
  document.documentElement.classList.toggle("has-scroll-story", storyEnabled);
  if (!storyEnabled) {
    screenStory.classList.remove("is-active");
    screenTrack.style.removeProperty("transform");
    storySlides.forEach((slide) => slide.classList.remove("is-current"));
    activeStoryIndex = -1;
    return;
  }
  updateScreenStory();
}

if (screenStory && screenTrack && storySlides.length) {
  window.addEventListener("scroll", () => {
    if (!storyEnabled || storyFrame) return;
    storyFrame = window.requestAnimationFrame(updateScreenStory);
  }, { passive: true });
  window.addEventListener("resize", configureScreenStory, { passive: true });
  desktopStory.addEventListener("change", configureScreenStory);
  reducedMotion.addEventListener("change", configureScreenStory);
  configureScreenStory();
}
