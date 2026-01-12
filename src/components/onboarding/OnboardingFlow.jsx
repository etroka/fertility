import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { trackAnalytics } from '../../db';
import EmailPassword from './EmailPassword';
import BasicInfo from './BasicInfo';
import HealthBaseline from './HealthBaseline';
import TimelineGeneration from './TimelineGeneration';
import DashboardPreview from './DashboardPreview';

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    sex: '',
    exerciseFrequency: '',
    sleepHours: '',
    caffeine: 'none',
    alcohol: 'none',
    smoking: 'no',
    currentSupplements: []
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      const { email, password, ...userData } = formData;

      // Separate health data
      const healthData = {
        exerciseFrequency: userData.exerciseFrequency,
        sleepHours: userData.sleepHours,
        caffeine: userData.caffeine,
        alcohol: userData.alcohol,
        smoking: userData.smoking,
        currentSupplements: userData.currentSupplements
      };

      // Create user with basic info
      const user = await signup(email, password, {
        name: userData.name,
        age: userData.age,
        sex: userData.sex,
        healthData,
        startDate: new Date().toISOString()
      });

      // Track signup completion
      await trackAnalytics(user.id, 'signup_completed', {
        sex: userData.sex,
        age: userData.age
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete signup. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailPassword
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <BasicInfo
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <HealthBaseline
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <TimelineGeneration
            data={formData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <DashboardPreview
            data={formData}
            onComplete={handleComplete}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i <= step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">{renderStep()}</div>
      </div>
    </div>
  );
}
