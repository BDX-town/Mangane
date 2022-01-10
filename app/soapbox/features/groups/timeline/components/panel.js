import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';

import Icon from 'soapbox/components/icon';

const messages = defineMessages({
  group_archived: { id: 'group.detail.archived_group', defaultMessage: 'Archived group' },
  group_admin: { id: 'groups.detail.role_admin', defaultMessage: 'You\'re an admin' },
});

export default @injectIntl
class GroupPanel extends ImmutablePureComponent {

    static propTypes = {
      group: ImmutablePropTypes.map,
      relationships: ImmutablePropTypes.map,
    }

    render() {
      const { group, relationships, intl } = this.props;

      return (
        <div className='group__panel'>
          <h1 className='group__panel__title'>
            {group.get('title')}
            {group.get('archived') && <Icon id='lock' title={intl.formatMessage(messages.group_archived)} />}
          </h1>

          {relationships.get('admin') && <span className='group__panel__label'>{intl.formatMessage(messages.group_admin)}</span>}

          <div className='group__panel__description'>{group.get('description')}</div>
        </div>
      );
    }

}
