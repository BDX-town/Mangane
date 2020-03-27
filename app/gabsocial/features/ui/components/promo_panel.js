import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';
import ProBadge from 'gabsocial/components/pro_badge';
import { connect } from 'react-redux';
import { me, promoItems } from '../../../initial_state';

export default
class PromoPanel extends React.PureComponent {

  render() {
    if (!promoItems) return null;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          {promoItems.map((item, i) =>
            <div className='promo-panel-item' key={i}>
              <a className='promo-panel-item__btn' href={item.url} target='_blank'>
                <Icon id={item.icon} className='promo-panel-item__icon' fixedWidth />
                {item.text}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
}
