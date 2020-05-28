import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, injectIntl } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Hashtag from '../../../components/hashtag';
import Icon from 'soapbox/components/icon';
import WhoToFollowPanel from '../../ui/components/who_to_follow_panel';
import { getFeatures } from 'soapbox/utils/features';

const mapStateToProps = state => ({
  features: getFeatures(state.get('instance')),
});

export default @connect(mapStateToProps)
@injectIntl
class SearchResults extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    features: PropTypes.node,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  render() {
    const { results, features } = this.props;
    const { isSmallScreen } = this.state;

    if (results.isEmpty() && isSmallScreen) {
      return (
        <div className='search-results'>
          {features.suggestions && <WhoToFollowPanel />}
        </div>
      );
    }

    let accounts, statuses, hashtags;
    let count = 0;

    if (results.get('accounts') && results.get('accounts').size > 0) {
      count   += results.get('accounts').size;
      accounts = (
        <div className='search-results__section'>
          <h5><Icon id='users' fixedWidth /><FormattedMessage id='search_results.accounts' defaultMessage='People' /></h5>

          {results.get('accounts').map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      );
    }

    if (results.get('statuses') && results.get('statuses').size > 0) {
      count   += results.get('statuses').size;
      statuses = (
        <div className='search-results__section'>
          <h5><Icon id='quote-right' fixedWidth /><FormattedMessage id='search_results.statuses' defaultMessage='Posts' /></h5>

          {results.get('statuses').map(statusId => <StatusContainer key={statusId} id={statusId} />)}
        </div>
      );
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0) {
      count += results.get('hashtags').size;
      hashtags = (
        <div className='search-results__section'>
          <h5><Icon id='hashtag' fixedWidth /><FormattedMessage id='search_results.hashtags' defaultMessage='Hashtags' /></h5>

          {results.get('hashtags').map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />)}
        </div>
      );
    }

    return (
      <div className='search-results'>
        <div className='search-results__header'>
          <Icon id='search' fixedWidth />
          <FormattedMessage id='search_results.total' defaultMessage='{count, number} {count, plural, one {result} other {results}}' values={{ count }} />
        </div>

        {accounts}
        {statuses}
        {hashtags}
      </div>
    );
  }

}
