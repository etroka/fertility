import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function HealthWaveChart({ data = [], type = 'sperm' }) {
  // Generate wave path from check-in data
  const wavePath = useMemo(() => {
    if (data.length === 0) return '';

    const width = 600;
    const height = 200;
    const points = 30;

    // Calculate completion rate for each day
    const rates = Array.from({ length: points }, (_, i) => {
      const checkIn = data[points - 1 - i];
      if (!checkIn) return 50;

      let completed = 0;
      let total = 6;

      if (checkIn.supplements) completed++;
      if (checkIn.sleep) completed++;
      if (checkIn.exercise) completed++;
      if (checkIn.alcohol) completed++;
      if (checkIn.stress) completed++;
      if (checkIn.temperature) completed++;

      return (completed / total) * 100;
    });

    // Generate smooth wave using quadratic curves
    const stepX = width / (points - 1);
    let path = `M 0,${height - (rates[0] / 100) * height}`;

    for (let i = 1; i < points; i++) {
      const x = i * stepX;
      const y = height - (rates[i] / 100) * height;
      const prevX = (i - 1) * stepX;
      const prevY = height - (rates[i - 1] / 100) * height;

      const cpX = (prevX + x) / 2;
      const cpY = (prevY + y) / 2;

      path += ` Q ${cpX},${prevY} ${x},${y}`;
    }

    return path;
  }, [data]);

  const colorConfig = {
    sperm: {
      gradient: 'from-flow-ocean to-flow-deep',
      stroke: '#38BDF8',
      fill: 'rgba(56, 189, 248, 0.1)',
      glow: 'shadow-glow-blue'
    },
    cycle: {
      gradient: 'from-vitality-coral to-vitality-ember',
      stroke: '#FB7185',
      fill: 'rgba(251, 113, 133, 0.1)',
      glow: 'shadow-glow'
    }
  };

  const colors = colorConfig[type] || colorConfig.sperm;

  const getCurrentPhase = () => {
    if (type === 'sperm') {
      return {
        current: 'Building Phase',
        description: 'Your body is actively producing healthy sperm cells'
      };
    } else {
      return {
        current: 'Follicular Phase',
        description: 'Egg development and hormonal preparation'
      };
    }
  };

  const phase = getCurrentPhase();

  return (
    <div className="space-y-6">
      {/* Phase Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-body-lg font-semibold text-stone-900">
            {phase.current}
          </h3>
          <p className="text-body-sm text-stone-600 mt-1">
            {phase.description}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-body-sm font-medium`}>
          Active
        </div>
      </div>

      {/* Wave Chart */}
      <div className="relative">
        <svg
          viewBox="0 0 600 200"
          className="w-full h-48"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={200 - (percent / 100) * 200}
              x2="600"
              y2={200 - (percent / 100) * 200}
              stroke="currentColor"
              strokeWidth="1"
              className="text-stone-200"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area under curve */}
          <motion.path
            d={`${wavePath} L 600,200 L 0,200 Z`}
            fill={colors.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Wave line */}
          <motion.path
            d={wavePath}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={colors.glow}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Glowing dot at end */}
          <motion.circle
            cx="600"
            cy={200 - (data[0] ? 60 : 50)}
            r="6"
            fill={colors.stroke}
            className={colors.glow}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              delay: 2,
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-caption text-stone-500 pr-2">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
      </div>

      {/* Timeline labels */}
      <div className="flex justify-between text-caption text-stone-500">
        <span>30 days ago</span>
        <span>Today</span>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-stone-100/50 rounded-xl">
          <div className="text-xl font-semibold text-stone-900">
            {data.length}
          </div>
          <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
            Days Tracked
          </div>
        </div>

        <div className="text-center p-3 bg-stone-100/50 rounded-xl">
          <div className={`text-xl font-semibold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            Trending ↗
          </div>
          <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
            Direction
          </div>
        </div>

        <div className="text-center p-3 bg-stone-100/50 rounded-xl">
          <div className="text-xl font-semibold text-stone-900">
            {Math.round(((data.filter(d => d.supplements && d.sleep).length) / Math.max(data.length, 1)) * 100)}%
          </div>
          <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
            Consistency
          </div>
        </div>
      </div>
    </div>
  );
}
