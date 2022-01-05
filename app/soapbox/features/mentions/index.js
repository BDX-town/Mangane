import React from 'react';
import { connect } from 'react-redux';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import MissingIndicator from '../../components/missing_indicator';
import { fetchStatus } from '../../actions/statuses';
import { injectIntl, defineMessages } from 'react-intl';
import AccountContainer from '../../containers/account_container';
import Column from '../ui/components/column';
import ScrollableList from '../../components/scrollable_list';
import { makeGetStatus } from '../../selectors';

const messages = defineMessages({
  heading: { id: 'column.mentions', defaultMessage: 'Mentions' },
});

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus();
  const status = getStatus(state, {
    id: props.params.statusId,
    username: props.params.username,
  });

  return {
    status,
    accountIds: status ? ImmutableOrderedSet(status.get('mentions').map(m => m.get('id'))) : null,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class Mentions extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.orderedSet,
    status: ImmutablePropTypes.map,
  };

  fetchData = () => {
    const { dispatch, params } = this.props;
    const { statusId } = params;

    dispatch(fetchStatus(statusId));
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;

    if (params.statusId !== prevProps.params.statusId) {
      this.fetchData();
    }
  }

  render() {
    const { intl, accountIds, status } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    if (!status) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    return (
      <Column heading={intl.formatMessage(messages.heading)}>
        <ScrollableList
          scrollKey='reblogs'
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
