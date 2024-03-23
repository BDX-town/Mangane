import { Map as ImmutableMap } from 'immutable';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  insertEmojiCompose,
  uploadCompose,
} from 'soapbox/actions/compose';
import { getFeatures } from 'soapbox/utils/features';


import ComposeForm from '../components/compose_form';

const mapStateToProps = (state: ImmutableMap<string, any>)  => {
  const instance = state.get('instance');

  const now = new Date().getTime();

  return {
    text: state.getIn(['compose', 'text']),
    suggestions: state.getIn(['compose', 'suggestions']),
    spoiler: state.getIn(['compose', 'spoiler']),
    spoilerText: state.getIn(['compose', 'spoiler_text']),
    spoilerForced: state.getIn(['compose', 'spoiler_forced']),
    privacy: state.getIn(['compose', 'privacy']),
    focusDate: state.getIn(['compose', 'focusDate']),
    caretPosition: state.getIn(['compose', 'caretPosition']),
    hasPoll: !!state.getIn(['compose', 'poll']),
    isSubmitting: state.getIn(['compose', 'is_submitting']),
    isEditing: state.getIn(['compose', 'id']) !== null,
    isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
    isUploading: state.getIn(['compose', 'is_uploading']),
    showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
    anyMedia: (state.getIn(['compose', 'media_attachments']) as ImmutableMap<unknown, unknown>).size > 0,
    isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'COMPOSE'),
    maxTootChars: state.getIn(['instance', 'configuration', 'statuses', 'max_characters']),
    scheduledAt: state.getIn(['compose', 'schedule']),
    // we only want to keep scheduled status that werent sent, since server does not push that information to client when scheduled status are posted
    scheduledStatus: (state.get('scheduled_statuses') as ImmutableMap<number, { scheduled_at: string}>).filter((s) => new Date(s.scheduled_at).getTime() > now),
    features: getFeatures(instance),
  };
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onChange(text) {
    dispatch(changeCompose(text));
  },

  onSubmit(router, group) {
    dispatch(submitCompose(router, group));
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected(position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path));
  },

  onChangeSpoilerText(checked) {
    dispatch(changeComposeSpoilerText(checked));
  },

  onPaste(files) {
    dispatch(uploadCompose(files, intl));
  },

  onPickEmoji(position, data, needsSpace) {
    dispatch(insertEmojiCompose(position, data, needsSpace));
  },

});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  });
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm));
