export const SIDEBAR_OPEN  = 'SIDEBAR_OPEN';
export const SIDEBAR_CLOSE = 'SIDEBAR_CLOSE';

export function openSidebar() {
  return {
    type: SIDEBAR_OPEN,
  };
}

export function closeSidebar() {
  return {
    type: SIDEBAR_CLOSE,
  };
}
