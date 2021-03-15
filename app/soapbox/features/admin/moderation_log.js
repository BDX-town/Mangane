import React from 'react';
import { defineMessages, injectIntl, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import ScrollableList from 'soapbox/components/scrollable_list';
import { fetchModerationLog } from 'soapbox/actions/admin';

const messages = defineMessages({
  heading: { id: 'column.admin.moderation_log', defaultMessage: 'Moderation Log' },
  emptyMessage: { id: 'admin.moderation_log.empty_message', defaultMessage: 'You have not performed any moderation actions yet. When you do, a history will be shown here.' },
});

const mapStateToProps = state => ({
  items: state.getIn(['admin_log', 'index']).map(i => state.getIn(['admin_log', 'items', String(i)])),
  hasMore: state.getIn(['admin_log', 'total'], 0) - state.getIn(['admin_log', 'index']).count() > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class ModerationLog extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    list: ImmutablePropTypes.list,
  };

  state = {
    isLoading: true,
    lastPage: 0,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchModerationLog())
      .then(data => this.setState({
        isLoading: false,
        lastPage: 1,
      }))
      .catch(() => {});
  }

  handleLoadMore = () => {
    const page = this.state.lastPage + 1;

    this.setState({ isLoading: true });
    this.props.dispatch(fetchModerationLog({ page }))
      .then(data => this.setState({
        isLoading: false,
        lastPage: page,
      }))
      .catch(() => {});
  }

  render() {
    const { intl, items, hasMore } = this.props;
    const { isLoading } = this.state;
    const showLoading = isLoading && items.count() === 0;

    return (
      <Column icon='balance-scale' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ScrollableList
          isLoading={isLoading}
          showLoading={showLoading}
          scrollKey='moderation-log'
          emptyMessage={intl.formatMessage(messages.emptyMessage)}
          hasMore={hasMore}
          onLoadMore={this.handleLoadMore}
        >
          {items.map((item, i) => (
            <div className='logentry' key={i}>
              <div className='logentry__message'>{item.get('message')}</div>
              <div className='logentry__timestamp'>
                <FormattedDate
                  value={new Date(item.get('time') * 1000)}
                  hour12={false}
                  year='numeric'
                  month='short'
                  day='2-digit'
                  hour='2-digit'
                  minute='2-digit'
                />
              </div>
            </div>
          ))}
        </ScrollableList>
      </Column>
    );
  }

}
