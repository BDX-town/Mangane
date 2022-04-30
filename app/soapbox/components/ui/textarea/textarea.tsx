import classNames from 'classnames';
import React from 'react';

interface ITextarea extends Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength' | 'onChange' | 'required'> {
  autoFocus?: boolean,
  defaultValue?: string,
  name?: string,
  isCodeEditor?: boolean,
  placeholder?: string,
  value?: string,
  autoComplete?: string,
}

const Textarea = React.forwardRef(
  ({ isCodeEditor = false, ...props }: ITextarea, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classNames({
          'dark:bg-slate-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md':
              true,
          'font-mono': isCodeEditor,
        })}
      />
    );
  },
);

export default Textarea;
