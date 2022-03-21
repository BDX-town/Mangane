import classNames from 'classnames';
import React from 'react';

interface ITextarea {
  autoFocus?: boolean,
  defaultValue?: string,
  name?: string,
  isCodeEditor?: boolean,
  placeholder?: string,
  value?: string,
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = React.forwardRef(
  ({ isCodeEditor = false, ...props }: ITextarea, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classNames({
          'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md':
              true,
          'font-mono': isCodeEditor,
        })}
      />
    );
  },
);

export default Textarea;
