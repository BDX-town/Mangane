import { connect } from 'react-redux';
import Header from '../components/header';
import { joinGroup, leaveGroup } from '../../../../actions/groups';
import { Map as ImmutableMap } from 'immutable';

const mapStateToProps = (state, { groupId }) => ({
  group: state.getIn(['groups', groupId]),
  relationships: state.getIn(['group_relationships', groupId], ImmutableMap()),
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
