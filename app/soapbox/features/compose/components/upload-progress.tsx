import React from 'react';

import UploadProgress from 'soapbox/components/upload-progress';
import { useAppSelector } from 'soapbox/hooks';

/** File upload progress bar for post composer. */
const ComposeUploadProgress = () => {
  const active = useAppSelector((state) => state.compose.is_uploading);
  const progress = useAppSelector((state) => state.compose.progress);

  if (!active) {
    return null;
  }

  return (
    <UploadProgress progress={progress} />
  );
};

export default ComposeUploadProgress;
