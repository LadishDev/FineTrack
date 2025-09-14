import { Car, Settings, Plus, List, ArrowLeft, Link } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onBackToDashboard?: () => void;
  showBackButton?: boolean;
}

export default function Header({ currentView, setCurrentView, onBackToDashboard, showBackButton }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Car },
    { id: 'add', label: 'Add Fine', icon: Plus },
    { id: 'list', label: 'All Fines', icon: List },
    { id: 'links', label: 'Links', icon: Link },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMobileNavClick = (viewId: string) => {
    // delegate to central nav handler to ensure consistent scroll behavior
    handleNavClick(viewId);
    // close mobile menu after navigation
    setMobileMenuOpen(false);
  };

  // Scroll to top when navigating between views
  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    if (typeof window !== 'undefined') {
      // clear any hash to avoid browser jumping to anchors
      try {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (e) {
        // ignore
      }

      // blur any focused element that could cause the browser to scroll
      try {
        (document.activeElement as HTMLElement)?.blur();
      } catch (e) {
        // ignore
      }

      // wait for next paint and then force top-of-page scroll in multiple ways
      requestAnimationFrame(() => requestAnimationFrame(() => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          // fallbacks for some browsers
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          const main = document.querySelector('main');
          if (main) main.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch (e) {
          // ignore
        }
      }));
    }
  };

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm" style={{ position: 'fixed', minHeight: '64px', maxHeight: '64px' }}>
        <nav className="w-full flex items-center justify-between px-6 h-full max-w-7xl mx-auto" style={{ height: '64px', minHeight: '64px' }}>
          {/* Left side: hamburger + logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center group"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 transform origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 transform origin-center ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 transform origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>

            {/* Back Button */}
            {showBackButton && onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </button>
            )}

            {/* Logo */}
            <button
              onClick={() => {
                handleNavClick('dashboard');
              }}
              aria-label="Go to dashboard"
              className="flex items-center text-gray-900 focus:outline-none rounded-md hover:bg-gray-50 px-2 py-1"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <img src="../public/logo_image.png" alt="" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                FineTrack
              </h1>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute inset-x-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-95'
        }`} style={{ top: 'calc(64px + var(--status-bar-height, 0px) + 16px)' }}>
          <div className="p-6">
            <div className="grid gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { handleMobileNavClick(item.id); }}
                    className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-500">
                        {item.id === 'dashboard' && 'Overview and stats'}
                        {item.id === 'add' && 'Record new fine'}
                        {item.id === 'list' && 'View all records'}
                        {item.id === 'settings' && 'App preferences'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
}
