import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Icon from 'soapbox/components/icon';

import { removeFromListAdder, addToListAdder } from '../../../actions/lists';
import IconButton from '../../../components/icon_button';

const messages = defineMessages({
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
});

const MapStateToProps = (state, { listId, added }) => ({
  list: state.get('lists').get(listId),
  added: typeof added === 'undefined' ? state.getIn(['listAdder', 'lists', 'items']).includes(listId) : added,
});

const mapDispatchToProps = (dispatch, { listId }) => ({
  onRemove: () => dispatch(removeFromListAdder(listId)),
  onAdd: () => dispatch(addToListAdder(listId)),
});

export default @connect(MapStateToProps, mapDispatchToProps)
@injectIntl
class List extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  render() {
    const { list, intl, onRemove, onAdd, added } = this.props;

    let button;

    if (added) {
      button = <IconButton src={require('@tabler/icons/icons/x.svg')} title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
    } else {
      button = <IconButton src={require('@tabler/icons/icons/plus.svg')} title={intl.formatMessage(messages.add)} onClick={onAdd} />;
    }

    return (
      <div className='list'>
        <div className='list__wrapper'>
          <div className='list__display-name'>
            <Icon id='list-ul' className='column-link__icon' fixedWidth />
            {list.get('title')}
          </div>

          <div className='account__relationship'>
            {button}
          </div>
        </div>
      </div>
    );
  }

}
