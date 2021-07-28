import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-overlays/lib/Overlay';

import TextIconButton from '../components/text_icon_button';


class Provider {

  nexts = [];
  previous = [];

  search = (txt) => {
    this.nexts = [];
    this.previous = [];

    this.nexts = [
      'https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif',
      'https://media.giphy.com/media/W3a0zO282fuBpsqqyD/giphy.gif',
      'https://media.giphy.com/media/W35DnRbN4oDHIAApdk/giphy.gif',
    ];
    // récupération
  }

  shuffle = () => {
    let last = null;
    if(this.nexts.length <= 0) {
      last = this.previous.shift();
      this.nexts = this.previous;
      this.previous = [];
    }
    const index = Math.floor(Math.random() * this.nexts.length);
    const gif = this.nexts.splice(index, 1);
    this.previous.splice(0, 0, gif);
    if(last !== null) {
      this.nexts.push(last);
    }
    return gif;
  }

}


class GIFPicker extends React.Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    handleGIFPick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    current: null,
  }

  node = React.createRef();

  provider = new Provider();

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('touchend', this.handleDocumentClick);

  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('touchend', this.handleDocumentClick);
  }

  handleDocumentClick = (e) => {
    if(this.node.current.contains(e.target) === false) this.props.onClose();
  }

  onSearch = (e) => {
    e.preventDefault();
    console.log(e);
    this.provider.search('dummy');

    this.onShuffle();
  }

  onSelect = () => {
    this.props.handleGIFPick(this.state.current);
    this.props.onClose();
  }

  onShuffle = () => {
    this.setState({
      current: this.provider.shuffle(),
    });
  }

  render() {
    return (
      <div ref={this.node} style={this.props.style} className='gif-picker-dropdown__menu'>
        <form className='gif-picker-dropdown__menu__search' onSubmit={this.onSearch}>
          <input type='text' placeholder='Rechercher un gif...' />
          <button type='submit' className='button'><i className='fa fa-search' /></button>
        </form>
        {
          this.state.current !== null && <>
            <img className='gif-picker-dropdown__menu__gif' src={this.state.current} />
            <div className='gif-picker-dropdown__menu__actions'>
              <button className='button gif-picker-dropdown__menu__actions__choose' onClick={this.onSelect}>
                <i className='fa fa-check' />
                Choisir
              </button>
              <button className='button gif-picker-dropdown__menu__another' onClick={this.onShuffle}>
                <i className='fa fa-random' />
              </button>
            </div>
          </>
        }
      </div>
    );
  }

}

export default class GIFPickerDropdown extends React.PureComponent {

    static propTypes = {
      handleGIFPick: PropTypes.func.isRequired,
    }


    state = {
      active: false,
      placement: 'bottom',
    }

    componentDidMount() {

    }

    open = () => this.setState({ active: true });

    close = () => this.setState({ active: false })

    handleActive = () => {
      this.setState({
        active: true,
      });
    }

    setTargetRef = c => {
      this.target = c;
    }

    findTarget = () => {
      return this.target;
    }

    render() {
      const { active } = this.state;
      return (
        <>
          <div className='gif-picker-dropdown' ref={this.container}>
            <TextIconButton active={this.state.active} label='GIF' title='GIF' ref={this.setTargetRef} onClick={this.handleActive} ariaControls='GIF' />
            <label>
              <span style={{ display: 'none' }}>GIF</span>
            </label>
          </div>
          <Overlay show={active} placement={'bottom'} target={this.findTarget}>
            <GIFPicker onClose={this.close} handleGIFPick={this.props.handleGIFPick} />
          </Overlay>
        </>
      );
    }

}