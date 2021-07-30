import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-overlays/lib/Overlay';

import TextIconButton from '../components/text_icon_button';
import IconButton from '../../../components/icon_button';


class Provider {
  // static BASE_URL = "https://omg.phie.ovh"
  static BASE_URL = "http://localhost:8010/proxy"


  nexts = [];
  previous = [];

  search = async (txt) => {
    this.nexts = [];
    this.previous = [];

    const res = await (await fetch(`${Provider.BASE_URL}/get.php?start=0&query=${txt}`)).json();
    this.nexts = res.map((r) => ({
      url: `${Provider.BASE_URL}/${r.video}`,
      description: r.description
    }));
  }

  shuffle = () => {
    let last = null;
    if(this.nexts.length <= 0) {
      last = this.previous.shift();
      this.nexts = this.previous;
      this.previous = [];
    }
    const index = Math.floor(Math.random() * this.nexts.length);
    const gif = (this.nexts.splice(index, 1))[0];
    this.previous.splice(0, 0, gif);
    if(last !== null) {
      this.nexts.push(last);
    }
    return gif;
  }

}

class GIF extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: null,
  }

  state = {
    blur: null,
  }

  componentDidUpdate(prevProps) {
    if(this.props.url !== prevProps.url) this.setState({ blur: null});
  }

  onLoad = (e) => {
    this.setState({ blur: this.props.url });
  }

  render() {
    return (
      <>
        <video className='gif-picker-dropdown__menu__entry__gif' src={this.props.url} onClick={this.props.onClick} autoPlay loop onCanPlay={this.state.blur == null ? this.onLoad : null} />
        { this.state.blur && <video className='gif-picker-dropdown__menu__entry__blur' src={this.state.blur} autoPlay loop /> }
      </>
    );
  }
}


class GIFPicker extends React.Component {

  static propTypes = {
    favGIFs: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
    handleGIFPick: PropTypes.func.isRequired,
    handleGIFfav: PropTypes.func.isRequired,
    handleGIFunfav: PropTypes.func.isRequired,
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

  isFav = (gif) => {
    return !!this.props.favGIFs.find((g) => g.url === gif.url);
  }

  onLoading = (value) => {
    console.log('loading');
    console.log(value);
  }

  onSearch = async (e) => {
    e.preventDefault();

    const txt = e.target[0].value;
    if(txt == '') {
      this.setState({
        current: null,
      });
      return;
    }

    this.onLoading(true);
    await this.provider.search(txt);
    this.onLoading(false);

    this.onShuffle();
  }

  onSelect = (gif) => {
    this.props.handleGIFPick(gif);
    this.props.onClose();
  }

  onShuffle = () => {
    this.setState({
      current: this.provider.shuffle(),
    });
  }

  onFav = (gif) => {
    if(this.isFav(gif)) {
      this.props.handleGIFunfav(gif);
    } else {
      this.props.handleGIFfav(gif);
    }
  }

  render() {
    return (
      <div ref={this.node} style={this.props.style} className='gif-picker-dropdown__menu'>
        <form className='gif-picker-dropdown__menu__search' onSubmit={this.onSearch}>
          <input type='text' placeholder='Rechercher un gif...' />
          <button type='submit' className='button'><i className='fa fa-search' /></button>
        </form>
        {
          // favoris
          this.state.current == null && <>
            <div className='gif-picker-dropdown__menu__list'>
              {
                this.props.favGIFs
                .map((gif) => <div className='gif-picker-dropdown__menu__entry'>
                  <IconButton icon='star' title="Fav" onClick={() => this.onFav(gif)} className='gif-picker-dropdown__menu__entry__icon' size={22} inverted  style={{ color: 'var(--accent-color)' }} />
                  <GIF onClick={() => this.onSelect(gif)} url={gif.url} />
                </div>)
              }
            </div>
          </>
        }
        {
          // résultats de recherche
          this.state.current != null && <>
            <div className='gif-picker-dropdown__menu__entry'>
              <IconButton icon='star' title="Fav" onClick={() => this.onFav(this.state.current)} className='gif-picker-dropdown__menu__entry__icon' size={22} inverted  style={{ color: this.isFav(this.state.current) ? 'var(--accent-color)' : null }} />
              <GIF url={this.state.current.url} />
            </div>
            <div className='gif-picker-dropdown__menu__actions'>
              <button className='button gif-picker-dropdown__menu__actions__choose' onClick={() => this.onSelect(this.state.current)}>
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
      favGIFs: PropTypes.arrayOf(PropTypes.string).isRequired,

      handleGIFPick: PropTypes.func.isRequired,
      handleGIFfav: PropTypes.func.isRequired,
      handleGIFunfav: PropTypes.func.isRequired,
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
            <GIFPicker  favGIFs={this.props.favGIFs} onClose={this.close} handleGIFPick={this.props.handleGIFPick} handleGIFfav={this.props.handleGIFfav} handleGIFunfav={this.props.handleGIFunfav} />
          </Overlay>
        </>
      );
    }

}