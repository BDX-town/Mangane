import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Helmet from 'soapbox/components/helmet';
import HeaderContainer from '../features/account_timeline/containers/header_container';
import WhoToFollowPanel from '../features/ui/components/who_to_follow_panel';
import LinkFooter from '../features/ui/components/link_footer';
import SignUpPanel from '../features/ui/components/sign_up_panel';
import ProfileInfoPanel from '../features/ui/components/profile_info_panel';
import ProfileMediaPanel from '../features/ui/components/profile_media_panel';
import { acctFull } from 'soapbox/utils/accounts';
import { getFeatures } from 'soapbox/utils/features';
import { makeGetAccount } from '../selectors';
import { debounce } from 'lodash';

const mapStateToProps = (state, { params: { username }, withReplies = false }) => {
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

  return {
    account: accountId ? getAccount(state, accountId) : account,
    accountId,
    accountUsername,
    features: getFeatures(state.get('instance')),
  };
};

export default @connect(mapStateToProps)
class ProfilePage extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    accountUsername: PropTypes.string.isRequired,
    features: PropTypes.object,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 1200),
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = debounce(() => {
    this.setState({ isSmallScreen: (window.innerWidth <= 1200) });
  }, 5, {
    trailing: true,
  });

  render() {
    const { children, accountId, account, accountUsername, features } = this.props;
    const bg = account ? account.getIn(['customizations', 'background']) : undefined;
    const { isSmallScreen } = this.state;

    return (
      <div className={bg && `page page--customization page--${bg}` || 'page'}>
        {account && <Helmet>
          <title>@{acctFull(account)}</title>
        </Helmet>}

        <div className='page__top'>
          <HeaderContainer accountId={accountId} username={accountUsername} />
        </div>

        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                <ProfileInfoPanel username={accountUsername} account={account} />
                {isSmallScreen && account && <ProfileMediaPanel account={account} />}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                <SignUpPanel />
                {features.suggestions && <WhoToFollowPanel />}
                {account && <ProfileMediaPanel account={account} />}
                <LinkFooter />
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }

}
