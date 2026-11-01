import React, { useState, useRef } from 'react';
import { 
  Calculator, 
  Home, 
  Palette, 
  TrendingUp, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { TRANSLATIONS } from '../../domain/i18n/translations';
import { formatINR } from '../../domain/india/currency';

type TranslationKey = keyof typeof TRANSLATIONS['en'];

interface ToolItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  defaultTitle: string;
  defaultDesc: string;
  badge?: string;
  modalType: 'emi' | 'loan' | 'interiors' | 'trends' | 'valuation';
}

export const AdviceAndToolsRail: React.FC = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(4500000); // 45 Lakhs
  const [interestRate, setInterestRate] = useState(7.2); // 7.2%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Interiors Estimator State
  const [interiorBhk, setInteriorBhk] = useState<'1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Villa'>('2 BHK');
  const [interiorPackage, setInteriorPackage] = useState<'essential' | 'premium' | 'luxury'>('premium');
  const [interiorKitchen, setInteriorKitchen] = useState(true);
  const [interiorWardrobe, setInteriorWardrobe] = useState(true);
  const [interiorFalseCeiling, setInteriorFalseCeiling] = useState(true);
  const [interiorLivingUnit, setInteriorLivingUnit] = useState(true);
  const [interiorBooked, setInteriorBooked] = useState(false);

  // Rates & Trends State
  const [selectedTrendsCity, setSelectedTrendsCity] = useState('Gurugram');

  // Valuation State
  const [valuationLocality, setValuationLocality] = useState('Cyber City, Gurugram');
  const [valuationArea, setValuationArea] = useState(1250);
  const [valuationBhk, setValuationBhk] = useState('2 BHK');

  // Calculate EMI
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const calculatedEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = calculatedEmi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  // Calculate Interiors Estimate
  const interiorBaseMap: Record<string, number> = {
    '1 BHK': 280000,
    '2 BHK': 450000,
    '3 BHK': 680000,
    '4 BHK': 950000,
    'Villa': 1400000
  };
  const multiplier = interiorPackage === 'essential' ? 1.0 : interiorPackage === 'premium' ? 1.45 : 2.1;
  let itemsCount = 0;
  if (interiorKitchen) itemsCount += 1;
  if (interiorWardrobe) itemsCount += 1;
  if (interiorFalseCeiling) itemsCount += 0.7;
  if (interiorLivingUnit) itemsCount += 0.6;
  const estimatedInteriorCost = Math.round(interiorBaseMap[interiorBhk] * multiplier * (itemsCount / 3.3));

  // Tools list matching the user screenshot
  const TOOLS: ToolItem[] = [
    {
      id: 'tool-emi',
      icon: Calculator,
      titleKey: 'emiCalculatorTitle',
      descKey: 'emiCalculatorDesc',
      defaultTitle: 'EMI Calculator',
      defaultDesc: "Know how much you'll have to pay every month on your loan",
      modalType: 'emi'
    },
    {
      id: 'tool-loans',
      icon: Home,
      titleKey: 'bestLoanOffersTitle',
      descKey: 'bestLoanOffersDesc',
      defaultTitle: 'Best Home Loan Offers',
      defaultDesc: 'Get the best bank offers curated just for your profile',
      badge: '40+ Banks',
      modalType: 'loan'
    },
    {
      id: 'tool-interiors',
      icon: Palette,
      titleKey: 'interiorsEstimatorTitle',
      descKey: 'interiorsEstimatorDesc',
      defaultTitle: 'Interiors Budget Estimator',
      defaultDesc: 'Know the cost of getting your full/partial home interiors done',
      badge: 'Instant Estimate',
      modalType: 'interiors'
    },
    {
      id: 'tool-trends',
      icon: TrendingUp,
      titleKey: 'ratesAndTrendsTitle',
      descKey: 'ratesAndTrendsDesc',
      defaultTitle: 'Rates & Trends',
      defaultDesc: 'Know all about Property Rates & Trends in your city',
      badge: 'Q4 2026 Live',
      modalType: 'trends'
    },
    {
      id: 'tool-valuation',
      icon: Award,
      titleKey: 'propertyValuationTitle',
      descKey: 'propertyValuationDesc',
      defaultTitle: 'Property Valuation',
      defaultDesc: 'Know the right market value of any property before buying or selling',
      modalType: 'valuation'
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* SECTION HEADER WITH SIGNATURE TEAL UNDERLINE (EXACT SCREENSHOT MATCH) */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {t('adviceAndTools') || 'Advice & Tools'}
          </h2>
          {/* Exact Teal Underline under first word */}
          <div className="w-12 h-1 bg-teal-500 rounded-full mt-1.5" />
        </div>

        {/* Navigation Arrows for Slider */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll tools left"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-xs hover:shadow-md hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll tools right"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-xs hover:shadow-md hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLLABLE RAIL OF CARDS (EXACT MATCH TO MAGICBRICKS SCREENSHOT) */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveModal(tool.modalType)}
              className="min-w-[260px] sm:min-w-[280px] lg:min-w-[290px] max-w-[310px] bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-gray-300 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer group shrink-0"
            >
              <div>
                {/* Header Row with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-red-600 group-hover:scale-110 group-hover:bg-red-50 transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                  {t(tool.titleKey) || tool.defaultTitle}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {t(tool.descKey) || tool.defaultDesc}
                </p>
              </div>

              {/* Action Link (View now →) */}
              <div className="pt-5 mt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 font-bold text-xs sm:text-sm text-red-600 group-hover:text-red-700 group-hover:translate-x-1 transition-all">
                  <span>{t('viewNow') || 'View now →'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. EMI CALCULATOR MODAL */}
      {/* ======================================================== */}
      {activeModal === 'emi' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
                {t('emiCalculatorTitle') || 'Home Loan EMI Calculator'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Adjust loan amount, interest rate and tenure to plan your monthly budget.
            </p>

            <div className="space-y-5">
              {/* Loan Amount Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-navy-900 mb-1.5">
                  <span>Loan Amount</span>
                  <span className="text-base font-extrabold text-[#D92228] font-mono">
                    {formatINR(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={30000000}
                  step={100000}
                  value={loanAmount}
                  onChange={e => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#D92228] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹5 Lakhs</span>
                  <span>₹3 Crores</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-navy-900 mb-1.5">
                  <span>Interest Rate (% P.A.)</span>
                  <span className="text-base font-extrabold text-navy-900 font-mono">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={6.5}
                  max={13.0}
                  step={0.05}
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#D92228] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>6.5% (Lowest Bank Offer)</span>
                  <span>13.0%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-navy-900 mb-1.5">
                  <span>Loan Tenure</span>
                  <span className="text-base font-extrabold text-navy-900 font-mono">
                    {tenureYears} Years ({totalMonths} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={e => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#D92228] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* Calculations Summary Box */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50/50 border border-red-200/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-red-100">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Monthly EMI</p>
                  <p className="text-xl sm:text-2xl font-black text-[#D92228] font-mono mt-1">
                    {formatINR(calculatedEmi)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Total Interest</p>
                  <p className="text-base sm:text-lg font-extrabold text-gray-800 font-mono mt-1">
                    {formatINR(totalInterest)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Total Payable</p>
                  <p className="text-base sm:text-lg font-extrabold text-navy-950 font-mono mt-1">
                    {formatINR(totalPayment)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal('loan')}
                className="w-full mt-4 py-3 bg-[#D92228] hover:bg-red-700 text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Check Bank Eligibility for {formatINR(calculatedEmi)}/mo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BEST HOME LOAN OFFERS MODAL */}
      {/* ======================================================== */}
      {activeModal === 'loan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
                {t('bestLoanOffersTitle') || 'Best Home Loan Offers from 40+ Banks'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Compare rates starting from 7.10% with zero processing fee and instant digital sanctions.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Canara Bank', rate: '7.15%', maxAmount: 'Up to ₹ 5 Cr', fee: '0.25% (Min ₹1,500)', badge: 'Lowest EMI' },
                { name: 'Bank of Baroda', rate: '7.20%', maxAmount: 'Up to ₹ 10 Cr', fee: 'Nil processing fee*', badge: 'Zero Processing' },
                { name: 'Bank of India', rate: '7.10%', maxAmount: 'Up to ₹ 3 Cr', fee: 'Zero fee for festive', badge: 'Lowest Rate' },
                { name: 'ICICI Bank Home Loans', rate: '7.35%', maxAmount: 'Up to ₹ 15 Cr', fee: '0.25% to 0.50%', badge: 'Fast Sanction' },
                { name: 'HDFC Bank Home Loans', rate: '7.25%', maxAmount: 'Up to ₹ 10 Cr', fee: 'Up to ₹3,000 + GST', badge: 'Pre-Approved' },
                { name: 'State Bank of India (SBI)', rate: '7.15%', maxAmount: 'Up to ₹ 20 Cr', fee: 'Zero for women', badge: 'Most Trusted' }
              ].map(bank => (
                <div
                  key={bank.name}
                  className="p-4 rounded-2xl bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#D92228] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-navy-950">{bank.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {bank.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      <span>Rate: <strong className="text-[#D92228]">{bank.rate}</strong></span>
                      <span>•</span>
                      <span>Processing: {bank.fee}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{bank.maxAmount}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Loan application initiated for ${bank.name}! Our dedicated loan executive will assist with instant sanction.`);
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 bg-[#D92228] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. INTERIORS BUDGET ESTIMATOR MODAL */}
      {/* ======================================================== */}
      {activeModal === 'interiors' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveModal(null);
                setInteriorBooked(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
                {t('interiorsEstimatorTitle') || 'Interiors Budget Estimator'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Estimate interior costs based on your home size, materials grade, and modular requirements.
            </p>

            {interiorBooked ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-display text-xl font-bold text-emerald-950">
                  3D Interior Consultation Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Our certified interior architect has received your specifications for <strong>{interiorBhk} ({interiorPackage.toUpperCase()})</strong>. We will call you within 2 hours with free 3D renders.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setInteriorBooked(false);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. BHK Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    1. Select Home Configuration
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'] as const).map(bhk => (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => setInteriorBhk(bhk)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          interiorBhk === bhk
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Package Tier */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    2. Select Material & Finish Package
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'essential', name: 'Essential', spec: 'Commercial MR Ply + Laminate' },
                      { id: 'premium', name: 'Premium', spec: 'BWP Marine Ply + High Gloss Acrylic' },
                      { id: 'luxury', name: 'Luxury', spec: 'Boiling Waterproof + PU Polish & Blum' }
                    ].map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setInteriorPackage(pkg.id as any)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          interiorPackage === pkg.id
                            ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-500'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <p className="font-extrabold text-xs text-navy-900">{pkg.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{pkg.spec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Scope Checklist */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    3. Scope of Work Included
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interiorKitchen}
                        onChange={e => setInteriorKitchen(e.target.checked)}
                        className="rounded text-purple-600 accent-purple-600"
                      />
                      <span>Modular Kitchen & Chimney</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interiorWardrobe}
                        onChange={e => setInteriorWardrobe(e.target.checked)}
                        className="rounded text-purple-600 accent-purple-600"
                      />
                      <span>Bedrooms Sliding Wardrobes</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interiorFalseCeiling}
                        onChange={e => setInteriorFalseCeiling(e.target.checked)}
                        className="rounded text-purple-600 accent-purple-600"
                      />
                      <span>Gypsum False Ceiling & Spotlights</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interiorLivingUnit}
                        onChange={e => setInteriorLivingUnit(e.target.checked)}
                        className="rounded text-purple-600 accent-purple-600"
                      />
                      <span>Living Room TV Unit & Panelling</span>
                    </label>
                  </div>
                </div>

                {/* Cost Estimate Output */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-gray-600 uppercase">Estimated Budget</span>
                    <p className="text-2xl font-black text-purple-900 font-mono mt-0.5">
                      {formatINR(estimatedInteriorCost)}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Includes 10-year warranty, transit insurance & turnkey installation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInteriorBooked(true)}
                    className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer shrink-0"
                  >
                    Book Free 3D Design Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. RATES & TRENDS MODAL */}
      {/* ======================================================== */}
      {activeModal === 'trends' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
                {t('ratesAndTrendsTitle') || 'Real Estate Rates & Market Trends'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-5">
              Live Q4 2026 capital values, YoY appreciation rates, and rental yields across top localities.
            </p>

            {/* City Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
              {['Gurugram', 'Noida', 'Mumbai', 'Bengaluru', 'Kolkata'].map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedTrendsCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedTrendsCity === city
                      ? 'bg-navy-900 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Rates Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-gray-50 p-3 grid grid-cols-12 font-bold text-gray-500 border-b border-gray-200">
                <div className="col-span-5">Locality / Sector</div>
                <div className="col-span-3 text-right">Avg Rate (₹/sqft)</div>
                <div className="col-span-2 text-right">YoY Growth</div>
                <div className="col-span-2 text-right">Rental Yield</div>
              </div>

              {selectedTrendsCity === 'Gurugram' && [
                { name: 'Golf Course Extension Road', rate: '₹ 15,200', growth: '+14.2%', yield: '4.8%' },
                { name: 'Cyber City & DLF Phase 2', rate: '₹ 18,500', growth: '+11.8%', yield: '5.2%' },
                { name: 'Dwarka Expressway (Sec 102-113)', rate: '₹ 11,400', growth: '+18.4%', yield: '4.2%' },
                { name: 'Sohna Road Corridor', rate: '₹ 9,200', growth: '+9.1%', yield: '4.0%' }
              ].map(item => (
                <div key={item.name} className="p-3 grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50/80 items-center">
                  <div className="col-span-5 font-bold text-navy-900">{item.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-navy-950">{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-emerald-600">{item.growth}</div>
                  <div className="col-span-2 text-right font-mono text-gray-600">{item.yield}</div>
                </div>
              ))}

              {selectedTrendsCity === 'Noida' && [
                { name: 'Sector 62 Institutional Zone', rate: '₹ 8,400', growth: '+10.5%', yield: '5.1%' },
                { name: 'Sector 150 Sports City', rate: '₹ 9,800', growth: '+15.2%', yield: '4.5%' },
                { name: 'Noida Expressway (Sec 137)', rate: '₹ 8,900', growth: '+12.1%', yield: '4.8%' },
                { name: 'Greater Noida West Sector 1', rate: '₹ 6,500', growth: '+16.8%', yield: '4.9%' }
              ].map(item => (
                <div key={item.name} className="p-3 grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50/80 items-center">
                  <div className="col-span-5 font-bold text-navy-900">{item.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-navy-950">{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-emerald-600">{item.growth}</div>
                  <div className="col-span-2 text-right font-mono text-gray-600">{item.yield}</div>
                </div>
              ))}

              {selectedTrendsCity === 'Mumbai' && [
                { name: 'Worli Sea Face & Lower Parel', rate: '₹ 49,500', growth: '+7.4%', yield: '3.4%' },
                { name: 'Bandra West (Pali Hill)', rate: '₹ 56,000', growth: '+6.8%', yield: '3.2%' },
                { name: 'Andheri West (Lokhandwala)', rate: '₹ 28,400', growth: '+8.9%', yield: '4.1%' },
                { name: 'Thane West (Ghodbunder Rd)', rate: '₹ 14,200', growth: '+11.5%', yield: '4.5%' }
              ].map(item => (
                <div key={item.name} className="p-3 grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50/80 items-center">
                  <div className="col-span-5 font-bold text-navy-900">{item.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-navy-950">{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-emerald-600">{item.growth}</div>
                  <div className="col-span-2 text-right font-mono text-gray-600">{item.yield}</div>
                </div>
              ))}

              {selectedTrendsCity === 'Bengaluru' && [
                { name: 'Whitefield (ITPL & EPIP Zone)', rate: '₹ 9,600', growth: '+14.8%', yield: '5.4%' },
                { name: 'Indiranagar 100ft Road', rate: '₹ 18,200', growth: '+8.6%', yield: '4.3%' },
                { name: 'Sarjapur Road Corridor', rate: '₹ 8,900', growth: '+16.2%', yield: '5.1%' },
                { name: 'Electronic City Phase 1', rate: '₹ 6,800', growth: '+11.4%', yield: '5.8%' }
              ].map(item => (
                <div key={item.name} className="p-3 grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50/80 items-center">
                  <div className="col-span-5 font-bold text-navy-900">{item.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-navy-950">{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-emerald-600">{item.growth}</div>
                  <div className="col-span-2 text-right font-mono text-gray-600">{item.yield}</div>
                </div>
              ))}

              {selectedTrendsCity === 'Kolkata' && [
                { name: 'Bansdroni (Chirantani Park)', rate: '₹ 3,850', growth: '+6.2%', yield: '4.8%' },
                { name: 'New Town Action Area 1', rate: '₹ 6,200', growth: '+12.4%', yield: '4.4%' },
                { name: 'Ballygunge Circular Road', rate: '₹ 14,800', growth: '+5.5%', yield: '3.6%' },
                { name: 'EM Bypass Corridor', rate: '₹ 8,900', growth: '+9.8%', yield: '4.2%' }
              ].map(item => (
                <div key={item.name} className="p-3 grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50/80 items-center">
                  <div className="col-span-5 font-bold text-navy-900">{item.name}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-navy-950">{item.rate}</div>
                  <div className="col-span-2 text-right font-bold text-emerald-600">{item.growth}</div>
                  <div className="col-span-2 text-right font-mono text-gray-600">{item.yield}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PROPERTY VALUATION MODAL */}
      {/* ======================================================== */}
      {activeModal === 'valuation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-navy-950">
                {t('propertyValuationTitle') || 'Algorithmic Property Valuation'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Get an accurate Fair Market Value estimate benchmarked with recent RERA and sub-registrar deeds.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Locality</label>
                <input
                  type="text"
                  value={valuationLocality}
                  onChange={e => setValuationLocality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    value={valuationArea}
                    onChange={e => setValuationArea(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">BHK Type</label>
                  <select
                    value={valuationBhk}
                    onChange={e => setValuationBhk(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4 BHK</option>
                  </select>
                </div>
              </div>

              {/* Valuation Output */}
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Estimated Fair Market Value</span>
                <p className="text-2xl sm:text-3xl font-black text-blue-900 font-mono mt-1">
                  {formatINR(valuationArea * 8500)} – {formatINR(valuationArea * 9200)}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200/60 text-xs text-gray-600">
                  <div>
                    <span>Avg Rate: </span>
                    <strong className="text-navy-950 font-mono">₹ 8,850/sq.ft</strong>
                  </div>
                  <div>
                    <span>Monthly Rent Potential: </span>
                    <strong className="text-emerald-700 font-mono">{formatINR(Math.round(valuationArea * 28))}/mo</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
