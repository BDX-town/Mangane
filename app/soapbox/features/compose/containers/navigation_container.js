import { connect }   from 'react-redux';
import NavigationBar from '../components/navigation_bar';

const mapStateToProps = state => {
  const me = state.get('me');
  return {
    account: state.getIn(['accounts', me]),
  };
};

export default connect(mapStateToProps)(NavigationBar);
