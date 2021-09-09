import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeGetAccount } from '../../../selectors';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Avatar from '../../../components/avatar';
import DisplayName from '../../../components/display_name';
import IconButton from '../../../components/icon_button';
import { defineMessages, injectIntl } from 'react-intl';
import { addToAliases } from '../../../actions/aliases';

const messages = defineMessages({
  add: { id: 'aliases.account.add', defaultMessage: 'Create alias' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId, added }) => {
    const me = state.get('me');
    const ownAccount = getAccount(state, me);

    const account = getAccount(state, accountId);
    const apId = account.getIn(['pleroma', 'ap_id']);

    return {
      account,
      apId,
      added: typeof added === 'undefined' ? ownAccount.getIn(['pleroma', 'also_known_as']).includes(apId) : added,
      me,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  onAdd: (intl, apId) => dispatch(addToAliases(intl, apId)),
});

export default @connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    apId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  handleOnAdd = () => this.props.onAdd(this.props.intl, this.props.apId);

  render() {
    const { account, accountId, intl, added, me } = this.props;

    let button;

    if (!added && accountId !== me) {
      button = (
        <div className='account__relationship'>
          <IconButton icon='plus' title={intl.formatMessage(messages.add)} onClick={this.handleOnAdd} />
        </div>
      );
    }

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <div className='account__display-name'>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </div>

          {button}
        </div>
      </div>
    );
  }

}
