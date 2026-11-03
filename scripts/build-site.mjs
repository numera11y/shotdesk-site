import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { translations } from "../translations.js";

const siteUrl = "https://numera11y.github.io/shotdesk-site";
const repositoryUrl = "https://github.com/numera11y/shotdesk";
const locales = ["en-US", "fr-FR"];
const pages = [
  { slug: "", source: "index.html", key: "home" },
  { slug: "download", source: "pages/download.html", key: "download" },
  { slug: "changelog", source: "pages/changelog.html", key: "changelog" },
];

for (const file of ["index.html", "styles.css", "site-pages.css", "main.js", "translations.js", "favicon.svg", "robots.txt", "assets/shotdesk-library.png", ...pages.slice(1).map((page) => page.source)]) {
  await access(file);
}

async function fetchReleases() {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "ShotDesk-Site-Build" };
  const token = process.env.SHOTDESK_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch("https://api.github.com/repos/numera11y/shotdesk/releases?per_page=30", { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Could not sync ShotDesk releases from GitHub (${response.status} ${response.statusText}).`);
  const releases = await response.json();
  if (!Array.isArray(releases)) throw new Error("GitHub returned an invalid release list.");
  return releases.filter((release) => !release.draft && release.published_at).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function markdownNotes(markdown = "") {
  const lines = markdown.replace(/\\n/g, "\n").replace(/\r/g, "").split("\n");
  const output = [];
  let list = false;
  const closeList = () => {
    if (list) output.push("</ul>");
    list = false;
  };
  const inline = (text) => escapeHtml(text).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_match, label, url) => `<a href="${url}" rel="nofollow">${label}</a>`).replace(/`([^`]+)`/g, "<code>$1</code>");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { closeList(); continue; }
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      closeList();
      output.push(`<h3>${inline(heading[1])}</h3>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!list) output.push("<ul>");
      list = true;
      output.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else {
      closeList();
      output.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return output.join("\n");
}

function latestRelease(releases) {
  return releases.find((release) => (release.assets || []).length > 0) || releases[0] || null;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function renderDownloads(releases, locale) {
  const copy = translations[locale];
  const release = latestRelease(releases);
  if (!release) return `<p class="empty-release">${copy.downloadNoAssets}</p>`;
  const groups = [
    { extension: ".exe", title: copy.downloadWindows, description: "NSIS · Windows x64", action: copy.downloadInstaller },
    { extension: ".msi", title: copy.downloadWindows, description: "MSI · Windows x64", action: copy.downloadInstaller },
    { extension: ".deb", title: copy.downloadLinuxDeb, description: copy.downloadNotes, action: copy.downloadPackage },
    { extension: ".rpm", title: copy.downloadLinuxRpm, description: copy.downloadNotes, action: copy.downloadPackage },
  ];
  const rows = groups.flatMap((group) => {
    const asset = release.assets.find((item) => item.name.toLowerCase().endsWith(group.extension));
    if (!asset) return [];
    const digest = asset.digest?.replace(/^sha256:/, "");
    return [`<article class="download-row"><div><h2>${group.title}</h2><p>${group.description}</p><span class="download-size">${escapeHtml(asset.name)} · ${formatBytes(asset.size)}</span>${digest ? `<div class="download-hash">${copy.downloadHash}: ${escapeHtml(digest)}</div>` : ""}</div><a class="button button-primary download-link" href="${escapeHtml(asset.browser_download_url)}" download>${group.action} <span aria-hidden="true">↓</span></a></article>`];
  });
  return rows.length ? rows.join("\n") : `<p class="empty-release">${copy.downloadNoAssets}</p>`;
}

function renderChangelog(releases, locale) {
  const copy = translations[locale];
  if (!releases.length) return `<p class="empty-release">${copy.changelogNoReleases}</p>`;
  return releases.map((release) => {
    const date = new Date(release.published_at);
    const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
    const notes = markdownNotes(release.body || "");
    const assets = (release.assets || []).map((asset) => `<a class="release-asset" href="${escapeHtml(asset.browser_download_url)}">${escapeHtml(asset.name)} <span aria-hidden="true">↓</span></a>`).join("");
    return `<article class="release-entry"><header class="release-entry-header"><h2>${escapeHtml(release.name || release.tag_name)}<span class="version-chip">${escapeHtml(release.tag_name)}</span></h2><time datetime="${escapeHtml(date.toISOString())}">${formattedDate}</time></header><div class="release-notes">${notes || `<p>${copy.changelogNoReleases}</p>`}</div>${assets ? `<h3 class="release-assets-title">${copy.releaseAssets}</h3><div class="release-assets">${assets}</div>` : ""}<a class="release-source-link" href="${escapeHtml(release.html_url)}">${copy.releaseOriginalNotes} ↗</a></article>`;
  }).join("\n");
}

function structuredData(pageKey, locale, canonical, release) {
  const copy = translations[locale];
  if (pageKey === "home") {
    const faqKeys = [["faqOneQ", "faqOneA"], ["faqTwoQ", "faqTwoA"], ["faqThreeQ", "faqThreeA"], ["faqFourQ", "faqFourA"]];
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          name: "ShotDesk",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Windows x64, Linux x86_64",
          description: copy.homeDescription,
          inLanguage: locale,
          url: canonical,
          downloadUrl: `${siteUrl}/${locale === "fr-FR" ? "fr/" : ""}download/`,
          license: `${repositoryUrl}/blob/main/LICENSE`,
          softwareVersion: release?.tag_name || "0.1.0",
          publisher: { "@type": "Organization", name: "ShotDesk", url: repositoryUrl },
        },
        {
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: faqKeys.map(([question, answer]) => ({ "@type": "Question", name: copy[question], acceptedAnswer: { "@type": "Answer", text: copy[answer] } })),
        },
      ],
    };
  }
  return { "@context": "https://schema.org", "@type": "WebPage", name: copy[pageKey === "download" ? "downloadTitle" : "changelogTitle"], description: copy[`${pageKey}Description`], inLanguage: locale, url: canonical, isPartOf: { "@type": "WebSite", name: "ShotDesk", url: siteUrl } };
}

function localize(html, locale) {
  const copy = translations[locale];
  const keys = [...html.matchAll(/data-copy="([^"]+)"/g)].map((match) => match[1]);
  for (const key of keys) if (!(key in copy)) throw new Error(`Missing ${locale} website translation for: ${key}`);
  return html.replace(/<([a-z][a-z0-9]*)\b([^>]*\bdata-copy="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/gi, (_match, tag, attributes, key) => `<${tag}${attributes}>${escapeHtml(copy[key])}</${tag}>`)
    .replace(/data-copy-alt="([^"]+)"/g, (_match, key) => `alt="${escapeHtml(copy[key])}"`)
    .replace(/data-aria-label-copy="([^"]+)"/g, (_match, key) => `aria-label="${escapeHtml(copy[key])}"`)
    .replace('<html lang="en-US">', `<html lang="${locale}">`);
}

function replaceTokens(html, tokens) {
  return html.replace(/\{\{([A-Z_]+)\}\}/g, (_match, token) => {
    if (!(token in tokens)) throw new Error(`Missing website build value for: ${token}`);
    return tokens[token];
  });
}

const releases = await fetchReleases();
const currentRelease = latestRelease(releases);
const homeTemplate = await readFile("index.html", "utf8");
const pageTemplates = Object.fromEntries(await Promise.all(pages.slice(1).map(async (page) => [page.key, await readFile(page.source, "utf8")])));
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const file of ["styles.css", "site-pages.css", "main.js", "translations.js", "favicon.svg", "robots.txt"]) await cp(file, `dist/${file}`);
await cp("assets", "dist/assets", { recursive: true });

const sitemapEntries = [];
const generatedPages = [];
for (const locale of locales) {
  for (const page of pages) {
    const isFrench = locale === "fr-FR";
    const urlPath = `${isFrench ? "/fr/" : "/"}${page.slug ? `${page.slug}/` : ""}`;
    const canonical = `${siteUrl}${urlPath}`;
    const enUrl = `${siteUrl}/${page.slug ? `${page.slug}/` : ""}`;
    const frUrl = `${siteUrl}/fr/${page.slug ? `${page.slug}/` : ""}`;
    const relativeRoot = "../".repeat((isFrench ? 1 : 0) + (page.slug ? 1 : 0)) || "./";
    const sourceRoot = page.key === "home" ? "./" : "../";
    let html = page.key === "home" ? homeTemplate : pageTemplates[page.key];
    html = localize(html, locale);
    for (const asset of ["favicon.svg", "styles.css", "site-pages.css", "main.js", ...(page.key === "home" ? ["assets/shotdesk-library.png"] : [])]) {
      for (const attribute of ["href", "src"]) html = html.replaceAll(`${attribute}="${sourceRoot}${asset}"`, `${attribute}="${relativeRoot}${asset}"`);
    }
    if (page.key === "download") html = html.replace("<!-- GENERATED_DOWNLOAD_CONTENT -->", renderDownloads(releases, locale));
    if (page.key === "changelog") html = html.replace("<!-- GENERATED_CHANGELOG_CONTENT -->", renderChangelog(releases, locale));
    html = replaceTokens(html, {
      LOCAL_ROOT: `${relativeRoot}${isFrench ? "fr/" : ""}`,
      NAV_LABEL: locale === "fr-FR" ? "Navigation principale" : "Main navigation",
      LANGUAGE_LABEL: locale === "fr-FR" ? "Passer en anglais" : "Switch to French",
      LANGUAGE_CODE: locale === "fr-FR" ? "EN" : "FR",
      MENU_LABEL: translations[locale].menuLabel,
      CANONICAL: canonical,
      EN_URL: enUrl,
      FR_URL: frUrl,
      META_DESCRIPTION: escapeHtml(translations[locale][`${page.key}Description`]),
      PAGE_TITLE: escapeHtml(translations[locale][`${page.key}Title`]),
      JSON_LD: JSON.stringify(structuredData(page.key, locale, canonical, currentRelease)),
    });
    if (currentRelease?.tag_name) html = html.replaceAll("class=\"dynamic-version\">0.1.0", `class="dynamic-version">${escapeHtml(currentRelease.tag_name)}`);
    const outputPath = `${isFrench ? "dist/fr" : "dist"}${page.slug ? `/${page.slug}` : ""}/index.html`;
    await mkdir(outputPath.slice(0, outputPath.lastIndexOf("/")), { recursive: true });
    await writeFile(outputPath, html);
    generatedPages.push({ outputPath, canonical });
    sitemapEntries.push(`  <url><loc>${canonical}</loc><xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/><xhtml:link rel="alternate" hreflang="fr" href="${frUrl}"/><xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/></url>`);
  }
}

for (const { outputPath, canonical } of generatedPages) {
  const html = await readFile(outputPath, "utf8");
  if (/\{\{[A-Z_]+\}\}|GENERATED_(?:DOWNLOAD|CHANGELOG)_CONTENT/.test(html)) throw new Error(`Unresolved site template marker in ${outputPath}`);
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) throw new Error(`Missing canonical URL in ${outputPath}`);
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!schema) throw new Error(`Missing structured data in ${outputPath}`);
  JSON.parse(schema);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) throw new Error(`Image without alt text in ${outputPath}`);
  for (const [, link] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (!link || link.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(link)) continue;
    const resolved = new URL(link, canonical);
    const sitePath = new URL(siteUrl).pathname.replace(/\/$/, "");
    if (resolved.origin !== new URL(siteUrl).origin || !resolved.pathname.startsWith(`${sitePath}/`)) continue;
    const relativePath = decodeURIComponent(resolved.pathname.slice(sitePath.length + 1));
    const filePath = join("dist", relativePath, ...(resolved.pathname.endsWith("/") || !relativePath.includes(".") ? ["index.html"] : []));
    try {
      await access(filePath);
    } catch {
      throw new Error(`Broken internal link in ${outputPath}: ${link} -> ${filePath}`);
    }
  }
}

await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join("\n")}\n</urlset>\n`);
await writeFile("dist/llms.txt", `# ShotDesk\n\n> ${translations["en-US"].homeDescription}\n\nShotDesk is a local-first screenshot library for Windows and Linux. It indexes folders chosen by the user and supports search by filename, folder, recognized text, and dominant colors. Screenshots and OCR results stay on the user's device; OCR models are downloaded on demand and then run locally.\n\n## Product pages\n- [Overview](${siteUrl}/)\n- [Download](${siteUrl}/download/)\n- [Changelog](${siteUrl}/changelog/)\n- [French overview](${siteUrl}/fr/)\n- [French download page](${siteUrl}/fr/download/)\n- [French changelog](${siteUrl}/fr/changelog/)\n\n## Source and releases\n- [GitHub repository](${repositoryUrl})\n- [Published releases](${repositoryUrl}/releases)\n- [Testing checklist](${repositoryUrl}/blob/main/TESTING.md)\n- [License](${repositoryUrl}/blob/main/LICENSE)\n`);
console.log(`Built bilingual ShotDesk site with ${releases.length} published GitHub releases.`);
