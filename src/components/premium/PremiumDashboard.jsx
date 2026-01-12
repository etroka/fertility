import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthContext';
import { getCheckIns, getMilestones, getPartnership } from '../../db';
import GlassCard from './GlassCard';
import FlippableVitalityCard from './FlippableVitalityCard';
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

        {/* Vitality Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96">
            <FlippableVitalityCard
              value={stats.dayInProgram}
              max={cycleLength}
              label="Days in Program"
              sublabel={`${daysRemaining} days until optimized`}
              color="vitality"
              gradient="from-vitality-dawn to-vitality-coral"
              delay={0.1}
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              }
              detailTitle="Your Journey Progress"
              detailContent={
                <div className="space-y-3">
                  <p>You are on day <strong>{stats.dayInProgram}</strong> of your {cycleLength}-day cycle.</p>
                  <p>{user?.sex === 'male' ? 'Sperm takes approximately 74 days to fully mature. Every healthy choice you make today will be reflected in your reproductive health in about 10-11 weeks.' : 'Egg maturation occurs over a 90-day cycle. The lifestyle choices you make now affect egg quality approximately 3 months from now.'}</p>
                  <p className="text-vitality-coral font-semibold">{daysRemaining} days until your optimized window begins!</p>
                </div>
              }
            />
          </div>

          <div className="h-96">
            <FlippableVitalityCard
              value={stats.vitalityScore}
              max={100}
              label="Weekly Vitality"
              sublabel="Based on daily habits"
              color="flow"
              gradient="from-flow-mist to-flow-ocean"
              delay={0.2}
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              detailTitle="Vitality Score Breakdown"
              detailContent={
                <div className="space-y-3">
                  <p>Your vitality score represents your consistency with daily health rituals over the past 7 days.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Supplements:</span>
                      <span className="font-semibold">{Math.round((stats.checkInHistory.slice(0,7).filter(c => c.supplements).length / 7) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleep (7+ hrs):</span>
                      <span className="font-semibold">{Math.round((stats.checkInHistory.slice(0,7).filter(c => c.sleep).length / 7) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movement:</span>
                      <span className="font-semibold">{Math.round((stats.checkInHistory.slice(0,7).filter(c => c.exercise && c.exercise !== 'none').length / 7) * 100)}%</span>
                    </div>
                  </div>
                  <p className="text-flow-ocean font-semibold">Keep building these habits for optimal results!</p>
                </div>
              }
            />
          </div>

          <div className="h-96">
            <FlippableVitalityCard
              value={stats.checkInHistory.length}
              max={cycleLength}
              label="Total Check-ins"
              sublabel="Consistency builds results"
              color="harmony"
              gradient="from-harmony-sage to-harmony-forest"
              delay={0.3}
              icon={
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              detailTitle="Check-in Consistency"
              detailContent={
                <div className="space-y-3">
                  <p>You've completed <strong>{stats.checkInHistory.length}</strong> check-ins since starting your journey!</p>
                  <p>Consistency Rate: <strong>{Math.round((stats.checkInHistory.length / stats.dayInProgram) * 100)}%</strong></p>
                  <div className="bg-harmony-sage/20 rounded-lg p-3">
                    <p className="text-sm">Studies show that tracking daily health habits improves adherence by up to 40%.</p>
                  </div>
                  <p className="text-harmony-earth font-semibold">You're building lasting health patterns!</p>
                </div>
              }
            />
          </div>
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
                        <svg className="w-5 h-5 text-harmony-earth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
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
