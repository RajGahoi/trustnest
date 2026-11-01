import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, Phone, Building, ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { store } from '../../mock/store';

export interface PreferredAgent {
  id: string;
  name: string;
  avatar: string;
  agencyName: string;
  agencyLogo?: string;
  city: string;
  operatingSince: number;
  buyersServed: number;
  propertiesForSale: number;
  propertiesForRent?: number;
  phone: string;
  reraRegNo: string;
  rating: number;
  specialization: string;
}

const PREFERRED_AGENTS: PreferredAgent[] = [
  {
    id: 'agent-1',
    name: 'Pawan Tyagi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Gungun Properties',
    city: 'Ghaziabad',
    operatingSince: 2014,
    buyersServed: 500,
    propertiesForSale: 51,
    phone: '+91 98105 11223',
    reraRegNo: 'UPRERAAGT10452',
    rating: 4.9,
    specialization: 'Residential Apartments & Freehold Kothi'
  },
  {
    id: 'agent-2',
    name: 'Gaurav Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Diksha Homes',
    city: 'Ghaziabad',
    operatingSince: 2019,
    buyersServed: 1000,
    propertiesForSale: 49,
    phone: '+91 98118 33445',
    reraRegNo: 'UPRERAAGT12984',
    rating: 4.8,
    specialization: 'Builder Floors & GDA Approved Plots'
  },
  {
    id: 'agent-3',
    name: 'Rekha',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Maa Kali Properties Solutions',
    city: 'Ghaziabad',
    operatingSince: 2012,
    buyersServed: 5500,
    propertiesForSale: 37,
    propertiesForRent: 20,
    phone: '+91 98712 55667',
    reraRegNo: 'UPRERAAGT09411',
    rating: 4.95,
    specialization: 'Luxury High-Rise Flats & Rental Estates'
  },
  {
    id: 'agent-4',
    name: 'Abhinav Bhatia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Creative Homz',
    city: 'Ghaziabad',
    operatingSince: 2011,
    buyersServed: 3000,
    propertiesForSale: 117,
    phone: '+91 98101 77889',
    reraRegNo: 'UPRERAAGT08234',
    rating: 4.9,
    specialization: 'Commercial Showrooms & Expressway Enclaves'
  },
  {
    id: 'agent-5',
    name: 'Rohit Khandelwal',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Apex Capital Advisors',
    city: 'Delhi NCR',
    operatingSince: 2015,
    buyersServed: 2400,
    propertiesForSale: 68,
    propertiesForRent: 15,
    phone: '+91 98188 99001',
    reraRegNo: 'HRERA-AGT-2018-88',
    rating: 4.85,
    specialization: 'Corporate IT Suites & CyberCity Offices'
  },
  {
    id: 'agent-6',
    name: 'Ananya Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    agencyName: 'Bengal Heritage Realty',
    city: 'Kolkata',
    operatingSince: 2016,
    buyersServed: 1800,
    propertiesForSale: 42,
    propertiesForRent: 28,
    phone: '+91 98305 66778',
    reraRegNo: 'WBRERA/AGT/2022/012',
    rating: 4.9,
    specialization: 'South Kolkata & Bansdroni Verified Homes'
  }
];

interface PreferredAgentsCarouselProps {
  onSelectAgent?: (agent: PreferredAgent) => void;
  onOpenSubscriptionModal: () => void;
  onNavigate: (route: string) => void;
}

