import { connect } from 'react-redux';

import { changeComposeContentType } from '../../../actions/compose';
import MarkdownButton from '../components/markdown_button';

const mapStateToProps = (state, { intl }) => {
  return {
    active: state.getIn(['compose', 'content_type']) === 'text/markdown',
  };
};

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch(changeComposeContentType(this.active ? 'text/plain' : 'text/markdown'));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownButton);
