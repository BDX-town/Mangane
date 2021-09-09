import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Switch, Route, Redirect } from 'react-router-dom';
import NotificationsContainer from 'soapbox/features/ui/containers/notifications_container';
import ModalContainer from 'soapbox/features/ui/containers/modal_container';
import Header from './components/header';
import Footer from './components/footer';
import LandingPage from '../landing_page';
import AboutPage from '../about';
import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import { isStandalone } from 'soapbox/utils/state';

const mapStateToProps = (state, props) => ({
  soapbox: getSoapboxConfig(state),
  standalone: isStandalone(state),
});

const wave = (
  <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 889' width='1440px' height='889px' preserveAspectRatio='none'>
    <path d='M 0 0 L 0 851.82031 C 115.03104 776.54213 236.097 723.10606 363.20703 691.54492 C 640.06491 622.80164 852.93698 468.14039 954.31055 358.01367 C 1092.1151 208.31032 1206.0509 47.69868 1365.3828 13.457031 C 1391.8162 7.7762737 1416.6827 3.2957237 1440 0.001953125 L 1440 0 L 0 0 z' fill='var(--background-color)' />
  </svg>
);

class PublicLayout extends ImmutablePureComponent {

  render() {
    const { standalone } = this.props;

    if (standalone) {
      return <Redirect to='/auth/external' />;
    }

    return (
      <div className='public-layout'>
        <div className='public-layout__top'>
          {wave}
          <Header />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/about/:slug?' component={AboutPage} />
            </Switch>
          </div>
        </div>
        <Footer />
        <NotificationsContainer />
        <ModalContainer />
      </div>
    );
  }

}

export default connect(mapStateToProps)(PublicLayout);
