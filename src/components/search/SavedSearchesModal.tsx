import React, { useState } from 'react';
import { X, Bookmark, Bell, Trash2, ArrowRight } from 'lucide-react';
import type { SavedSearch } from '../../types';
import { store } from '../../mock/store';

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteSearch: (search: SavedSearch) => void;
}

export const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  onExecuteSearch
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(store.getSavedSearches());

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    store.deleteSavedSearch(id);
    setSavedSearches(store.getSavedSearches());
  };

  const handleUpdateFrequency = (id: string, frequency: SavedSearch['alertFrequency']) => {
    store.updateSavedSearchFrequency(id, frequency);
    setSavedSearches(store.getSavedSearches());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-navy-900/15 shadow-2xl relative max-h-[90vh] flex flex-col text-navy-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4" />
          Saved Searches & Market Alerts
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-2">
          Your Saved Criteria ({savedSearches.length})
        </h3>
        <p className="text-xs text-navy-700 mb-4">
          Receive automated email and in-app alerts whenever new verified listings match your parameters.
        </p>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedSearches.length > 0 ? (
            savedSearches.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-navy-900/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-navy-900">{item.name}</h4>
                  <p className="text-navy-700 mt-0.5">
                    {item.city} · {item.category}
                    {item.maxPrice ? ` · Up to ₹${(item.maxPrice / 100000).toFixed(0)} Lakh` : ''}
                    {item.bhk ? ` · ${item.bhk}` : ''}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
                      <Bell className="w-3 h-3 text-orange-500" /> Alert:
                    </span>
                    <select
                      value={item.alertFrequency}
                      onChange={e => handleUpdateFrequency(item.id, e.target.value as any)}
                      className="px-2 py-0.5 bg-cream-50 border border-navy-900/15 rounded text-[11px] font-bold text-navy-900"
                    >
                      <option value="INSTANT">Instant Alert</option>
                      <option value="DAILY">Daily Digest</option>
                      <option value="WEEKLY">Weekly Summary</option>
                      <option value="OFF">Alerts Off</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExecuteSearch(item);
                    }}
                    className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Run Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete saved search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-gray-500">
              No saved searches yet. Click "Save This Search" on the Explore Marketplace page to store your filters!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
