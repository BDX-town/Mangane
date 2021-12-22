import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from 'soapbox/components/column';
import ColumnHeader from 'soapbox/components/column_header';
import { fetchDirectory, expandDirectory } from 'soapbox/actions/directory';
import { List as ImmutableList } from 'immutable';
import AccountCard from './components/account_card';
import RadioButton from 'soapbox/components/radio_button';
import classNames from 'classnames';
import LoadMore from 'soapbox/components/load_more';
import { ScrollContainer } from 'react-router-scroll-4';
import { getFeatures } from 'soapbox/utils/features';

const messages = defineMessages({
  title: { id: 'column.directory', defaultMessage: 'Browse profiles' },
  recentlyActive: { id: 'directory.recently_active', defaultMessage: 'Recently active' },
  newArrivals: { id: 'directory.new_arrivals', defaultMessage: 'New arrivals' },
  local: { id: 'directory.local', defaultMessage: 'From {domain} only' },
  federated: { id: 'directory.federated', defaultMessage: 'From known fediverse' },
});

const mapStateToProps = state => ({
  accountIds: state.getIn(['user_lists', 'directory', 'items'], ImmutableList()),
  isLoading: state.getIn(['user_lists', 'directory', 'isLoading'], true),
  domain: state.getIn(['meta', 'domain']),
  features: getFeatures(state.get('instance')),
});

export default @connect(mapStateToProps)
@injectIntl
class Directory extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    isLoading: PropTypes.bool,
    accountIds: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    shouldUpdateScroll: PropTypes.func,
    columnId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    params: PropTypes.shape({
      order: PropTypes.string,
      local: PropTypes.bool,
    }),
    features: PropTypes.object.isRequired,
  };

  state = {
    order: null,
    local: null,
  };

  getParams = (props, state) => ({
    order: state.order === null ? (props.params.order || 'active') : state.order,
    local: state.local === null ? (props.params.local || false) : state.local,
  });

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDirectory(this.getParams(this.props, this.state)));
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;
    const paramsOld = this.getParams(prevProps, prevState);
    const paramsNew = this.getParams(this.props, this.state);

    if (paramsOld.order !== paramsNew.order || paramsOld.local !== paramsNew.local) {
      dispatch(fetchDirectory(paramsNew));
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleChangeOrder = e => {
    this.setState({ order: e.target.value });
  }

  handleChangeLocal = e => {
    this.setState({ local: e.target.value === '1' });
  }

  handleLoadMore = () => {
    const { dispatch } = this.props;
    dispatch(expandDirectory(this.getParams(this.props, this.state)));
  }

  render() {
    const { isLoading, accountIds, intl, columnId, multiColumn, domain, shouldUpdateScroll, features } = this.props;
    const { order, local }  = this.getParams(this.props, this.state);
    const pinned = !!columnId;

    const scrollableArea = (
      <div className='scrollable' style={{ background: 'transparent' }}>
        <div className='filter-form'>
          <div className='filter-form__column' role='group'>
            <RadioButton name='order' value='active' label={intl.formatMessage(messages.recentlyActive)} checked={order === 'active'} onChange={this.handleChangeOrder} />
            <RadioButton name='order' value='new' label={intl.formatMessage(messages.newArrivals)} checked={order === 'new'} onChange={this.handleChangeOrder} />
          </div>

          {features.federating && (
            <div className='filter-form__column' role='group'>
              <RadioButton name='local' value='1' label={intl.formatMessage(messages.local, { domain })} checked={local} onChange={this.handleChangeLocal} />
              <RadioButton name='local' value='0' label={intl.formatMessage(messages.federated)} checked={!local} onChange={this.handleChangeLocal} />
            </div>
          )}
        </div>

        <div className={classNames('directory__list', { loading: isLoading })}>
          {accountIds.map(accountId => <AccountCard id={accountId} key={accountId} />)}
        </div>

        <LoadMore onClick={this.handleLoadMore} visible={!isLoading} />
      </div>
    );

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='address-book-o'
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        />

        {multiColumn && !pinned ? <ScrollContainer scrollKey='directory' shouldUpdateScroll={shouldUpdateScroll}>{scrollableArea}</ScrollContainer> : scrollableArea}
      </Column>
    );
  }

}