import React from 'react';

/** Container element to house form actions. */
const FormActions: React.FC = ({ children }) => (
  <div className='flex justify-end space-x-2'>
    {children}
  </div>
);

export default FormActions;
