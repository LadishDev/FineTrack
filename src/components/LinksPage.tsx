import React from 'react';
import { AlertTriangle, Calendar, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { categoryData } from './CategoryLinksPage.tsx';

interface LinksPageProps {
  category?: string;
  onBack?: () => void;
  onNavigateToCategory?: (category: string) => void;
  onNavigateToLinks?: () => void;
  cameFromLinksPage?: boolean;
}

const LinksPage: React.FC<LinksPageProps> = ({
  category,
  onNavigateToCategory,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const categoryOptions = [
    { id: "fines", title: "Fines", description: "Parking, speeding & penalty charges", icon: AlertTriangle, color: "text-red-500", borderColor: "border-red-200", bgColor: "bg-red-50" },
    { id: "charges", title: "Charges", description: "Dartford, congestion & road charges", icon: Calendar, color: "text-orange-500", borderColor: "border-orange-200", bgColor: "bg-orange-50" },
    { id: "insurance", title: "Insurance", description: "Compare & manage car insurance", icon: Shield, color: "text-blue-500", borderColor: "border-blue-200", bgColor: "bg-blue-50" },
    { id: "mot", title: "MOT & Tax", description: "MOT tests & vehicle tax", icon: CheckCircle, color: "text-green-500", borderColor: "border-green-200", bgColor: "bg-green-50" },
  ];

  // Map category ID to icon and colors
  const categoryMap = Object.fromEntries(categoryOptions.map(opt => [opt.id, opt]));

  // Build linkCategories from CategoryLinksPage data, with correct icons/colors per category
const linkCategories = Object.fromEntries(
  Object.entries(categoryData).map(([key, value]) => [
    key,
    value.sections.flatMap((section: any) =>
      section.links.map((link: any) => {
        const cat = categoryMap[key];
        return {
          title: link.title,
          description: link.description,
          url: link.url,
          icon: cat?.icon || AlertTriangle,
          color: cat?.color || 'text-gray-500',
          bgColor: cat?.bgColor || 'bg-gray-50',
          category: key,
          sectionTitle: section.title, // NEW: track section
        };
      })
    ),
  ])
);

  const currentLinks = category ? linkCategories[category] || [] : [];

const allLinks = Object.entries(categoryData).flatMap(([catKey, catVal]) =>
  catVal.sections.flatMap((section: any) =>
    section.links.map((link: any) => {
      const cat = categoryMap[catKey];
      return {
        title: link.title,
        description: link.description,
        url: link.url,
        icon: cat?.icon || AlertTriangle,
        color: cat?.color || 'text-gray-500',
        bgColor: cat?.bgColor || 'bg-gray-50',
        category: catKey,
        sectionTitle: section.title, // important for search
      };
    })
  )
);

const filteredResults = searchQuery.trim()
  ? allLinks.filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];


  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryTitle = (cat: string) => {
    const titles: Record<string, string> = {
      fines: 'Fines & Penalties',
      charges: 'Road Charges',
      insurance: 'Car Insurance',
      mot: 'MOT & Vehicle Tax',
    };
    return titles[cat] || cat;
  };

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

    {/* Category Grid */}
    {!category && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryOptions.map(opt => {
        const Icon = opt.icon;
        const sectionCount = categoryData[opt.id]?.sections.length || 0; // <-- number of sections
        return (
            <button
            key={opt.id}
            onClick={() => onNavigateToCategory ? onNavigateToCategory(opt.id) : window.location.href = `/links/${opt.id}`}
            className={`flex flex-col md:flex-row items-center md:items-start gap-4 p-6 border-2 ${opt.borderColor} ${opt.bgColor} rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left group`}
            >
            <Icon className={`w-8 h-8 ${opt.color}`} />
            <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{opt.title}</h3>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${opt.color} bg-white bg-opacity-60`}>
                    {sectionCount} {sectionCount === 1 ? "section" : "sections"}
                </span>
                </div>
                <p className="text-gray-600 text-sm">{opt.description}</p>
                <p className="text-xs text-gray-500 mt-2 hidden md:block">
                Click to explore {opt.title.toLowerCase()} resources →
                </p>
            </div>
            </button>
        );
        })}
    </div>
    )}

      {/* Search + All Links Preview */}
      <div className="rounded-2xl shadow-lg p-6 bg-white text-gray-900">
        <input
          type="text"
          placeholder="Search all links..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {searchQuery.trim() ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResults.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(link.url)}
                      className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all group"
                    >
                      <Icon className={`w-6 h-6 ${link.color}`} />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 group-hover:underline mb-1">{link.title}</div>
                        <div className="text-xs text-gray-600">{link.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{getCategoryTitle(link.category)}</div>
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
              {allLinks.slice(0, 6).map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(link.url)}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all group"
                  >
                    <Icon className={`w-6 h-6 ${link.color}`} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 group-hover:underline mb-1">{link.title}</div>
                      <div className="text-xs text-gray-600">{link.description}</div>
                      <div className="text-xs text-gray-400 mt-1">{getCategoryTitle(link.category)}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-4">
              And {allLinks.length - 6} more links available in categories above
            </div>
          </>
        )}
      </div>

      {/* Category Details */}
      {category && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentLinks.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{getCategoryTitle(category)} Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(link.url)}
                      className={`${link.bgColor} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`h-8 w-8 ${link.color}`} />
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <h4 className={`font-semibold ${link.color} mb-2 group-hover:underline`}>{link.title}</h4>
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
