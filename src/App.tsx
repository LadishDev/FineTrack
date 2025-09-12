import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddFine from './components/AddFine';
import FineList from './components/FineList';
import Settings from './components/Settings';
import LinksPage from './components/LinksPage';
import ReportBug from './components/ReportBug';
import { Fine } from './types';
import { useStorage } from './hooks/useStorage';

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
  
  // Parse the current path and extract view and optional category for shareable links pages like /links-mot
  const parsePath = (path: string) => {
    const p = path.replace(/^\//, '').toLowerCase();
    // links pages can be /links or /links-<category>
    if (p.startsWith('links')) {
      const parts = p.split('-', 2);
      const category = parts[1] ? decodeURIComponent(parts[1]) : null;
      return { view: 'links', category };
    }

    const map: Record<string, string> = {
      '': 'dashboard',
      'dashboard': 'dashboard',
      'addfine': 'add',
      'add': 'add',
      'list': 'list',
      'settings': 'settings',
      'report-bug': 'report-bug'
    };
    return { view: map[p] || 'dashboard', category: null };
  };

  const initial = parsePath(window.location.pathname);
  const [currentView, setCurrentView] = useState<string>(initial.view);
  const [currentCategory, setCurrentCategory] = useState<string | null>(initial.category);

  // navigateTo accepts optional category (used when view === 'links')
  const navigateTo = (view: string, replace = false, category?: string | null) => {
    // Force immediate top scroll to avoid carrying previous page scroll position into the new view
    if (typeof window !== 'undefined') {
      try {
        (document.activeElement as HTMLElement)?.blur();
      } catch (e) {}
      try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch (e) {}
      try { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; } catch (e) {}
    }
    // update category when navigating to links, clear for other views
    if (view === 'links') {
      if (category) setCurrentCategory(category);
    } else {
      setCurrentCategory(null);
    }

    setCurrentView(view);
    const pathMap: Record<string, string> = {
      'dashboard': '/',
      'add': '/addfine',
      'list': '/list',
      'settings': '/settings',
      'links': '/links',
      'report-bug': '/report-bug'
    };
    const to = pathMap[view] ?? (view === 'dashboard' ? '/' : '/' + view);
    try {
      // If navigating to links with a category, use /links-<category> so it can be shared
      let finalPath = to;
      if (view === 'links' && category) {
        finalPath = `/links-${encodeURIComponent(category)}`;
      }
      if (replace) window.history.replaceState(null, '', finalPath);
      else window.history.pushState(null, '', finalPath);
    } catch (_) {
      // ignore (some older WebViews may restrict history)
    }

    // Ensure navigation always opens at top — handle cases where navigation is triggered outside Header
    if (typeof window !== 'undefined') {
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

  // Scroll to top when view changes
  useEffect(() => {
    try {
      const header = document.querySelector('header');
      const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 64;
      const main = document.querySelector('main');
      let target = 0;
      if (main) {
        const firstHeading = main.querySelector('h1, h2, h3');
        if (firstHeading) {
          const elTop = (firstHeading as HTMLElement).getBoundingClientRect().top + window.scrollY;
          target = Math.max(0, elTop - headerH - 12);
        } else {
          const mainTop = main.getBoundingClientRect().top + window.scrollY;
          target = Math.max(0, mainTop - headerH - 12);
        }
      }
      window.scrollTo({ top: target, left: 0, behavior: 'smooth' });
    } catch (e) {
      // ignore
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [currentView, currentCategory]);

  const handleReportBug = () => {
    navigateTo('report-bug');
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
    navigateTo('dashboard');
    setCurrentCategory(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        setCurrentView={navigateTo}
        onBackToDashboard={handleBackToDashboard}
        showBackButton={currentView === 'links'}
      />
      
      <main className="container mx-auto px-4 pt-20 md:pt-6 pb-6 max-w-4xl" style={{ scrollPaddingTop: '80px' }}>
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
            
            {currentView === 'links' && currentCategory && (
              <LinksPage 
                category={currentCategory}
                onBack={handleBackToDashboard}
              />
            )}
            
            {currentView === 'settings' && (
              <Settings 
                onSync={syncData}
                isOnline={isOnline()}
                onReportBug={handleReportBug}
              />
            )}
            
            {currentView === 'report-bug' && (
              <ReportBug 
                onCancel={() => navigateTo('settings')}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
