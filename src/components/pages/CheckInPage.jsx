import DailyCheckIn from '../dashboard/DailyCheckIn';

export default function CheckInPage() {
  return (
    <div className="space-y-6">
      <DailyCheckIn />

      <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Daily Habits Matter
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Consistency is key to fertility optimization. The daily choices you make today will be reflected in your biology over the coming weeks.
          </p>
          <p>
            Track your habits daily to build a strong foundation for reproductive health. Every check-in brings you closer to your goals!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Quick Tips
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <div className="text-xl">💊</div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Supplements</div>
              <div className="text-xs text-gray-600">
                Take at the same time daily for best absorption
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg">
            <div className="text-xl">😴</div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Sleep</div>
              <div className="text-xs text-gray-600">
                Aim for 7-9 hours for optimal hormone regulation
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg">
            <div className="text-xl">🏃</div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">Exercise</div>
              <div className="text-xs text-gray-600">
                Moderate exercise 3-4x/week supports fertility
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
