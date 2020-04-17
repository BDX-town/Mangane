import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const mapStateToProps = state => ({
  animate: state.getIn(['preferences', 'auto_play_gif']),
});

export default @connect(mapStateToProps)
class AvatarOverlay extends React.PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    friend: ImmutablePropTypes.map.isRequired,
    animate: PropTypes.bool,
  };

  render() {
    const { account, friend, animate } = this.props;

    const baseStyle = {
      backgroundImage: `url(${account.get(animate ? 'avatar' : 'avatar_static')})`,
    };

    const overlayStyle = {
      backgroundImage: `url(${friend.get(animate ? 'avatar' : 'avatar_static')})`,
    };

    return (
      <div className='account__avatar-overlay'>
        <div className='account__avatar-overlay-base' style={baseStyle} />
        <div className='account__avatar-overlay-overlay' style={overlayStyle} />
      </div>
    );
  }

}
