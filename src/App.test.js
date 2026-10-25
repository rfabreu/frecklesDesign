import { render, screen } from '@testing-library/react';
import App from './App';

test('renders artist header title as h1', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(/CARLA ANTUNES/i);
});

test('renders artwork gallery section and articles', () => {
  render(<App />);
  const gallery = screen.getByRole('region', { name: /artwork gallery/i });
  expect(gallery).toBeInTheDocument();

  const articles = screen.getAllByRole('article');
  expect(articles.length).toBe(12);

  const pessoaTitle = screen.getByText(/Fernando Pessoa/i);
  expect(pessoaTitle).toBeInTheDocument();
});
