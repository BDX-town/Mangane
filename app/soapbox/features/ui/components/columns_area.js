import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl } from 'react-intl';

import { Layout } from '../../../components/ui';

export default @(component => injectIntl(component, { withRef: true }))
class ColumnsArea extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    children: PropTypes.node,
    layout: PropTypes.object,
  };

  render() {
    const { children } = this.props;
    const layout = this.props.layout || { LEFT: null, RIGHT: null };

    return (
      <Layout>
        <Layout.Sidebar>
          {layout.LEFT}
        </Layout.Sidebar>

        <Layout.Main>
          {children}
        </Layout.Main>

        <Layout.Aside>
          {layout.RIGHT}
        </Layout.Aside>
      </Layout>
    );
  }

}
