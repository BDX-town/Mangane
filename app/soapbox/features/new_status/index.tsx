import React, { useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';

import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

import ComposeFormContainer from '../compose/containers/compose_form_container';

const messages = defineMessages({
  edit: { id: 'navigation_bar.compose_edit', defaultMessage: 'Edit post' },
  direct: { id: 'navigation_bar.compose_direct', defaultMessage: 'Direct message' },
  reply: { id: 'navigation_bar.compose_reply', defaultMessage: 'Reply to post' },
  quote: { id: 'navigation_bar.compose_quote', defaultMessage: 'Quote post' },
  compose: { id: 'navigation_bar.compose', defaultMessage: 'Compose new post' },
});

const NewStatus = () => {
  const intl = useIntl();

  const statusId = useAppSelector((state) => state.compose.id);
  const privacy = useAppSelector((state) => state.compose.privacy);
  const inReplyTo = useAppSelector((state) => state.compose.in_reply_to);
  const quote = useAppSelector((state) => state.compose.quote);

  const renderTitle = useMemo(() => {
    if (statusId) {
      return intl.formatMessage(messages.edit);
    } else if (privacy === 'direct') {
      return intl.formatMessage(messages.direct);
    } else if (inReplyTo) {
      return intl.formatMessage(messages.reply);
    } else if (quote) {
      return intl.formatMessage(messages.quote);
    } else {
      return intl.formatMessage(messages.compose);
    }
  }, [intl, statusId, privacy, inReplyTo, quote]);

  return (
    <Column label={renderTitle} transparent withHeader={false}>
      <div className='px-4 pt-4 sm:p-0'>
        <SubNavigation message={renderTitle} />
      </div>
      <div className='block w-full p-6 mx-auto text-left align-middle transition-all bg-white dark:bg-slate-800 text-black dark:text-white rounded-none sm:rounded-2xl pointer-events-auto max-w-xl'>
        <ComposeFormContainer />
      </div>

    </Column>
  );
};

export default NewStatus;
