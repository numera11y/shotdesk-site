# ShotDesk website

The bilingual static product site for ShotDesk, maintained separately from the desktop application and deployed with GitHub Pages.

## Local preview

Requires Node.js 22 or newer and Python 3 for the simple local server:

```sh
npm run build
python -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. The site has no analytics, cookies, third-party fonts, or runtime dependencies.

## Publishing

Push to `main` to run the GitHub Pages workflow. The site has its own SemVer history, separate from the desktop app; see `RELEASING.md`. The page links to the desktop repository and its GitHub Releases page.

Do not publish user screenshots or captures. The technical pipeline illustration is synthetic and labeled as an example.
