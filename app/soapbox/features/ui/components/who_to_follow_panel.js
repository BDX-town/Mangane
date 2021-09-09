import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchSuggestions, dismissSuggestion } from '../../../actions/suggestions';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import AccountContainer from '../../../containers/account_container';

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
});

class WhoToFollowPanel extends ImmutablePureComponent {

  static propTypes = {
    suggestions: ImmutablePropTypes.list.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    dismissSuggestion: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchSuggestions();
  }

  render() {
    const { intl, dismissSuggestion } = this.props;
    const suggestions = this.props.suggestions.slice(0, this.props.limit);

    if (suggestions.isEmpty()) {
      return null;
    }

    return (
      <div className='wtf-panel'>
        <div className='wtf-panel-header'>
          <Icon id='users' className='wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <FormattedMessage id='who_to_follow.title' defaultMessage='Who To Follow' />
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='wtf-panel__list'>
            {suggestions && suggestions.map(accountId => (
              <AccountContainer
                key={accountId}
                id={accountId}
                actionIcon='times'
                actionTitle={intl.formatMessage(messages.dismissSuggestion)}
                onActionClick={dismissSuggestion}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchSuggestions: () => dispatch(fetchSuggestions()),
    dismissSuggestion: account => dispatch(dismissSuggestion(account.get('id'))),
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  },
  )(WhoToFollowPanel));
