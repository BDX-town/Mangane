import React from 'react';
import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeSettingImmediate } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Form, FormActions, FormGroup, Input, Text } from 'soapbox/components/ui';


import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  answerLabel: { id: 'developers.challenge.answer_label', defaultMessage: 'Answer' },
  answerPlaceholder: { id: 'developers.challenge.answer_placeholder', defaultMessage: 'Your answer' },
  success: { id: 'developers.challenge.success', defaultMessage: 'You are now a developer' },
  fail: { id: 'developers.challenge.fail', defaultMessage: 'Wrong answer' },
});

const DevelopersChallenge = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [answer, setAnswer] = useState('');

  const handleChangeAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (answer === 'boxsoap') {
      dispatch(changeSettingImmediate(['isDeveloper'], true));
      dispatch(snackbar.success(intl.formatMessage(messages.success)));
    } else {
      dispatch(snackbar.error(intl.formatMessage(messages.fail)));
    }
  };

  const challenge = `function soapbox() {
  return 'soap|box'.split('|').reverse().join('');
}`;

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Form onSubmit={handleSubmit}>
        <Text>
          <FormattedMessage
            id='developers.challenge.message'
            defaultMessage='What is the result of calling {function}?'
            values={{ function: <span className='font-mono'>soapbox()</span> }}
          />
        </Text>
        <Text tag='pre' family='mono'>
          {challenge}
        </Text>

        <FormGroup
          labelText={intl.formatMessage(messages.answerLabel)}
        >
          <Input
            name='answer'
            placeholder={intl.formatMessage(messages.answerPlaceholder)}
            onChange={handleChangeAnswer}
            value={answer}
            type='text'
          />
        </FormGroup>

        <FormActions>
          <Button theme='primary' type='submit'>
            <FormattedMessage id='developers.challenge.submit' defaultMessage='Become a developer' />
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default DevelopersChallenge;
