'use strict';

import type { ThunkMiddleware } from 'redux-thunk';

/** Soapbox audio clip. */
type Sound = {
  src: string,
  type: string,
}

/** Produce HTML5 audio from sound data. */
const createAudio = (sources: Sound[]): HTMLAudioElement => {
  const audio = new Audio();
  sources.forEach(({ type, src }) => {
    const source = document.createElement('source');
    source.type = type;
    source.src = src;
    audio.appendChild(source);
  });
  return audio;
};

/** Play HTML5 sound. */
const play = (audio: HTMLAudioElement): void => {
  if (!audio.paused) {
    audio.pause();
    if (typeof audio.fastSeek === 'function') {
      audio.fastSeek(0);
    } else {
      audio.currentTime = 0;
    }
  }

  audio.play();
};

/** Middleware to play sounds in response to certain Redux actions. */
export default function soundsMiddleware(): ThunkMiddleware {
  const soundCache: Record<string, HTMLAudioElement> = {
    boop: createAudio([
      {
        src: require('../../sounds/boop.ogg'),
        type: 'audio/ogg',
      },
      {
        src: require('../../sounds/boop.mp3'),
        type: 'audio/mpeg',
      },
    ]),
    chat: createAudio([
      {
        src: require('../../sounds/chat.oga'),
        type: 'audio/ogg',
      },
      {
        src: require('../../sounds/chat.mp3'),
        type: 'audio/mpeg',
      },
    ]),
  };

  return () => next => action => {
    if (action.meta?.sound && soundCache[action.meta.sound]) {
      play(soundCache[action.meta.sound]);
    }

    return next(action);
  };
}
