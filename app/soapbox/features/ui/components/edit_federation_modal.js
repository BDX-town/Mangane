import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { SimpleForm, Checkbox } from 'soapbox/features/forms';
import { makeGetRemoteInstance } from 'soapbox/selectors';
import { Map as ImmutableMap, is } from 'immutable';
import { updateMrf } from 'soapbox/actions/mrf';
import snackbar from 'soapbox/actions/snackbar';

const getRemoteInstance = makeGetRemoteInstance();

const messages = defineMessages({
  reject: { id: 'edit_federation.reject', defaultMessage: 'Reject all activities' },
  mediaRemoval: { id: 'edit_federation.media_removal', defaultMessage: 'Strip media' },
  forceNsfw: { id: 'edit_federation.force_nsfw', defaultMessage: 'Force attachments to be marked sensitive' },
  unlisted: { id: 'edit_federation.unlisted', defaultMessage: 'Force posts unlisted' },
  followersOnly: { id: 'edit_federation.followers_only', defaultMessage: 'Hide posts except to followers' },
  save: { id: 'edit_federation.save', defaultMessage: 'Save' },
  success: { id: 'edit_federation.success', defaultMessage: '{host} federation was updated' },
});

const mapStateToProps = (state, { host }) => {
  return {
    remoteInstance: getRemoteInstance(state, host),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class EditFederationModal extends ImmutablePureComponent {

  static propTypes = {
    host: PropTypes.string.isRequired,
    remoteInstance: ImmutablePropTypes.map,
  };

  state = {
    data: ImmutableMap(),
  }

  hydrateState = () => {
    const { remoteInstance } = this.props;
    this.setState({ data: remoteInstance.get('federation') });
  }

  componentDidMount() {
    this.hydrateState();
  }

  componentDidUpdate(prevProps) {
    const { remoteInstance } = this.props;

    if (!is(prevProps.remoteInstance, remoteInstance)) {
      this.hydrateState();
    }
  }

  handleDataChange = key => {
    return ({ target }) => {
      const { data } = this.state;
      this.setState({ data: data.set(key, target.checked) });
    };
  }

  handleMediaRemoval = ({ target: { checked } }) => {
    const data = this.state.data.merge({
      avatar_removal: checked,
      banner_removal: checked,
      media_removal: checked,
    });

    this.setState({ data });
  }

  handleSubmit = e => {
    const { intl, dispatch, host, onClose } = this.props;
    const { data } = this.state;

    dispatch(updateMrf(host, data))
      .then(() => dispatch(snackbar.success(intl.formatMessage(messages.success, { host }))))
      .catch(() => {});

    onClose();
  }

  render() {
    const { intl, remoteInstance } = this.props;
    const { data } = this.state;

    const {
      avatar_removal,
      banner_removal,
      federated_timeline_removal,
      followers_only,
      media_nsfw,
      media_removal,
      reject,
    } = data.toJS();

    const fullMediaRemoval = avatar_removal && banner_removal && media_removal;

    return (
      <div className='modal-root__modal edit-federation-modal'>
        <div>
          <div className='edit-federation-modal__title'>
            {remoteInstance.get('host')}
          </div>
          <SimpleForm onSubmit={this.handleSubmit}>
            <Checkbox
              label={intl.formatMessage(messages.reject)}
              checked={reject}
              onChange={this.handleDataChange('reject')}
            />
            <Checkbox
              label={intl.formatMessage(messages.mediaRemoval)}
              disabled={reject}
              checked={fullMediaRemoval}
              onChange={this.handleMediaRemoval}
            />
            <Checkbox
              label={intl.formatMessage(messages.forceNsfw)}
              disabled={reject || media_removal}
              checked={media_nsfw}
              onChange={this.handleDataChange('media_nsfw')}
            />
            <Checkbox
              label={intl.formatMessage(messages.followersOnly)}
              disabled={reject}
              checked={followers_only}
              onChange={this.handleDataChange('followers_only')}
            />
            <Checkbox
              label={intl.formatMessage(messages.unlisted)}
              disabled={reject || followers_only}
              checked={federated_timeline_removal}
              onChange={this.handleDataChange('federated_timeline_removal')}
            />
            <button type='submit' className='edit-federation-modal__submit'>
              {intl.formatMessage(messages.save)}
            </button>
          </SimpleForm>
        </div>
      </div>
    );
  }

}
