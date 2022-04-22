import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Icon from 'soapbox/components/icon';

import { fetchPinnedAccounts } from '../../../actions/accounts';
import AccountContainer from '../../../containers/account_container';

class PinnedAccountsPanel extends ImmutablePureComponent {

  static propTypes = {
    pinned: ImmutablePropTypes.list.isRequired,
    fetchPinned: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchPinned();
  }

  render() {
    const { account } = this.props;
    const pinned = this.props.pinned.slice(0, this.props.limit);

    if (pinned.isEmpty()) {
      return null;
    }

    return (
      <div className='wtf-panel'>
        <div className='wtf-panel-header'>
          <Icon src={require('@tabler/icons/icons/users.svg')} className='wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <FormattedMessage
              id='pinned_accounts.title'
              defaultMessage='{name}’s choices'
              values={{
                name: <span className='display-name__html' dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} />,
              }}
            />
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='wtf-panel__list'>
            {pinned && pinned.map(suggestion => (
              <AccountContainer
                key={suggestion}
                id={suggestion}
                withRelationship={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, { account }) => ({
  pinned: state.getIn(['user_lists', 'pinned', account.get('id'), 'items'], ImmutableList()),
});

const mapDispatchToProps = (dispatch, { account }) => {
  return {
    fetchPinned: () => dispatch(fetchPinnedAccounts(account.get('id'))),
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  },
  )(PinnedAccountsPanel));
