import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchLists } from '../../actions/lists';
import LoadingIndicator from '../../components/loading_indicator';
import ScrollableList from '../../components/scrollable_list';
import Column from '../ui/components/column';
import ColumnLink from '../ui/components/column_link';
import ColumnSubheading from '../ui/components/column_subheading';

import NewListForm from './components/new_list_form';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
  add: { id: 'lists.new.create', defaultMessage: 'Add list' },
});

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
});

export default @connect(mapStateToProps)
@injectIntl
class Lists extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchLists());
  }

  render() {
    const { intl, lists } = this.props;

    if (!lists) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.lists' defaultMessage="You don't have any lists yet. When you create one, it will show up here." />;

    return (
      <Column icon='list-ul' heading={intl.formatMessage(messages.heading)}>
        <br />
        <ColumnSubheading text={intl.formatMessage(messages.add)} />
        <NewListForm />
        <br />
        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        <ScrollableList
          scrollKey='lists'
          emptyMessage={emptyMessage}
        >
          {lists.map(list =>
            <ColumnLink key={list.get('id')} to={`/list/${list.get('id')}`} src={require('@tabler/icons/icons/list.svg')} text={list.get('title')} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
