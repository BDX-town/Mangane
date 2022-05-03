import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import api from 'soapbox/api';
import { Modal, Stack, Text, Input } from 'soapbox/components/ui';

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

      const innerFrame = iframeDocument.querySelector('iframe');

      iframeDocument.body.style.margin = 0;

      if (innerFrame) {
        innerFrame.width = '100%';
      }
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
      <Modal title={<FormattedMessage id='status.embed' defaultMessage='Embed' />}>
        <Stack space={4}>
          <Stack>
            <Text theme='muted' size='sm'>
              <FormattedMessage id='embed.instructions' defaultMessage='Embed this post on your website by copying the code below.' />
            </Text>

            <Input
              type='text'
              readOnly
              value={oembed?.html || ''}
              onClick={this.handleTextareaClick}
            />
          </Stack>

          <iframe
            className='inline-flex rounded-xl overflow-hidden max-w-full'
            frameBorder='0'
            ref={this.setIframeRef}
            sandbox='allow-same-origin'
            title='preview'
          />
        </Stack>
      </Modal>
    );
  }

}
