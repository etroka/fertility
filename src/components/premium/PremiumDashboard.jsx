import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthContext';
import { getCheckIns, getMilestones, getPartnership } from '../../db';
import GlassCard from './GlassCard';
import VitalityRing from './VitalityRing';
import DailyRituals from './DailyRituals';
import PartnerSynergy from './PartnerSynergy';
import HealthWaveChart from './HealthWaveChart';

export default function PremiumDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    dayInProgram: 0,
    vitalityScore: 0,
    weeklyCompletionRate: 0,
    partnerCompletionRate: 0,
    checkInHistory: [],
  });
  const [partnership, setPartnership] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('morning');

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Calculate days in program
      const startDate = new Date(user.startDate);
      const today = new Date();
      const diffTime = Math.abs(today - startDate);
      const dayInProgram = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Get check-ins
      const checkIns = await getCheckIns(user.id, 30);
      const thisWeekCheckIns = checkIns.slice(0, 7);

      // Calculate vitality score (0-100)
      const weeklyCompletionRate = calculateCompletionRate(thisWeekCheckIns);
      const vitalityScore = Math.round(weeklyCompletionRate);

      // Get partnership data
      const partnershipData = await getPartnership(user.id);
      let partnerCompletionRate = 0;

      if (partnershipData?.partnerId) {
        const partnerCheckIns = await getCheckIns(partnershipData.partnerId, 7);
        partnerCompletionRate = calculateCompletionRate(partnerCheckIns);
      }

      setStats({
        dayInProgram,
        vitalityScore,
        weeklyCompletionRate,
        partnerCompletionRate,
        checkInHistory: checkIns,
      });

      setPartnership(partnershipData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const calculateCompletionRate = (checkIns) => {
    if (checkIns.length === 0) return 0;

    const totalFields = checkIns.reduce((sum, checkIn) => {
      let fields = 0;
      if (checkIn.supplements) fields++;
      if (checkIn.sleep) fields++;
      if (checkIn.exercise) fields++;
      if (checkIn.alcohol) fields++;
      if (checkIn.stress) fields++;
      if (checkIn.temperature) fields++;
      return sum + fields;
    }, 0);

    const maxFields = checkIns.length * 6;
    return Math.round((totalFields / maxFields) * 100);
  };

  const greetingMap = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  };

  const cycleLength = user?.sex === 'male' ? 74 : 90;
  const daysRemaining = Math.max(cycleLength - stats.dayInProgram, 0);

  // Calculate collective vitality (average of both partners if paired)
  const collectiveVitality = partnership?.partnerId
    ? Math.round((stats.weeklyCompletionRate + stats.partnerCompletionRate) / 2)
    : stats.vitalityScore;

  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-50" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Warm Greeting */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center space-y-2"
        >
          <h1 className="text-heading-xl md:text-display font-serif text-stone-900">
            {greetingMap[timeOfDay]}, {user?.name}.
          </h1>
          <p className="text-body-lg text-stone-600">
            {partnership?.partnerId ? (
              <>
                Your collective vitality is at{' '}
                <span className="font-semibold text-stone-900">
                  {collectiveVitality}
                </span>{' '}
                today.
              </>
            ) : (
              <>
                Your vitality is at{' '}
                <span className="font-semibold text-stone-900">
                  {stats.vitalityScore}
                </span>{' '}
                today.
              </>
            )}
          </p>
        </motion.div>

        {/* Partner Synergy View (if partnered) */}
        {partnership?.partnerId && (
          <PartnerSynergy
            userScore={stats.weeklyCompletionRate}
            partnerScore={stats.partnerCompletionRate}
            userSex={user.sex}
          />
        )}

        {/* Vitality Rings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard
            variant="strong"
            gradient="bg-gradient-vitality"
            delay={0.1}
          >
            <div className="p-8 flex flex-col items-center">
              <VitalityRing
                value={stats.dayInProgram}
                max={cycleLength}
                color="vitality"
                label="Days in Program"
                icon="🔥"
              />
              <p className="mt-4 text-caption text-stone-600 text-center">
                {daysRemaining} days until optimized window
              </p>
            </div>
          </GlassCard>

          <GlassCard
            variant="strong"
            gradient="bg-gradient-flow"
            delay={0.2}
          >
            <div className="p-8 flex flex-col items-center">
              <VitalityRing
                value={stats.vitalityScore}
                max={100}
                color="flow"
                label="Weekly Vitality"
                icon="✨"
              />
              <p className="mt-4 text-caption text-stone-600 text-center">
                Based on your daily habits
              </p>
            </div>
          </GlassCard>

          <GlassCard
            variant="strong"
            gradient="bg-gradient-harmony"
            delay={0.3}
          >
            <div className="p-8 flex flex-col items-center">
              <VitalityRing
                value={stats.checkInHistory.length}
                max={cycleLength}
                color="harmony"
                label="Total Check-ins"
                icon="📊"
              />
              <p className="mt-4 text-caption text-stone-600 text-center">
                Consistency builds results
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Daily Rituals */}
        <DailyRituals userId={user?.id} />

        {/* Health Metrics Wave Chart */}
        <GlassCard variant="strong" delay={0.4}>
          <div className="p-8">
            <h2 className="text-heading-md font-serif text-stone-900 mb-6">
              {user?.sex === 'male' ? 'Sperm Health Journey' : 'Cycle Harmony'}
            </h2>
            <HealthWaveChart
              data={stats.checkInHistory}
              type={user?.sex === 'male' ? 'sperm' : 'cycle'}
            />
          </div>
        </GlassCard>

        {/* Movement Section */}
        <GlassCard variant="default" delay={0.5}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md font-serif text-stone-900">
                Movement
              </h2>
              <span className="text-body-sm text-stone-500">
                This week
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const day = stats.checkInHistory[6 - index];
                const hasExercise = day?.exercise && day.exercise !== 'none';
                const intensity = day?.exercise || 'none';

                const intensityColors = {
                  none: 'bg-stone-200',
                  light: 'bg-harmony-sage',
                  moderate: 'bg-harmony-mint',
                  intense: 'bg-harmony-forest',
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full
                        ${intensityColors[intensity]}
                        flex items-center justify-center
                        transition-all duration-300
                        ${hasExercise ? 'shadow-glow-green' : ''}
                      `}
                    >
                      {hasExercise && (
                        <span className="text-lg">🏃</span>
                      )}
                    </div>
                    <span className="text-caption text-stone-500">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-6 text-body-sm text-stone-600 text-center">
              Gentle, consistent movement supports reproductive health. Every step counts.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
