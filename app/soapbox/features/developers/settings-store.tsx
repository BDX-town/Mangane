import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';

import { showAlertForError } from 'soapbox/actions/alerts';
import { patchMe } from 'soapbox/actions/me';
import { FE_NAME, SETTINGS_UPDATE } from 'soapbox/actions/settings';
import { Button, Form, FormActions, FormGroup, Textarea } from 'soapbox/components/ui';
import Column from 'soapbox/features/ui/components/column';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

const isJSONValid = (text: any): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

const messages = defineMessages({
  heading: { id: 'column.settings_store', defaultMessage: 'Settings store' },
  hint: { id: 'developers.settings_store.hint', defaultMessage: 'It is possible to directly edit your user settings here. BE CAREFUL! Editing this section can break your account, and you will only be able to recover through the API.' },
});

const SettingsStore: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settingsStore = useAppSelector(state => state.get('settings'));

  const [rawJSON, setRawJSON] = useState<string>(JSON.stringify(settingsStore, null, 2));
  const [jsonValid, setJsonValid] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const handleEditJSON: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target }) => {
    const rawJSON = target.value;
    setRawJSON(rawJSON);
    setJsonValid(isJSONValid(rawJSON));
  };

  const handleSubmit: React.FormEventHandler = e => {
    const settings = JSON.parse(rawJSON);

    setLoading(true);
    dispatch(patchMe({
      pleroma_settings_store: {
        [FE_NAME]: settings,
      },
    })).then(response => {
      dispatch({ type: SETTINGS_UPDATE, settings });
      setLoading(false);
    }).catch(error => {
      dispatch(showAlertForError(error));
      setLoading(false);
    });
  };

  useEffect(() => {
    setRawJSON(JSON.stringify(settingsStore, null, 2));
    setJsonValid(true);
  }, [settingsStore]);

  return (
    <Column label={intl.formatMessage(messages.heading)} backHref='/developers'>
      <Form onSubmit={handleSubmit}>
        <FormGroup
          hintText={intl.formatMessage(messages.hint)}
          errors={jsonValid ? [] : ['is invalid']}
        >
          <Textarea
            value={rawJSON}
            onChange={handleEditJSON}
            disabled={isLoading}
            rows={12}
            isCodeEditor
          />
        </FormGroup>

        <FormActions>
          <Button theme='primary' type='submit' disabled={!jsonValid || isLoading}>
            <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default SettingsStore;
