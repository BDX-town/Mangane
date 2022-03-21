import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IFormGroup {
  hintText?: string | React.ReactNode,
  labelText: string,
  errors?: string[]
}

const FormGroup: React.FC<IFormGroup> = (props) => {
  const { children, errors = [], labelText, hintText } = props;
  const formFieldId: string = useMemo(() => `field-${uuidv4()}`, []);
  const inputChildren = React.Children.toArray(children);

  let firstChild;
  if (React.isValidElement(inputChildren[0])) {
    firstChild = React.cloneElement(
      inputChildren[0],
      { id: formFieldId },
    );
  }

  return (
    <div>
      <label
        htmlFor={formFieldId}
        className='block text-sm font-medium text-gray-700'
      >
        {labelText}
      </label>

      <div className='mt-1'>
        {firstChild}
        {inputChildren.filter((_, i) => i !== 0)}

        {errors?.length > 0 && (
          <p className='mt-0.5 text-xs text-danger-900 bg-danger-200 rounded-md inline-block px-2 py-1 relative form-error'>
            {errors.join(', ')}
          </p>
        )}

        {hintText ? (
          <p className='mt-0.5 text-xs text-gray-400'>
            {hintText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default FormGroup;
