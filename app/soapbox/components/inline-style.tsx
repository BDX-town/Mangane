import React, { useEffect, useRef } from 'react';

interface IInlineStyle extends Pick<React.HTMLAttributes<HTMLStyleElement>, 'id'> {
  children: string;
}

const InlineStyle: React.FC<IInlineStyle> = ({ children, id }) => {
  // eslint-disable-next-line compat/compat
  const sheet = useRef(!document.adoptedStyleSheets ? new CSSStyleSheet() : document.createElement('style'));

  useEffect(() => {
    const stylesheet = sheet.current;
    if (stylesheet) {
      if (stylesheet instanceof CSSStyleSheet) {
        stylesheet.replaceSync(children);
      } else {
        stylesheet.textContent = children;
      }
    }
  }, [children]);

  useEffect(() => {
    const stylesheet = sheet.current;
    if (stylesheet) {
      if (stylesheet instanceof CSSStyleSheet) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
      } else {
        if (id) {
          stylesheet.id = id;
        }
        document.head.appendChild(stylesheet);
      }
    }

    return () => {
      if (stylesheet) {
        if (stylesheet instanceof CSSStyleSheet) {
          document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== stylesheet);
        } else {
          document.head.removeChild(stylesheet);
        }
      }
    };
  }, []);

  return <></>;
};

export { InlineStyle as default };
