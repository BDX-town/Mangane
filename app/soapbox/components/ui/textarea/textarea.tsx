import classNames from 'classnames';
import React from 'react';

interface ITextarea extends Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength' | 'onChange' | 'required' | 'disabled' | 'rows' | 'readOnly'> {
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
          'bg-white dark:bg-transparent shadow-sm block w-full sm:text-sm rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-600 border-gray-400 dark:border-gray-800 dark:ring-1 dark:ring-gray-800 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500':
            true,
          'font-mono': isCodeEditor,
          'text-red-600 border-red-600': hasError,
        })}
      />
    );
  },
);

export default Textarea;
