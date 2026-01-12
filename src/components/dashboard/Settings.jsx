import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { exportUserData } from '../../db';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    if (!user) return;

    setExporting(true);
    try {
      const data = await exportUserData(user.id);

      // Create JSON file and download
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fertility-app-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Account</h3>
            <div className="text-sm text-gray-600">
              <div className="mb-1">
                <span className="font-medium">Email:</span> {user?.email}
              </div>
              <div className="mb-1">
                <span className="font-medium">Name:</span> {user?.name}
              </div>
              <div className="mb-1">
                <span className="font-medium">Age:</span> {user?.age}
              </div>
              <div>
                <span className="font-medium">Sex:</span>{' '}
                {user?.sex === 'male' ? 'Male' : 'Female'}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Data & Privacy</h3>
            <p className="text-sm text-gray-600 mb-3">
              All your data is stored locally on your device and encrypted with your password. No data is sent to any server.
            </p>
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary/90 disabled:opacity-50 transition-colors touch-target"
            >
              {exporting ? 'Exporting...' : 'Export My Data (JSON)'}
            </button>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-sm text-gray-600 mb-2">
              Fertility Optimization App v1.0
            </p>
            <p className="text-xs text-gray-500">
              This app is for educational purposes only. It is not medical advice and should not replace consultation with a qualified healthcare provider.
            </p>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors touch-target"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Need Help?</span> Your data is stored securely on your device. Make sure to export your data regularly as a backup.
        </p>
      </div>
    </div>
  );
}
