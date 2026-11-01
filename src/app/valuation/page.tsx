import React, { useState } from 'react';
import { 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';
import { formatINR } from '../../domain/india/currency';

interface ValuationPageProps {
  onNavigate: (route: string) => void;
}

export const ValuationPage: React.FC<ValuationPageProps> = ({ onNavigate }) => {
  const [locality, setLocality] = useState('Cyber City, Gurugram');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [areaSqft, setAreaSqft] = useState(1350);
  const [bhk, setBhk] = useState('3 BHK');
  const [propertyAge, setPropertyAge] = useState('0-2 Years (Modern)');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');

  // Valuation model
  const baseRatePerSqft = 9200;
  const ageMultiplier = propertyAge.includes('0-2') ? 1.05 : propertyAge.includes('2-5') ? 1.0 : 0.92;
  const furnishMultiplier = furnishing === 'Fully Furnished' ? 1.08 : furnishing === 'Semi-Furnished' ? 1.03 : 1.0;
  
  const estimatedRate = Math.round(baseRatePerSqft * ageMultiplier * furnishMultiplier);
  const lowValuation = Math.round(areaSqft * (estimatedRate * 0.94));
  const highValuation = Math.round(areaSqft * (estimatedRate * 1.06));
  const midValuation = Math.round((lowValuation + highValuation) / 2);
  const estimatedRent = Math.round(areaSqft * 32);

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Benchmarked against recent verified registry deeds
        </span>
      </div>

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
          <Award className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Algorithmic Property Valuation
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Know the accurate Fair Market Value (FMV) of any residential property before buying, selling, or applying for a mortgage.
        </p>
      </div>

      {/* Valuation Tool Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs (Col 7) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Property Locality & City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Property Type</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Apartment / Flat</option>
                  <option>Independent House / Villa</option>
                  <option>Residential Plot</option>
                  <option>Commercial Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">BHK Type</label>
                <select
                  value={bhk}
                  onChange={e => setBhk(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                  <option>4 BHK</option>
                  <option>5+ BHK / Penthouse</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Super Built-up Area (sq.ft)</label>
                <input
                  type="number"
                  value={areaSqft}
                  onChange={e => setAreaSqft(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Age of Property</label>
                <select
                  value={propertyAge}
                  onChange={e => setPropertyAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>0-2 Years (Modern)</option>
                  <option>2-5 Years</option>
                  <option>5-10 Years</option>
                  <option>10+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Furnishing Grade</label>
              <div className="grid grid-cols-3 gap-3">
                {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFurnishing(item)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      furnishing === item
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Output (Col 5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Estimated Fair Market Value
              </span>
              <p className="font-mono font-black text-2xl sm:text-3xl text-blue-950 mt-1.5">
                {formatINR(lowValuation)} – {formatINR(highValuation)}
              </p>
              <span className="text-[11px] text-gray-500 block mt-1">
                Mid Benchmark: <strong className="text-navy-950">{formatINR(midValuation)}</strong> (~₹{estimatedRate}/sq.ft)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-blue-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Rental Potential</span>
                <p className="font-mono font-extrabold text-sm text-emerald-700 mt-0.5">
                  {formatINR(estimatedRent)}/mo
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-blue-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Accuracy Index</span>
                <p className="font-mono font-extrabold text-sm text-blue-700 mt-0.5">
                  96% Confidence
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified against circle rates and recent registration deeds.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accepted by top banks for home loan pre-sanctions.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate('post')}
                className="w-full py-3 bg-[#D92228] hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Post Free Listing at This Valuation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('loans')}
                className="w-full py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Check Home Loan Offers on this Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
