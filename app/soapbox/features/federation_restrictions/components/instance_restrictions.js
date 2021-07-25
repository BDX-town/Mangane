'use strict';

import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'soapbox/components/icon';

const hasRestrictions = remoteInstance => {
  return remoteInstance
    .get('federation')
    .deleteAll(['accept', 'reject_deletes', 'report_removal'])
    .reduce((acc, value) => acc || value, false);
};

const mapStateToProps = state => {
  return {
    instance: state.get('instance'),
  };
};

export default @connect(mapStateToProps)
class InstanceRestrictions extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    remoteInstance: ImmutablePropTypes.map.isRequired,
    instance: ImmutablePropTypes.map,
  };

  renderRestrictions = () => {
    const { remoteInstance } = this.props;
    const items = [];

    const {
      avatar_removal,
      banner_removal,
      federated_timeline_removal,
      followers_only,
      media_nsfw,
      media_removal,
    } = remoteInstance.get('federation').toJS();

    const fullMediaRemoval = media_removal && avatar_removal && banner_removal;
    const partialMediaRemoval = media_removal || avatar_removal || banner_removal;

    if (followers_only) {
      items.push((
        <div className='federation-restriction' key='followers_only'>
          <div className='federation-restriction__icon'>
            <Icon id='lock' />
          </div>
          <div className='federation-restriction__message'>
            <FormattedMessage
              id='federation_restriction.followers_only'
              defaultMessage='Hidden except to followers'
            />
          </div>
        </div>
      ));
    } else if (federated_timeline_removal) {
      items.push((
        <div className='federation-restriction' key='federated_timeline_removal'>
          <div className='federation-restriction__icon'>
            <Icon id='unlock' />
          </div>
          <div className='federation-restriction__message'>
            <FormattedMessage
              id='federation_restriction.federated_timeline_removal'
              defaultMessage='Fediverse timeline removal'
            />
          </div>
        </div>
      ));
    }

    if (fullMediaRemoval) {
      items.push((
        <div className='federation-restriction' key='full_media_removal'>
          <div className='federation-restriction__icon'>
            <Icon id='photo' />
          </div>
          <div className='federation-restriction__message'>
            <FormattedMessage
              id='federation_restriction.full_media_removal'
              defaultMessage='Full media removal'
            />
          </div>
        </div>
      ));
    } else if (partialMediaRemoval) {
      items.push((
        <div className='federation-restriction' key='partial_media_removal'>
          <div className='federation-restriction__icon'>
            <Icon id='photo' />
          </div>
          <div className='federation-restriction__message'>
            <FormattedMessage
              id='federation_restriction.partial_media_removal'
              defaultMessage='Partial media removal'
            />
          </div>
        </div>
      ));
    }

    if (!fullMediaRemoval && media_nsfw) {
      items.push((
        <div className='federation-restriction' key='media_nsfw'>
          <div className='federation-restriction__icon'>
            <Icon id='eye-slash' />
          </div>
          <div className='federation-restriction__message'>
            <FormattedMessage
              id='federation_restriction.media_nsfw'
              defaultMessage='Attachments marked NSFW'
            />
          </div>
        </div>
      ));
    }

    return items;
  }

  renderContent = () => {
    const { instance, remoteInstance } = this.props;
    if (!instance || !remoteInstance) return null;

    const host = remoteInstance.get('host');
    const siteTitle = instance.get('title');

    if (remoteInstance.getIn(['federation', 'reject']) === true) {
      return (
        <div className='instance-restrictions__message'>
          <Icon id='close' />
          <FormattedMessage
            id='remote_instance.federation_panel.restricted_message'
            defaultMessage='{siteTitle} blocks all activities from {host}.'
            values={{ host, siteTitle }}
          />
        </div>
      );
    } else if (hasRestrictions(remoteInstance)) {
      return [
        (
          <div className='instance-restrictions__message'>
            <FormattedMessage
              id='remote_instance.federation_panel.some_restrictions_message'
              defaultMessage='{siteTitle} has placed some restrictions on {host}.'
              values={{ host, siteTitle }}
            />
          </div>
        ),
        this.renderRestrictions(),
      ];
    } else {
      return (
        <div className='instance-restrictions__message'>
          <Icon id='check' />
          <FormattedMessage
            id='remote_instance.federation_panel.no_restrictions_message'
            defaultMessage='{siteTitle} has placed no restrictions on {host}.'
            values={{ host, siteTitle }}
          />
        </div>
      );
    }
  }

  render() {
    return <div className='instance-restrictions'>{this.renderContent()}</div>;
  }

}
