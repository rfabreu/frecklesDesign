import fs from 'fs';
import path from 'path';
import artworks from './data/artworks.json';

const {
  DATA_FILE,
  deriveAlt,
  escapeXml,
  inchesToCm,
  jsonString,
  readArtworks,
  readIfExists,
  renderAll,
  validate,
} = require('../scripts/generate-artwork-files');

const sample = {
  id: 'sample',
  title: 'Sample',
  caption: 'Sample (Example)',
  medium: 'Acrylic Painting',
  dimensions: '24in x 30in',
  sold: false,
  imageUrl: 'https://example.com/sample.png',
  alt: '',
  description: 'A sample artwork.',
};

describe('generated artwork files', () => {
  const files = renderAll(readArtworks());

  test.each(Object.keys(files))('%s is up to date with src/data/artworks.json', file => {
    const actual = readIfExists(file);
    if (actual !== files[file]) {
      throw new Error(`${file} is stale or was edited by hand. Run \`npm run generate\` and commit the result.`);
    }
  });

  test('covers the data file and every public artifact', () => {
    expect(Object.keys(files).sort()).toEqual(
      [DATA_FILE, 'public/index.html', 'public/llms-full.txt', 'public/llms.txt', 'public/sitemap.xml'].sort()
    );
  });
});

test('JSON-LD in public/index.html mirrors artworks.json', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const itemList = jsonLd['@graph'].find(node => node['@type'] === 'ItemList');
  const items = itemList.itemListElement.map(entry => entry.item);

  expect(items.length).toBe(artworks.length);
  artworks.forEach((art, index) => {
    const item = items[index];
    expect(item['@id']).toBe(`https://frecklesdesign.ca/#artwork-${art.id}`);
    expect(item.name).toBe(art.title);
    expect(item.image).toBe(art.imageUrl);
    expect(item.description).toBe(art.alt);
    // Artworks are price on request: an Offer carries availability only, never a currency without a price.
    expect(item.offers['@type']).toBe('Offer');
    expect(item.offers).not.toHaveProperty('price');
    expect(item.offers).not.toHaveProperty('priceCurrency');
    expect(item.offers).not.toHaveProperty('priceSpecification');
  });
});

describe('deriveAlt', () => {
  test('describes an available artwork', () => {
    expect(deriveAlt(sample)).toBe(
      'Sample (Example). Acrylic technique, dimensions = 24in X 30in. Available for sale.'
    );
  });

  test('describes a sold artwork', () => {
    expect(deriveAlt({ ...sample, sold: true })).toBe(
      'Sample (Example). Acrylic technique, dimensions = 24in X 30in. Private Collection / Sold.'
    );
  });

  test('every artwork in artworks.json carries its derived alt text', () => {
    artworks.forEach(art => expect(art.alt).toBe(deriveAlt(art)));
  });
});

test('inchesToCm rounds to one decimal place', () => {
  expect(inchesToCm('24')).toBe('61.0cm');
  expect(inchesToCm('30')).toBe('76.2cm');
  expect(inchesToCm('36')).toBe('91.4cm');
  expect(inchesToCm('48')).toBe('121.9cm');
});

test('escapers keep markup out of XML and inline JSON-LD', () => {
  expect(escapeXml(`Tom & Jerry <"Lisboa's">`)).toBe('Tom &amp; Jerry &lt;&quot;Lisboa&apos;s&quot;&gt;');
  expect(jsonString('</script>')).toBe('"\\u003c/script>"');
});

describe('validate', () => {
  test('accepts the real catalog', () => {
    expect(validate(artworks)).toEqual([]);
  });

  test('rejects malformed dimensions', () => {
    expect(validate([{ ...sample, dimensions: '24 x 30' }]).join('\n')).toMatch(/dimensions/);
  });

  test('rejects unknown fields', () => {
    expect(validate([{ ...sample, price: 100 }]).join('\n')).toMatch(/unknown field "price"/);
  });

  test('rejects duplicate ids', () => {
    expect(validate([sample, { ...sample }]).join('\n')).toMatch(/duplicate id "sample"/);
  });

  test('rejects unknown media and non-boolean sold', () => {
    const errors = validate([{ ...sample, medium: 'Oil Painting', sold: 'yes' }]).join('\n');
    expect(errors).toMatch(/unknown medium "Oil Painting"/);
    expect(errors).toMatch(/"sold" must be true or false/);
  });

  test('renderAll refuses invalid data', () => {
    expect(() => renderAll([{ ...sample, id: 'Bad Id' }])).toThrow(/Invalid artwork data/);
  });
});
