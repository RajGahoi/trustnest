import React from 'react';
import { SlidersHorizontal, RotateCcw, ShieldCheck, X, MapPin } from 'lucide-react';
import { store } from '../../mock/store';

export interface FilterState {
  categorySlug: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  minTrustScore: number;
  sellerType: string;
  sortBy: string;
  dynamicAttrs: Record<string, string>;
}

interface FilterPanelProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  resultsCount: number;
  isMobileSheet?: boolean;
  onCloseMobileSheet?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  resultsCount,
  isMobileSheet = false,
  onCloseMobileSheet
}) => {
  const categories = store.getCategories();
  const selectedCategoryObj = store.getCategoryBySlug(filters.categorySlug);

  const handleDynamicAttrChange = (key: string, value: string) => {
    const updated = { ...filters.dynamicAttrs };
    if (value) {
      updated[key] = value;
    } else {
      delete updated[key];
    }
    onChangeFilters({ ...filters, dynamicAttrs: updated });
  };

  const content = (
    <div className="bg-cream-50 rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-6 text-navy-900">
      <div className="flex items-center justify-between pb-4 border-b border-navy-900/10">
        <div className="flex items-center gap-2 font-extrabold text-lg text-navy-900">
          <SlidersHorizontal className="w-5 h-5 text-orange-500" />
          <span>Filters & Facets</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-navy-700 hover:text-orange-500 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          {isMobileSheet && onCloseMobileSheet && (
            <button type="button" onClick={onCloseMobileSheet} className="p-1 text-navy-900 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* City Facet — derived from real listing data, always kept in sync with the search bar's city selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          City
        </label>
        <select
          value={filters.city}
          onChange={e => onChangeFilters({ ...filters, city: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="All Cities">All Cities</option>
          {store.getCitiesWithCounts().map(c => (
            <option key={c.city} value={c.city}>{c.city} ({c.count})</option>
          ))}
        </select>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
          Marketplace Category
        </label>
        <select
          value={filters.categorySlug}
          onChange={e => onChangeFilters({ ...filters, categorySlug: e.target.value, dynamicAttrs: {} })}
          className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories (Unified Search)</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Trust Threshold Filter */}
      <div className="p-4 bg-navy-900 text-cream-50 rounded-2xl border border-orange-500/30">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="flex items-center gap-1.5 text-amber-soft">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            Minimum Trust Rating
          </span>
          <span className="text-orange-500 font-mono text-sm font-extrabold">
            {filters.minTrustScore}+ / 100
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="95"
          step="5"
          value={filters.minTrustScore}
          onChange={e => onChangeFilters({ ...filters, minTrustScore: Number(e.target.value) })}
          className="w-full accent-orange-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-300 mt-1">
          <span>0 (All)</span>
          <span>80 (Gold)</span>
          <span>90+ (Platinum)</span>
        </div>
      </div>

      {/* Dynamic Category Attributes */}
      {selectedCategoryObj && selectedCategoryObj.attributes.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-navy-900/10">
          <label className="block text-xs font-bold uppercase tracking-wider text-navy-900">
            {selectedCategoryObj.name} Specifications
          </label>

          {selectedCategoryObj.attributes.filter(a => a.filterable).map(attr => (
            <div key={attr.id}>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                {attr.label}
              </label>

              {attr.type === 'enum' && attr.options ? (
                <select
                  value={filters.dynamicAttrs[attr.key] || ''}
                  onChange={e => handleDynamicAttrChange(attr.key, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any {attr.label}</option>
                  {attr.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={`Filter by ${attr.label}`}
                  value={filters.dynamicAttrs[attr.key] || ''}
                  onChange={e => handleDynamicAttrChange(attr.key, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Seller Type Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
          Seller Verification Status
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          {[
            { id: 'ALL', label: 'All Sellers' },
            { id: 'OWNER', label: 'Direct Owner' },
            { id: 'BUILDER', label: 'Verified Builder' },
            { id: 'DEALER', label: 'Certified Dealer' },
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => onChangeFilters({ ...filters, sellerType: type.id })}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                filters.sellerType === type.id
                  ? 'bg-navy-900 text-white font-bold border-orange-500 shadow-sm'
                  : 'bg-white border-navy-900/10 text-navy-900 hover:border-navy-900/30'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
          Sort Marketplace By
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onChangeFilters({ ...filters, sortBy: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="trust-desc">Trust Rating (High to Low)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="newest">Newest Verified First</option>
        </select>
      </div>

      {/* Mobile Sticky Submit */}
      {isMobileSheet && (
        <button
          type="button"
          onClick={onCloseMobileSheet}
          className="w-full py-3.5 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow cursor-pointer"
        >
          Show {resultsCount} Verified Results
        </button>
      )}
    </div>
  );

  if (isMobileSheet) {
    return (
      <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-cream-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-2 animate-slideUp">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
