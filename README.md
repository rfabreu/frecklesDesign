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

Requires Node.js 20.

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
  components/         Header, Gallery, Follow, Footer (LandingPage is currently unused)
  data/artworks.json  Artwork catalog rendered by the Gallery
public/
  index.html          Meta tags and JSON-LD structured data
  sitemap.xml         Sitemap
  robots.txt          Crawler rules
  llms.txt            Short site summary for LLMs
  llms-full.txt       Full site/artwork description for LLMs
  CNAME               Custom domain (must survive the build)
```

### Keeping artwork data in sync

Artwork facts (titles, mediums, dimensions, sold status, image URLs) are currently duplicated in:

- `src/data/artworks.json`
- the JSON-LD in `public/index.html`
- `public/sitemap.xml`
- `public/llms.txt`
- `public/llms-full.txt`

When an artwork is added, changed, or marked as sold, update all five files in the same PR.

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
  and that `build/` contains `CNAME`, `sitemap.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt`. The `CI` workflow (job `verify`) runs the same checks on PRs to `develop`/`main` and on pushes to `develop`.
- PRs need review before merging.
- Delete branches after they are merged.

## Deployment

Pushing to `main` triggers the `Build and Deploy` GitHub Actions workflow (`.github/workflows/buildDeploy.yaml`), which runs tests, builds, verifies the assets above, and publishes `build/` to the `gh-pages` branch. Do not deploy manually.
