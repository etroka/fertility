import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VitalityRing({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'vitality',
  label,
  icon
}) {
  const [progress, setProgress] = useState(0);
  const percentage = (value / max) * 100;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap = {
    vitality: {
      gradient: 'from-vitality-coral to-vitality-ember',
      glow: 'shadow-glow',
      ring: '#FB7185'
    },
    flow: {
      gradient: 'from-flow-ocean to-flow-deep',
      glow: 'shadow-glow-blue',
      ring: '#38BDF8'
    },
    harmony: {
      gradient: 'from-harmony-forest to-harmony-earth',
      glow: 'shadow-glow-green',
      ring: '#34D399'
    }
  };

  const colors = colorMap[color] || colorMap.vitality;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative flex flex-col items-center gap-3"
    >
      {/* Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-stone-200/50"
          />

          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.ring}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colors.glow} transition-all duration-1000 ease-out`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <div className={`text-2xl mb-1 bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent`}>
              {icon}
            </div>
          )}
          <motion.div
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-semibold text-stone-900"
          >
            {value}
          </motion.div>
          <div className="text-xs text-stone-500 uppercase tracking-wider">
            of {max}
          </div>
        </div>
      </div>

      {/* Label */}
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-stone-700">{label}</p>
        </div>
      )}
    </motion.div>
  );
}
