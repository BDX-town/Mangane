import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { safeHtml } from 'soapbox/utils/html-safety';
import { sanitizeUrl } from 'soapbox/utils/url-policy';

interface IPermaLink extends Pick<React.HTMLAttributes<HTMLAnchorElement>, 'dangerouslySetInnerHTML'> {
  className?: string,
  href: string,
  title?: string,
  to: string,
}

const Permalink: React.FC<IPermaLink> = (props) => {
  const history = useHistory();

  const { className, dangerouslySetInnerHTML, href, title, to, children, ...filteredProps } = props;
  const safeHref = sanitizeUrl(href);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 0 && !(event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      history.push(to);
    }
  };

  return (
    <a
      target='_blank'
      rel='nofollow noopener noreferrer'
      href={safeHref || undefined}
      onClick={handleClick}
      title={title}
      className={`permalink${className ? ' ' + className : ''}`}
      {...filteredProps}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML ? safeHtml(dangerouslySetInnerHTML.__html) : undefined}
    >
      {children}
    </a>
  );
};

export default Permalink;
