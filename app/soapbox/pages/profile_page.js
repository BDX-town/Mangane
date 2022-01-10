import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Sticky from 'react-stickynode';
import Helmet from 'soapbox/components/helmet';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  WhoToFollowPanel,
  SignUpPanel,
  ProfileInfoPanel,
  ProfileMediaPanel,
} from 'soapbox/features/ui/util/async-components';
import { findAccountByUsername } from 'soapbox/selectors';
import { getAcct } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';
import { displayFqn } from 'soapbox/utils/state';
import HeaderContainer from '../features/account_timeline/containers/header_container';
import LinkFooter from '../features/ui/components/link_footer';
import { makeGetAccount } from '../selectors';

const mapStateToProps = (state, { params, withReplies = false }) => {
  const username = params.username || '';
  const accounts = state.getIn(['accounts']);
  const accountFetchError = ((state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase());
  const getAccount = makeGetAccount();

  let accountId = -1;
  let account = null;
  let accountUsername = username;
  if (accountFetchError) {
    accountId = null;
  } else {
    account = findAccountByUsername(state, username);
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

    return (
      <div className={bg && `page page--customization page--${bg}` || 'page'}>
        {account && <Helmet>
          <title>@{getAcct(account, displayFqn)}</title>
        </Helmet>}

        <div className='page__top'>
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
              <div className='columns-area '>
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
