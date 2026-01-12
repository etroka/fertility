import Timeline from '../dashboard/Timeline';
import { useAuth } from '../../AuthContext';
import { getCheckIns, getMilestones } from '../../db';
import { useState, useEffect } from 'react';

export default function ProgressPage() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [checkInHistory, setCheckInHistory] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const milestonesData = await getMilestones(user.id);
      setMilestones(milestonesData);

      const checkIns = await getCheckIns(user.id, 30);
      setCheckInHistory(checkIns);
    } catch (error) {
      console.error('Error loading progress data:', error);
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

  const monthlyCompletionRate = calculateCompletionRate(checkInHistory);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Your Progress Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Total Check-Ins</div>
            <div className="text-3xl font-bold text-primary">
              {checkInHistory.length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">30-Day Rate</div>
            <div className="text-3xl font-bold text-secondary">
              {monthlyCompletionRate}%
            </div>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Last 30 Days
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (29 - index));
              const dateString = date.toISOString().split('T')[0];

              const checkIn = checkInHistory.find((c) => c.date === dateString);
              const hasCheckIn = !!checkIn;
              const completionRate = hasCheckIn
                ? calculateCompletionRate([checkIn])
                : 0;

              return (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                    completionRate >= 80
                      ? 'bg-green-500 text-white'
                      : completionRate >= 50
                      ? 'bg-yellow-400 text-gray-900'
                      : completionRate > 0
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-600">80%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-400 rounded" />
              <span className="text-gray-600">50-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-400 rounded" />
              <span className="text-gray-600">1-49%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-100 rounded" />
              <span className="text-gray-600">None</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Milestones Achieved
          </h3>
          <div className="space-y-3">
            {milestones.map((milestone, index) => {
              const date = new Date(milestone.achievedAt);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {milestone.type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Timeline />
    </div>
  );
}
