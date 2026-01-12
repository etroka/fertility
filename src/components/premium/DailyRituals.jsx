import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTodayCheckIn, saveCheckIn } from '../../db';
import GlassCard from './GlassCard';

const rituals = [
  {
    id: 'supplements',
    label: 'Supplements',
    field: 'supplements',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: 'sleep',
    label: 'Sleep 7+hrs',
    field: 'sleep',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  },
  {
    id: 'exercise',
    label: 'Movement',
    field: 'exercise',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    isSpecial: true
  },
  {
    id: 'temperature',
    label: 'Temperature',
    field: 'temperature',
    femaleOnly: true,
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'alcohol',
    label: 'No Alcohol',
    field: 'alcohol',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    )
  },
  {
    id: 'stress',
    label: 'Stress Mgmt',
    field: 'stress',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
];

export default function DailyRituals({ userId }) {
  const [checkIn, setCheckIn] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayCheckIn();
  }, [userId]);

  const loadTodayCheckIn = async () => {
    if (!userId) return;

    try {
      const todayData = await getTodayCheckIn(userId);
      if (todayData) {
        setCheckIn(todayData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading check-in:', error);
      setLoading(false);
    }
  };

  const toggleRitual = async (field) => {
    const newValue = !checkIn[field];
    const newCheckIn = { ...checkIn, [field]: newValue };
    setCheckIn(newCheckIn);

    try {
      await saveCheckIn(userId, newCheckIn);
    } catch (error) {
      console.error('Error saving ritual:', error);
      setCheckIn(checkIn);
    }
  };

  if (loading) return null;

  const completedCount = Object.values(checkIn).filter(Boolean).length;

  return (
    <GlassCard variant="strong" delay={0.4}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-md font-serif text-stone-900">
            Daily Rituals
          </h2>
          <span className="text-body-sm text-stone-500">
            {completedCount} of {rituals.length} complete
          </span>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rituals.map((ritual, index) => {
            const isComplete = checkIn[ritual.field];
            const isExercise = ritual.field === 'exercise';

            return (
              <motion.button
                key={ritual.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.4 + index * 0.05,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                onClick={() => !isExercise && toggleRitual(ritual.field)}
                className="relative touch-target"
                disabled={isExercise}
              >
                <div
                  className={`
                    aspect-square rounded-2xl p-4
                    flex flex-col items-center justify-center gap-3
                    transition-all duration-300
                    ${isComplete
                      ? 'bg-gradient-to-br from-harmony-sage to-harmony-mint shadow-glow-green border-2 border-harmony-forest'
                      : 'bg-white/40 backdrop-blur-sm border-2 border-stone-200/50'
                    }
                    ${!isExercise && 'hover:scale-105 active:scale-95 cursor-pointer'}
                  `}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{
                      scale: isComplete ? [1, 1.1, 1] : 1,
                      rotate: isComplete ? [0, 5, -5, 0] : 0
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut'
                    }}
                    className={isComplete ? 'text-harmony-earth' : 'text-stone-600'}
                  >
                    {ritual.icon}
                  </motion.div>

                  {/* Label */}
                  <div className="text-center">
                    <p className={`
                      text-sm font-medium
                      ${isComplete ? 'text-harmony-earth' : 'text-stone-700'}
                    `}>
                      {ritual.label}
                    </p>
                  </div>

                  {/* Checkmark */}
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-harmony-forest rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Progress hint */}
        <p className="mt-6 text-body-sm text-stone-600 text-center">
          Complete your daily rituals to build lasting vitality
        </p>
      </div>
    </GlassCard>
  );
}
