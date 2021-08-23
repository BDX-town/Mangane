import { connect } from 'react-redux';
import TextIconButton from '../components/text_icon_button';
import { changeComposeContentType } from '../../../actions/compose';
import { injectIntl, defineMessages } from 'react-intl';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Post markdown enabled' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Post markdown disabled' },
});

const mapStateToProps = (state, { intl }) => {
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    label: 'MD',
    title: intl.formatMessage(state.getIn(['compose', 'content_type']) === 'text/markdown' ? messages.marked : messages.unmarked),
    active: state.getIn(['compose', 'content_type']) === 'text/markdown',
    ariaControls: 'markdown-input',
    unavailable: !features.richText,
  };
};

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch(changeComposeContentType(this.active ? 'text/plain' : 'text/markdown'));
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TextIconButton));
