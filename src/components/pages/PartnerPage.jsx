import PartnerPairing from '../dashboard/PartnerPairing';

export default function PartnerPage() {
  return (
    <div className="space-y-6">
      <PartnerPairing />

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Why Partner Together?
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <div className="text-xl">💪</div>
            <div>
              <div className="font-semibold">Mutual Accountability</div>
              <div className="text-gray-600">
                Stay motivated by tracking progress together and encouraging each other
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">🎯</div>
            <div>
              <div className="font-semibold">Shared Goals</div>
              <div className="text-gray-600">
                Work toward your fertility goals as a team, celebrating milestones together
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-xl">📊</div>
            <div>
              <div className="font-semibold">Combined Progress</div>
              <div className="text-gray-600">
                See how both partners are doing and identify areas for improvement
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Privacy Note:</span> When you pair with a partner, you can choose what information to share. By default, check-ins and timeline progress are shared, but you can customize this in settings.
        </p>
      </div>
    </div>
  );
}
