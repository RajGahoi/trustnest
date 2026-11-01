import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowRight, X, TrendingUp, Sparkles, Building2, Layers, Mic } from 'lucide-react';
import { store } from '../../mock/store';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { VoiceSearchModal } from './VoiceSearchModal';

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
  const { t } = useLanguage();
  const [query, setQuery] = useState(currentQuery);
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [activeIntentTab, setActiveIntentTab] = useState<'ALL' | 'BUY' | 'COMMERCIAL' | 'PLOTS'>('ALL');
  const [selectedPropType, setSelectedPropType] = useState<string>('ALL');
  const [selectedRoadWidth, setSelectedRoadWidth] = useState<string>('ALL');
  const [isFocused, setIsFocused] = useState(isExpandedModal);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

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
          { id: 'ALL', label: t('tabAll'), icon: '✨' },
          { id: 'BUY', label: t('tabBuy'), icon: '🏡' },
          { id: 'COMMERCIAL', label: t('tabCommercial'), icon: '🏢' },
          { id: 'PLOTS', label: t('tabPlots'), icon: '🌾' },
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
                ? t('searchPlaceholderCommercial')
                : activeIntentTab === 'PLOTS'
                ? t('searchPlaceholderPlots')
                : activeIntentTab === 'BUY'
                ? t('searchPlaceholderBuy')
                : t('searchPlaceholderAll')
            }
            className="w-full text-navy-900 font-medium placeholder:text-navy-700/50 focus:outline-none text-sm sm:text-base"
            aria-label="Search input"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-navy-700 hover:text-navy-900" aria-label="Clear Search">
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            title="Search by Voice"
            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-[#D92228] border border-red-200/50 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Search by Voice"
          >
            <Mic className="w-4 h-4 stroke-[2.2]" />
          </button>
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
            <option value="ALL">{t('allPropertyTypes')}</option>
            <option value="Commercial Office Space">{t('typeCommercialOffice')}</option>
            <option value="Agricultural Land">{t('typeAgriLand')}</option>
            <option value="Industrial Land">{t('typeIndustrialLand')}</option>
            <option value="Residential Plot">{t('typeResidentialPlot')}</option>
            <option value="Apartment">{t('typeApartment')}</option>
            <option value="Villa">{t('typeVilla')}</option>
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
            <option value="All Cities">{t('allCities')}</option>
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
            <option value="ALL">{t('anyRoadWidth')}</option>
            <option value="40 ft">{t('road40')}</option>
            <option value="60 ft">{t('road60')}</option>
            <option value="80 ft">{t('road80')}</option>
            <option value="100 ft">{t('road100')}</option>
          </select>
        </div>

        {/* Search CTA */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>{t('btnSearch')}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>

      {/* MagicBricks / 99acres Quick Filter Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { label: t('pillOffice'), q: 'Commercial Office Space' },
          { label: t('pillAgri'), q: 'Agricultural Land' },
          { label: t('pillIndustrial'), q: 'Industrial Land' },
          { label: t('pillPlots'), q: 'Residential Plot' },
          { label: t('pillRoad60'), q: '60 ft' },
          { label: t('pillRoad100'), q: '100 ft' },
          { label: t('pillRera'), q: 'RERA' }
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

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptComplete={(transcriptText) => {
          setQuery(transcriptText);
          onExecuteSearch(
            transcriptText,
            selectedCategory === 'all' ? undefined : selectedCategory,
            selectedCity === 'All Cities' ? undefined : selectedCity
          );
          if (onCloseModal) onCloseModal();
        }}
      />
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
