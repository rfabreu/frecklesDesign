import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import artworks from './data/artworks.json';

const total = artworks.length;
const availableTotal = artworks.filter(a => !a.sold).length;
const soldTotal = artworks.filter(a => a.sold).length;

const normalizeDimensions = (text) => text.toLowerCase().replace(/\s+/g, '');

test('renders artist header title as h1', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(/CARLA ANTUNES/i);
});

test('renders artwork gallery section and all artwork articles by default', () => {
  render(<App />);
  const gallery = screen.getByRole('region', { name: /artwork gallery/i });
  expect(gallery).toBeInTheDocument();

  const articles = screen.getAllByRole('article');
  expect(articles.length).toBe(total);

  const pessoaTitle = screen.getByText(/Fernando Pessoa/i);
  expect(pessoaTitle).toBeInTheDocument();
});

test('filters artworks by acquisition status', () => {
  render(<App />);

  expect(screen.getAllByRole('article').length).toBe(total);

  const availableTab = screen.getByRole('tab', { name: /Available for Acquisition/i });
  fireEvent.click(availableTab);
  expect(screen.getAllByRole('article').length).toBe(availableTotal);

  const soldTab = screen.getByRole('tab', { name: /Private Collection/i });
  fireEvent.click(soldTab);
  expect(screen.getAllByRole('article').length).toBe(soldTotal);

  const allTab = screen.getByRole('tab', { name: /All Works/i });
  fireEvent.click(allTab);
  expect(screen.getAllByRole('article').length).toBe(total);
});

test('opens enhanced lightbox with details and inquiry CTA on thumbnail click', () => {
  render(<App />);

  // Open the first artwork (Fernando Pessoa) from its thumbnail button
  const firstThumb = screen.getByRole('button', { name: 'View Fernando Pessoa in full screen' });
  fireEvent.click(firstThumb);

  // Check that the lightbox modal is opened and shows counter, title, and inquiry link
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Inquire to Acquire This Piece/i })).toBeInTheDocument();

  // Navigate to next artwork using the Next button
  const nextBtn = screen.getByRole('button', { name: /Next artwork/i });
  fireEvent.click(nextBtn);
  expect(screen.getByText(`2 / ${total}`)).toBeInTheDocument();

  // Close lightbox
  const closeBtn = screen.getByRole('button', { name: /Close full artwork view/i });
  fireEvent.click(closeBtn);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('gallery thumbnails are native buttons that wrap the image and expose its alt text as description', () => {
  render(<App />);

  artworks.forEach(art => {
    const thumb = screen.getByRole('button', { name: `View ${art.title} in full screen` });
    expect(thumb.tagName).toBe('BUTTON');
    expect(thumb).toHaveAttribute('type', 'button');
    expect(thumb).toHaveAccessibleDescription(art.alt);
    expect(within(thumb).getByRole('img')).toHaveAttribute('alt', art.alt);
  });
});

test('lightbox closes on Escape and advances on ArrowRight', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'View Fernando Pessoa in full screen' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByText(`2 / ${total}`)).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('artwork alt text agrees with sold status and dimensions in artworks.json', () => {
  artworks.forEach(art => {
    const suffix = art.sold ? 'Private Collection / Sold.' : 'Available for sale.';
    const wrongSuffix = art.sold ? 'Available for sale.' : 'Private Collection / Sold.';
    expect(art.alt.endsWith(suffix)).toBe(true);
    expect(art.alt.endsWith(wrongSuffix)).toBe(false);

    expect(normalizeDimensions(art.alt)).toContain(normalizeDimensions(art.dimensions));
  });
});

test('JSON-LD in public/index.html agrees with artworks.json', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const itemList = jsonLd['@graph'].find(node => node['@type'] === 'ItemList');
  const items = itemList.itemListElement.map(entry => entry.item);

  expect(itemList.numberOfItems).toBe(total);
  expect(items.length).toBe(total);

  artworks.forEach(art => {
    const item = items.find(i => i['@id'].endsWith(`#artwork-${art.id}`));
    expect(item).toBeDefined();

    const [width, height] = art.dimensions.match(/\d+/g);
    expect(item.width.name).toBe(`${width} inches`);
    expect(item.height.name).toBe(`${height} inches`);
    expect(item.offers.availability).toBe(
      art.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'
    );
    expect(normalizeDimensions(item.description)).toContain(normalizeDimensions(art.dimensions));
    expect(item.description.endsWith(art.sold ? 'Private Collection / Sold.' : 'Available for sale.')).toBe(true);
  });
});

test('renders artist tagline and connect section with action links', () => {
  render(<App />);

  // Tagline check
  expect(screen.getByText(/Portuguese Heritage/i)).toBeInTheDocument();

  // Connect section check
  const connectSection = screen.getByRole('region', { name: /Connect with Carla Antunes/i });
  expect(connectSection).toBeInTheDocument();

  expect(screen.getByRole('link', { name: /Email Carla Antunes/i })).toHaveAttribute(
    'href',
    expect.stringContaining('mailto:carla@frecklesdesign.ca')
  );
  expect(screen.getByRole('link', { name: /Follow @_freckles_design on Instagram/i })).toHaveAttribute(
    'href',
    'https://instagram.com/_freckles_design'
  );
  expect(screen.getByRole('link', { name: /View Carla Antunes on Linktree/i })).toHaveAttribute(
    'href',
    'https://linktr.ee/carla_antunes'
  );
});

test('footer social links have accessible names', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'Carla Antunes on Instagram' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/carlacaetano.antunes/'
  );
  expect(screen.getByRole('link', { name: 'Carla Antunes on LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/carlacaetano/'
  );
  expect(screen.getByRole('link', { name: 'Carla Antunes on Behance' })).toHaveAttribute(
    'href',
    'https://www.behance.net/eutenhosardas'
  );
});
