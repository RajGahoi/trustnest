import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Mic, Crosshair, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { VoiceSearchModal } from '../search/VoiceSearchModal';

export interface BillboardSlide {
  id: string;
  developer: string;
  developerLogoText: string;
  projectName: string;
  locality: string;
  subLocation: string;
  configuration: string;
  startingPrice: string;
  tagline: string;
  reraNumber: string;
  reraWebsite: string;
  launchDate: string;
  collectionAccount: string;
  ifscCode: string;
  bankNameAndAddress: string;
  disclaimer: string;
  image: string;
}

const BILLBOARD_SLIDES: BillboardSlide[] = [
  {
    id: 'hero-leafsong',
    developer: 'Hero Homes',
    developerLogoText: 'Hero Homes PRESENTS',
    projectName: 'Leafsong Retreat',
    locality: 'Sector MU, Greater Noida',
    subLocation: 'Near Pari Chowk & Yamuna Expressway',
    configuration: '3 BHK PREMIUM RESIDENCES',
    startingPrice: '₹1.93 Cr* Onwards',
    tagline: 'LIFE AT EASE: BREATHE BETTER WITH AQI-CONTROLLED HOMES',
    reraNumber: 'UPRERAPRJ414014/10/2026',
    reraWebsite: 'www.up-rera.in',
    launchDate: '09.10.2026',
    collectionAccount: '9999077771405',
    ifscCode: 'HDFC0004393',
    bankNameAndAddress: 'HDFC Bank - B36 4003 & 4004 Express Trade Tower 2 Sector 132 Noida Uttar Pradesh 201301',
    disclaimer: 'Disclaimer: The content and visuals in this advertisement are solely an artistic rendering for illustrative purposes and are not to scale. It does not constitute a legal offer or binding contract. All details subject to official RERA approvals.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'mahindra-aquavista',
    developer: 'Mahindra Lifespaces',
    developerLogoText: 'Mahindra Lifespaces PRESENTS',
    projectName: 'Mahindra AquaVista',
    locality: 'Mahindra City, 100 ft GST Road',
    subLocation: 'Chengalpattu Industrial Corridor',
    configuration: '2, 3 & 4 BHK LAKEVIEW HOMES',
    startingPrice: '₹85 Lac* Onwards',
    tagline: 'SUSTAINABLE TOWNSHIP WITH PRE-CERTIFIED PLATINUM GREEN CREDENTIALS',
    reraNumber: 'TN/01/Building/0124/2022',
    reraWebsite: 'www.rera.tn.gov.in',
    launchDate: '15.03.2025',
    collectionAccount: '9999011234567',
    ifscCode: 'ICIC0000002',
    bankNameAndAddress: 'ICICI Bank - Mahindra World City Branch, Chengalpattu Tamil Nadu 603004',
    disclaimer: 'Disclaimer: All visual impressions are artist impressions. Approved by DTCP and TN RERA. Subject to regulatory approvals.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'dlf-cybercity',
    developer: 'DLF Commercial',
    developerLogoText: 'DLF Commercial PRESENTS',
    projectName: 'DLF CyberCity IT Towers',
    locality: 'DLF Phase 2, Sector 24',
    subLocation: '100 ft Arterial Sector Road, Gurugram',
    configuration: 'GRADE-A CORPORATE OFFICE SUITES',
    startingPrice: '₹4.20 Cr* Onwards',
    tagline: 'CAMPUS-STYLE HIGH INTEGRITY CORPORATE HQ WITH 100% DG BACKUP',
    reraNumber: 'HRERA-PKL-GGM-1420-2022',
    reraWebsite: 'www.haryanarera.gov.in',
    launchDate: '12.01.2025',
    collectionAccount: '9999022334455',
    ifscCode: 'HDFC0000043',
    bankNameAndAddress: 'HDFC Bank - DLF CyberCity Corporate Branch, Gurugram Haryana 122002',
    disclaimer: 'Disclaimer: Leasable and saleable corporate suites. RERA Haryana registered with municipal approval letters on record.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'godrej-palm-retreat',
    developer: 'Godrej Properties',
    developerLogoText: 'Godrej Properties PRESENTS',
    projectName: 'Godrej Palm Retreat',
    locality: 'Sector 150, Noida-Greater Noida Expressway',
    subLocation: 'India\'s First Low-Density Sports City',
    configuration: '3 & 4 BHK RESORT-STYLE RESIDENCES',
    startingPrice: '₹1.75 Cr* Onwards',
    tagline: 'LOW-DENSITY RESORT LIVING SURROUNDED BY 42 ACRES OF GREEN COVER',
    reraNumber: 'UPRERAPRJ12456',
    reraWebsite: 'www.up-rera.in',
    launchDate: '20.08.2025',
    collectionAccount: '9999033445566',
    ifscCode: 'UTIB0000123',
    bankNameAndAddress: 'Axis Bank - Sector 150 Expressway Hub, Noida Uttar Pradesh 201310',
    disclaimer: 'Disclaimer: Images are rendered architectural representations. RERA compliant and approved by Greater Noida Industrial Development Authority.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85'
  }
];

