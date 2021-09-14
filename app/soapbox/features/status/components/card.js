import React from 'react';
import PropTypes from 'prop-types';
import { is, fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import punycode from 'punycode';
import classnames from 'classnames';
import Icon from 'soapbox/components/icon';

const IDNA_PREFIX = 'xn--';

const decodeIDNA = domain => {
  return domain
    .split('.')
    .map(part => part.indexOf(IDNA_PREFIX) === 0 ? punycode.decode(part.slice(IDNA_PREFIX.length)) : part)
    .join('.');
};

const getHostname = url => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
};

const trim = (text, len) => {
  const cut = text.indexOf(' ', len);

  if (cut === -1) {
    return text;
  }

  return text.substring(0, cut) + (text.length > len ? '…' : '');
};

const domParser = new DOMParser();

const addAutoPlay = html => {
  const document = domParser.parseFromString(html, 'text/html').documentElement;
  const iframe = document.querySelector('iframe');

  if (iframe) {
    if (iframe.src.indexOf('?') !== -1) {
      iframe.src += '&';
    } else {
      iframe.src += '?';
    }

    iframe.src += 'autoplay=1&auto_play=1';
    iframe.allow = 'autoplay';

    // DOM parser creates html/body elements around original HTML fragment,
    // so we need to get innerHTML out of the body and not the entire document
    return document.querySelector('body').innerHTML;
  }

  return html;
};

export default class Card extends React.PureComponent {

  static propTypes = {
    card: ImmutablePropTypes.map,
    maxDescription: PropTypes.number,
    onOpenMedia: PropTypes.func.isRequired,
    compact: PropTypes.bool,
    defaultWidth: PropTypes.number,
    cacheWidth: PropTypes.func,
  };

  static defaultProps = {
    maxDescription: 200,
    compact: false,
  };

  state = {
    width: this.props.defaultWidth || 467,
    embedded: false,
  };

  componentDidUpdate(prevProps) {
    if (!is(prevProps.card, this.props.card)) {
      this.setState({ embedded: false });
    }
  }

  handlePhotoClick = () => {
    const { card, onOpenMedia } = this.props;

    onOpenMedia(
      fromJS([
        {
          type: 'image',
          url: card.get('embed_url'),
          description: card.get('title'),
          meta: {
            original: {
              width: card.get('width'),
              height: card.get('height'),
            },
          },
        },
      ]),
      0,
    );
  };

  handleEmbedClick = () => {
    const { card } = this.props;

    if (card.get('type') === 'photo') {
      this.handlePhotoClick();
    } else {
      this.setState({ embedded: true });
    }
  }

  setRef = c => {
    if (c) {
      if (this.props.cacheWidth) this.props.cacheWidth(c.offsetWidth);
      this.setState({ width: c.offsetWidth });
    }
  }

  renderVideo() {
    const { card }  = this.props;
    const html      = card.get('html', card.getIn(['pleroma', 'opengraph', 'html']));
    const content   = { __html: addAutoPlay(html) };
    const { width } = this.state;
    const ratio     = this.getRatio(card);
    const height    = width / ratio;

    return (
      <div
        ref={this.setRef}
        className='status-card__image status-card-video'
        dangerouslySetInnerHTML={content}
        style={{ height }}
      />
    );
  }

  getRatio = card => {
    const width  = card.get('width', card.getIn(['pleroma', 'opengraph', 'width']));
    const height = card.get('height', card.getIn(['pleroma', 'opengraph', 'height']));
    const ratio  = width / height;

    // Invalid dimensions, fall back to 16:9
    if (typeof width !== 'number' || typeof height !== 'number') {
      return 16 / 9;
    }

    // Constrain to a sane limit
    // https://en.wikipedia.org/wiki/Aspect_ratio_(image)
    return Math.min(Math.max(9 / 16, ratio), 4);
  }

  render() {
    const { card, maxDescription, compact } = this.props;
    const { width, embedded } = this.state;

    if (card === null) {
      return null;
    }

    const provider    = card.get('provider_name').length === 0 ? decodeIDNA(getHostname(card.get('url'))) : card.get('provider_name');
    const interactive = card.get('type') !== 'link';
    const horizontal  = interactive || embedded;
    const className   = classnames('status-card', { horizontal, compact, interactive }, `status-card--${card.get('type')}`);
    const title       = interactive ? <a className='status-card__title' href={card.get('url')} title={card.get('title')} rel='noopener' target='_blank'><strong>{card.get('title')}</strong></a> : <strong className='status-card__title' title={card.get('title')}>{card.get('title')}</strong>;
    const ratio       = this.getRatio(card);
    const height      = (compact && !embedded) ? (width / (16 / 9)) : (width / ratio);

    const description = (
      <div className='status-card__content'>
        {title}
        <p className='status-card__description'>{trim(card.get('description') || '', maxDescription)}</p>
        <span className='status-card__host'><Icon id='link' /> {provider}</span>
      </div>
    );

    let embed     = '';
    const imageUrl = card.get('image') || card.getIn(['pleroma', 'opengraph', 'thumbnail_url']);
    const thumbnail = <div style={{ backgroundImage: `url(${imageUrl})`, width: horizontal ? width : null, height: horizontal ? height : null }} className='status-card__image-image' />;

    if (interactive) {
      if (embedded) {
        embed = this.renderVideo();
      } else {
        let iconVariant = 'play';

        if (card.get('type') === 'photo') {
          iconVariant = 'search-plus';
        }

        embed = (
          <div className='status-card__image'>
            {thumbnail}

            <div className='status-card__actions'>
              <div>
                <button onClick={this.handleEmbedClick}><Icon id={iconVariant} /></button>
                {horizontal && <a href={card.get('url')} target='_blank' rel='noopener'><Icon id='external-link' /></a>}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={className} ref={this.setRef}>
          {embed}
          {description}
        </div>
      );
    } else if (card.get('image')) {
      embed = (
        <div className='status-card__image'>
          {thumbnail}
        </div>
      );
    } else {
      embed = (
        <div className='status-card__image status-card__image--empty'>
          <Icon id='file-text' />
        </div>
      );
    }

    return (
      <a href={card.get('url')} className={className} target='_blank' rel='noopener' ref={this.setRef}>
        {embed}
        {description}
      </a>
    );
  }

}
