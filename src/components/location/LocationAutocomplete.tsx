import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Clock, X, ChevronRight } from 'lucide-react';
import { CITY_HIERARCHY } from '../../mock/locations';

interface LocationAutocompleteProps {
  selectedCity: string;
  selectedLocality?: string;
  onSelectLocation: (city: string, locality?: string) => void;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  selectedCity,
  selectedLocality,
  onSelectLocation,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentLocations, setRecentLocations] = useState<Array<{ city: string; locality?: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trustnest_recent_locations');
      if (saved) {
        setRecentLocations(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveRecent = (city: string, locality?: string) => {
    const updated = [{ city, locality }, ...recentLocations.filter(r => !(r.city === city && r.locality === locality))].slice(0, 5);
    setRecentLocations(updated);
    try {
      localStorage.setItem('trustnest_recent_locations', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearRecent = () => {
    setRecentLocations([]);
    try {
      localStorage.removeItem('trustnest_recent_locations');
    } catch (e) {}
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered recommendations
  const matchedLocations = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    const results: Array<{ city: string; locality?: string; state: string }> = [];

    for (const item of CITY_HIERARCHY) {
      if (item.city.toLowerCase().includes(term)) {
        results.push({ city: item.city, state: item.state });
      }
      for (const loc of item.localities) {
        if (loc.toLowerCase().includes(term)) {
          results.push({ city: item.city, locality: loc, state: item.state });
        }
      }
    }
    return results.slice(0, 8);
  }, [searchTerm]);

  const handlePick = (city: string, locality?: string) => {
    onSelectLocation(city, locality);
    saveRecent(city, locality);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button / Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-cream-50 hover:bg-cream-200 border border-navy-900/15 rounded-2xl text-xs font-bold text-navy-900 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <span className="truncate">
            {selectedLocality ? `${selectedLocality}, ${selectedCity}` : (selectedCity || 'All Cities')}
          </span>
        </div>
        <ChevronRight className={`w-3.5 h-3.5 text-navy-700 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cream-50 rounded-2xl border border-navy-900/15 shadow-2xl p-4 z-50 text-navy-900 min-w-[300px] animate-in fade-in duration-150">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Type city, locality, or PIN code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Results */}
          {searchTerm.trim() ? (
            <div className="space-y-1 max-h-56 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase text-gray-400 px-2 py-1">Matching Locations</div>
              {matchedLocations.length > 0 ? (
                matchedLocations.map((loc, idx) => (
                  <button
                    key={`${loc.city}-${loc.locality || 'all'}-${idx}`}
                    type="button"
                    onClick={() => handlePick(loc.city, loc.locality)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-cream-200 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{loc.locality ? `${loc.locality}, ${loc.city}` : loc.city}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{loc.state}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-500">
                  No exact match. Try city name (e.g. Noida, Bengaluru, Gurugram)
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Recent Locations */}
              {recentLocations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-[10px] text-orange-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentLocations.map((rec, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePick(rec.city, rec.locality)}
                        className="w-full flex items-center gap-2 p-1.5 px-2 rounded-lg text-left hover:bg-cream-200 text-xs text-navy-800 cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{rec.locality ? `${rec.locality}, ${rec.city}` : rec.city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cities */}
              <div>
                <div className="text-[10px] font-bold uppercase text-gray-400 px-2 mb-1.5">
                  Popular Indian Metro Cities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['All Cities', 'Noida', 'Greater Noida', 'Gurugram', 'Delhi NCR', 'Bengaluru', 'Mumbai'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handlePick(c === 'All Cities' ? 'All Cities' : c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCity === c
                          ? 'bg-navy-900 text-white'
                          : 'bg-white border border-navy-900/10 hover:bg-cream-200 text-navy-900'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
