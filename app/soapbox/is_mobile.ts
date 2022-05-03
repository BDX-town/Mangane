'use strict';

import { supportsPassiveEvents } from 'detect-passive-events';

/** Breakpoint at which the application is considered "mobile". */
const LAYOUT_BREAKPOINT = 630;

/** Check if the width is small enough to be considered "mobile". */
export function isMobile(width: number) {
  return width <= LAYOUT_BREAKPOINT;
}

/** Whether the device is iOS (best guess). */
const iOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

let userTouching = false;
const listenerOptions = supportsPassiveEvents ? { passive: true } as EventListenerOptions : false;

function touchListener(): void {
  userTouching = true;
  window.removeEventListener('touchstart', touchListener, listenerOptions);
}

window.addEventListener('touchstart', touchListener, listenerOptions);

/** Whether the user has touched the screen since the page loaded. */
export function isUserTouching(): boolean {
  return userTouching;
}

/** Whether the device is iOS (best guess). */
export function isIOS(): boolean {
  return iOS;
}
