import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { remoteInteraction } from 'soapbox/actions/interactions';
import snackbar from 'soapbox/actions/snackbar';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import IconButton from 'soapbox/components/icon_button';
import { getFeatures } from 'soapbox/utils/features';

import { Modal, Stack, Text } from '../../../components/ui';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  accountPlaceholder: { id: 'remote_interaction.account_placeholder', defaultMessage: 'Enter your username@domain you want to act from' },
  userNotFoundError: { id: 'remote_interaction.user_not_found_error', defaultMessage: 'Couldn\'t find given user' },
});

const mapStateToProps = (state, props) => {
  const instance = state.get('instance');
  const features = getFeatures(instance);
  const soapboxConfig = getSoapboxConfig(state);

  if (props.action !== 'FOLLOW') {
    return {
      features,
      siteTitle: state.getIn(['instance', 'title']),
      remoteInteractionsAPI: features.remoteInteractionsAPI,
      singleUserMode: soapboxConfig.get('singleUserMode'),
    };
  }

  const userName = state.getIn(['accounts', props.account, 'display_name']);

  return {
    features,
    siteTitle: state.getIn(['instance', 'title']),
    userName,
    remoteInteractionsAPI: features.remoteInteractionsAPI,
    singleUserMode: soapboxConfig.get('singleUserMode'),
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  onRemoteInteraction(ap_id, account) {
    return dispatch(remoteInteraction(ap_id, account));
  },
});

@withRouter
class UnauthorizedModal extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    features: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemoteInteraction: PropTypes.func.isRequired,
    userName: PropTypes.string,
    singleUserMode: PropTypes.bool,
  };

  state = {
    account: '',
  };

  onAccountChange = e => {
    this.setState({ account: e.target.value });
  }

  onClickClose = () => {
    this.props.onClose('UNAUTHORIZED');
  };

  onClickProceed = e => {
    e.preventDefault();

    const { intl, ap_id, dispatch, onClose, onRemoteInteraction } = this.props;
    const { account } = this.state;

    onRemoteInteraction(ap_id, account)
      .then(url => {
        window.open(url, '_new', 'noopener,noreferrer');
        onClose('UNAUTHORIZED');
      })
      .catch(error => {
        if (error.message === 'Couldn\'t find user') {
          dispatch(snackbar.error(intl.formatMessage(messages.userNotFoundError)));
        }
      });
  }

  onLogin = (e) => {
    e.preventDefault();

    this.context.router.history.push('/login');
    this.onClickClose();
  }

  onRegister = (e) => {
    e.preventDefault();

    this.context.router.history.push('/');
    this.onClickClose();
  }

  renderRemoteInteractions() {
    const { intl, siteTitle, userName, action, singleUserMode } = this.props;
    const { account } = this.state;

    let header;
    let button;

    if (action === 'FOLLOW') {
      header = <FormattedMessage id='remote_interaction.follow_title' defaultMessage='Follow {user} remotely' values={{ user: userName }} />;
      button = <FormattedMessage id='remote_interaction.follow' defaultMessage='Proceed to follow' />;
    } else if (action === 'REPLY') {
      header = <FormattedMessage id='remote_interaction.reply_title' defaultMessage='Reply to a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reply' defaultMessage='Proceed to reply' />;
    } else if (action === 'REBLOG') {
      header = <FormattedMessage id='remote_interaction.reblog_title' defaultMessage='Reblog a post remotely' />;
      button = <FormattedMessage id='remote_interaction.reblog' defaultMessage='Proceed to repost' />;
    } else if (action === 'FAVOURITE') {
      header = <FormattedMessage id='remote_interaction.favourite_title' defaultMessage='Like a post remotely' />;
      button = <FormattedMessage id='remote_interaction.favourite' defaultMessage='Proceed to like' />;
    } else if (action === 'POLL_VOTE') {
      header = <FormattedMessage id='remote_interaction.poll_vote_title' defaultMessage='Vote in a poll remotely' />;
      button = <FormattedMessage id='remote_interaction.poll_vote' defaultMessage='Proceed to vote' />;
    }

    return (
      <div className='modal-root__modal compose-modal unauthorized-modal remote-interaction-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>{header}</h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} src={require('@tabler/icons/icons/x.svg')} onClick={this.onClickClose} />
        </div>
        <div className='remote-interaction-modal__content'>
          <form className='simple_form remote-interaction-modal__fields'>
            <input
              type='text'
              placeholder={intl.formatMessage(messages.accountPlaceholder)}
              name='remote_follow[acct]'
              value={account}
              autoCorrect='off'
              autoCapitalize='off'
              onChange={this.onAccountChange}
              required
            />
            <button className='button' onClick={this.onClickProceed}>{button}</button>
          </form>
          <div className='remote-interaction-modal__divider'>
            <span>
              <FormattedMessage id='remote_interaction.divider' defaultMessage='or' />
            </span>
          </div>
          {!singleUserMode && (
            <>
              <h3 className='compose-modal__header__title'><FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: siteTitle }} /></h3>
              <Link to='/' className='unauthorized-modal-content__button button' onClick={this.onClickClose}>
                <FormattedMessage id='account.register' defaultMessage='Sign up' />
              </Link>
            </>
          )}
          <Link to='/login' className='unauthorized-modal-content__button button button-secondary' onClick={this.onClickClose}>
            <FormattedMessage id='account.login' defaultMessage='Log in' />
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { features, siteTitle, action } = this.props;

    if (action && features.remoteInteractionsAPI && features.federating) return this.renderRemoteInteractions();

    return (
      <Modal
        title={<FormattedMessage id='unauthorized_modal.title' defaultMessage='Sign up for {site_title}' values={{ site_title: siteTitle }} />}
        onClose={this.onClickClose}
        confirmationAction={this.onLogin}
        confirmationText={<FormattedMessage id='account.login' defaultMessage='Log in' />}
        secondaryAction={this.onRegister}
        secondaryText={<FormattedMessage id='account.register' defaultMessage='Sign up' />}
      >
        <Stack>
          <Text>
            <FormattedMessage id='unauthorized_modal.text' defaultMessage='You need to be logged in to do that.' />
          </Text>
        </Stack>
      </Modal>
    );
  }

}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UnauthorizedModal));
