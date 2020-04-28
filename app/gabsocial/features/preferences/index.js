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
  SelectDropdown,
} from 'gabsocial/features/forms';
import SettingsCheckbox from './components/settings_checkbox';

const messages = defineMessages({
  heading: { id: 'column.preferences', defaultMessage: 'Preferences' },
});

// TODO: Pull dynamically
const themes = {
  'cobalt':          'Cobalt',
  'purple':          'Purple Light',
  'purple-dark':     'Purple Dark',
  'purple-contrast': 'Purple Contrast',
  'halloween':       'Halloween',
  'aquatic':         'Aquatic',
  'paleblue':        'Pale Blue',
  'lime':            'Lime Green',
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
      <Column icon='cog' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <SimpleForm>
          <FieldsGroup>
            <SelectDropdown
              label='Site theme'
              items={themes}
              defaultValue={settings.get('theme')}
              onChange={this.onThemeChange}
            />
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

          <FieldsGroup>
            <SettingsCheckbox
              label='Auto-play animated GIFs'
              path={['autoPlayGif']}
            />
            <SettingsCheckbox
              label='Always expand posts marked with content warnings'
              path={['expandSpoilers']}
            />
            <SettingsCheckbox
              label='Reduce motion in animations'
              path={['reduceMotion']}
            />
            <SettingsCheckbox
              label="Use system's default font"
              path={['systemFont']}
            />
            <div className='dyslexic'>
              <SettingsCheckbox
                label='Dyslexic mode'
                path={['dyslexicFont']}
              />
            </div>
            <SettingsCheckbox
              label='Use Demetricator'
              hint='Decrease social media anxiety by hiding all numbers from the site.'
              path={['demetricator']}
            />
          </FieldsGroup>
        </SimpleForm>
      </Column>
    );
  }

}
