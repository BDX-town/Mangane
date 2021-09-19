import React from 'react';
import { connect } from 'react-redux';
import { expandHomeTimeline } from '../../actions/timelines';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { getFeatures } from 'soapbox/utils/features';

function FollowRecommendationsContainer() {
  return import(/* webpackChunkName: "features/follow_recommendations" */'soapbox/features/follow_recommendations/components/follow_recommendations_container');
}

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const mapStateToProps = state => {
  const instance = state.get('instance');
  const features = getFeatures(instance);

  return {
    hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
    isPartial: state.getIn(['timelines', 'home', 'isPartial']),
    siteTitle: state.getIn(['instance', 'title']),
    isLoading: state.getIn(['timelines', 'home', 'isLoading'], true),
    isEmpty: state.getIn(['timelines', 'home', 'items'], ImmutableOrderedSet()).isEmpty(),
    features,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class HomeTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    isPartial: PropTypes.bool,
    siteTitle: PropTypes.string,
    isLoading: PropTypes.bool,
    isEmpty: PropTypes.bool,
    features: PropTypes.object.isRequired,
  };

  state = {
    done: false,
  }

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }));
  }

  componentDidMount() {
    this._checkIfReloadNeeded(false, this.props.isPartial);
  }

  componentDidUpdate(prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial);
  }

  componentWillUnmount() {
    this._stopPolling();
  }

  _checkIfReloadNeeded(wasPartial, isPartial) {
    const { dispatch } = this.props;

    if (wasPartial === isPartial) {
      return;
    } else if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else if (wasPartial && !isPartial) {
      this._stopPolling();
    }
  }

  _stopPolling() {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }

  handleDone = e => {
    this.props.dispatch(expandHomeTimeline());
    this.setState({ done: true });
  }

  render() {
    const { intl, siteTitle, isLoading, isEmpty, features } = this.props;
    const { done } = this.state;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        {(features.suggestions && isEmpty && !isLoading && !done) ? (
          <BundleContainer fetchComponent={FollowRecommendationsContainer}>
            {Component => <Component onDone={this.handleDone} />}
          </BundleContainer>
        ) : (
          <StatusListContainer
            scrollKey='home_timeline'
            onLoadMore={this.handleLoadMore}
            timelineId='home'
            emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Visit {public} to get started and meet other users.' values={{ public: <Link to='/timeline/local'><FormattedMessage id='empty_column.home.local_tab' defaultMessage='the {site_title} tab' values={{ site_title: siteTitle }} /></Link> }} />}
          />
        )}
      </Column>
    );
  }

}
