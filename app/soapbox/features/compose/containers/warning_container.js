import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Warning from '../components/warning';

const APPROX_HASHTAG_RE = /(?:^|[^\/\)\w])#(\w*[a-zA-Z·]\w*)/i;

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    needsLockWarning: state.getIn(['compose', 'privacy']) === 'private' && !state.getIn(['accounts', me, 'locked']),
    hashtagWarning: state.getIn(['compose', 'privacy']) !== 'public' && APPROX_HASHTAG_RE.test(state.getIn(['compose', 'text'])),
    directMessageWarning: state.getIn(['compose', 'privacy']) === 'direct',
  };
};

const WarningWrapper = ({ needsLockWarning, hashtagWarning, directMessageWarning }) => {
  if (needsLockWarning) {
    return <Warning message={<FormattedMessage id='compose_form.lock_disclaimer' defaultMessage='Your account is not {locked}. Anyone can follow you to view your follower-only posts.' values={{ locked: <Link to='/settings/profile'><FormattedMessage id='compose_form.lock_disclaimer.lock' defaultMessage='locked' /></Link> }} />} />;
  }

  if (hashtagWarning) {
    return <Warning message={<FormattedMessage id='compose_form.hashtag_warning' defaultMessage="This post won't be listed under any hashtag as it is unlisted. Only public posts can be searched by hashtag." />} />;
  }

  if (directMessageWarning) {
    const message = (
      <span>
        <FormattedMessage id='compose_form.direct_message_warning' defaultMessage='This post will only be sent to the mentioned users.' />
        {/* <a href='/about/tos' target='_blank'><FormattedMessage id='compose_form.direct_message_warning_learn_more' defaultMessage='Learn more' /></a> */}
      </span>
    );

    return <Warning message={message} />;
  }

  return null;
};

WarningWrapper.propTypes = {
  needsLockWarning: PropTypes.bool,
  hashtagWarning: PropTypes.bool,
  directMessageWarning: PropTypes.bool,
};

export default connect(mapStateToProps)(WarningWrapper);
