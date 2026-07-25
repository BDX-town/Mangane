import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import api from 'soapbox/api';
import { Modal, Stack, Text, Input } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
import { sanitizeHtml } from 'soapbox/utils/html-safety';

import type { RootState } from 'soapbox/store';

const fetchEmbed = (url: string) => {
  return (dispatch: any, getState: () => RootState) => {
    return api(getState).get('/api/oembed', { params: { url } });
  };
};

interface IEmbedModal {
  url: string,
  onError: (error: any) => void,
}

const EmbedModal: React.FC<IEmbedModal> = ({ url, onError }) => {
  const dispatch = useAppDispatch();

  const onErrorRef = useRef(onError);
  const [oembed, setOembed] = useState<any>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {

    dispatch(fetchEmbed(url)).then(({ data }) => {
      setOembed(data);
      setPreviewHtml(sanitizeHtml(data.html));
    }).catch(error => {
      onErrorRef.current(error);
    });
  }, [dispatch, url]);

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
          sandbox=''
          srcDoc={previewHtml}
          title='preview'
        />
      </Stack>
    </Modal>
  );
};

export default EmbedModal;
