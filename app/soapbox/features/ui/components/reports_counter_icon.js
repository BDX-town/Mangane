import { connect } from 'react-redux';
import IconWithBadge from 'soapbox/components/icon_with_badge';

const mapStateToProps = state => ({
  count: state.getIn(['admin', 'open_report_count']),
  id: 'gavel',
});

export default connect(mapStateToProps)(IconWithBadge);
