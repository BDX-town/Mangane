import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import AccountContainer from '../../../containers/account_container';

export default class AccountListPanel extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.node.isRequired,
    accountIds: ImmutablePropTypes.orderedSet.isRequired,
    icon: PropTypes.string.isRequired,
    limit: PropTypes.number,
  };

  static defaultProps = {
    limit: Infinity,
  }

  render() {
    const { title, icon, accountIds, limit, ...props } = this.props;

    if (!accountIds || accountIds.isEmpty()) {
      return null;
    }

    return (
      <div className='wtf-panel'>
        <div className='wtf-panel-header'>
          <Icon id={icon} className='wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            {title}
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='wtf-panel__list'>
            {accountIds.take(limit).map(accountId => (
              <AccountContainer key={accountId} id={accountId} {...props} />
            ))}
          </div>
        </div>
      </div>
    );
  };

};
