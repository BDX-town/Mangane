import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { changeListEditorTitle, submitListEditor } from 'soapbox/actions/lists';
import { Button, Form, HStack, Input } from 'soapbox/components/ui';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  title: { id: 'lists.new.create', defaultMessage: 'Add list' },
  create: { id: 'lists.new.create_title', defaultMessage: 'Create' },
});

const NewListForm: React.FC = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const value = useAppSelector((state) => state.listEditor.get('title'));
  const disabled = useAppSelector((state) => !!state.listEditor.get('isSubmitting'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeListEditorTitle(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    dispatch(submitListEditor(true));
  };

  const label = intl.formatMessage(messages.label);
  const create = intl.formatMessage(messages.create);

  return (
    <Form onSubmit={handleSubmit}>
      <HStack space={2}>
        <label className='flex-grow'>
          <span style={{ display: 'none' }}>{label}</span>

          <Input
            type='text'
            value={value}
            disabled={disabled}
            onChange={handleChange}
            placeholder={label}
          />
        </label>

        <Button
          disabled={disabled}
          onClick={handleSubmit}
        >
          {create}
        </Button>
      </HStack>
    </Form>
  );
};

export default NewListForm;
