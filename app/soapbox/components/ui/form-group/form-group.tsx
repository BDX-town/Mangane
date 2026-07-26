import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Checkbox from '../checkbox/checkbox';
import HStack from '../hstack/hstack';
import Stack from '../stack/stack';

interface IFormGroup {
  /** Input label message. */
  labelText?: React.ReactNode,
  /** Input label tooltip message. */
  labelTitle?: string,
  /** Input hint message. */
  hintText?: React.ReactNode,
  /** Input errors. */
  errors?: string[]
}

/** Input container with label. Renders the child. */
const FormGroup: React.FC<IFormGroup> = (props) => {
  const { children, errors = [], labelText, labelTitle, hintText } = props;
  const formFieldId: string = useMemo(() => `field-${uuidv4()}`, []);
  const hintId = `${formFieldId}-hint`;
  const errorId = `${formFieldId}-error`;
  const inputChildren = React.Children.toArray(children);
  const hasError = errors?.length > 0;

  let firstChild;
  if (React.isValidElement<{
    id?: string,
    hasError?: boolean,
    'aria-describedby'?: string,
    'aria-invalid'?: boolean,
  }>(inputChildren[0])) {
    const describedBy = [
      hintText ? hintId : null,
      hasError ? errorId : null,
    ].filter(Boolean).join(' ') || undefined;
    const sharedProps = {
      id: formFieldId,
      'aria-describedby': describedBy,
      'aria-invalid': hasError || undefined,
    };
    const supportsHasError = (
      typeof inputChildren[0].type !== 'string'
      && inputChildren[0].type !== Checkbox
    );
    firstChild = React.cloneElement(
      inputChildren[0],
      supportsHasError ? { ...sharedProps, hasError } : sharedProps,
    );
  }
  const isCheckboxFormGroup = firstChild?.type === Checkbox;

  if (isCheckboxFormGroup) {
    return (
      <HStack alignItems='start' space={2}>
        {firstChild}

        <Stack>
          {labelText && (
            <label
              htmlFor={formFieldId}
              data-testid='form-group-label'
              className='-mt-0.5 block text-sm font-medium text-gray-700 dark:text-gray-400'
              title={labelTitle}
            >
              {labelText}
            </label>
          )}

          {hasError && (
            <div>
              <p
                id={errorId}
                role='alert'
                data-testid='form-group-error'
                className='mt-0.5 text-xs text-danger-900 bg-danger-200 rounded-md inline-block px-2 py-1 relative form-error'
              >
                {errors.join(', ')}
              </p>
            </div>
          )}

          {hintText && (
            <p id={hintId} data-testid='form-group-hint' className='mt-0.5 text-xs text-gray-400'>
              {hintText}
            </p>
          )}
        </Stack>
      </HStack>
    );
  }

  return (
    <div>
      {labelText && (
        <label
          htmlFor={formFieldId}
          data-testid='form-group-label'
          className='block text-sm font-medium text-gray-700 dark:text-gray-400'
          title={labelTitle}
        >
          {labelText}
        </label>
      )}

      <div className='mt-1 dark:text-white'>
        {firstChild}
        {inputChildren.filter((_, i) => i !== 0)}

        {hasError && (
          <p
            id={errorId}
            role='alert'
            data-testid='form-group-error'
            className='mt-0.5 text-xs text-danger-900 bg-danger-200 rounded-md inline-block px-2 py-1 relative form-error'
          >
            {errors.join(', ')}
          </p>
        )}

        {hintText && (
          <p id={hintId} data-testid='form-group-hint' className='mt-0.5 text-xs text-gray-400'>
            {hintText}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormGroup;
