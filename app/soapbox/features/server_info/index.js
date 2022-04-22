import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Column from '../ui/components/column';
import LinkFooter from '../ui/components/link_footer';
import PromoPanel from '../ui/components/promo_panel';

const messages = defineMessages({
  heading: { id: 'column.info', defaultMessage: 'Server information' },
});

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
@injectIntl
class ServerInfo extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl, instance } = this.props;

    return (
      <Column icon='info' heading={intl.formatMessage(messages.heading)}>
        <div className='info_column_area'>
          <div className='info__brand'>
            <div className='brand'>
              <h1>{instance.get('title')}</h1>
            </div>
            <div className='brand__tagline'>
              <span>{instance.get('description')}</span>
            </div>
          </div>
          <PromoPanel />
          <LinkFooter />
        </div>
      </Column>
    );
  }

}