type SearchTab = 'BUY' | 'RENT' | 'PG' | 'NEW_LAUNCH' | 'COMMERCIAL' | 'PLOTS' | 'PROJECTS';

interface NinetyNineAcresBillboardHeroProps {
  onSearch: (query: string, category?: string, city?: string) => void;
  onNavigate: (route: string) => void;
}

export const NinetyNineAcresBillboardHero: React.FC<NinetyNineAcresBillboardHeroProps> = ({
  onSearch,
  onNavigate
}) => {
  const { language } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // Search state
  const [activeTab, setActiveTab] = useState<SearchTab>('BUY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('ALL');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [geoStatusMsg, setGeoStatusMsg] = useState<string | null>(null);

  // Animated rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholderSuggestions = [
    'Search "3 BHK for sale in Mumbai"',
    'Search "Commercial Office in Cyber City Gurugram"',
    'Search "12 Bigha fertile land in Jewar Airport"',
    'Search "Industrial plot 100ft road Greater Noida"',
    'Search "Luxury Lakeview Villa in Whitefield Bengaluru"'
  ];

  // Auto-scroll billboard slides every 4.5s
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % BILLBOARD_SLIDES.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlideIndex, isPaused]);

  // Rotate placeholder text every 3s
  useEffect(() => {
    const pTimer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholderSuggestions.length);
    }, 3200);
    return () => clearInterval(pTimer);
  }, []);


  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev === 0 ? BILLBOARD_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex(prev => (prev + 1) % BILLBOARD_SLIDES.length);
  };

  // Submit search
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let categoryParam: string | undefined = undefined;
    let effectiveQuery = searchQuery.trim();

    if (activeTab === 'COMMERCIAL') {
      categoryParam = 'commercial';
      if (!effectiveQuery) effectiveQuery = 'Commercial Office Space';
    } else if (activeTab === 'PLOTS') {
      categoryParam = 'plots';
      if (!effectiveQuery) effectiveQuery = 'Land Plot';
    } else if (activeTab === 'PG') {
      categoryParam = 'pg';
      if (!effectiveQuery) effectiveQuery = 'PG Co-Living';
    } else if (activeTab === 'RENT') {
      if (!effectiveQuery) effectiveQuery = 'Rent Apartment';
    } else if (activeTab === 'NEW_LAUNCH') {
      if (!effectiveQuery) effectiveQuery = 'New Launch RERA';
    }

    if (selectedSubCategory !== 'ALL' && !effectiveQuery.includes(selectedSubCategory)) {
      effectiveQuery = effectiveQuery ? `${effectiveQuery} ${selectedSubCategory}` : selectedSubCategory;
    }

    onSearch(effectiveQuery, categoryParam);
  };

  // Geolocation trigger
  const handleLocateMe = () => {
    setGeoStatusMsg('Detecting location...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (_pos) => {
          setGeoStatusMsg('📍 Detected: Delhi NCR (Near You)');
          setSearchQuery('Delhi NCR');
          setTimeout(() => setGeoStatusMsg(null), 3500);
        },
        () => {
          setGeoStatusMsg('📍 Location defaulted to Delhi NCR');
          setSearchQuery('Delhi NCR');
          setTimeout(() => setGeoStatusMsg(null), 3500);
        },
        { timeout: 4000 }
      );
    } else {
      setGeoStatusMsg('📍 Delhi NCR (Default Metro)');
      setSearchQuery('Delhi NCR');
      setTimeout(() => setGeoStatusMsg(null), 3500);
    }
  };

  // Open Voice Search modal
  const handleOpenVoiceSearch = () => {
    setVoiceModalOpen(true);
  };

  // Subcategory options based on active tab
  const getSubcategoryOptions = () => {
    if (activeTab === 'COMMERCIAL') {
      return [
        { value: 'ALL', label: language === 'hi' ? 'सभी कमर्शियल' : 'All Commercial' },
        { value: 'Commercial Office Space', label: language === 'hi' ? 'कमर्शियल ऑफिस' : 'Commercial Office' },
        { value: 'Retail Shop', label: language === 'hi' ? 'रीटेल दुकान / शोरूम' : 'Retail Shop / Showroom' },
        { value: 'Warehouse', label: language === 'hi' ? 'गोदाम / वेयरहाउस' : 'Warehouse / Godown' },
        { value: 'Industrial Building', label: language === 'hi' ? 'औद्योगिक शेड' : 'Industrial Building' }
      ];
    }
    if (activeTab === 'PG') {
      return [
        { value: 'ALL', label: language === 'hi' ? 'सभी पीजी व को-लिविंग' : 'All PG & Co-Living' },
        { value: 'Boys PG', label: language === 'hi' ? 'बॉयज पीजी (Boys PG)' : 'Boys PG' },
        { value: 'Girls PG', label: language === 'hi' ? 'गर्ल्स पीजी (Girls PG)' : 'Girls PG' },
        { value: 'Coed PG', label: language === 'hi' ? 'को-एड पीजी (Co-ed PG)' : 'Coed PG' },
        { value: 'Private Room', label: language === 'hi' ? 'प्राइवेट सिंगल रूम' : 'Private Single Room' },
        { value: 'Twin Sharing', label: language === 'hi' ? 'ट्विन शेयरिंग (2 Sharing)' : 'Twin Sharing (2 Sharing)' },
        { value: 'With Food', label: language === 'hi' ? 'भोजन सहित (With Food/Mess)' : 'With Food / Mess' }
      ];
    }
    if (activeTab === 'PLOTS') {
      return [
        { value: 'ALL', label: language === 'hi' ? 'सभी प्लॉट व जमीन' : 'All Plots/Land' },
        { value: 'Agricultural Land', label: language === 'hi' ? 'कृषि भूमि (फार्मलैंड)' : 'Agricultural Land' },
        { value: 'Industrial Land', label: language === 'hi' ? 'औद्योगिक प्लॉट' : 'Industrial Land' },
        { value: 'Residential Plot', label: language === 'hi' ? 'आवासीय प्लॉट' : 'Residential Plot' },
        { value: 'Commercial Land', label: language === 'hi' ? 'कमर्शियल प्लॉट' : 'Commercial Land' }
      ];
    }
    if (activeTab === 'PROJECTS' || activeTab === 'NEW_LAUNCH') {
      return [
        { value: 'ALL', label: language === 'hi' ? 'सभी नए प्रोजेक्ट्स' : 'All New Projects' },
        { value: 'New Launch', label: language === 'hi' ? 'नई लॉन्च' : 'Newly Launched' },
        { value: 'Under Construction', label: language === 'hi' ? 'निर्माणाधीन' : 'Under Construction' },
        { value: 'Ready to Move', label: language === 'hi' ? 'तैयार फ्लैट' : 'Ready to Move' }
      ];
    }
    return [
      { value: 'ALL', label: language === 'hi' ? 'सभी आवासीय' : 'All Residential' },
      { value: 'Apartment', label: language === 'hi' ? 'फ्लैट / अपार्टमेंट' : 'Flat / Apartment' },
      { value: 'Villa', label: language === 'hi' ? 'स्वतंत्र विला / कोठी' : 'Independent House / Villa' },
      { value: 'Penthouse', label: language === 'hi' ? 'पेंटहाउस' : 'Penthouse' },
      { value: 'Builder Floor', label: language === 'hi' ? 'बिल्डर फ्लोर' : 'Builder Floor' }
    ];
  };

  return (
    <div className="w-full relative select-none">
      {/* ======================================================== */}
      {/* 1. PANORAMIC BILLBOARD HERO CAROUSEL (EXACT 99ACRES HERO) */}
      {/* ======================================================== */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden bg-slate-900 text-white min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] shadow-2xl"
      >
        {/* Horizontal sliding track with smooth carousel transition */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {BILLBOARD_SLIDES.map((slideItem) => (
            <div
              key={slideItem.id}
              className="w-full shrink-0 relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center"
            >
              {/* Background Panoramic Architectural Image (Bright, Sunlit Daylight Render) */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slideItem.image}
                  alt={slideItem.projectName}
                  className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.02] saturate-110 transform scale-100"
                />
                {/* Soft, Transparent Daylight Vignette - Maximum Light and Clear Visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Left Column: Developer Badge, Config & Starting Price */}
                  <div className="lg:col-span-4 text-center lg:text-left">
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl max-w-sm mx-auto lg:mx-0">
                      {/* Developer Logo Badge (MagicBricks/99acres Red) */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D92228] text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-xl mb-3">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>{slideItem.developerLogoText}</span>
                      </div>

                      {/* Unit Configuration (Pure Brilliant White) */}
                      <h2
                        style={{ color: '#ffffff' }}
                        className="font-display text-2xl sm:text-3xl font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] leading-tight"
                      >
                        {slideItem.configuration}
                      </h2>

                      {/* Price Banner */}
                      <div className="mt-2.5">
                        <p className="text-[11px] font-semibold text-gray-200 uppercase tracking-widest drop-shadow">
                          {language === 'hi' ? 'शुरुआती कीमत' : 'STARTING PRICE AS'}
                        </p>
                        <p
                          style={{ color: '#FBBF24' }}
                          className="text-2xl sm:text-3xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mt-0.5"
                        >
                          {slideItem.startingPrice}
                        </p>
                      </div>

                      {/* RERA Badge Pill */}
                      <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/20 text-xs font-mono font-medium text-white shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>RERA: {slideItem.reraNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Project Branding, Location & Architectural Render */}
                  <div className="lg:col-span-4 text-center flex flex-col items-center">
                    <div className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-white/20 backdrop-blur-md w-full max-w-sm shadow-2xl">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F59E0B]">
                          Featured Master Launch
                        </span>
                      </div>

                      <h3
                        style={{ color: '#ffffff' }}
                        className="font-display text-xl sm:text-2xl md:text-3xl font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                      >
                        {slideItem.projectName}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-amber-200 mt-0.5 drop-shadow">
                        BY {slideItem.developer.toUpperCase()}
                      </p>

                      <p className="text-xs text-gray-100 mt-2 flex items-center justify-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E4222D] shrink-0" />
                        <span>{slideItem.locality}</span>
                      </p>

                      <div className="mt-3 pt-3 border-t border-white/15">
                        <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                          {slideItem.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: UP RERA Box with QR Code, Bank Account & Disclaimer */}
                  <div className="lg:col-span-4 hidden lg:block">
                    <div className="p-4 rounded-2xl bg-black/55 border border-white/20 backdrop-blur-md text-[11px] space-y-2 text-gray-100 shadow-2xl">
                      <div className="flex items-start gap-3">
                        {/* Inline Sharp RERA QR Code SVG Pattern */}
                        <div className="w-20 h-20 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center shadow">
                          <svg viewBox="0 0 100 100" className="w-full h-full" fill="#000000">
                            <rect x="0" y="0" width="30" height="30" fill="#000" />
                            <rect x="5" y="5" width="20" height="20" fill="#fff" />
                            <rect x="10" y="10" width="10" height="10" fill="#000" />

                            <rect x="70" y="0" width="30" height="30" fill="#000" />
                            <rect x="75" y="5" width="20" height="20" fill="#fff" />
                            <rect x="80" y="10" width="10" height="10" fill="#000" />

                            <rect x="0" y="70" width="30" height="30" fill="#000" />
                            <rect x="5" y="75" width="20" height="20" fill="#fff" />
                            <rect x="10" y="80" width="10" height="10" fill="#000" />

                            <rect x="35" y="10" width="10" height="10" fill="#000" />
                            <rect x="50" y="20" width="10" height="10" fill="#000" />
                            <rect x="35" y="35" width="30" height="10" fill="#000" />
                            <rect x="40" y="50" width="20" height="20" fill="#000" />
                            <rect x="70" y="45" width="10" height="15" fill="#000" />
                            <rect x="85" y="70" width="10" height="20" fill="#000" />
                            <rect x="45" y="75" width="15" height="15" fill="#000" />
                          </svg>
                        </div>

                        {/* RERA Legal Details */}
                        <div className="space-y-1 leading-tight overflow-hidden">
                          <p className="font-bold text-white text-[11px]">
                            RERA Reg. No.: <span className="text-orange-400 font-mono">{slideItem.reraNumber}</span>
                          </p>
                          <p className="text-[10px] text-gray-300">
                            Website: <span className="text-sky-300 underline">{slideItem.reraWebsite}</span>
                          </p>
                          <p className="text-[10px] text-gray-300">
                            Launch Date: <span className="font-semibold text-white">{slideItem.launchDate}</span>
                          </p>
                          <p className="text-[10px] text-gray-300">
                            Collection A/c: <span className="font-mono text-white">{slideItem.collectionAccount}</span>
                          </p>
                          <p className="text-[10px] text-gray-300">
                            IFSC: <span className="font-mono text-white">{slideItem.ifscCode}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 text-[9px] text-gray-300 leading-snug">
                        <p className="font-semibold text-gray-200">
                          Bank: {slideItem.bankNameAndAddress}
                        </p>
                        <p className="mt-1 line-clamp-2 text-gray-300 italic">
                          {slideItem.disclaimer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Circular Left Arrow (<) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-navy-950 shadow-2xl flex items-center justify-center hover:bg-cream-100 hover:scale-110 transition-all cursor-pointer z-20 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Circular Right Arrow (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-navy-950 shadow-2xl flex items-center justify-center hover:bg-cream-100 hover:scale-110 transition-all cursor-pointer z-20 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Bottom Slide Progress Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {BILLBOARD_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all rounded-full cursor-pointer ${currentSlideIndex === idx
                  ? 'w-9 h-2.5 bg-orange-500 shadow-lg scale-105'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white'
                }`}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FLOATING WHITE SEARCH CONSOLE (OVERLAPPING BILLBOARD) */}
      {/* ======================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-30 -mt-10 sm:-mt-14 md:-mt-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/80 p-3 sm:p-5 transition-all">
          {/* Top Tab Bar (Exact MagicBricks & 99acres signature tabs) */}
          <div className="flex items-center gap-4 sm:gap-8 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold">
            {/* Buy */}
            <button
              type="button"
              onClick={() => { setActiveTab('BUY'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] ${activeTab === 'BUY'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {language === 'hi' ? 'खरीदें (Buy)' : 'Buy'}
            </button>

            {/* Rent */}
            <button
              type="button"
              onClick={() => { setActiveTab('RENT'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] ${activeTab === 'RENT'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {language === 'hi' ? 'किराया (Rent)' : 'Rent'}
            </button>

            {/* PG / Co-Living (MagicBricks Style) */}
            <button
              type="button"
              onClick={() => { setActiveTab('PG'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] flex items-center gap-1 ${activeTab === 'PG'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <span>{language === 'hi' ? 'पीजी व को-लिविंग' : 'PG / Co-Living'}</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-white tracking-wider">
                PG
              </span>
            </button>

            {/* New Launch (with red dot) */}
            <button
              type="button"
              onClick={() => { setActiveTab('NEW_LAUNCH'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] flex items-center gap-1.5 ${activeTab === 'NEW_LAUNCH'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              <span>{language === 'hi' ? 'नई लॉन्च' : 'New Launch'}</span>
              <span className="w-2 h-2 rounded-full bg-[#D92228] animate-pulse" />
            </button>

            {/* Commercial */}
            <button
              type="button"
              onClick={() => { setActiveTab('COMMERCIAL'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] ${activeTab === 'COMMERCIAL'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {language === 'hi' ? 'कमर्शियल' : 'Commercial'}
            </button>

            {/* Plots / Land */}
            <button
              type="button"
              onClick={() => { setActiveTab('PLOTS'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] ${activeTab === 'PLOTS'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {language === 'hi' ? 'प्लॉट व जमीन' : 'Plots/Land'}
            </button>

            {/* Projects */}
            <button
              type="button"
              onClick={() => { setActiveTab('PROJECTS'); setSelectedSubCategory('ALL'); }}
              className={`pb-2 whitespace-nowrap cursor-pointer transition-all border-b-[3px] ${activeTab === 'PROJECTS'
                  ? 'border-[#D92228] text-gray-950 font-black'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
            >
              {language === 'hi' ? 'प्रोजेक्ट्स' : 'Projects'}
            </button>

            {/* Separator */}
            <span className="text-gray-300 hidden md:inline">|</span>

            {/* Post Property FREE (MagicBricks Red Highlight) */}
            <button
              type="button"
              onClick={() => onNavigate('post')}
              className="pb-2 whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 text-gray-900 hover:text-[#D92228] ml-auto font-bold"
            >
              <span>{language === 'hi' ? 'प्रॉपर्टी पोस्ट करें' : 'Post Property'}</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D92228] text-white tracking-wide shadow-xs">
                FREE
              </span>
            </button>
          </div>

          {/* Bottom Search Bar Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-3.5 flex flex-col md:flex-row items-center gap-2.5 sm:gap-3"
          >
            {/* Subcategory Select (e.g. All Residential ∨) */}
            <div className="w-full md:w-auto relative shrink-0">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors">
                <Layers className="w-4 h-4 text-[#D92228] shrink-0" />
                <select
                  value={selectedSubCategory}
                  onChange={e => setSelectedSubCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-gray-900 focus:outline-none cursor-pointer pr-4"
                  aria-label="Select Subcategory"
                >
                  {getSubcategoryOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input Field with Rotating Placeholder */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-[#D92228] focus-within:border-[#D92228] w-full flex-1 transition-all shadow-xs">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={placeholderSuggestions[placeholderIndex]}
                className="w-full text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none text-sm sm:text-base"
                aria-label="Search properties input"
              />

              {/* Action Cluster: MagicBricks/99acres Geolocation & Voice Search Circular Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* 🎯 Geolocation Button */}
                <button
                  type="button"
                  onClick={handleLocateMe}
                  title={language === 'hi' ? 'मेरी वर्तमान लोकेशन उपयोग करें (Locate Me)' : 'Locate Me / Near Me'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 hover:bg-red-100 text-[#D92228] border border-red-200/60 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 shrink-0"
                  aria-label="Locate Me"
                >
                  <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </button>

                {/* 🎙️ Voice Search Microphone Button */}
                <button
                  type="button"
                  onClick={handleOpenVoiceSearch}
                  title={language === 'hi' ? 'बोलकर खोजें (Voice Search)' : 'Search by Voice'}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 hover:bg-red-100 text-[#D92228] border border-red-200/60 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 shrink-0 group"
                  aria-label="Search by Voice"
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Signature MagicBricks & 99acres Red "Search" Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-7 sm:px-9 py-2.5 sm:py-3 bg-[#D92228] hover:bg-[#BF1E23] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-red-600/30 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-98"
            >
              <span>{language === 'hi' ? 'सर्च करें' : 'Search'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Geolocation feedback badge if active */}
          {geoStatusMsg && (
            <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg w-fit animate-fadeIn flex items-center gap-1.5">
              <span>{geoStatusMsg}</span>
            </div>
          )}

          {/* Fast Filter Chips (MagicBricks / 99acres) */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-gray-500 uppercase shrink-0">
              {language === 'hi' ? 'लोकप्रिय खोज:' : 'Popular:'}
            </span>
            {[
              { label: language === 'hi' ? '🏢 साइबर सिटी ऑफिस' : '🏢 Cyber City Office', q: 'Commercial Office Cyber City' },
              { label: language === 'hi' ? '🌾 जेवर एयरपोर्ट कृषि भूमि' : '🌾 Jewar Airport Agri Land', q: 'Agricultural Land Jewar' },
              { label: language === 'hi' ? '🏭 100ft रोड औद्योगिक प्लॉट' : '🏭 100ft Road Industrial Plot', q: 'Industrial Land 100 ft Road' },
              { label: language === 'hi' ? '🏡 ग्रेटर नोएडा 3 BHK' : '🏡 Greater Noida 3 BHK', q: '3 BHK Greater Noida' },
              { label: language === 'hi' ? '🛣️ 60ft चौड़ी सड़क' : '🛣️ 60ft Wide Road', q: '60 ft' }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.q);
                  onSearch(chip.q);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-800 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap text-xs border border-gray-200"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Search Modal Popup */}
      <VoiceSearchModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptComplete={(transcriptText) => {
          setSearchQuery(transcriptText);
          onSearch(transcriptText);
        }}
      />
    </div>
  );
};