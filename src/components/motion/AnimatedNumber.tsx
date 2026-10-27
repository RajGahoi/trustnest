import React, { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/** Counts from the previous value to the new one, so result counts visibly respond to filters. */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className }) => {
  const reduce = useReducedMotion();
  const prev = useRef(value);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduce) { setShown(value); prev.current = value; return; }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setShown(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{shown.toLocaleString('en-IN')}</span>;
};
