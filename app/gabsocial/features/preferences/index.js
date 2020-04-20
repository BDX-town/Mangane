import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { changeSetting } from 'gabsocial/actions/settings';
import Column from '../ui/components/column';

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

  handleCheckboxSetting = path => {
    const { dispatch } = this.props;
    return (e) => {
      dispatch(changeSetting(path, e.target.checked));
    };
  }

  render() {
    const { settings, intl } = this.props;

    return (
      <Column icon='users' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <form className='simple_form' onSubmit={this.handleSubmit}>

          <div className='fields-group'>
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
          </div>

          <div className='fields-group'>
            <div className='input with_floating_label radio_buttons optional user_setting_default_privacy'>
              <div className='label_input'>
                <label className='radio_buttons optional'>Post privacy</label>
                <ul>
                  <li className='radio'>
                    <label htmlFor='user_setting_default_privacy_public'>
                      <input className='radio_buttons optional' type='radio' checked={settings.get('defaultPrivacy') === 'public'} onChange={this.onDefaultPrivacyChange} value='public' id='user_setting_default_privacy_public' />Public
                      <span className='hint'>Everyone can see</span>
                    </label>
                  </li>
                  <li className='radio'>
                    <label htmlFor='user_setting_default_privacy_unlisted'>
                      <input className='radio_buttons optional' type='radio' checked={settings.get('defaultPrivacy') === 'unlisted'} onChange={this.onDefaultPrivacyChange} value='unlisted' id='user_setting_default_privacy_unlisted' />Unlisted
                      <span className='hint'>Everyone can see, but not listed on public timelines</span>
                    </label>
                  </li>
                  <li className='radio'>
                    <label htmlFor='user_setting_default_privacy_private'>
                      <input className='radio_buttons optional' type='radio' checked={settings.get('defaultPrivacy') === 'private'} onChange={this.onDefaultPrivacyChange} value='private' id='user_setting_default_privacy_private' />Followers-only
                      <span className='hint'>Only show to followers</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='fields-group'>

            <div className='input with_label boolean optional user_setting_unfollow_modal'>
              <div className='label_input'>
                <label className='boolean optional' htmlFor='user_setting_unfollow_modal'>
                  Show confirmation dialog before unfollowing someone
                </label>
                <div className='label_input__wrapper'>
                  <label className='checkbox'>
                    <input className='boolean optional' type='checkbox' checked={settings.get('unfollowModal')} onChange={this.handleCheckboxSetting(['unfollowModal'])} id='user_setting_unfollow_modal' />
                  </label>
                </div>
              </div>
            </div>

            <div className='input with_label boolean optional user_setting_boost_modal'>
              <div className='label_input'>
                <label className='boolean optional' htmlFor='user_setting_boost_modal'>
                  Show confirmation dialog before reposting
                </label>
                <div className='label_input__wrapper'>
                  <label className='checkbox'>
                    <input className='boolean optional' type='checkbox' checked={settings.get('boostModal')} onChange={this.handleCheckboxSetting(['boostModal'])} id='user_setting_boost_modal' />
                  </label>
                </div>
              </div>
            </div>

            <div className='input with_label boolean optional user_setting_delete_modal'>
              <div className='label_input'>
                <label className='boolean optional' htmlFor='user_setting_delete_modal'>
                  Show confirmation dialog before deleting a post
                </label>
                <div className='label_input__wrapper'>
                  <label className='checkbox'>
                    <input className='boolean optional' type='checkbox' checked={settings.get('deleteModal')} onChange={this.handleCheckboxSetting(['deleteModal'])} id='user_setting_delete_modal' />
                  </label>
                </div>
              </div>
            </div>

          </div>

        </form>
      </Column>
    );
  }

}
