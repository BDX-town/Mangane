import { Map as ImmutableMap } from 'immutable';
import React, { useState, useEffect } from 'react';
import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { fetchCaptcha } from 'soapbox/actions/auth';
import { Stack, Text, Input } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

const noOp = () => {};

const messages = defineMessages({
  placeholder: { id: 'registration.captcha.placeholder', defaultMessage: 'Enter the pictured text' },
});

interface ICaptchaField {
  name?: string,
  value: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onFetch?: (captcha: ImmutableMap<string, any>) => void,
  onFetchFail?: (error: Error) => void,
  onClick?: React.MouseEventHandler,
  refreshInterval?: number,
  idempotencyKey: string,
}

const CaptchaField: React.FC<ICaptchaField> = ({
  name,
  value,
  onChange = noOp,
  onFetch = noOp,
  onFetchFail = noOp,
  onClick = noOp,
  refreshInterval = 5 * 60 * 1000, // 5 minutes, Pleroma default
  idempotencyKey,
}) => {
  const dispatch = useAppDispatch();

  const [captcha, setCaptcha] = useState(ImmutableMap<string, any>());
  const [refresh, setRefresh] = useState<NodeJS.Timer | undefined>(undefined);

  const getCaptcha = () => {
    dispatch(fetchCaptcha()).then(response => {
      const captcha = ImmutableMap<string, any>(response.data);
      setCaptcha(captcha);
      onFetch(captcha);
    }).catch((error: Error) => {
      onFetchFail(error);
    });
  };

  const startRefresh = () => {
    if (refreshInterval) {
      const newRefresh = setInterval(getCaptcha, refreshInterval);
      setRefresh(newRefresh);
    }
  };

  const endRefresh = () => {
    if (refresh) {
      clearInterval(refresh);
    }
  };

  useEffect(() => {
    getCaptcha();
    endRefresh();
    startRefresh(); // Refresh periodically

    return () => {
      endRefresh();
    };
  }, [idempotencyKey]);

  switch (captcha.get('type')) {
    case 'native':
      return (
        <div>
          <Text>
            <FormattedMessage id='registration.captcha.hint' defaultMessage='Click the image to get a new captcha' />
          </Text>

          <NativeCaptchaField
            captcha={captcha}
            onChange={onChange}
            onClick={onClick}
            name={name}
            value={value}
          />
        </div>
      );
    case 'none':
    default:
      return null;
  }
};

interface INativeCaptchaField {
  captcha: ImmutableMap<string, any>,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onClick: React.MouseEventHandler,
  name?: string,
  value: string,
}

const NativeCaptchaField: React.FC<INativeCaptchaField> = ({ captcha, onChange, onClick, name, value }) => {
  const intl = useIntl();

  return (
    <Stack space={2}>
      <div className='flex items-center justify-center bg-white w-full border border-solid border-gray-300 dark:border-gray-600 rounded-md'>
        <img alt='captcha' src={captcha.get('url')} onClick={onClick} />
      </div>

      <Input
        type='text'
        placeholder={intl.formatMessage(messages.placeholder)}
        name={name}
        value={value}
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        onChange={onChange}
        required
      />
    </Stack>
  );
};

export {
  CaptchaField as default,
  NativeCaptchaField,
};
