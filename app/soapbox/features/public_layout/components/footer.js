import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import { List as ImmutableList } from 'immutable';

const mapStateToProps = (state, props) => ({
  copyright: state.getIn(['soapbox', 'copyright']),
  navlinks: state.getIn(['soapbox', 'navlinks', 'homeFooter'], ImmutableList()),
});

export default @connect(mapStateToProps)
class Footer extends ImmutablePureComponent {

  static propTypes = {
    copyright: PropTypes.string,
    navlinks: ImmutablePropTypes.list,
  }

  render() {
    const { copyright, navlinks } = this.props;

    return (
      <div className='footer'>
        <div className='footer-container'>
          <div className='copyright'>
            <span>{copyright}</span>
          </div>
          <ul>
            {navlinks.map((link, i) => (
              <li key={i}>
                <Link to={link.get('url')}>{link.get('title')}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

}
