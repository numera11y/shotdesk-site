# Website releases

The website uses independent SemVer tags from the desktop app. The current source version is `0.1.0`; no public website release has been tagged.

1. Update `package.json` and `CHANGELOG.md`.
2. Run `npm run build` and inspect the English/French copy, relative asset paths, and release links.
3. Commit the change and push an annotated `v<version>` tag if a website source milestone needs a release record.
4. Push to `main` to deploy the static site through GitHub Pages after CI succeeds.

A site tag records the website source only; it does not imply that the desktop application has a release.
