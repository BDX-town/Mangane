import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusListContainer from '../../ui/containers/status_list_container';
import Column from '../../../components/column';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connectGroupStream } from '../../../actions/streaming';
import { expandGroupTimeline } from '../../../actions/timelines';
import MissingIndicator from '../../../components/missing_indicator';
import LoadingIndicator from '../../../components/loading_indicator';
import ComposeFormContainer from '../../../../soapbox/features/compose/containers/compose_form_container';
import Avatar from '../../../components/avatar';

const mapStateToProps = (state, props) => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
    group: state.getIn(['groups', props.params.id]),
    relationships: state.getIn(['group_relationships', props.params.id]),
    hasUnread: state.getIn(['timelines', `group:${props.params.id}`, 'unread']) > 0,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class GroupTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    columnId: PropTypes.string,
    hasUnread: PropTypes.bool,
    group: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool]),
    relationships: ImmutablePropTypes.map,
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.params;

    dispatch(expandGroupTimeline(id));

    this.disconnect = dispatch(connectGroupStream(id));
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { id } = this.props.params;
    this.props.dispatch(expandGroupTimeline(id, { maxId }));
  }

  render() {
    const { columnId, group, relationships, account } = this.props;
    const { id } = this.props.params;

    if (typeof group === 'undefined' || !relationships) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    } else if (group === false) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    const acct = account ? account.get('acct') : '';

    return (
      <div>
        {relationships.get('member') && (
          <div className='timeline-compose-block'>
            <Link className='timeline-compose-block__avatar' to={`/@${acct}`}>
              <Avatar account={account} size={46} />
            </Link>
            <ComposeFormContainer group={group} shouldCondense autoFocus={false} />
          </div>
        )}

        <div className='group__feed'>
          <StatusListContainer
            alwaysPrepend
            scrollKey={`group_timeline-${columnId}`}
            timelineId={`group:${id}`}
            onLoadMore={this.handleLoadMore}
            group={group}
            withGroupAdmin={relationships && relationships.get('admin')}
            emptyMessage={<FormattedMessage id='empty_column.group' defaultMessage='There is nothing in this group yet. When members of this group make new posts, they will appear here.' />}
          />
        </div>
      </div>
    );
  }

}
