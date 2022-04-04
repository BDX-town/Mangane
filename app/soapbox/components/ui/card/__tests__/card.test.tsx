import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import { Card, CardBody, CardHeader, CardTitle } from '../card';

describe('<Card />', () => {
  it('renders the CardTitle and CardBody', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle title='Card Title' />
        </CardHeader>

        <CardBody>
          Card Body
        </CardBody>
      </Card>,
    );

    expect(screen.getByTestId('card-title')).toHaveTextContent('Card Title');
    expect(screen.getByTestId('card-body')).toHaveTextContent('Card Body');
    expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
  });

  it('renders the Back Button', () => {
    render(
      <Card>
        <CardHeader backHref='/'>
          <CardTitle title='Card Title' />
        </CardHeader>
      </Card>,
    );

    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });
});
