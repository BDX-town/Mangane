'use strict';

const createAudio = sources => {
  const audio = new Audio();
  sources.forEach(({ type, src }) => {
    const source = document.createElement('source');
    source.type = type;
    source.src = src;
    audio.appendChild(source);
  });
  return audio;
};

const play = audio => {
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

export default function soundsMiddleware() {
  const soundCache = {
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
    if (action.meta && action.meta.sound && soundCache[action.meta.sound]) {
      play(soundCache[action.meta.sound]);
    }

    return next(action);
  };
}
