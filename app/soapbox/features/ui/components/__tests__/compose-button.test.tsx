import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { render } from 'soapbox/jest/test-helpers';

import ComposeButton from '../compose-button';

const renderComposeButton = () => {
  render(
    <>
      <Route path='/' exact><ComposeButton /></Route>
      <Route path='/statuses/compose'><span data-testid='compose-route'>Compose route</span></Route>
    </>,
    undefined,
    undefined,
    { initialEntries: ['/'] },
  );
};

describe('<ComposeButton />', () => {
  it('renders a button element', () => {
    renderComposeButton();

    expect(screen.getByRole('button')).toHaveTextContent('Compose');
  });

  it('navigates to the compose route', () => {
    renderComposeButton();

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('compose-route')).toBeInTheDocument();
  });
});
