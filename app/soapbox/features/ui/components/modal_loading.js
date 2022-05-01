import React from 'react';

import { Spinner } from 'soapbox/components/ui';

// Keep the markup in sync with <BundleModalError />
// (make sure they have the same dimensions)
const ModalLoading = () => (
  <div className='modal-root__modal error-modal'>
    <div className='error-modal__body'>
      <Spinner />
    </div>
    <div className='error-modal__footer'>
      <div>
        <button className='error-modal__nav onboarding-modal__skip' />
      </div>
    </div>
  </div>
);

export default ModalLoading;
