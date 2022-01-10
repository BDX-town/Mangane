import { connect } from 'react-redux';
import { getFeatures } from 'soapbox/utils/features';
import MarkdownButton from '../components/markdown_button';
import { changeComposeContentType } from '../../../actions/compose';

const mapStateToProps = (state, { intl }) => {
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    active: state.getIn(['compose', 'content_type']) === 'text/markdown',
    unavailable: !features.richText,
  };
};

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch(changeComposeContentType(this.active ? 'text/plain' : 'text/markdown'));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownButton);
