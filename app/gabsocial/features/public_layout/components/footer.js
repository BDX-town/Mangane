import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';

export default class Footer extends ImmutablePureComponent {

  render() {
    return (
      <div className='footer'>
        <div className='footer-container'>
          <div className='copyright'>
            <span>♡{new Date().getFullYear()}. Copying is an act of love. Please copy and share.</span>
          </div>
          <ul>
            <li><Link to='/about'>About</Link></li>
            <li><Link to='/about/tos'>Terms of Service</Link></li>
            <li><Link to='/about/privacy'>Privacy Policy</Link></li>
            <li><Link to='/about/dmca'>DMCA</Link></li>
            <li><Link to='/about#opensource'>Source Code</Link></li>
          </ul>
        </div>
      </div>
    );
  }

}
