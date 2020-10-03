import { connect } from 'react-redux';
import IconWithBadge from 'soapbox/components/icon_with_badge';

const mapStateToProps = state => ({
  count: state.get('chats').reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0),
  id: 'comment',
});

export default connect(mapStateToProps)(IconWithBadge);
