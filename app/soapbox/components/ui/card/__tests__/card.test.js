import React from 'react';

import { createShallowComponent } from 'soapbox/test_helpers';

import { Card, CardBody, CardHeader, CardTitle } from '../card';

describe('<Card />', () => {
  it('renders the CardTitle and CardBody', () => {
    const component = createShallowComponent(
      <Card>
        <CardHeader>
          <CardTitle title='Card Title' />
        </CardHeader>

        <CardBody>
          Card Body
        </CardBody>
      </Card>,
    );

    expect(component.text()).toContain('Card Title');
    expect(component.text()).toContain('Card Body');
    expect(component.text()).not.toContain('Back');
  });

  it('renders the Back Button', () => {
    const component = createShallowComponent(
      <Card>
        <CardHeader backHref='/'>
          <CardTitle title='Card Title' />
        </CardHeader>
      </Card>,
    );

    expect(component.text()).toContain('Back');
  });
});
