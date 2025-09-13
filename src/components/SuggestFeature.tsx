import { useState } from 'react';
import { Lightbulb, X, CheckCircle, Copy } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

interface SuggestFeatureProps {
  onCancel: () => void;
}

interface FeatureSuggestion {
  name: string;
  email: string;
  suggestion: string;
  details: string;
  browserInfo: string;
  timestamp: string;
}

export default function SuggestFeature({ onCancel }: SuggestFeatureProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestionId, setSuggestionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: '',
    details: ''
  });

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    return `${browser} on ${os}`;
  };

  function validateEmail(email: string){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isGenericName(name: string){
    if(!name) return true;
    const n = name.trim().toLowerCase();
    if(n.length < 2) return true;
    const banned = ['john','test','user','admin','foo','bar','abc'];
    if(banned.includes(n)) return true;
    if(n.split(' ').length === 1 && n.length <= 2) return true;
    return false;
  }

  function isSpamContent(text: string){
    if(!text) return false;
    const s = text.toLowerCase();
    if(s.includes('http') || s.includes('www.') || s.includes('.com') || s.includes('buy now') || s.includes('subscribe')) return true;
    if(s.replace(/\s+/g,'').length < 10) return true;
    return false;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const hp = (document.getElementById('hp') as HTMLInputElement)?.value || '';
    if(hp.trim() !== ''){ setErrorMessage('Spam detected'); return; }

    const name = (formData.name || '').trim();
    const email = (formData.email || '').trim();
    const suggestionText = (formData.suggestion || '').trim();

    if(!name || !email || !suggestionText){ setErrorMessage('Please fill in all required fields'); return; }
    if(!validateEmail(email)){ setErrorMessage('Please enter a valid email address'); return; }
    if(isGenericName(name)){ setErrorMessage('Please provide your full name (avoid "John" or test values)'); return; }
    if(suggestionText.length < 10){ setErrorMessage('Please provide a more detailed suggestion (at least 10 characters)'); return; }
    if(isSpamContent(suggestionText)){
      setErrorMessage('Your suggestion looks like promotional content or contains links. Please provide a clear feature suggestion without promotional text.');
      return;
    }
    if(name.toLowerCase() === suggestionText.toLowerCase() || name.toLowerCase() === (formData.details||'').trim().toLowerCase()){
      setErrorMessage('Please provide distinct, meaningful values for name and suggestion'); return;
    }

    setIsSubmitting(true);
    try {
      const featureSuggestion: FeatureSuggestion = {
        ...formData,
        browserInfo: getBrowserInfo(),
        timestamp: new Date().toISOString()
      };
      const formDataToSend = new FormData();
      formDataToSend.append('name', featureSuggestion.name);
      formDataToSend.append('email', featureSuggestion.email);
      formDataToSend.append('description', featureSuggestion.suggestion);
      formDataToSend.append('stepsToReproduce', featureSuggestion.details);
      formDataToSend.append('browserInfo', featureSuggestion.browserInfo);
      formDataToSend.append('timestamp', featureSuggestion.timestamp);
      const hpVal = (document.getElementById('hp') as HTMLInputElement)?.value || '';
      if(hpVal) formDataToSend.append('hp', hpVal);

      // Only send the backend-required fields
      const response = await apiRequest(API_ENDPOINTS.suggestions, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setSuggestionId(result.id);
        setShowSuccess(true);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        let errorMessage = 'Failed to submit feature suggestion. Please try again.';
        if (response.status === 400) {
          if (errorData.error?.includes('spam') || errorData.error?.includes('inappropriate')) {
            errorMessage = '⚠️ Your submission was flagged as spam or inappropriate content.\n\nPlease:\n• Use professional language\n• Provide genuine suggestions\n• Avoid promotional content\n• Try rewording your suggestion';
          } else if (errorData.error?.includes('Missing required fields')) {
            errorMessage = 'Please fill in all required fields before submitting.';
          } else {
            errorMessage = errorData.error || 'Invalid submission. Please check your input.';
          }
        } else if (response.status === 429) {
          errorMessage = '🚫 Too many submissions detected.\n\nPlease wait before submitting another suggestion.\nThis helps prevent spam and abuse.';
        } else if (response.status === 500) {
          errorMessage = 'Server error occurred. Please try again in a few minutes.';
        } else {
          errorMessage = errorData.error || `Error ${response.status}: Failed to submit feature suggestion.`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting feature suggestion:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit feature suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const copySuggestionId = async () => {
    try {
      await navigator.clipboard.writeText(suggestionId);
    } catch (err) {
      console.error('Failed to copy suggestion ID:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Suggestion Submitted!</h2>
            <p className="text-gray-600">Thank you for helping us improve FineTrack. We appreciate your feedback and will review your suggestion soon.</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">Your Suggestion ID:</h3>
            <div className="bg-white border border-green-300 rounded-md p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Suggestion ID:</p>
              <div className="font-mono text-xl font-bold text-gray-900 bg-gray-50 border rounded px-3 py-2 mb-3 select-all">
                {suggestionId}
              </div>
              <button
                onClick={copySuggestionId}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm w-full justify-center"
                title="Copy Suggestion ID"
              >
                <Copy className="h-4 w-4" />
                Copy Suggestion ID
              </button>
            </div>
            <div className="text-sm text-green-700 space-y-2">
              <p className="font-semibold">📋 COPY AND SAVE THIS ID IF YOU WANT TO FOLLOW UP!</p>
              <p>• Use this ID for all future communication about this suggestion</p>
              <p>• Include this ID when contacting support</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Back to App</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Suggest a Feature</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            Have an idea to make FineTrack better? Suggest a new feature or improvement below!
          </p>
        </div>
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Submission Error
                </h3>
                <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                  {errorMessage}
                </div>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input id="hp" name="hp" type="text" autoComplete="off" style={{display:'none'}} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
              Feature Suggestion *
            </label>
            <textarea
              id="suggestion"
              name="suggestion"
              value={formData.suggestion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the feature you want to see..."
              required
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="How would this feature help you? Any examples or context?"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">System Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Browser: {getBrowserInfo()}</div>
              <div>Timestamp: {new Date().toLocaleString()}</div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Suggestion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}