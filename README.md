# ShotDesk website

The bilingual static product site for ShotDesk, maintained separately from the desktop application and deployed with GitHub Pages. It includes the product overview, platform downloads, and a changelog generated from published GitHub Releases.

## Local preview

Requires Node.js 22 or newer and Python 3 for the simple local server:

```sh
npm run build
python -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. The build reads published releases from the ShotDesk GitHub API so package links, checksums, versions, and original release notes stay current. Add a concise, customer-facing summary for each new app version to `friendlyReleaseNotes` in `translations.js`; the technical notes remain available in the collapsed details. A `GITHUB_TOKEN` is optional for local builds and provided by GitHub Actions on deploy. The site has no analytics, cookies, third-party fonts, or runtime dependencies.

## Publishing

Push to `main` to run the GitHub Pages workflow. It also runs hourly to refresh release information when the app repository publishes a new version. English and French pages are generated as crawlable static pages with canonical/hreflang metadata, a sitemap, structured data, and `llms.txt`.

Do not publish user screenshots or captures. The three `assets/shotdesk-*.png` files show real application screens populated with synthetic demonstration data; the separate technical pipeline illustration is also synthetic and labeled as an example.
