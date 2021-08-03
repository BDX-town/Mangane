import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandHashtagTimeline, clearTimeline } from '../../actions/timelines';
import { FormattedMessage } from 'react-intl';
import { connectHashtagStream } from '../../actions/streaming';
import { isEqual } from 'lodash';
import ColumnBackButton from '../../components/column_back_button';

const mapStateToProps = (state, props) => ({
  hasUnread: state.getIn(['timelines', `hashtag:${props.params.id}`, 'unread']) > 0,
});

export default @connect(mapStateToProps)
class HashtagTimeline extends React.PureComponent {

  disconnects = [];

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasUnread: PropTypes.bool,
  };

  title = () => {
    const title = [this.props.params.id];

    if (this.additionalFor('any')) {
      title.push(' ', <FormattedMessage key='any' id='hashtag.column_header.tag_mode.any'  values={{ additional: this.additionalFor('any') }} defaultMessage='or {additional}' />);
    }

    if (this.additionalFor('all')) {
      title.push(' ', <FormattedMessage key='all' id='hashtag.column_header.tag_mode.all'  values={{ additional: this.additionalFor('all') }} defaultMessage='and {additional}' />);
    }

    if (this.additionalFor('none')) {
      title.push(' ', <FormattedMessage key='none' id='hashtag.column_header.tag_mode.none' values={{ additional: this.additionalFor('none') }} defaultMessage='without {additional}' />);
    }

    return title;
  }

  additionalFor = (mode) => {
    const { tags } = this.props.params;

    if (tags && (tags[mode] || []).length > 0) {
      return tags[mode].map(tag => tag.value).join('/');
    } else {
      return '';
    }
  }

  _subscribe(dispatch, id, tags = {}) {
    const any  = (tags.any || []).map(tag => tag.value);
    const all  = (tags.all || []).map(tag => tag.value);
    const none = (tags.none || []).map(tag => tag.value);

    [id, ...any].map(tag => {
      this.disconnects.push(dispatch(connectHashtagStream(id, tag, status => {
        const tags = status.tags.map(tag => tag.name);

        return all.filter(tag => tags.includes(tag)).length === all.length &&
               none.filter(tag => tags.includes(tag)).length === 0;
      })));
    });
  }

  _unsubscribe() {
    this.disconnects.map(disconnect => disconnect());
    this.disconnects = [];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id, tags } = this.props.params;

    this._subscribe(dispatch, id, tags);
    dispatch(expandHashtagTimeline(id, { tags }));
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    const { id, tags } = this.props.params;
    const { id: prevId, tags: prevTags } = prevProps.params;

    if (id !== prevId || !isEqual(tags, prevTags)) {
      this._unsubscribe();
      this._subscribe(dispatch, id, tags);
      dispatch(clearTimeline(`hashtag:${id}`));
      dispatch(expandHashtagTimeline(id, { tags }));
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  handleLoadMore = maxId => {
    const { id, tags } = this.props.params;
    this.props.dispatch(expandHashtagTimeline(id, { maxId, tags }));
  }

  render() {
    const { hasUnread } = this.props;
    const { id } = this.props.params;

    return (
      <Column label={`#${id}`}>
        <ColumnBackButton />
        <ColumnHeader icon='hashtag' active={hasUnread} title={this.title()} />
        <StatusListContainer
          scrollKey='hashtag_timeline'
          timelineId={`hashtag:${id}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        />
      </Column>
    );
  }

}
