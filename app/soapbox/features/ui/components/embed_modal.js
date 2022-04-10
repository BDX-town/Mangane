import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import api from 'soapbox/api';

export default @connect()
@injectIntl
class EmbedModal extends ImmutablePureComponent {

  static propTypes = {
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    oembed: null,
  };

  fetchEmbed = () => {
    const { dispatch, url } = this.props;

    return dispatch((dispatch, getState) => {
      return api(getState).get('/api/oembed', { params: { url } });
    });
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.fetchEmbed().then(res => {
      this.setState({ loading: false, oembed: res.data });

      const iframeDocument = this.iframe.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(res.data.html);
      iframeDocument.close();

      iframeDocument.body.style.margin = 0;
      this.iframe.width  = iframeDocument.body.scrollWidth;
      this.iframe.height = iframeDocument.body.scrollHeight;
    }).catch(error => {
      this.props.onError(error);
    });
  }

  setIframeRef = c =>  {
    this.iframe = c;
  }

  handleTextareaClick = (e) => {
    e.target.select();
  }

  render() {
    const { oembed } = this.state;

    return (
      <div className='modal-root__modal embed-modal'>
        <h4><FormattedMessage id='status.embed' defaultMessage='Embed' /></h4>

        <div className='embed-modal__container'>
          <p className='hint'>
            <FormattedMessage id='embed.instructions' defaultMessage='Embed this post on your website by copying the code below.' />
          </p>

          <input
            type='text'
            className='embed-modal__html'
            readOnly
            value={oembed && oembed.html || ''}
            onClick={this.handleTextareaClick}
          />

          <p className='hint'>
            <FormattedMessage id='embed.preview' defaultMessage='Here is what it will look like:' />
          </p>

          <iframe
            className='embed-modal__iframe'
            frameBorder='0'
            ref={this.setIframeRef}
            sandbox='allow-same-origin'
            title='preview'
          />
        </div>
      </div>
    );
  }

}
