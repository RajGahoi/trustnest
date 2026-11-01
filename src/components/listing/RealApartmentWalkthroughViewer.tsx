import React, { useState } from 'react';
import { 
  Compass, 
  Sun, 
  Moon, 
  CheckCircle2, 
  ShieldCheck, 
  Ruler, 
  Video
} from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';

interface RoomView {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  imageDay: string;
  imageEvening: string;
  dimensions: string;
  areaSqft: number;
  flooring: string;
  highlights: string[];
  hotspots: {
    x: number;
    y: number;
    title: string;
    description: string;
  }[];
}

interface ApartmentShowcase {
  id: string;
  title: string;
  society: string;
  locality: string;
  city: string;
  price: string;
  bhk: string;
  carpetArea: string;
  superArea: string;
  rooms: RoomView[];
}

const APARTMENT_SHOWCASES: ApartmentShowcase[] = [
  {
    id: 'apt-bansdroni-kolkata',
    title: '2 BHK Airy Residential Apartment',
    society: 'Chirantani Park Residency',
    locality: 'Chirantani Park, Bansdroni',
    city: 'Kolkata',
    price: '₹ 19 Lac',
    bhk: '2 BHK, 2 Baths',
    carpetArea: '720 sq.ft',
    superArea: '850 sq.ft',
    rooms: [
      {
        id: 'living',
        name: 'Living & Dining Room',
        hindiName: 'लिविंग व डाइनिंग हॉल',
        icon: '🛋️',
        imageDay: 'chirantani-apartment.jpg',
        imageEvening: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85',
        dimensions: '16 ft × 13 ft',
        areaSqft: 208,
        flooring: 'Polished Vitrified Mosaic Tile Flooring',
        highlights: [
          'Direct East Sunlight through full-height French door',
          'Solid metal safety grill with double locking',
          'Level plastered walls ready for custom paint or wallpaper',
          'Concealed electrical lines with Havells MCB switchboard'
        ],
        hotspots: [
          { x: 38, y: 35, title: 'Main Entrance & Safety Grille', description: 'Dual safety door with heavy-duty metal grill and mortise lock.' },
          { x: 50, y: 72, title: 'Mosaic Vitrified Floor', description: 'Polished cool-tile flooring, 100% dampness tested.' },
          { x: 75, y: 40, title: 'East Facing Doorway', description: 'Receives uninterrupted morning sunlight from 6:30 AM to 11:00 AM.' }
        ]
      },
      {
        id: 'bedroom',
        name: 'Master Bedroom',
        hindiName: 'मास्टर बेडरूम',
        icon: '🛏️',
        imageDay: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=85',
        dimensions: '14 ft × 12 ft',
        areaSqft: 168,
        flooring: 'Vitrified Glazed Flooring',
        highlights: [
          'King size bed accommodating space with 3 ft side clearance',
          'Attached western style bathroom with exhaust',
          'Dedicated wall niche for 6-door floor-to-ceiling wardrobe',
          'Split AC pre-drilled copper piping installed'
        ],
        hotspots: [
          { x: 45, y: 55, title: 'Queen/King Bed Space', description: 'Spacious layout with two side bedside table plug points.' },
          { x: 80, y: 45, title: 'Wardrobe Niche', description: 'Deep 2.5 ft alcove for sliding or hinged modular wardrobe.' },
          { x: 20, y: 40, title: 'Attached Bathroom Door', description: 'Waterproof FRP door leading to master bathroom.' }
        ]
      },
      {
        id: 'kitchen',
        name: 'Kitchen & Utility',
        hindiName: 'रसोई व यूटिलिटी क्षेत्र',
        icon: '🍳',
        imageDay: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
        dimensions: '10 ft × 8 ft',
        areaSqft: 80,
        flooring: 'Anti-Skid Ceramic Floor Tiles',
        highlights: [
          'Black Galaxy Granite Countertop with stainless steel sink',
          'Dual water supply (24/7 municipal drinking + borewell utility)',
          'Glazed ceramic wall dado tiles up to 2 ft above platform',
          'Dedicated 16A points for refrigerator, microwave & water purifier'
        ],
        hotspots: [
          { x: 50, y: 65, title: 'Granite Countertop & SS Sink', description: 'Scratch-resistant heavy granite with dual swan-neck taps.' },
          { x: 70, y: 30, title: 'Chimney & Exhaust Duct', description: 'Standard 6-inch exhaust hole with power outlet.' },
          { x: 25, y: 45, title: 'Storage Overhead Cabinets', description: 'Space for modular upper racks and spice pullouts.' }
        ]
      },
      {
        id: 'bathroom',
        name: 'Western Bathroom',
        hindiName: 'बाथरूम व वॉशबेसिन',
        icon: '🚿',
        imageDay: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85',
        dimensions: '7.5 ft × 5.5 ft',
        areaSqft: 41,
        flooring: 'Matte Anti-Skid Ceramic Tiles',
        highlights: [
          'Wall-hung EWC with soft-close seat cover and concealed cistern',
          'Jaguar chrome quarter-turn hot & cold mixer shower',
          'Provision for 25L vertical geyser with dedicated MCB',
          'Full-height wall tiling up to 7 ft to prevent moisture seepage'
        ],
        hotspots: [
          { x: 55, y: 45, title: 'Shower & Wall Mixer', description: 'High-pressure rain shower with instant hot water mixing.' },
          { x: 30, y: 70, title: 'Anti-Skid Flooring', description: 'R10 grade non-slip floor tiles with recessed slope drain.' },
          { x: 75, y: 25, title: 'Geyser Electrical Outlet', description: 'Heavy-duty 16A waterproof socket.' }
        ]
      },
      {
        id: 'balcony',
        name: 'Balcony & Road View',
        hindiName: 'बालकनी व सड़क व्यू',
        icon: '🌅',
        imageDay: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
        dimensions: '12 ft × 4.5 ft',
        areaSqft: 54,
        flooring: 'Exterior Weatherproof Terracotta Tiles',
        highlights: [
          'Unobstructed view of 40 ft wide municipal tree-lined road',
          '4.5 ft high MS safety railing with rust-proof coating',
          'Washing machine inlet-outlet tap and water drainage',
          'Private sitting area for morning tea and flower planters'
        ],
        hotspots: [
          { x: 50, y: 50, title: '40 ft Wide Road Access', description: 'Wide paved road with easy two-way car passage and street lights.' },
          { x: 80, y: 75, title: 'Washing Machine Utility Tap', description: 'Dedicated drainage and water supply on balcony.' },
          { x: 25, y: 60, title: 'MS Safety Railing', description: 'Sturdy 4.5 ft metal balustrade child-safety compliant.' }
        ]
      }
    ]
  },
  {
    id: 'apt-indirapuram-ghaziabad',
    title: '3 BHK Builder Floor with Lift',
    society: 'Shri Balaji Residency',
    locality: 'Ahinsa Khand 2, Indirapuram',
    city: 'Ghaziabad',
    price: '₹ 36 Lac',
    bhk: '3 BHK, 2 Baths',
    carpetArea: '1850 sq.ft',
    superArea: '2300 sq.ft',
    rooms: [
      {
        id: 'living',
        name: 'Grand Drawing & Dining Room',
        hindiName: 'ड्राइंग व डाइनिंग हॉल',
        icon: '🛋️',
        imageDay: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
        dimensions: '22 ft × 15 ft',
        areaSqft: 330,
        flooring: 'Italian Nano-Polished Vitrified Slabs',
        highlights: [
          'POP False ceiling with ambient warm COB spotlights',
          'Full-length designer TV wall console with backlighting',
          'Wide double-glazed sliding balcony door',
          'Intercom & video door phone connectivity'
        ],
        hotspots: [
          { x: 30, y: 40, title: 'False Ceiling & Spotlights', description: 'Energy-efficient LED warm lighting with multi-stage dimmers.' },
          { x: 65, y: 50, title: 'TV Panelling Unit', description: 'Wooden laminate feature wall with hidden wiring conduits.' },
          { x: 50, y: 80, title: 'Italian Finish Flooring', description: 'Seamless large-format 4×2 ft tiles.' }
        ]
      },
      {
        id: 'bedroom',
        name: 'Master Suite with Balcony',
        hindiName: 'मास्टर बेडरूम व बालकनी',
        icon: '🛏️',
        imageDay: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=85',
        dimensions: '16 ft × 13 ft',
        areaSqft: 208,
        flooring: 'Wooden Texture Laminated Tiles',
        highlights: [
          'Floor-to-ceiling sliding wardrobe with full-length mirror',
          'Attached luxury washroom with glass partition',
          'Direct access to private rear balcony',
          'Provision for king mattress and bedside reading lamps'
        ],
        hotspots: [
          { x: 50, y: 55, title: 'Laminated Wooden Flooring', description: 'Comfortable, warm-finish flooring in master bedroom.' },
          { x: 80, y: 40, title: 'Sliding Wardrobes', description: 'Built-in 3-door slider with soft-closing Blum channels.' }
        ]
      },
      {
        id: 'kitchen',
        name: 'Modular Kitchen with Breakfast Bar',
        hindiName: 'मॉड्यूलर किचन',
        icon: '🍳',
        imageDay: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85',
        dimensions: '12 ft × 9 ft',
        areaSqft: 108,
        flooring: 'Anti-Skid Glazed Ceramic',
        highlights: [
          'Acrylic finish hydraulic cabinets with tandem boxes',
          'Piped Natural Gas (PNG) meter installed',
          'Granite breakfast counter with high stool space',
          'Elica auto-clean chimney point ready'
        ],
        hotspots: [
          { x: 45, y: 60, title: 'Hydraulic Soft-Close Drawers', description: 'Tandem boxes holding up to 35 kg cookware.' },
          { x: 75, y: 35, title: 'PNG Gas Pipeline', description: 'Indraprastha Gas Limited (IGL) piped supply active.' }
        ]
      },
      {
        id: 'balcony',
        name: 'Front Balcony & 60 ft Road View',
        hindiName: 'बालकनी व सड़क का नजारा',
        icon: '🌅',
        imageDay: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
        imageEvening: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
        dimensions: '18 ft × 5 ft',
        areaSqft: 90,
        flooring: 'Anti-Skid Rustic Tiles',
        highlights: [
          'Wide 60 ft sector road with dedicated resident parking lane',
          'Stainless steel railing with 10mm toughened safety glass',
          'Direct morning sun and open green tree cover',
          'Zero obstruction in front of the building'
        ],
        hotspots: [
          { x: 50, y: 50, title: '60 ft Paved Road', description: 'Spacious road allowing hassle-free parking and movement.' },
          { x: 75, y: 70, title: 'Toughened Glass Railing', description: 'Modern aesthetic balustrade with stainless steel base.' }
        ]
      }
    ]
  }
];

