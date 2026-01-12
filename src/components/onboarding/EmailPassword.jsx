import { useState } from 'react';

export default function EmailPassword({ data, updateData, onNext }) {
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(data.password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToDisclaimer) {
      setError('Please agree to the disclaimer');
      return;
    }

    updateData({ email, password });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to Your Fertility Journey
      </h2>
      <p className="text-gray-600 mb-6">
        Let's get started with your account
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-amber-900 font-semibold mb-2">
            Important Disclaimer
          </p>
          <p className="text-xs text-amber-800 mb-3">
            This app is for educational purposes only. It is not medical advice and should not replace consultation with a qualified healthcare provider. Always consult with your doctor before making health decisions.
          </p>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToDisclaimer}
              onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
              className="mt-0.5 mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-xs text-amber-900">
              I understand and agree to the disclaimer
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors touch-target"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
