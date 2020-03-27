import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { injectIntl, defineMessages } from 'react-intl';
import { setupListEditor, clearListSuggestions, resetListEditor } from '../../actions/lists';
import Account from './components/account';
import Search from './components/search';
import EditListForm from './components/edit_list_form';
import ColumnSubheading from '../ui/components/column_subheading';
import IconButton from 'gabsocial/components/icon_button';

const mapStateToProps = state => ({
  accountIds: state.getIn(['listEditor', 'accounts', 'items']),
  searchAccountIds: state.getIn(['listEditor', 'suggestions', 'items']),
});

const mapDispatchToProps = dispatch => ({
  onInitialize: listId => dispatch(setupListEditor(listId)),
  onClear: () => dispatch(clearListSuggestions()),
  onReset: () => dispatch(resetListEditor()),
});

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  changeTitle: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  addToList: { id: 'lists.account.add', defaultMessage: 'Add to list' },
  removeFromList: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  editList: { id: 'lists.edit', defaultMessage: 'Edit list' },
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListEditor extends ImmutablePureComponent {

  static propTypes = {
    listId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onInitialize: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list.isRequired,
    searchAccountIds: ImmutablePropTypes.list.isRequired,
  };

  componentDidMount () {
    const { onInitialize, listId } = this.props;
    onInitialize(listId);
  }

  componentWillUnmount () {
    const { onReset } = this.props;
    onReset();
  }

  onClickClose = () => {
    this.props.onClose('LIST_ADDER');
  };

  render () {
    const { accountIds, searchAccountIds, onClear, intl } = this.props;
    const showSearch = searchAccountIds.size > 0;

    return (
      <div className='modal-root__modal compose-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'>
            {intl.formatMessage(messages.editList)}
          </h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
        </div>
        <div className='compose-modal__content'>
          <div className='list-editor'>
            <ColumnSubheading text={intl.formatMessage(messages.changeTitle)} />
            <EditListForm />
            <br/>

            {
              accountIds.size > 0 &&
              <div>
                <ColumnSubheading text={intl.formatMessage(messages.removeFromList)} />
                <div className='list-editor__accounts'>
                  {accountIds.map(accountId => <Account key={accountId} accountId={accountId} added />)}
                </div>
              </div>
            }

            <br/>
            <ColumnSubheading text={intl.formatMessage(messages.addToList)} />
            <Search />
            <div className='list-editor__accounts'>
              {searchAccountIds.map(accountId => <Account key={accountId} accountId={accountId} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
