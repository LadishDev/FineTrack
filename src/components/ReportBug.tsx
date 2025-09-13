import { useState, useRef } from 'react';
import { Bug, X, CheckCircle, Upload, Image, Copy } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';

interface ReportBugProps {
  onCancel: () => void;
}

interface BugReport {
  name: string;
  email: string;
  description: string;
  stepsToReproduce: string;
  screenshot?: File | null;
  browserInfo: string;
  timestamp: string;
}

export default function ReportBug({ onCancel }: ReportBugProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [bugId, setBugId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    stepsToReproduce: ''
  });

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';
    
    // Browser detection
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    
    // OS detection
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';
    
    return `${browser} on ${os}`;
  };

  // Basic validators & heuristics
  function validateEmail(email: string){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isGenericName(name: string){
    if(!name) return true;
    const n = name.trim().toLowerCase();
    if(n.length < 2) return true;
    const banned = ['john','test','user','admin','foo','bar','abc'];
    if(banned.includes(n)) return true;
    // single short token (e.g. 'J')
    if(n.split(' ').length === 1 && n.length <= 2) return true;
    return false;
  }

  function isSpamContent(text: string){
    if(!text) return false;
    const s = text.toLowerCase();
    // obvious promos/urls
    if(s.includes('http') || s.includes('www.') || s.includes('.com') || s.includes('buy now') || s.includes('subscribe')) return true;
    // too short or nonsense
    if(s.replace(/\s+/g,'').length < 10) return true;
    return false;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous error
    setErrorMessage('');
    
    // honeypot check (bots often fill hidden fields)
    const hp = (document.getElementById('hp') as HTMLInputElement)?.value || '';
    if(hp.trim() !== ''){ setErrorMessage('Spam detected'); return; }

    const name = (formData.name || '').trim();
    const email = (formData.email || '').trim();
    const descriptionText = (formData.description || '').trim();

    if(!name || !email || !descriptionText){ setErrorMessage('Please fill in all required fields'); return; }
    if(!validateEmail(email)){ setErrorMessage('Please enter a valid email address'); return; }
    if(isGenericName(name)){ setErrorMessage('Please provide your full name (avoid "John" or test values)'); return; }
    if(descriptionText.length < 20){ setErrorMessage('Please provide a more detailed description (at least 20 characters)'); return; }
    if(isSpamContent(descriptionText)){
      setErrorMessage('Your description looks like promotional content or contains links. Please provide a clear bug description without promotional text.');
      return;
    }

    // prevent trivial misuse where same short token is pasted into every field
    if(name.toLowerCase() === descriptionText.toLowerCase() || name.toLowerCase() === (formData.stepsToReproduce||'').trim().toLowerCase()){
      setErrorMessage('Please provide distinct, meaningful values for name and description'); return;
    }

    setIsSubmitting(true);

    try {
      const bugReport: BugReport = {
        ...formData,
        screenshot,
        browserInfo: getBrowserInfo(),
        timestamp: new Date().toISOString()
      };

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', bugReport.name);
      formDataToSend.append('email', bugReport.email);
      formDataToSend.append('description', bugReport.description);
      formDataToSend.append('stepsToReproduce', bugReport.stepsToReproduce);
      formDataToSend.append('browserInfo', bugReport.browserInfo);
      formDataToSend.append('timestamp', bugReport.timestamp);
      // include honeypot (server can also check)
      const hpVal = (document.getElementById('hp') as HTMLInputElement)?.value || '';
      if(hpVal) formDataToSend.append('hp', hpVal);
      
      if (screenshot) {
        formDataToSend.append('screenshot', screenshot);
      }

      // Send to backend API
      const response = await apiRequest(API_ENDPOINTS.bugReports, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setBugId(result.id);
        setShowSuccess(true);
      } else {
        // Handle different error types with specific messages
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        
        let errorMessage = 'Failed to submit bug report. Please try again.';
        
        if (response.status === 400) {
          if (errorData.error?.includes('spam') || errorData.error?.includes('inappropriate')) {
            errorMessage = '⚠️ Your submission was flagged as spam or inappropriate content.\n\nPlease:\n• Use professional language\n• Provide genuine bug details\n• Avoid promotional content\n• Try rewording your description';
          } else if (errorData.error?.includes('Missing required fields')) {
            errorMessage = 'Please fill in all required fields before submitting.';
          } else {
            errorMessage = errorData.error || 'Invalid submission. Please check your input.';
          }
        } else if (response.status === 429) {
          errorMessage = '🚫 Too many submissions detected.\n\nPlease wait before submitting another report.\nThis helps prevent spam and abuse.';
        } else if (response.status === 500) {
          errorMessage = 'Server error occurred. Please try again in a few minutes.';
        } else {
          errorMessage = errorData.error || `Error ${response.status}: Failed to submit bug report.`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setScreenshot(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyBugId = async () => {
    try {
      await navigator.clipboard.writeText(bugId);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy bug ID:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bug Report Submitted!</h2>
            <p className="text-gray-600">Thank you for helping us improve FineTrack. We'll review your report and get back to you if needed.</p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ IMPORTANT - KEEP THIS SAFE!</h3>
            <div className="bg-white border border-red-300 rounded-md p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Your Bug Report ID:</p>
              <div className="font-mono text-xl font-bold text-gray-900 bg-gray-50 border rounded px-3 py-2 mb-3 select-all">
                {bugId}
              </div>
              <button
                onClick={copyBugId}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm w-full justify-center"
                title="Copy Bug ID"
              >
                <Copy className="h-4 w-4" />
                Copy Bug Report ID
              </button>
            </div>
            <div className="text-sm text-red-700 space-y-2">
              <p className="font-semibold">📋 COPY AND SAVE THIS ID IMMEDIATELY!</p>
              <p>• Use this ID for all future communication about this bug</p>
              <p>• Save it in a safe place - you cannot retrieve it later</p>
              <p>• Include this ID when contacting support</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              Your report has been sent to our development team and logged in our system.
              You should receive a confirmation email shortly.
            </p>
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Bug className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Report a Bug</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Help us fix issues by providing detailed information about the problem you encountered.
            The more details you provide, the faster we can resolve it!
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
          {/* honeypot field (hidden) - bots may fill this */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description of Issue *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what went wrong, what you expected to happen, and any error messages you saw..."
              required
            />
          </div>

          <div>
            <label htmlFor="stepsToReproduce" className="block text-sm font-medium text-gray-700 mb-2">
              Steps to Reproduce
            </label>
            <textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1. Go to the dashboard&#10;2. Click on 'Add Fine'&#10;3. Fill in the form&#10;4. Error appears when..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {screenshot ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Image className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{screenshot.name}</span>
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <label htmlFor="screenshot" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">Upload a screenshot</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="screenshot"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
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
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bug className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Bug Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
