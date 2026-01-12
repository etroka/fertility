import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function PartnerSynergy({ userScore, partnerScore, userSex }) {
  const averageScore = Math.round((userScore + partnerScore) / 2);
  const synergy = Math.round((userScore * partnerScore) / 100); // Multiplicative synergy

  const getSynergyMessage = (score) => {
    if (score >= 80) return 'Exceptional harmony';
    if (score >= 60) return 'Strong alignment';
    if (score >= 40) return 'Building together';
    return 'Starting your journey';
  };

  return (
    <GlassCard variant="strong" gradient="bg-gradient-mesh" delay={0.2}>
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-heading-lg font-serif text-stone-900 mb-2">
            Partner Synergy
          </h2>
          <p className="text-body text-stone-600">
            {getSynergyMessage(synergy)}
          </p>
        </div>

        {/* Synergy Visualization */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* User Circle */}
          <motion.div
            initial={{ scale: 0, x: -50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <div
              className={`
                w-32 h-32 rounded-full
                flex items-center justify-center
                bg-gradient-to-br
                ${userSex === 'male' ? 'from-flow-sky to-flow-ocean' : 'from-vitality-blush to-vitality-coral'}
                shadow-lg
              `}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">
                  {userSex === 'male' ? '♂' : '♀'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {userScore}
                </div>
                <div className="text-xs text-white/80 uppercase tracking-wider">
                  You
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className={`
                absolute inset-0 rounded-full blur-xl
                ${userSex === 'male' ? 'bg-flow-ocean' : 'bg-vitality-coral'}
              `}
              style={{ zIndex: -1 }}
            />
          </motion.div>

          {/* Connection Animation */}
          <div className="relative w-24 h-24">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-harmony-mint to-harmony-forest flex items-center justify-center shadow-glow-green">
                <span className="text-2xl">✨</span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 rounded-full border-2 border-harmony-forest/30"
            />
          </div>

          {/* Partner Circle */}
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <div
              className={`
                w-32 h-32 rounded-full
                flex items-center justify-center
                bg-gradient-to-br
                ${userSex === 'male' ? 'from-vitality-blush to-vitality-coral' : 'from-flow-sky to-flow-ocean'}
                shadow-lg
              `}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">
                  {userSex === 'male' ? '♀' : '♂'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {partnerScore}
                </div>
                <div className="text-xs text-white/80 uppercase tracking-wider">
                  Partner
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
              className={`
                absolute inset-0 rounded-full blur-xl
                ${userSex === 'male' ? 'bg-vitality-coral' : 'bg-flow-ocean'}
              `}
              style={{ zIndex: -1 }}
            />
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/30 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-stone-900">
              {averageScore}
            </div>
            <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
              Average
            </div>
          </div>

          <div className="text-center p-4 bg-white/30 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold bg-gradient-to-br from-harmony-forest to-harmony-earth bg-clip-text text-transparent">
              {synergy}
            </div>
            <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
              Synergy
            </div>
          </div>

          <div className="text-center p-4 bg-white/30 rounded-2xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-stone-900">
              {Math.abs(userScore - partnerScore)}
            </div>
            <div className="text-caption text-stone-600 uppercase tracking-wider mt-1">
              Gap
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-body-sm text-stone-600">
            {synergy >= 70
              ? "You're both thriving! Keep this momentum going."
              : "Every day together brings you closer to your goal. Stay committed."}
          </p>
        </motion.div>
      </div>
    </GlassCard>
  );
}
