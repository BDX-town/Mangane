import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';


export default class ProgressBar extends ImmutablePureComponent {

  render() {
    const { progress } = this.props;

    return (
      <div className='progress-bar'>
        <div className='progress-bar__progress' style={{ width: `${Math.floor(progress*100)}%` }} />
      </div>
    );
  }

}
