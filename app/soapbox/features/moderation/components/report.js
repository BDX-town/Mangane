import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusContainer from '../../../containers/status_container';
import AccountContainer from '../../../containers/account_container';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import Permalink from '../../../components/permalink';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { HotKeys } from 'react-hotkeys';
import Icon from 'soapbox/components/icon';
import emojify from 'soapbox/features/emoji/emoji';
import { FormattedDate } from 'react-intl';
import IconButton from '../../../components/icon_button';


const messages = defineMessages({
  close: { id: 'report.close', defaultMessage: 'Close' },
  close_all: { id: 'report.close_all', defaultMessage: 'Close All' },
  moderate_user: { id: 'report.moderate_user', defaultMessage: 'Moderate User' },
});

export default @injectIntl
class Report extends ImmutablePureComponent {

  static propTypes = {
    report: ImmutablePropTypes.map.isRequired,
    state: ImmutablePropTypes.map,
  };

  handleCloseClick = () => {
    return
  }

  handleCloseAllClick = () => {
    return
  }

  handleCModerateUserClick = () => {
    return
  }

  render() {
    const { intl, report } = this.props;
    const statuses = report.get('statuses')
    const notes = report.get('notes')

    return (
      <div class="report">
        <div className='report__action-bar'>
          <div className='report__button'>
            <IconButton
              title={intl.formatMessage(messages.close)}
              icon='times'
              onClick={this.handleCloseClick}
              text={intl.formatMessage(messages.close)}
            />
          </div>
          <div className='report__button'>
            <IconButton
              title={intl.formatMessage(messages.close_all)}
              icon='gavel'
              onClick={this.handleCloseAllClick}
              text={intl.formatMessage(messages.close_all)}
            />
          </div>
          <div className='report__button'>
            <IconButton
              title={intl.formatMessage(messages.moderate_user)}
              icon='user'
              onClick={this.handleModerateUserClick}
              text={intl.formatMessage(messages.moderate_user)}
            />
          </div>
        </div>

        <div><FormattedDate value={new Date(report.get('created_at'))} hour12={false} year='2-digit' month='2-digit' day='2-digit' hour='2-digit' minute='2-digit' /></div>

        <FormattedMessage id='report.account' defaultMessage="Report on:" />
        <AccountContainer id={report.getIn(['account', 'id'])} withNote={false} />

        <FormattedMessage id='report.actor' defaultMessage="Reported by:" />
        <AccountContainer id={report.getIn(['actor', 'id'])} withNote={false} />

        <FormattedMessage id='report.statuses' defaultMessage="Items:"/>
        <span>{statuses ? statuses.count() : '0'}</span>

        <FormattedMessage id='report.notes' defaultMessage="Notes:"/>
        <span>{notes ? notes.count() : '0'}</span>

      </div>
    );
  }

}
