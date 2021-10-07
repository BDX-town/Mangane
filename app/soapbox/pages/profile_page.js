import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Sticky from 'react-stickynode';
import Helmet from 'soapbox/components/helmet';
import HeaderContainer from '../features/account_timeline/containers/header_container';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  SignUpPanel,
  ProfileInfoPanel,
  ProfileMediaPanel,
} from 'soapbox/features/ui/util/async-components';
import LinkFooter from '../features/ui/components/link_footer';
import { getAcct } from 'soapbox/utils/accounts';
import { displayFqn } from 'soapbox/utils/state';
import { getFeatures } from 'soapbox/utils/features';
import { makeGetAccount } from '../selectors';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';


const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const accounts = state.getIn(['accounts']);
  const accountFetchError = (state.getIn(['accounts', -1, 'username'], '').toLowerCase() === username.toLowerCase());
  const getAccount = makeGetAccount();

  let accountId = -1;
  let account = null;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    account = accounts.find(acct => username.toLowerCase() === acct.getIn(['acct'], '').toLowerCase());
    accountId = account ? account.getIn(['id'], null) : -1;
    accountUsername = account ? account.getIn(['acct'], '') : '';
  }

  //Children components fetch information

  let realAccount;
  if (!account) {
    const maybeAccount = accounts.get(username);
    if (maybeAccount) {
      realAccount = maybeAccount;
    }
  }

  return {
    account: accountId ? getAccount(state, accountId) : account,
    accountId,
    accountUsername,
    features: getFeatures(state.get('instance')),
    realAccount,
    displayFqn: displayFqn(state),
  };
};

export default @connect(mapStateToProps)
class ProfilePage extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    accountUsername: PropTypes.string.isRequired,
    displayFqn: PropTypes.bool,
    features: PropTypes.object,
  };

  render() {
    const { children, accountId, account, displayFqn, accountUsername, features, realAccount } = this.props;
    const bg = account ? account.getIn(['customizations', 'background']) : undefined;

    if (realAccount) {
      return <Redirect to={`/@${realAccount.get('acct')}`} />;
    }

    let headerMissing;
    const header = account ? account.get('header', '') : undefined;

    if (header) {
      headerMissing = !header || ['/images/banner.png', '/headers/original/missing.png'].some(path => header.endsWith(path)) || !account.getIn(['pleroma', 'is_active'], true);
    }

    return (
      <div className={bg && `page page--customization page--${bg}` || 'page'}>
        {account && <Helmet>
          <title>@{getAcct(account, displayFqn)}</title>
        </Helmet>}

        <div className={classNames('page__top', { 'page__top__no-header': headerMissing })}>
          <HeaderContainer accountId={accountId} username={accountUsername} />
        </div>

        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <Sticky top={149}>
                  <BundleContainer fetchComponent={ProfileInfoPanel}>
                    {Component => <Component username={accountUsername} account={account} />}
                  </BundleContainer>
                </Sticky>
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                <Sticky top={149}>
                  <BundleContainer fetchComponent={SignUpPanel}>
                    {Component => <Component />}
                  </BundleContainer>
                  {account && (
                    <BundleContainer fetchComponent={ProfileMediaPanel}>
                      {Component => <Component account={account} />}
                    </BundleContainer>
                  )}
                  {features.suggestions && (
                    <BundleContainer fetchComponent={WhoToFollowPanel}>
                      {Component => <Component />}
                    </BundleContainer>
                  )}
                  <LinkFooter />
                </Sticky>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }

}
