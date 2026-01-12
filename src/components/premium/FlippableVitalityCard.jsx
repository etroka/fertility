import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FlippableVitalityCard({
  value,
  max,
  label,
  sublabel,
  color = 'vitality',
  icon,
  detailTitle,
  detailContent,
  gradient,
  delay = 0
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const percentage = (value / max) * 100;

  const colorConfig = {
    vitality: {
      ring: 'stroke-vitality-coral',
      text: 'text-vitality-coral',
      bg: 'from-vitality-dawn to-vitality-coral'
    },
    flow: {
      ring: 'stroke-flow-ocean',
      text: 'text-flow-ocean',
      bg: 'from-flow-mist to-flow-ocean'
    },
    harmony: {
      ring: 'stroke-harmony-forest',
      text: 'text-harmony-forest',
      bg: 'from-harmony-sage to-harmony-forest'
    }
  };

  const colors = colorConfig[color] || colorConfig.vitality;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="perspective-1000 h-full"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 glass-card-strong rounded-3xl p-6 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${colors.bg} rounded-3xl`} />

          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {/* Icon */}
            {icon && (
              <div className={`text-4xl mb-4 ${colors.text}`}>
                {icon}
              </div>
            )}

            {/* Circular progress */}
            <div className="relative w-32 h-32 mb-4">
              <svg className="transform -rotate-90 w-full h-full">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-stone-200/50"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  className={colors.ring}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - percentage / 100) }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                />
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-stone-900"
                >
                  {value}
                </motion.div>
                <div className="text-xs text-stone-500 uppercase tracking-wider">
                  of {max}
                </div>
              </div>
            </div>

            {/* Label */}
            <h3 className="text-heading-md font-serif text-stone-900 text-center mb-1">
              {label}
            </h3>
            <p className="text-body-sm text-stone-600 text-center">
              {sublabel}
            </p>

            {/* Tap to flip hint */}
            <div className="mt-4 text-caption text-stone-400 uppercase tracking-wider">
              Tap for details
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 glass-card-strong rounded-3xl p-6 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${colors.bg} rounded-3xl`} />

          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-heading-md font-serif text-stone-900 mb-4">
              {detailTitle}
            </h3>
            <div className="flex-1 overflow-y-auto text-body text-stone-700 space-y-2">
              {detailContent}
            </div>

            {/* Tap to flip back hint */}
            <div className="mt-4 text-caption text-stone-400 uppercase tracking-wider text-center">
              Tap to go back
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
