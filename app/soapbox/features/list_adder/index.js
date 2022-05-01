import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { setupListAdder, resetListAdder } from 'soapbox/actions/lists';
import { CardHeader, CardTitle, Modal } from 'soapbox/components/ui';

import NewListForm from '../lists/components/new_list_form';

import Account from './components/account';
import List from './components/list';

// hack
const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = (state, { accountId }) => ({
  listIds: getOrderedLists(state).map(list=>list.get('id')),
  account: state.getIn(['accounts', accountId]),
});

const mapDispatchToProps = dispatch => ({
  onInitialize: accountId => dispatch(setupListAdder(accountId)),
  onReset: () => dispatch(resetListAdder()),
});

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
  add: { id: 'lists.new.create', defaultMessage: 'Add List' },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListAdder extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onInitialize: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    listIds: ImmutablePropTypes.list.isRequired,
    account: ImmutablePropTypes.record,
  };

  componentDidMount() {
    const { onInitialize, accountId } = this.props;
    onInitialize(accountId);
  }

  componentWillUnmount() {
    const { onReset } = this.props;
    onReset();
  }

  onClickClose = () => {
    this.props.onClose('LIST_ADDER');
  };

  render() {
    const { accountId, listIds, intl } = this.props;

    return (
      <Modal
        title={<FormattedMessage id='list_adder.header_title' defaultMessage='Add or Remove from Lists' />}
        onClose={this.onClickClose}
      >
        <div className='compose-modal__content'>
          <div className='list-adder'>
            <div className='list-adder__account'>
              <Account accountId={accountId} />
            </div>

            <br />

            <CardHeader>
              <CardTitle title={intl.formatMessage(messages.add)} />
            </CardHeader>
            <NewListForm />

            <br />

            <CardHeader>
              <CardTitle title={intl.formatMessage(messages.subheading)} />
            </CardHeader>
            <div className='list-adder__lists'>
              {listIds.map(ListId => <List key={ListId} listId={ListId} />)}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

}
