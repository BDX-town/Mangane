import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchFilters, createFilter, deleteFilter } from 'soapbox/actions/filters';
import snackbar from 'soapbox/actions/snackbar';
import Icon from 'soapbox/components/icon';
import { Button, CardHeader, CardTitle, Column, Form, FormActions, FormGroup, Input } from 'soapbox/components/ui';
import {
  FieldsGroup,
  Checkbox,
} from 'soapbox/features/forms';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';
import { Filter } from 'soapbox/types/entities';

const messages = defineMessages({
  heading: { id: 'column.filters', defaultMessage: 'Muted words' },
  subheading_add_new: { id: 'column.filters.subheading_add_new', defaultMessage: 'Add New Filter' },
  keyword: { id: 'column.filters.keyword', defaultMessage: 'Keyword or phrase' },
  expires: { id: 'column.filters.expires', defaultMessage: 'Expire after' },
  expires_hint: { id: 'column.filters.expires_hint', defaultMessage: 'Expiration dates are not currently supported' },
  home_timeline: { id: 'column.filters.home_timeline', defaultMessage: 'Home timeline' },
  public_timeline: { id: 'column.filters.public_timeline', defaultMessage: 'Public timeline' },
  notifications: { id: 'column.filters.notifications', defaultMessage: 'Also apply for notifications' },
  conversations: { id: 'column.filters.conversations', defaultMessage: 'Conversations' },
  drop_notifications: { id: 'column.filters.drop_notifications', defaultMessage: 'Will also hide status in notifications' },
  drop_header: { id: 'column.filters.drop_header', defaultMessage: 'Drop instead of hide' },
  drop_hint: { id: 'column.filters.drop_hint', defaultMessage: 'Filtered posts will disappear irreversibly, even if filter is later removed' },
  whole_word_header: { id: 'column.filters.whole_word_header', defaultMessage: 'Whole word' },
  whole_word_hint: { id: 'column.filters.whole_word_hint', defaultMessage: 'When the keyword or phrase is alphanumeric only, it will only be applied if it matches the whole word' },
  add_new: { id: 'column.filters.add_new', defaultMessage: 'Add New Filter' },
  create_error: { id: 'column.filters.create_error', defaultMessage: 'Error adding filter' },
  delete_error: { id: 'column.filters.delete_error', defaultMessage: 'Error deleting filter' },
  subheading_filters: { id: 'column.filters.subheading_filters', defaultMessage: 'Current Filters' },
  delete: { id: 'column.filters.delete', defaultMessage: 'Delete' },
});

const Filters = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const filters = useAppSelector((state) => state.filters);

  const [phrase, setPhrase] = useState('');
  const [expiresAt] = useState('');
  const [irreversible, setIrreversible] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);

  const handleAddNew: React.FormEventHandler = e => {
    e.preventDefault();
    dispatch(createFilter(phrase, expiresAt, [], wholeWord, irreversible)).then(() => {
      return dispatch(fetchFilters());
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.create_error)));
    });
  };

  const handleFilterDelete = (filter: Filter) => {
    dispatch(deleteFilter(filter.id)).then(() => {
      return dispatch(fetchFilters());
    }).catch(() => {
      dispatch(snackbar.error(intl.formatMessage(messages.delete_error)));
    });
  };

  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  const emptyMessage = <FormattedMessage id='empty_column.filters' defaultMessage="You haven't created any muted words yet." />;

  return (
    <Column className='filter-settings-panel' label={intl.formatMessage(messages.heading)}>
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_add_new)} />
      </CardHeader>
      <Form onSubmit={handleAddNew}>
        <FormGroup labelText={intl.formatMessage(messages.keyword)}>
          <Input
            required
            type='text'
            name='phrase'
            onChange={({ target }) => setPhrase(target.value)}
          />
        </FormGroup>
        <FieldsGroup>
          <div className='flex flex-col gap-2'>
            <Checkbox
              label={intl.formatMessage(messages.drop_header)}
              hint={intl.formatMessage(messages.drop_hint)}
              name='irreversible'
              checked={irreversible}
              onChange={({ target }) => setIrreversible(target.checked)}
            />
            <Checkbox
              label={intl.formatMessage(messages.whole_word_header)}
              hint={intl.formatMessage(messages.whole_word_hint)}
              name='whole_word'
              checked={wholeWord}
              onChange={({ target }) => setWholeWord(target.checked)}
            />
          </div>
        </FieldsGroup>

        <FormActions>
          <Button type='submit' theme='primary'>{intl.formatMessage(messages.add_new)}</Button>
        </FormActions>
      </Form>

      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_filters)} />
      </CardHeader>

      <div>
        {
          filters.size === 0 && <div>{ emptyMessage }</div>
        }
        {filters.map((filter, i) => (
          <div key={i} className='filter__container rounded bg-gray-100 dark:bg-slate-900 p-2 my-3'>
            <div className=''>
              <div className='mb-1'>
                <span className='pr-1 text-gray-600 dark:text-gray-400'><FormattedMessage id='filters.filters_list_phrase_label' defaultMessage='Keyword or phrase:' /></span>
                <span className='filter__list-value'>{filter.phrase}</span>
              </div>
              <div className=''>
                <span className='pr-1 text-gray-600 dark:text-gray-400'><FormattedMessage id='filters.filters_list_details_label' defaultMessage='Filter settings:' /></span>
                <span className='filter__list-value'>
                  {filter.irreversible ?
                    <span><FormattedMessage id='filters.filters_list_drop' defaultMessage='Drop' /></span> :
                    <span><FormattedMessage id='filters.filters_list_hide' defaultMessage='Hide' /></span>
                  }
                  {filter.whole_word &&
                    <span><FormattedMessage id='filters.filters_list_whole-word' defaultMessage='Whole word' /></span>
                  }
                </span>
              </div>
            </div>
            <div>
              <Button  theme='ghost' onClick={() => handleFilterDelete(filter)} aria-label={intl.formatMessage(messages.delete)}>
                <div className='flex items-end gap-1'>
                  <FormattedMessage id='filters.filters_list_delete' defaultMessage='Delete' />
                  <Icon src={require('@tabler/icons/x.svg')} />
                </div>
              </Button>
            </div>

          </div>
        ))}
      </div>
    </Column>
  );
};

export default Filters;
