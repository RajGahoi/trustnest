import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle, ArrowUpRight, Share2, Layers, Check, Phone, Eye, Video } from 'lucide-react';
import type { Listing } from '../../types';
import { TrustBadge } from '../trust/TrustBadge';
import { store } from '../../mock/store';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { LivePropertyDemoModal } from './LivePropertyDemoModal';

interface ListingCardProps {
  listing: Listing;
  onOpenListing: (listing: Listing) => void;
  onOpenTrustModal?: (listing: Listing) => void;
  onToggleCompare?: (listing: Listing) => void;
  isCompared?: boolean;
  onQuickView?: (listing: Listing) => void;
  onOpenSubscriptionModal?: () => void;
  layout?: 'grid' | 'horizontal' | 'magicbricks';
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenListing,
  onOpenTrustModal,
  onToggleCompare,
  isCompared = false,
  onQuickView,
  onOpenSubscriptionModal,
  layout = 'grid'
}) => {
  const { t } = useLanguage();
  const [isFav, setIsFav] = useState(store.isFavorite(listing.id));
  const [shareToast, setShareToast] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [revealsRemaining, setRevealsRemaining] = useState(store.getContactRevealsRemaining());
  const [liveDemoOpen, setLiveDemoOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const handleStorage = () => {
      setRevealsRemaining(store.getContactRevealsRemaining());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const handleRevealPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const left = store.getContactRevealsRemaining();
    if (left <= 0) {
      if (onOpenSubscriptionModal) {
        onOpenSubscriptionModal();
      }
      return;
    }
    const ok = store.decrementContactReveal();
    if (ok) {
      setPhoneRevealed(true);
      setRevealsRemaining(store.getContactRevealsRemaining());
      window.dispatchEvent(new Event('storage'));
    }
  };

  const getAttrPills = () => {
    const attrs = listing.attributes || {};
    const pills: string[] = [];

    if (attrs.propertyType) pills.push(attrs.propertyType);
    if (attrs.area) pills.push(`${attrs.area} ${attrs.areaUnit || 'sqft'}`);
    if (attrs.bhk) pills.push(attrs.bhk);
    if (attrs.furnishing) pills.push(attrs.furnishing);
    if (attrs.zoning) pills.push(attrs.zoning);

    return pills.slice(0, 3);
  };

  const isRera = Boolean(listing.propertyDetails?.reraId || listing.propertyDetails?.reraApproved);
  const roadWidth = listing.attributes.roadWidth || listing.propertyDetails?.roadWidth;

  // ========================================================
  // MAGICBRICKS HORIZONTAL LISTING CARD (EXACT SCREENSHOT MATCH)
  // ========================================================
  if (layout === 'horizontal' || layout === 'magicbricks') {
    return (
      <div
        className={`bg-white rounded-2xl border ${
          isCompared ? 'border-[#D92228] ring-2 ring-red-100' : 'border-gray-200'
        } shadow-xs hover:shadow-lg transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row gap-5 relative group text-left`}
      >
        {/* Left Side: Photo with Carousel & Badges */}
        <div className="w-full md:w-[280px] lg:w-[310px] shrink-0 relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <img
            src={listing.images[currentImageIdx] || listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => onOpenListing(listing)}
          />

          {/* 6+ Photos Badge */}
          <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
            {listing.images.length > 1 ? `${listing.images.length}+ Photos` : 'Photo'}
          </div>

          {/* Verification Badge */}
          <div className="absolute top-2.5 right-2.5">
            <TrustBadge trustScore={listing.trustScore} size="sm" onClick={onOpenTrustModal ? () => onOpenTrustModal(listing) : undefined} />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Pagination Dots */}
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {listing.images.slice(0, 6).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIdx(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentImageIdx ? 'bg-white scale-125' : 'bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Posted Ago */}
          <div className="absolute bottom-2 left-2.5 text-[10px] text-gray-200 font-medium z-10">
            Posted: {listing.attributes?.postedAgo || '4 hours ago'}
          </div>

          {/* Live Demo Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiveDemoOpen(true);
            }}
            className="absolute bottom-2 right-2.5 z-10 text-[10px] bg-red-600 hover:bg-red-700 text-white font-extrabold px-2 py-0.5 rounded flex items-center gap-1 shadow cursor-pointer"
          >
            <Video className="w-3 h-3" />
            <span>360° Live</span>
          </button>
        </div>

        {/* Right Side: Listing Details */}
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Header row: Title & Price & Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <a
                  href={`#listing/${listing.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenListing(listing);
                  }}
                  className="font-display text-base sm:text-lg font-bold text-gray-900 hover:text-[#D92228] transition-colors line-clamp-1 cursor-pointer"
                >
                  {listing.title}
                </a>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  {listing.attributes?.society || listing.location.locality}
                </p>
              </div>

              {/* Price & Rate (Exact match: ₹ 36 Lac / ₹ 1,565 per sqft) */}
              <div className="text-right shrink-0">
                <p className="font-display text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {listing.formattedPrice}
                </p>
                <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                  {listing.attributes?.pricePerSqft || `₹ ${Math.round(listing.price / (Number(listing.attributes?.area) || 1200))} per sqft`}
                </p>
              </div>

              {/* Actions: Fav, Share */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleFav}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                  title="Save favorite"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600 text-red-600' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors cursor-pointer relative"
                  title="Share property"
                >
                  <Share2 className="w-4 h-4" />
                  {shareToast && (
                    <span className="absolute -left-16 top-1 bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-20">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 6-Grid Attributes Box (Exact match to MagicBricks screenshot) */}
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2 p-3 bg-gray-50/90 rounded-xl border border-gray-200/80 text-left">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">SUPER AREA</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {listing.attributes?.area || 2300} {listing.attributes?.areaUnit || 'sqft'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">STATUS</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {listing.attributes?.status || 'Ready to Move'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">FLOOR</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {listing.attributes?.floor || '2 out of 3'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">TRANSACTION</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {listing.attributes?.transaction || 'Resale'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">FURNISHING</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                  {listing.attributes?.furnishing || 'Semi-Furnished'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">SOCIETY</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5 truncate">
                  {listing.attributes?.society || listing.location.locality}
                </p>
              </div>
            </div>

            {/* Description excerpt with read more */}
            <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Action Buttons & Owner Footer (Exact match to screenshot) */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
            <div className="text-xs text-gray-600 font-medium">
              <span>{listing.attributes?.postedBy || `Owner: ${listing.sellerName}`}</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* White button with red outline: Get Phone No. */}
              <button
                type="button"
                onClick={handleRevealPhone}
                className="px-4 py-2 rounded-xl border-2 border-[#D92228] text-[#D92228] hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                {phoneRevealed ? (
                  <span className="font-mono">{listing.sellerPhone}</span>
                ) : (
                  <span>Get Phone No.</span>
                )}
              </button>

              {/* Red solid button: Contact Owner */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenListing(listing);
                }}
                className="px-5 py-2 rounded-xl bg-[#D92228] hover:bg-[#B7181D] text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer"
              >
                Contact Owner
              </button>
            </div>
          </div>
        </div>

        {/* Live Demo Modal */}
        <LivePropertyDemoModal
          listing={listing}
          isOpen={liveDemoOpen}
          onClose={() => setLiveDemoOpen(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl border overflow-hidden card-hover-lift flex flex-col justify-between group relative transition-all shadow-xs hover:shadow-xl ${
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
        <div className="absolute top-3 left-3 z-10 bg-navy-900 text-amber-soft text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md border border-orange-500/40">
          {t('featured')}
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

      {/* Image Container (Exact 99acres card style) */}
      <div className="relative aspect-[16/10] bg-cream-200 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-80" />

        {/* 99acres Signature Price Pill on Image Bottom-Left (Exact match to screenshot) */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md text-navy-950 font-black text-sm px-2.5 py-1 rounded-xl shadow-md border border-gray-200">
          {listing.formattedPrice}
        </div>

        {/* Live Demo 360° Button on Image Bottom-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiveDemoOpen(true);
          }}
          className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md hover:scale-105 transition-all cursor-pointer"
          title="Interactive Live Demo of how apartment/house is"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Live Demo</span>
        </button>

        {/* Trust Score & Verification Badge Top-Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <TrustBadge
            trustScore={listing.trustScore}
            size="sm"
            onClick={onOpenTrustModal ? () => onOpenTrustModal(listing) : undefined}
          />
          {isRera && (
            <span className="text-[10px] font-extrabold text-white bg-trust-green px-2 py-0.5 rounded-md shadow">
              RERA
            </span>
          )}
        </div>

        {/* Photo count indicator */}
        {listing.images.length > 1 && (
          <div className="absolute top-10 left-3 z-10 bg-navy-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            📷 {listing.images.length} {t('photosCount')}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base font-extrabold text-navy-950 line-clamp-1 leading-snug group-hover:text-[#D92228] transition-colors mb-1">
            {listing.title}
          </h3>

          {/* Location: In cherantani park bansdroni, Kolkata */}
          <p className="text-xs text-navy-700 truncate mb-1">
            In <span className="font-extrabold text-navy-900">{listing.location.locality}</span>, {listing.location.city}
          </p>

          {/* Posted by Owner • 3 months ago */}
          <p className="text-[11px] font-semibold text-gray-500 mb-2.5">
            Posted by <span className="font-bold text-navy-800">{listing.attributes?.postedBy || (listing.sellerType === 'OWNER' ? 'Owner' : 'Builder')}</span> • {listing.attributes?.postedAgo || '3 months ago'}
          </p>

          {/* Dynamic Attribute Pills & Road Width */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {roadWidth && (
              <span className="text-[11px] font-extrabold bg-orange-500/10 text-orange-600 px-2.5 py-0.5 rounded-lg border border-orange-500/20">
                🛣️ {roadWidth}
              </span>
            )}
            {getAttrPills().map((pill, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-cream-100 text-navy-800 px-2 py-0.5 rounded-md border border-navy-900/5 truncate max-w-[140px]"
              >
                {pill}
              </span>
            ))}
            {listing.propertyDetails?.ownershipType && (
              <span className="text-[10px] font-bold bg-navy-900 text-white px-2 py-0.5 rounded-md">
                {listing.propertyDetails.ownershipType}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Actions & Seller Row */}
        <div className="pt-3 border-t border-navy-900/10 space-y-2.5 relative z-10">
          {/* Protected Seller Phone Reveal Button */}
          <div>
            {phoneRevealed ? (
              <div className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="font-mono font-bold text-navy-950 text-xs tracking-wider">
                    {listing.sellerPhone}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {t('verifiedSeller')}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRevealPhone}
                className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                  revealsRemaining <= 0
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-navy-900 hover:bg-orange-600 text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    {revealsRemaining <= 0
                      ? t('subscribeToViewPhone')
                      : `+91 ${listing.sellerPhone.slice(4, 7)} •••••• [${t('viewPhoneBtn')}]`}
                  </span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-sans">
                  {revealsRemaining > 0 ? `${revealsRemaining} ${t('revealsLeft')}` : t('paywall')}
                </span>
              </button>
            )}
          </div>

          {/* Quick View & Detail Buttons */}
          <div className="flex items-center justify-between text-xs text-navy-700 pt-1">
            <div className="flex items-center gap-2 truncate max-w-[150px]">
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

            <div className="flex items-center gap-3">
              {/* Live Demo Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLiveDemoOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                title="Watch Live Walkthrough Demo"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </button>

              {onQuickView && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(listing);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('photosAndSpecs')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenListing(listing);
                }}
                className="flex items-center gap-0.5 text-orange-600 font-bold hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <span>{t('fullView')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Apartment / House 360° Walkthrough Demo Modal */}
      <LivePropertyDemoModal
        listing={listing}
        isOpen={liveDemoOpen}
        onClose={() => setLiveDemoOpen(false)}
        onOpenSubscriptionModal={onOpenSubscriptionModal}
      />
    </div>
  );
};
