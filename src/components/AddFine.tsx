import { useState } from 'react';
import { Fine, FineType } from '../types';
import { Save, X, CheckCircle } from 'lucide-react';

interface AddFineProps {
  onAddFine: (fine: Omit<Fine, 'id'>) => void;
  onCancel: () => void;
}

export default function AddFine({ onAddFine, onCancel }: AddFineProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedFine, setSavedFine] = useState<Fine | null>(null);
  const [formData, setFormData] = useState({
    type: 'parking' as FineType,
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    issueDate: new Date().toISOString().split('T')[0], // Default to today's date
    referenceNumber: '',
    location: '',
    vehicleReg: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.dueDate || !formData.issueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const fine: Omit<Fine, 'id'> = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      issueDate: formData.issueDate,
      status: 'unpaid',
      referenceNumber: formData.referenceNumber || undefined,
      location: formData.location || undefined,
      vehicleReg: formData.vehicleReg || undefined
    };

    onAddFine(fine);
    
    // Show success message
    setSavedFine({ ...fine, id: Date.now().toString() });
    setShowSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fineTypes = [
    { value: 'parking', label: 'Parking Fine' },
    { value: 'speeding', label: 'Speeding Fine' },
    { value: 'dartford', label: 'Dartford Crossing Penalty' },
    { value: 'congestion', label: 'Congestion Charge Penalty' },
    { value: 'other', label: 'Other Fine/Penalty' }
  ];

  if (showSuccess && savedFine) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fine Added Successfully!</h2>
            <p className="text-gray-600">Your fine has been saved to your dashboard</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2">Saved Details:</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div><span className="font-medium">Type:</span> {fineTypes.find(t => t.value === savedFine.type)?.label}</div>
              <div><span className="font-medium">Title:</span> {savedFine.title}</div>
              <div><span className="font-medium">Amount:</span> £{savedFine.amount.toFixed(2)}</div>
              <div><span className="font-medium">Due Date:</span> {new Date(savedFine.dueDate).toLocaleDateString()}</div>
              {savedFine.referenceNumber && (
                <div><span className="font-medium">Reference:</span> {savedFine.referenceNumber}</div>
              )}
              {savedFine.vehicleReg && (
                <div><span className="font-medium">Vehicle:</span> {savedFine.vehicleReg}</div>
              )}
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Fine</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Fine Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {fineTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (£) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Parking fine - High Street"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional details about the fine..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                id="referenceNumber"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PCN123456789"
              />
            </div>

            <div>
              <label htmlFor="vehicleReg" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Registration
              </label>
              <input
                type="text"
                id="vehicleReg"
                name="vehicleReg"
                value={formData.vehicleReg}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="AB12 CDE"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., High Street Car Park"
            />
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
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Fine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
