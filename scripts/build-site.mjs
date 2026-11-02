import { access, copyFile, mkdir, readFile, rm } from "node:fs/promises";

const files = ["index.html", "styles.css", "main.js", "favicon.svg", "robots.txt", "sitemap.xml"];
for (const file of files) await access(file);

const html = await readFile("index.html", "utf8");
for (const expected of ["id=\"main\"", "id=\"workflow\"", "id=\"details\"", "id=\"local-first\"", "id=\"releases\""]) {
  if (!html.includes(expected)) throw new Error(`Required site content is missing: ${expected}`);
}
const script = await readFile("main.js", "utf8");
for (const [, key] of html.matchAll(/data-copy="([^"]+)"/g)) {
  if (!new RegExp(`\\b${key}:`).test(script)) throw new Error(`Missing bilingual copy for: ${key}`);
}

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const file of files) await copyFile(file, `dist/${file}`);
console.log(`Built static ShotDesk site (${files.length} files).`);
