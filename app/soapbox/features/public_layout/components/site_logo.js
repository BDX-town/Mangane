import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  soapbox: getSoapboxConfig(state),
});

class SiteLogo extends ImmutablePureComponent {

  render() {
    const { instance, soapbox } = this.props;
    const logos = {
      imgLogo:  (<img alt={instance.get('title')} src={soapbox.get('logo')} />),
      textLogo: (<h1>{instance.get('title')}</h1>),
    };
    return soapbox.getIn(['logo']) ? logos.imgLogo : logos.textLogo;
  }

}

export default connect(mapStateToProps)(SiteLogo);
