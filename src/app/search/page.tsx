import React, { useState, useMemo, useEffect } from 'react';
import { SearchBarExpandable } from '../../components/search/SearchBarExpandable';
import { FilterPanel } from '../../components/search/FilterPanel';
import type { FilterState } from '../../components/search/FilterPanel';
import { ListingCard } from '../../components/listing/ListingCard';
import { TrustScoreChart } from '../../components/trust/TrustScoreChart';
import { MapExplorer } from '../../components/location/MapExplorer';
import { LocationAutocomplete } from '../../components/location/LocationAutocomplete';
import { PropertyComparisonModal } from '../../components/listing/PropertyComparisonModal';
import { SavedSearchesModal } from '../../components/search/SavedSearchesModal';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedNumber } from '../../components/motion/AnimatedNumber';
import { store } from '../../mock/store';
import type { Listing, SavedSearch } from '../../types';
import { 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Map, 
  Columns, 
  SearchX, 
  ShieldCheck, 
  Bookmark, 
  Layers, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'split'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTrustListing, setSelectedTrustListing] = useState<Listing | null>(null);
  const [mapSelectedListing, setMapSelectedListing] = useState<Listing | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(15);
  
  // Modals state
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [savedSearchModalOpen, setSavedSearchModalOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [comparedListings, setComparedListings] = useState<Listing[]>(store.getComparisonListings());

  const [filters, setFilters] = useState<FilterState>({
    categorySlug: initialCategory,
    city: initialCity || 'All Cities',
    locality: '',
    minPrice: 0,
    maxPrice: 500000000,
    minTrustScore: 0,
    sellerType: 'ALL',
    sortBy: 'trust-desc',
    reraOnly: false,
    ownershipType: '',
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

      // City match
      if (filters.city && filters.city !== 'All Cities' && listing.location.city !== filters.city) {
        return false;
      }

      // Locality match
      if (filters.locality && listing.location.locality.toLowerCase() !== filters.locality.toLowerCase()) {
        return false;
      }

      // Category match
      if (filters.categorySlug !== 'all') {
        if (filters.categorySlug === 'pg') {
          const isPgListing = listing.categorySlug === 'pg' || 
            listing.attributes?.propertyCategory === 'PG_COLIVING' || 
            (listing.title + ' ' + listing.description).toLowerCase().includes('pg') || 
            (listing.title + ' ' + listing.description).toLowerCase().includes('co-living');
          if (!isPgListing) return false;
        } else if (listing.categorySlug !== filters.categorySlug) {
          return false;
        }
      }

      // Price range match
      if (listing.price < filters.minPrice || listing.price > filters.maxPrice) {
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

      // RERA only match
      if (filters.reraOnly) {
        const hasRera = Boolean(listing.propertyDetails?.reraId || listing.propertyDetails?.reraApproved);
        if (!hasRera) return false;
      }

      // Ownership type match
      if (filters.ownershipType && listing.propertyDetails?.ownershipType !== filters.ownershipType) {
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

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filters, query]);

  const handleResetFilters = () => {
    setFilters({
      categorySlug: 'all',
      city: 'All Cities',
      locality: '',
      minPrice: 0,
      maxPrice: 500000000,
      minTrustScore: 0,
      sellerType: 'ALL',
      sortBy: 'trust-desc',
      reraOnly: false,
      ownershipType: '',
      dynamicAttrs: {}
    });
    setQuery('');
  };

  const handleSaveSearch = () => {
    store.saveSearch({
      userId: 'usr-current',
      name: `${filters.city !== 'All Cities' ? filters.city : 'All India'} ${filters.categorySlug} (${filteredListings.length} results)`,
      category: filters.categorySlug,
      city: filters.city,
      locality: filters.locality,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 500000000 ? filters.maxPrice : undefined,
      minTrustScore: filters.minTrustScore > 0 ? filters.minTrustScore : undefined,
      alertFrequency: 'INSTANT'
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleToggleCompare = (listing: Listing) => {
    const isPresent = comparedListings.some(l => l.id === listing.id);
    if (isPresent) {
      store.removeFromComparison(listing.id);
    } else {
      store.addToComparison(listing.id);
    }
    setComparedListings(store.getComparisonListings());
  };

  const handleExecuteSavedSearch = (s: SavedSearch) => {
    setFilters({
      categorySlug: s.category || 'all',
      city: s.city || 'All Cities',
      locality: s.locality || '',
      minPrice: s.minPrice || 0,
      maxPrice: s.maxPrice || 500000000,
      minTrustScore: s.minTrustScore || 0,
      sellerType: 'ALL',
      sortBy: 'trust-desc',
      dynamicAttrs: {}
    });
    setQuery('');
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Location Bar & Search Input */}
      <div className="bg-cream-50 p-4 sm:p-5 rounded-3xl border border-navy-900/10 shadow-trust space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4">
            <LocationAutocomplete
              selectedCity={filters.city}
              selectedLocality={filters.locality}
              onSelectLocation={(city, locality) => {
                setFilters(prev => ({
                  ...prev,
                  city: city || 'All Cities',
                  locality: locality || ''
                }));
              }}
            />
          </div>

          <div className="md:col-span-8">
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
        </div>

        {/* Quick Filters & Actions Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-navy-900/10 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cream-200 border border-navy-900/10 rounded-xl font-bold text-navy-900 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-orange-500" />
              <span>{saveSuccessMsg ? 'Criteria Saved!' : 'Save This Search'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSavedSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-cream-200 border border-navy-900/10 rounded-xl font-bold text-navy-900 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-trust-green" />
              <span>Saved Searches ({store.getSavedSearches().length})</span>
            </button>
          </div>

          {/* View Mode Switcher: List, Map, Split */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-navy-900/15 shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid' || viewMode === 'list'
                  ? 'bg-navy-900 text-white shadow'
                  : 'text-navy-700 hover:text-navy-900'
              }`}
              title="Standard Grid/List View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listings</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-navy-900 text-white shadow'
                  : 'text-navy-700 hover:text-navy-900'
              }`}
              title="Combined Map + Listings Split View"
            >
              <Columns className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-navy-900 text-white shadow'
                  : 'text-navy-700 hover:text-navy-900'
              }`}
              title="Full Map Exploration View"
            >
              <Map className="w-3.5 h-3.5 text-trust-green" />
              <span className="hidden sm:inline">Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      {viewMode === 'map' ? (
        /* 1. DEDICATED FULL MAP EXPLORATION VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-navy-800 px-1">
            <span>Interactive GIS Blueprint Exploration — {filters.city}</span>
            <span>{filteredListings.length} Geocoded Pins Mapped</span>
          </div>
          <MapExplorer
            listings={filteredListings}
            activeCity={filters.city !== 'All Cities' ? filters.city : 'Noida'}
            selectedListing={mapSelectedListing}
            onSelectListing={setMapSelectedListing}
            onOpenListingDetail={onOpenListingDetail}
            radiusKm={searchRadiusKm}
            onRadiusChange={setSearchRadiusKm}
            className="h-[620px]"
          />
        </div>
      ) : viewMode === 'split' ? (
        /* 2. COMBINED MAP + RESULTS SPLIT VIEW */
        <div className="space-y-6">
          <MapExplorer
            listings={filteredListings}
            activeCity={filters.city !== 'All Cities' ? filters.city : 'Noida'}
            selectedListing={mapSelectedListing}
            onSelectListing={setMapSelectedListing}
            onOpenListingDetail={onOpenListingDetail}
            radiusKm={searchRadiusKm}
            onRadiusChange={setSearchRadiusKm}
            className="h-[420px]"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="hidden lg:block lg:col-span-4 sticky top-28">
              <FilterPanel
                filters={filters}
                onChangeFilters={setFilters}
                onResetFilters={handleResetFilters}
                resultsCount={filteredListings.length}
              />
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-navy-900/10 text-xs font-bold text-navy-900">
                <span>Verified Results ({filteredListings.length})</span>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1 text-orange-600"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredListings.slice(0, visibleCount).map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onOpenListing={onOpenListingDetail}
                    onOpenTrustModal={setSelectedTrustListing}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedListings.some(l => l.id === listing.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. STANDARD LIST / GRID VIEW */
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
                  {filters.locality && <> (<strong className="text-orange-600">{filters.locality}</strong>)</>}
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

            {/* Results Grid / List */}
            {filteredListings.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredListings.slice(0, visibleCount).map((listing, idx) => (
                  <motion.div
                    key={listing.id}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduceMotion ? 0 : Math.min(idx * 0.03, 0.3) }}
                  >
                    <ListingCard
                      listing={listing}
                      onOpenListing={onOpenListingDetail}
                      onOpenTrustModal={setSelectedTrustListing}
                      onToggleCompare={handleToggleCompare}
                      isCompared={comparedListings.some(l => l.id === listing.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-navy-900/10 shadow-trust space-y-4">
                <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                  No verified properties match your exact criteria
                </h3>
                <p className="text-xs text-navy-700 max-w-md mx-auto leading-relaxed">
                  Try widening your price range, lowering the trust threshold, or searching across all cities.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-navy-900 text-white text-xs font-extrabold rounded-full hover:bg-navy-800 transition-colors cursor-pointer shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Load More */}
            {visibleCount < filteredListings.length && (
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                  className="px-8 py-3 bg-cream-50 hover:bg-cream-200 border border-navy-900/15 rounded-full text-xs font-extrabold text-navy-900 shadow-sm transition-all cursor-pointer hover:shadow-md"
                >
                  Load More Verified Properties ({filteredListings.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Compare Banner */}
      {comparedListings.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-navy-900 text-white px-5 py-3 rounded-full shadow-2xl border border-orange-500/40 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>Comparing <strong className="text-orange-400">{comparedListings.length}</strong> of 4 properties</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setComparisonModalOpen(true)}
              className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-full shadow-orange-glow transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                store.clearComparison();
                setComparedListings([]);
              }}
              className="p-1.5 hover:bg-navy-800 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Clear Comparison"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals & Dialogs */}
      {selectedTrustListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
          <div className="bg-cream-50 w-full max-w-xl rounded-3xl p-6 border border-navy-900/10 shadow-trust relative">
            <button
              onClick={() => setSelectedTrustListing(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
            >
              ✕
            </button>
            <TrustScoreChart trustScore={selectedTrustListing.trustScore} />
          </div>
        </div>
      )}

      {/* Property Comparison Modal */}
      {comparisonModalOpen && (
        <PropertyComparisonModal
          listings={comparedListings}
          onClose={() => setComparisonModalOpen(false)}
          onRemoveListing={(id) => {
            store.removeFromComparison(id);
            setComparedListings(store.getComparisonListings());
          }}
          onOpenListingDetail={onOpenListingDetail}
        />
      )}

      {/* Saved Searches Modal */}
      {savedSearchModalOpen && (
        <SavedSearchesModal
          isOpen={savedSearchModalOpen}
          onClose={() => setSavedSearchModalOpen(false)}
          onExecuteSearch={handleExecuteSavedSearch}
        />
      )}

      {/* Mobile Filters Bottom Sheet */}
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
    </div>
  );
};
