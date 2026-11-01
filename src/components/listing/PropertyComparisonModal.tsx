import React from 'react';
import { X, Check, ShieldCheck, ArrowRight, Trash2, Building2 } from 'lucide-react';
import type { Listing } from '../../types';
import { formatINR } from '../../domain/india/currency';
import { formatAreaWithUnit } from '../../domain/india/area';

interface PropertyComparisonModalProps {
  listings: Listing[];
  onClose: () => void;
  onRemoveListing: (id: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  listings,
  onClose,
  onRemoveListing,
  onOpenListingDetail
}) => {
  if (listings.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-6xl rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-2xl relative max-h-[92vh] flex flex-col text-navy-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-900/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-orange-500 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Verified Property Comparison
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mt-0.5">
              Side-by-Side Property Comparison ({listings.length}/4)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto mt-4 pr-1">
          <table className="w-full min-w-[700px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-navy-900/10">
                <th className="p-3 text-left w-44 font-bold text-gray-500 bg-cream-100/50 sticky left-0">
                  Feature
                </th>
                {listings.map(l => (
                  <th key={l.id} className="p-3 text-left w-64 align-top">
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => onRemoveListing(l.id)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 rounded-full transition-colors cursor-pointer shadow"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={l.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                        alt={l.title}
                        className="w-full h-32 rounded-xl object-cover mb-2 border border-navy-900/10"
                      />
                      <h4 className="font-extrabold text-sm text-navy-900 line-clamp-2">{l.title}</h4>
                      <p className="text-[11px] text-navy-700 font-medium">{l.location.locality}, {l.location.city}</p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenListingDetail(l);
                        }}
                        className="mt-2 w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-900/10 font-medium">
              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Price</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3 font-extrabold text-base text-navy-900">
                    {l.formattedPrice}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Trust Score</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-trust-green/15 text-trust-green border border-trust-green/30 rounded-full font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{l.trustScore.overallScore}/100 ({l.trustScore.tier})</span>
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Super Built-up Area</td>
                {listings.map(l => {
                  const areaVal = l.propertyDetails?.areaSqFt || l.attributes.area || 1200;
                  return (
                    <td key={l.id} className="p-3 font-semibold">
                      {formatAreaWithUnit(areaVal, 'sqft')}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Price per Sq. Ft.</td>
                {listings.map(l => {
                  const areaVal = l.propertyDetails?.areaSqFt || l.attributes.area || 1200;
                  const rate = Math.round(l.price / Math.max(areaVal, 1));
                  return (
                    <td key={l.id} className="p-3 font-bold text-orange-600">
                      {formatINR(rate)} / sq ft
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">BHK / Configuration</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3 font-bold text-navy-900">
                    {l.attributes.bhk || l.propertyDetails?.bhk || '3 BHK'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Ownership Type</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3">
                    <span className="px-2 py-0.5 bg-navy-900 text-cream-50 rounded-md text-[10px] font-bold">
                      {l.propertyDetails?.ownershipType || 'FREEHOLD'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">RERA Status</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3">
                    {l.propertyDetails?.reraId ? (
                      <span className="text-trust-green font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Registered ({l.propertyDetails.reraId})</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Individual Resale / Direct Title</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Furnishing</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3">
                    {l.attributes.furnishing || 'Semi-Furnished'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-navy-900 bg-cream-100/50 sticky left-0">Seller Verified</td>
                {listings.map(l => (
                  <td key={l.id} className="p-3 font-semibold">
                    {l.sellerName} ({l.sellerType})
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
