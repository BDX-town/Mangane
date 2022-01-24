import { connect } from 'react-redux';

import { changeComposeSpoilerness } from '../../../actions/compose';
import SpoilerButton from '../components/spoiler_button';

const mapStateToProps = (state, { intl }) => ({
  active: state.getIn(['compose', 'spoiler']),
});

const mapDispatchToProps = dispatch => ({

  onClick() {
    dispatch(changeComposeSpoilerness());
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(SpoilerButton);