export const PreferredAgentsCarousel: React.FC<PreferredAgentsCarouselProps> = ({
  onSelectAgent,
  onOpenSubscriptionModal,
  onNavigate
}) => {
  const { language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('Ghaziabad');
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<PreferredAgent | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll agents every 4.2s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const cities = ['Ghaziabad', 'Delhi NCR', 'Kolkata', 'All Cities'];

  const filteredAgents = selectedCity === 'All Cities'
    ? PREFERRED_AGENTS
    : PREFERRED_AGENTS.filter(a => a.city === selectedCity || a.city === 'Ghaziabad');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleRevealPhone = (agent: PreferredAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    const left = store.getContactRevealsRemaining();
    if (left <= 0) {
      onOpenSubscriptionModal();
      return;
    }

    const ok = store.decrementContactReveal();
    if (ok) {
      setRevealedPhones(prev => ({ ...prev, [agent.id]: true }));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Section Header (Exact MagicBricks & 99acres style) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-navy-950">
              {language === 'hi'
                ? `ट्रस्टनेस्ट प्रेफर्ड एजेंट्स — ${selectedCity}`
                : `MB Preferred Agents in ${selectedCity}`}
            </h2>
          </div>
          {/* Cyan/Teal Brand Underline Bar */}
          <div className="h-1 w-14 bg-teal-500 rounded-full mt-2" />
        </div>

        {/* City Filter Pills & See All CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {cities.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-cream-100 hover:bg-cream-200 text-navy-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`search?q=${encodeURIComponent(selectedCity)}`)}
            className="text-xs sm:text-sm font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0 cursor-pointer transition-colors ml-2"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'See all'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Agents Carousel Container with Navigation Buttons */}
      <div className="relative group/carousel">
        {/* Left Arrow Button (<) */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-navy-950 shadow-xl border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          aria-label="Previous Agent"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button (>) */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-navy-950 shadow-xl border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 z-20"
          aria-label="Next Agent"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Scrollable Horizontal Rail */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        >
          {filteredAgents.map(agent => {
            const isPhoneRevealed = revealedPhones[agent.id];

            return (
              <div
                key={agent.id}
                onClick={() => {
                  setSelectedAgentForModal(agent);
                  if (onSelectAgent) onSelectAgent(agent);
                }}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 group"
              >
                {/* 1. Top Soft Cyan/Teal Header (Exact match to screenshot) */}
                <div className="bg-[#E6F5F8] p-3 sm:p-4 rounded-t-2xl flex items-center justify-between border-b border-[#CEEFF3]">
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">
                        MB Preferred
                      </span>
                      <h3 className="font-extrabold text-navy-950 text-sm sm:text-base leading-tight group-hover:text-teal-700 transition-colors">
                        {agent.name}
                      </h3>
                    </div>
                  </div>

                  {/* Preferred Agent Medal Ribbon Badge (Exact match) */}
                  <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-700 shrink-0 shadow-xs" title="TrustNest Preferred Certified Agent">
                    <Award className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* 2. Agency Name & Track Record Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-navy-900 shrink-0 border border-gray-200">
                      <Building className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-extrabold text-navy-950 text-xs sm:text-sm line-clamp-1">
                        {agent.agencyName}
                      </p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                        <span>{agent.city} • RERA: {agent.reraRegNo}</span>
                      </p>
                    </div>
                  </div>

                  {/* Metrics Row: Operating Since | Buyers Served */}
                  <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-gray-100 text-xs">
                    <div>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase">Operating Since</p>
                      <p className="font-mono font-extrabold text-navy-900 text-xs sm:text-sm">
                        {agent.operatingSince}
                      </p>
                    </div>
                    <div className="border-l border-gray-100 pl-3">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase">Buyers Served</p>
                      <p className="font-mono font-extrabold text-navy-900 text-xs sm:text-sm">
                        {agent.buyersServed}+
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Inventory Row: Properties for Sale & Rent */}
                <div className="px-4 py-3 bg-gray-50/90 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-display font-black text-navy-950 text-base sm:text-lg leading-none">
                        {agent.propertiesForSale}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                        Properties for Sale
                      </p>
                    </div>

                    {agent.propertiesForRent && (
                      <div className="border-l border-gray-200 pl-4">
                        <p className="font-display font-black text-navy-950 text-base sm:text-lg leading-none">
                          {agent.propertiesForRent}
                        </p>
                        <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                          Properties for Rent
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact / Phone Reveal Button */}
                  <div>
                    {isPhoneRevealed ? (
                      <div className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        {agent.phone}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleRevealPhone(agent, e)}
                        className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                        title="Contact Preferred Agent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Call</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Detail Modal Popup when clicked */}
      {selectedAgentForModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative animate-scaleIn text-left">
            <button
              type="button"
              onClick={() => setSelectedAgentForModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={selectedAgentForModal.avatar}
                alt={selectedAgentForModal.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md">
                  TrustNest Preferred Agent
                </span>
                <h3 className="font-display font-extrabold text-xl text-navy-950 mt-1">
                  {selectedAgentForModal.name}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{selectedAgentForModal.agencyName}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 text-xs text-navy-900 border border-gray-200 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">RERA Registration:</span>
                <span className="font-bold text-teal-700 font-mono">{selectedAgentForModal.reraRegNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-bold">Operating since {selectedAgentForModal.operatingSince} ({new Date().getFullYear() - selectedAgentForModal.operatingSince} Years)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Track Record:</span>
                <span className="font-bold text-emerald-700">{selectedAgentForModal.buyersServed}+ Satisfied Buyers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Listings:</span>
                <span className="font-bold">{selectedAgentForModal.propertiesForSale} for Sale • {selectedAgentForModal.propertiesForRent || 0} for Rent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Core Expertise:</span>
                <span className="font-bold text-navy-950">{selectedAgentForModal.specialization}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAgentForModal(null);
                  onNavigate(`search?q=${encodeURIComponent(selectedAgentForModal.agencyName)}`);
                }}
                className="flex-1 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-extrabold rounded-xl text-xs text-center transition-all cursor-pointer"
              >
                View Agent's Listings
              </button>

              <button
                type="button"
                onClick={(e) => {
                  handleRevealPhone(selectedAgentForModal, e);
                }}
                className="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Agent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};