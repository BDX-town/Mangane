import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LandingGradient from 'soapbox/components/landing-gradient';
import { useAppSelector } from 'soapbox/hooks';
import { isStandalone } from 'soapbox/utils/state';

import AboutPage from '../about';
import LandingPage from '../landing_page';
import MobilePage from '../mobile';

import Footer from './components/footer';
import Header from './components/header';

const PublicLayout = () => {
  const standalone = useAppSelector((state) => isStandalone(state));

  if (standalone) {
    return <Redirect to='/login/external' />;
  }

  return (
    <div className='h-full'>
      <LandingGradient />

      <div className='flex flex-col h-screen'>
        <div className='flex-shrink-0'>
          <Header />

          <div className='relative'>
            <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/about/:slug?' component={AboutPage} />
              <Route exact path='/mobile/:slug?' component={MobilePage} />
            </Switch>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
