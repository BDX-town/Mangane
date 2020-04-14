import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';
import ProBadge from 'gabsocial/components/pro_badge';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  promoItems: state.getIn(['soapbox', 'promoPanel', 'items']),
});

export default @connect(mapStateToProps)
class PromoPanel extends React.PureComponent {

  render() {
    const { promoItems } = this.props;
    if (!promoItems) return null;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          {promoItems.map((item, i) =>
            (<div className='promo-panel-item' key={i}>
              <a className='promo-panel-item__btn' href={item.get('url')} target='_blank'>
                <Icon id={item.get('icon')} className='promo-panel-item__icon' fixedWidth />
                {item.get('text')}
              </a>
            </div>)
          )}
        </div>
      </div>
    );
  }

}
