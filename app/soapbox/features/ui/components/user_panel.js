import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { makeGetAccount } from '../../../selectors';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Avatar from 'soapbox/components/avatar';
import { shortNumberFormat } from 'soapbox/utils/numbers';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';
import StillImage from 'soapbox/components/still_image';
import VerificationBadge from 'soapbox/components/verification_badge';
import { List as ImmutableList } from 'immutable';

class UserPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    displayFqn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    domain: PropTypes.string,
  }

  render() {
    const { account, displayFqn, intl, domain } = this.props;
    if (!account) return null;
    const displayNameHtml = { __html: account.get('display_name_html') };
    const acct = account.get('acct').indexOf('@') === -1 && domain ? `${account.get('acct')}@${domain}` : account.get('acct');
    const verified = account.getIn(['pleroma', 'tags'], ImmutableList()).includes('verified');
    const header = account.get('header');

    return (
      <div className='user-panel'>
        <div className='user-panel__container'>

          <div className='user-panel__header'>
            {header && <StillImage src={account.get('header')} alt='' />}
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
                  {verified && <VerificationBadge />}
                  <small className='user-panel__account__username'>@{getAcct(account, displayFqn)}</small>
                </Link>
              </h1>
            </div>

            <div className='user-panel__stats-block'>

              {account.get('statuses_count') >= 0 && <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}`} title={intl.formatNumber(account.get('statuses_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('statuses_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage className='user-panel-stats-item__label' id='account.posts' defaultMessage='Posts' /></span>
                </Link>
              </div>}

              {account.get('followers_count') >= 0 && <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('followers_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage id='account.followers' defaultMessage='Followers' /></span>
                </Link>
              </div>}

              {account.get('following_count') >= 0 && <div className='user-panel-stats-item'>
                <Link to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
                  <strong className='user-panel-stats-item__value'>{shortNumberFormat(account.get('following_count'))}</strong>
                  <span className='user-panel-stats-item__label'><FormattedMessage className='user-panel-stats-item__label' id='account.follows' defaultMessage='Follows' /></span>
                </Link>
              </div>}

            </div>

          </div>

        </div>
      </div>
    );
  }

}

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    displayFqn: displayFqn(state),
  });

  return mapStateToProps;
};

export default injectIntl(
  connect(makeMapStateToProps, null, null, {
    forwardRef: true,
  })(UserPanel));
