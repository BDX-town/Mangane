import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'soapbox/components/icon';
import { connect } from 'react-redux';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

const mapStateToProps = state => ({
  promoItems: getSoapboxConfig(state).getIn(['promoPanel', 'items']),
});

export default @connect(mapStateToProps)
class PromoPanel extends React.PureComponent {

  static propTypes = {
    promoItems: ImmutablePropTypes.list,
  }

  render() {
    const { promoItems } = this.props;
    if (!promoItems) return null;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          {promoItems.map((item, i) =>
            (<a className='promo-panel-item' href={item.get('url')} target='_blank' key={i}>
              <Icon id={item.get('icon')} className='promo-panel-item__icon' fixedWidth />
              {item.get('text')}
            </a>),
          )}
        </div>
      </div>
    );
  }

}
