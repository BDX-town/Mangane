import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnSettingsContainer from './containers/column_settings_container';
import HomeColumnHeader from '../../components/home_column_header';
import Accordion from 'soapbox/features/ui/components/accordion';
import { expandPublicTimeline } from '../../actions/timelines';
import { connectPublicStream } from '../../actions/streaming';
import { Link } from 'react-router-dom';
import { changeSetting, getSettings } from 'soapbox/actions/settings';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Federated timeline' },
});

const mapStateToProps = state => {
  const settings = getSettings(state);
  const onlyMedia = settings.getIn(['public', 'other', 'onlyMedia']);

  const timelineId = 'public';

  return {
    timelineId,
    onlyMedia,
    hasUnread: state.getIn(['timelines', `${timelineId}${onlyMedia ? ':media' : ''}`, 'unread']) > 0,
    siteTitle: state.getIn(['instance', 'title']),
    explanationBoxExpanded: settings.get('explanationBox'),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    timelineId: PropTypes.string,
    siteTitle: PropTypes.string,
    explanationBoxExpanded: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, onlyMedia } = this.props;
    dispatch(expandPublicTimeline({ onlyMedia }));
    this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;
      this.disconnect();

      dispatch(expandPublicTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
    }
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  toggleExplanationBox = (setting) => {
    this.props.dispatch(changeSetting(['explanationBox'], setting));
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;
    dispatch(expandPublicTimeline({ maxId, onlyMedia }));
  }

  render() {
    const { intl, hasUnread, onlyMedia, timelineId, siteTitle, explanationBoxExpanded } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <HomeColumnHeader activeItem='fediverse' active={hasUnread} >
          <ColumnSettingsContainer />
        </HomeColumnHeader>
        <div className='explanation-box'>
          <Accordion
            headline={<FormattedMessage id='fediverse_tab.explanation_box.title' defaultMessage='What is the Fediverse?' />}
            content={(
              <FormattedMessage
                id='fediverse_tab.explanation_box.explanation'
                defaultMessage='{site_title} is part of the Fediverse, a social network made up of thousands of independent social media sites (aka "servers"). The posts you see here are from 3rd-party servers. You have the freedom to engage with them, or to block any server you don&apos;t like. Pay attention to the full username after the second @ symbol to know which server a post is from. To see only {site_title} posts, visit {local}.'
                values={{
                  site_title: siteTitle,
                  local: (
                    <Link to='/timeline/local'>
                      <FormattedMessage
                        id='empty_column.home.local_tab'
                        defaultMessage='the {site_title} tab'
                        values={{ site_title: siteTitle }}
                      />
                    </Link>
                  ),
                }}
              />
            )}
            expanded={explanationBoxExpanded}
            onToggle={this.toggleExplanationBox}
          />
        </div>
        <StatusListContainer
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
        />
      </Column>
    );
  }

}
