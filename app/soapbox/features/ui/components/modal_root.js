import PropTypes from 'prop-types';
import React from 'react';

import Base from 'soapbox/components/modal_root';
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
  LandingPageModal,
  BirthdaysModal,
  AccountNoteModal,
  CompareHistoryModal,
} from 'soapbox/features/ui/util/async-components';

import BundleContainer from '../containers/bundle_container';

import BundleModalError from './bundle_modal_error';
import ModalLoading from './modal_loading';


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
  'LANDING_PAGE': LandingPageModal,
  'BIRTHDAYS': BirthdaysModal,
  'ACCOUNT_NOTE': AccountNoteModal,
  'COMPARE_HISTORY': CompareHistoryModal,
};

export default class ModalRoot extends React.PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  getSnapshotBeforeUpdate() {
    return { visible: !!this.props.type };
  }

  componentDidUpdate(prevProps, prevState, { visible }) {
    if (visible) {
      document.body.classList.add('with-modals');
    } else {
      document.body.classList.remove('with-modals');
    }
  }

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null;
  }

  renderError = (props) => {
    return <BundleModalError {...props} onClose={this.onClickClose} />;
  }

  onClickClose = (_) => {
    const { onClose, type } = this.props;
    onClose(type);
  }

  render() {
    const { type, props } = this.props;
    const visible = !!type;

    return (
      <Base onClose={this.onClickClose} type={type}>
        {visible && (
          <BundleContainer fetchComponent={MODAL_COMPONENTS[type]} loading={this.renderLoading(type)} error={this.renderError} renderDelay={200}>
            {(SpecificComponent) => <SpecificComponent {...props} onClose={this.onClickClose} />}
          </BundleContainer>
        )}
      </Base>
    );
  }

}
