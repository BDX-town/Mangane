import * as React from 'react';
import { useHistory } from 'react-router-dom';

interface IPermaLink extends Pick<React.HTMLAttributes<HTMLAnchorElement>, 'dangerouslySetInnerHTML'> {
  className?: string,
  href: string,
  title?: string,
  to: string,
}

const Permalink: React.FC<IPermaLink> = (props) => {
  const history = useHistory();

  const { className, href, title, to, children, ...filteredProps } = props;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 0 && !(event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      history.push(to);
    }
  };

  return (
    <a
      target='_blank'
      href={href}
      onClick={handleClick}
      title={title}
      className={`permalink${className ? ' ' + className : ''}`}
      {...filteredProps}
    >
      {children}
    </a>
  );
};

export default Permalink;
