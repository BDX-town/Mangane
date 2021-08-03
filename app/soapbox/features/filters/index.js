import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import Column from '../ui/components/column';
import { fetchFilters, createFilter, deleteFilter } from '../../actions/filters';
import ScrollableList from '../../components/scrollable_list';
import Button from 'soapbox/components/button';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  SelectDropdown,
  Checkbox,
} from 'soapbox/features/forms';
import snackbar from 'soapbox/actions/snackbar';
import Icon from 'soapbox/components/icon';
import ColumnSubheading from '../ui/components/column_subheading';

const messages = defineMessages({
  heading: { id: 'column.filters', defaultMessage: 'Muted words' },
  subheading_add_new: { id: 'column.filters.subheading_add_new', defaultMessage: 'Add New Filter' },
  keyword: { id: 'column.filters.keyword', defaultMessage: 'Keyword or phrase' },
  expires: { id: 'column.filters.expires', defaultMessage: 'Expire after' },
  expires_hint: { id: 'column.filters.expires_hint', defaultMessage: 'Expiration dates are not currently supported' },
  home_timeline: { id: 'column.filters.home_timeline', defaultMessage: 'Home timeline' },
  public_timeline: { id: 'column.filters.public_timeline', defaultMessage: 'Public timeline' },
  notifications: { id: 'column.filters.notifications', defaultMessage: 'Notifications' },
  conversations: { id: 'column.filters.conversations', defaultMessage: 'Conversations' },
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

const expirations = {
  null: 'Never',
  // 3600: '30 minutes',
  // 21600: '1 hour',
  // 43200: '12 hours',
  // 86400 : '1 day',
  // 604800: '1 week',
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
    home_timeline: true,
    public_timeline: false,
    notifications: false,
    conversations: false,
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
    const { intl, dispatch } = this.props;
    const { phrase, whole_word, expires_at, irreversible } = this.state;
    const { home_timeline, public_timeline, notifications, conversations } = this.state;
    const context = [];

    if (home_timeline) {
      context.push('home');
    }
    if (public_timeline) {
      context.push('public');
    }
    if (notifications) {
      context.push('notifications');
    }
    if (conversations) {
      context.push('thread');
    }

    dispatch(createFilter(intl, phrase, expires_at, context, whole_word, irreversible)).then(response => {
      return dispatch(fetchFilters());
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.create_error)));
    });
  }

  handleFilterDelete = e => {
    const { intl, dispatch } = this.props;
    dispatch(deleteFilter(intl, e.currentTarget.dataset.value)).then(response => {
      return dispatch(fetchFilters());
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.delete_error)));
    });
  }


  render() {
    const { intl, filters } = this.props;
    const emptyMessage = <FormattedMessage id='empty_column.filters' defaultMessage="You haven't created any muted words yet." />;

    return (
      <Column className='filter-settings-panel' icon='filter' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ColumnSubheading text={intl.formatMessage(messages.subheading_add_new)} />
        <SimpleForm>
          <div className='filter-settings-panel'>
            <fieldset disabled={false}>
              <FieldsGroup>
                <div className='two-col'>
                  <SimpleInput
                    label={intl.formatMessage(messages.keyword)}
                    required
                    type='text'
                    name='phrase'
                    onChange={this.handleInputChange}
                  />
                  <div className='input with_label required'>
                    <SelectDropdown
                      label={intl.formatMessage(messages.expires)}
                      hint={intl.formatMessage(messages.expires_hint)}
                      items={expirations}
                      defaultValue={expirations.never}
                      onChange={this.handleSelectChange}
                    />
                  </div>
                </div>
              </FieldsGroup>

              <FieldsGroup>
                <label className='checkboxes required'>
                  <FormattedMessage id='filters.context_header' defaultMessage='Filter contexts' />
                </label>
                <span className='hint'>
                  <FormattedMessage id='filters.context_hint' defaultMessage='One or multiple contexts where the filter should apply' />
                </span>
                <div className='two-col'>
                  <Checkbox
                    label={intl.formatMessage(messages.home_timeline)}
                    name='home_timeline'
                    checked={this.state.home_timeline}
                    onChange={this.handleCheckboxChange}
                  />
                  <Checkbox
                    label={intl.formatMessage(messages.public_timeline)}
                    name='public_timeline'
                    checked={this.state.public_timeline}
                    onChange={this.handleCheckboxChange}
                  />
                  <Checkbox
                    label={intl.formatMessage(messages.notifications)}
                    name='notifications'
                    checked={this.state.notifications}
                    onChange={this.handleCheckboxChange}
                  />
                  <Checkbox
                    label={intl.formatMessage(messages.conversations)}
                    name='conversations'
                    checked={this.state.conversations}
                    onChange={this.handleCheckboxChange}
                  />
                </div>

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

            <Button className='button button-primary setup' text={intl.formatMessage(messages.add_new)} onClick={this.handleAddNew} />

            <ColumnSubheading text={intl.formatMessage(messages.subheading_filters)} />

            <ScrollableList
              scrollKey='filters'
              emptyMessage={emptyMessage}
            >
              {filters.map((filter, i) => (
                <div key={i} className='filter__container'>
                  <div className='filter__details'>
                    <div className='filter__phrase'>
                      <span className='filter__list-label'><FormattedMessage id='filters.filters_list_phrase_label' defaultMessage='Keyword or phrase:' /></span>
                      <span className='filter__list-value'>{filter.get('phrase')}</span>
                    </div>
                    <div className='filter__contexts'>
                      <span className='filter__list-label'><FormattedMessage id='filters.filters_list_context_label' defaultMessage='Filter contexts:' /></span>
                      <span className='filter__list-value'>
                        {filter.get('context').map((context, i) => (
                          <span key={i} className='context'>{context}</span>
                        ))}
                      </span>
                    </div>
                    <div className='filter__details'>
                      <span className='filter__list-label'><FormattedMessage id='filters.filters_list_details_label' defaultMessage='Filter settings:' /></span>
                      <span className='filter__list-value'>
                        {filter.get('irreversible') ?
                          <span><FormattedMessage id='filters.filters_list_drop' defaultMessage='Drop' /></span> :
                          <span><FormattedMessage id='filters.filters_list_hide' defaultMessage='Hide' /></span>
                        }
                        {filter.get('whole_word') &&
                          <span><FormattedMessage id='filters.filters_list_whole-word' defaultMessage='Whole word' /></span>
                        }
                      </span>
                    </div>
                  </div>
                  <div className='filter__delete' role='button' tabIndex='0' onClick={this.handleFilterDelete} data-value={filter.get('id')} aria-label={intl.formatMessage(messages.delete)}>
                    <Icon className='filter__delete-icon' id='times' size={40} />
                    <span className='filter__delete-label'><FormattedMessage id='filters.filters_list_delete' defaultMessage='Delete' /></span>
                  </div>
                </div>
              ))}
            </ScrollableList>

          </div>
        </SimpleForm>




      </Column>
    );
  }

}
