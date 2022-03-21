import * as React from 'react';

interface IForm {
  disabled?: boolean,
  onSubmit?: (event: React.FormEvent) => void,
}

const Form: React.FC<IForm> = ({ onSubmit, children, ...filteredProps }) => {
  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(event);
    }
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit} className='space-y-4' {...filteredProps}>
      {children}
    </form>
  );
};

export default Form;
