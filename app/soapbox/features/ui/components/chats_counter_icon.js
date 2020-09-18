import { connect } from 'react-redux';
import IconWithBadge from 'soapbox/components/icon_with_badge';

const mapStateToProps = state => ({
  count: state.get('chats').reduce((acc, curr) => acc + curr.get('unread'), 0),
  id: 'comment',
});

export default connect(mapStateToProps)(IconWithBadge);
