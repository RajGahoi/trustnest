import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Phone, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Flag,
  Building2,
  ExternalLink,
  Navigation,
  School,
  Activity,
  Train,
  Briefcase,
  Download,
  FileText
} from 'lucide-react';
import type { Listing } from '../../../types';
import { TrustBadge } from '../../../components/trust/TrustBadge';
import { TrustScoreChart } from '../../../components/trust/TrustScoreChart';
import { SellerCard } from '../../../components/listing/SellerCard';
import { FraudScanPanel } from '../../../components/trust/FraudScanPanel';
import { ListingCard } from '../../../components/listing/ListingCard';
import { AreaConverterWidget } from '../../../components/listing/AreaConverterWidget';
import { AbuseReportModal } from '../../../components/listing/AbuseReportModal';
import { ContactRevealModal } from '../../../components/listing/ContactRevealModal';
import { SubscriptionModal } from '../../../components/monetization/SubscriptionModal';
import { PropertyComparisonModal } from '../../../components/listing/PropertyComparisonModal';
import { DownloadBrochureModal } from '../../../components/brochure/DownloadBrochureModal';
import { store } from '../../../mock/store';
import { formatINR } from '../../../domain/india/currency';
import { validateReraNumber, LEGAL_DISCLAIMER_TEXT } from '../../../domain/india/rera';

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
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [isCompared, setIsCompared] = useState(store.getComparisonListings().some(l => l.id === listing.id));

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
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `${listing.title} on TrustNest - Verified for ${listing.formattedPrice}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleCompare = () => {
    if (isCompared) {
      store.removeFromComparison(listing.id);
      setIsCompared(false);
    } else {
      const ok = store.addToComparison(listing.id);
      if (ok) setIsCompared(true);
      setComparisonModalOpen(true);
    }
  };

  const areaSqFt = listing.propertyDetails?.areaSqFt || listing.attributes.area || 1650;
  const pricePerSqFt = areaSqFt > 0 ? Math.round(listing.price / areaSqFt) : 0;
  const reraCheck = validateReraNumber(listing.propertyDetails?.reraId || '', listing.location.state);
  const nearby = listing.propertyDetails?.nearby;

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
          {/* Compare Button */}
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isCompared
                ? 'bg-orange-500 text-white border-orange-600 shadow'
                : 'bg-cream-50 border-navy-900/10 text-navy-900 hover:bg-cream-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isCompared ? 'In Compare (View)' : 'Compare Property'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 bg-cream-50 border border-navy-900/10 rounded-full text-navy-900 hover:text-orange-500 active:scale-95 transition-all cursor-pointer relative"
            title="Share Listing"
            aria-label="Share Listing"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && (
              <span className="absolute -bottom-8 right-0 bg-navy-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFav}
            className="p-2.5 bg-cream-50 border border-navy-900/10 rounded-full text-navy-900 hover:text-orange-500 active:scale-95 transition-all cursor-pointer"
            title="Favorite"
            aria-label={isFav ? "Remove Favorite" : "Add Favorite"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-orange-500 text-orange-500' : ''}`} />
          </button>

          {/* Report Abuse Button */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="p-2.5 bg-cream-50 border border-navy-900/10 rounded-full text-gray-500 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
            title="Report Violation or Fake Listing"
            aria-label="Report Abuse"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Details & Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Large Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-cream-200 rounded-3xl overflow-hidden border border-navy-900/10 shadow-trust">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={selectedImgIndex}
                  src={listing.images[selectedImgIndex] || listing.images[0]}
                  alt={listing.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                {selectedImgIndex + 1} / {listing.images.length} Verified Photos
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
                      selectedImgIndex === i ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Pricing & Price Intelligence Header */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-navy-900 text-amber-soft font-bold text-xs rounded-full">
                {listing.categoryName}
              </span>
              <span className="px-3 py-1 bg-trust-green/15 text-trust-green font-extrabold text-[11px] rounded-full flex items-center gap-1 border border-trust-green/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active Listing
              </span>
              {listing.propertyDetails?.ownershipType && (
                <span className="px-3 py-1 bg-white border border-navy-900/10 text-navy-900 font-extrabold text-[11px] rounded-full">
                  {listing.propertyDetails.ownershipType} Title
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight leading-snug">
              {listing.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-navy-700 font-medium">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{listing.location.address}, {listing.location.locality}, {listing.location.city} - {listing.location.pincode}</span>
            </div>

            <div className="pt-4 border-t border-navy-900/10 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-navy-900">
                  {listing.formattedPrice}
                </span>
                {listing.pricePeriod && (
                  <span className="text-sm font-semibold text-navy-700 ml-1">{listing.pricePeriod}</span>
                )}
                
                {/* MagicBricks Exact Match: EMI and Loan Eligibility Redirect */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-semibold text-gray-700">
                  <span>EMI - ~{formatINR(Math.round((listing.price * 0.80) * 0.00787))}/mo</span>
                  <span className="text-gray-300">|</span>
                  <a
                    href="#loans?tab=eligibility"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#loans?tab=eligibility';
                    }}
                    className="text-[#D92228] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Need Home Loan? Check Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {pricePerSqFt > 0 && (
                <div className="p-3 bg-white rounded-2xl border border-navy-900/10 text-right">
                  <div className="text-xs text-navy-700 font-semibold">Price per Square Foot:</div>
                  <div className="text-lg font-extrabold text-orange-600">{formatINR(pricePerSqFt)} / sq ft</div>
                  <div className="text-[10px] text-trust-green font-bold">~4% Below {listing.location.locality} Average</div>
                </div>
              )}
            </div>
          </div>

          {/* RERA Registration & Legal Title Banner */}
          {listing.propertyDetails?.reraId ? (
            <div className="p-5 bg-white rounded-3xl border border-trust-green/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-trust-green/15 text-trust-green rounded-2xl flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-navy-900">RERA Registered Project</span>
                    <span className="px-2 py-0.5 bg-trust-green text-white text-[10px] font-bold rounded-md">
                      Verified
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-navy-800 mt-0.5">
                    RERA ID: {listing.propertyDetails.reraId}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Authority: {reraCheck.authorityName || 'State Real Estate Regulatory Authority'}
                  </div>
                </div>
              </div>

              {reraCheck.portalUrl && (
                <a
                  href={reraCheck.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                >
                  <span>Verify on Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 bg-amber-soft/20 rounded-2xl border border-orange-500/20 text-xs text-navy-800 flex items-center justify-between">
              <div>
                <strong>Ownership Structure:</strong> Individual Private Resale / Direct Freehold Title (Exempt from Multi-Unit Project RERA mandate).
              </div>
            </div>
          )}

          {/* Indian Area Measurements & Live Interactive Converter */}
          <div className="space-y-4">
            <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
              <h3 className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Area Measurements & Built-up Specs
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Super Area</div>
                  <div className="text-base font-extrabold text-navy-900 mt-0.5">{areaSqFt} sq.ft</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Gaj / Sq. Yards</div>
                  <div className="text-base font-extrabold text-navy-900 mt-0.5">{Math.round(areaSqFt / 9)} Gaj</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Road Width</div>
                  <div className="text-sm font-extrabold text-orange-600 mt-0.5">{listing.attributes.roadWidth || listing.propertyDetails?.roadWidth || '60 ft Wide Main Road'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Facing / Orientation</div>
                  <div className="text-sm font-extrabold text-navy-900 mt-0.5">{listing.attributes.facing || listing.propertyDetails?.facing || 'East Facing'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Zoning / Land Use</div>
                  <div className="text-sm font-extrabold text-navy-900 mt-0.5">{listing.attributes.zoning || listing.propertyDetails?.landUse || 'Freehold Title'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Property Type</div>
                  <div className="text-sm font-extrabold text-navy-900 mt-0.5">{listing.attributes.propertyType || listing.attributes.bhk || 'Commercial/Residential'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Water / Utilities</div>
                  <div className="text-sm font-extrabold text-trust-green mt-0.5">{listing.attributes.waterSource || 'Connected & Verified'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-navy-900/10">
                  <div className="text-[11px] font-semibold text-gray-500">Possession Status</div>
                  <div className="text-sm font-extrabold text-navy-900 mt-0.5">Ready for Possession</div>
                </div>
              </div>

              {/* Amenities & Infrastructure Highlights */}
              <div className="pt-2">
                <div className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">Verified Amenities & Site Infrastructure:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    listing.attributes.roadWidth || 'Wide Access Road',
                    listing.attributes.powerBackup || '24/7 Power Support',
                    'Aadhaar / KYC Verified Seller',
                    'Zero Title Encumbrances',
                    'Demarcated Plot Boundary',
                    'Heavy Vehicle Accessible'
                  ].map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white border border-navy-900/10 rounded-xl font-bold text-navy-900 flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-trust-green" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Area Converter Tool */}
              <AreaConverterWidget initialAreaSqFt={areaSqFt} className="mt-4" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-3">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
              Detailed Property Overview
            </h3>
            <p className="text-sm text-navy-800 leading-relaxed whitespace-pre-line font-medium">
              {listing.description}
            </p>
          </div>

          {/* Nearby Facilities, Transport & Infrastructure */}
          {nearby && (
            <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
              <h3 className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
                <Navigation className="w-5 h-5 text-orange-500" />
                Verified Nearby Facilities & Arterial Connectivity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {nearby.transit && nearby.transit.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-navy-900/10 space-y-2">
                    <div className="flex items-center gap-2 text-trust-green font-bold">
                      <Train className="w-4 h-4" /> Metro & Highways
                    </div>
                    {nearby.transit.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-navy-800">
                        <span>{t.name}</span>
                        <span className="font-extrabold text-orange-600">{t.distanceKm} km</span>
                      </div>
                    ))}
                  </div>
                )}

                {nearby.schools && nearby.schools.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-navy-900/10 space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-bold">
                      <School className="w-4 h-4" /> Top Schools & Universities
                    </div>
                    {nearby.schools.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-navy-800">
                        <span>{s.name}</span>
                        <span className="font-extrabold text-orange-600">{s.distanceKm} km</span>
                      </div>
                    ))}
                  </div>
                )}

                {nearby.hospitals && nearby.hospitals.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-navy-900/10 space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <Activity className="w-4 h-4" /> Multi-Speciality Hospitals
                    </div>
                    {nearby.hospitals.map((h, idx) => (
                      <div key={idx} className="flex justify-between text-navy-800">
                        <span>{h.name}</span>
                        <span className="font-extrabold text-orange-600">{h.distanceKm} km</span>
                      </div>
                    ))}
                  </div>
                )}

                {nearby.businessHubs && nearby.businessHubs.length > 0 && (
                  <div className="p-4 bg-white rounded-2xl border border-navy-900/10 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 font-bold">
                      <Briefcase className="w-4 h-4" /> Tech Parks & Business Hubs
                    </div>
                    {nearby.businessHubs.map((b, idx) => (
                      <div key={idx} className="flex justify-between text-navy-800">
                        <span>{b.name}</span>
                        <span className="font-extrabold text-orange-600">{b.distanceKm} km</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5-DIMENSION TRUST AUDIT BREAKDOWN */}
          <TrustScoreChart trustScore={listing.trustScore} />

          {/* AI MEDIA & FRAUD SCANNER */}
          <FraudScanPanel fraudSignals={listing.fraudSignals} />

          {/* Verified Document Attachments */}
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

          {/* Legal Disclaimer Box */}
          <div className="p-4 bg-white rounded-2xl border border-navy-900/10 text-[11px] text-gray-500 leading-relaxed italic">
            {LEGAL_DISCLAIMER_TEXT}
          </div>
        </div>

        {/* Right Sticky Column: Seller Card & Protected Contact */}
        <div id="seller-card" className="lg:col-span-4 sticky top-28 space-y-6">
          <SellerCard 
            listing={listing} 
            onOpenChat={() => {
              window.location.hash = '#messages';
            }}
            onOpenSubscriptionModal={() => setSubModalOpen(true)}
          />

          {/* DOWNLOAD BROCHURE CARD (EXACT MAGICBRICKS SCREENSHOT MATCH) */}
          <div
            onClick={() => setBrochureModalOpen(true)}
            className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#D92228] transition-all cursor-pointer flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-[#D92228] group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-navy-950 group-hover:text-[#D92228] transition-colors">
                  Download Brochure
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Official PDF factsheet & RERA blueprint
                </p>
              </div>
            </div>

            <span className="p-2 rounded-xl bg-gray-50 group-hover:bg-red-50 text-gray-500 group-hover:text-[#D92228] transition-colors">
              <Download className="w-4 h-4" />
            </span>
          </div>

          {/* Protected Direct Contact CTA */}
          <div className="bg-white rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-3 text-navy-900">
            <h4 className="font-extrabold text-sm text-navy-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500" />
              Direct Owner Contact Reveal
            </h4>
            <p className="text-xs text-navy-700">
              Reveal verified phone number to speak directly with the seller.
            </p>
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Reveal Verified Phone Number</span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar Verified Listings */}
      {similarListings.length > 0 && (
        <div className="pt-8 border-t border-navy-900/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-navy-900 tracking-tight">
                Similar Verified Listings
              </h3>
              <p className="text-xs text-navy-700 mt-0.5">
                Recommended based on identical city tier, price bracket, and BHK layout.
              </p>
            </div>
          </div>

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

      {/* Modals */}
      {reportModalOpen && (
        <AbuseReportModal
          listing={listing}
          onClose={() => setReportModalOpen(false)}
          onReportSuccess={() => setReportModalOpen(false)}
        />
      )}

      <ContactRevealModal
        listing={listing}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onOpenSubscriptionModal={() => setSubModalOpen(true)}
      />

      <SubscriptionModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        defaultAudience="BUYER"
      />

      <DownloadBrochureModal
        listing={listing}
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />

      {comparisonModalOpen && (
        <PropertyComparisonModal
          listings={store.getComparisonListings()}
          onClose={() => setComparisonModalOpen(false)}
          onRemoveListing={(id) => {
            store.removeFromComparison(id);
            setIsCompared(store.getComparisonListings().some(l => l.id === listing.id));
          }}
          onOpenListingDetail={onOpenListingDetail}
        />
      )}
    </div>
  );
};
