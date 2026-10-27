import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Slow drifting light behind every page. Pure CSS, GPU-only transforms. */
export const AmbientBackground: React.FC = () => (
  <div className="aurora" aria-hidden>
    <span />
    <span />
    <span />
  </div>
);

/** Hairline that fills as the page scrolls. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
};
