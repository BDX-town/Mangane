const SIDEBAR_OPEN  = 'SIDEBAR_OPEN';
const SIDEBAR_CLOSE = 'SIDEBAR_CLOSE';

const openSidebar = () => ({
  type: SIDEBAR_OPEN,
});

const closeSidebar = () => ({
  type: SIDEBAR_CLOSE,
});

export {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  openSidebar,
  closeSidebar,
};
