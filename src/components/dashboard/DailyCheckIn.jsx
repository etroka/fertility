import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { saveCheckIn, getTodayCheckIn, getCheckIns, saveMilestone, getMilestones } from '../../db';
import confetti from 'canvas-confetti';

export default function DailyCheckIn() {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState({
    supplements: false,
    sleep: false,
    exercise: '',
    temperature: false,
    alcohol: false,
    stress: false
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);
  const [educationalCard, setEducationalCard] = useState(null);

  useEffect(() => {
    loadTodayCheckIn();
    calculateStreak();
  }, [user]);

  const loadTodayCheckIn = async () => {
    if (!user) return;

    try {
      const todayData = await getTodayCheckIn(user.id);
      if (todayData) {
        setCheckIn({
          supplements: todayData.supplements || false,
          sleep: todayData.sleep || false,
          exercise: todayData.exercise || '',
          temperature: todayData.temperature || false,
          alcohol: todayData.alcohol || false,
          stress: todayData.stress || false
        });
        setSaved(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading check-in:', error);
      setLoading(false);
    }
  };

  const calculateStreak = async () => {
    if (!user) return;

    try {
      const checkIns = await getCheckIns(user.id, 90);
      let currentStreak = 0;
      const today = new Date();

      for (let i = 0; i < checkIns.length; i++) {
        const checkInDate = new Date(checkIns[i].date);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);

        if (checkInDate.toDateString() === expectedDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const handleCheckboxChange = (field, value) => {
    setCheckIn((prev) => ({ ...prev, [field]: value }));
    setSaved(false);

    // Show educational card based on input
    if (field === 'sleep' && !value) {
      setEducationalCard({
        title: 'Why Sleep Matters',
        content:
          'Quality sleep is crucial for hormone regulation and reproductive health. Aim for 7-9 hours per night for optimal fertility.',
        emoji: '😴'
      });
    } else if (field === 'stress' && !value) {
      setEducationalCard({
        title: 'Managing Stress',
        content:
          'High stress levels can affect hormone balance and fertility. Try meditation, deep breathing, or gentle exercise to manage stress.',
        emoji: '🧘'
      });
    } else {
      setEducationalCard(null);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await saveCheckIn(user.id, checkIn);
      setSaved(true);

      // Recalculate streak
      await calculateStreak();

      // Check for milestones
      const newStreak = streak + 1;
      const milestones = await getMilestones(user.id);
      const milestoneTypes = milestones.map((m) => m.type);

      if (
        (newStreak === 7 && !milestoneTypes.includes('streak_7')) ||
        (newStreak === 14 && !milestoneTypes.includes('streak_14')) ||
        (newStreak === 30 && !milestoneTypes.includes('streak_30')) ||
        (newStreak === 60 && !milestoneTypes.includes('streak_60')) ||
        (newStreak === 90 && !milestoneTypes.includes('streak_90'))
      ) {
        await saveMilestone(user.id, `streak_${newStreak}`, { streak: newStreak });
        celebrateMilestone(newStreak);
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Failed to save check-in. Please try again.');
    }
  };

  const celebrateMilestone = (days) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      alert(`🎉 Congratulations! You've reached a ${days}-day streak! Keep up the great work!`);
    }, 500);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Daily Check-In</h2>
        {streak > 0 && (
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <span>🔥</span>
            <span>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-target">
          <input
            type="checkbox"
            checked={checkIn.supplements}
            onChange={(e) => handleCheckboxChange('supplements', e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="flex-1 font-medium text-gray-900">
            Took supplements
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-target">
          <input
            type="checkbox"
            checked={checkIn.sleep}
            onChange={(e) => handleCheckboxChange('sleep', e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="flex-1 font-medium text-gray-900">
            Slept 7+ hours
          </span>
        </label>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block font-medium text-gray-900 mb-2">
            Exercise intensity
          </label>
          <div className="flex gap-2">
            {['none', 'light', 'moderate', 'intense'].map((level) => (
              <button
                key={level}
                onClick={() => handleCheckboxChange('exercise', level)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all touch-target ${
                  checkIn.exercise === level
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {user?.sex === 'female' && (
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-target">
            <input
              type="checkbox"
              checked={checkIn.temperature}
              onChange={(e) => handleCheckboxChange('temperature', e.target.checked)}
              className="w-5 h-5 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <span className="flex-1 font-medium text-gray-900">
              Tracked temperature
            </span>
          </label>
        )}

        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-target">
          <input
            type="checkbox"
            checked={checkIn.alcohol}
            onChange={(e) => handleCheckboxChange('alcohol', e.target.checked)}
            className="w-5 h-5 text-secondary focus:ring-secondary border-gray-300 rounded"
          />
          <span className="flex-1 font-medium text-gray-900">
            Avoided alcohol
          </span>
        </label>

        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-target">
          <input
            type="checkbox"
            checked={checkIn.stress}
            onChange={(e) => handleCheckboxChange('stress', e.target.checked)}
            className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="flex-1 font-medium text-gray-900">
            Managed stress
          </span>
        </label>
      </div>

      {educationalCard && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{educationalCard.emoji}</div>
            <div>
              <div className="font-semibold text-blue-900 text-sm mb-1">
                {educationalCard.title}
              </div>
              <div className="text-xs text-blue-800">
                {educationalCard.content}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saved}
        className={`w-full py-3 rounded-lg font-semibold transition-colors touch-target ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {saved ? '✓ Saved for Today' : 'Save Check-In'}
      </button>
    </div>
  );
}
