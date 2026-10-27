import React, { useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import type { Listing } from '../../types';

interface VerificationDemoProps {
  listing: Listing;
  onOpen?: (listing: Listing) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The hero's one orchestrated moment: a real listing is scanned once on load,
 * each verification dimension ticks in, the score counts up, and the seal lands.
 * Everything shown is read from the listing object, nothing is hard-coded.
 */
export const VerificationDemo: React.FC<VerificationDemoProps> = ({ listing, onOpen }) => {
  const reduce = useReducedMotion();
  const target = listing.trustScore.overallScore;
  const [score, setScore] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, target, {
      duration: 1.6,
      delay: 1.9,
      ease: EASE,
      onUpdate: v => setScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, reduce]);

  const dims = listing.trustScore.dimensions;
  const tick = (i: number) => (reduce ? 0 : 1.2 + i * 0.22);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen?.(listing)}
      initial={reduce ? false : { opacity: 0, y: 40, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="group relative w-full text-left rounded-[1.75rem] bg-navy-950 text-cream-50 p-3 shadow-trust-lg cursor-pointer"
      aria-label={`Open ${listing.title}`}
    >
      <div className="relative aspect-[4/3] rounded-[1.25rem] overflow-hidden">
        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        <div className="scan-line" />

        <div className="absolute left-3 bottom-3 flex items-center gap-1.5 text-xs text-cream-50/90">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          {listing.location.locality}, {listing.location.city}
        </div>

        {/* Seal */}
        <motion.div
          initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ delay: reduce ? 0 : 3.1, duration: 0.55, ease: EASE }}
          className="foil absolute right-3 top-3 w-20 h-20 rounded-full bg-orange-500 text-navy-950 flex flex-col items-center justify-center shadow-orange-glow border-4 border-amber-soft"
        >
          <span className="font-display text-2xl font-bold leading-none num-mono">{score}</span>
          <span className="text-[10px] font-semibold leading-tight mt-0.5">of 100</span>
        </motion.div>
      </div>

      <div className="px-3 pt-4 pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-3xl font-semibold">{listing.formattedPrice}</span>
          <span className="text-xs text-cream-200/80">Checked {listing.trustScore.verifiedAt}</span>
        </div>
        <p className="mt-1 text-sm text-cream-100/90 line-clamp-1">{listing.title}</p>

        <ul className="mt-4 grid grid-cols-1 gap-1.5">
          {dims.map((d, i) => (
            <motion.li
              key={d.id}
              initial={reduce ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: tick(i), duration: 0.5, ease: EASE }}
              className="flex items-center gap-2.5 text-sm"
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  d.status === 'PASSED' ? 'bg-trust-green text-white' : 'bg-trust-amber text-navy-950'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="flex-1 text-cream-50/95">{d.name}</span>
              <span className="num-mono text-xs text-cream-200/80">{d.score}/{d.maxScore}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.button>
  );
};
