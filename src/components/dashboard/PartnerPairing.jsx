import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { generatePairingCode } from '../../crypto';
import {
  getPartnership,
  createPartnership,
  findPartnershipByCode,
  getCheckIns,
  getUserByEmail
} from '../../db';

export default function PartnerPairing() {
  const { user } = useAuth();
  const [partnership, setPartnership] = useState(null);
  const [pairingCode, setPairingCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPairForm, setShowPairForm] = useState(false);
  const [partnerStats, setPartnerStats] = useState(null);
  const [myStats, setMyStats] = useState(null);

  useEffect(() => {
    loadPartnership();
  }, [user]);

  const loadPartnership = async () => {
    if (!user) return;

    try {
      const existingPartnership = await getPartnership(user.id);
      if (existingPartnership) {
        setPartnership(existingPartnership);
        await loadStats(existingPartnership.partnerId);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading partnership:', error);
      setLoading(false);
    }
  };

  const loadStats = async (partnerId) => {
    try {
      // Load my stats
      const myCheckIns = await getCheckIns(user.id, 7);
      const myCompletionRate = calculateCompletionRate(myCheckIns);
      setMyStats({
        weeklyCompletionRate: myCompletionRate,
        totalCheckIns: myCheckIns.length
      });

      // Load partner stats
      const partnerCheckIns = await getCheckIns(partnerId, 7);
      const partnerCompletionRate = calculateCompletionRate(partnerCheckIns);
      setPartnerStats({
        weeklyCompletionRate: partnerCompletionRate,
        totalCheckIns: partnerCheckIns.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

    const maxFields = checkIns.length * 6; // 6 possible fields
    return Math.round((totalFields / maxFields) * 100);
  };

  const generateCode = () => {
    const code = generatePairingCode();
    setPairingCode(code);
  };

  const handlePair = async () => {
    if (!user || !partnerCode) return;

    try {
      // Find the partnership by code
      const existingPartnership = await findPartnershipByCode(partnerCode.toUpperCase());

      if (!existingPartnership) {
        alert('Invalid pairing code. Please check and try again.');
        return;
      }

      if (existingPartnership.partnerId) {
        alert('This pairing code is already used.');
        return;
      }

      // Create mutual partnership
      await createPartnership(
        user.id,
        existingPartnership.userId,
        partnerCode.toUpperCase(),
        {
          shareCheckIns: true,
          shareTimeline: true,
          shareNotes: false
        }
      );

      // Update the original partnership
      await createPartnership(
        existingPartnership.userId,
        user.id,
        partnerCode.toUpperCase(),
        {
          shareCheckIns: true,
          shareTimeline: true,
          shareNotes: false
        }
      );

      setPartnerCode('');
      setShowPairForm(false);
      await loadPartnership();
      alert('Successfully paired with your partner!');
    } catch (error) {
      console.error('Error pairing:', error);
      alert('Failed to pair. Please try again.');
    }
  };

  const handleGenerateAndSave = async () => {
    if (!user) return;

    try {
      const code = generatePairingCode();
      await createPartnership(user.id, null, code, {
        shareCheckIns: true,
        shareTimeline: true,
        shareNotes: false
      });
      setPairingCode(code);
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Failed to generate code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!partnership || !partnership.partnerId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Partner Connection
        </h2>

        {!showPairForm && !pairingCode && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Share your journey with your partner! Track progress together and stay motivated.
            </p>

            <button
              onClick={handleGenerateAndSave}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors touch-target"
            >
              Generate Pairing Code
            </button>

            <button
              onClick={() => setShowPairForm(true)}
              className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors touch-target"
            >
              Enter Partner's Code
            </button>
          </div>
        )}

        {pairingCode && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              Share this code with your partner:
            </p>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-4xl font-bold text-center text-primary tracking-wider">
                {pairingCode}
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Your partner can enter this code to connect with you
            </p>
            <button
              onClick={() => {
                setPairingCode('');
                setShowPairForm(true);
              }}
              className="w-full mt-4 bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors touch-target"
            >
              Enter Partner's Code Instead
            </button>
          </div>
        )}

        {showPairForm && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter your partner's 6-character pairing code:
            </p>
            <input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl font-bold text-center tracking-wider focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="ABC123"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPairForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                onClick={handlePair}
                disabled={partnerCode.length !== 6}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
              >
                Pair
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Paired view
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Partner Progress
        </h2>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          Connected ✓
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">You</div>
          <div className="text-3xl font-bold text-primary mb-1">
            {myStats?.weeklyCompletionRate || 0}%
          </div>
          <div className="text-xs text-gray-500">This week</div>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4">
          <div className="text-sm text-gray-600 mb-1">Partner</div>
          <div className="text-3xl font-bold text-accent mb-1">
            {partnerStats?.weeklyCompletionRate || 0}%
          </div>
          <div className="text-xs text-gray-500">This week</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Combined Streak</div>
            <div className="text-2xl font-bold text-secondary">
              {Math.min(myStats?.totalCheckIns || 0, partnerStats?.totalCheckIns || 0)} days
            </div>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Keep each other motivated!</span> Your combined efforts are building toward a healthier future together.
        </p>
      </div>
    </div>
  );
}
