import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getSettings } from 'soapbox/actions/settings';

const mapStateToProps = state => ({
  animate: getSettings(state).get('autoPlayGif'),
});

export default @connect(mapStateToProps)
class Avatar extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    size: PropTypes.number,
    style: PropTypes.object,
    inline: PropTypes.bool,
    animate: PropTypes.bool,
  };

  static defaultProps = {
    inline: false,
  };

  state = {
    hovering: false,
  };

  handleMouseEnter = () => {
    if (this.props.animate) return;
    this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    if (this.props.animate) return;
    this.setState({ hovering: false });
  }

  render() {
    const { account, size, animate, inline } = this.props;
    if (!account) return null;
    const { hovering } = this.state;

    const src = account.get('avatar');
    const staticSrc = account.get('avatar_static');

    let className = 'account__avatar';

    if (inline) {
      className = className + ' account__avatar-inline';
    }

    // : TODO : remove inline and change all avatars to be sized using css
    const style = !size ? {} : {
      width: `${size}px`,
      height: `${size}px`,
    };

    if (hovering || animate) {
      style.backgroundImage = `url(${src})`;
    } else {
      style.backgroundImage = `url(${staticSrc})`;
    }

    return (
      <div
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
      />
    );
  }

}
