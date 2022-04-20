import React, { useEffect, useState } from 'react';

import BundleContainer from 'soapbox/features/ui/containers/bundle_container';

const LottieAsync = () => {
  return import(/* webpackChunkName: "lottie" */'soapbox/components/lottie');
};

const fetchAnimationData = () => {
  return import(/* webpackChunkName: "lottie" */'images/circles.json');
};

/** Homepage pulse animation chunked to not bloat the entrypoint */
const Pulse: React.FC = () => {
  const [animationData, setAnimationData] = useState<any>(undefined);

  useEffect(() => {
    fetchAnimationData()
      .then(({ default: json }) => {
        setAnimationData(json);
      })
      .catch(console.error);
  });

  if (animationData) {
    return (
      <BundleContainer fetchComponent={LottieAsync}>
        {Component => (
          <Component animationData={animationData} width={800} height={800} />
        )}
      </BundleContainer>
    );
  } else {
    return null;
  }
};

export default Pulse;
