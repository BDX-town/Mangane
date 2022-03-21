import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Column, Spinner } from 'soapbox/components/ui';

import { fetchMutes, expandMutes } from '../../actions/mutes';
import ScrollableList from '../../components/scrollable_list';
import AccountContainer from '../../containers/account_container';

const messages = defineMessages({
  heading: { id: 'column.mutes', defaultMessage: 'Muted users' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'mutes', 'items']),
  hasMore: !!state.getIn(['user_lists', 'mutes', 'next']),
});

export default @connect(mapStateToProps)
@injectIntl
class Mutes extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    accountIds: ImmutablePropTypes.orderedSet,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(fetchMutes());
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandMutes());
  }, 300, { leading: true });

  render() {
    const { intl, hasMore, accountIds } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <Spinner />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.mutes' defaultMessage="You haven't muted any users yet." />;

    return (
      <Column label={intl.formatMessage(messages.heading)}>
        <ScrollableList
          scrollKey='mutes'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          emptyMessage={emptyMessage}
          className='space-y-4'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
