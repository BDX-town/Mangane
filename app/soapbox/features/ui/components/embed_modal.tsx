import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import api from 'soapbox/api';
import { Modal, Stack, Text, Input } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

const fetchEmbed = (url: string) => {
  return (dispatch: any, getState: any) => {
    return api(getState).get('/api/oembed', { params: { url } });
  };
};

interface IEmbedModal {
  url: string,
  onError: (error: any) => void,
}

const EmbedModal: React.FC<IEmbedModal> = ({ url, onError }) => {
  const dispatch = useAppDispatch();

  const iframe = useRef<HTMLIFrameElement>(null);
  const [oembed, setOembed] = useState<any>(null);

  useEffect(() => {

    dispatch(fetchEmbed(url)).then(({ data }) => {
      if (!iframe.current?.contentWindow) return;
      setOembed(data);

      const iframeDocument = iframe.current.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(data.html);
      iframeDocument.close();

      const innerFrame = iframeDocument.querySelector('iframe');

      iframeDocument.body.style.margin = '0';

      if (innerFrame) {
        innerFrame.width = '100%';
      }
    }).catch(error => {
      onError(error);
    });
  }, [!!iframe.current]);

  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
    e.currentTarget.select();
  };

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
            onClick={handleInputClick}
          />
        </Stack>

        <iframe
          className='inline-flex rounded-xl overflow-hidden max-w-full'
          frameBorder='0'
          ref={iframe}
          sandbox='allow-same-origin'
          title='preview'
        />
      </Stack>
    </Modal>
  );
};

export default EmbedModal;