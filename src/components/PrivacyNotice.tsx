
interface PrivacyNoticeProps {
  onAccept: () => void;
  onDeny: () => void;
  isUpdate?: boolean;
  previousVersion?: string | null;
  currentVersion?: string;
}


import updateLogJson from '../updateLog.json';

// Add index signature for TypeScript
const updateLog: { [key: string]: string } = updateLogJson;
import pkg from '../../package.json';
const currentAppVersion = pkg.version;

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


import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ onAccept, onDeny, isUpdate, previousVersion, currentVersion }) => {
  const effectiveVersion = currentVersion || currentAppVersion;
  const versionChange = compareVersions(effectiveVersion, previousVersion);
  const isUpgrade = isUpdate && versionChange > 0;
  const isDowngrade = isUpdate && versionChange < 0;
  const [modal, setModal] = React.useState<'notice' | 'privacy' | 'terms'>('notice');

  // Short summaries for modal
  const privacySummary = "We collect only necessary data to provide and improve FineTrack. Your data is never sold. See the full policy for details.";
  const termsSummary = "Use FineTrack lawfully and at your own risk. See the full terms for your rights and obligations.";

  // Modal overlay for full policy/terms
  if (modal === 'privacy' || modal === 'terms') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col items-center p-0">
          <div className="w-full p-8 flex-1 flex flex-col">
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              {modal === 'privacy' ? <PrivacyPolicy /> : <TermsAndConditions />}
            </div>
            <button
              className="w-full mt-8 bg-gray-300 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-400 transition"
              onClick={() => setModal('notice')}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main notice modal
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh] scrollbar-hide">
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
            <h2 className="text-lg font-semibold mb-2 text-blue-800">What’s New in v{effectiveVersion}</h2>
            {updateLog[effectiveVersion] ? (
              <div className="mb-2">
                <div className="font-bold text-blue-800 mb-1">v{effectiveVersion}:</div>
                <ul className="text-xs text-blue-900 list-disc pl-5">
                  {updateLog[effectiveVersion].split('\n').map((line: string, i: number) =>
                    line.trim() ? (
                      <li key={i}>{line.replace(/^[-*]\s*/, '')}</li>
                    ) : null
                  )}
                </ul>
              </div>
            ) : (
              <div className="text-xs text-blue-900">No update notes available for this version.</div>
            )}
          </div>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-2">Privacy Policy</h2>
        <div className="mb-4 text-xs max-h-32 overflow-y-auto border p-2 rounded bg-gray-50 scrollbar-hide">
          <p>{privacySummary}</p>
        </div>
        <button
          className="w-full mb-4 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          onClick={() => setModal('privacy')}
        >
          View Full Privacy Policy
        </button>
        <h2 className="text-xl font-semibold mt-6 mb-2">Terms & Conditions</h2>
        <div className="mb-4 text-xs max-h-32 overflow-y-auto border p-2 rounded bg-gray-50 scrollbar-hide">
          <p>{termsSummary}</p>
        </div>
        <button
          className="w-full mb-6 bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          onClick={() => setModal('terms')}
        >
          View Full Terms & Conditions
        </button>
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
