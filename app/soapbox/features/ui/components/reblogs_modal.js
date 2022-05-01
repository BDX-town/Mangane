import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchReblogs } from 'soapbox/actions/interactions';
import { fetchStatus } from 'soapbox/actions/statuses';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';

const mapStateToProps = (state, props) => {
  return {
    accountIds: state.getIn(['user_lists', 'reblogged_by', props.statusId]),
  };
};

export default @connect(mapStateToProps)
@injectIntl
@withRouter
class ReblogsModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    statusId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    history: PropTypes.object,
  };

  fetchData = () => {
    const { dispatch, statusId } = this.props;

    dispatch(fetchReblogs(statusId));
    dispatch(fetchStatus(statusId));
  }

  componentDidMount() {
    this.fetchData();
    this.unlistenHistory = this.props.history.listen((_, action) => {
      if (action === 'PUSH') {
        this.onClickClose(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.unlistenHistory) {
      this.unlistenHistory();
    }
  }

  onClickClose = () => {
    this.props.onClose('REBLOGS');
  };

  render() {
    const { accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <Spinner />;
    } else {
      const emptyMessage = <FormattedMessage id='status.reblogs.empty' defaultMessage='No one has reposted this post yet. When someone does, they will show up here.' />;

      body = (
        <ScrollableList
          scrollKey='reblogs'
          emptyMessage={emptyMessage}
          itemClassName='pb-3'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} />,
          )}
        </ScrollableList>
      );
    }


    return (
      <Modal
        title={<FormattedMessage id='column.reblogs' defaultMessage='Reposts' />}
        onClose={this.onClickClose}
      >
        {body}
      </Modal>
    );
  }

}
