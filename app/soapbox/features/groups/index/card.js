import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { shortNumberFormat } from '../../../utils/numbers';

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
  view: { id: 'groups.card.view', defaultMessage: 'View' },
  join: { id: 'groups.card.join', defaultMessage: 'Join' },
  role_member: { id: 'groups.card.roles.member', defaultMessage: 'You\'re a member' },
  role_admin: { id: 'groups.card.roles.admin', defaultMessage: 'You\'re an admin' },
});

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupCard extends ImmutablePureComponent {

    static propTypes = {
      group: ImmutablePropTypes.map,
      relationships: ImmutablePropTypes.map,
    }

    getRole() {
      const { intl, relationships } = this.props;

      if (relationships.get('admin')) return intl.formatMessage(messages.role_admin);
      if (relationships.get('member')) return intl.formatMessage(messages.role_member);
      return null;
    }

    render() {
      const { intl, group } = this.props;
      const coverImageUrl = group.get('cover_image_url');
      const role = this.getRole();

      return (
        <Link to={`/groups/${group.get('id')}`} className='group-card'>
          <div className='group-card__header'>{coverImageUrl && <img alt='' src={coverImageUrl} />}</div>
          <div className='group-card__content'>
            <div className='group-card__title'>{group.get('title')}</div>
            <div className='group-card__meta'><strong>{shortNumberFormat(group.get('member_count'))}</strong> {intl.formatMessage(messages.members)}{role && <span> · {role}</span>}</div>
            <div className='group-card__description'>{group.get('description')}</div>
          </div>
        </Link>
      );
    }

}
