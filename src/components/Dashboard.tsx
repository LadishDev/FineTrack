import { Fine } from '../types';
import { AlertTriangle, Clock, CheckCircle, PoundSterling, Calendar, Plus, Shield } from 'lucide-react';
import { format, isAfter, differenceInDays } from 'date-fns';

interface DashboardProps {
  fines: Fine[];
  onAddFine: () => void;
  onCategorySelect: (category: string) => void;
}

export default function Dashboard({ fines, onAddFine, onCategorySelect }: DashboardProps) {
  // Format currency in shorthand (e.g., 1.2k, 2.3M)
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return (amount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (amount >= 100000) return (amount / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return amount.toFixed(2);
  };
  const unpaidFines = fines.filter(fine => fine.status === 'unpaid');
  // Treat a fine as overdue if it's explicitly marked 'overdue',
  // or if it's still 'unpaid' and the dueDate is in the past.
  const overdueFines = fines.filter(fine => {
    return fine.status === 'overdue' || (fine.status === 'unpaid' && isAfter(new Date(), new Date(fine.dueDate)));
  });
  const upcomingFines = fines.filter(fine => {
    const daysUntilDue = differenceInDays(new Date(fine.dueDate), new Date());
    return fine.status === 'unpaid' && daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  const totalUnpaidAmount = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

const stats = [
    {
        title: 'Total Unpaid',
        value: `£${
          totalUnpaidAmount >= 100000
            ? totalUnpaidAmount >= 1000000
              ? (totalUnpaidAmount / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
              : (totalUnpaidAmount / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
            : totalUnpaidAmount.toFixed(2)
        }`,
        icon: PoundSterling,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
    },
    {
        title: 'Overdue',
        value: overdueFines.length,
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
    },
    {
        title: 'Due Soon',
        value: upcomingFines.length,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
    },
    {
        title: 'Total Fines',
        value: fines.length,
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
    }
];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={onAddFine}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Fine</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
              <div className="flex items-center">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent/Urgent Fines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Fines */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Overdue Fines</h3>
          </div>
          {overdueFines.length > 0 ? (
            <div className="space-y-3">
              {overdueFines.slice(0, 3).map((fine) => (
                <div key={fine.id} className="border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{fine.title}</p>
                      <p className="text-sm text-gray-600">{getTypeLabel(fine.type)}</p>
                      <p className="text-sm text-red-600">Due: {format(new Date(fine.dueDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <p className="font-bold text-red-600">£{formatCurrency(fine.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No overdue fines</p>
          )}
        </div>

        {/* Upcoming Fines */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Due Soon</h3>
          </div>
          {upcomingFines.length > 0 ? (
            <div className="space-y-3">
              {upcomingFines.slice(0, 3).map((fine) => (
                <div key={fine.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{fine.title}</p>
                      <p className="text-sm text-gray-600">{getTypeLabel(fine.type)}</p>
                      <p className="text-sm text-yellow-600">Due: {format(new Date(fine.dueDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <p className="font-bold text-yellow-600">£{formatCurrency(fine.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming fines</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onCategorySelect('fines')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          >
            <AlertTriangle className="h-8 w-8 text-blue-600 mb-2 group-hover:text-blue-700" />
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Fines</span>
            <span className="text-xs text-gray-500 text-center mt-1">Parking, speeding & penalty charges</span>
          </button>
          
          <button 
            onClick={() => onCategorySelect('charges')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          >
            <Calendar className="h-8 w-8 text-blue-600 mb-2 group-hover:text-blue-700" />
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Charges</span>
            <span className="text-xs text-gray-500 text-center mt-1">Dartford, congestion & road charges</span>
          </button>
          
          <button 
            onClick={() => onCategorySelect('insurance')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          >
            <Shield className="h-8 w-8 text-blue-600 mb-2 group-hover:text-blue-700" />
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Insurance</span>
            <span className="text-xs text-gray-500 text-center mt-1">Compare & manage car insurance</span>
          </button>
          
          <button 
            onClick={() => onCategorySelect('mot')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          >
            <CheckCircle className="h-8 w-8 text-blue-600 mb-2 group-hover:text-blue-700" />
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">MOT & Tax</span>
            <span className="text-xs text-gray-500 text-center mt-1">MOT tests & vehicle tax</span>
          </button>
        </div>
      </div>
    </div>
  );
}
