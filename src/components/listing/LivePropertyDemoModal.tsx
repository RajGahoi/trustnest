import React, { useState } from 'react';
import { X, Video, Compass, CheckCircle2, ShieldCheck, Phone, MapPin, Sparkles, Volume2, VolumeX, MessageSquare, ChevronRight } from 'lucide-react';
import type { Listing } from '../../types';
import { useLanguage } from '../../domain/i18n/LanguageContext';

interface RoomDemo {
  id: string;
  name: string;
  icon: string;
  image: string;
  conditionNotes: string;
  specs: { label: string; value: string }[];
  hotspots: { x: number; y: number; title: string; desc: string }[];
}

interface LivePropertyDemoModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscriptionModal?: () => void;
}

export const LivePropertyDemoModal: React.FC<LivePropertyDemoModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenSubscriptionModal
}) => {
  const { language } = useLanguage();
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [panOffset, setPanOffset] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Inspector Rajiv (On-site)', text: 'Namaste! I am currently standing inside the property. You can ask me to inspect any corner or check water pressure.', time: 'Just now' }
  ]);
  const [userChatInput, setUserChatInput] = useState('');

  if (!isOpen || !listing) return null;

  // Curated room-by-room demo data tailored to the listing
  const rooms: RoomDemo[] = [
    {
      id: 'living',
      name: language === 'hi' ? 'लिविंग व डाइनिंग हॉल' : 'Living & Dining Hall',
      icon: '🛋️',
      image: listing.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
      conditionNotes: 'Spacious hall with 10.5 ft ceiling height, premium vitrified tiled flooring, wide entrance doorway, and direct balcony daylight.',
      specs: [
        { label: 'Room Dimensions', value: '18 ft × 14 ft (252 sq.ft)' },
        { label: 'Flooring Type', value: '2×2 Vitrified Tiles (Pristine)' },
        { label: 'Wall Finish', value: 'Asian Paints Royale Emulsion' },
        { label: 'Natural Light', value: 'Abundant East Sunlight' }
      ],
      hotspots: [
        { x: 30, y: 45, title: 'Doorway & Entrance', desc: 'Solid teakwood entrance door with safety grille.' },
        { x: 65, y: 70, title: 'Flooring Condition', desc: 'Level vitrified flooring, 100% moisture tested.' },
        { x: 80, y: 35, title: 'Ceiling & Wiring', desc: 'Concealed copper wiring with Havells modular switches.' }
      ]
    },
    {
      id: 'bedroom',
      name: language === 'hi' ? 'मास्टर बेडरूम' : 'Master Bedroom',
      icon: '🛏️',
      image: listing.images[1] || 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85',
      conditionNotes: 'Large bedroom with attached western washroom, cross ventilation window, and built-in wardrobe alcove.',
      specs: [
        { label: 'Room Dimensions', value: '14 ft × 12 ft (168 sq.ft)' },
        { label: 'Attached Bath', value: 'Yes (Western Style)' },
        { label: 'Window View', value: 'Overlooks Garden & 60 ft Road' },
        { label: 'AC Provision', value: 'Pre-installed Split AC Copper Piping' }
      ],
      hotspots: [
        { x: 50, y: 50, title: 'Wardrobe Niche', desc: 'Pre-fitted wooden wardrobe space.' },
        { x: 85, y: 40, title: 'Window Ventilation', desc: 'UPVC sliding window with mosquito mesh.' }
      ]
    },
    {
      id: 'kitchen',
      name: language === 'hi' ? 'मॉड्यूलर किचन' : 'Kitchen & Utility',
      icon: '🍳',
      image: listing.images[2] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      conditionNotes: 'Granite countertop with stainless steel sink, dual water taps (drinking & utility), piped gas provision, and exhaust chimney point.',
      specs: [
        { label: 'Countertop', value: 'Black Pearl Granite' },
        { label: 'Water Supply', value: '24/7 Municipal & Borewell Supply' },
        { label: 'Gas Line', value: 'PNG Pipeline Provision' },
        { label: 'Exhaust Outlet', value: 'Installed' }
      ],
      hotspots: [
        { x: 45, y: 60, title: 'Sink & Plumbing', desc: 'Tested high pressure water flow with no seepage.' },
        { x: 75, y: 30, title: 'Chimney Point', desc: 'Heavy duty 16A electrical socket for chimney.' }
      ]
    },
    {
      id: 'balcony',
      name: language === 'hi' ? 'बालकनी व सड़क व्यू' : 'Balcony & Road View',
      icon: '🌅',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      conditionNotes: 'Covered balcony overlooking wide municipal sector road with anti-skid ceramic tiles and stainless steel safety railing.',
      specs: [
        { label: 'Road Width Facing', value: listing.attributes?.roadWidth || '60 ft Municipal Road' },
        { label: 'Railing Safety', value: 'SS 304 Grade (4.2 ft height)' },
        { label: 'View Type', value: 'Unobstructed Open Sky & Greenery' },
        { label: 'Washing Machine Tap', value: 'Dedicated Inlet & Drain' }
      ],
      hotspots: [
        { x: 60, y: 40, title: 'Road Access View', desc: `Direct frontage on ${listing.attributes?.roadWidth || '60 ft wide road'}.` },
        { x: 30, y: 75, title: 'Drainage Test', desc: 'Free-flow rainwater discharge.' }
      ]
    }
  ];

  const currentRoom = rooms[activeRoomIndex];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newMsg = {
      sender: 'You',
      text: userChatInput.trim(),
      time: 'Just now'
    };
    setChatMessages(prev => [...prev, newMsg]);
    setUserChatInput('');

    // Simulated realistic inspector reply
    setTimeout(() => {
      const inspectorReply = {
        sender: 'Inspector Rajiv (On-site)',
        text: `Checked that right now for you! In the ${currentRoom.name}, the ceiling height is exact 10.5 ft and the walls have fresh Royale paint with zero seepage detected on our moisture meter.`,
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, inspectorReply]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn select-none overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-navy-900/15 overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn my-auto">
        {/* Top Header Bar */}
        <div className="bg-[#0B132B] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-sm sm:text-base text-white truncate">
                  {listing.title}
                </h3>
                <span className="bg-white/20 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded-md shrink-0">
                  {listing.formattedPrice}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate mt-0.5">
                <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                <span className="truncate">{listing.location.locality}, {listing.location.city}</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-400 font-bold">✓ 360° Verified Inspection</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live Video Walkthrough Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isLiveStreamActive
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isLiveStreamActive
                  ? (language === 'hi' ? 'लाइव स्ट्रीम बंद करें' : 'Exit Live Video')
                  : (language === 'hi' ? '🔴 लाइव वीडियो वॉकथ्रू' : '🔴 Start Live Video Call')}
              </span>
              <span className="sm:hidden">Live</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Demo"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Room Navigation Tabs Bar */}
        <div className="bg-gray-100 px-4 sm:px-6 py-2.5 border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
            {language === 'hi' ? 'कमरा चुनें:' : 'Select Room:'}
          </span>
          {rooms.map((room, idx) => (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                setActiveRoomIndex(idx);
                setActiveHotspot(null);
                setPanOffset(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeRoomIndex === idx
                  ? 'bg-[#D92228] text-white shadow-md'
                  : 'bg-white hover:bg-gray-200 text-navy-900 border border-gray-300'
              }`}
            >
              <span>{room.icon}</span>
              <span>{room.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Side: Interactive 360° Room Viewer & Live Feed (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between bg-navy-950 relative overflow-hidden min-h-[380px] sm:min-h-[460px]">
            {/* Room Image with 360° Panoramic Pan Simulation */}
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-black border border-white/10 group">
              <img
                src={currentRoom.image}
                alt={currentRoom.name}
                style={{ transform: `scale(1.1) translateX(${panOffset}px)` }}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
              />

              {/* Live Video Stream HUD Overlay if Live Stream is activated */}
              {isLiveStreamActive && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col justify-between p-4 z-20 animate-fadeIn">
                  {/* Top Live Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-red-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>LIVE FEED • 1080p 60FPS</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAudioMuted(!isAudioMuted)}
                        className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                        title={isAudioMuted ? 'Unmute' : 'Mute'}
                      >
                        {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                      <span className="bg-black/60 text-white text-[10px] font-mono px-2 py-1 rounded">
                        REC 00:04:18
                      </span>
                    </div>
                  </div>

                  {/* Inspector Pin-in-Picture Avatar */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2 bg-black/75 p-2 rounded-xl border border-white/20 text-white max-w-xs shadow-xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 overflow-hidden shrink-0 border border-white">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Inspector Rajiv"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left text-xs leading-tight">
                        <p className="font-bold text-white flex items-center gap-1">
                          <span>Rajiv Sharma</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                        </p>
                        <p className="text-[10px] text-gray-300">Verified Inspection Officer</p>
                        <p className="text-[9px] text-emerald-400 font-bold">● Streaming live from apartment</p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                      Dual Camera Stabilization Active
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive Hotspot Pins on Room Photo */}
              {!isLiveStreamActive && currentRoom.hotspots.map((hs, idx) => (
                <div
                  key={idx}
                  style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                  onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 text-white font-extrabold text-xs items-center justify-center shadow-lg border-2 border-white">
                      {idx + 1}
                    </span>
                  </span>

                  {/* Hotspot Card Popup */}
                  {activeHotspot === idx && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-56 bg-white text-navy-950 p-3 rounded-xl shadow-2xl border border-navy-900/10 text-xs z-30 animate-fadeIn text-left">
                      <p className="font-black text-navy-950 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{hs.title}</span>
                      </p>
                      <p className="text-gray-600 text-[10px] mt-1 leading-snug">
                        {hs.desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* 360° Pan Helper Overlay Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs flex items-center gap-3">
                <Compass className="w-4 h-4 text-orange-400 animate-spin" />
                <span className="font-bold text-[11px]">
                  {language === 'hi' ? '360° पैन नियंत्रण' : '360° Pan Controls'}
                </span>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={panOffset}
                  onChange={(e) => setPanOffset(Number(e.target.value))}
                  className="w-28 accent-orange-500 cursor-pointer"
                  title="Drag to look left or right"
                />
              </div>
            </div>

            {/* Room Condition Notes & Hotspot List */}
            <div className="mt-3.5 text-left text-white bg-white/5 border border-white/10 p-3 rounded-2xl">
              <p className="text-xs font-semibold text-gray-200">
                <span className="font-extrabold text-orange-400">
                  {language === 'hi' ? 'निरीक्षण नोट: ' : 'Inspector Note: '}
                </span>
                {currentRoom.conditionNotes}
              </p>
            </div>
          </div>

          {/* Right Side: Verified Room Specs & Live Q&A Chat (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 bg-gray-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 text-left">
            <div className="space-y-4">
              {/* Room Specifications Table */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy-950 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>{currentRoom.name} {language === 'hi' ? 'विनिर्देश' : 'Specs'}</span>
                </h4>

                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
                  {currentRoom.specs.map((spec, i) => (
                    <div key={i} className="px-3.5 py-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">{spec.label}</span>
                      <span className="text-navy-950 font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Property Inspection Audit Sheet */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs space-y-1.5 text-emerald-950">
                <div className="flex items-center gap-1.5 font-extrabold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>TrustNest Physical Audit Checklist</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-emerald-900 font-medium pt-1">
                  <div>✓ Wall Seepage: 0%</div>
                  <div>✓ Floor Level: Tested</div>
                  <div>✓ Water Flow: High PSI</div>
                  <div>✓ Road Access: {listing.attributes?.roadWidth || '60 ft'}</div>
                </div>
              </div>

              {/* Live Chat with Inspector */}
              <div>
                <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D92228]" />
                  <span>Live Inspection Q&A</span>
                </h5>

                <div className="bg-white rounded-2xl border border-gray-200 p-2.5 h-36 overflow-y-auto space-y-2 text-xs">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-2 rounded-xl ${msg.sender === 'You' ? 'bg-[#D92228]/10 text-gray-950 ml-4' : 'bg-gray-100 text-gray-800 mr-4'}`}>
                      <p className="font-extrabold text-[10px] text-gray-500">{msg.sender}</p>
                      <p className="text-[11px] mt-0.5">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder={language === 'hi' ? 'इंस्पेक्टर से सवाल पूछें...' : 'Ask inspector a question...'}
                    className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#D92228]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#D92228] hover:bg-[#BF1E23] text-white rounded-xl cursor-pointer shrink-0"
                    title="Send"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Actions: Book Physical Site Visit & Contact Owner */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Site visit requested for ${listing.title}! The owner/inspector will contact you to confirm the time slot.`);
                }}
                className="flex-1 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
              >
                {language === 'hi' ? '📅 साइट विजिट बुक करें' : '📅 Book In-Person Site Visit'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenSubscriptionModal) onOpenSubscriptionModal();
                }}
                className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'मालिक का नंबर देखें' : 'Contact Owner'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};