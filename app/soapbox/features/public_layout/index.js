import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Switch, Route } from 'react-router-dom';
import NotificationsContainer from 'soapbox/features/ui/containers/notifications_container';
import Header from './components/header';
import Footer from './components/footer';
import LandingPage from '../landing_page';
import AboutPage from '../about';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
  soapbox: state.get('soapbox'),
});

class PublicLayout extends ImmutablePureComponent {

  render() {
    const { instance } = this.props;
    if (instance.isEmpty()) return null;

    return (
      <div className='public-layout'>
        <Header />
        <div className='container'>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/about/:slug?' component={AboutPage} />
          </Switch>
        </div>
        <Footer />
        <NotificationsContainer />
      </div>
    );
  }

}

export default connect(mapStateToProps)(PublicLayout);
