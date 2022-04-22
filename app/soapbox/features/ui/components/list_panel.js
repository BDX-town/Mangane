import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { createSelector } from 'reselect';

import { fetchLists } from 'soapbox/actions/lists';
import Icon from 'soapbox/components/icon';

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title'))).take(4);
});

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
});

export default @withRouter
@connect(mapStateToProps)
class ListPanel extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchLists());
  }

  render() {
    const { lists } = this.props;

    if (!lists || lists.isEmpty()) {
      return null;
    }

    return (
      <div>
        <hr />

        {lists.map(list => (
          <NavLink key={list.get('id')} className='column-link column-link--transparent' strict to={`/list/${list.get('id')}`}><Icon className='column-link__icon' id='list-ul' fixedWidth />{list.get('title')}</NavLink>
        ))}
      </div>
    );
  }

}
