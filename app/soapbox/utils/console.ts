/** Print a warning to users not to copy-paste into the console */
const printConsoleWarning = () => {
  /* eslint-disable no-console */
  console.log('%cStop!', [
    'color: #ff0000',
    'display: block',
    'font-family: system-ui, -apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", sans-serif',
    'font-size: 50px',
    'font-weight: 800',
    'padding: 4px 0',
  ].join(';'));
  console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and will give them access to your account.', [
    'color: #111111',
    'display: block',
    'font-family: system-ui, -apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", sans-serif',
    'font-size: 18px',
    'padding: 4px 0 16px',
  ].join(';'));
  /* eslint-enable no-console */
};

export {
  printConsoleWarning,
};
