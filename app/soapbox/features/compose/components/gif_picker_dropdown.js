/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-overlays/lib/Overlay';
import { debounce } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';

import LoadingIndicator from './../../../components/loading_indicator';
import TextIconButton from '../components/text_icon_button';
import IconButton from '../../../components/icon_button';

const messages = defineMessages({
  gif: { id: 'gif_picker.gif', defaultMessage: 'GIF' },
  search: { id: 'gif_picker.search', defaultMessage: 'Rechercher un gif...' },
  choose: { id: 'gif_picker.choose', defaultMessage: 'Choisir' },
  proposed: { id: 'gif_picker.proposed', defaultMessage: 'Proposé par' },
});

class Provider {

  static BASE_URL = 'https://omg.phie.ovh';

  static async GetSize(url) {
    const response = await (await fetch(url)).blob();
    return response.size;
  }

  nexts = [];
  previous = [];

  request = new Date().getTime();

  search = async(txt) => {
    this.nexts = [];
    this.previous = [];
    const request = new Date().getTime();
    this.request = request;

    const res = await (await fetch(`${Provider.BASE_URL}/get.php?start=0&query=${txt}`)).json();
    if(request < this.request) return false;

    this.nexts = res.map((r) => ({
      url: `${Provider.BASE_URL}/${r.video}`,
      description: r.description,
      img: `${Provider.BASE_URL}/${r.url}`,
    }));

    return true;
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

/**
 * Affiche un gif ainsi qu'une version floutée,
 * gère les délais de manière à ce qu'une seule requête réseau soit effectuée
 */
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
    if(this.props.url !== prevProps.url) this.setState({ blur: null });
  }

  onLoad = () => {
    this.setState({ blur: this.props.url });
  }

  render() {
    return (
      <>
        {
          // eslint-disable-next-line eqeqeq
          <video muted className='gif-picker-dropdown__menu__entry__gif' src={this.props.url} onClick={this.props.onClick} autoPlay loop onCanPlay={this.state.blur == null ? this.onLoad : null} />
        }
        { this.state.blur && <video muted className='gif-picker-dropdown__menu__entry__blur' src={this.state.blur} autoPlay loop /> }
      </>
    );
  }

}

@injectIntl
class GIFPicker extends React.Component {

  static propTypes = {
    favGIFs: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      description: PropTypes.string,
    })).isRequired,
    style: PropTypes.object,
    handleGIFPick: PropTypes.func.isRequired,
    handleGIFfav: PropTypes.func.isRequired,
    handleGIFunfav: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  state = {
    current: null,
    loading: false,
  }

  node = React.createRef();
  search = React.createRef();

  provider = new Provider();

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('touchend', this.handleDocumentClick);

    this.search.current.focus();
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
    this.setState({ loading: value });
  }

  doSearch = debounce(async(txt) => {
    this.onLoading(true);
    if(await this.provider.search(txt) === false) return;
    this.onLoading(false);
    this.onShuffle();
  }, 1000);

  onSearch = (e) => {
    const txt = e.target.value;
    if(txt === '') {
      this.setState({
        current: null,
      });
      return;
    }
    this.doSearch(txt);
  }

  onSelect = async(gif) => {
    let generated = `[${gif.description}](${gif.url})`;
    //let generated = `![${gif.description}](${gif.url})`;
    // inutile en webm
    // const size = await Provider.GetSize(gif.url);
    // if(size > 1000000) generated = `[${gif.description}](${gif.url})`
    this.props.handleGIFPick(generated);
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

  onFavCurrent = () => {
    this.onFav(this.state.current);
  }

  onSelectCurrent = () => {
    this.onSelect(this.state.current);
  }

  render() {
    const { intl } = this.props;
    return (
      <div ref={this.node} style={this.props.style} className='gif-picker-dropdown__menu'>
        <form className='gif-picker-dropdown__menu__search'>
          <input ref={this.search} type='text' placeholder={intl.formatMessage(messages.search)} onChange={this.onSearch} />
        </form>
        {
          this.state.loading && <div className='gif-picker-dropdown__loading'><LoadingIndicator /></div>
        }
        {
          // favoris
          // eslint-disable-next-line eqeqeq
          this.state.loading == false && this.state.current == null && <>
            <div className='gif-picker-dropdown__menu__list'>
              {
                this.props.favGIFs
                  .map((gif, index) => (<div key={index} className='gif-picker-dropdown__menu__entry'>
                    <IconButton icon='star' title='Fav' onClick={() => this.onFav(gif)} className='gif-picker-dropdown__menu__entry__icon' size={22} inverted  style={{ color: 'var(--accent-color)' }} />
                    <GIF onClick={() => this.onSelect(gif)} url={gif.url} />
                  </div>))
              }
            </div>
          </>
        }
        {
          // résultats de recherche
          // eslint-disable-next-line eqeqeq
          this.state.loading == false && this.state.current != null && <>
            <div className='gif-picker-dropdown__menu__entry'>
              <IconButton icon='star' title='Fav' onClick={this.onFavCurrent} className='gif-picker-dropdown__menu__entry__icon' size={22} inverted  style={{ color: this.isFav(this.state.current) ? 'var(--accent-color)' : null }} />
              <GIF url={this.state.current.url} />
            </div>
            <div className='gif-picker-dropdown__menu__actions'>
              <button className='button gif-picker-dropdown__menu__actions__choose' onClick={this.onSelectCurrent}>
                <i className='fa fa-check' />
                { intl.formatMessage(messages.choose) }
              </button>
              <button className='button gif-picker-dropdown__menu__another' onClick={this.onShuffle}>
                <i className='fa fa-random' />
              </button>
            </div>
          </>
        }
        <small>
          { intl.formatMessage(messages.proposed) } <a href='https://omg.phie.ovh' target='_blank'>Oh My GIF</a>
        </small>
      </div>
    );
  }

}

export default @injectIntl
class GIFPickerDropdown extends React.PureComponent {

    static propTypes = {
      favGIFs: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string.isRequired,
        description: PropTypes.string,
      })).isRequired,

      handleGIFPick: PropTypes.func.isRequired,
      handleGIFfav: PropTypes.func.isRequired,
      handleGIFunfav: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
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
      const { intl } = this.props;
      return (
        <>
          <div className='gif-picker-dropdown' ref={this.container}>
            <TextIconButton active={this.state.active} label='GIF' title='GIF' ref={this.setTargetRef} onClick={this.handleActive} ariaControls='GIF' />
            <label>
              <span style={{ display: 'none' }}>{ intl.formatMessage(messages.gif) }</span>
            </label>
          </div>
          <Overlay show={active} placement={'bottom'} target={this.findTarget}>
            <GIFPicker  favGIFs={this.props.favGIFs} onClose={this.close} handleGIFPick={this.props.handleGIFPick} handleGIFfav={this.props.handleGIFfav} handleGIFunfav={this.props.handleGIFunfav} />
          </Overlay>
        </>
      );
    }

}