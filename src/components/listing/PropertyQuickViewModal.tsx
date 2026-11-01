import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, CheckCircle, ShieldCheck, Phone, Check, ArrowRight, Layers, FileText, ExternalLink, Video, Download } from 'lucide-react';
import type { Listing } from '../../types';
import { TrustBadge } from '../trust/TrustBadge';
import { formatINR } from '../../domain/india/currency';
import { store } from '../../mock/store';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { LivePropertyDemoModal } from './LivePropertyDemoModal';
import { DownloadBrochureModal } from '../brochure/DownloadBrochureModal';

interface PropertyQuickViewModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscriptionModal?: () => void;
  onNavigateToFullListing?: (slugOrId: string) => void;
}

export const PropertyQuickViewModal: React.FC<PropertyQuickViewModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenSubscriptionModal,
  onNavigateToFullListing
}) => {
  const { t } = useLanguage();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [revealsRemaining, setRevealsRemaining] = useState(store.getContactRevealsRemaining());
  const [liveDemoModalOpen, setLiveDemoModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  useEffect(() => {
    setCurrentImgIndex(0);
    setPhoneRevealed(false);
    setRevealsRemaining(store.getContactRevealsRemaining());
  }, [listing]);

  useEffect(() => {
    const handleStorage = () => {
      setRevealsRemaining(store.getContactRevealsRemaining());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!isOpen || !listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleRevealPhone = () => {
    const left = store.getContactRevealsRemaining();
    if (left <= 0) {
      if (onOpenSubscriptionModal) onOpenSubscriptionModal();
      return;
    }
    const ok = store.decrementContactReveal();
    if (ok) {
      setPhoneRevealed(true);
      setRevealsRemaining(store.getContactRevealsRemaining());
      window.dispatchEvent(new Event('storage'));
    }
  };

  const roadWidth = listing.attributes?.roadWidth || listing.propertyDetails?.roadWidth || '60 ft Main Sector Road';
  const zoning = listing.attributes?.zoning || 'Approved Commercial / Residential';
  const facing = listing.attributes?.facing || 'East Facing';
  const areaUnit = listing.attributes?.areaUnit || listing.propertyDetails?.displayAreaUnit || 'sq.ft';
  const areaVal = listing.attributes?.area || listing.propertyDetails?.displayArea || listing.propertyDetails?.areaSqFt || 'N/A';

  const amenities = [
    listing.attributes?.powerBackup || (listing.attributes?.powerCapacity ? `${listing.attributes.powerCapacity} 3-Phase Power` : '100% DG Power Backup'),
    listing.attributes?.waterSource || '24/7 Water Supply & Tubewell',
    'Wide Road Direct Highway / Sector Access',
    listing.attributes?.parking ? 'Reserved Private Parking' : 'Visitor & Loading Bay Parking',
    listing.propertyDetails?.reraId ? `RERA Approved (${listing.propertyDetails.reraId})` : 'Municipal Authority Approved Layout',
    'Gated Compound with 24/7 CCTV & Security'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-navy-900/10 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-navy-900/10 flex items-center justify-between bg-cream-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-navy-900 text-orange-400 font-extrabold text-xs rounded-xl uppercase tracking-wider">
              {listing.attributes?.propertyType || listing.categoryName}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-navy-700">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>{listing.location.locality}, {listing.location.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToFullListing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullListing(listing.slug || listing.id);
                }}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
                <span>{t('fullPageView')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-cream-200/80 hover:bg-cream-300 text-navy-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* 1. Image Carousel & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-navy-950 shadow-md">
              <img
                src={images[currentImgIndex]}
                alt={`${listing.title} view ${currentImgIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* 🎥 Live Walkthrough Demo Button */}
              <button
                type="button"
                onClick={() => setLiveDemoModalOpen(true)}
                className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
                title="Watch Live Room-by-Room Walkthrough Demo"
              >
                <Video className="w-3.5 h-3.5 animate-pulse" />
                <span>🎥 Live Room-by-Room Demo</span>
              </button>

              {/* Prev / Next buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/80 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/80 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer"
                    aria-label="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter Badge */}
              <div className="absolute bottom-3 right-3 bg-navy-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {t('photoOf')} {currentImgIndex + 1} {t('of')} {images.length}
              </div>

              {/* Trust Badge Overlay */}
              <div className="absolute bottom-3 left-3">
                <TrustBadge trustScore={listing.trustScore} size="sm" />
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentImgIndex === idx ? 'border-orange-500 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Key Specifications Banner */}
          <div className="bg-cream-100/80 border border-navy-900/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-navy-900">
                  {listing.formattedPrice}
                </span>
                {listing.propertyDetails?.pricePerSqFt && (
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    {formatINR(listing.propertyDetails.pricePerSqFt)} / sq.ft
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-navy-900 mt-1 leading-snug">
                {listing.title}
              </h1>
              <p className="text-xs text-navy-700 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {listing.location.address}, {listing.location.locality}, {listing.location.city} - {listing.location.pincode}
              </p>
            </div>

            {/* Road Width Highlight Badge */}
            <div className="bg-navy-900 text-white p-3.5 rounded-2xl flex items-center gap-3 shadow-md shrink-0">
              <span className="text-2xl">🛣️</span>
              <div>
                <p className="text-[10px] text-cream-200 uppercase tracking-widest font-extrabold">{t('roadAccessTitle')}</p>
                <p className="text-sm font-bold text-amber-soft">{roadWidth}</p>
              </div>
            </div>
          </div>

          {/* 3. Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-navy-900/10">
              <p className="text-[10px] text-navy-600 uppercase font-extrabold">{t('areaExtent')}</p>
              <p className="text-sm font-bold text-navy-900 mt-0.5">{areaVal} {areaUnit}</p>
            </div>
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-navy-900/10">
              <p className="text-[10px] text-navy-600 uppercase font-extrabold">{t('landZoning')}</p>
              <p className="text-sm font-bold text-navy-900 mt-0.5 truncate">{zoning}</p>
            </div>
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-navy-900/10">
              <p className="text-[10px] text-navy-600 uppercase font-extrabold">{t('roadFrontage')}</p>
              <p className="text-sm font-bold text-orange-600 mt-0.5">{roadWidth}</p>
            </div>
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-navy-900/10">
              <p className="text-[10px] text-navy-600 uppercase font-extrabold">{t('facing')}</p>
              <p className="text-sm font-bold text-navy-900 mt-0.5">{facing}</p>
            </div>
          </div>

          {/* 4. Full Description */}
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-orange-500" />
              {t('descTitle')}
            </h2>
            <p className="text-sm text-navy-800 leading-relaxed bg-cream-50/50 p-4 rounded-2xl border border-navy-900/5 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* 5. Amenities & Facilities Checklist */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              {t('amenitiesTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-navy-900/10 text-xs font-semibold text-navy-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Seller Contact Card & Phone Reveal Gate */}
          <div className="bg-navy-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-trust">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <img
                src={listing.sellerAvatar}
                alt={listing.sellerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-cream-50">{listing.sellerName}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-cream-300">
                  {listing.sellerType} • Rating: {listing.sellerRating}/5.0 • KYC Verified
                </p>
              </div>
            </div>

            {/* Protected Contact Button */}
            <div className="w-full sm:w-auto shrink-0 flex flex-col items-center sm:items-end gap-1.5">
              {phoneRevealed ? (
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/20 border border-emerald-400 rounded-xl">
                  <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="font-mono font-bold text-base text-white tracking-wide">
                    {listing.sellerPhone}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRevealPhone}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    revealsRemaining <= 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-navy-950'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-glow'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    {revealsRemaining <= 0
                      ? t('limitReachedSubscribe')
                      : `+91 ${listing.sellerPhone.slice(4, 7)} •••••• [${t('clickToReveal')}]`}
                  </span>
                  {revealsRemaining > 0 && (
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-sans">
                      {revealsRemaining} {t('revealsLeft')}
                    </span>
                  )}
                </button>
              )}

              {/* Download Brochure (PDF) Button */}
              <button
                type="button"
                onClick={() => setBrochureModalOpen(true)}
                className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-red-50 text-[#D92228] border-2 border-[#D92228] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                title="Download Official PDF Factsheet & RERA Blueprint"
              >
                <Download className="w-4 h-4" />
                <span>Download Brochure (PDF)</span>
              </button>

              <p className="text-[10px] text-cream-400">
                {revealsRemaining > 0
                  ? `${revealsRemaining} ${t('freeQuotaHint')}`
                  : t('quotaExhaustedHint')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-cream-100/90 border-t border-navy-900/10 flex items-center justify-between text-xs text-navy-700 shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('riskEngineTag')}
          </span>

          {onNavigateToFullListing && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToFullListing(listing.slug || listing.id);
              }}
              className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('viewFullListingBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Live Apartment / House 360° Walkthrough Demo Modal */}
      <LivePropertyDemoModal
        listing={listing}
        isOpen={liveDemoModalOpen}
        onClose={() => setLiveDemoModalOpen(false)}
        onOpenSubscriptionModal={onOpenSubscriptionModal}
      />

      {/* Official Property PDF Factsheet & Brochure Modal */}
      <DownloadBrochureModal
        listing={listing}
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />
    </div>
  );
};
