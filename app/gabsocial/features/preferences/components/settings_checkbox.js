import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { changeSetting } from 'gabsocial/actions/settings';
import { Checkbox } from '../../forms';

const mapStateToProps = state => ({
  settings: state.get('settings'),
});

export default @connect(mapStateToProps)
class SettingsCheckbox extends ImmutablePureComponent {

  static propTypes = {
    label: PropTypes.string,
    path: PropTypes.array.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  }

  handleCheckboxSetting = path => {
    const { dispatch } = this.props;
    return (e) => {
      dispatch(changeSetting(path, e.target.checked));
    };
  }

  render() {
    const { label, path, settings } = this.props;

    return (
      <Checkbox
        label={label}
        checked={settings.getIn(path)}
        onChange={this.handleCheckboxSetting(path)}
      />
    );
  }

}
