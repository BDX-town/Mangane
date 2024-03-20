/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { useDispatch } from 'react-redux';

import { simpleEmojiReact } from 'soapbox/actions/emoji_reacts';
import { openModal } from 'soapbox/actions/modals';
import EmojiSelector from 'soapbox/components/ui/emoji-selector/emoji-selector';
import { useAppSelector, useOwnAccount, useSoapboxConfig } from 'soapbox/hooks';
import { isUserTouching } from 'soapbox/is_mobile';
import { getReactForStatus } from 'soapbox/utils/emoji_reacts';

interface IEmojiButtonWrapper {
  statusId: string,
  children: JSX.Element,
}

/** Provides emoji reaction functionality to the underlying button component */
const EmojiButtonWrapper: React.FC<IEmojiButtonWrapper> = ({ statusId, children }): JSX.Element | null => {
  const root = React.useRef(null);
  const dispatch = useDispatch();
  const ownAccount = useOwnAccount();
  const status = useAppSelector(state => state.statuses.get(statusId));
  const soapboxConfig = useSoapboxConfig();

  const timeout = useRef<NodeJS.Timeout>();
  const [visible, setVisible] = useState(false);

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-10, 0],
        },
      },
    ],
  });

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setReferenceElement(root.current);
  }, []);

  if (!status) return null;

  const handleMouseEnter = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (!isUserTouching()) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Unless the user is touching, delay closing the emoji selector briefly
    // so the user can move the mouse diagonally to make a selection.
    if (isUserTouching()) {
      setVisible(false);
    } else {
      timeout.current = setTimeout(() => {
        setVisible(false);
      }, 500);
    }
  };

  const handleReact = (emoji: string): void => {
    if (ownAccount) {
      dispatch(simpleEmojiReact(status, emoji));
    } else {
      dispatch(openModal('UNAUTHORIZED', {
        action: 'FAVOURITE',
        ap_id: status.url,
      }));
    }

    setVisible(false);
  };

  const handleClick: React.EventHandler<React.MouseEvent> = e => {
    e.preventDefault();
    e.stopPropagation();
    const meEmojiReact = getReactForStatus(status, soapboxConfig.allowedEmoji) || '👍';

    if (isUserTouching()) {
      if (visible) {
        handleReact(meEmojiReact);
      } else {
        setVisible(true);
      }
    } else {
      handleReact(meEmojiReact);
    }
  };


  return (
    <div ref={root} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      { children}
      {
        visible && (
          ReactDOM.createPortal((
            <div
              role='menu'
              onClick={handleClick}
              className='z-50 transition-opacity duration-100'
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <EmojiSelector
                emojis={soapboxConfig.allowedEmoji}
                onReact={handleReact}
              />
            </div>
          ), document.body)

        )
      }
    </div>
  );
};

export default EmojiButtonWrapper;
