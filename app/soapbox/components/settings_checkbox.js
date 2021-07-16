import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getSettings, changeSetting } from 'soapbox/actions/settings';
import { Checkbox } from 'soapbox/features/forms';

const mapStateToProps = state => ({
  settings: getSettings(state),
});

export default @connect(mapStateToProps)
class SettingsCheckbox extends ImmutablePureComponent {

  static propTypes = {
    path: PropTypes.array.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  }

  onChange = path => {
    return e => {
      this.props.dispatch(changeSetting(path, e.target.checked));
    };
  }

  render() {
    const { settings, path, ...props } = this.props;

    return (
      <Checkbox
        checked={settings.getIn(path)}
        onChange={this.onChange(path)}
        {...props}
      />
    );
  }

}
