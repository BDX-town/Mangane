import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { fetchStatusWithContext } from 'soapbox/actions/statuses';
import ScrollableList from 'soapbox/components/scrollable_list';
import { Modal, Spinner } from 'soapbox/components/ui';
import AccountContainer from 'soapbox/containers/account_container';
import { makeGetStatus } from 'soapbox/selectors';

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus();
  const status = getStatus(state, {
    id: props.statusId,
    username: props.username,
  });

  return {
    accountIds: status ? ImmutableOrderedSet(status.get('mentions').map(m => m.get('id'))) : null,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class MentionsModal extends React.PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    statusId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
  };

  fetchData = () => {
    const { dispatch, statusId } = this.props;

    dispatch(fetchStatusWithContext(statusId));
  }

  componentDidMount() {
    this.fetchData();
  }

  onClickClose = () => {
    this.props.onClose('MENTIONS');
  };

  render() {
    const { accountIds } = this.props;

    let body;

    if (!accountIds) {
      body = <Spinner />;
    } else {
      body = (
        <ScrollableList
          scrollKey='mentions'
          itemClassName='pb-3'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      );
    }

    return (
      <Modal
        title={<FormattedMessage id='column.mentions' defaultMessage='Mentions' />}
        onClose={this.onClickClose}
      >
        {body}
      </Modal>
    );
  }

}
