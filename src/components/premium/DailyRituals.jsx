import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTodayCheckIn, saveCheckIn } from '../../db';
import GlassCard from './GlassCard';

const rituals = [
  { id: 'supplements', icon: '💊', label: 'Supplements', field: 'supplements' },
  { id: 'sleep', icon: '😴', label: 'Sleep 7+hrs', field: 'sleep' },
  { id: 'exercise', icon: '🏃', label: 'Movement', field: 'exercise' },
  { id: 'temperature', icon: '🌡️', label: 'Temperature', field: 'temperature', femaleOnly: true },
  { id: 'alcohol', icon: '🚫', label: 'No Alcohol', field: 'alcohol' },
  { id: 'stress', icon: '🧘', label: 'Stress Mgmt', field: 'stress' },
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
      // Revert on error
      setCheckIn(checkIn);
    }
  };

  if (loading) return null;

  return (
    <GlassCard variant="strong" delay={0.4}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-md font-serif text-stone-900">
            Daily Rituals
          </h2>
          <span className="text-body-sm text-stone-500">
            {Object.values(checkIn).filter(Boolean).length} of {rituals.length} complete
          </span>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative -mx-8 px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
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
                  className="flex-shrink-0 snap-center touch-target"
                >
                  <div
                    className={`
                      w-32 h-40 rounded-2xl p-4
                      flex flex-col items-center justify-center gap-3
                      transition-all duration-300
                      ${isComplete
                        ? 'bg-gradient-to-br from-harmony-sage to-harmony-mint shadow-glow-green'
                        : 'bg-white/40 backdrop-blur-sm border border-stone-200/50'
                      }
                      ${!isExercise && 'hover:scale-105 active:scale-95'}
                    `}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isComplete ? [1, 1.2, 1] : 1,
                        rotate: isComplete ? [0, 10, -10, 0] : 0
                      }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut'
                      }}
                      className="text-4xl"
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
        </div>

        {/* Progress hint */}
        <p className="mt-6 text-body-sm text-stone-600 text-center">
          Complete your daily rituals to build lasting vitality
        </p>
      </div>
    </GlassCard>
  );
}
