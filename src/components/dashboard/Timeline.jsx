import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';

export default function Timeline() {
  const { user } = useAuth();
  const [dayInProgram, setDayInProgram] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(null);

  useEffect(() => {
    if (user && user.startDate) {
      const start = new Date(user.startDate);
      const today = new Date();
      const diffTime = Math.abs(today - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDayInProgram(diffDays);

      // Determine current phase
      const cycleLength = user.sex === 'male' ? 74 : 90;
      const phases = getPhases(user.sex);

      for (const phase of phases) {
        if (diffDays >= phase.start && diffDays <= phase.end) {
          setCurrentPhase(phase);
          break;
        }
      }

      if (diffDays > cycleLength) {
        setCurrentPhase(phases[phases.length - 1]);
      }
    }
  }, [user]);

  const getPhases = (sex) => {
    if (sex === 'male') {
      return [
        {
          name: 'Foundation Phase',
          start: 1,
          end: 14,
          color: 'bg-primary',
          description: 'Building healthy habits'
        },
        {
          name: 'Building Phase',
          start: 15,
          end: 44,
          color: 'bg-secondary',
          description: 'Developing optimal conditions'
        },
        {
          name: 'Maturation Phase',
          start: 45,
          end: 74,
          color: 'bg-accent',
          description: 'Final optimization'
        },
        {
          name: 'Optimized Window',
          start: 75,
          end: Infinity,
          color: 'bg-green-500',
          description: 'Peak fertility window'
        }
      ];
    } else {
      return [
        {
          name: 'Egg Development Start',
          start: 1,
          end: 30,
          color: 'bg-primary',
          description: 'Early development phase'
        },
        {
          name: 'Maturation Window',
          start: 31,
          end: 60,
          color: 'bg-secondary',
          description: 'Active maturation'
        },
        {
          name: 'Final Maturation',
          start: 61,
          end: 90,
          color: 'bg-accent',
          description: 'Completing optimization'
        },
        {
          name: 'Optimized Window',
          start: 91,
          end: Infinity,
          color: 'bg-green-500',
          description: 'Peak fertility window'
        }
      ];
    }
  };

  const cycleLength = user?.sex === 'male' ? 74 : 90;
  const progressPercentage = Math.min((dayInProgram / cycleLength) * 100, 100);
  const phases = user ? getPhases(user.sex) : [];
  const daysRemaining = Math.max(cycleLength - dayInProgram, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Your Optimization Timeline
      </h2>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-3xl font-bold text-primary">
              Day {dayInProgram}
            </div>
            <div className="text-sm text-gray-600">
              {daysRemaining > 0
                ? `${daysRemaining} days to optimization`
                : 'In optimized window!'}
            </div>
          </div>
          {currentPhase && (
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {currentPhase.name}
              </div>
              <div className="text-xs text-gray-500">
                {currentPhase.description}
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>Day {cycleLength}</span>
        </div>
      </div>

      {/* Phase breakdown */}
      <div className="space-y-2">
        {phases.map((phase, index) => {
          const isActive =
            dayInProgram >= phase.start && dayInProgram <= phase.end;
          const isPast = dayInProgram > phase.end;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary'
                  : isPast
                  ? 'bg-gray-50 opacity-60'
                  : 'bg-gray-50'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${phase.color} ${
                  isActive ? 'animate-pulse' : ''
                }`}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">
                  {phase.name}
                </div>
                <div className="text-xs text-gray-500">
                  Days {phase.start}
                  {phase.end === Infinity ? '+' : `-${phase.end}`}
                </div>
              </div>
              {isActive && (
                <div className="text-xs font-semibold text-primary">
                  Current
                </div>
              )}
              {isPast && (
                <div className="text-xs text-gray-400">✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Impact countdown */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⏳</div>
          <div>
            <div className="font-semibold text-amber-900 text-sm mb-1">
              Impact Countdown
            </div>
            <div className="text-xs text-amber-800">
              The healthy habits you build today will be reflected in your
              biology in approximately{' '}
              <span className="font-bold">{daysRemaining} days</span>.
              Every choice matters!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
