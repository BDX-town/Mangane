import * as React from 'react';

interface IForm {
  /** Form submission event handler. */
  onSubmit?: (event: React.FormEvent) => void,
  /** Class name override for the <form> element. */
  className?: string,
}

/** Form element with custom styles. */
const Form: React.FC<IForm> = ({ onSubmit, children, ...filteredProps }) => {
  const handleSubmit = React.useCallback((event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(event);
    }
  }, [onSubmit]);

  return (
    <form data-testid='form' onSubmit={handleSubmit} className='space-y-4' {...filteredProps}>
      {children}
    </form>
  );
};

export default Form;
