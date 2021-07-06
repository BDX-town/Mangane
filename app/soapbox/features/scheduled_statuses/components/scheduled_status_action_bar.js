import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import SoapboxPropTypes from 'soapbox/utils/soapbox_prop_types';
import IconButton from 'soapbox/components/icon_button';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { cancelScheduledStatus } from 'soapbox/actions/scheduled_statuses';

const messages = defineMessages({
  cancel: { id: 'scheduled_status.cancel', defaultMessage: 'Cancel' },
});

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    me,
  };
};

export default @connect(mapStateToProps, null, null, { forwardRef: true })
@injectIntl
class ScheduledStatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    me: SoapboxPropTypes.me,
  };

  handleCancelClick = e => {
    const { status, dispatch } = this.props;
    dispatch(cancelScheduledStatus(status.get('id')));
  }

  render() {
    const { intl } = this.props;

    return (
      <div className='status__action-bar'>
        <div className='status__button'>
          <IconButton
            title={intl.formatMessage(messages.cancel)}
            text={intl.formatMessage(messages.cancel)}
            icon='close'
            onClick={this.handleCancelClick}
          />
        </div>
      </div>
    );
  }

}
