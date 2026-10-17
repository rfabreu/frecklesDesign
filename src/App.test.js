import { render, screen } from '@testing-library/react';
import App from './App';

test('renders artist header title', () => {
  render(<App />);
  const headerElement = screen.getByText(/CARLA ANTUNES/i);
  expect(headerElement).toBeInTheDocument();
});
