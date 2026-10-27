import { useState, useEffect } from 'react';
import { AmbientBackground, ScrollProgress } from './components/motion/Ambient';
import { PageTransition } from './components/motion/PageTransition';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './app/page';
import { SearchPage } from './app/search/page';
import { ListingDetailPage } from './app/listing/[slug]/page';
import { PostWizardPage } from './app/post/page';
import { VendorDashboardPage } from './app/vendor/dashboard/page';
import { AdminPortalPage } from './app/admin/page';
import { MessagesPage } from './app/messages/page';
import { FavoritesPage } from './app/favorites/page';
import { ProfilePage } from './app/profile/page';
import { SearchBarExpandable } from './components/search/SearchBarExpandable';
import { Toast } from './components/ui/Toast';
import type { ToastMessage } from './components/ui/Toast';
import type { Listing } from './types';
import { store } from './mock/store';
import { ShieldAlert, Home } from 'lucide-react';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Parse location hash to state
  const syncRouteFromHash = () => {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (!rawHash || rawHash === 'home') {
      setCurrentRoute('home');
      setActiveListing(null);
      return;
    }

    if (rawHash.startsWith('category/')) {
      const catSlug = rawHash.replace('category/', '');
      setCurrentRoute(`search?category=${catSlug}`);
      setActiveListing(null);
      return;
    }

    if (rawHash.startsWith('listing/')) {
      const listingSlugOrId = rawHash.replace('listing/', '');
      const listing = store.getListingBySlug(listingSlugOrId);
      if (listing) {
        setActiveListing(listing);
        setCurrentRoute('listing-detail');
      } else {
        setCurrentRoute('404');
        setActiveListing(null);
      }
      return;
    }

    if (rawHash.startsWith('search')) {
      setCurrentRoute(rawHash);
      setActiveListing(null);
      return;
    }

    if (
      ['post', 'vendor-dashboard', 'admin', 'messages', 'favorites', 'profile', 'privacy', 'terms', 'security'].includes(rawHash)
    ) {
      setCurrentRoute(rawHash);
      setActiveListing(null);
      return;
    }

    // Default fallback
    setCurrentRoute('home');
    setActiveListing(null);
  };

  useEffect(() => {
    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    window.addEventListener('popstate', syncRouteFromHash);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      window.removeEventListener('popstate', syncRouteFromHash);
    };
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleNavigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let targetHash = '#home';

    if (route === 'home') {
      targetHash = '#home';
    } else if (route === 'search') {
      targetHash = '#search';
    } else if (route.startsWith('category-')) {
      const catSlug = route.replace('category-', '');
      targetHash = `#category/${catSlug}`;
    } else if (route.startsWith('search?')) {
      targetHash = `#${route}`;
    } else if (route === 'listing-detail' && activeListing) {
      targetHash = `#listing/${activeListing.slug || activeListing.id}`;
    } else {
      targetHash = `#${route}`;
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      syncRouteFromHash();
    }
  };

  const handleOpenListingDetail = (listing: Listing) => {
    setActiveListing(listing);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `#listing/${listing.slug || listing.id}`;
  };

  const renderContent = () => {
    if (currentRoute === 'home') {
      return (
        <HomePage
          onNavigate={handleNavigate}
          onOpenListingDetail={handleOpenListingDetail}
        />
      );
    }

    if (currentRoute.startsWith('search')) {
      const urlParams = new URLSearchParams(currentRoute.includes('?') ? currentRoute.split('?')[1] : '');
      const catParam = urlParams.get('category') || 'all';
      const qParam = urlParams.get('q') || '';
      const cityParam = urlParams.get('city') || 'All Cities';

      return (
        <SearchPage
          key={`${catParam}-${qParam}-${cityParam}`}
          initialCategory={catParam}
          initialQuery={qParam}
          initialCity={cityParam}
          onOpenListingDetail={handleOpenListingDetail}
        />
      );
    }

    if (currentRoute === 'listing-detail' && activeListing) {
      return (
        <ListingDetailPage
          listing={activeListing}
          onBack={() => handleNavigate('search')}
          onOpenListingDetail={handleOpenListingDetail}
        />
      );
    }

    if (currentRoute === 'post') {
      return (
        <PostWizardPage
          onSuccess={newListing => {
            addToast('success', 'Listing Verification Submitted!', 'Your listing passed initial trust checks and is live.');
            handleOpenListingDetail(newListing);
          }}
          onCancel={() => handleNavigate('home')}
        />
      );
    }

    if (currentRoute === 'vendor-dashboard') {
      return <VendorDashboardPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === 'admin') {
      return <AdminPortalPage />;
    }

    if (currentRoute === 'messages') {
      return <MessagesPage />;
    }

    if (currentRoute === 'favorites') {
      return <FavoritesPage onOpenListingDetail={handleOpenListingDetail} />;
    }

    if (currentRoute === 'profile') {
      return <ProfilePage />;
    }

    // 404 Not Found Screen
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28 pb-16 px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-navy-900/10 shadow-trust text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            404 — Verified Route Not Found
          </h2>
          <p className="text-xs text-navy-700 leading-relaxed">
            The page or verified listing you requested does not exist or has been relocated by system moderation.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white text-xs font-bold rounded-xl hover:bg-navy-800 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-orange-500" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => handleNavigate('search')}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <span>Explore Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <ScrollProgress />
      <AmbientBackground />

      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      {/* Main App Canvas */}
      <main className="flex-1 relative z-10">
        <PageTransition routeKey={currentRoute.split('?')[0]}>
          {renderContent()}
        </PageTransition>
      </main>

      {/* Editorial Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Bar Navigation */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />

      {/* Expandable Search Modal */}
      {searchModalOpen && (
        <SearchBarExpandable
          isExpandedModal
          onCloseModal={() => setSearchModalOpen(false)}
          onExecuteSearch={(q, cat, city) => {
            setSearchModalOpen(false);
            handleNavigate(`search?q=${encodeURIComponent(q || '')}&category=${cat || ''}&city=${city || ''}`);
          }}
        />
      )}

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}

export default App;

