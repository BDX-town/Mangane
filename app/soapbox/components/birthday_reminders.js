
import PropTypes from 'prop-types';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchBirthdayReminders } from 'soapbox/actions/accounts';
import { openModal } from 'soapbox/actions/modals';
import Icon from 'soapbox/components/icon';
import { HStack, Text } from 'soapbox/components/ui';
import { makeGetAccount } from 'soapbox/selectors';

const mapStateToProps = (state, props) => {
  const me = state.get('me');
  const getAccount = makeGetAccount();

  const birthdays = state.getIn(['user_lists', 'birthday_reminders', me]);

  if (birthdays?.size > 0) {
    return {
      birthdays,
      account: getAccount(state, birthdays.first()),
    };
  }

  return {
    birthdays,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class BirthdayReminders extends ImmutablePureComponent {

  static propTypes = {
    birthdays: ImmutablePropTypes.orderedSet,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;

    dispatch(fetchBirthdayReminders(day, month));
  }

  getHandlers() {
    return {
      open: this.handleOpenBirthdaysModal,
      moveDown: this.props.onMoveDown,
    };
  }

  handleOpenBirthdaysModal = () => {
    const { dispatch } = this.props;

    dispatch(openModal('BIRTHDAYS'));
  }

  renderMessage() {
    const { birthdays, account } = this.props;

    const link = (
      <bdi>
        <Link
          className='text-gray-800 dark:text-gray-200 font-bold hover:underline'
          title={account.get('acct')}
          to={`/@${account.get('acct')}`}
          dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
        />
      </bdi>
    );

    if (birthdays.size === 1) {
      return <FormattedMessage id='notification.birthday' defaultMessage='{name} has a birthday today' values={{ name: link }} />;
    }

    return (
      <FormattedMessage
        id='notification.birthday_plural'
        defaultMessage='{name} and {more} have birthday today'
        values={{
          name: link,
          more: (
            <span type='button' role='presentation' onClick={this.handleOpenBirthdaysModal}>
              <FormattedMessage
                id='notification.birthday.more'
                defaultMessage='{count} more {count, plural, one {friend} other {friends}}'
                values={{ count: birthdays.size - 1 }}
              />
            </span>
          ),
        }}
      />
    );
  }

  renderMessageForScreenReader = () => {
    const { intl, birthdays, account } = this.props;

    if (birthdays.size === 1) {
      return intl.formatMessage({ id: 'notification.birthday', defaultMessage: '{name} has a birthday today' }, { name: account.get('display_name') });
    }

    return intl.formatMessage(
      {
        id: 'notification.birthday_plural',
        defaultMessage: '{name} and {more} have birthday today',
      },
      {
        name: account.get('display_name'),
        more: intl.formatMessage(
          {
            id: 'notification.birthday.more',
            defaultMessage: '{count} more {count, plural, one {friend} other {friends}}',
          },
          { count: birthdays.size - 1 },
        ),
      },
    );
  }

  render() {
    const { birthdays } = this.props;

    if (!birthdays || birthdays.size === 0) return null;

    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className='notification notification-birthday focusable' tabIndex='0' title={this.renderMessageForScreenReader()}>
          <div className='p-4 focusable'>
            <HStack alignItems='center' space={1.5}>
              <Icon
                src={require('@tabler/icons/icons/ballon.svg')}
                className='text-primary-600'
              />

              <Text
                theme='muted'
                size='sm'
              >
                {this.renderMessage()}
              </Text>
            </HStack>
          </div>
        </div>
      </HotKeys>
    );
  }

}
