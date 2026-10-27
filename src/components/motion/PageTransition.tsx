import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  routeKey: string;
  children: React.ReactNode;
}

/** Route change: old page softly blurs out, new page rises in. Answers the click, never loops. */
export const PageTransition: React.FC<PageTransitionProps> = ({ routeKey, children }) => {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
