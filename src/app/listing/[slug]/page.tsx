import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin, Share2, Heart, ArrowLeft, CheckCircle2, MessageSquare, Phone, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Listing } from '../../../types';
import { TrustBadge } from '../../../components/trust/TrustBadge';
import { TrustScoreChart } from '../../../components/trust/TrustScoreChart';
import { SellerCard } from '../../../components/listing/SellerCard';
import { FraudScanPanel } from '../../../components/trust/FraudScanPanel';
import { ListingCard } from '../../../components/listing/ListingCard';
import { store } from '../../../mock/store';

interface ListingDetailPageProps {
  listing: Listing;
  onBack: () => void;
  onOpenListingDetail: (listing: Listing) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listing,
  onBack,
  onOpenListingDetail
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(store.isFavorite(listing.id));
  const [copiedLink, setCopiedLink] = useState(false);

  const similarListings = store
    .getPublishedListings()
    .filter(l => l.id !== listing.id && l.categorySlug === listing.categorySlug)
    .sort((a, b) => {
      const cityA = a.location.city === listing.location.city ? 0 : 1;
      const cityB = b.location.city === listing.location.city ? 0 : 1;
      if (cityA !== cityB) return cityA - cityB;
      return Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price);
    })
    .slice(0, 3);

  const handleFav = () => {
    const updated = store.toggleFavorite(listing.id);
    setIsFav(updated);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back Button & Top Action Cluster */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (onBack) onBack();
            window.history.back();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50 border border-navy-900/10 rounded-full font-bold text-xs text-navy-900 hover:bg-cream-200 active:bg-cream-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 bg-cream-50 border border-navy-900/10 rounded-full text-navy-900 hover:text-orange-500 active:scale-95 transition-all cursor-pointer relative"
            title="Share Listing"
            aria-label="Share Listing"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && (
              <span className="absolute -bottom-8 right-0 bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Link Copied!
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleFav}
            className="p-2.5 bg-cream-50 border border-navy-900/10 rounded-full text-navy-900 hover:text-orange-500 active:scale-95 transition-all cursor-pointer"
            title="Favorite"
            aria-label={isFav ? "Remove Favorite" : "Add Favorite"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-orange-500 text-orange-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 1. CINEMATIC GALLERY & MAIN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery Lightbox & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Large Image */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-cream-200 rounded-3xl overflow-hidden border border-navy-900/10 shadow-trust">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={selectedImgIndex}
                  src={listing.images[selectedImgIndex] || listing.images[0]}
                  alt={listing.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              <div className="absolute top-4 left-4 z-10">
                <TrustBadge trustScore={listing.trustScore} size="lg" />
              </div>

              {listing.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedImgIndex(prev => prev === 0 ? listing.images.length - 1 : prev - 1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-navy-900 shadow-md cursor-pointer transition-all active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedImgIndex(prev => prev === listing.images.length - 1 ? 0 : prev + 1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-navy-900 shadow-md cursor-pointer transition-all active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 z-10 bg-navy-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono font-bold">
                {selectedImgIndex + 1} / {listing.images.length} Photos
              </div>
            </div>

            {/* Image Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {listing.images.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedImgIndex(i)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImgIndex === i ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100 active:scale-95'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Location & Price */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-navy-900 text-amber-soft font-semibold text-xs rounded-full">
                {listing.categoryName}
              </span>
              <span className="px-3 py-1 bg-trust-green/10 text-trust-green font-bold text-[11px] rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active Status
              </span>
            </div>

            <h1 className="display-section text-navy-900">
              {listing.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-navy-700">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="font-semibold">{listing.location.address}, {listing.location.locality}, {listing.location.city}</span>
            </div>

            <div className="pt-4 border-t border-navy-900/10 flex items-baseline justify-between">
              <div>
                <span className="font-display text-4xl sm:text-5xl font-semibold text-navy-900">
                  {listing.formattedPrice}
                </span>
                {listing.pricePeriod && (
                  <span className="text-sm font-semibold text-navy-700 ml-1">{listing.pricePeriod}</span>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Specifications Matrix */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Key Specifications & Attributes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {Object.entries(listing.attributes).map(([k, v]) => (
                <div key={k} className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-xs font-semibold text-navy-700 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-sm font-extrabold text-navy-900 mt-0.5">{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-3">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
              Detailed Description
            </h3>
            <p className="text-sm text-navy-800 leading-relaxed whitespace-pre-line font-medium">
              {listing.description}
            </p>
          </div>

          {/* 2. TRUST AUDIT BREAKDOWN */}
          <TrustScoreChart trustScore={listing.trustScore} />

          {/* 3. AI MEDIA & FRAUD SCANNER */}
          <FraudScanPanel fraudSignals={listing.fraudSignals} />

          {/* Verified Documents Checklist */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-trust-green" />
              Verified Document Attachments
            </h3>

            <div className="space-y-3">
              {listing.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-navy-900/10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-trust-green shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-navy-900">{doc.name}</div>
                      <div className="text-xs text-navy-700">Uploaded & Audited on {doc.uploadedAt}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-trust-green/10 text-trust-green font-extrabold text-xs uppercase tracking-wider rounded-full">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Seller Card */}
        <div id="seller-card" className="lg:col-span-4 sticky top-28 space-y-6">
          <SellerCard listing={listing} />

          {/* Location GPS Card */}
          <div className="bg-cream-50 rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-3">
            <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Verified Location GPS
            </h4>
            <div className="aspect-[16/9] bg-navy-900 rounded-2xl overflow-hidden relative flex items-center justify-center text-white">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#F79A00_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-center p-4 relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 mx-auto bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mb-2 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold">{listing.location.locality}</div>
                <div className="text-[10px] text-gray-300 font-mono mt-0.5 mb-3">GPS: {listing.location.lat}, {listing.location.lng}</div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${listing.location.lat},${listing.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-navy-900 text-xs font-bold rounded-full hover:bg-cream-100 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <MapPin className="w-3 h-3" />
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Verified Listings */}
      {similarListings.length > 0 && (
        <div className="pt-8 border-t border-navy-900/10 space-y-6">
          <h3 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Similar Verified Listings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarListings.map(sim => (
              <ListingCard
                key={sim.id}
                listing={sim}
                onOpenListing={onOpenListingDetail}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Footer */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-cream-50/95 backdrop-blur-md border-t border-navy-900/10 p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-xs font-bold text-navy-900">{listing.formattedPrice}</div>
          <div className="text-[10px] text-navy-700 truncate">{listing.title}</div>
        </div>

        <a
          href={`tel:${listing.sellerPhone}`}
          className="p-3 bg-navy-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-navy-800 active:bg-navy-950 transition-colors"
        >
          <Phone className="w-4 h-4 text-orange-500" />
          <span>Call</span>
        </a>

        <button
          type="button"
          onClick={() => {
            document.getElementById('seller-card')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-4 py-3 bg-orange-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md hover:bg-orange-600 active:bg-orange-700 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat Now</span>
        </button>
      </div>
    </div>
  );
};
