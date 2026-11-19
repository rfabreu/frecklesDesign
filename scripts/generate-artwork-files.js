#!/usr/bin/env node
// Generates every file that repeats artwork facts from src/data/artworks.json,
// the single source of truth:
//   - the derived `alt` field (and canonical formatting) of src/data/artworks.json
//   - public/index.html     (JSON-LD ItemList)  from scripts/templates/index.html
//   - public/sitemap.xml    (image entries)     from scripts/templates/sitemap.xml
//   - public/llms.txt       (portfolio list)    from scripts/templates/llms.txt
//   - public/llms-full.txt  (artwork catalog)   from scripts/templates/llms-full.txt
//
// Usage:
//   node scripts/generate-artwork-files.js           write files whose content changed
//   node scripts/generate-artwork-files.js --check   write nothing; exit 1 if any file is stale
//
// Runs automatically before `npm start` and `npm run build`. Plain Node, no dependencies.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_FILE = 'src/data/artworks.json';
const TEMPLATE_DIR = 'scripts/templates';
const SITE_URL = 'https://frecklesdesign.ca/';

// Field order of each record in artworks.json. `alt` is derived; the rest are hand-edited.
const FIELDS = ['id', 'title', 'caption', 'medium', 'dimensions', 'sold', 'imageUrl', 'alt', 'description'];

// Wording used for each `medium` value across the generated files.
const MEDIA = {
  'Acrylic Painting': { technique: 'Acrylic technique', artMedium: 'Acrylic on Canvas' },
};

const DIMENSIONS_RE = /^(\d+)in x (\d+)in$/;

function parseDimensions(dimensions) {
  const match = DIMENSIONS_RE.exec(dimensions);
  return { width: match[1], height: match[2] };
}

function inchesToCm(inches) {
  return `${(Number(inches) * 2.54).toFixed(1)}cm`;
}

function deriveAlt(art) {
  const { width, height } = parseDimensions(art.dimensions);
  const status = art.sold ? 'Private Collection / Sold.' : 'Available for sale.';
  return `${art.caption}. ${MEDIA[art.medium].technique}, dimensions = ${width}in X ${height}in. ${status}`;
}

function validate(artworks) {
  const errors = [];
  if (!Array.isArray(artworks) || artworks.length === 0) {
    return [`${DATA_FILE} must be a non-empty array`];
  }
  const seen = new Set();
  artworks.forEach((art, index) => {
    const where = `${DATA_FILE}[${index}]${art && art.id ? ` (${art.id})` : ''}`;
    if (!art || typeof art !== 'object' || Array.isArray(art)) {
      errors.push(`${where}: must be an object`);
      return;
    }
    Object.keys(art)
      .filter(key => !FIELDS.includes(key))
      .forEach(key => errors.push(`${where}: unknown field "${key}"`));
    FIELDS.filter(key => key !== 'sold' && key !== 'alt').forEach(key => {
      if (typeof art[key] !== 'string' || art[key].trim() === '') {
        errors.push(`${where}: "${key}" must be a non-empty string`);
      }
    });
    if (typeof art.sold !== 'boolean') errors.push(`${where}: "sold" must be true or false`);
    if (art.alt !== undefined && typeof art.alt !== 'string') errors.push(`${where}: "alt" must be a string`);
    if (typeof art.id === 'string') {
      if (!/^[a-z0-9-]+$/.test(art.id)) errors.push(`${where}: "id" may only contain a-z, 0-9 and "-"`);
      if (seen.has(art.id)) errors.push(`${where}: duplicate id "${art.id}"`);
      seen.add(art.id);
    }
    if (typeof art.dimensions === 'string' && !DIMENSIONS_RE.test(art.dimensions)) {
      errors.push(`${where}: "dimensions" must look like "36in x 48in"`);
    }
    if (typeof art.medium === 'string' && !MEDIA[art.medium]) {
      errors.push(`${where}: unknown medium "${art.medium}" (add it to MEDIA in scripts/generate-artwork-files.js)`);
    }
    if (typeof art.imageUrl === 'string' && !art.imageUrl.startsWith('https://')) {
      errors.push(`${where}: "imageUrl" must start with https://`);
    }
  });
  return errors;
}

