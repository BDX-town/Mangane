import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { fetchBirthdayReminders } from 'soapbox/actions/accounts';
import { Widget } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { useAppSelector } from 'soapbox/hooks';

interface IBirthdayPanel {
  limit: number
}

const BirthdayPanel = ({ limit }: IBirthdayPanel) => {
  const dispatch = useDispatch();

  const birthdays: ImmutableOrderedSet<string> = useAppSelector(state => state.user_lists.getIn(['birthday_reminders', state.me], ImmutableOrderedSet()));
  const birthdaysToRender = birthdays.slice(0, limit);

  React.useEffect(() => {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;

    dispatch(fetchBirthdayReminders(month, day));
  }, []);

  if (birthdaysToRender.isEmpty()) {
    return null;
  }

  return (
    <Widget title={<FormattedMessage id='birthday_panel.title' defaultMessage='Birthdays' />}>
      {birthdaysToRender.map(accountId => (
        <AccountContainer
          key={accountId}
          // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
          id={accountId}
        />
      ))}
    </Widget>
  );
};

export default BirthdayPanel;
