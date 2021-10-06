import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusContainer from 'soapbox/containers/status_container';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import classNames from 'classnames';

const mapStateToProps = (state, { id }) => {
  return {
    replyToId: state.getIn(['statuses', id, 'in_reply_to_id']),
    replyCount: state.getIn(['contexts', 'replies', id], ImmutableOrderedSet()).size,
  };
};

export default @connect(mapStateToProps)
class ThreadStatus extends React.Component {

  static propTypes = {
    focusedStatusId: PropTypes.string,
    replyToId: PropTypes.string,
    replyCount: PropTypes.number,
  }

  renderConnector() {
    const { focusedStatusId, replyToId, replyCount } = this.props;

    const isConnectedTop = replyToId && replyToId !== focusedStatusId;
    const isConnectedBottom = replyCount > 0;
    const isConnected = isConnectedTop || isConnectedBottom;

    if (!isConnected) {
      return null;
    }

    return (
      <div
        className={classNames('thread__connector', {
          'thread__connector--top': isConnectedTop,
          'thread__connector--bottom': isConnectedBottom,
        })}
      />
    );
  }

  render() {
    return (
      <div className='thread__status'>
        {this.renderConnector()}
        <StatusContainer {...this.props} />
      </div>
    );
  }

}
