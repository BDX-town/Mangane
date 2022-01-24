import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Icon from 'soapbox/components/icon';

import { fetchTrends } from '../../../actions/trends';
import Hashtag from '../../../components/hashtag';

class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    trends: ImmutablePropTypes.list.isRequired,
    fetchTrends: PropTypes.func.isRequired,
    limit: PropTypes.number,
  };

  componentDidMount() {
    this.props.fetchTrends();
  }

  render() {
    const trends = this.props.trends.sort((a, b) => {
      const num_a = Number(a.getIn(['history', 0, 'accounts']));
      const num_b = Number(b.getIn(['history', 0, 'accounts']));
      return num_b - num_a;
    }).slice(0, this.props.limit);

    if (trends.isEmpty()) {
      return null;
    }

    return (
      <div className='wtf-panel'>
        <div className='wtf-panel-header'>
          <Icon src={require('@tabler/icons/icons/hash.svg')} className='wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <FormattedMessage id='trends.title' defaultMessage='Trends' />
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='wtf-panel__list'>
            {trends && trends.map(hashtag => (
              <Hashtag key={hashtag.get('name')} hashtag={hashtag} />
            ))}
          </div>
        </div>
      </div>
    );
  }

}


const mapStateToProps = state => ({
  trends: state.getIn(['trends', 'items']),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchTrends: () => dispatch(fetchTrends()),
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  },
  )(TrendsPanel));
