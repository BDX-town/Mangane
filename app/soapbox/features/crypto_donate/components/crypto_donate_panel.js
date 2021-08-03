import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import SiteWallet from './site_wallet';
import { List as ImmutableList } from 'immutable';
import classNames from 'classnames';

const mapStateToProps = state => {
  const addresses = state.getIn(['soapbox', 'cryptoAddresses'], ImmutableList());
  return {
    total: addresses.size,
    siteTitle: state.getIn(['instance', 'title']),
  };
};

export default @connect(mapStateToProps)
class CryptoDonatePanel extends ImmutablePureComponent {

  static propTypes = {
    limit: PropTypes.number,
    total: PropTypes.number,
  }

  static defaultProps = {
    limit: 3,
  }

  shouldDisplay = () => {
    const { limit, total } = this.props;
    if (limit === 0 || total === 0) return false;
    return true;
  }

  render() {
    const { limit, total, siteTitle } = this.props;
    const more = total - limit;
    const hasMore = more > 0;

    if (!this.shouldDisplay()) return null;

    return (
      <div className={classNames('wtf-panel funding-panel crypto-donate-panel', { 'crypto-donate-panel--has-more': hasMore })}>
        <div className='wtf-panel-header'>
          <i role='img' alt='bitcoin' className='fa fa-bitcoin wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <span><FormattedMessage id='crypto_donate_panel.heading' defaultMessage='Donate Cryptocurrency' /></span>
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='crypto-donate-panel__message'>
            <FormattedMessage
              id='crypto_donate_panel.intro.message'
              defaultMessage='{siteTitle} accepts cryptocurrency donations to fund our service. Thank you for your support!'
              values={{ siteTitle }}
            />
          </div>
          <SiteWallet limit={limit} />
        </div>
        {hasMore && <Link className='wtf-panel__expand-btn' to='/donate/crypto'>
          <FormattedMessage
            id='crypto_donate_panel.actions.more'
            defaultMessage='Click to see {count} more {count, plural, one {wallet} other {wallets}}'
            values={{ count: more }}
          />
        </Link>}
      </div>
    );
  }

}
