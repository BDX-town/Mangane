import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { changeSetting } from 'gabsocial/actions/settings';
import Column from '../ui/components/column';
import {
  SimpleForm,
  FieldsGroup,
  RadioGroup,
  RadioItem,
} from 'gabsocial/features/forms';
import SettingsCheckbox from './components/settings_checkbox';

const messages = defineMessages({
  heading: { id: 'column.preferences', defaultMessage: 'Preferences' },
});

// TODO: Pull dynamically
const themes = {
  cobalt: 'cobalt',
  'gabsocial-light': 'Light',
  default: 'Dark',
  contrast: 'High contrast',
  halloween: 'Halloween',
  neenster: 'neenster',
  glinner: 'glinner',
  lime: 'lime',
};

const mapStateToProps = state => ({
  settings: state.get('settings'),
});

export default @connect(mapStateToProps)
@injectIntl
class Preferences extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map,
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: false };
  }

  getFormData = (form) => {
    return Object.fromEntries(
      Array.from(form).map(i => [i.name, i.value])
    );
  }

  onThemeChange = e => {
    const { dispatch } = this.props;
    dispatch(changeSetting(['theme'], e.target.value));
  }

  onDefaultPrivacyChange = e => {
    const { dispatch } = this.props;
    dispatch(changeSetting(['defaultPrivacy'], e.target.value));
  }

  render() {
    const { settings, intl } = this.props;

    return (
      <Column icon='users' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm>

          <FieldsGroup>
            <div className='input with_label select optional user_setting_theme'>
              <div className='label_input'>
                <label className='select optional' htmlFor='user_setting_theme'>Site theme</label>
                <div className='label_input__wrapper'>
                  <select
                    className='select optional'
                    name='user[setting_theme]'
                    id='user_setting_theme'
                    onChange={this.onThemeChange}
                    defaultValue={settings.get('theme')}
                  >
                    {Object.keys(themes).map(theme => (
                      <option key={theme} value={theme}>
                        {themes[theme]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </FieldsGroup>

          <FieldsGroup>
            <RadioGroup label='Post privacy' onChange={this.onDefaultPrivacyChange}>
              <RadioItem
                label='Public'
                hint='Everyone can see'
                checked={settings.get('defaultPrivacy') === 'public'}
                value='public'
              />
              <RadioItem
                label='Unlisted'
                hint='Everyone can see, but not listed on public timelines'
                checked={settings.get('defaultPrivacy') === 'unlisted'}
                value='unlisted'
              />
              <RadioItem
                label='Followers-only'
                hint='Only show to followers'
                checked={settings.get('defaultPrivacy') === 'private'}
                value='private'
              />
            </RadioGroup>
          </FieldsGroup>

          <FieldsGroup>
            <SettingsCheckbox
              label='Show confirmation dialog before unfollowing someone'
              path={['unfollowModal']}
            />
            <SettingsCheckbox
              label='Show confirmation dialog before reposting'
              path={['boostModal']}
            />
            <SettingsCheckbox
              label='Show confirmation dialog before deleting a post'
              path={['deleteModal']}
            />
          </FieldsGroup>

        </SimpleForm>
      </Column>
    );
  }

}
