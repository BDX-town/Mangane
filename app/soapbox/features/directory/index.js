import classNames from 'classnames';
import { List as ImmutableList } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { fetchDirectory, expandDirectory } from 'soapbox/actions/directory';
import LoadMore from 'soapbox/components/load_more';
import RadioButton from 'soapbox/components/radio_button';
import Column from 'soapbox/features/ui/components/column';
import { getFeatures } from 'soapbox/utils/features';

import AccountCard from './components/account_card';

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
  title: state.getIn(['instance', 'title']),
  features: getFeatures(state.get('instance')),
});

export default @connect(mapStateToProps)
@injectIntl
class Directory extends React.PureComponent {

  static propTypes = {
    isLoading: PropTypes.bool,
    accountIds: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
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
    const { isLoading, accountIds, intl, title, features } = this.props;
    const { order, local }  = this.getParams(this.props, this.state);

    return (
      <Column icon='address-book-o' label={intl.formatMessage(messages.title)}>
        <div className='directory__filter-form'>
          <div className='directory__filter-form__column' role='group'>
            <RadioButton name='order' value='active' label={intl.formatMessage(messages.recentlyActive)} checked={order === 'active'} onChange={this.handleChangeOrder} />
            <RadioButton name='order' value='new' label={intl.formatMessage(messages.newArrivals)} checked={order === 'new'} onChange={this.handleChangeOrder} />
          </div>

          {features.federating && (
            <div className='directory__filter-form__column' role='group'>
              <RadioButton name='local' value='1' label={intl.formatMessage(messages.local, { domain: title })} checked={local} onChange={this.handleChangeLocal} />
              <RadioButton name='local' value='0' label={intl.formatMessage(messages.federated)} checked={!local} onChange={this.handleChangeLocal} />
            </div>
          )}
        </div>

        <div className={classNames('directory__list', { loading: isLoading })}>
          {accountIds.map(accountId => <AccountCard id={accountId} key={accountId} />)}
        </div>

        <LoadMore onClick={this.handleLoadMore} visible={!isLoading} />
      </Column>
    );
  }

}