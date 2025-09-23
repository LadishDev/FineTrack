import { useEffect } from 'react';

export default function NotFound404({ goBack, goHome }: { goBack?: () => void; goHome?: () => void }) {
  useEffect(() => {
    // After 5s, auto-back if goBack is provided, else auto-redirect to dashboard
    const timer = setTimeout(() => {
      if (goBack) {
        goBack();
      } else if (goHome) {
        goHome();
      } else {
        window.location.href = '/';
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [goBack, goHome]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-gray-100">
        <div className="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto text-blue-500">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
          </svg>
        </div>
  <div className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Page Not Found</div>
        <div className="text-base text-gray-500 mb-6">Sorry, the page you requested does not exist.</div>
        <div className="flex flex-col md:flex-row gap-3 w-full justify-center items-center">
          {goBack ? (
            <>
              <button
                onClick={goBack}
                className="bg-blue-600 text-white text-lg px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto"
              >
                Go Back
              </button>
              <button
                onClick={goHome || (() => (window.location.href = '/'))}
                className="bg-gray-100 text-blue-700 text-lg px-6 py-3 rounded-xl shadow hover:bg-gray-200 transition font-semibold border border-blue-100 w-full md:w-auto"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={goHome || (() => (window.location.href = '/'))}
              className="bg-blue-600 text-white text-lg px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition font-semibold w-full md:w-auto"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
