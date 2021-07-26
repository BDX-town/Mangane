import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-overlays/lib/Overlay';

import TextIconButton from '../components/text_icon_button';


class GIFPicker extends React.Component {

  state = {
    current: null,
  }

  node = React.createRef();


  render() {
    return (
      <div ref={this.node} style={this.props.style} className='gif-picker-dropdown__menu'>
        <form className="gif-picker-dropdown__menu__search">
          <input type="text" placeholder="Rechercher un gif..." />
          <button className="button"><i className="fa fa-search" /></button>
        </form>
        {
          this.state.current != null && <>
            <img src={this.state.current} />
            <div>
              <button className="button">Choisir</button>
              <button className="button">Obtenir un autre gif</button>
            </div>
          </>
        }
      </div>
    );
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
          <div className='gif-picker-dropdown' ref={this.container}>
            <TextIconButton label='GIF' title='GIF' ref={this.setTargetRef} onClick={this.handleActive} ariaControls='GIF' />
            <label>
              <span style={{ display: 'none' }}>GIF</span>
            </label>
          </div>
          <Overlay show={active} placement={"bottom"} target={this.findTarget}>
            <GIFPicker />
          </Overlay>
        </>
      );
    }

}