'use strict';

export default function ready(loaded: () => void): void {
  if (['interactive', 'complete'].includes(document.readyState)) {
    loaded();
  } else {
    document.addEventListener('DOMContentLoaded', loaded);
  }
}
