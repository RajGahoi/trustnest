import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowRight, X, TrendingUp, Sparkles, Building2, Car, Smartphone, Laptop } from 'lucide-react';
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
    '3 BHK Apartment Greater Noida',
    'BMW 5 Series M Sport',
    'iPhone 15 Pro Max Natural Titanium',
    'MacBook Pro M3 Max BKC',
    'Handcrafted Teak Dining Set',
    'Fullstack AI Architect'
  ];

  // City list is derived from real listing data (store.getCitiesWithCounts), not hard-coded,
  // so every city offered here is guaranteed to have live inventory behind it.
  const cityCounts = store.getCitiesWithCounts();
  const categories = store.getCategories();

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onExecuteSearch(query, selectedCategory === 'all' ? undefined : selectedCategory, selectedCity === 'All Cities' ? undefined : selectedCity);
    setIsFocused(false);
    if (onCloseModal) onCloseModal();
  };

  // Keyboard navigation & Escape key close listener
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
            placeholder="Search verified properties, cars, mobiles, jobs..."
            className="w-full text-navy-900 font-medium placeholder:text-navy-700/50 focus:outline-none text-base"
            aria-label="Search input"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-navy-700 hover:text-navy-900" aria-label="Clear Search">
              <X className="w-4 h-4" />
            </button>
          )}
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

        {/* Category Selector */}
        <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-navy-900/10 px-3 py-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-bold text-navy-900 focus:outline-none cursor-pointer pr-4 uppercase tracking-wider"
            aria-label="Select Category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
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

      {/* Expanded Suggestions Panel */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl border border-navy-900/15 shadow-2xl p-6 z-50 animate-fadeIn space-y-6">
          {/* Quick Categories */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Quick Verified Categories
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { slug: 'property', name: 'Real Estate', icon: Building2 },
                { slug: 'vehicles', name: 'Vehicles', icon: Car },
                { slug: 'mobiles', name: 'Mobiles', icon: Smartphone },
                { slug: 'electronics', name: 'Electronics', icon: Laptop },
              ].map(cat => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      onExecuteSearch(query, cat.slug, selectedCity === 'All Cities' ? undefined : selectedCity);
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
              Trending Verified Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    onExecuteSearch(term, selectedCategory === 'all' ? undefined : selectedCategory);
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
