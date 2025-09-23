import React from 'react';

interface UpdateBannerProps {
  latestVersion: string;
  downloadUrl: string;
  onClose: () => void;
}


const UpdateBanner: React.FC<UpdateBannerProps> = ({ latestVersion, downloadUrl, onClose }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 fixed inset-0 z-50">
    <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-yellow-700 flex items-center gap-2">
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        New Update Available
      </h1>
      <p className="mb-4 text-sm text-gray-700">A new version (<span className="font-bold">{latestVersion}</span>) of FineTrack is available. Please update to get the latest features and fixes.</p>
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition text-center mb-4"
      >
        Download Update
      </a>
      <button
        onClick={onClose}
        className="w-full bg-gray-300 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-400 transition"
      >
        Dismiss
      </button>
    </div>
  </div>
);

export default UpdateBanner;
