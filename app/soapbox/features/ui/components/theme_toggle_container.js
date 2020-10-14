import { connect } from 'react-redux';
import { changeSetting, getSettings } from 'soapbox/actions/settings';
import ThemeToggle from './theme_toggle';

const mapStateToProps = state => {
  return {
    settings: getSettings(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onToggle(setting) {
    dispatch(changeSetting(['themeMode'], setting));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggle);
