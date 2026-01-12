import { useState } from 'react';

export default function HealthBaseline({ data, updateData, onNext, onBack }) {
  const [exerciseFrequency, setExerciseFrequency] = useState(data.exerciseFrequency);
  const [sleepHours, setSleepHours] = useState(data.sleepHours);
  const [caffeine, setCaffeine] = useState(data.caffeine);
  const [alcohol, setAlcohol] = useState(data.alcohol);
  const [smoking, setSmoking] = useState(data.smoking);
  const [currentSupplements, setCurrentSupplements] = useState(data.currentSupplements || []);
  const [supplementInput, setSupplementInput] = useState('');

  const handleAddSupplement = () => {
    if (supplementInput.trim()) {
      setCurrentSupplements([...currentSupplements, supplementInput.trim()]);
      setSupplementInput('');
    }
  };

  const handleRemoveSupplement = (index) => {
    setCurrentSupplements(currentSupplements.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!exerciseFrequency || !sleepHours) {
      alert('Please fill in all required fields');
      return;
    }

    updateData({
      exerciseFrequency,
      sleepHours: parseInt(sleepHours),
      caffeine,
      alcohol,
      smoking,
      currentSupplements
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Health Baseline
      </h2>
      <p className="text-gray-600 mb-6">
        Help us understand your current habits
      </p>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Frequency
          </label>
          <select
            value={exerciseFrequency}
            onChange={(e) => setExerciseFrequency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select frequency</option>
            <option value="none">None</option>
            <option value="1-2">1-2 times per week</option>
            <option value="3-4">3-4 times per week</option>
            <option value="5+">5+ times per week</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Sleep Hours
          </label>
          <input
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Hours per night"
            min="0"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caffeine Intake
          </label>
          <select
            value={caffeine}
            onChange={(e) => setCaffeine(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="low">1 cup/day</option>
            <option value="moderate">2-3 cups/day</option>
            <option value="high">4+ cups/day</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alcohol Consumption
          </label>
          <select
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="occasional">Occasional (1-2 drinks/week)</option>
            <option value="moderate">Moderate (3-7 drinks/week)</option>
            <option value="frequent">Frequent (8+ drinks/week)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Smoking Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSmoking('no')}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-all touch-target ${
                smoking === 'no'
                  ? 'border-secondary bg-secondary/10 text-secondary'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Non-smoker
            </button>
            <button
              onClick={() => setSmoking('yes')}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-all touch-target ${
                smoking === 'yes'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Smoker
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Supplements (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={supplementInput}
              onChange={(e) => setSupplementInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSupplement()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Vitamin D, Folic Acid"
            />
            <button
              onClick={handleAddSupplement}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 touch-target"
            >
              Add
            </button>
          </div>
          {currentSupplements.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentSupplements.map((supplement, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {supplement}
                  <button
                    onClick={() => handleRemoveSupplement(index)}
                    className="text-primary hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors touch-target"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors touch-target"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
