import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const mapStateToProps = state => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
});

class Header extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    submitted: PropTypes.bool,
  };

  state = {
    submittedValue: '',
  };

  componentDidUpdate(prevProps) {
    if (this.props.submitted) {
      const submittedValue = this.props.value;
      this.setState({ submittedValue });
    }
  }

  render() {
    const { submittedValue } = this.state;

    if (!submittedValue) {
      return null;
    }

    return (
      <div className='search-header'>
        <div className='search-header__text-container'>
          <h1 className='search-header__title-text'>
            {submittedValue}
          </h1>
        </div>
        <div className='search-header__type-filters'>
          <div className='account__section-headline'>
            <div className='search-header__type-filters-tabs'>
              <NavLink to='/search' activeClassName='active'>
                <FormattedMessage id='search_results.top' defaultMessage='Top' />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Header);
