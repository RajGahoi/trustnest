import React, { useState } from 'react';
import { Heart, MapPin, CheckCircle, ArrowUpRight, Share2 } from 'lucide-react';
import type { Listing } from '../../types';
import { TrustBadge } from '../trust/TrustBadge';
import { store } from '../../mock/store';

interface ListingCardProps {
  listing: Listing;
  onOpenListing: (listing: Listing) => void;
  onOpenTrustModal?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenListing,
  onOpenTrustModal
}) => {
  const [isFav, setIsFav] = useState(store.isFavorite(listing.id));

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = store.toggleFavorite(listing.id);
    setIsFav(updated);
  };

  const getAttrPills = () => {
    const attrs = listing.attributes || {};
    const pills: string[] = [];

    if (attrs.bhk) pills.push(attrs.bhk);
    if (attrs.propertyType) pills.push(attrs.propertyType);
    if (attrs.area) pills.push(`${attrs.area} sq.ft`);
    if (attrs.brand) pills.push(attrs.brand);
    if (attrs.year) pills.push(`${attrs.year}`);
    if (attrs.kmDriven) pills.push(`${attrs.kmDriven.toLocaleString()} km`);
    if (attrs.storage) pills.push(attrs.storage);
    if (attrs.condition) pills.push(attrs.condition);
    if (attrs.roleType) pills.push(attrs.roleType);
    if (attrs.experience) pills.push(attrs.experience);

    return pills.slice(0, 3);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-navy-900/10 overflow-hidden card-hover-lift flex flex-col justify-between group relative"
    >
      <a 
        href={`#listing/${listing.id}`} 
        onClick={(e) => {
          e.preventDefault();
          onOpenListing(listing);
        }}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${listing.title}`}
      />

      {/* Featured / Boost Badge */}
      {listing.isFeatured && (
        <div className="absolute top-3 left-3 z-10 bg-navy-900 text-amber-soft text-xs font-semibold px-2.5 py-1 rounded-full shadow-md border border-orange-500/40">
          Featured
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleFav}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-navy-900 hover:text-orange-500 hover:bg-white hover:scale-110 transition-all shadow-sm cursor-pointer"
          aria-label="Save Favorite"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-orange-500 text-orange-500' : ''}`} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(`${window.location.origin}/#listing/${listing.id}`);
            alert('Link copied to clipboard!');
          }}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-navy-900 hover:text-orange-500 hover:bg-white hover:scale-110 transition-all shadow-sm cursor-pointer"
          aria-label="Share Listing"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-cream-200 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-80" />

        {/* Trust Badge Floating */}
        <div className="absolute bottom-3 left-3 z-10">
          <TrustBadge
            trustScore={listing.trustScore}
            size="sm"
            onClick={onOpenTrustModal ? () => onOpenTrustModal(listing) : undefined}
          />
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 right-3 z-10 text-[11px] font-semibold text-white/90 bg-navy-900/80 backdrop-blur-md px-2 py-0.5 rounded-md">
          {listing.categoryName}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="font-display text-2xl font-semibold text-navy-900">
              {listing.formattedPrice}
            </span>
            {listing.pricePeriod && (
              <span className="text-xs text-navy-700 font-medium">{listing.pricePeriod}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-navy-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors mb-2">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-navy-700 mb-3">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{listing.location.locality}, {listing.location.city}</span>
          </div>

          {/* Dynamic Attribute Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {getAttrPills().map((pill, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-cream-100 text-navy-800 px-2 py-0.5 rounded-md border border-navy-900/5"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Seller Footer */}
        <div className="pt-3 border-t border-navy-900/5 flex items-center justify-between text-xs text-navy-700">
          <div className="flex items-center gap-2 truncate">
            <img
              src={listing.sellerAvatar}
              alt={listing.sellerName}
              className="w-5 h-5 rounded-full object-cover border border-navy-900/10"
            />
            <span className="truncate font-medium">{listing.sellerName}</span>
            {listing.sellerVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-trust-green shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-0.5 text-orange-500 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
