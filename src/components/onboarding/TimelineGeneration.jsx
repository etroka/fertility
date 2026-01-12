export default function TimelineGeneration({ data, onNext, onBack }) {
  const cycleLength = data.sex === 'male' ? 74 : 90;

  const getPhases = () => {
    if (data.sex === 'male') {
      return [
        { name: 'Foundation Phase', days: '1-14', color: 'bg-primary' },
        { name: 'Building Phase', days: '15-44', color: 'bg-secondary' },
        { name: 'Maturation Phase', days: '45-74', color: 'bg-accent' },
        { name: 'Optimized Window', days: '74+', color: 'bg-green-500' }
      ];
    } else {
      return [
        { name: 'Egg Development Start', days: '1-30', color: 'bg-primary' },
        { name: 'Maturation Window', days: '31-60', color: 'bg-secondary' },
        { name: 'Final Maturation', days: '61-90', color: 'bg-accent' },
        { name: 'Optimized Window', days: '90+', color: 'bg-green-500' }
      ];
    }
  };

  const phases = getPhases();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your Personalized Timeline
      </h2>
      <p className="text-gray-600 mb-6">
        Based on your biological sex, here's your {cycleLength}-day optimization journey
      </p>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-primary mb-2">
              {cycleLength}
            </div>
            <div className="text-gray-600">Days to Optimization</div>
          </div>

          <div className="space-y-3">
            {phases.map((phase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {phase.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Days {phase.days}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Why {cycleLength} days?</span> {' '}
            {data.sex === 'male'
              ? 'Sperm takes approximately 74 days to fully develop. The habits you build today will be reflected in your biology in about 10-11 weeks.'
              : 'Eggs mature over a 90-day cycle. The health choices you make now affect egg quality about 3 months from now.'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors touch-target"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors touch-target"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
