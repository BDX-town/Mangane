import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { MODAL_OPEN } from 'soapbox/actions/modals';
import rootReducer from 'soapbox/reducers';
import { createComponent, mockStore } from 'soapbox/test_helpers';

import ComposeButton from '../compose-button';

describe('<ComposeButton />', () => {
  it('renders a button element', () => {
    const component = createComponent(<ComposeButton />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('dispatches the MODAL_OPEN action', () => {
    const store = mockStore(rootReducer(ImmutableMap(), {}));
    const component = createComponent(<ComposeButton />, { store });

    expect(store.getActions().length).toEqual(0);
    component.root.findByType('button').props.onClick();
    expect(store.getActions()[0].type).toEqual(MODAL_OPEN);
  });
});