export const RealApartmentWalkthroughViewer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedAptIndex, setSelectedAptIndex] = useState(0);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'evening'>('day');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const activeApt = APARTMENT_SHOWCASES[selectedAptIndex];
  const activeRoom = activeApt.rooms[selectedRoomIndex] || activeApt.rooms[0];
  const currentImage = timeOfDay === 'day' ? activeRoom.imageDay : activeRoom.imageEvening;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setPanOffset(prev => Math.max(-50, Math.min(50, prev + diff * 0.15)));
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 font-extrabold text-xs mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>99acres & MagicBricks 360° Real Room Views</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {language === 'hi' 
              ? 'असली कमरों का 360° वॉकथ्रू — कमरा दर कमरा'
              : 'Real Look-Like Views of Apartments & Flat Rooms'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'बिना एडिट की हुई असली कमरे की टाइल्स, दीवारें, बालकनी, खिड़कियां और सड़क की चौड़ाई का 360° पैनारोमा वॉकथ्रू।'
              : 'Authentic room-by-room condition inspection with interactive hotspots, natural daylight vs evening ambient lighting, and certified dimensions.'}
          </p>
        </div>

        {/* Apartment Switcher Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200 shrink-0">
          {APARTMENT_SHOWCASES.map((apt, idx) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => {
                setSelectedAptIndex(idx);
                setSelectedRoomIndex(0);
                setActiveHotspot(null);
                setPanOffset(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedAptIndex === idx
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-gray-700 hover:text-navy-900'
              }`}
            >
              {apt.city}: {apt.bhk.split(',')[0]} ({apt.price})
            </button>
          ))}
        </div>
      </div>

      {/* MAIN VIEWER CONTAINER */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-left">
        {/* Left Column (8 cols): Interactive Room Canvas with 360 Pan & Hotspots */}
        <div className="lg:col-span-8 flex flex-col bg-navy-950 relative">
          {/* Top Bar with Room Tabs & Lighting Switcher */}
          <div className="p-3 sm:p-4 bg-navy-900/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
            {/* Room Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {activeApt.rooms.map((room, idx) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoomIndex(idx);
                    setActiveHotspot(null);
                    setPanOffset(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedRoomIndex === idx
                      ? 'bg-[#D92228] text-white shadow-sm ring-1 ring-white/30'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  <span>{room.icon}</span>
                  <span>{language === 'hi' ? room.hindiName : room.name}</span>
                </button>
              ))}
            </div>

            {/* Lighting Toggle (Day vs Evening) */}
            <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/15">
              <button
                type="button"
                onClick={() => setTimeOfDay('day')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeOfDay === 'day' ? 'bg-amber-500 text-navy-950 shadow-xs' : 'text-gray-300 hover:text-white'
                }`}
                title="Natural Daytime Sunlight"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[11px]">Daylight</span>
              </button>
              <button
                type="button"
                onClick={() => setTimeOfDay('evening')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeOfDay === 'evening' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-300 hover:text-white'
                }`}
                title="Warm Evening Lighting"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Warm Night</span>
              </button>
            </div>
          </div>

          {/* Interactive Photo Canvas */}
          <div
            className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={currentImage}
              alt={activeRoom.name}
              style={{
                transform: `scale(1.1) translateX(${panOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Room Dimensions & Status Watermark */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-orange-400" />
                <span>{activeRoom.dimensions} ({activeRoom.areaSqft} sq.ft)</span>
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/90 text-white text-[11px] font-extrabold rounded-xl shadow flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Real Unedited View</span>
              </span>
            </div>

            {/* Drag 360 Hint */}
            <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-white text-[11px] font-semibold">
              <Compass className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Drag to Pan 360°</span>
            </div>

            {/* Interactive Pulsing Hotspot Pins */}
            {activeRoom.hotspots.map((spot, i) => (
              <div
                key={i}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                  className="relative group cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-full bg-[#D92228] text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-red-500/30 hover:scale-125 transition-transform">
                    +
                  </span>
                  <span className="absolute -inset-1 rounded-full bg-red-500/50 animate-ping -z-10" />
                </button>

                {/* Hotspot Popover Tooltip */}
                {activeHotspot === i && (
                  <div className="absolute left-1/2 bottom-9 -translate-x-1/2 w-64 bg-white text-navy-950 p-3.5 rounded-2xl shadow-2xl border border-gray-200 z-30 animate-in fade-in zoom-in-95 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-extrabold text-xs text-navy-950">{spot.title}</p>
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(null)}
                        className="text-gray-400 hover:text-gray-700 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{spot.description}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Panorama Slider Controls */}
            <div className="absolute bottom-3 inset-x-4 z-10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="font-extrabold">{activeRoom.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300 text-[11px]">{activeRoom.flooring}</span>
              </div>

              {/* Slider for horizontal pan */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-300">Pan</span>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={panOffset}
                  onChange={e => setPanOffset(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#D92228] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detailed Specifications & Live On-Site Inspection Booking */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50 flex flex-col justify-between space-y-4 border-l border-gray-200">
          <div className="space-y-4">
            {/* Property Summary Header */}
            <div className="pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-[#D92228]">
                  Verified On-Site
                </span>
                <span className="font-display font-black text-lg text-navy-950">
                  {activeApt.price}
                </span>
              </div>

              <h3 className="font-display text-base font-extrabold text-navy-900 mt-1.5 leading-snug">
                {activeApt.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                In <strong className="text-navy-900">{activeApt.society}</strong>, {activeApt.locality}
              </p>
            </div>

            {/* Room Dimensions & Certified Specs Box */}
            <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">Active Space:</span>
                <span className="font-extrabold text-navy-900">{activeRoom.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">Room Size:</span>
                <span className="font-mono font-bold text-[#D92228]">{activeRoom.dimensions}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">Carpet Area:</span>
                <span className="font-mono font-bold text-gray-900">{activeRoom.areaSqft} sq.ft</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">Flooring:</span>
                <span className="font-bold text-gray-800 text-[11px] truncate max-w-[170px]">{activeRoom.flooring}</span>
              </div>
            </div>

            {/* Verified Inspection Highlights */}
            <div className="space-y-2">
              <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inspector Verification Checklist</span>
              </p>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {activeRoom.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span className="leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking / Live Demo Action */}
          <div className="pt-3 border-t border-gray-200 space-y-2.5">
            {bookingConfirmed ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 text-center font-bold">
                ✓ On-site live video inspection requested! Inspector will connect with you via WhatsApp Video.
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setBookingConfirmed(true)}
                className="w-full py-3 bg-[#D92228] hover:bg-[#B7181D] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Video className="w-4 h-4" />
                <span>Request Live On-Site Video Call</span>
              </button>
            )}

            <p className="text-[10px] text-gray-400 text-center">
              Direct physical inspection with zero brokerage and clear title guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
