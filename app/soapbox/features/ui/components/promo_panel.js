import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { getSettings } from 'soapbox/actions/settings';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Icon from 'soapbox/components/icon';

const mapStateToProps = state => ({
  promoItems: getSoapboxConfig(state).getIn(['promoPanel', 'items']),
  locale: getSettings(state).get('locale'),
});

export default @connect(mapStateToProps)
class PromoPanel extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string,
    promoItems: ImmutablePropTypes.list,
  }

  render() {
    const { locale, promoItems } = this.props;
    if (!promoItems || promoItems.isEmpty()) return null;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          {promoItems.map((item, i) =>
            (<a className='promo-panel-item' href={item.get('url')} target='_blank' key={i}>
              <Icon id={item.get('icon')} className='promo-panel-item__icon' fixedWidth />
              {item.getIn(['textLocales', locale]) || item.get('text')}
            </a>),
          )}
        </div>
      </div>
    );
  }

}
