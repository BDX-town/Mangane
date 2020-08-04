import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import { fetchFilters, createFilter } from '../../actions/filters';
import ScrollableList from '../../components/scrollable_list';
import Button from 'soapbox/components/button';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  TextInput,
  SelectDropdown,
  Checkbox,
} from 'soapbox/features/forms';
import { showAlert } from 'soapbox/actions/alerts';

const messages = defineMessages({
  heading: { id: 'column.filters', defaultMessage: 'Muted words' },
  keyword: { id: 'column.filters.keyword', defaultMessage: 'Keyword or phrase' },
  expires: { id: 'column.filters.expires', defaultMessage: 'Expire after' },
  home_timeline: { id: 'column.filters.home_timeline', defaultMessage: 'Home timeline' },
  public_timeline: { id: 'column.filters.public_timeline', defaultMessage: 'Public timeline' },
  notifications: { id: 'column.filters.notifications', defaultMessage: 'Notifications' },
  conversations: { id: 'column.filters.conversations', defaultMessage: 'Conversations' },
  drop_header: { id: 'column.filters.drop_header', defaultMessage: 'Drop instead of hide' },
  drop_hint: { id: 'column.filters.drop_hint', defaultMessage: 'Filtered posts will disappear irreversibly, even if filter is later removed' },
  whole_word_header: { id: 'column.filters.whole_word_header', defaultMessage: 'Whole word' },
  whole_word_hint: { id: 'column.filters.whole_word_hint', defaultMessage: 'When the keyword or phrase is alphanumeric only, it will only be applied if it matches the whole word' },
  add_new: { id: 'column.filters.add_new', defaultMessage: 'Add New Muted Word' },
  error: { id: 'column.filters.error', defaultMessage: 'Error adding filter' },
});

const expirations = {
  1800: 'Never',
  3600: '30 minutes',
  21600: '1 hour',
  43200: '12 hours',
  86400 : '1 day',
  604800: '1 week',
};

const mapStateToProps = state => ({
  filters: state.get('filters'),
});


export default @connect(mapStateToProps)
@injectIntl
class Filters extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    phrase: '',
    expires_at: '',
    context: {
      home_timeline: false,
      public_timeline: false,
      notifications: false,
      conversations: false,
    },
    irreversible: false,
    whole_word: true,
  }


  componentDidMount() {
    this.props.dispatch(fetchFilters());
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSelectChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckboxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleAddNew = e => {
    e.preventDefault();
    const { intl, dispatch } = this.state;
    const { phrase, context, whole_word, expires_at } = this.state;
    dispatch(createFilter(phrase, context, whole_word, expires_at)).then(response => {
      dispatch(fetchFilters());
    }).catch(error => {
      dispatch(showAlert('', intl.formatMessage(messages.error)));
    });
  }


  render() {
    const { intl, filters } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.filters' defaultMessage="You haven't created any muted words yet." />;

    return (
      <Column icon='filter' heading={intl.formatMessage(messages.heading)} backBtnSlim>

        <SimpleForm>
          <div className='filter-settings-panel'>
            <h1 className='filter-settings-panel__add-new'>
              <FormattedMessage id='filters.add_new_title' defaultMessage='Add New Filter' />
            </h1>

            <fieldset disabled={false}>
              <FieldsGroup>

                <SimpleInput
                  label={intl.formatMessage(messages.keyword)}
                  required
                  type='text'
                  name='custom_filter_phrase'
                  onChange={this.handleInputChange}
                />

                <SelectDropdown
                  label={intl.formatMessage(messages.expires)}
                  items={expirations}
                  defaultValue={expirations.never}
                  onChange={this.handleSelectChange}
                />
              </FieldsGroup>

              <FieldsGroup>
                <label className='checkboxes required'>
                  <FormattedMessage id='filters.context_header' defaultMessage='Filter contexts' />
                </label>
                <span className='hint'>
                  <FormattedMessage id='filters.context_hint' defaultMessage='One or multiple contexts where the filter should apply' />
                </span>
                <Checkbox
                  label={intl.formatMessage(messages.home_timeline)}
                  name='home_timeline'
                  checked={this.state.context.home_timeline}
                  onChange={this.handleCheckboxChange}
                />
                <Checkbox
                  label={intl.formatMessage(messages.public_timeline)}
                  name='public_timeline'
                  checked={this.state.context.public_timeline}
                  onChange={this.handleCheckboxChange}
                />
                <Checkbox
                  label={intl.formatMessage(messages.notifications)}
                  name='notifications'
                  checked={this.state.context.notifications}
                  onChange={this.handleCheckboxChange}
                />
                <Checkbox
                  label={intl.formatMessage(messages.conversations)}
                  name='conversations'
                  checked={this.state.context.conversations}
                  onChange={this.handleCheckboxChange}
                />

              </FieldsGroup>

              <FieldsGroup>
                <Checkbox
                  label={intl.formatMessage(messages.drop_header)}
                  hint={intl.formatMessage(messages.drop_hint)}
                  name='irreversible'
                  checked={this.state.irreversible}
                  onChange={this.handleCheckboxChange}
                />
                <Checkbox
                  label={intl.formatMessage(messages.whole_word_header)}
                  hint={intl.formatMessage(messages.whole_word_hint)}
                  name='whole_word'
                  checked={this.state.whole_word}
                  onChange={this.handleCheckboxChange}
                />
              </FieldsGroup>
            </fieldset>

            <Button className='button button-primary setup' text={intl.formatMessage(messages.add_new)} onClick={this.props.handleAddNew} />

            <ScrollableList
              scrollKey='mutes'
              onLoadMore={this.handleLoadMore}
              emptyMessage={emptyMessage}
            >
              {filters.map((filter, i) => (
                <div key={i} className='backup_code'>
                  <div className='backup_code'>{filter}</div>
                </div>
              ))}
            </ScrollableList>

          </div>
        </SimpleForm>




      </Column>
    );
  }

}
