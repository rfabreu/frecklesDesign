import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders artist header title as h1', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(/CARLA ANTUNES/i);
});

test('renders artwork gallery section and all 12 articles by default', () => {
  render(<App />);
  const gallery = screen.getByRole('region', { name: /artwork gallery/i });
  expect(gallery).toBeInTheDocument();

  const articles = screen.getAllByRole('article');
  expect(articles.length).toBe(12);

  const pessoaTitle = screen.getByText(/Fernando Pessoa/i);
  expect(pessoaTitle).toBeInTheDocument();
});

test('filters artworks by acquisition status', () => {
  render(<App />);

  // Initial state: 12 artworks
  expect(screen.getAllByRole('article').length).toBe(12);

  // Filter to Available only (8 available)
  const availableTab = screen.getByRole('tab', { name: /Available for Acquisition/i });
  fireEvent.click(availableTab);
  expect(screen.getAllByRole('article').length).toBe(8);

  // Filter to Sold only (4 sold)
  const soldTab = screen.getByRole('tab', { name: /Private Collection/i });
  fireEvent.click(soldTab);
  expect(screen.getAllByRole('article').length).toBe(4);

  // Return to All (12 total)
  const allTab = screen.getByRole('tab', { name: /All Works/i });
  fireEvent.click(allTab);
  expect(screen.getAllByRole('article').length).toBe(12);
});

test('opens enhanced lightbox with details and inquiry CTA on image click', () => {
  render(<App />);

  // Click on the first image (Fernando Pessoa)
  const firstImage = screen.getByAltText(/Fernando Pessoa/i);
  fireEvent.click(firstImage);

  // Check that the lightbox modal is opened and shows counter, title, and inquiry link
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(/1 \/ 12/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Inquire to Acquire This Piece/i })).toBeInTheDocument();

  // Navigate to next artwork using the Next button
  const nextBtn = screen.getByRole('button', { name: /Next artwork/i });
  fireEvent.click(nextBtn);
  expect(screen.getByText(/2 \/ 12/i)).toBeInTheDocument();

  // Close lightbox
  const closeBtn = screen.getByRole('button', { name: /Close full artwork view/i });
  fireEvent.click(closeBtn);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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
