import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import { fetchUsers } from 'soapbox/actions/admin';

const messages = defineMessages({
  heading: { id: 'column.admin.awaiting_approval', defaultMessage: 'Awaiting Approval' },
});

const mapStateToProps = state => {
  const userIds = state.getIn(['admin', 'awaitingApproval']);
  return {
    users: userIds.map(id => state.getIn(['admin', 'users', id])),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class AwaitingApproval extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    users: ImmutablePropTypes.list.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchUsers({ page: 1, filters: 'local,need_approval' }));
  }

  render() {
    const { intl, users } = this.props;

    return (
      <Column icon='user' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        {users.map((user, i) => (
          <div key={i}>{user.get('nickname')}</div>
        ))}
      </Column>
    );
  }

}
