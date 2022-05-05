import classNames from 'classnames';
import React from 'react';

interface ITextarea extends Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength' | 'onChange' | 'required' | 'disabled' | 'rows'> {
  /** Put the cursor into the input on mount. */
  autoFocus?: boolean,
  /** The initial text in the input. */
  defaultValue?: string,
  /** Internal input name. */
  name?: string,
  /** Renders the textarea as a code editor. */
  isCodeEditor?: boolean,
  /** Text to display before a value is entered. */
  placeholder?: string,
  /** Text in the textarea. */
  value?: string,
  /** Whether the device should autocomplete text in this textarea. */
  autoComplete?: string,
  /** Whether to display the textarea in red. */
  hasError?: boolean,
}

/** Textarea with custom styles. */
const Textarea = React.forwardRef(
  ({ isCodeEditor = false, hasError = false, ...props }: ITextarea, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classNames({
          'dark:bg-slate-800 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md':
              true,
          'font-mono': isCodeEditor,
          'text-red-600 border-red-600': hasError,
        })}
      />
    );
  },
);

export default Textarea;
