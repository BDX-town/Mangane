import { connect } from 'react-redux';

import { joinGroup, leaveGroup } from '../../../../actions/groups';
import Header from '../components/header';

const mapStateToProps = (state, { groupId }) => ({
  group: state.getIn(['groups', groupId]),
  relationships: state.getIn(['group_relationships', groupId]),
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  toggleMembership(group, relationships) {
    if (relationships.get('member')) {
      dispatch(leaveGroup(group.get('id')));
    } else {
      dispatch(joinGroup(group.get('id')));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
