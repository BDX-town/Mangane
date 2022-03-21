import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Button, Spinner } from 'soapbox/components/ui';
import Column from 'soapbox/features/ui/components/column';

import { fetchList, deleteList } from '../../actions/lists';
import { openModal } from '../../actions/modals';
import { connectListStream } from '../../actions/streaming';
import { expandListTimeline } from '../../actions/timelines';
import MissingIndicator from '../../components/missing_indicator';
import StatusListContainer from '../ui/containers/status_list_container';

const messages = defineMessages({
  deleteHeading: { id: 'confirmations.delete_list.heading', defaultMessage: 'Delete list' },
  deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
  deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
});

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
  // hasUnread: state.getIn(['timelines', `list:${props.params.id}`, 'unread']) > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class ListTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    // hasUnread: PropTypes.bool,
    list: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool]),
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.handleConnect(this.props.params.id);
  }

  componentWillUnmount() {
    this.handleDisconnect();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.handleDisconnect();
      this.handleConnect(this.props.params.id);
    }
  }

  handleConnect(id) {
    const { dispatch } = this.props;

    dispatch(fetchList(id));
    dispatch(expandListTimeline(id));

    this.disconnect = dispatch(connectListStream(id));
  }

  handleDisconnect() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { id } = this.props.params;
    this.props.dispatch(expandListTimeline(id, { maxId }));
  }

  handleEditClick = () => {
    this.props.dispatch(openModal('LIST_EDITOR', { listId: this.props.params.id }));
  }

  handleDeleteClick = () => {
    const { dispatch, intl } = this.props;
    const { id } = this.props.params;

    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/icons/trash.svg'),
      heading: intl.formatMessage(messages.deleteHeading),
      message: intl.formatMessage(messages.deleteMessage),
      confirm: intl.formatMessage(messages.deleteConfirm),
      onConfirm: () => {
        dispatch(deleteList(id));
        this.context.router.history.push('/lists');
      },
    }));
  }

  render() {
    const { list } = this.props;
    const { id } = this.props.params;
    const title  = list ? list.get('title') : id;

    if (typeof list === 'undefined') {
      return (
        <Column>
          <div>
            <Spinner />
          </div>
        </Column>
      );
    } else if (list === false) {
      return (
        <MissingIndicator />
      );
    }

    const emptyMessage = (
      <div>
        <FormattedMessage id='empty_column.list' defaultMessage='There is nothing in this list yet. When members of this list create new posts, they will appear here.' />
        <br /><br />
        <Button onClick={this.handleEditClick}><FormattedMessage id='list.click_to_add' defaultMessage='Click here to add people' /></Button>
      </div>
    );

    return (
      <Column label={title} heading={title} transparent>
        {/* <HomeColumnHeader activeItem='lists' activeSubItem={id} active={hasUnread}>
          <div className='column-header__links'>
            <button className='text-btn column-header__setting-btn' tabIndex='0' onClick={this.handleEditClick}>
              <Icon id='pencil' /> <FormattedMessage id='lists.edit' defaultMessage='Edit list' />
            </button>

            <button className='text-btn column-header__setting-btn' tabIndex='0' onClick={this.handleDeleteClick}>
              <Icon id='trash' /> <FormattedMessage id='lists.delete' defaultMessage='Delete list' />
            </button>

            <hr />

            <Link to='/lists' className='text-btn column-header__setting-btn column-header__setting-btn--link'>
              <FormattedMessage id='lists.view_all' defaultMessage='View all lists' />
              <Icon id='arrow-right' />
            </Link>
          </div>
        </HomeColumnHeader> */}

        <StatusListContainer
          scrollKey='list_timeline'
          timelineId={`list:${id}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
        />
      </Column>
    );
  }

}
