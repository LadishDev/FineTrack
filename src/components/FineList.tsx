import { useState } from 'react';
import { Edit3, Trash2, ExternalLink } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Fine } from '../types';

interface FineListProps {
  fines: Fine[];
  onUpdateFine: (id: string, updates: Partial<Fine>) => void;
  onDeleteFine: (id: string) => void;
}

export default function FineList({ fines, onUpdateFine, onDeleteFine }: FineListProps) {
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
        <h2 className="text-2xl font-bold text-gray-900">All Fines</h2>
        <div className="text-sm text-gray-600">
          {fines.length} total fines
        </div>
      </div>

      {fines.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No fines added yet</p>
          <p className="text-gray-400 mt-2">Start by adding your first fine</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fines.map((fine) => (
            <div key={fine.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{editingId === fine.id ? (
                      <input value={String(editValues.title || '')} onChange={(e)=>handleInput('title', e.target.value)} className="border border-gray-200 rounded px-2 py-1" />
                    ) : fine.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fine)}`}>
                      {fine.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {editingId === fine.id ? (
                        <select value={String(editValues.type || fine.type)} onChange={(e)=>handleInput('type', e.target.value as Fine['type'])} className="px-2 py-1 rounded border border-gray-200">
                          <option value="speeding">Speeding</option>
                          <option value="parking">Parking</option>
                          <option value="dartford">Dartford Crossing</option>
                          <option value="mot">MOT</option>
                          <option value="insurance">Insurance</option>
                          <option value="congestion">Congestion Charge</option>
                          <option value="other">Other</option>
                        </select>
                      ) : getTypeLabel(fine.type)}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {editingId === fine.id ? (
                        <input type="number" step="0.01" value={String(editValues.amount ?? fine.amount)} onChange={(e)=>handleInput('amount', parseFloat(e.target.value || '0'))} className="border border-gray-200 rounded px-2 py-1" />
                      ) : `£${fine.amount.toFixed(2)}`}
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {editingId === fine.id ? (
                        <input type="date" value={editValues.dueDate ? new Date(editValues.dueDate).toISOString().split('T')[0] : new Date(fine.dueDate).toISOString().split('T')[0]} onChange={(e)=>handleInput('dueDate', e.target.value)} className="border border-gray-200 rounded px-2 py-1" />
                      ) : format(new Date(fine.dueDate), 'MMM dd, yyyy')}
                    </div>

                    {editingId === fine.id ? (
                      <>
                        <div>
                          <span className="font-medium">Reference:</span>
                          <input value={String(editValues.referenceNumber || '')} onChange={(e)=>handleInput('referenceNumber', e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full" />
                        </div>

                        <div>
                          <span className="font-medium">Vehicle:</span>
                          <input value={String(editValues.vehicleReg || '')} onChange={(e)=>handleInput('vehicleReg', e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full" />
                        </div>

                        <div>
                          <span className="font-medium">Location:</span>
                          <input value={String(editValues.location || '')} onChange={(e)=>handleInput('location', e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full" />
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  
                  {editingId === fine.id ? (
                    <textarea value={String(editValues.description || '')} onChange={(e)=>handleInput('description', e.target.value)} className="mt-3 w-full border border-gray-200 rounded px-2 py-1" />
                  ) : (
                    fine.description && (<p className="mt-3 text-gray-600">{fine.description}</p>)
                  )}
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

                  {/* Replace inline select with Edit action */}
                  {editingId === fine.id ? (
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>saveEdit(fine.id)} className="btn btn-primary p-2 bg-blue-600 text-white rounded">Save</button>
                      <button onClick={cancelEdit} className="p-2 border rounded">Cancel</button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
