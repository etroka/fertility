import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { getCheckIns, getMilestones } from '../../db';
import Timeline from './Timeline';
import DailyCheckIn from './DailyCheckIn';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    dayInProgram: 0,
    longestStreak: 0,
    weeklyCompletionRate: 0,
    lastWeekCompletionRate: 0,
    totalCheckIns: 0,
    milestones: []
  });
  const [checkInHistory, setCheckInHistory] = useState([]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Calculate days in program
      const startDate = new Date(user.startDate);
      const today = new Date();
      const diffTime = Math.abs(today - startDate);
      const dayInProgram = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Get all check-ins
      const checkIns = await getCheckIns(user.id, 90);
      setCheckInHistory(checkIns);

      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      const sortedCheckIns = [...checkIns].reverse();

      for (let i = 0; i < sortedCheckIns.length; i++) {
        if (i === 0) {
          currentStreak = 1;
        } else {
          const prevDate = new Date(sortedCheckIns[i - 1].date);
          const currDate = new Date(sortedCheckIns[i].date);
          const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
          } else {
            if (currentStreak > longestStreak) {
              longestStreak = currentStreak;
            }
            currentStreak = 1;
          }
        }
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      // Calculate weekly completion rates
      const thisWeekCheckIns = checkIns.slice(0, 7);
      const lastWeekCheckIns = checkIns.slice(7, 14);

      const weeklyCompletionRate = calculateCompletionRate(thisWeekCheckIns);
      const lastWeekCompletionRate = calculateCompletionRate(lastWeekCheckIns);

      // Get milestones
      const milestones = await getMilestones(user.id);

      setStats({
        dayInProgram,
        longestStreak,
        weeklyCompletionRate,
        lastWeekCompletionRate,
        totalCheckIns: checkIns.length,
        milestones
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const cycleLength = user?.sex === 'male' ? 74 : 90;
  const progressPercentage = Math.min((stats.dayInProgram / cycleLength) * 100, 100);
  const completionChange = stats.weeklyCompletionRate - stats.lastWeekCompletionRate;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl shadow-lg p-6 text-white">
        <div className="text-sm opacity-90 mb-1">Day into Program</div>
        <div className="text-6xl font-bold mb-2">{stats.dayInProgram}</div>
        <div className="text-sm opacity-90">
          {Math.max(cycleLength - stats.dayInProgram, 0)} days until optimized window
        </div>

        <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Longest Streak</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-primary">
              {stats.longestStreak}
            </div>
            <div className="text-sm text-gray-500">days</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600 mb-1">This Week</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-secondary">
              {stats.weeklyCompletionRate}%
            </div>
            {completionChange !== 0 && (
              <div
                className={`text-sm ${
                  completionChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {completionChange > 0 ? '↑' : '↓'} {Math.abs(completionChange)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Check-in Frequency Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Check-In Frequency (Last 14 Days)
        </h3>
        <div className="flex items-end justify-between h-32 gap-1">
          {Array.from({ length: 14 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (13 - index));
            const dateString = date.toISOString().split('T')[0];

            const checkIn = checkInHistory.find((c) => c.date === dateString);
            const completionRate = checkIn
              ? calculateCompletionRate([checkIn])
              : 0;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-t transition-all duration-300"
                  style={{ height: `${completionRate}%` }}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Badges */}
      {stats.milestones.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Milestones Achieved
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md"
              >
                🏆 {milestone.type.replace('_', ' ').toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <Timeline />

      {/* Daily Check-In */}
      <DailyCheckIn />
    </div>
  );
}
