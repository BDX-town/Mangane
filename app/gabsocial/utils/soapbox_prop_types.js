import PropTypes from 'prop-types';

export default {
  me: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([false, null]),
  ]),
  meLoggedIn: PropTypes.string,
};
