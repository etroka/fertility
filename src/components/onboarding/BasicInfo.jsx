import { useState } from 'react';

export default function BasicInfo({ data, updateData, onNext, onBack }) {
  const [name, setName] = useState(data.name);
  const [age, setAge] = useState(data.age);
  const [sex, setSex] = useState(data.sex);
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    if (!name || !age || !sex) {
      setError('Please fill in all fields');
      return;
    }

    if (age < 18 || age > 100) {
      setError('Please enter a valid age');
      return;
    }

    updateData({ name, age: parseInt(age), sex });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Tell Us About Yourself
      </h2>
      <p className="text-gray-600 mb-6">
        This helps us personalize your experience
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your age"
            min="18"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSex('male')}
              className={`py-4 px-6 rounded-lg border-2 font-medium transition-all touch-target ${
                sex === 'male'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setSex('female')}
              className={`py-4 px-6 rounded-lg border-2 font-medium transition-all touch-target ${
                sex === 'female'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              Female
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This determines your personalized timeline (74 days for males, 90 days for females)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
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
    </div>
  );
}
