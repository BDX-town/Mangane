import classNames from 'classnames';
import React from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { changeComposeSensitivity } from 'soapbox/actions/compose';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

const messages = defineMessages({
  marked: { id: 'compose_form.sensitive.marked', defaultMessage: 'Media is marked as sensitive' },
  unmarked: { id: 'compose_form.sensitive.unmarked', defaultMessage: 'Media is not marked as sensitive' },
});

/** Button to mark own media as sensitive. */
const SensitiveButton: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const active = useAppSelector(state => state.compose.get('sensitive') === true);
  const disabled = useAppSelector(state => state.compose.get('spoiler') === true);

  const onClick = () => {
    dispatch(changeComposeSensitivity());
  };

  return (
    <div className='compose-form__sensitive-button'>
      <label className={classNames('icon-button', { active })} title={intl.formatMessage(active ? messages.marked : messages.unmarked)}>
        <input
          name='mark-sensitive'
          type='checkbox'
          checked={active}
          onChange={onClick}
          disabled={disabled}
        />

        <span className={classNames('checkbox', { active })} />

        <FormattedMessage id='compose_form.sensitive.hide' defaultMessage='Mark media as sensitive' />
      </label>
    </div>
  );
};

export default SensitiveButton;
