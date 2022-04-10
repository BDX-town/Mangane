import * as React from 'react';

interface IInlineSVG {
  loader?: JSX.Element,
}

const InlineSVG: React.FC<IInlineSVG> = ({ loader }): JSX.Element => {
  if (loader) {
    return loader;
  } else {
    throw 'You used react-inlinesvg without a loader! This will cause jumpy loading during render.';
  }
};

export default InlineSVG;
