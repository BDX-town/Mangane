import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import { fetchModerationLog } from 'soapbox/actions/admin';
import { List as ImmutableList, fromJS } from 'immutable';

const messages = defineMessages({
  heading: { id: 'column.admin.moderation_log', defaultMessage: 'Moderation Log' },
  emptyMessage: { id: 'admin.moderation_log.empty_message', defaultMessage: 'You have not performed any moderation actions yet. When you do, a history will be shown here.' },
});

export default @connect()
@injectIntl
class ModerationLog extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  state = {
    isLoading: true,
    items: ImmutableList(),
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchModerationLog())
      .then(data => this.setState({ isLoading: false, items: fromJS(data.items) }))
      .catch(() => {});
  }

  render() {
    const { intl } = this.props;
    const { isLoading, items } = this.state;
    const showLoading = isLoading && items.count() === 0;

    return (
      <Column icon='balance-scale' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          isLoading={isLoading}
          showLoading={showLoading}
          scrollKey='moderation-log'
          emptyMessage={intl.formatMessage(messages.emptyMessage)}
        >
          {items.map((item, i) => (
            <div className='logentry' key={i}>
              {item.get('message')}
            </div>
          ))}
        </ScrollableList>
      </Column>
    );
  }

}
