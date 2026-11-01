import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Search
} from 'lucide-react';

interface LocalityTrend {
  locality: string;
  avgRateSqft: number;
  rateRange: string;
  yoyGrowth: string;
  threeYearGrowth: string;
  rentalYield: string;
  demandTag: string;
}

const CITY_DATA: Record<string, LocalityTrend[]> = {
  'Gurugram': [
    { locality: 'Golf Course Extension Road', avgRateSqft: 15400, rateRange: '₹12,800 – ₹18,500', yoyGrowth: '+14.2%', threeYearGrowth: '+42.5%', rentalYield: '4.8%', demandTag: 'High Demand' },
    { locality: 'Cyber City & DLF Phase 2', avgRateSqft: 18800, rateRange: '₹15,500 – ₹24,000', yoyGrowth: '+11.8%', threeYearGrowth: '+36.2%', rentalYield: '5.2%', demandTag: 'Top Yield' },
    { locality: 'Dwarka Expressway (Sec 102-113)', avgRateSqft: 11600, rateRange: '₹9,200 – ₹14,500', yoyGrowth: '+18.4%', threeYearGrowth: '+56.8%', rentalYield: '4.2%', demandTag: 'Booming Corridor' },
    { locality: 'Sohna Road Corridor', avgRateSqft: 9400, rateRange: '₹7,800 – ₹11,200', yoyGrowth: '+9.1%', threeYearGrowth: '+28.4%', rentalYield: '4.0%', demandTag: 'Affordable Hub' },
    { locality: 'Sector 57 & Sushant Lok 2', avgRateSqft: 13200, rateRange: '₹11,000 – ₹16,000', yoyGrowth: '+12.5%', threeYearGrowth: '+38.0%', rentalYield: '4.5%', demandTag: 'Established' }
  ],
  'Noida': [
    { locality: 'Sector 150 Sports City', avgRateSqft: 10200, rateRange: '₹8,500 – ₹12,800', yoyGrowth: '+15.2%', threeYearGrowth: '+48.0%', rentalYield: '4.5%', demandTag: 'Green Living' },
    { locality: 'Sector 62 Institutional Zone', avgRateSqft: 8600, rateRange: '₹7,200 – ₹10,500', yoyGrowth: '+10.5%', threeYearGrowth: '+32.4%', rentalYield: '5.1%', demandTag: 'IT Hub' },
    { locality: 'Noida Expressway (Sec 137)', avgRateSqft: 9100, rateRange: '₹7,800 – ₹11,200', yoyGrowth: '+12.1%', threeYearGrowth: '+37.2%', rentalYield: '4.8%', demandTag: 'Metro Connected' },
    { locality: 'Greater Noida West (Noida Ext)', avgRateSqft: 6800, rateRange: '₹5,400 – ₹8,200', yoyGrowth: '+16.8%', threeYearGrowth: '+52.4%', rentalYield: '4.9%', demandTag: 'Highest Volume' },
    { locality: 'Sector 128 (Jaypee Greens)', avgRateSqft: 14500, rateRange: '₹12,000 – ₹19,000', yoyGrowth: '+13.4%', threeYearGrowth: '+40.6%', rentalYield: '4.3%', demandTag: 'Golf Residences' }
  ],
  'Mumbai MMR': [
    { locality: 'Worli Sea Face & Lower Parel', avgRateSqft: 51200, rateRange: '₹42,000 – ₹68,000', yoyGrowth: '+7.4%', threeYearGrowth: '+24.5%', rentalYield: '3.4%', demandTag: 'Ultra Luxury' },
    { locality: 'Bandra West (Pali Hill)', avgRateSqft: 58000, rateRange: '₹48,000 – ₹75,000', yoyGrowth: '+6.8%', threeYearGrowth: '+22.1%', rentalYield: '3.2%', demandTag: 'Prime Heritage' },
    { locality: 'Andheri West (Lokhandwala)', avgRateSqft: 29500, rateRange: '₹24,000 – ₹38,000', yoyGrowth: '+8.9%', threeYearGrowth: '+29.4%', rentalYield: '4.1%', demandTag: 'Bollywood Hub' },
    { locality: 'Thane West (Ghodbunder Rd)', avgRateSqft: 14600, rateRange: '₹11,500 – ₹18,000', yoyGrowth: '+11.5%', threeYearGrowth: '+38.6%', rentalYield: '4.5%', demandTag: 'High Growth' },
    { locality: 'Navi Mumbai (Kharghar / Ulwe)', avgRateSqft: 10800, rateRange: '₹8,400 – ₹13,500', yoyGrowth: '+14.6%', threeYearGrowth: '+46.2%', rentalYield: '4.6%', demandTag: 'Airport Impact' }
  ],
  'Bengaluru': [
    { locality: 'Whitefield (ITPL & EPIP Zone)', avgRateSqft: 9900, rateRange: '₹8,200 – ₹12,500', yoyGrowth: '+14.8%', threeYearGrowth: '+45.0%', rentalYield: '5.4%', demandTag: 'IT Corridor' },
    { locality: 'Indiranagar 100ft Road', avgRateSqft: 18600, rateRange: '₹15,000 – ₹24,000', yoyGrowth: '+8.6%', threeYearGrowth: '+26.8%', rentalYield: '4.3%', demandTag: 'Prime Central' },
    { locality: 'Sarjapur Road Corridor', avgRateSqft: 9200, rateRange: '₹7,500 – ₹11,800', yoyGrowth: '+16.2%', threeYearGrowth: '+51.2%', rentalYield: '5.1%', demandTag: 'High Rental Yield' },
    { locality: 'Electronic City Phase 1', avgRateSqft: 7100, rateRange: '₹5,800 – ₹8,900', yoyGrowth: '+11.4%', threeYearGrowth: '+34.5%', rentalYield: '5.8%', demandTag: 'Highest Yield' },
    { locality: 'Hebbal & Bellary Road', avgRateSqft: 12400, rateRange: '₹10,200 – ₹15,500', yoyGrowth: '+13.8%', threeYearGrowth: '+42.1%', rentalYield: '4.7%', demandTag: 'Airport Highway' }
  ],
  'Delhi NCR': [
    { locality: 'South Extension & Defence Colony', avgRateSqft: 28500, rateRange: '₹22,000 – ₹42,000', yoyGrowth: '+6.5%', threeYearGrowth: '+21.0%', rentalYield: '3.5%', demandTag: 'Prime South Delhi' },
    { locality: 'Dwarka Sector 11-19', avgRateSqft: 11800, rateRange: '₹9,500 – ₹14,500', yoyGrowth: '+10.2%', threeYearGrowth: '+31.4%', rentalYield: '4.2%', demandTag: 'Metro Hub' },
    { locality: 'Ghaziabad (Crossings Republik)', avgRateSqft: 5200, rateRange: '₹4,200 – ₹6,800', yoyGrowth: '+13.8%', threeYearGrowth: '+41.2%', rentalYield: '4.9%', demandTag: 'Rapidly Rising' },
    { locality: 'Raj Nagar Extension Ghaziabad', avgRateSqft: 4800, rateRange: '₹3,800 – ₹6,200', yoyGrowth: '+15.4%', threeYearGrowth: '+47.6%', rentalYield: '5.0%', demandTag: 'Best Value' }
  ]
};

