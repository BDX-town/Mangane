import React, { useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { Button, Form, FormActions, Text } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';
import { AppDispatch, RootState } from 'soapbox/store';

interface ICSVExporter {
  messages: {
    input_label: MessageDescriptor,
    input_hint: MessageDescriptor,
    submit: MessageDescriptor,
  },
  action: () => (dispatch: AppDispatch, getState: () => RootState) => Promise<void>,
}

const CSVExporter: React.FC<ICSVExporter> = ({ messages, action }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick: React.MouseEventHandler = (event) => {
    setIsLoading(true);
    dispatch(action()).then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  return (
    <Form>
      <Text size='xl' weight='bold'>{intl.formatMessage(messages.input_label)}</Text>
      <Text theme='muted'>{intl.formatMessage(messages.input_hint)}</Text>

      <FormActions>
        <Button theme='primary' onClick={handleClick} disabled={isLoading}>
          {intl.formatMessage(messages.submit)}
        </Button>
      </FormActions>
    </Form>
  );
};

export default CSVExporter;
