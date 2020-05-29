import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReducedMotion from './reduced_motion';
import Motion from 'react-motion/lib/Motion';
import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => ({
  reduceMotion: getSettings(state).get('reduceMotion'),
});

const OptionalMotion = props => (
  props.reduceMotion ? <ReducedMotion {...props} /> : <Motion {...props} />
);

OptionalMotion.propTypes = {
  reduceMotion: PropTypes.bool,
};

export default connect(mapStateToProps)(OptionalMotion);
