import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Layout } from '../components/ui';

export default class DefaultPage extends ImmutablePureComponent {

  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Layout.Sidebar />

        <Layout.Main>
          {children}
        </Layout.Main>

        <Layout.Aside />
      </Layout>
    );
  }

}
