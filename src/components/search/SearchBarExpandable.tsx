import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowRight, X, TrendingUp, Sparkles, Building2, Layers } from 'lucide-react';
import { store } from '../../mock/store';

interface SearchBarExpandableProps {
  onExecuteSearch: (query: string, category?: string, city?: string) => void;
  isExpandedModal?: boolean;
  onCloseModal?: () => void;
  currentQuery?: string;
  currentCategory?: string;
  currentCity?: string;
}

export const SearchBarExpandable: React.FC<SearchBarExpandableProps> = ({
  onExecuteSearch,
  isExpandedModal = false,
  onCloseModal,
  currentQuery = '',
  currentCategory = 'all',
  currentCity = 'All Cities'
}) => {
  const [query, setQuery] = useState(currentQuery);
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [activeIntentTab, setActiveIntentTab] = useState<'ALL' | 'BUY' | 'COMMERCIAL' | 'PLOTS'>('ALL');
  const [selectedPropType, setSelectedPropType] = useState<string>('ALL');
  const [selectedRoadWidth, setSelectedRoadWidth] = useState<string>('ALL');
  const [isFocused, setIsFocused] = useState(isExpandedModal);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  useEffect(() => {
    setSelectedCity(currentCity);
  }, [currentCity]);

  const popularSearches = [
    'Corporate Office Cyber City Gurugram',
    '12 Bigha Fertile Land Jewar Airport',
    'Industrial Plot 100ft Road Ecotech Greater Noida',
    '5 Acres Organic Farm Land Sohna',
    '300 Sq.Yd Corner Plot DLF Alameda',
    '3 BHK Lakeview Apartment Whitefield'
  ];

  const cityCounts = store.getCitiesWithCounts();

  const handleIntentTabChange = (tab: 'ALL' | 'BUY' | 'COMMERCIAL' | 'PLOTS') => {
    setActiveIntentTab(tab);
    if (tab === 'COMMERCIAL') {
      setSelectedCategory('property');
      setQuery('Commercial Office Space');
    } else if (tab === 'PLOTS') {
      setSelectedCategory('property');
      setQuery('Land Plot');
    } else if (tab === 'BUY') {
      setSelectedCategory('property');
      setQuery('');
    } else {
      setSelectedCategory('all');
      setQuery('');
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let effectiveQuery = query;
    if (selectedPropType !== 'ALL' && !effectiveQuery.includes(selectedPropType)) {
      effectiveQuery = effectiveQuery ? `${effectiveQuery} ${selectedPropType}` : selectedPropType;
    }
    if (selectedRoadWidth !== 'ALL' && !effectiveQuery.includes(selectedRoadWidth)) {
      effectiveQuery = effectiveQuery ? `${effectiveQuery} ${selectedRoadWidth}` : selectedRoadWidth;
    }

    onExecuteSearch(
      effectiveQuery, 
      selectedCategory === 'all' ? undefined : selectedCategory, 
      selectedCity === 'All Cities' ? undefined : selectedCity
    );
    setIsFocused(false);
    if (onCloseModal) onCloseModal();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isFocused || isExpandedModal)) {
        setIsFocused(false);
        if (onCloseModal) onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, isExpandedModal, onCloseModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && !isExpandedModal) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpandedModal]);

  const content = (
    <div ref={containerRef} className="w-full relative z-30">
      {/* MagicBricks / 99acres Segmented Intent Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-navy-900/10 w-fit shadow-xs overflow-x-auto max-w-full">
        {[
          { id: 'ALL', label: 'All Marketplace', icon: '✨' },
          { id: 'BUY', label: 'Buy Residential', icon: '🏡' },
          { id: 'COMMERCIAL', label: 'Commercial & Offices', icon: '🏢' },
          { id: 'PLOTS', label: 'Plots, Agri & Industrial Land', icon: '🌾' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleIntentTabChange(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIntentTab === tab.id
                ? 'bg-navy-900 text-cream-50 shadow-sm'
                : 'text-navy-700 hover:text-navy-900 hover:bg-cream-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Search Bar Card */}
      <form
        onSubmit={handleSearchSubmit}
        className={`bg-white rounded-3xl border border-navy-900/15 shadow-trust transition-all duration-300 p-2 sm:p-3 flex flex-col md:flex-row items-center gap-2 ${
          isFocused ? 'ring-4 ring-orange-500/20 border-orange-500 shadow-xl' : 'hover:border-navy-900/30'
        }`}
        role="search"
      >
        {/* Input Query */}
        <div className="flex items-center gap-3 px-3 py-2 w-full md:flex-1">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={
              activeIntentTab === 'COMMERCIAL'
                ? 'Search office space, IT park, business floor, BKC, CyberCity...'
                : activeIntentTab === 'PLOTS'
                ? 'Search agricultural land, industrial plot, 60+ ft wide road...'
                : activeIntentTab === 'BUY'
                ? 'Search flats, villas, 3 BHK, Greater Noida, Gurugram...'
                : 'Search verified properties, offices, farm lands, cars...'
            }
            className="w-full text-navy-900 font-medium placeholder:text-navy-700/50 focus:outline-none text-sm sm:text-base"
            aria-label="Search input"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-navy-700 hover:text-navy-900" aria-label="Clear Search">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Property Type Dropdown (MagicBricks Style) */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-navy-900/10 px-3 py-2 w-full md:w-auto">
          <Layers className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedPropType}
            onChange={e => setSelectedPropType(e.target.value)}
            className="bg-transparent text-xs font-bold text-navy-900 focus:outline-none cursor-pointer pr-4"
            aria-label="Select Property Type"
          >
            <option value="ALL">All Property Types</option>
            <option value="Commercial Office Space">Commercial Office</option>
            <option value="Agricultural Land">Agricultural Land</option>
            <option value="Industrial Land">Industrial Land / Plot</option>
            <option value="Residential Plot">Residential Plot</option>
            <option value="Apartment">Apartment / Flat</option>
            <option value="Villa">Luxury Villa</option>
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-navy-900/10 px-3 py-2 w-full md:w-auto">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="bg-transparent text-xs font-bold text-navy-900 focus:outline-none cursor-pointer pr-4"
            aria-label="Select Location City"
          >
            <option value="All Cities">All Cities</option>
            {cityCounts.map(c => (
              <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
            ))}
          </select>
        </div>

        {/* Road Width Filter */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-navy-900/10 px-3 py-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedRoadWidth}
            onChange={e => setSelectedRoadWidth(e.target.value)}
            className="bg-transparent text-xs font-bold text-navy-900 focus:outline-none cursor-pointer pr-4"
            aria-label="Filter Road Width"
          >
            <option value="ALL">Any Road Width</option>
            <option value="40 ft">40+ ft Road</option>
            <option value="60 ft">60+ ft Main Road</option>
            <option value="80 ft">80+ ft Industrial Corridor</option>
            <option value="100 ft">100+ ft Sector Road</option>
          </select>
        </div>

        {/* Search CTA */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>

      {/* MagicBricks / 99acres Quick Filter Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { label: '🏢 Office Space', q: 'Commercial Office Space' },
          { label: '🌾 Agricultural Land', q: 'Agricultural Land' },
          { label: '🏭 Industrial Land & Plots', q: 'Industrial Land' },
          { label: '🏡 Residential Plots', q: 'Residential Plot' },
          { label: '🛣️ 60+ ft Wide Road', q: '60 ft' },
          { label: '🔑 Ready to Move', q: 'Ready to Move' }
        ].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(chip.q);
              onExecuteSearch(chip.q, 'property', selectedCity === 'All Cities' ? undefined : selectedCity);
            }}
            className="px-3 py-1.5 bg-white/95 hover:bg-orange-500 hover:text-white text-navy-800 rounded-full font-bold border border-navy-900/10 shadow-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Expanded Suggestions Panel */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl border border-navy-900/15 shadow-2xl p-6 z-50 animate-fadeIn space-y-6">
          {/* Quick Real Estate Categories */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Quick Verified Real Estate & Land Explorer
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Commercial Offices', q: 'Commercial Office', icon: Building2 },
                { name: 'Agricultural Land', q: 'Agricultural Land', icon: Sparkles },
                { name: 'Industrial Plots', q: 'Industrial Land', icon: Layers },
                { name: 'Residential Plots', q: 'Residential Plot', icon: Building2 },
              ].map(cat => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setQuery(cat.q);
                      onExecuteSearch(cat.q, 'property', selectedCity === 'All Cities' ? undefined : selectedCity);
                      setIsFocused(false);
                    }}
                    className="p-3 rounded-2xl bg-cream-100 hover:bg-orange-500 hover:text-white text-navy-900 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-navy-900/5"
                  >
                    <IconComp className="w-4 h-4 text-orange-500 group-hover:text-white" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Searches */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              Popular Verified Property Inquiries
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    onExecuteSearch(term, 'property');
                    setIsFocused(false);
                  }}
                  className="px-3.5 py-2 bg-cream-50 hover:bg-cream-200 border border-navy-900/10 rounded-full text-xs font-semibold text-navy-900 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isExpandedModal) {
    return (
      <div
        className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-start pt-16"
        role="dialog"
        aria-modal="true"
        aria-label="Search Overlay Modal"
      >
        <div className="max-w-3xl mx-auto w-full relative">
          <button
            type="button"
            onClick={onCloseModal}
            className="absolute -top-12 right-0 text-white font-bold flex items-center gap-1 text-sm cursor-pointer hover:text-orange-500 transition-colors"
          >
            <span>Close</span>
            <X className="w-5 h-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
