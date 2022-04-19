import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';

interface LottieProps {
  animationData: any
  width: number
  height: number
}

/** Wrapper around lottie-web */
// https://github.com/chenqingspring/react-lottie/issues/139
const Lottie: React.FC<LottieProps> = ({ animationData, width, height }) => {
  const element = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<any>();

  useEffect(() => {
    if (element.current) {
      lottieInstance.current = lottie.loadAnimation({
        animationData,
        container: element.current,
      });
    }
  }, [animationData]);

  return <div style={{ width, height }} ref={element} />;
};

export default Lottie;
