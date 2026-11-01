import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { store } from '../../mock/store';
import { useLanguage } from '../../domain/i18n/LanguageContext';

interface ProjectItem {
  id: string;
  name: string;
  locality: string;
  road: string;
  developer: string;
  developerPhone: string;
  priceRange: string;
  image: string;
  reraId: string;
  highlights: string[];
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Mahindra AquaVista',
    locality: 'Mahindra City',
    road: '100 ft Wide GST Road',
    developer: 'Mahindra Lifespaces',
    developerPhone: '+91 98112 34567',
    priceRange: '₹85 Lac - ₹2.40 Cr',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    reraId: 'TN/01/Building/0124/2022',
    highlights: ['100 ft Main Road Access', 'Township with Lakeview', 'Pre-certified Platinum Green']
  },
  {
    id: 'proj-2',
    name: 'DLF CyberCity IT Towers',
    locality: 'DLF Phase 2, Sector 24',
    road: '100 ft Sector Arterial Road',
    developer: 'DLF Commercial',
    developerPhone: '+91 98101 23456',
    priceRange: '₹4.20 Cr - ₹18.5 Cr',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    reraId: 'HRERA-PKL-GGM-1420-2022',
    highlights: ['Corporate IT Suites', '100% DG Power Backup', 'Direct Metro Connectivity']
  },
  {
    id: 'proj-3',
    name: 'Godrej Palm Retreat & Golf Enclave',
    locality: 'Sector 150',
    road: '60m Noida-Greater Noida Expressway',
    developer: 'Godrej Properties',
    developerPhone: '+91 98765 43210',
    priceRange: '₹1.75 Cr - ₹4.50 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    reraId: 'UPRERAPRJ12456',
    highlights: ['Low Density Green Sector', 'Olympic Sports Complex', 'Gated 5-Tier Security']
  },
  {
    id: 'proj-4',
    name: 'Prestige Golfshire Luxury Mansions',
    locality: 'Nandi Hills Road, Bengaluru',
    road: '80 ft Wide Avenue Boulevard',
    developer: 'Prestige Group',
    developerPhone: '+91 98801 99887',
    priceRange: '₹5.50 Cr - ₹12.0 Cr',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
    reraId: 'PRM/KA/RERA/1250/303/PR/171223',
    highlights: ['18-Hole Championship Golf', 'Private Pool & Falcon Club', 'Helipad & Ultra-Luxury']
  },
  {
    id: 'proj-5',
    name: 'Ecotech Industrial & Logistics Corridor',
    locality: 'Greater Noida Industrial Zone',
    road: '80-100 ft Heavy Duty Industrial Corridor',
    developer: 'Apex Logistics Infrastructure',
    developerPhone: '+91 98188 55443',
    priceRange: '₹2.50 Cr - ₹9.00 Cr',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    reraId: 'GNIDA-IND-2024-88',
    highlights: ['150-250 kW Heavy 3-Phase Power', 'Direct Dedicated Freight Corridor', 'Heavy Vehicle Transit Bay']
  }
];

interface ProjectSpotlightCarouselProps {
  onOpenSubscriptionModal: () => void;
  onExploreProject?: (query: string) => void;
}

