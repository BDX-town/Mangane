import React from 'react';
import PropTypes from 'prop-types';
import Base from '../../../components/modal_root';
import BundleContainer from '../containers/bundle_container';
import BundleModalError from './bundle_modal_error';
import ModalLoading from './modal_loading';

import {
  MediaModal,
  VideoModal,
  BoostModal,
  ConfirmationModal,
  MuteModal,
  ReportModal,
  EmbedModal,
  CryptoDonateModal,
  ListEditor,
  ListAdder,
  MissingDescriptionModal,
  ActionsModal,
  FocalPointModal,
  HotkeysModal,
  ComposeModal,
  ReplyMentionsModal,
  UnauthorizedModal,
  EditFederationModal,
  ComponentModal,
  ReactionsModal,
  FavouritesModal,
  ReblogsModal,
  MentionsModal,
} from '../../../features/ui/util/async-components';

const MODAL_COMPONENTS = {
  'MEDIA': MediaModal,
  'VIDEO': VideoModal,
  'BOOST': BoostModal,
  'CONFIRM': ConfirmationModal,
  'MISSING_DESCRIPTION': MissingDescriptionModal,
  'MUTE': MuteModal,
  'REPORT': ReportModal,
  'ACTIONS': ActionsModal,
  'EMBED': EmbedModal,
  'LIST_EDITOR': ListEditor,
  'FOCAL_POINT': FocalPointModal,
  'LIST_ADDER': ListAdder,
  'HOTKEYS': HotkeysModal,
  'COMPOSE': ComposeModal,
  'REPLY_MENTIONS': ReplyMentionsModal,
  'UNAUTHORIZED': UnauthorizedModal,
  'CRYPTO_DONATE': CryptoDonateModal,
  'EDIT_FEDERATION': EditFederationModal,
  'COMPONENT': ComponentModal,
  'REBLOGS': ReblogsModal,
  'FAVOURITES': FavouritesModal,
  'REACTIONS': ReactionsModal,
  'MENTIONS': MentionsModal,
};

export default class ModalRoot extends React.PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    noPop: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  getSnapshotBeforeUpdate() {
    return { visible: !!this.props.type };
  }

  componentDidUpdate(prevProps, prevState, { visible }) {
    if (visible) {
      document.body.classList.add('with-modals--active');
    } else {
      document.body.classList.remove('with-modals--active');
    }
  }

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null;
  }

  renderError = (props) => {
    return <BundleModalError {...props} onClose={this.onClickClose} />;
  }

  onClickClose = (_, noPop) => {
    const { onClose, type } = this.props;
    onClose(type, noPop);
  }

  render() {
    const { type, props, noPop } = this.props;
    const visible = !!type;

    return (
      <Base onClose={this.onClickClose} type={type} noPop={noPop}>
        {visible && (
          <BundleContainer fetchComponent={MODAL_COMPONENTS[type]} loading={this.renderLoading(type)} error={this.renderError} renderDelay={200}>
            {(SpecificComponent) => <SpecificComponent {...props} onClose={this.onClickClose} />}
          </BundleContainer>
        )}
      </Base>
    );
  }

}
