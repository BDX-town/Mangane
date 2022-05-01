import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { openModal } from 'soapbox/actions/modals';
import { cancelScheduledStatus } from 'soapbox/actions/scheduled_statuses';
import { getSettings } from 'soapbox/actions/settings';
import IconButton from 'soapbox/components/icon_button';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';

const messages = defineMessages({
  cancel: { id: 'scheduled_status.cancel', defaultMessage: 'Cancel' },
  deleteConfirm: { id: 'confirmations.scheduled_status_delete.confirm', defaultMessage: 'Cancel' },
  deleteHeading: { id: 'confirmations.scheduled_status_delete.heading', defaultMessage: 'Cancel scheduled post' },
  deleteMessage: { id: 'confirmations.scheduled_status_delete.message', defaultMessage: 'Are you sure you want to cancel this scheduled post?' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({
  onCancelClick: (status) => {
    dispatch((_, getState) => {

      const deleteModal = getSettings(getState()).get('deleteModal');
      if (!deleteModal) {
        dispatch(cancelScheduledStatus(status.get('id')));
      } else {
        dispatch(openModal('CONFIRM', {
          icon: require('@tabler/icons/icons/calendar-stats.svg'),
          heading: intl.formatMessage(messages.deleteHeading),
          message: intl.formatMessage(messages.deleteMessage),
          confirm: intl.formatMessage(messages.deleteConfirm),
          onConfirm: () => dispatch(cancelScheduledStatus(status.get('id'))),
        }));
      }
    });
  },
});

class ScheduledStatusActionBar extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.record.isRequired,
    intl: PropTypes.object.isRequired,
    me: SoapboxPropTypes.me,
    onCancelClick: PropTypes.func.isRequired,
  };

  handleCancelClick = e => {
    const { status, onCancelClick } = this.props;

    onCancelClick(status);
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='status__action-bar'>
        <div className='status__button'>
          <IconButton
            title={intl.formatMessage(messages.cancel)}
            text={intl.formatMessage(messages.cancel)}
            src={require('@tabler/icons/icons/x.svg')}
            onClick={this.handleCancelClick}
          />
        </div>
      </div>
    );
  }

}


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ScheduledStatusActionBar));
