import { Bell, Shield, Smartphone, RefreshCw, Wifi, WifiOff, Bug, Lightbulb, Coffee } from 'lucide-react';

interface SettingsProps {
  onSync?: () => Promise<void>;
  isOnline?: boolean;
  onReportBug?: () => void;
  onSuggestion?: () => void;
  onDonation?: () => void;
}

export default function Settings({ onSync, isOnline = false, onReportBug, onSuggestion, onDonation }: SettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {/* Storage & Sync Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Storage & Sync</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Connection Status: {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {onSync && (
            <button
              onClick={onSync}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Data
            </button>
          )}
          
          <p className="text-sm text-gray-600">
            Your data is stored locally on this device. When connected to the internet, 
            you can sync with an online database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Push notifications</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Reminder days before due date
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="7">
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Useful Links</h3>
          </div>
          
          <div className="space-y-3">
            <a href="https://www.gov.uk/pay-penalty-charge-notice" target="_blank" rel="noopener noreferrer"
               className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Pay Penalty Charge Notice</div>
              <div className="text-sm text-gray-600">Official government payment portal</div>
            </a>
            
            <a href="https://www.dartcharge.gov.uk/" target="_blank" rel="noopener noreferrer"
               className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Dartford Crossing</div>
              <div className="text-sm text-gray-600">Pay Dart Charge online</div>
            </a>
            
            <a href="https://tfl.gov.uk/modes/driving/congestion-charge" target="_blank" rel="noopener noreferrer"
               className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Congestion Charge</div>
              <div className="text-sm text-gray-600">London congestion charge information</div>
            </a>
            
            <a href="https://www.comparethemarket.com/car-insurance/" target="_blank" rel="noopener noreferrer"
               className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Compare Car Insurance</div>
              <div className="text-sm text-gray-600">Find the best insurance deals</div>
            </a>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">About FineTrack</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <p>FineTrack helps you manage all your vehicle-related fines and charges in one place.</p>
            <p>Version: 1.0.0 | Made By @LadishDev</p>
            <p>This is a Progressive Web App - you can install it on your device for a native app experience.</p>
          </div>
          
          {onReportBug && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onReportBug}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Bug className="h-4 w-4" />
                Report a Bug
              </button>
            </div>
          )}
          {onSuggestion && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onSuggestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                Suggest a Feature
              </button>
            </div>
          )}
          {onDonation && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onDonation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Coffee className="h-4 w-4" />
                Support Development! Buy me a coffee
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
