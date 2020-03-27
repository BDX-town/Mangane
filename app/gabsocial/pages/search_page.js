import React from 'react';
import PropTypes from 'prop-types';
import Header from '../features/search/components/header';
import WhoToFollowPanel from '../features/ui/components/who_to_follow_panel';
// import TrendsPanel from '../features/ui/components/trends_panel';
import LinkFooter from '../features/ui/components/link_footer';
import SignUpPanel from '../features/ui/components/sign_up_panel';

const SearchPage = ({children}) => (
  <div className='page'>
    <div className='page__top'>
      <Header />
    </div>
    <div className='page__columns'>
      <div className='columns-area__panels'>

        <div className='columns-area__panels__pane columns-area__panels__pane--left'>
          <div className='columns-area__panels__pane__inner'>
            {/* <TrendsPanel /> */}
            <LinkFooter />
          </div>
        </div>

        <div className='columns-area__panels__main'>
          <div className='columns-area columns-area--mobile'>
            {children}
          </div>
        </div>

        <div className='columns-area__panels__pane columns-area__panels__pane--right'>
          <div className='columns-area__panels__pane__inner'>
            <SignUpPanel />
            <WhoToFollowPanel />
          </div>
        </div>
      </div>
    </div>
  </div>
);

SearchPage.propTypes = {
  children: PropTypes.node,
};

export default SearchPage;
