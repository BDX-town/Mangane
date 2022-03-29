import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import AttachmentThumbs from 'soapbox/components/attachment_thumbs';
import { Stack, Text } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';

import { isRtl } from '../../../rtl';

export default class ReplyIndicator extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.record,
    onCancel: PropTypes.func.isRequired,
    hideActions: PropTypes.bool,
  };

  handleClick = () => {
    this.props.onCancel();
  }

  render() {
    const { status, hideActions } = this.props;

    if (!status) {
      return null;
    }

    const style   = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    };

    let actions = {};
    if (!hideActions) {
      actions = {
        onActionClick: this.handleClick,
        actionIcon: require('@tabler/icons/icons/x.svg'),
        actionAlignment: 'top',
        actionTitle: 'Dismiss',
      };
    }

    return (
      <Stack space={2} className='p-4 rounded-lg bg-gray-100 dark:bg-slate-700'>
        <AccountContainer
          {...actions}
          id={status.getIn(['account', 'id'])}
          timestamp={status.get('created_at')}
          showProfileHoverCard={false}
        />

        <Text
          size='sm'
          dangerouslySetInnerHTML={{ __html: status.get('contentHtml') }}
          style={style}
        />

        {status.get('media_attachments').size > 0 && (
          <AttachmentThumbs
            compact
            media={status.get('media_attachments')}
            sensitive={status.get('sensitive')}
          />
        )}
      </Stack>
    );
  }

}
