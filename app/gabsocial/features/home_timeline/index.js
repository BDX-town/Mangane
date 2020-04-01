import React from 'react';
import { connect } from 'react-redux';
import { expandHomeTimeline } from '../../actions/timelines';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ColumnSettingsContainer from './containers/column_settings_container';
import HomeColumnHeader from '../../components/home_column_header';
import { Link } from 'react-router-dom';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
  siteTitle: state.getIn(['instance', 'title']),
});

export default @connect(mapStateToProps)
@injectIntl
class HomeTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    isPartial: PropTypes.bool,
  };

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }));
  }

  componentDidMount () {
    this._checkIfReloadNeeded(false, this.props.isPartial);
  }

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial);
  }

  componentWillUnmount () {
    this._stopPolling();
  }

  _checkIfReloadNeeded (wasPartial, isPartial) {
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

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }

  render () {
    const { intl, hasUnread, siteTitle} = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <HomeColumnHeader activeItem='home' active={hasUnread}>
          <ColumnSettingsContainer />
        </HomeColumnHeader>
        <StatusListContainer
          scrollKey='home_timeline'
          onLoadMore={this.handleLoadMore}
          timelineId='home'
          emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Visit {public} to get started and meet other users.' values={{ public: <Link to='/timeline/local'><FormattedMessage id='empty_column.home.local_tab' defaultMessage='the {site_title} tab' values={{site_title: siteTitle}} /></Link> }} />}
        />
      </Column>
    );
  }

}
