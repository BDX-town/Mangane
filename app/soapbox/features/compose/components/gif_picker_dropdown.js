import React from 'react';
import PropTypes from 'prop-types';

import TextIconButton from '../components/text_icon_button';

const iconStyle = {
  height: null,
  lineHeight: '27px',
};

export default class GIFPickerDropdown extends React.PureComponent {

    state = {
      expanded: false,
    }

    handleClick = () => {

    }

    render() {
      return (
        <div className='compose-form_gif-picker-dropdown'>
          <TextIconButton label='GIF' title='GIF' onClick={this.handleClick} ariaControls='GIF' />
          <label>
            <span style={{ display: 'none' }}>GIF</span>
          </label>
        </div>
      );
    }

}