export const ProjectSpotlightCarousel: React.FC<ProjectSpotlightCarouselProps> = ({
  onOpenSubscriptionModal,
  onExploreProject
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [revealedProjects, setRevealedProjects] = useState<Record<string, boolean>>({});
  const [revealsRemaining, setRevealsRemaining] = useState(store.getContactRevealsRemaining());
  const timerRef = useRef<any>(null);

  // Sync remaining reveals
  useEffect(() => {
    const handleStorage = () => {
      setRevealsRemaining(store.getContactRevealsRemaining());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Auto-rotate every 4.5 seconds ("they are changing in some time to time")
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % FEATURED_PROJECTS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? FEATURED_PROJECTS.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % FEATURED_PROJECTS.length);
  };

  const currentProject = FEATURED_PROJECTS[currentIndex];
  const isPhoneRevealed = revealedProjects[currentProject.id];

  const handleRevealPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const left = store.getContactRevealsRemaining();
    if (left <= 0) {
      onOpenSubscriptionModal();
      return;
    }

    const ok = store.decrementContactReveal();
    if (ok) {
      setRevealedProjects(prev => ({ ...prev, [currentProject.id]: true }));
      setRevealsRemaining(store.getContactRevealsRemaining());
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-navy-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500" />
            {language === 'hi' ? 'विशेष प्रोजेक्ट स्पॉटलाइट (99acres स्टाइल)' : 'Featured Project Spotlight (99acres Style)'}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-navy-700">
          <span className="hidden sm:inline">
            {language === 'hi' ? 'ऑटो-रोटेटिंग प्रोजेक्ट्स' : 'Auto-Rotating Spotlight'}
          </span>
          <span className="bg-navy-900 text-white px-2 py-0.5 rounded-md font-mono text-[10px]">
            {currentIndex + 1} / {FEATURED_PROJECTS.length}
          </span>
        </div>
      </div>

      {/* Main 99acres Featured Banner Card */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-3xl overflow-hidden border border-navy-900/15 shadow-xl bg-navy-950 group select-none transition-all"
      >
        {/* Cinematic Project Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
          <img
            src={currentProject.image}
            alt={currentProject.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Gradients matching 99acres card overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-navy-950/70" />

          {/* Top Left Branding Overlay (Exact 99acres style) */}
          <div className="absolute top-4 sm:top-7 left-4 sm:left-7 z-10 text-white max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-md">
                Featured Project
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-md">
                RERA: {currentProject.reraId}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {currentProject.name}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-cream-200 mt-1 flex items-center gap-1.5 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>{currentProject.locality}, {currentProject.road}</span>
            </p>

            {/* Price & Road Access highlights */}
            <div className="mt-3 hidden sm:flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white font-extrabold text-xs">
                💰 {currentProject.priceRange}
              </span>
              <span className="px-3 py-1 rounded-xl bg-navy-900/80 backdrop-blur-md text-amber-soft font-bold text-xs border border-orange-500/30">
                🛣️ {currentProject.road}
              </span>
            </div>
          </div>

          {/* Left Arrow Button (Circular like 99acres) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-navy-900 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button (Circular like 99acres) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-navy-900 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
            aria-label="Next Project"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Bottom Dots Indicator Bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {FEATURED_PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 h-2 bg-orange-500 shadow-sm'
                    : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Dark Action Ribbon (Identical to 99acres in user's image) */}
        <div className="bg-[#0B132B] px-5 sm:px-8 py-3.5 sm:py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          {/* Left Side: Interested in this project by [Builder]? → */}
          <div
            onClick={() => onExploreProject && onExploreProject(currentProject.name)}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 hover:text-white cursor-pointer transition-colors group/builder w-full sm:w-auto text-center sm:text-left justify-center sm:justify-start"
          >
            <span>{language === 'hi' ? 'क्या आप इस प्रोजेक्ट में रुचि रखते हैं?' : 'Interested in this project by'}</span>
            <span className="font-extrabold text-white group-hover/builder:text-orange-400 underline underline-offset-4 decoration-orange-500/50">
              {currentProject.developer}?
            </span>
            <ArrowRight className="w-4 h-4 text-orange-400 group-hover/builder:translate-x-1 transition-transform shrink-0" />
          </div>

          {/* Right Side: Prominent Blue "📞 View Number" Button */}
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2">
            {isPhoneRevealed ? (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-400 rounded-xl text-white font-mono font-bold text-sm tracking-wide">
                <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>{currentProject.developerPhone}</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded font-sans">
                  Verified Builder
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRevealPhone}
                className={`w-full sm:w-auto px-7 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  revealsRemaining <= 0
                    ? 'bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold'
                    : 'bg-[#0078DB] hover:bg-[#0066BA] text-white shadow-[#0078DB]/30'
                }`}
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>
                  {revealsRemaining <= 0
                    ? (language === 'hi' ? '🔒 नंबर देखें (सब्सक्राइब करें)' : '🔒 View Number (Subscribe)')
                    : (language === 'hi' ? 'नंबर देखें (View Number)' : 'View Number')}
                </span>
                {revealsRemaining > 0 && (
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">
                    {revealsRemaining} {language === 'hi' ? 'शेष' : 'left'}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