// JSON string literal that is also safe inside an HTML <script> element.
function jsonString(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderTemplate(name, values) {
  let output = fs.readFileSync(path.join(ROOT, TEMPLATE_DIR, name), 'utf8');
  Object.entries(values).forEach(([key, value]) => {
    const token = `{{${key}}}`;
    const parts = output.split(token);
    if (parts.length !== 2) {
      throw new Error(`${TEMPLATE_DIR}/${name}: expected ${token} exactly once, found ${parts.length - 1}`);
    }
    output = parts.join(value);
  });
  const leftover = output.match(/\{\{[A-Z_]+\}\}/);
  if (leftover) throw new Error(`${TEMPLATE_DIR}/${name}: unknown placeholder ${leftover[0]}`);
  return output;
}

function renderJsonLdItem(art, index) {
  const { width, height } = parseDimensions(art.dimensions);
  const availability = art.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock';
  return [
    '            {',
    '              "@type": "ListItem",',
    `              "position": ${index + 1},`,
    '              "item": {',
    '                "@type": "VisualArtwork",',
    `                "@id": ${jsonString(`${SITE_URL}#artwork-${art.id}`)},`,
    `                "name": ${jsonString(art.title)},`,
    `                "artMedium": ${jsonString(MEDIA[art.medium].artMedium)},`,
    '                "artform": "Painting",',
    `                "width": { "@type": "Distance", "name": ${jsonString(`${width} inches`)} },`,
    `                "height": { "@type": "Distance", "name": ${jsonString(`${height} inches`)} },`,
    `                "image": ${jsonString(art.imageUrl)},`,
    `                "description": ${jsonString(art.alt)},`,
    `                "creator": { "@id": ${jsonString(`${SITE_URL}#artist`)} },`,
    '                "offers": {',
    '                  "@type": "Offer",',
    `                  "availability": ${jsonString(availability)},`,
    `                  "url": ${jsonString(SITE_URL)}`,
    '                }',
    '              }',
    '            }',
  ].join('\n');
}

function renderSitemapImage(art) {
  return [
    '    <image:image>',
    `      <image:loc>${escapeXml(art.imageUrl)}</image:loc>`,
    `      <image:title>${escapeXml(`${art.title} - Original ${art.medium} by Carla Antunes`)}</image:title>`,
    `      <image:caption>${escapeXml(`${art.caption}. ${MEDIA[art.medium].technique}, ${art.dimensions}.`)}</image:caption>`,
    '    </image:image>',
  ].join('\n');
}

function renderLlmsListItem(art) {
  return `- **${art.title}** | ${art.dimensions} | ${art.medium} | ${art.sold ? 'SOLD' : 'Available'}`;
}

function renderLlmsFullEntry(art, index) {
  const { width, height } = parseDimensions(art.dimensions);
  return [
    `### ${index + 1}. ${art.title}`,
    `- **ID**: ${art.id}`,
    `- **Title**: ${art.title}`,
    `- **Medium**: ${MEDIA[art.medium].artMedium}`,
    `- **Dimensions**: ${art.dimensions} (${inchesToCm(width)} x ${inchesToCm(height)})`,
    `- **Status**: ${art.sold ? 'SOLD (Private Collection)' : 'Available for purchase'}`,
    `- **Image URL**: ${art.imageUrl}`,
    `- **Description & Symbolism**: ${art.description}`,
  ].join('\n');
}

// Returns { 'repo/relative/path': expectedContent } for every generated file.
// Throws if the artwork data is invalid.
function renderAll(rawArtworks) {
  const errors = validate(rawArtworks);
  if (errors.length > 0) {
    throw new Error(`Invalid artwork data:\n  - ${errors.join('\n  - ')}`);
  }
  const artworks = rawArtworks.map(raw => {
    const art = { ...raw, alt: deriveAlt(raw) };
    return Object.fromEntries(FIELDS.map(key => [key, art[key]]));
  });

  return {
    [DATA_FILE]: `${JSON.stringify(artworks, null, 2)}\n`,
    'public/index.html': renderTemplate('index.html', {
      ARTWORK_COUNT: String(artworks.length),
      ARTWORK_JSONLD_ITEMS: artworks.map(renderJsonLdItem).join(',\n'),
    }),
    'public/sitemap.xml': renderTemplate('sitemap.xml', {
      ARTWORK_SITEMAP_IMAGES: artworks.map(renderSitemapImage).join('\n'),
    }),
    'public/llms.txt': renderTemplate('llms.txt', {
      ARTWORK_PORTFOLIO_LIST: artworks.map(renderLlmsListItem).join('\n'),
    }),
    'public/llms-full.txt': renderTemplate('llms-full.txt', {
      ARTWORK_CATALOG: artworks.map(renderLlmsFullEntry).join('\n\n'),
    }),
  };
}

function readArtworks() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, DATA_FILE), 'utf8'));
}

function readIfExists(file) {
  try {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function main(argv) {
  const check = argv.includes('--check');
  const files = renderAll(readArtworks());
  const stale = Object.keys(files).filter(file => readIfExists(file) !== files[file]);

  if (check) {
    if (stale.length > 0) {
      console.error(`Stale generated files (run \`npm run generate\` and commit the result):\n  ${stale.join('\n  ')}`);
      return 1;
    }
    console.log('Generated artwork files are up to date.');
    return 0;
  }

  stale.forEach(file => fs.writeFileSync(path.join(ROOT, file), files[file]));
  console.log(stale.length > 0 ? `Updated: ${stale.join(', ')}` : 'Generated artwork files are up to date.');
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  DATA_FILE,
  deriveAlt,
  escapeXml,
  inchesToCm,
  jsonString,
  readArtworks,
  readIfExists,
  renderAll,
  validate,
};
