import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { openComposeWithText } from '../../actions/compose';

const mapDispatchToProps = dispatch => ({

  onShare: (text) => {
    dispatch(openComposeWithText(text));
  },

});

export default @connect(null, mapDispatchToProps)
class Share extends React.Component {

  static propTypes = {
    onShare: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const params = new URLSearchParams(window.location.search);

    const text = [
      params.get('title'),
      params.get('text'),
      params.get('url'),
    ]
      .filter(v => v)
      .join('\n\n');

    if (text) {
      this.props.onShare(text);
    }
  }

  render() {
    return (
      <Redirect to='/' />
    );
  }

}
