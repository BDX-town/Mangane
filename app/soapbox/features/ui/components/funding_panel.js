import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ProgressBar from '../../../components/progress_bar';
import { fetchPatronInstance } from 'soapbox/actions/patron';

const moneyFormat = amount => (
  new Intl
    .NumberFormat('en-US', {
      style: 'currency',
      currency: 'usd',
      notation: 'compact',
    })
    .format(amount/100)
);

class FundingPanel extends ImmutablePureComponent {

  componentDidMount() {
    this.props.dispatch(fetchPatronInstance());
  }

  render() {
    const { patron, patronUrl } = this.props;
    if (patron.isEmpty()) return null;

    const amount = patron.getIn(['funding', 'amount']);
    const goal = patron.getIn(['goals', '0', 'amount']);
    const goal_text = patron.getIn(['goals', '0', 'text']);
    const goal_reached = amount >= goal;
    let ratio_text;

    if (goal_reached) {
      ratio_text = <><strong>{moneyFormat(goal)}</strong> per month<span className='funding-panel__reached'>&mdash; reached!</span></>;
    } else {
      ratio_text = <><strong>{moneyFormat(amount)} out of {moneyFormat(goal)}</strong> per month</>;
    }

    return (
      <div className='wtf-panel funding-panel'>
        <div className='wtf-panel-header'>
          <i role='img' alt='users' className='fa fa-line-chart wtf-panel-header__icon' />
          <span className='wtf-panel-header__label'>
            <span>Funding Goal</span>
          </span>
        </div>
        <div className='wtf-panel__content'>
          <div className='funding-panel__ratio'>
            {ratio_text}
          </div>
          <ProgressBar progress={amount/goal} />
          <div className='funding-panel__description'>
            {goal_text}
          </div>
          {patronUrl && <a className='button' href={patronUrl}>Donate</a>}
        </div>
      </div>
    );
  }

};

const mapStateToProps = state => {
  return {
    patron: state.get('patron'),
    patronUrl: state.getIn(['soapbox', 'extensions', 'patron', 'baseUrl']),
  };
};

export default injectIntl(
  connect(mapStateToProps, null, null, {
    forwardRef: true,
  }
  )(FundingPanel));
