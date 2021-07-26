import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { SimpleForm, Checkbox } from 'soapbox/features/forms';
import { makeGetRemoteInstance } from 'soapbox/selectors';

const getRemoteInstance = makeGetRemoteInstance();

const mapStateToProps = (state, { host }) => {
  return {
    remoteInstance: getRemoteInstance(state, host),
  };
};

export default @connect(mapStateToProps)
class EditFederationModal extends React.PureComponent {

  static propTypes = {
    host: PropTypes.string.isRequired,
    remoteInstance: ImmutablePropTypes.map,
  };

  render() {
    const { remoteInstance } = this.props;

    const {
      avatar_removal,
      banner_removal,
      federated_timeline_removal,
      followers_only,
      media_nsfw,
      media_removal,
      reject,
    } = remoteInstance.get('federation').toJS();

    return (
      <div className='modal-root__modal edit-federation-modal'>
        <h3>{remoteInstance.get('host')}</h3>
        <SimpleForm>
          <Checkbox label='reject' checked={reject} />
          <Checkbox label='media removal' checked={avatar_removal && banner_removal && media_removal} />
          <Checkbox label='force nsfw' checked={media_nsfw} />
          <Checkbox label='unlisted' checked={federated_timeline_removal} />
          <Checkbox label='followers only' checked={followers_only} />
        </SimpleForm>
      </div>
    );
  }

}
