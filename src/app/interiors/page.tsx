import React, { useState } from 'react';
import { 
  Palette, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { formatINR } from '../../domain/india/currency';

interface InteriorsPageProps {
  onNavigate: (route: string) => void;
}

export const InteriorsPage: React.FC<InteriorsPageProps> = ({ onNavigate }) => {
  const [bhk, setBhk] = useState<'1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Villa'>('2 BHK');
  const [packageTier, setPackageTier] = useState<'essential' | 'premium' | 'luxury'>('premium');
  
  // Scope Checkboxes
  const [kitchen, setKitchen] = useState(true);
  const [wardrobes, setWardrobes] = useState(true);
  const [falseCeiling, setFalseCeiling] = useState(true);
  const [tvUnit, setTvUnit] = useState(true);
  const [vanities, setVanities] = useState(true);
  const [painting, setPainting] = useState(true);

  // Booking Modal
  const [booked, setBooked] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Calculation
  const baseMap: Record<string, number> = {
    '1 BHK': 290000,
    '2 BHK': 460000,
    '3 BHK': 710000,
    '4 BHK': 980000,
    'Villa': 1450000
  };

  const multiplier = packageTier === 'essential' ? 1.0 : packageTier === 'premium' ? 1.45 : 2.15;
  
  let scopeWeight = 0;
  if (kitchen) scopeWeight += 1.0;
  if (wardrobes) scopeWeight += 1.0;
  if (falseCeiling) scopeWeight += 0.65;
  if (tvUnit) scopeWeight += 0.55;
  if (vanities) scopeWeight += 0.40;
  if (painting) scopeWeight += 0.50;

  const totalInteriorCost = Math.round(baseMap[bhk] * multiplier * (scopeWeight / 4.1));

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          10-Year Warranty & 45-Day Handover Guarantee
        </span>
      </div>

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
          <Palette className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Home Interiors Budget Estimator
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Get transparent, room-by-room modular interior estimates tailored to your floor plan and chosen finishes.
        </p>
      </div>

      {/* Estimator Studio Layout */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Column (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Configuration */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                1. Select Home Configuration
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'] as const).map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBhk(item)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                      bhk === item
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Package Tier */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                2. Select Material & Finish Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'essential',
                    name: 'Essential',
                    desc: 'MR Grade Commercial Ply + 1mm Matte Laminates',
                    badge: 'Budget Friendly'
                  },
                  {
                    id: 'premium',
                    name: 'Premium',
                    desc: 'BWP Marine Ply + High Gloss Acrylic & Soft Close',
                    badge: 'Most Popular'
                  },
                  {
                    id: 'luxury',
                    name: 'Luxury',
                    desc: 'Boiling Waterproof + Italian PU Polish & Blum Hardware',
                    badge: 'Architect Signature'
                  }
                ].map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setPackageTier(pkg.id as any)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      packageTier === pkg.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-extrabold text-sm text-navy-950">{pkg.name}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                          {pkg.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug">{pkg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Scope of Work */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                3. Scope of Work Included
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { label: 'Modular Kitchen with Tandem Drawers & Chimney', state: kitchen, set: setKitchen },
                  { label: 'Bedroom Sliding Wardrobes with Upper Lofts', state: wardrobes, set: setWardrobes },
                  { label: 'Gypsum False Ceiling with LED Ambient Spots', state: falseCeiling, set: setFalseCeiling },
                  { label: 'Living Room TV Entertainment Unit & Wall Panelling', state: tvUnit, set: setTvUnit },
                  { label: 'Bathroom Storage Vanities with LED Mirrors', state: vanities, set: setVanities },
                  { label: 'Full Home Premium Royal Emulsion Painting', state: painting, set: setPainting }
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={e => item.set(e.target.checked)}
                      className="rounded text-purple-600 accent-purple-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Result & Booking Form (Col 5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 via-white to-pink-50 border border-purple-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Estimated Modular Interior Cost
              </span>
              <p className="font-mono font-black text-3xl sm:text-4xl text-purple-900 mt-1.5">
                {formatINR(totalInteriorCost)}
              </p>
              <span className="text-[11px] text-gray-500 block mt-1">
                For {bhk} ({packageTier.toUpperCase()}) • Turnkey execution
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700 p-3.5 bg-white rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>45-day move-in guarantee with penalty clause</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>10-year warranty on all woodwork & hardware</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>146 quality checks & zero hidden cost promise</span>
              </div>
            </div>

            {/* Consultation Booking Form */}
            {booked ? (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">Free 3D Design Session Booked!</h4>
                <p className="text-xs text-emerald-800">
                  Our chief interior designer will connect with you in 2 hours with tailored 3D layouts for your {bhk}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-navy-950 uppercase tracking-wider">
                  Book Free 3D Design Consultation
                </h4>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile (+91)"
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Free 3D Session & Get Renders</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
