import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { autoPlayGif } from '../../../initial_state';
import { makeGetAccount } from '../../../selectors';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'gabsocial/components/avatar';
import { shortNumberFormat } from 'gabsocial/utils/numbers';
import { acctFull } from 'gabsocial/utils/accounts';

class UserPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    domain: PropTypes.string,
  }

  render() {
    const { account, intl, domain } = this.props;
    if (!account) return null;
    const displayNameHtml = { __html: account.get('display_name_html') };
    const acct = account.get('acct').indexOf('@') === -1 && domain ? `${account.get('acct')}@${domain}` : account.get('acct');

    return (
      <div className='user-panel'>
        <div className='user-panel__container'>

          <div className='user-panel__header'>
            <img src={autoPlayGif ? account.get('header') : account.get('header_static')} alt='' />
          </div>

          <div className='user-panel__profile'>
            <Link to={`/@${account.get('acct')}`} title={acct}>
              <Avatar account={account} />
            </Link>
          </div>

          <div className='user-panel__meta'>

            <div className='user-panel__account'>
              <h1>
                <Link to={`/@${account.get('acct')}`}>
                  <span className='user-panel__account__name' dangerouslySetInnerHTML={displayNameHtml} />
                  <small className='user-panel__account__username'>@{acctFull(account)}</small>
                </Link>
              </h1>
            </div>

            <div className='user-panel__stats-block'>

              <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('statuses_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage className='user-panel-stats-item__label' id='account.posts' defaultMessage='Posts' /></span>
                </Link>
              </div>

              <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('followers_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage id='account.followers' defaultMessage='Followers' /></span>
                </Link>
              </div>

              <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('following_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage className='user-panel-stats-item__label' id='account.follows' defaultMessage='Follows' /></span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

};


const mapStateToProps = state => {
  const me = state.get('me');
  const getAccount = makeGetAccount();

  return {
    account: getAccount(state, me),
  };
};

export default injectIntl(
  connect(mapStateToProps, null, null, {
    forwardRef: true,
  }
  )(UserPanel));
