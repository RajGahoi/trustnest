import React, { useState } from 'react';
import { Heart, MapPin, CheckCircle, ArrowUpRight, Share2, Layers, Check } from 'lucide-react';
import type { Listing } from '../../types';
import { TrustBadge } from '../trust/TrustBadge';
import { store } from '../../mock/store';
import { formatINR } from '../../domain/india/currency';

interface ListingCardProps {
  listing: Listing;
  onOpenListing: (listing: Listing) => void;
  onOpenTrustModal?: (listing: Listing) => void;
  onToggleCompare?: (listing: Listing) => void;
  isCompared?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenListing,
  onOpenTrustModal,
  onToggleCompare,
  isCompared = false
}) => {
  const [isFav, setIsFav] = useState(store.isFavorite(listing.id));
  const [shareToast, setShareToast] = useState(false);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = store.toggleFavorite(listing.id);
    setIsFav(updated);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `${listing.title} - Verified on TrustNest for ${listing.formattedPrice}`,
        url: window.location.href.split('#')[0] + `#listing/${listing.id}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href.split('#')[0] + `#listing/${listing.id}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(listing);
    } else {
      if (isCompared) {
        store.removeFromComparison(listing.id);
      } else {
        store.addToComparison(listing.id);
      }
    }
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

  const areaSqFt = listing.propertyDetails?.areaSqFt || listing.attributes.area;
  const pricePerSqFt = areaSqFt && areaSqFt > 0 ? Math.round(listing.price / areaSqFt) : null;
  const isRera = Boolean(listing.propertyDetails?.reraId || listing.propertyDetails?.reraApproved);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden card-hover-lift flex flex-col justify-between group relative transition-all ${
        isCompared ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-navy-900/10'
      }`}
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
        <div className="absolute top-3 left-3 z-10 bg-navy-900 text-amber-soft text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-orange-500/40">
          Featured
        </div>
      )}

      {/* Actions Cluster */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleFav}
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-navy-900 hover:text-orange-500 hover:scale-110 transition-all shadow-sm cursor-pointer"
          aria-label="Save Favorite"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-orange-500 text-orange-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-navy-900 hover:text-orange-500 hover:scale-110 transition-all shadow-sm cursor-pointer relative"
          aria-label="Share Listing"
        >
          <Share2 className="w-3.5 h-3.5" />
          {shareToast && (
            <span className="absolute -left-20 top-1 bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Copied!
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleCompareClick}
          className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isCompared
              ? 'bg-orange-500 text-white ring-2 ring-white'
              : 'bg-white/95 text-navy-900 hover:text-orange-500 hover:scale-110'
          }`}
          title={isCompared ? 'Remove from Comparison' : 'Compare Property'}
          aria-label="Compare Property"
        >
          {isCompared ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
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

        {/* Category & RERA Tags */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          {isRera && (
            <span className="text-[10px] font-extrabold text-white bg-trust-green px-2 py-0.5 rounded-md shadow">
              RERA
            </span>
          )}
          <span className="text-[11px] font-semibold text-white/90 bg-navy-900/80 backdrop-blur-md px-2 py-0.5 rounded-md">
            {listing.categoryName}
          </span>
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
            {pricePerSqFt && (
              <span className="text-[11px] text-orange-600 font-bold">
                {formatINR(pricePerSqFt)}/sq ft
              </span>
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
            {(listing.attributes.roadWidth || listing.propertyDetails?.roadWidth) && (
              <span className="text-[10px] font-bold bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-md border border-orange-500/20">
                🛣️ {listing.attributes.roadWidth || listing.propertyDetails?.roadWidth}
              </span>
            )}
            {listing.propertyDetails?.ownershipType && (
              <span className="text-[10px] font-bold bg-navy-900 text-white px-2 py-0.5 rounded-md">
                {listing.propertyDetails.ownershipType}
              </span>
            )}
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
