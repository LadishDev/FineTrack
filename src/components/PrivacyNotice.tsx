
interface PrivacyNoticeProps {
  onAccept: () => void;
  onDeny: () => void;
  isUpdate?: boolean;
  previousVersion?: string | null;
  currentVersion?: string;
}

const updateLog: Record<string, string> = {
  '1.0.0': 'Initial public release with privacy/terms gating and versioned update notices.'
  // Add future version logs here
};

function compareVersions(a?: string | null, b?: string | null): number {
  if (!a || !b) return 0;
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onAccept, onDeny, isUpdate, previousVersion, currentVersion }) => {
  const versionChange = compareVersions(currentVersion, previousVersion);
  const isUpgrade = isUpdate && versionChange > 0;
  const isDowngrade = isUpdate && versionChange < 0;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8">
        <h1 className="text-3xl font-bold mb-4">
          {isUpgrade ? 'FineTrack has been updated!' : isDowngrade ? 'FineTrack version has been downgraded!' : 'Welcome To FineTrack!'}
        </h1>
        {isUpgrade && (
          <p className="mb-4 text-sm">
            You previously accepted our privacy policy and terms for version{previousVersion ? ` ${previousVersion}` : ''}. Please review the latest policies and updates for version {currentVersion}.
          </p>
        )}
        {isDowngrade && (
          <p className="mb-4 text-sm text-red-700">
            You previously accepted our privacy policy and terms for version{previousVersion ? ` ${previousVersion}` : ''}. You are now using an older version ({currentVersion}).
          </p>
        )}
        <p className="mb-4 text-xs font-bold text-gray-700 bg-yellow-100 border-l-4 border-yellow-400 pl-3 py-2 rounded">
          This app uses third-party services and is not affiliated with or endorsed by the UK Government. Always verify the authenticity of any website before making payments. FineTrack is not responsible for the content or accuracy of external links.
        </p>
        {isUpgrade && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-2 text-blue-800">What’s New in {currentVersion}</h2>
            <ul className="text-xs text-blue-900 list-disc pl-5">
              {Object.entries(updateLog)
                .filter(([ver]) => !previousVersion || compareVersions(ver, previousVersion) > 0)
                .map(([ver, log]) => (
                  <li key={ver}><span className="font-bold">v{ver}:</span> {log}</li>
                ))}
            </ul>
          </div>
        )}
      <h2 className="text-xl font-semibold mt-6 mb-2">Privacy Policy</h2>
      <div className="mb-4 text-xs max-h-32 overflow-y-auto border p-2 rounded bg-gray-50">
        {/* Insert your privacy policy text here */}
        <p>Your privacy policy goes here. Explain what data you collect, how it is used, and user rights.</p>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Terms & Conditions</h2>
      <div className="mb-6 text-xs max-h-32 overflow-y-auto border p-2 rounded bg-gray-50">
        {/* Insert your terms and conditions text here */}
        <p>Your terms and conditions go here. Explain the rules for using the app and any disclaimers.</p>
      </div>
      <div className="flex gap-4">
        <button
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          onClick={onAccept}
        >
          Accept & Access
        </button>
        <button
          className="flex-1 bg-gray-300 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-400 transition"
          onClick={onDeny}
        >
          Deny
        </button>
      </div>
    </div>
  </div>
    );
  };

export default PrivacyNotice;
