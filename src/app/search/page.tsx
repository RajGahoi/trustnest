import React, { useState, useMemo, useEffect } from 'react';
import { SearchBarExpandable } from '../../components/search/SearchBarExpandable';
import { FilterPanel } from '../../components/search/FilterPanel';
import type { FilterState } from '../../components/search/FilterPanel';
import { ListingCard } from '../../components/listing/ListingCard';
import { TrustScoreChart } from '../../components/trust/TrustScoreChart';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AnimatedNumber } from '../../components/motion/AnimatedNumber';
import { store } from '../../mock/store';
import type { Listing } from '../../types';
import { SlidersHorizontal, LayoutGrid, List, SearchX, ShieldCheck } from 'lucide-react';

interface SearchPageProps {
  initialCategory?: string;
  initialQuery?: string;
  initialCity?: string;
  onOpenListingDetail: (listing: Listing) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialCategory = 'all',
  initialQuery = '',
  initialCity = 'All Cities',
  onOpenListingDetail
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTrustListing, setSelectedTrustListing] = useState<Listing | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    categorySlug: initialCategory,
    city: initialCity || 'All Cities',
    minPrice: 0,
    maxPrice: 500000000,
    minTrustScore: 0,
    sellerType: 'ALL',
    sortBy: 'trust-desc',
    dynamicAttrs: {}
  });

  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const reduceMotion = useReducedMotion();

  const allListings = store.getPublishedListings();

  // Filter & Search Logic
  const filteredListings = useMemo(() => {
    return allListings.filter(listing => {
      // Full text query match
      if (query.trim()) {
        const q = query.toLowerCase();
        const titleMatch = listing.title.toLowerCase().includes(q);
        const descMatch = listing.description.toLowerCase().includes(q);
        const locMatch = listing.location.locality.toLowerCase().includes(q) || listing.location.city.toLowerCase().includes(q);
        const attrMatch = Object.values(listing.attributes || {}).some(v => String(v).toLowerCase().includes(q));
        const sellerMatch = listing.sellerName.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !locMatch && !attrMatch && !sellerMatch) return false;
      }

      // City match — this is the real, data-driven city filter. Changing city
      // now actually narrows the listing set instead of leaving it unchanged.
      if (filters.city && filters.city !== 'All Cities' && listing.location.city !== filters.city) {
        return false;
      }

      // Category match
      if (filters.categorySlug !== 'all' && listing.categorySlug !== filters.categorySlug) {
        return false;
      }

      // Trust threshold match
      if (listing.trustScore.overallScore < filters.minTrustScore) {
        return false;
      }

      // Seller Type match
      if (filters.sellerType !== 'ALL' && listing.sellerType !== filters.sellerType) {
        return false;
      }

      // Dynamic Attr filter
      for (const [key, val] of Object.entries(filters.dynamicAttrs)) {
        if (val && listing.attributes[key] !== undefined) {
          if (String(listing.attributes[key]).toLowerCase() !== val.toLowerCase()) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'trust-desc') {
        return b.trustScore.overallScore - a.trustScore.overallScore;
      } else if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      } else if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [allListings, query, filters]);

  // New search or filter state starts again from the first page of results
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filters, query]);

  const handleResetFilters = () => {
    setFilters({
      categorySlug: 'all',
      city: 'All Cities',
      minPrice: 0,
      maxPrice: 500000000,
      minTrustScore: 0,
      sellerType: 'ALL',
      sortBy: 'trust-desc',
      dynamicAttrs: {}
    });
    setQuery('');
  };

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Search Bar */}
      <div className="bg-cream-50 p-4 rounded-3xl border border-navy-900/10 shadow-trust">
        <SearchBarExpandable
          currentQuery={query}
          currentCategory={filters.categorySlug}
          currentCity={filters.city}
          onExecuteSearch={(q, cat, city) => {
            if (q !== undefined) setQuery(q);
            setFilters(prev => ({
              ...prev,
              categorySlug: cat || 'all',
              city: city || 'All Cities'
            }));
          }}
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-4 sticky top-28">
          <FilterPanel
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={handleResetFilters}
            resultsCount={filteredListings.length}
          />
        </div>

        {/* Listings Result Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-navy-900/10 shadow-sm text-xs font-semibold text-navy-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>
                Found <strong className="text-orange-600 font-extrabold text-base num-mono"><AnimatedNumber value={filteredListings.length} /></strong> verified listings
                {filters.city !== 'All Cities' && <> in <strong className="text-navy-900">{filters.city}</strong></>}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 border border-navy-900/15 rounded-xl font-bold cursor-pointer hover:bg-cream-200 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
                <span>Filters</span>
              </button>

              {/* Grid / List Layout Toggle */}
              <div className="hidden sm:flex items-center bg-cream-100 p-1 rounded-xl border border-navy-900/10">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-cream-200'}`}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-cream-200'}`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Listings Display */}
          {filteredListings.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredListings.slice(0, visibleCount).map((listing, i) => (
                    <motion.div
                      key={listing.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i % PAGE_SIZE, 8) * 0.05 }}
                    >
                      <ListingCard
                        listing={listing}
                        onOpenListing={onOpenListingDetail}
                        onOpenTrustModal={setSelectedTrustListing}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-center gap-3 pt-6">
                <p className="text-sm text-navy-700">
                  Showing <span className="num-mono font-semibold">{Math.min(visibleCount, filteredListings.length)}</span> of <span className="num-mono font-semibold">{filteredListings.length}</span>
                </p>
                <div className="w-48 h-1 bg-navy-900/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500 rounded-full"
                    animate={{ width: `${(Math.min(visibleCount, filteredListings.length) / filteredListings.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                {visibleCount < filteredListings.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="btn-soft px-7 py-3 bg-navy-900 text-cream-50 font-semibold rounded-full text-sm cursor-pointer hover:bg-navy-800"
                  >
                    Show {Math.min(PAGE_SIZE, filteredListings.length - visibleCount)} more
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-navy-900/10 shadow-trust space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Nothing matches yet</h3>
              <p className="text-xs text-navy-700 max-w-md mx-auto">
                No verified listings match{filters.city !== 'All Cities' ? ` these filters in ${filters.city}` : ' your current filter combination'}
                {filters.categorySlug !== 'all' ? ` for ${store.getCategoryBySlug(filters.categorySlug)?.name || filters.categorySlug}` : ''}. Try resetting your filters or widening your search to discover more verified items.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-orange-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      {mobileFiltersOpen && (
        <FilterPanel
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={handleResetFilters}
          resultsCount={filteredListings.length}
          isMobileSheet
          onCloseMobileSheet={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Trust Score Breakdown Modal */}
      {selectedTrustListing && (
        <TrustScoreChart
          trustScore={selectedTrustListing.trustScore}
          isModal
          onClose={() => setSelectedTrustListing(null)}
        />
      )}
    </div>
  );
};
