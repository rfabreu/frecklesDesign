# Freckles Design

Portfolio website for artist **Carla Antunes** (Freckles Design): a gallery of original acrylic paintings, with contact and commission information.

Live site: <https://frecklesdesign.ca>

## Tech stack

- React 18 (Create React App / `react-scripts`)
- MDB React UI Kit (`mdb-react-ui-kit`) and Bootstrap CSS
- FontAwesome 6
- `react-modal` for the artwork viewer
- Images hosted on Cloudinary
- Hosted on GitHub Pages (custom domain via `public/CNAME`)

## Local development

Use Node.js 20 (the version CI uses; it is not enforced by `package.json`).

```bash
npm ci                         # install dependencies from the lockfile
npm start                      # dev server at http://localhost:3000
npm test -- --watchAll=false   # run unit tests once
npm run build                  # production build into build/
```

## Project structure

```
src/
  App.js              Page composition: Header, Gallery, Follow, Footer
  components/         Header, Gallery, Follow, Footer
  data/artworks.json  Artwork catalog: the single source of truth for artwork facts
scripts/
  generate-artwork-files.js  Generates the artwork parts of public/ from artworks.json
  templates/                 Hand-written templates for the generated public/ files
public/
  index.html          Meta tags and JSON-LD structured data (generated)
  sitemap.xml         Sitemap (generated)
  robots.txt          Crawler rules
  llms.txt            Short site summary for LLMs (generated)
  llms-full.txt       Full site/artwork description for LLMs (generated)
  CNAME               Custom domain (must survive the build)
```

### Keeping artwork data in sync

`src/data/artworks.json` is the only place artwork facts are edited. Each entry has these fields:

| Field | Edited by hand? | Meaning |
|---|---|---|
| `id` | yes | URL-safe slug (`a-z`, `0-9`, `-`), unique |
| `title` | yes | Title as shown in the gallery |
| `caption` | yes | Identifying phrase with its English gloss, e.g. `Fernando Pessoa, poeta português (Portuguese Poet)` |
| `medium` | yes | Must be a key of `MEDIA` in `scripts/generate-artwork-files.js` (currently `Acrylic Painting`) |
| `dimensions` | yes | Width x height in inches, exactly like `36in x 48in` |
| `sold` | yes | `true` once the piece is in a private collection |
| `imageUrl` | yes | Cloudinary `https://` URL |
| `alt` | **no, generated** | Derived from `caption` + `dimensions` + `sold` |
| `description` | yes | Description and symbolism prose used in `llms-full.txt` |

**Edit `caption`, never `alt`.** `alt` is derived from `caption`, `dimensions` and `sold`, so a hand-edited `alt` is overwritten by `npm run generate` and fails the staleness check until it is regenerated.

Text rules enforced by the validator: string fields must be single-line with no leading or trailing whitespace, and `imageUrl` may not contain spaces or any of ``< > | ` "``. In `llms.txt` / `llms-full.txt`, `title` and `description` are Markdown-escaped (``\ ` * _ [ ] < |``), so write plain text there; the one exception is balanced `*emphasis*` in `description` (e.g. `(*andorinha*)`), which is kept.

`npm run generate` (`scripts/generate-artwork-files.js`, plain Node) validates `artworks.json` and regenerates from it:

- the `alt` field of each entry in `src/data/artworks.json`
- the JSON-LD `ItemList` in `public/index.html`
- the image entries in `public/sitemap.xml`
- the "Artwork Portfolio" list in `public/llms.txt`
- the "Complete Artwork Catalog" in `public/llms-full.txt`

Everything else in those four `public/` files (meta tags, artist bio, themes prose, sitemap `lastmod`, purchasing text) comes from the matching file in `scripts/templates/`. Edit the template, not the file in `public/`. Prose that mentions artworks by name (the `llms.txt` themes, the meta keywords, the Open Graph image) is not generated, so check it by hand when you add or rename a piece.

`npm start` and `npm run build` run the generator first (`prestart`/`prebuild`). `prestart` runs only once, when the dev server starts, so if you edit `artworks.json` while `npm start` is running, run `npm run generate` again to refresh `alt` and the `public/` files. The generated files are committed, so a PR shows the real effect of a data change. When you add, change, or sell an artwork:

1. Edit `src/data/artworks.json` (and a template, if the change touches prose).
2. Run `npm run generate` (or just `npm start`).
3. If the catalog changed, bump `<lastmod>` in `scripts/templates/sitemap.xml` (it is not derived, so the output stays reproducible).
4. Commit `artworks.json` together with the regenerated `public/` files.

`npm test` (and therefore CI) fails if any generated file differs from what `artworks.json` and the templates produce; `npm run generate:check` runs the same check without writing anything. `npm test` deliberately does not regenerate first.

Artworks are price on request, so the JSON-LD `Offer` for each piece carries only `availability` (`InStock`/`SoldOut`) and `url`, with no `price` or `priceCurrency`.

## Contributing workflow

- Never commit directly to `main` or `gh-pages`.
- Work on `feature/*`, `fix/*`, or `chore/*` branches and open a PR to `develop`. `develop` is then merged into `main`.
- Use [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `ci:`).
- Before opening a PR, make sure this passes:
  ```bash
  npm ci
  npm test -- --watchAll=false
  npm run build
  ```
  CI sets `CI=true`, so ESLint warnings fail the build there; use `CI=true npm run build` locally to match. Also check that `build/` contains `CNAME`, `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt`. The `CI` workflow (job `verify`) runs the same checks on PRs to `develop`/`main` and on pushes to `develop`.
- PRs need review before merging.
- Delete branches after they are merged.

## Deployment

Pushing to `main` triggers the `Build and Deploy` GitHub Actions workflow (`.github/workflows/buildDeploy.yaml`), which runs tests, builds, verifies the assets above, and publishes `build/` to the `gh-pages` branch. Do not deploy manually.
