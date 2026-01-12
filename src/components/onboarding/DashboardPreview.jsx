export default function DashboardPreview({ data, onComplete, onBack }) {
  const cycleLength = data.sex === 'male' ? 74 : 90;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're All Set, {data.name}!
      </h2>
      <p className="text-gray-600 mb-6">
        Here's a preview of what you'll see on your dashboard
      </p>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Day into Program</div>
          <div className="text-5xl font-bold mb-2">1</div>
          <div className="text-sm opacity-90">
            {cycleLength - 1} days until optimized window
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3">
            Daily Check-In Tasks
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-gray-700">Take supplements</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-gray-700">Sleep 7+ hours</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-gray-700">Exercise</span>
            </div>
            {data.sex === 'female' && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                <span className="text-gray-700">Track temperature</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="text-sm text-amber-900 font-semibold mb-1">
                Daily Check-ins Build Habits
              </p>
              <p className="text-xs text-amber-800">
                Track your progress daily to see how consistent habits lead to optimization. You can also pair with your partner to share the journey together!
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors touch-target"
          >
            Back
          </button>
          <button
            onClick={onComplete}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors touch-target"
          >
            Start My Journey
          </button>
        </div>
      </div>
    </div>
  );
}
