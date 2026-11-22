import fs from 'fs';
import path from 'path';
import artworks from './data/artworks.json';

const {
  DATA_FILE,
  deriveAlt,
  escapeMarkdown,
  escapeMarkdownKeepingEmphasis,
  escapeXml,
  inchesToCm,
  jsonString,
  parseDimensions,
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
    // schema.org VisualArtwork width/height: QuantitativeValue in inches, with numeric values.
    const [width, height] = art.dimensions.match(/\d+/g).map(Number);
    expect(item.width).toEqual({ '@type': 'QuantitativeValue', value: width, unitCode: 'INH', unitText: 'in' });
    expect(item.height).toEqual({ '@type': 'QuantitativeValue', value: height, unitCode: 'INH', unitText: 'in' });
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

describe('parseDimensions', () => {
  test('parses width and height in inches', () => {
    expect(parseDimensions('36in x 48in')).toEqual({ width: '36', height: '48' });
  });

  test.each(['24 x 30', '24in X 30in', '', '24in x 30in ', undefined, null, 24])(
    'throws a clear error naming the input %p',
    input => {
      expect(() => parseDimensions(input)).toThrow(
        new RegExp(`Invalid dimensions ${JSON.stringify(input) === undefined ? 'undefined' : JSON.stringify(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
      );
    }
  );
});

describe('markdown escaping', () => {
  test('escapes characters that break the structure of the Markdown outputs', () => {
    expect(escapeMarkdown('a | b')).toBe('a \\| b');
    expect(escapeMarkdown('**bold** _it_ `code`')).toBe('\\*\\*bold\\*\\* \\_it\\_ \\`code\\`');
    expect(escapeMarkdown('[x](http://e.com)')).toBe('\\[x\\](http://e.com)');
    expect(escapeMarkdown('<script>alert(1)</script>')).toBe('\\<script>alert(1)\\</script>');
    expect(escapeMarkdown('# heading')).toBe('\\# heading');
    expect(escapeMarkdown('back\\slash')).toBe('back\\\\slash');
  });

  test('leaves ordinary Portuguese and English text untouched', () => {
    const text = "Açores - Ilhéu de Vila Franca (Revolução de 25 de Abril), it's 1974. Peixaria, São João!";
    expect(escapeMarkdown(text)).toBe(text);
  });

  test('keeps balanced emphasis in descriptions but escapes everything else', () => {
    expect(escapeMarkdownKeepingEmphasis('the swallow (*andorinha*) and *saudade* here')).toBe(
      'the swallow (*andorinha*) and *saudade* here'
    );
    expect(escapeMarkdownKeepingEmphasis('2 * 3 and a lone * star')).toBe('2 \\* 3 and a lone \\* star');
    expect(escapeMarkdownKeepingEmphasis('*a|b* <b>x</b> [l](u) `c` _u_')).toBe(
      '*a\\|b* \\<b>x\\</b> \\[l\\](u) \\`c\\` \\_u\\_'
    );
  });

  test('hostile artwork text cannot add structure to llms.txt or llms-full.txt', () => {
    const hostile = { ...sample, title: '# Evil | **x** [link](http://e.com) <img src=x> `c` _u_', description: 'ok *fine* | <b>x</b> [l](u)' };
    const files = renderAll([hostile]);
    const escapedTitle = '\\# Evil \\| \\*\\*x\\*\\* \\[link\\](http://e.com) \\<img src=x> \\`c\\` \\_u\\_';
    expect(files['public/llms.txt']).toContain(`- **${escapedTitle}** | 24in x 30in | Acrylic Painting | Available`);
    expect(files['public/llms-full.txt']).toContain(`### 1. ${escapedTitle}\n`);
    expect(files['public/llms-full.txt']).toContain(`- **Title**: ${escapedTitle}\n`);
    expect(files['public/llms-full.txt']).toContain(
      '- **Description & Symbolism**: ok *fine* \\| \\<b>x\\</b> \\[l\\](u)'
    );
  });
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

  test('rejects multi-line text, which would break the Markdown outputs', () => {
    expect(validate([{ ...sample, description: 'One.\n\n# Two' }]).join('\n')).toMatch(/"description" must be a single line/);
  });

  test.each(['id', 'title', 'caption', 'medium', 'dimensions', 'imageUrl', 'description'])(
    'rejects leading or trailing whitespace in %s, naming the artwork and field',
    field => {
      [` ${sample[field]}`, `${sample[field]} `, `${sample[field]}\t`].forEach(value => {
        const errors = validate([{ ...sample, [field]: value }]).join('\n');
        expect(errors).toMatch(new RegExp(`"${field}" must not have leading or trailing whitespace`));
        expect(errors).toContain('artworks.json[0]');
      });
    }
  );

  test('whitespace errors name the artwork id', () => {
    expect(validate([{ ...sample, title: 'Sample ' }])).toEqual([
      'src/data/artworks.json[0] (sample): "title" must not have leading or trailing whitespace',
    ]);
  });

  test('renderAll refuses invalid data', () => {
    expect(() => renderAll([{ ...sample, id: 'Bad Id' }])).toThrow(/Invalid artwork data/);
  });

  test('artwork text that looks like a placeholder is copied literally', () => {
    const files = renderAll([{ ...sample, caption: 'Uses {{ARTWORK_COUNT}} literally' }]);
    expect(files['public/sitemap.xml']).toContain('Uses {{ARTWORK_COUNT}} literally');
  });
});
