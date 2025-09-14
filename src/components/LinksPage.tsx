import React from 'react';
import { AlertTriangle, Calendar, Shield, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';

interface LinksPageProps {
  category?: string;
  onBack?: () => void;
  onNavigateToCategory?: (category: string) => void;
  onNavigateToLinks?: () => void;
  cameFromLinksPage?: boolean;
}

interface LinkOption {
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

const LinksPage: React.FC<LinksPageProps> = ({ category, onBack, onNavigateToCategory, onNavigateToLinks, cameFromLinksPage }) => {
  // Handle back navigation
  const handleBack = () => {
    if (category) {
      // If we're viewing a specific category, determine where to go back
      if (cameFromLinksPage && onNavigateToLinks) {
        // Came from links page → go back to links category selection
        onNavigateToLinks();
      } else if (onBack) {
        // Came from dashboard quick access → go back to dashboard
        onBack();
      } else if (onNavigateToLinks) {
        // Fallback to links page
        onNavigateToLinks();
      } else {
        window.location.href = '/links';
      }
    } else {
      // If we're on category selection and onBack is provided, use it
      if (onBack) {
        onBack();
      }
    }
  };
  // Define category options (like Dashboard Quick Access)
  const categoryOptions = [
    {
      id: 'fines',
      title: 'Fines',
      description: 'Parking, speeding & penalty charges',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
    {
      id: 'charges',
      title: 'Charges',
      description: 'Dartford, congestion & road charges',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    },
    {
      id: 'insurance',
      title: 'Insurance',
      description: 'Compare & manage car insurance',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'mot',
      title: 'MOT & Tax',
      description: 'MOT tests & vehicle tax',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    }
  ];

  // Define link categories with actual useful external sites
  const linkCategories: Record<string, LinkOption[]> = {
    fines: [
      {
        title: 'GOV.UK - Pay Penalty Charge',
        description: 'Pay penalty charge notices online',
        url: 'https://www.gov.uk/pay-penalty-charge-notice',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        title: 'Metropolitan Police - Pay PCN',
        description: 'Pay Met Police penalty charges',
        url: 'https://www.met.police.uk/paypcn/',
        icon: AlertTriangle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'DVLA - View Driving Record',
        description: 'Check your driving licence information',
        url: 'https://www.gov.uk/view-driving-licence',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    ],
    charges: [
      {
        title: 'Dartford Crossing',
        description: 'Pay Dartford Crossing charge',
        url: 'https://www.gov.uk/pay-dartford-crossing-charge',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Congestion Charge',
        description: 'Pay London Congestion Charge',
        url: 'https://tfl.gov.uk/modes/driving/congestion-charge/congestion-charge-zone',
        icon: Calendar,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        title: 'ULEZ',
        description: 'Pay ULEZ charge',
        url: 'https://tfl.gov.uk/modes/driving/ultra-low-emission-zone',
        icon: Calendar,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    ],
    insurance: [
      {
        title: 'Compare The Market',
        description: 'Compare car insurance quotes',
        url: 'https://www.comparethemarket.com/car-insurance/',
        icon: Shield,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        title: 'MoneySuperMarket',
        description: 'Find cheap car insurance',
        url: 'https://www.moneysupermarket.com/car-insurance/',
        icon: Shield,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Admiral',
        description: 'Get a car insurance quote',
        url: 'https://www.admiral.com/',
        icon: Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    ],
    mot: [
      {
        title: 'GOV.UK - MOT Testing',
        description: 'Book MOT test and check history',
        url: 'https://www.gov.uk/getting-an-mot',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'GOV.UK - Vehicle Tax',
        description: 'Tax your vehicle online',
        url: 'https://www.gov.uk/vehicle-tax',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'DVLA Vehicle Enquiry',
        description: 'Check vehicle tax and MOT',
        url: 'https://vehicleenquiry.service.gov.uk/',
        icon: CheckCircle,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ]
  };

  // Get the appropriate links for the category
  const currentLinks = category ? linkCategories[category] || [] : [];

  // Get category display name
  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      fines: 'Fines & Penalties',
      charges: 'Road Charges',
      insurance: 'Car Insurance',
      mot: 'MOT & Vehicle Tax'
    };
    return titles[cat] || cat;
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {category && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? getCategoryTitle(category) : 'Useful Links'}
          </h2>
        </div>
      </div>

      {!category ? (
        /* Category Selection Grid - like Dashboard Quick Access */
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    // Use proper navigation function if available, fallback to window.location
                    if (onNavigateToCategory) {
                      onNavigateToCategory(option.id);
                    } else {
                      window.location.href = `/links/${option.id}`;
                    }
                  }}
                  className={`p-6 border-2 ${option.borderColor} ${option.bgColor} rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-left group`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Specific Category Links */
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentLinks.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getCategoryTitle(category)} Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleLinkClick(link.url)}
                      className={`${link.bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`h-8 w-8 ${link.color}`} />
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <h4 className={`font-semibold ${link.color} mb-2 group-hover:underline`}>
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No links available</h3>
              <p className="text-gray-600">Links for this category are not yet available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinksPage;