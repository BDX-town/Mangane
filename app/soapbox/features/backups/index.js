import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/better_column';
import {
  fetchBackups,
  createBackup,
} from 'soapbox/actions/backups';
import ScrollableList from 'soapbox/components/scrollable_list';
import classNames from 'classnames';

const messages = defineMessages({
  heading: { id: 'column.backups', defaultMessage: 'Backups' },
  create: { id: 'backups.actions.create', defaultMessage: 'Create backup' },
  emptyMessage: { id: 'backups.empty_message', defaultMessage: 'No backups found. {action}' },
  emptyMessageAction: { id: 'backups.empty_message.action', defaultMessage: 'Create one now?' },
  pending: { id: 'backups.pending', defaultMessage: 'Pending' },
});

const mapStateToProps = state => ({
  backups: state.get('backups').toList().sortBy(backup => backup.get('inserted_at')),
});

export default @connect(mapStateToProps)
@injectIntl
class Backups extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
  }

  handleCreateBackup = e => {
    this.props.dispatch(createBackup());
    e.preventDefault();
  }

  componentDidMount() {
    this.props.dispatch(fetchBackups()).then(() => {
      this.setState({ isLoading: false });
    }).catch(() => {});
  }

  makeColumnMenu = () => {
    const { intl } = this.props;

    return [{
      text: intl.formatMessage(messages.create),
      action: this.handleCreateBackup,
    }];
  }

  render() {
    const { intl, backups } = this.props;
    const { isLoading } = this.state;
    const showLoading = isLoading && backups.count() === 0;

    const emptyMessageAction = (
      <a href='#' onClick={this.handleCreateBackup}>
        {intl.formatMessage(messages.emptyMessageAction)}
      </a>
    );

    return (
      <Column icon='cloud-download' heading={intl.formatMessage(messages.heading)} menu={this.makeColumnMenu()}>
        <ScrollableList
          isLoading={isLoading}
          showLoading={showLoading}
          scrollKey='backups'
          emptyMessage={intl.formatMessage(messages.emptyMessage, { action: emptyMessageAction })}
        >
          {backups.map(backup => (
            <div
              className={classNames('backup', { 'backup--pending': !backup.get('processed') })}
              key={backup.get('id')}
            >
              {backup.get('processed')
                ? <a href={backup.get('url')} target='_blank'>{backup.get('inserted_at')}</a>
                : <div>{intl.formatMessage(messages.pending)}: {backup.get('inserted_at')}</div>
              }
            </div>
          ))}
        </ScrollableList>
      </Column>
    );
  }

}
