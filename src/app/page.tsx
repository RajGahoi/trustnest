import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Trees, Factory, Home, Building, Sparkles, Phone, ShieldCheck, UserCheck, KeyRound, Video } from 'lucide-react';
import { ListingCard } from '../components/listing/ListingCard';
import { TrustScoreChart } from '../components/trust/TrustScoreChart';
import { VerificationTimeline } from '../components/trust/VerificationTimeline';
import { FraudScanPanel } from '../components/trust/FraudScanPanel';
import { Reveal } from '../components/motion/Reveal';
import { VerificationDemo } from '../components/home/VerificationDemo';
import { PropertyQuickViewModal } from '../components/listing/PropertyQuickViewModal';
import { SubscriptionModal } from '../components/monetization/SubscriptionModal';
import { ProjectSpotlightCarousel } from '../components/home/ProjectSpotlightCarousel';
import { NinetyNineAcresBillboardHero } from '../components/home/NinetyNineAcresBillboardHero';
import { LivePropertyDemoModal } from '../components/listing/LivePropertyDemoModal';
import { store } from '../mock/store';
import { api } from '../services/api';
import { useLanguage } from '../domain/i18n/LanguageContext';
import type { Listing, UserRole } from '../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenListingDetail
}) => {
  const { language, t } = useLanguage();
  const [selectedTrustListing, setSelectedTrustListing] = useState<Listing | null>(null);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);
  const [liveDemoListing, setLiveDemoListing] = useState<Listing | null>(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [activePropertyTab, setActivePropertyTab] = useState<'ALL' | 'COMMERCIAL' | 'AGRICULTURAL' | 'INDUSTRIAL' | 'PLOTS' | 'RESIDENTIAL'>('ALL');
  const [revealsRemaining, setRevealsRemaining] = useState(store.getContactRevealsRemaining());
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const listings = store.getPublishedListings();
  const cityCounts = store.getCitiesWithCounts();
  const headlineLines = [t('heroLine1'), t('heroLine2')];

  useEffect(() => {
    const handleStorage = () => {
      setRevealsRemaining(store.getContactRevealsRemaining());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Quick 1-Click Persona Login
  const handleQuickLogin = async (role: UserRole, email: string) => {
    try {
      const res = await api.login(email, 'TrustNest@2026');
      store.setRole(role);
      setAuthSuccessMsg(`Logged in as ${res.user.name} (${role})`);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setAuthSuccessMsg(''), 3000);
    } catch {
      store.setRole(role);
      setAuthSuccessMsg(`Switched role to ${role}`);
      setTimeout(() => setAuthSuccessMsg(''), 3000);
    }
  };

  // Filter listings for the Real Estate showcase
  const displayedListings = listings.filter(l => {
    if (activePropertyTab === 'ALL') return true;
    const cat = (l.attributes?.propertyCategory || '').toUpperCase();
    const type = (l.attributes?.propertyType || '').toLowerCase();
    const zoning = (l.attributes?.zoning || '').toLowerCase();

    if (activePropertyTab === 'COMMERCIAL') {
      return cat.includes('COMMERCIAL') || type.includes('commercial') || type.includes('office') || zoning.includes('commerc');
    }
    if (activePropertyTab === 'AGRICULTURAL') {
      return cat.includes('AGRICULTURAL') || type.includes('agri') || type.includes('farm') || zoning.includes('agri');
    }
    if (activePropertyTab === 'INDUSTRIAL') {
      return cat.includes('INDUSTRIAL') || type.includes('indust') || zoning.includes('indust');
    }
    if (activePropertyTab === 'PLOTS') {
      return cat.includes('PLOT') || type.includes('plot') || type.includes('land');
    }
    if (activePropertyTab === 'RESIDENTIAL') {
      return cat.includes('RESIDENTIAL') || type.includes('villa') || type.includes('apartment') || type.includes('flat') || type.includes('penthouse');
    }
    return true;
  });

  const heroListing = listings.find(l => l.trustScore.overallScore >= 95) || listings[0];
  const avgTrust = Math.round(listings.reduce((s, l) => s + l.trustScore.overallScore, 0) / Math.max(listings.length, 1));

  // 6 Primary Real Estate Categories (replacing old classifieds)
  const REAL_ESTATE_CATEGORIES = [
    {
      id: 'cat-comm',
      title: t('catOfficeTitle'),
      subtitle: t('catOfficeSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('office')).length || 4,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      icon: Building2,
      tab: 'COMMERCIAL'
    },
    {
      id: 'cat-agri',
      title: t('catAgriTitle'),
      subtitle: t('catAgriSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('agri')).length || 4,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      icon: Trees,
      tab: 'AGRICULTURAL'
    },
    {
      id: 'cat-ind',
      title: t('catIndTitle'),
      subtitle: t('catIndSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('indust')).length || 4,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
      icon: Factory,
      tab: 'INDUSTRIAL'
    },
    {
      id: 'cat-plot',
      title: t('catPlotTitle'),
      subtitle: t('catPlotSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('plot')).length || 4,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      icon: Home,
      tab: 'PLOTS'
    },
    {
      id: 'cat-apt',
      title: t('catAptTitle'),
      subtitle: t('catAptSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('apartment')).length || 4,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      icon: Building,
      tab: 'RESIDENTIAL'
    },
    {
      id: 'cat-villa',
      title: t('catVillaTitle'),
      subtitle: t('catVillaSub'),
      count: listings.filter(l => (l.attributes?.propertyType || '').toLowerCase().includes('villa')).length || 4,
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
      icon: Sparkles,
      tab: 'RESIDENTIAL'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 0. PERSISTENT DEMO CREDENTIALS & QUOTA RIBBON */}
      <div className="pt-24 sm:pt-28 -mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 border border-orange-500/30 rounded-2xl p-3 sm:p-4 text-cream-50 shadow-trust flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              {t('demoRolesTitle')}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN', 'admin@trustnest.in')}
                className="px-2.5 py-1 bg-white/10 hover:bg-orange-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Log in as Administrator"
              >
                <KeyRound className="w-3 h-3 text-orange-400" />
                <span>{t('roleAdmin')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'buyer@trustnest.in')}
                className="px-2.5 py-1 bg-white/10 hover:bg-orange-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1"
                title="Log in as Buyer"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>{t('roleBuyer')}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authSuccessMsg && (
              <span className="text-emerald-400 font-bold animate-pulse">
                ✓ {authSuccessMsg}
              </span>
            )}

            {/* Live Contact Reveals Counter & Subscribe CTA */}
            <button
              type="button"
              onClick={() => setSubscriptionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 rounded-lg font-extrabold border border-orange-500/40 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>
                {revealsRemaining > 0
                  ? `${revealsRemaining} ${t('revealsLeftText')}`
                  : t('revealsExhaustedText')}
              </span>
              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-sans">
                {t('plansBadge')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. 99ACRES HERO PANORAMA BILLBOARD CAROUSEL & OVERLAPPING SEARCH CONSOLE */}
      <section className="pt-20 sm:pt-24">
        <NinetyNineAcresBillboardHero
          onSearch={(query, category, city) => {
            onNavigate(`search?q=${encodeURIComponent(query || '')}&category=${category || ''}&city=${city || ''}`);
          }}
          onNavigate={onNavigate}
        />
      </section>

      {/* 1.2 REAL ESTATE TELEMETRY STRIP & TRUST VERIFICATION DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-navy-900/10 shadow-trust">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 font-bold text-xs mb-3">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>{t('heroTrustBadge')}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-900 leading-tight">
              {headlineLines.join(' ')}
            </h2>

            <p className="mt-2.5 text-navy-800 text-sm sm:text-base leading-relaxed font-medium">
              {t('heroSubtitle')}
            </p>

            {/* Real Estate Telemetry Stats */}
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { v: t('statListings'), l: t('statListingsLabel') },
                { v: String(cityCounts.length), l: t('statCities') },
                { v: `${avgTrust}/100`, l: t('statTrust') },
                { v: '60–100 ft', l: t('statRoad') }
              ].map(stat => (
                <div key={stat.l}>
                  <dt className="font-display text-xl sm:text-2xl font-bold text-navy-900 num-mono">{stat.v}</dt>
                  <dd className="text-xs text-navy-700 font-medium">{stat.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            {heroListing && <VerificationDemo listing={heroListing} onOpen={onOpenListingDetail} />}
          </div>
        </div>
      </section>

      {/* 1.5 99ACRES FEATURED PROJECT SPOTLIGHT CAROUSEL (TIME-TO-TIME AUTO-ROTATING) */}
      <section className="-mt-8 sm:-mt-12">
        <ProjectSpotlightCarousel
          onOpenSubscriptionModal={() => setSubscriptionModalOpen(true)}
          onExploreProject={(query) => {
            onNavigate(`search?q=${encodeURIComponent(query)}`);
          }}
        />
      </section>

      {/* 1.8 LIVE APARTMENT & HOUSE 360° DEMOS SHOWCASE (AS SEEN IN USER IMAGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-[#0B132B] rounded-3xl p-5 sm:p-8 text-white border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider mb-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>99acres 360° Live Inspection</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {language === 'hi' ? 'लाइव अपार्टमेंट व हाउस डेमो (कमरे दर कमरे)' : 'Live Apartment & House Demos (Room by Room)'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                {language === 'hi'
                  ? 'असली कमरों, टाइल्स, दीवारों, प्राकृतिक धूप और 40-100 फीट सड़क का लाइव 360° वॉकथ्रू और ऑन-साइट इंस्पेक्टर से सीधा संवाद।'
                  : 'Experience actual condition of rooms, flooring, ventilation, and road views with interactive 360° pan & on-site inspector video call.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('search?category=all')}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>{language === 'hi' ? 'सभी लाइव डेमो देखें' : 'Explore All Live Demos'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Grid featuring User's Exact Apartment + Curated Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Chirantani Park Bansdroni (User's Exact Uploaded Apartment!) */}
            <div
              onClick={() => {
                const target = listings.find(l => l.id === 'prop-apt-chirantani') || listings[0];
                setLiveDemoListing(target);
              }}
              className="group bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src="chirantani-apartment.jpg"
                  alt="2 BHK Apartment in Chirantani Park Bansdroni"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* 99acres Price Tag on Image */}
                <div className="absolute bottom-3 left-3 bg-white text-navy-950 font-black text-sm px-2.5 py-1 rounded-xl shadow-md">
                  ₹ 19 L
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md animate-pulse">
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </div>

                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Verified Owner
                </span>
              </div>

              <div className="p-4 text-left">
                <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">
                  2 BHK Apartment, 2 Baths
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  In <span className="font-bold text-white">Chirantani Park, Bansdroni</span>, Kolkata
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs text-gray-400">
                  <span>Posted by <strong className="text-white">Owner</strong> • 3 months ago</span>
                  <span className="text-orange-400 font-bold group-hover:translate-x-1 transition-transform">
                    View Demo →
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Mahindra AquaVista 3 BHK Villa */}
            <div
              onClick={() => {
                const target = listings.find(l => l.title.includes('Mahindra') || l.title.includes('Villa')) || listings[1];
                setLiveDemoListing(target);
              }}
              className="group bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Mahindra AquaVista"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute bottom-3 left-3 bg-white text-navy-950 font-black text-sm px-2.5 py-1 rounded-xl shadow-md">
                  ₹ 85 L
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md animate-pulse">
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </div>

                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ RERA Platinum
                </span>
              </div>

              <div className="p-4 text-left">
                <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">
                  3 BHK Lakeview Luxury Residence
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  In <span className="font-bold text-white">Mahindra World City</span>, GST Road
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs text-gray-400">
                  <span>Road: <strong className="text-white">100 ft Wide Road</strong></span>
                  <span className="text-orange-400 font-bold group-hover:translate-x-1 transition-transform">
                    View Demo →
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Corporate IT Suite DLF CyberCity */}
            <div
              onClick={() => {
                const target = listings.find(l => l.title.includes('CyberCity') || l.title.includes('Office')) || listings[2];
                setLiveDemoListing(target);
              }}
              className="group bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between hidden lg:flex"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                  alt="DLF CyberCity Office"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute bottom-3 left-3 bg-white text-navy-950 font-black text-sm px-2.5 py-1 rounded-xl shadow-md">
                  ₹ 4.20 Cr
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md animate-pulse">
                  <Video className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </div>

                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  ✓ Grade A Corporate
                </span>
              </div>

              <div className="p-4 text-left">
                <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">
                  Corporate IT Office (65 Workstations)
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  In <span className="font-bold text-white">DLF CyberCity Phase 2</span>, Gurugram
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs text-gray-400">
                  <span>Power: <strong className="text-white">100% DG Backup</strong></span>
                  <span className="text-orange-400 font-bold group-hover:translate-x-1 transition-transform">
                    View Demo →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL ESTATE CATEGORY DISCOVERY RAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
              {t('categoriesTag')}
            </span>
            <Reveal>
              <h2 className="display-section text-navy-900">
                {t('categoriesTitle')}
              </h2>
            </Reveal>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-navy-900 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <span>{t('seeAllListings')} ({listings.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Core Real Estate Segments */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {REAL_ESTATE_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActivePropertyTab(cat.tab as any);
                  const el = document.getElementById('property-showcase-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-navy-900/10 shadow-xs hover:shadow-lg transition-all card-hover-lift flex flex-col justify-between p-4"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent" />

                <div className="relative z-10 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-soft group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="relative z-10 text-white">
                  <h3 className="text-sm font-extrabold leading-tight group-hover:text-amber-soft transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-cream-200 line-clamp-1 mt-0.5">
                    {cat.count} {t('verifiedListingsCount')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. VERIFIED 20 PROPERTIES SHOWCASE (TABBED MAGICBRICKS/99ACRES VIEW) */}
      <section id="property-showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
              {t('portfolioTag')}
            </span>
            <Reveal>
              <h2 className="display-section text-navy-900">
                {t('portfolioTitle')}
              </h2>
            </Reveal>
            <p className="text-sm text-navy-700 mt-1">
              {t('portfolioDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubscriptionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>{t('pricingPlans')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <span>{t('navAll')} ({listings.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>
        </div>

        {/* Filter Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { id: 'ALL', label: `${t('tabPortfolioAll')} (${listings.length})` },
            { id: 'COMMERCIAL', label: `${t('tabPortfolioCommercial')} (4)` },
            { id: 'AGRICULTURAL', label: `${t('tabPortfolioAgri')} (4)` },
            { id: 'INDUSTRIAL', label: `${t('tabPortfolioIndustrial')} (4)` },
            { id: 'PLOTS', label: `${t('tabPortfolioPlots')} (4)` },
            { id: 'RESIDENTIAL', label: `${t('tabPortfolioResidential')} (4)` },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePropertyTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activePropertyTab === tab.id
                  ? 'bg-navy-900 text-cream-50 shadow-md ring-2 ring-orange-500/40'
                  : 'bg-white text-navy-800 border border-navy-900/10 hover:bg-cream-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onOpenListing={onOpenListingDetail}
              onOpenTrustModal={setSelectedTrustListing}
              onQuickView={l => setQuickViewListing(l)}
              onOpenSubscriptionModal={() => setSubscriptionModalOpen(true)}
            />
          ))}
        </div>
      </section>

      {/* 4. TRUST SCORE EXPLANATION & INTERACTIVE AUDIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustScoreChart
          trustScore={listings[0]?.trustScore}
        />
      </section>

      {/* 5. VERIFICATION JOURNEY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VerificationTimeline />
      </section>

      {/* 6. AI MEDIA & FRAUD SCANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FraudScanPanel />
      </section>

      {/* 7. POPULAR REAL ESTATE CITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 block mb-1">
            {t('topLocationsTag')}
          </span>
          <h2 className="display-section text-navy-900">
            {t('exploreByCity')}
          </h2>
          <p className="text-sm text-navy-700 mt-2">
            {t('citiesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cityCounts.slice(0, 5).map(c => (
            <a
              key={c.city}
              href={`#search?city=${encodeURIComponent(c.city)}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`search?city=${encodeURIComponent(c.city)}`);
              }}
              className="group block relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-navy-900/10 shadow-xs card-hover-lift"
            >
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                alt={c.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base font-extrabold group-hover:text-orange-400 transition-colors">
                  {c.city}
                </h3>
                <span className="text-[11px] text-cream-200 block font-medium">
                  {c.count} {t('verifiedListingsCount')}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* QUICK VIEW PROPERTY MODAL */}
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={Boolean(quickViewListing)}
        onClose={() => setQuickViewListing(null)}
        onOpenSubscriptionModal={() => setSubscriptionModalOpen(true)}
        onNavigateToFullListing={slug => {
          setQuickViewListing(null);
          onNavigate(`listing/${slug}`);
        }}
      />

      {/* LIVE APARTMENT / HOUSE 360° DEMO MODAL */}
      <LivePropertyDemoModal
        listing={liveDemoListing}
        isOpen={Boolean(liveDemoListing)}
        onClose={() => setLiveDemoListing(null)}
        onOpenSubscriptionModal={() => setSubscriptionModalOpen(true)}
      />

      {/* SUBSCRIPTION & PRICING PLANS MODAL */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        defaultAudience="BUYER"
      />

      {/* TRUST SCORE DETAILS MODAL */}
      {selectedTrustListing && (
        <TrustScoreChart
          trustScore={selectedTrustListing.trustScore}
          isModal
          onClose={() => setSelectedTrustListing(null)}
        />
      )}
    </div>
  );
};
