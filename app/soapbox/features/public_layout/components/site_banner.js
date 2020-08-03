import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  soapbox: state.get('soapbox'),
});

class SiteBanner extends ImmutablePureComponent {

  render() {
    const { instance, soapbox } = this.props;
    const logos = {
      imgLogo:  (<img alt={instance.get('title')} src={soapbox.get('banner')} />),
      textLogo: (<h1>{instance.get('title')}</h1>),
    };
    return soapbox.getIn(['banner']) ? logos.imgLogo : logos.textLogo;
  }

}

export default connect(mapStateToProps)(SiteBanner);
