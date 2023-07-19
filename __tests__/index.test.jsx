import { render, screen } from '@testing-library/react';

import Homepage from '../src/pages/index';


describe ('Homepage', () => {
  it ('renders a get-in-touch link', () => {
    render(<Homepage />);

    const message = screen.getByRole('link', { name: /get in touch/i });
    expect(message).toBeInTheDocument();
  });

  it ('renders a link to active tournaments', () => {
    render(<Homepage />);

    const message = screen.getByRole('link', { name: /current tournaments/i });
    expect(message).toBeInTheDocument();
  });

  it ('renders a logo image', () => {
    render(<Homepage />);

    const image = screen.getByAltText(/tournio logo/i);
    expect(image).toBeInTheDocument();
  });

  it ('renders a demo screenshot', () => {
    render(<Homepage />);

    const image = screen.getByAltText(/demo tournament sample image/i);
    expect(image).toBeInTheDocument();
  });

  it ('has a Flexible Registration section', () => {
    render(<Homepage/>);

    const section = screen.getByText(/flexible registration/i);
    expect(section).toBeInTheDocument();
  });

  it ('has a Powerful Administration section', () => {
    render(<Homepage/>);

    const section = screen.getByText(/powerful administration/i);
    expect(section).toBeInTheDocument();
  });

  it ('has an Offer More section', () => {
    render(<Homepage/>);

    const section = screen.getByText(/offer your bowlers more/i);
    expect(section).toBeInTheDocument();
  });
});
