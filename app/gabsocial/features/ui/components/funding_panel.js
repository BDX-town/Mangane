import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ProgressBar from '../../../components/progress_bar';
import { fetchFunding } from 'gabsocial/actions/patron';

class FundingPanel extends ImmutablePureComponent {

  componentDidMount () {
    this.props.dispatch(fetchFunding());
  }

  render() {
    const { funding } = this.props;

    if (!funding) {
      return null;
    }

    const goal = funding.getIn(['goals', '0', 'amount']);
    const goal_text = funding.getIn(['goals', '0', 'text']);
    const goal_reached = funding.get('amount') >= goal;
    let ratio_text;

    if (goal_reached) {
      ratio_text = <><strong>${Math.floor(goal/100)}</strong> per month<span className='funding-panel__reached'>&mdash; reached!</span></>;
    } else {
      ratio_text = <><strong>${Math.floor(funding.get('amount')/100)} out of ${Math.floor(goal/100)}</strong> per month</>;
    }

    return (
      <div className='wtf-panel funding-panel'>
        <div className='wtf-panel-header'>
          <i role='img' alt='users' className='fa fa-line-chart wtf-panel-header__icon'></i>
          <span className='wtf-panel-header__label'>
            <span>Funding Goal</span>
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='funding-panel__ratio'>
            {ratio_text}
          </div>
          <ProgressBar progress={funding.get('amount')/goal} />
          <div className='funding-panel__description'>
            {goal_text}
          </div>
          <a className='button' href='/donate'>Donate</a>
        </div>
      </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    funding: state.getIn(['patron', 'funding'])
  };
};

export default injectIntl(
  connect(mapStateToProps, null, null, {
    forwardRef: true,
  }
)(FundingPanel))
