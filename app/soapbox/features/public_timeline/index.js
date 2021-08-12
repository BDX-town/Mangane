import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnSettingsContainer from './containers/column_settings_container';
import HomeColumnHeader from '../../components/home_column_header';
import Accordion from 'soapbox/features/ui/components/accordion';
import PinnedHostsPicker from '../remote_timeline/components/pinned_hosts_picker';
import { expandPublicTimeline } from '../../actions/timelines';
import { connectPublicStream } from '../../actions/streaming';
import { Link } from 'react-router-dom';
import { changeSetting, getSettings } from 'soapbox/actions/settings';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Federated timeline' },
  dismiss: { id: 'fediverse_tab.explanation_box.dismiss', defaultMessage: 'Don\'t show again' },
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
    showExplanationBox: settings.get('showExplanationBox'),
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
    showExplanationBox: PropTypes.bool,
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

  explanationBoxMenu = () => {
    const { intl } = this.props;
    return [{ text: intl.formatMessage(messages.dismiss), action: this.dismissExplanationBox }];
  }

  dismissExplanationBox = () => {
    this.props.dispatch(changeSetting(['showExplanationBox'], false));
  }

  toggleExplanationBox = (setting) => {
    this.props.dispatch(changeSetting(['explanationBox'], setting));
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;
    dispatch(expandPublicTimeline({ maxId, onlyMedia }));
  }

  render() {
    const { intl, hasUnread, onlyMedia, timelineId, siteTitle, showExplanationBox, explanationBoxExpanded } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <HomeColumnHeader activeItem='fediverse' active={hasUnread} >
          <ColumnSettingsContainer />
        </HomeColumnHeader>
        <PinnedHostsPicker />
        {showExplanationBox && <div className='explanation-box'>
          <Accordion
            headline={<FormattedMessage id='fediverse_tab.explanation_box.title' defaultMessage='What is the Fediverse?' />}
            menu={this.explanationBoxMenu()}
            expanded={explanationBoxExpanded}
            onToggle={this.toggleExplanationBox}
          >
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
          </Accordion>
        </div>}
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
