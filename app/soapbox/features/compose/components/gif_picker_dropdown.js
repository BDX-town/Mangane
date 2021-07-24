import React from 'react';
import PropTypes from 'prop-types';

import TextIconButton from '../components/text_icon_button';


class GIFPicker extends React.Component {
  render() {
    <div className='compose-form_gif-picker-dropdown_picker'>
      Bonjour
    </div>
  }
}

export default class GIFPickerDropdown extends React.PureComponent {

    state = {
      active: false,
      placement: 'bottom'
    }

    componentDidMount() {

    }

    open = () => this.setState({ active: true });

    close = () => this.setState({ active: false })

    handleActive = () => {
      this.setState({
        active: true,
        placement: top * 2 < innerHeight ? 'bottom' : 'top'
      })
    }

    setTargetRef = c => {
      this.target = c;
    }
  
    findTarget = () => {
      return this.target;
    }

    render() {
      const { active, placement } = this.state;
      return (
        <>
          <div className='compose-form_gif-picker-dropdown' ref={this.setTargetRef}>
            <TextIconButton label='GIF' title='GIF' onClick={this.handleActive} ariaControls='GIF' />
            <label>
              <span style={{ display: 'none' }}>GIF</span>
            </label>
          </div>
          <Overlay show={active} placement={placement} target={this.findTarget}>
            <GIFPicker

            />
          </Overlay>
        </>
      );
    }

}