import React, { useRef, useState, useEffect } from 'react';
import { Building, ChevronRight, ChevronLeft, ShieldCheck, Phone, Download, X } from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';

interface ProjectItem {
  id: string;
  name: string;
  shortName: string;
  locality: string;
  city: string;
  price: string;
  image: string;
  developer: string;
  reraId: string;
  possession: string;
  configurations: string;
}

const GHAZIABAD_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-t-homes-ph2',
    name: 'T Homes Phase 2 Digital Residences',
    shortName: 'T Homes P...',
    locality: 'Siddharth Vi...',
    city: 'Ghaziabad',
    price: 'Call For Price',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    developer: 'T Homes Infra',
    reraId: 'UPRERAPRJ788910',
    possession: 'Ready / Q4 2026',
    configurations: '3, 4 BHK Smart Homes'
  },
  {
    id: 'proj-ats-floral',
    name: 'ATS Floral Pathways',
    shortName: 'ATS Floral ...',
    locality: 'National Hig...',
    city: 'Ghaziabad',
    price: '₹ 1.69 Cr-1.69 Cr',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
    developer: 'ATS Homekraft',
    reraId: 'UPRERAPRJ552211',
    possession: 'Under Construction (2027)',
    configurations: '3 BHK Luxury Suites'
  },
  {
    id: 'proj-apex-quebec',
    name: 'Apex Quebec Luxury Towers',
    shortName: 'Apex Que...',
    locality: 'Siddharth Vi...',
    city: 'Ghaziabad',
    price: '₹ 1.62 Cr-3.33 Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    developer: 'Apex Group',
    reraId: 'UPRERAPRJ882299',
    possession: 'Dec 2026',
    configurations: '3, 4 BHK Sky Mansions'
  },
  {
    id: 'proj-migsun-atharva',
    name: 'Migsun Atharva Residences',
    shortName: 'Migsun At...',
    locality: 'Raj Nagar Ext...',
    city: 'Ghaziabad',
    price: '₹ 1.14 Cr-3.10 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    developer: 'Migsun Real Estate',
    reraId: 'UPRERAPRJ993311',
    possession: 'Ready to Move',
    configurations: '2, 3 BHK Family Flats'
  },
  {
    id: 'proj-t-homes-1',
    name: 'T Homes Digitally Smart Living',
    shortName: 'T Homes',
    locality: 'Siddharth Vi...',
    city: 'Ghaziabad',
    price: '₹ 1.49 Cr-2.16 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    developer: 'T Homes Realty',
    reraId: 'UPRERAPRJ442299',
    possession: 'Ready to Move',
    configurations: '3 BHK High-Rise Apartments'
  },
  {
    id: 'proj-aigin-royal',
    name: 'AIGIN Royal Park Residences',
    shortName: 'AIGIN Roy...',
    locality: 'National Hig...',
    city: 'Ghaziabad',
    price: '₹ 1.91 Cr-2.81 Cr',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
    developer: 'AIGIN Developers',
    reraId: 'UPRERAPRJ331100',
    possession: 'March 2027',
    configurations: '3, 4 BHK Resort Residences'
  },
  {
    id: 'proj-gaur-cascades',
    name: 'Gaur Cascades High Rise',
    shortName: 'Gaur Casc...',
    locality: 'Raj Nagar Ext...',
    city: 'Ghaziabad',
    price: '₹ 1.25 Cr-2.45 Cr',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    developer: 'Gaursons India',
    reraId: 'UPRERAPRJ119922',
    possession: 'Ready to Move',
    configurations: '2, 3, 4 BHK Luxury Flats'
  },
  {
    id: 'proj-mahagun-puram',
    name: 'Mahagun Puram Classic',
    shortName: 'Mahagun P...',
    locality: 'NH 24 Mehra...',
    city: 'Ghaziabad',
    price: '₹ 85 L-1.65 Cr',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=400&q=80',
    developer: 'Mahagun Group',
    reraId: 'UPRERAPRJ771144',
    possession: 'Ready to Move',
    configurations: '2, 3 BHK Ready Homes'
  }
];

interface MagicHomesProjectsCarouselProps {
  onNavigate?: (route: string) => void;
  onExploreProject?: (query: string) => void;
}