interface RatesAndTrendsPageProps {
  onNavigate: (route: string) => void;
}

export const RatesAndTrendsPage: React.FC<RatesAndTrendsPageProps> = ({ onNavigate }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Gurugram');
  const trendsList = CITY_DATA[selectedCity] || CITY_DATA['Gurugram'];

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Live Q4 2026 Sub-Registrar & RERA Deeds Benchmarked
        </span>
      </div>

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <TrendingUp className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Property Rates & Market Trends in India
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Track live square-foot capital values, 1-year and 3-year historical appreciation, and rental yields across micro-markets.
        </p>
      </div>

      {/* City Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {Object.keys(CITY_DATA).map(city => (
          <button
            key={city}
            type="button"
            onClick={() => setSelectedCity(city)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedCity === city
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Locality Rates Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-navy-950">
              {selectedCity} Micro-Market Rates & Appreciation
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Updated weekly from registered property conveyances and builder launches.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(`search?city=${encodeURIComponent(selectedCity)}`)}
            className="px-5 py-2.5 rounded-xl bg-[#D92228] hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Search className="w-4 h-4" />
            <span>Browse {selectedCity} Properties</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="py-4 px-6">Locality / Corridor</th>
                <th className="py-4 px-6 text-right">Avg Rate (₹/sq.ft)</th>
                <th className="py-4 px-6 text-right">Price Range</th>
                <th className="py-4 px-6 text-right">1-Yr YoY Growth</th>
                <th className="py-4 px-6 text-right">3-Yr Growth</th>
                <th className="py-4 px-6 text-right">Rental Yield</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {trendsList.map((item) => (
                <tr key={item.locality} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-navy-950 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{item.locality}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {item.demandTag}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-black text-sm text-navy-950">
                    ₹ {item.avgRateSqft.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-600">
                    {item.rateRange}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-600">
                    {item.yoyGrowth}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-navy-900">
                    {item.threeYearGrowth}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-gray-700">
                    {item.rentalYield}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => onNavigate(`search?q=${encodeURIComponent(item.locality)}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-[#D92228] hover:text-white text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Listings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
