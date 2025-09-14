import { useState, useEffect, useRef } from 'react';
import { APP_VERSION } from './version';
import Footer from './components/Footer';
import PrivacyNotice from './components/PrivacyNotice';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddFine from './components/AddFine';
import FineList from './components/FineList';
import Settings from './components/Settings';
import LinksPage from './components/LinksPage';
import CategoryLinksPage from './components/CategoryLinksPage';
import ReportBug from './components/ReportBug';
import SuggestFeature from './components/SuggestFeature';
import { Fine } from './types';
import { useStorage } from './hooks/useStorage';

const PRIVACY_ACCEPTED_VERSION_KEY = 'privacyAcceptedVersion';
function App() {
  const { 
    fines, 
    loading, 
    error, 
    addFine, 
    updateFine, 
    deleteFine, 
    syncData, 
    isOnline,
    clearError 
  } = useStorage();

  // Privacy/terms gating logic (version-aware)
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(() => {
    return localStorage.getItem(PRIVACY_ACCEPTED_VERSION_KEY) === APP_VERSION;
  });
  const [previousAcceptedVersion] = useState<string | null>(() => {
    const v = localStorage.getItem(PRIVACY_ACCEPTED_VERSION_KEY);
    return v && v !== APP_VERSION ? v : null;
  });

  useEffect(() => {
    if (privacyAccepted) {
      localStorage.setItem(PRIVACY_ACCEPTED_VERSION_KEY, APP_VERSION);
    }
  }, [privacyAccepted]);

  const handleAcceptPrivacy = () => setPrivacyAccepted(true);
  const handleDenyPrivacy = () => {
    setPrivacyAccepted(false);
    localStorage.removeItem(PRIVACY_ACCEPTED_VERSION_KEY);
    // Use same detection as ReportBug for native/web
    const cap = (window as any).Capacitor;
    const isNative = cap !== undefined && cap.isNativePlatform && cap.isNativePlatform();
    if (isNative) {
      if (cap && cap.Plugins && cap.Plugins.App && typeof cap.Plugins.App.exitApp === 'function') {
        cap.Plugins.App.exitApp();
      }
    } else {
      window.location.href = 'https://www.google.com';
    }
  };
  
  // Parse the current path and extract view and optional category for shareable links pages like /links/fines
  const parsePath = (path: string) => {
    const p = path.replace(/^\//, '').toLowerCase();
    // links pages can be /links or /links/category
    if (p.startsWith('links')) {
      const parts = p.split('/');
      if (parts.length > 1 && parts[1]) {
        return { view: 'links', category: decodeURIComponent(parts[1]) };
      }
      return { view: 'links', category: null };
    }

    const map: Record<string, string> = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'addfine': 'add',
      'add': 'add',
      'list': 'list',
      'settings': 'settings',
      'report-bug': 'report-bug',
      'add-suggestion': 'add-suggestion',
    };
    return { view: map[p] || 'dashboard', category: null };
  };

  const initial = parsePath(window.location.pathname);
  const [currentView, setCurrentView] = useState<string>(initial.view);
  const [currentCategory, setCurrentCategory] = useState<string | null>(initial.category);
  
  // Track scroll positions for back button functionality
  const [navigationHistory, setNavigationHistory] = useState<Array<{view: string, category?: string | null, scrollPosition?: number}>>([
    { view: initial.view, category: initial.category }
  ]);
  
  // Flag to prevent auto-scroll when restoring from back navigation
  const [isRestoringFromBack, setIsRestoringFromBack] = useState(false);

  // Ref for scroll container to save/restore scroll positions
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // navigateTo accepts optional category (used when view === 'links')
  const navigateTo = (view: string, replace = false, category?: string | null) => {
    // Check if this is actually a different navigation (different view OR different category)
    const isDifferentNavigation = view !== currentView || 
                                  (view === 'links' && category !== currentCategory);
    
    // Save current scroll position before navigating
    if (scrollContainerRef.current && !replace && isDifferentNavigation) {
      const currentScrollTop = scrollContainerRef.current.scrollTop;
      
      // Update the last entry in navigation history with current scroll position
      setNavigationHistory(prev => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...newHistory[newHistory.length - 1],
            scrollPosition: currentScrollTop
          };
        }
        
        // Add new entry for the destination
        newHistory.push({ view, category, scrollPosition: 0 });
        return newHistory;
      });
    }

    // Force immediate top scroll to avoid carrying previous page scroll position into the new view
    // (but skip this when restoring from back navigation)
    if (typeof window !== 'undefined' && !isRestoringFromBack) {
      try {
        (document.activeElement as HTMLElement)?.blur();
      } catch (e) {}
      try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (e) {}
      try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    }
    
    // Reset scroll container to top (but skip when restoring from back navigation)
    if (scrollContainerRef.current && !isRestoringFromBack) {
      scrollContainerRef.current.scrollTop = 0;
    }
    
    // update category when navigating to links, clear for other views
    if (view === 'links') {
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }

    setCurrentView(view);

    const pathMap: Record<string, string> = {
      'dashboard': '/',
      'add': '/addfine',
      'list': '/list',
      'settings': '/settings',
      'links': category ? `/links/${encodeURIComponent(category)}` : '/links',
      'report-bug': '/report-bug',
      'add-suggestion': '/add-suggestion'
    };

    const to = pathMap[view] ?? (view === 'dashboard' ? '/' : '/' + view);
    try {
      // The pathMap already handles the category path correctly
      let finalPath = to;
      if (replace) window.history.replaceState(null, '', finalPath);
      else window.history.pushState(null, '', finalPath);
    } catch (_) {
      // ignore (some older WebViews may restrict history)
    }

    // Ensure navigation always opens at top — handle cases where navigation is triggered outside Header
    // (but skip this complex scroll logic when restoring from back navigation)
    if (typeof window !== 'undefined' && !isRestoringFromBack) {
      try {
        // clear any existing hash that would jump to an anchor
        if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {
        // ignore
      }

      try {
        // blur any focused element that might trigger scrolling
        (document.activeElement as HTMLElement)?.blur();
      } catch (e) {
        // ignore
      }

      // wait for next paint then force top-of-page scrolling (double rAF recommended)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        try {
          const header = document.querySelector('header');
          const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
          const main = document.querySelector('main');
          // Prefer scrolling to the first heading inside main (title) so it's visible below the header
          let target = 0;
          if (main) {
            const firstHeading = main.querySelector('h1, h2, h3');
            if (firstHeading) {
              const elTop = (firstHeading as HTMLElement).getBoundingClientRect().top + window.scrollY;
              // leave a small gap so the heading isn't flush against the header
              target = Math.max(0, elTop - headerH - 12);
            } else {
              const mainTop = main.getBoundingClientRect().top + window.scrollY;
              target = Math.max(0, mainTop - headerH - 12);
            }
          }

          window.scrollTo({ top: target, left: 0, behavior: 'auto' });
          document.documentElement.scrollTop = target;
          document.body.scrollTop = target;
          if (main) main.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch (e) {
          // ignore
        }
      }));
    }
  };

  // Navigate back and restore scroll position
  const goBack = () => {
    if (navigationHistory.length > 1) {
      // Remove current state from history
      const newHistory = [...navigationHistory];
      newHistory.pop();
      
      // Get previous state
      const previousState = newHistory[newHistory.length - 1];
      
      if (previousState) {
        setIsRestoringFromBack(true);
        setNavigationHistory(newHistory);
        setCurrentView(previousState.view);
        setCurrentCategory(previousState.category || null);
        
        // Update URL
        const pathMap: Record<string, string> = {
          'dashboard': '/',
          'add': '/addfine',
          'list': '/list',
          'settings': '/settings',
          'links': previousState.category ? `/links/${encodeURIComponent(previousState.category)}` : '/links',
          'report-bug': '/report-bug'
        };
        const to = pathMap[previousState.view] ?? (previousState.view === 'dashboard' ? '/' : '/' + previousState.view);
        let finalPath = to;
        
        try {
          window.history.replaceState(null, '', finalPath);
        } catch (_) {
          // ignore
        }
        
        // Immediately restore scroll position to prevent flicker
        if (scrollContainerRef.current && previousState.scrollPosition !== undefined) {
          scrollContainerRef.current.scrollTop = previousState.scrollPosition;
        }
        
        // Reset the restoration flag after a short delay
        setTimeout(() => {
          setIsRestoringFromBack(false);
        }, 150);
      }
    }
  };

  // Prevent scroll above 0 in the scroll container
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (scrollContainer.scrollTop < 0) {
        scrollContainer.scrollTop = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent overscroll if we're at the top and trying to scroll up
      if (scrollContainer.scrollTop <= 0 && e.touches.length === 1) {
        const touch = e.touches[0];
        const startY = touch.clientY;
        
        const handleTouchMoveInner = (e2: TouchEvent) => {
          const currentY = e2.touches[0].clientY;
          const deltaY = currentY - startY;
          
          // If scrolling up (deltaY > 0) and we're at the top, prevent it
          if (deltaY > 0 && scrollContainer.scrollTop <= 0) {
            e2.preventDefault();
          }
        };
        
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMoveInner);
          document.removeEventListener('touchend', handleTouchEnd);
        };
        
        document.addEventListener('touchmove', handleTouchMoveInner, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    scrollContainer.addEventListener('touchstart', handleTouchMove, { passive: false });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  // Handle mobile browser UI (bottom bars, address bars) using Visual Viewport API
  useEffect(() => {
    const updateViewportHeight = () => {
      if (typeof window !== 'undefined') {
        // Use Visual Viewport API if available (better for mobile browsers)
        const visualViewport = window.visualViewport;
        const windowHeight = window.innerHeight;
        
        let availableHeight = windowHeight;
        if (visualViewport) {
          availableHeight = visualViewport.height;
        }
        
        // Calculate the difference to detect browser UI
        const uiHeight = windowHeight - availableHeight;
        
        // Set CSS custom property for dynamic bottom offset
        document.documentElement.style.setProperty(
          '--browser-ui-bottom', 
          `${Math.max(uiHeight, 0)}px`
        );
        
        // Also set safe area for better compatibility
        document.documentElement.style.setProperty(
          '--safe-area-inset-bottom', 
          `max(env(safe-area-inset-bottom, 0px), ${Math.max(uiHeight + 10, 10)}px)`
        );
      }
    };

    // Initial call
    updateViewportHeight();

    // Listen for viewport changes
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    }

    // Fallback for browsers without Visual Viewport API
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      }
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () => {
      const parsed = parsePath(window.location.pathname);
      setCurrentView(parsed.view);
      setCurrentCategory(parsed.category);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Scroll to top when view changes (but not when restoring from back)
  useEffect(() => {
    if (!isRestoringFromBack) {
      // Find the scrollable container and scroll it to top
      const scrollContainer = document.querySelector('[style*="overflowY: auto"]') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }, [currentView, currentCategory, isRestoringFromBack]);

  const handleReportBug = () => {
    navigateTo('report-bug');
  };

  const handleSuggestion = () => {
    navigateTo('add-suggestion');
  };

  const handleDonation = () => {
    window.open('https://buymeacoffee.com/ladishdev', '_blank');
  };

  const handleAddFine = async (fine: Omit<Fine, 'id'>) => {
    try {
      await addFine(fine);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Failed to add fine:', error);
    }
  };

  const handleUpdateFine = async (id: string, updates: Partial<Fine>) => {
    try {
      await updateFine(id, updates);
    } catch (error) {
      console.error('Failed to update fine:', error);
    }
  };

  const handleDeleteFine = async (id: string) => {
    try {
      await deleteFine(id);
    } catch (error) {
      console.error('Failed to delete fine:', error);
    }
  };

  const handleCategorySelect = (category: string) => {
    // navigate and include category in the URL for sharing
    navigateTo('links', false, category);
  };

  const handleBackToDashboard = () => {
    // Use goBack to restore previous view and scroll position
    // instead of forcing navigation to dashboard
    goBack();
  };

  useEffect(() => {
    // Prevent browser from restoring scroll position when navigating via history
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (e) {
        // Some browsers may throw when setting this, ignore safely
      }
    }
  }, []);

  if (!privacyAccepted) {
    return (
      <PrivacyNotice 
        onAccept={handleAcceptPrivacy} 
        onDeny={handleDenyPrivacy}
        isUpdate={!!previousAcceptedVersion}
        previousVersion={previousAcceptedVersion}
        currentVersion={APP_VERSION}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
      <Header 
        currentView={currentView} 
        setCurrentView={navigateTo}
        onBackToDashboard={goBack}
        showBackButton={
          currentView === 'report-bug' || 
          currentView === 'add-suggestion' ||
          (currentView === 'links' && !!currentCategory)
        }
      />
      
      <div 
        ref={scrollContainerRef}
        style={{ 
          position: 'absolute', 
          top: '64px', 
          left: 0, 
          right: 0, 
          bottom: 0, 
          overflowY: 'auto', 
          overflowX: 'hidden',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
          WebkitOverflowScrolling: 'touch'
        }} className="app-container">
        <main 
          className="container mx-auto px-4 md:pt-6 pb-6 max-w-4xl" 
          style={{ 
            paddingTop: '24px', 
            paddingBottom: 'calc(24px + var(--safe-area-inset-bottom, 0px))',
            minHeight: 'calc(100vh - 72px)' 
          }}
        >
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading fines...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {currentView === 'dashboard' && (
              <Dashboard 
                fines={fines} 
                onAddFine={() => navigateTo('add')}
                onCategorySelect={handleCategorySelect}
              />
            )}
            
            {currentView === 'add' && (
              <AddFine 
                onAddFine={handleAddFine}
                onCancel={() => navigateTo('dashboard')}
              />
            )}
            
            {currentView === 'list' && (
              <FineList 
                fines={fines}
                onUpdateFine={handleUpdateFine}
                onDeleteFine={handleDeleteFine}
              />
            )}
            
            {currentView === 'links' && !currentCategory && (
              <LinksPage 
                category={undefined}
                onBack={handleBackToDashboard}
                onNavigateToCategory={handleCategorySelect}
                onNavigateToLinks={() => navigateTo('links', false, null)}
                cameFromLinksPage={navigationHistory.length > 1 && navigationHistory[navigationHistory.length - 2]?.view === 'links'}
              />
            )}
            
            {currentView === 'links' && currentCategory && (
              <CategoryLinksPage 
                category={currentCategory}
                onBack={navigationHistory.length > 1 && navigationHistory[navigationHistory.length - 2]?.view === 'links' 
                  ? () => navigateTo('links', false, null) 
                  : handleBackToDashboard}
              />
            )}
            
            {currentView === 'settings' && (
              <Settings 
                onSync={syncData}
                isOnline={isOnline()}
                onReportBug={handleReportBug}
                onSuggestion={handleSuggestion}
                onDonation={handleDonation}
              />
            )}
            
            {currentView === 'report-bug' && (
              <ReportBug 
                onCancel={() => navigateTo('settings')}
              />
            )}
            {currentView === 'add-suggestion' && (
              <SuggestFeature
                onCancel={() => navigateTo('settings')}
              />
            )}
          </>
        )}
        
        {/* Footer */}
        <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