export const MagicHomesProjectsCarousel: React.FC<MagicHomesProjectsCarouselProps> = ({
  onNavigate,
  onExploreProject
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll track every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleProjectClick = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setCallbackRequested(false);
  };

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('search?q=New+Projects&city=Ghaziabad');
    } else if (onExploreProject) {
      onExploreProject('New Projects Ghaziabad');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* ======================================================== */}
      {/* MAGICBRICKS MAGICHOMES SIGNATURE CARD (EXACT MATCH) */}
      {/* ======================================================== */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-7 relative group"
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3 text-left">
            {/* Coral Pink Building Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#D92228] shrink-0 shadow-2xs mt-0.5">
              <Building className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              {/* Title: 155 New Projects in Ghaziabad */}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  155 New Projects in Ghaziabad
                </h2>
                {/* magicHomes Logo Badge (Exact match) */}
                <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#FFF5F5] border border-red-200 text-[#D92228] font-bold text-[11px] leading-none">
                  <span>magic</span>
                  <span className="font-black">Homes</span>
                </div>
              </div>

              {/* Subtitle: As per your search preferences */}
              <p className="text-xs text-gray-500 mt-1">
                {language === 'hi'
                  ? 'आपकी खोज प्राथमिकताओं के अनुसार शीर्ष रेरा स्वीकृत प्रोजेक्ट्स'
                  : 'As per your search preferences'}
              </p>
            </div>
          </div>

          {/* Action Link: View All (155) > */}
          <button
            type="button"
            onClick={handleViewAll}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#D92228] hover:text-red-700 transition-colors shrink-0 pt-1 cursor-pointer"
          >
            <span>View All (155)</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Circular Projects Carousel Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-start gap-6 sm:gap-8 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          >
            {GHAZIABAD_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleProjectClick(proj)}
                className="flex flex-col items-center text-center cursor-pointer group/item shrink-0 w-[110px] sm:w-[125px]"
              >
                {/* Circular Image with Red Ring Border (Exact match to screenshot) */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 border-2 border-[#D92228] shadow-xs group-hover/item:scale-105 group-hover/item:border-red-600 transition-transform duration-300 relative bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Short Title (e.g. T Homes P..., ATS Floral ...) */}
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 mt-2.5 truncate w-full group-hover/item:text-[#D92228] transition-colors">
                  {proj.shortName}
                </h3>

                {/* Locality (e.g. Siddharth Vi..., National Hig...) */}
                <p className="text-[11px] text-gray-500 truncate w-full mt-0.5">
                  {proj.locality}
                </p>

                {/* Price (e.g. Call For Price, ₹ 1.69 Cr-1.69 Cr) */}
                <p className="text-[11px] font-semibold text-gray-700 truncate w-full mt-0.5">
                  {proj.price}
                </p>
              </div>
            ))}
          </div>

          {/* Right Floating Arrow Button (Exact match: Circular button with >) */}
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll projects right"
            className="absolute -right-3 top-1/3 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg flex items-center justify-center text-[#D92228] hover:bg-red-50 transition-all z-10 cursor-pointer active:scale-95 hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll projects left"
            className="absolute -left-3 top-1/3 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg flex items-center justify-center text-[#D92228] hover:bg-red-50 transition-all z-10 cursor-pointer active:scale-95 hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PROJECT DETAILS & BROCHURE DOWNLOAD MODAL */}
      {/* ======================================================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Project Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-[#D92228]">
                  UP RERA Approved
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black text-navy-950 mt-1">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-gray-600">
                  By {selectedProject.developer} • {selectedProject.locality}, {selectedProject.city}
                </p>
              </div>
            </div>

            {/* Key Specs Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs mb-5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Pricing</span>
                <p className="font-extrabold text-navy-950 text-sm mt-0.5">{selectedProject.price}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Configuration</span>
                <p className="font-bold text-gray-800 mt-0.5">{selectedProject.configurations}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Possession</span>
                <p className="font-bold text-emerald-700 mt-0.5">{selectedProject.possession}</p>
              </div>
            </div>

            {/* RERA and Highlights */}
            <div className="space-y-2 mb-6 text-xs text-gray-600">
              <div className="flex items-center gap-2 text-navy-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>RERA Registration ID: <strong className="font-mono text-[#D92228]">{selectedProject.reraId}</strong></span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Premium high-rise gated society with multi-tier biometric security, dedicated car parking, club house with Olympic size pool, and direct access to 60–100 ft wide arterial sector roads.
              </p>
            </div>

            {/* Action Row */}
            {callbackRequested ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-900 font-bold">
                ✓ Callback Requested! An authorized project manager for {selectedProject.shortName} will call you shortly.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCallbackRequested(true)}
                  className="w-full py-3 bg-[#D92228] hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request Instant Callback</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Official Project Factsheet - ${selectedProject.name}</title>
                            <style>
                              body { font-family: sans-serif; padding: 24px; color: #1e293b; }
                              .header { border-bottom: 3px solid #D92228; padding-bottom: 12px; margin-bottom: 20px; }
                              .title { font-size: 24px; font-weight: bold; color: #0f172a; }
                              .badge { background: #fee2e2; color: #b91c1c; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }
                              .specs { margin: 20px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                              .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <span class="badge">RERA VERIFIED PROJECT</span>
                              <div class="title">${selectedProject.name}</div>
                              <p>Developer: <strong>${selectedProject.developer}</strong> • Location: <strong>${selectedProject.locality}, ${selectedProject.city}</strong></p>
                              <p>RERA Registration Number: <strong>${selectedProject.reraId}</strong></p>
                            </div>
                            <div class="specs">
                              <div class="box"><strong>Pricing:</strong> ${selectedProject.price}</div>
                              <div class="box"><strong>Configurations:</strong> ${selectedProject.configurations}</div>
                              <div class="box"><strong>Possession Date:</strong> ${selectedProject.possession}</div>
                            </div>
                            <img src="${selectedProject.image}" style="max-width: 100%; border-radius: 12px; margin: 16px 0;" />
                            <p>Certified by TrustNest Verification Standards. For legal verification and in-principle loan sanction, visit trustnest.in.</p>
                            <script>window.onload = function() { window.print(); }</script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="w-full py-3 bg-white hover:bg-gray-50 text-navy-900 border border-gray-300 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Brochure PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
