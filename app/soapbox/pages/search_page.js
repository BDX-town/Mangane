import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../features/search/components/header';
import WhoToFollowPanel from '../features/ui/components/who_to_follow_panel';
import LinkFooter from '../features/ui/components/link_footer';
import SignUpPanel from '../features/ui/components/sign_up_panel';
import { getFeatures } from 'soapbox/utils/features';

const mapStateToProps = state => ({
  features: getFeatures(state.get('instance')),
});

const SearchPage = ({ children, features }) => (
  <div className='page'>
    <div className='page__top'>
      <Header />
    </div>
    <div className='page__columns'>
      <div className='columns-area__panels'>

        <div className='columns-area__panels__pane columns-area__panels__pane--left'>
          <div className='columns-area__panels__pane__inner'>
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
            {features.suggestions && <WhoToFollowPanel />}
          </div>
        </div>
      </div>
    </div>
  </div>
);

SearchPage.propTypes = {
  children: PropTypes.node,
  features: PropTypes.object,
};

export default connect(mapStateToProps)(SearchPage);
