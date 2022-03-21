import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import {
  NotificationsContainer,
  ModalContainer,
} from 'soapbox/features/ui/util/async-components';
import { isStandalone } from 'soapbox/utils/state';

import AboutPage from '../about';
import BetaPage from '../beta';
import LandingPage from '../landing_page';
import MobilePage from '../mobile';

import Footer from './components/footer';
import Header from './components/header';

const mapStateToProps = (state, props) => ({
  soapbox: getSoapboxConfig(state),
  standalone: isStandalone(state),
});

class PublicLayout extends ImmutablePureComponent {

  render() {
    const { standalone } = this.props;

    if (standalone) {
      return <Redirect to='/auth/external' />;
    }

    return (
      <div className='h-full'>
        <div className='fixed h-screen w-full bg-gradient-to-tr from-primary-50 via-white to-cyan-50' />

        <div className='flex flex-col h-screen'>
          <div className='flex-shrink-0'>
            <Header />

            <div className='public-layout__top'>
              <div className='container'>
                <Switch>
                  <Route exact path='/' component={LandingPage} />
                  <Route exact path='/about/:slug?' component={AboutPage} />
                  <Route exact path='/beta/:slug?' component={BetaPage} />
                  <Route exact path='/mobile/:slug?' component={MobilePage} />
                </Switch>
              </div>
            </div>
          </div>

          <Footer />

          <BundleContainer fetchComponent={NotificationsContainer}>
            {(Component) => <Component />}
          </BundleContainer>

          <BundleContainer fetchComponent={ModalContainer}>
            {(Component) => <Component />}
          </BundleContainer>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(PublicLayout);
