import React from 'react';
import { AlertTriangle, Calendar, Shield, CheckCircle, ExternalLink } from 'lucide-react';

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

const LinksPage: React.FC<LinksPageProps> = ({
  category,
  onBack,
  onNavigateToCategory,
  onNavigateToLinks,
  cameFromLinksPage,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleBack = () => {
    if (category) {
      if (cameFromLinksPage && onNavigateToLinks) {
        onNavigateToLinks();
      } else if (onBack) {
        onBack();
      } else if (onNavigateToLinks) {
        onNavigateToLinks();
      } else {
        window.location.href = '/links';
      }
    } else {
      if (onBack) onBack();
    }
  };

  const linkCategories: Record<string, LinkOption[]> = {
    fines: [
      {
        title: 'GOV.UK - Pay Penalty Charge',
        description: 'Pay penalty charge notices online',
        url: 'https://www.gov.uk/pay-penalty-charge-notice',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
      {
        title: 'Metropolitan Police - Pay PCN',
        description: 'Pay Met Police penalty charges',
        url: 'https://www.met.police.uk/paypcn/',
        icon: AlertTriangle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'DVLA - View Driving Record',
        description: 'Check your driving licence information',
        url: 'https://www.gov.uk/view-driving-licence',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
    ],
    charges: [
      {
        title: 'Dartford Crossing',
        description: 'Pay Dartford Crossing charge',
        url: 'https://www.gov.uk/pay-dartford-crossing-charge',
        icon: Calendar,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Congestion Charge',
        description: 'Pay London Congestion Charge',
        url: 'https://tfl.gov.uk/modes/driving/congestion-charge/congestion-charge-zone',
        icon: Calendar,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'ULEZ',
        description: 'Pay ULEZ charge',
        url: 'https://tfl.gov.uk/modes/driving/ultra-low-emission-zone',
        icon: Calendar,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
    ],
    insurance: [
      {
        title: 'Compare The Market',
        description: 'Compare car insurance quotes',
        url: 'https://www.comparethemarket.com/car-insurance/',
        icon: Shield,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'MoneySuperMarket',
        description: 'Find cheap car insurance',
        url: 'https://www.moneysupermarket.com/car-insurance/',
        icon: Shield,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Admiral',
        description: 'Get a car insurance quote',
        url: 'https://www.admiral.com/',
        icon: Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ],
    mot: [
      {
        title: 'GOV.UK - MOT Testing',
        description: 'Book MOT test and check history',
        url: 'https://www.gov.uk/getting-an-mot',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'GOV.UK - Vehicle Tax',
        description: 'Tax your vehicle online',
        url: 'https://www.gov.uk/vehicle-tax',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'DVLA Vehicle Enquiry',
        description: 'Check vehicle tax and MOT',
        url: 'https://vehicleenquiry.service.gov.uk/',
        icon: CheckCircle,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
    ],
  };

  const categoryOptions = [
    {
      id: "fines",
      title: "Fines",
      description: "Parking, speeding & penalty charges",
      icon: AlertTriangle,
      color: "text-red-500",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
      count: linkCategories["fines"].length,
    },
    {
      id: "charges",
      title: "Charges",
      description: "Dartford, congestion & road charges",
      icon: Calendar,
      color: "text-orange-500",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      count: linkCategories["charges"].length,
    },
    {
      id: "insurance",
      title: "Insurance",
      description: "Compare & manage car insurance",
      icon: Shield,
      color: "text-blue-500",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      count: linkCategories["insurance"].length,
    },
    {
      id: "mot-tax",
      title: "MOT & Tax",
      description: "MOT tests & vehicle tax",
      icon: CheckCircle,
      color: "text-green-500",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      count: linkCategories["mot"].length,
    },
  ];

  const currentLinks = category ? linkCategories[category] || [] : [];

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      fines: 'Fines & Penalties',
      charges: 'Road Charges',
      insurance: 'Car Insurance',
      mot: 'MOT & Vehicle Tax',
    };
    return titles[cat] || cat;
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const allLinks = Object.entries(linkCategories).flatMap(([cat, links]) =>
    links.map(link => ({ ...link, category: cat }))
  );

  const filteredResults = searchQuery.trim()
    ? allLinks.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 md:px-0">
      {/* Header Section */}
      <div className="rounded-2xl shadow-lg p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Useful Resources</h1>
        <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl">
          Access helpful government services, payment portals, and resources for managing your vehicle-related obligations. Everything you need in one convenient place.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 text-lg font-bold">
              <span role="img" aria-label="links">📑</span>
              {Object.values(linkCategories).reduce((acc, arr) => acc + arr.length, 0)} Total
            </div>
            <div className="text-xs text-gray-300">Links</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-lg font-bold">
              <span role="img" aria-label="categories">🗂️</span>
              {Object.keys(linkCategories).length} Categories
            </div>
            <div className="text-xs text-gray-300">Categories</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-lg font-bold">
              <span role="img" aria-label="official">🏛️</span>Official
            </div>
            <div className="text-xs text-gray-300">Sources</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 text-lg font-bold">
              <span role="img" aria-label="free">💸</span>Free
            </div>
            <div className="text-xs text-gray-300">Resources</div>
          </div>
        </div>
      </div>

      {/* Category Stats (Desktop only) */}
      {!category && (
        <div className="hidden md:grid grid-cols-4 gap-6">
          {categoryOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`rounded-xl p-6 flex flex-col items-center border-2 ${option.borderColor} ${option.bgColor} shadow-md`}
              >
                <IconComponent className={`w-8 h-8 mb-2 ${option.color}`} />
                <div className="text-2xl font-bold mb-1 text-gray-900">{option.count}</div>
                <div className="font-semibold text-lg mb-1 text-gray-900">{option.title}</div>
                <div className="text-xs text-gray-600 text-center">{option.description}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Selection Grid */}
      {!category && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  if (onNavigateToCategory) {
                    onNavigateToCategory(option.id);
                  } else {
                    window.location.href = `/links/${option.id}`;
                  }
                }}
                className={`flex flex-col md:flex-row items-center md:items-start gap-4 p-6 border-2 ${option.borderColor} ${option.bgColor} rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left group`}
              >
                <IconComponent className={`w-8 h-8 ${option.color}`} />
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg text-gray-900">{option.title}</h3>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${option.color} bg-white bg-opacity-60`}
                    >
                      {option.count} {option.count === 1 ? "link" : "links"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                  <p className="text-xs text-gray-500 mt-2 hidden md:block">
                    Click to explore {option.title.toLowerCase()} resources →
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Search + All Links Preview (combined) */}
      <div className="rounded-2xl shadow-lg p-6 bg-white text-gray-900">
        <input
          type="text"
          placeholder="Search all links..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery.trim() ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResults.map((link, idx) => {
                  const IconComponent = link.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(link.url)}
                      className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all group"
                    >
                      <IconComponent className={`w-6 h-6 ${link.color}`} />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 group-hover:underline mb-1">
                          {link.title}
                        </div>
                        <div className="text-xs text-gray-600">{link.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{link.category}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No results found.</div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">All Available Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(linkCategories).flat().slice(0, 6).map((link, idx) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(link.url)}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all group"
                  >
                    <IconComponent className={`w-6 h-6 ${link.color}`} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 group-hover:underline mb-1">
                        {link.title}
                      </div>
                      <div className="text-xs text-gray-600">{link.description}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-4">
              And {Object.values(linkCategories).flat().length - 6} more links available in categories above
            </div>
          </>
        )}
      </div>

      {/* Category Details */}
      {category && (
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
                      <p className="text-sm text-gray-600">{link.description}</p>
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
