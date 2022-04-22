import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getSoapboxConfig } from 'soapbox/actions/soapbox';
import Icon from 'soapbox/components/icon';
import PollContainer from 'soapbox/containers/poll_container';
import { addGreentext } from 'soapbox/utils/greentext';
import { onlyEmoji } from 'soapbox/utils/rich_content';

import { isRtl } from '../rtl';

import Permalink from './permalink';

const MAX_HEIGHT = 642; // 20px * 32 (+ 2px padding at the top)
const BIG_EMOJI_LIMIT = 10;

const mapStateToProps = state => ({
  greentext: getSoapboxConfig(state).get('greentext'),
});

export default @connect(mapStateToProps)
@withRouter
class StatusContent extends React.PureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    reblogContent: PropTypes.string,
    expanded: PropTypes.bool,
    onExpandedToggle: PropTypes.func,
    onClick: PropTypes.func,
    collapsable: PropTypes.bool,
    greentext: PropTypes.bool,
    history: PropTypes.object,
  };

  state = {
    hidden: true,
    collapsed: null, //  `collapsed: null` indicates that an element doesn't need collapsing, while `true` or `false` indicates that it does (and is/isn't).
  };

  _updateStatusLinks() {
    const node = this.node;

    if (!node) {
      return;
    }

    const links = node.querySelectorAll('a');

    for (let i = 0; i < links.length; ++i) {
      const link = links[i];
      if (link.classList.contains('status-link')) {
        continue;
      }
      link.classList.add('status-link');
      link.setAttribute('rel', 'nofollow noopener');
      link.setAttribute('target', '_blank');

      const mention = this.props.status.get('mentions').find(item => link.href === `${item.get('url')}`);

      if (mention) {
        link.addEventListener('click', this.onMentionClick.bind(this, mention), false);
        link.setAttribute('title', mention.get('acct'));
      } else if (link.textContent[0] === '#' || (link.previousSibling && link.previousSibling.textContent && link.previousSibling.textContent[link.previousSibling.textContent.length - 1] === '#')) {
        link.addEventListener('click', this.onHashtagClick.bind(this, link.text), false);
      } else {
        link.setAttribute('title', link.href);
      }
    }
  }

  setCollapse() {
    const node = this.node;

    if (!node) {
      return;
    }

    if (
      this.props.collapsable
      && this.props.onClick
      && this.state.collapsed === null
      && this.props.status.get('spoiler_text').length === 0
    ) {
      if (node.clientHeight > MAX_HEIGHT){
        this.setState({ collapsed: true });
      }
    }
  }

  setOnlyEmoji = () => {
    if (!this.node) return;
    const only = onlyEmoji(this.node, BIG_EMOJI_LIMIT, true);

    if (only !== this.state.onlyEmoji) {
      this.setState({ onlyEmoji: only });
    }
  }

  refresh = () => {
    this.setCollapse();
    this._updateStatusLinks();
    this.setOnlyEmoji();
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  onMentionClick = (mention, e) => {
    if (this.props.history && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.history.push(`/@${mention.get('acct')}`);
    }
  }

  onHashtagClick = (hashtag, e) => {
    hashtag = hashtag.replace(/^#/, '').toLowerCase();

    if (this.props.history && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.history.push(`/tags/${hashtag}`);
    }
  }

  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY];
  }

  handleMouseUp = (e) => {
    if (!this.startXY) {
      return;
    }

    const [ startX, startY ] = this.startXY;
    const [ deltaX, deltaY ] = [Math.abs(e.clientX - startX), Math.abs(e.clientY - startY)];

    if (e.target.localName === 'button' || e.target.localName === 'a' || (e.target.parentNode && (e.target.parentNode.localName === 'button' || e.target.parentNode.localName === 'a'))) {
      return;
    }

    if (deltaX + deltaY < 5 && e.button === 0 && this.props.onClick) {
      this.props.onClick();
    }

    this.startXY = null;
  }

  handleSpoilerClick = (e) => {
    e.preventDefault();

    if (this.props.onExpandedToggle) {
      // The parent manages the state
      this.props.onExpandedToggle();
    } else {
      this.setState({ hidden: !this.state.hidden });
    }
  }

  handleCollapsedClick = (e) => {
    e.preventDefault();
    this.setState({ collapsed: !this.state.collapsed });
  }

  setRef = (c) => {
    this.node = c;
  }

  parseHtml = html => {
    const { greentext } = this.props;
    if (greentext) return addGreentext(html);
    return html;
  }

  getHtmlContent = () => {
    const { status } = this.props;
    const html = status.get('contentHtml');
    return this.parseHtml(html);
  }

  render() {
    const { status } = this.props;
    const { onlyEmoji } = this.state;

    if (status.get('content').length === 0) {
      return null;
    }

    const hidden = this.props.onExpandedToggle ? !this.props.expanded : this.state.hidden;

    const content = { __html: this.getHtmlContent() };
    const spoilerContent = { __html: status.get('spoilerHtml') };
    const directionStyle = { direction: 'ltr' };
    const classNames = classnames('status__content', {
      'status__content--with-action': this.props.onClick && this.props.history,
      'status__content--with-spoiler': status.get('spoiler_text').length > 0,
      'status__content--collapsed': this.state.collapsed === true,
      'status__content--big': onlyEmoji,
    });

    if (isRtl(status.get('search_index'))) {
      directionStyle.direction = 'rtl';
    }

    const readMoreButton = (
      <button className='status__content__read-more-button' onClick={this.props.onClick} key='read-more'>
        <FormattedMessage id='status.read_more' defaultMessage='Read more' /><Icon id='angle-right' fixedWidth />
      </button>
    );

    if (status.get('spoiler_text').length > 0) {
      let mentionsPlaceholder = '';

      const mentionLinks = status.get('mentions').map(item => (
        <Permalink to={`/@${item.get('acct')}`} href={`/@${item.get('acct')}`} key={item.get('id')} className='mention'>
          @<span>{item.get('username')}</span>
        </Permalink>
      )).reduce((aggregate, item) => [...aggregate, item, ' '], []);

      const toggleText = hidden ? <FormattedMessage id='status.show_more' defaultMessage='Show more' /> : <FormattedMessage id='status.show_less' defaultMessage='Show less' />;

      if (hidden) {
        mentionsPlaceholder = <div>{mentionLinks}</div>;
      }

      return (
        <div className={classNames} ref={this.setRef} tabIndex='0' style={directionStyle} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
          <p style={{ marginBottom: hidden && status.get('mentions').isEmpty() ? '0px' : null }}>
            <span dangerouslySetInnerHTML={spoilerContent} lang={status.get('language')} />
            {' '}
            <button tabIndex='0' className={`status__content__spoiler-link ${hidden ? 'status__content__spoiler-link--show-more' : 'status__content__spoiler-link--show-less'}`} onClick={this.handleSpoilerClick}>{toggleText}</button>
          </p>

          {mentionsPlaceholder}

          <div tabIndex={!hidden ? 0 : null} className={`status__content__text ${!hidden ? 'status__content__text--visible' : ''}`} style={directionStyle} dangerouslySetInnerHTML={content} lang={status.get('language')} />

          {!hidden && !!status.get('poll') && <PollContainer pollId={status.get('poll')} status={status.get('url')} />}
        </div>
      );
    } else if (this.props.onClick) {
      const output = [
        <div
          ref={this.setRef}
          tabIndex='0'
          key='content'
          className={classNames}
          style={directionStyle}
          dangerouslySetInnerHTML={content}
          lang={status.get('language')}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />,
      ];

      if (this.state.collapsed) {
        output.push(readMoreButton);
      }

      if (status.get('poll')) {
        output.push(<PollContainer pollId={status.get('poll')} key='poll' status={status.get('url')} />);
      }

      return output;
    } else {
      const output = [
        <div
          ref={this.setRef}
          tabIndex='0'
          key='content'
          className={classnames('status__content', {
            'status__content--big': onlyEmoji,
          })}
          style={directionStyle}
          dangerouslySetInnerHTML={content}
          lang={status.get('language')}
        />,
      ];

      if (status.get('poll')) {
        output.push(<PollContainer pollId={status.get('poll')} key='poll' status={status.get('url')} />);
      }

      return output;
    }
  }

}
