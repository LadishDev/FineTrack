import { useState } from 'react';
import { Edit3, Trash2, ExternalLink, Plus } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Fine } from '../types';

interface FineListProps {
  fines: Fine[];
  onAddFine: () => void;
  onUpdateFine: (id: string, updates: Partial<Fine>) => void;
  onDeleteFine: (id: string) => void;
}

export default function FineList({ fines, onAddFine, onUpdateFine, onDeleteFine }: FineListProps) {
  // Sort fines by due date (earliest first)
  const sortedFines = [...fines].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getTypeLabel = (type: Fine['type']) => {
    const labels = {
      speeding: 'Speeding',
      parking: 'Parking',
      dartford: 'Dartford Crossing',
      mot: 'MOT',
      insurance: 'Insurance',
      congestion: 'Congestion Charge',
      other: 'Other'
    };
    return labels[type];
  };

  const getStatusColor = (fine: Fine) => {
    if (fine.status === 'paid') return 'bg-green-100 text-green-800';
    if (fine.status === 'overdue' || (fine.status === 'unpaid' && isAfter(new Date(), new Date(fine.dueDate)))) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  // New: inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Fine>>({});

  const startEdit = (fine: Fine) => {
    setEditingId(fine.id);
    setEditValues({
      title: fine.title,
      type: fine.type,
      amount: fine.amount,
      dueDate: fine.dueDate,
      referenceNumber: fine.referenceNumber,
      vehicleReg: fine.vehicleReg,
      location: fine.location,
      description: fine.description,
      status: fine.status
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id: string) => {
    // Only send fields that changed
    const updates: Partial<Fine> = { ...editValues };
    try {
      await onUpdateFine(id, updates);
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      // keep editing so user can retry; storage layer surfaces errors through UI
      console.error('Failed to save fine:', err);
    }
  };

  const handleInput = (key: keyof Fine, value: any) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">All Fines</h2>
        <div className="text-sm text-gray-600 mt-1">
        {fines.length} total fines
        </div>
      </div>
      <button
        onClick={onAddFine}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Fine</span>
      </button>
      </div>

      {fines.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No fines added yet</p>
          <p className="text-gray-400 mt-2">Start by adding your first fine</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFines.map((fine) => (
            <div key={fine.id} className="bg-white rounded-lg shadow-md p-6">
              {editingId === fine.id ? (
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); saveEdit(fine.id); }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Fine</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor({ ...fine, status: editValues.status || fine.status })}`}>{editValues.status || fine.status}</span>
                      <select value={String(editValues.status || fine.status)} onChange={e => handleInput('status', e.target.value as Fine['status'])} className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs">
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="disputed">Disputed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fine Type *</label>
                      <select value={String(editValues.type || fine.type)} onChange={e => handleInput('type', e.target.value as Fine['type'])} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                        <option value="parking">Parking Fine</option>
                        <option value="speeding">Speeding Fine</option>
                        <option value="dartford">Dartford Crossing Penalty</option>
                        <option value="congestion">Congestion Charge Penalty</option>
                        <option value="other">Other Fine/Penalty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount (£) *</label>
                      <input type="number" value={String(editValues.amount ?? fine.amount)} onChange={e => handleInput('amount', parseFloat(e.target.value || '0'))} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input type="text" value={String(editValues.title || '')} onChange={e => handleInput('title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Parking fine - High Street" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea value={String(editValues.description || '')} onChange={e => handleInput('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Additional details about the fine..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                      <input type="date" value={editValues.dueDate ? new Date(editValues.dueDate).toISOString().split('T')[0] : new Date(fine.dueDate).toISOString().split('T')[0]} onChange={e => handleInput('dueDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                      <input type="text" value={String(editValues.referenceNumber || '')} onChange={e => handleInput('referenceNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="PCN123456789" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Registration</label>
                      <input type="text" value={String(editValues.vehicleReg || '')} onChange={e => handleInput('vehicleReg', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="AB12 CDE" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input type="text" value={String(editValues.location || '')} onChange={e => handleInput('location', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., High Street Car Park" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={cancelEdit} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save Changes</button>
                  </div>
                </form>
              ) : (
                // View mode - two column layout
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{fine.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fine)}`}>
                        {fine.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {getTypeLabel(fine.type)}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> £{fine.amount.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {format(new Date(fine.dueDate), 'MMM dd, yyyy')}
                      </div>

                      {fine.referenceNumber && (
                        <div>
                          <span className="font-medium">Reference:</span> {fine.referenceNumber}
                        </div>
                      )}
                      {fine.vehicleReg && (
                        <div>
                          <span className="font-medium">Vehicle:</span> {fine.vehicleReg}
                        </div>
                      )}
                      {fine.location && (
                        <div>
                          <span className="font-medium">Location:</span> {fine.location}
                        </div>
                      )}
                    </div>
                    
                    {fine.description && (<p className="mt-3 text-gray-600">{fine.description}</p>)}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {fine.paymentLink && (
                      <a
                        href={fine.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Pay online"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <button onClick={()=>startEdit(fine)} title="Edit fine" className="p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDeleteFine(fine.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete fine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
