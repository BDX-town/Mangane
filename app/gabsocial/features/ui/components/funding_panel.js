import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ProgressBar from '../../../components/progress_bar';
import { funding } from '../../../initial_state';


class FundingPanel extends ImmutablePureComponent {
  render() {
    const { goal, goal_text } = this.props;
    const goal_reached = funding.amount >= goal;
    let ratio_text;

    if (goal_reached) {
      ratio_text = <><strong>${Math.floor(goal/100)}</strong> per month<span className='funding-panel__reached'>&mdash; reached!</span></>;
    } else {
      ratio_text = <><strong>${Math.floor(funding.amount/100)} out of ${Math.floor(goal/100)}</strong> per month</>;
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
          <ProgressBar progress={funding.amount/goal} />
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
  };
};

export default injectIntl(
  connect(mapStateToProps, null, null, {
    forwardRef: true,
  }
)(FundingPanel))
