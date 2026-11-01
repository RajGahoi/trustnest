import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Calculator, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../../domain/i18n/LanguageContext';
import { formatINR } from '../../domain/india/currency';

interface BankPartner {
  id: string;
  name: string;
  rate: string;
  processingFee: string;
  maxTenure: string;
  accentColor: string;
  badge?: string;
}

const BANK_PARTNERS: BankPartner[] = [
  {
    id: 'canara',
    name: 'Canara Bank',
    rate: 'Starts at 7.15%',
    processingFee: '0.25% (Min ₹1,500)',
    maxTenure: '30 Years',
    accentColor: '#0083CA',
    badge: 'Low Rate'
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    rate: 'Starts at 7.20%',
    processingFee: 'Nil for festive season',
    maxTenure: '30 Years',
    accentColor: '#F26522',
    badge: 'Popular'
  },
  {
    id: 'boi',
    name: 'Bank of India',
    rate: 'Starts at 7.10%',
    processingFee: 'Zero Processing Fee*',
    maxTenure: '30 Years',
    accentColor: '#1B4784',
    badge: 'Lowest Rate'
  },
  {
    id: 'icici',
    name: 'ICICI Bank Home Loans',
    rate: 'Starts at 7.35%',
    processingFee: '0.25% to 0.50%',
    maxTenure: '30 Years',
    accentColor: '#A41D22',
    badge: 'Instant Sanction'
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank Home Loans',
    rate: 'Starts at 7.25%',
    processingFee: 'Up to ₹3,000 + GST',
    maxTenure: '30 Years',
    accentColor: '#004C8F',
    badge: 'Fast Approval'
  },
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    rate: 'Starts at 7.15%',
    processingFee: 'Zero for Women Borrowers',
    maxTenure: '30 Years',
    accentColor: '#280071',
    badge: 'Govt Trusted'
  }
];

interface HomeLoansBannerProps {
  onOpenLoanDetails?: () => void;
}

export const HomeLoansBanner: React.FC<HomeLoansBannerProps> = () => {
  const { t } = useLanguage();
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(4500000); // 45 Lakhs
  const [interestRate, setInterestRate] = useState(7.2); // 7.2%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Eligibility State
  const [monthlyIncome, setMonthlyIncome] = useState(85000); // 85k
  const [existingEmi, setExistingEmi] = useState(10000); // 10k
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  // Calculate Monthly EMI: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const calculatedEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = calculatedEmi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  // Maximum eligible loan (assume 50% FOIR)
  const availableMonthlyDisposable = Math.max(0, monthlyIncome * 0.55 - existingEmi);
  const eligibleLoanAmount = Math.round(
    (availableMonthlyDisposable * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))
  );

  const handleApply = (bankName: string) => {
    setAppliedSuccess(bankName);
    setTimeout(() => setAppliedSuccess(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* ======================================================== */}
      {/* MAGICLOANS SIGNATURE BANNER (EXACT MATCH TO SCREENSHOT) */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#FFFDF8] via-white to-[#F8FAFC] border border-orange-200/80 shadow-xl overflow-hidden p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 group">
        {/* Left Content Column */}
        <div className="flex-1 text-left space-y-4 max-w-2xl">
          {/* Logo with Rupee Symbol in O (Exact magicLoans style) */}
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-display text-2xl sm:text-3xl font-black text-[#D92228] tracking-tight">
              magic
            </span>
            <div className="flex items-center text-[#D92228] font-display text-2xl sm:text-3xl font-black">
              <span>L</span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#D92228] text-white text-[11px] sm:text-xs flex items-center justify-center font-bold mx-0.5">
                ₹
              </span>
              <span>ans</span>
            </div>
          </div>

          {/* Headline */}
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-navy-950 tracking-tight leading-tight">
            {t('compareLoans')}
          </h2>

          {/* Bullet Value Propositions */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-gray-700">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('ratesStarting')}</span>
            </span>
            <span className="flex items-center gap-1 text-navy-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('zeroProcessingFee')}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-orange-600">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <span>Instant Digital Sanction Letter</span>
            </span>
          </div>

          {/* Banking Partners Rail (Exact match to screenshot) */}
          <div className="pt-2">
            <p className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest mb-2.5">
              {t('bankingPartners')}
            </p>

            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
              {BANK_PARTNERS.map(bank => (
                <div
                  key={bank.id}
                  onClick={() => setCalculatorModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-md hover:border-[#D92228] transition-all cursor-pointer flex flex-col items-center justify-center min-w-[125px] sm:min-w-[140px] shrink-0 text-center"
                >
                  <p className="font-black text-xs text-navy-950 line-clamp-1" style={{ color: bank.accentColor }}>
                    {bank.name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 mt-0.5">
                    {bank.rate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setCalculatorModalOpen(true)}
              className="text-xs sm:text-sm font-extrabold text-[#D92228] hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{t('exploreBankOffers')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Red Pill Button (Exact match: Check Your Eligibility) */}
            <button
              type="button"
              onClick={() => setCalculatorModalOpen(true)}
              className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-[#D92228] hover:bg-[#B7181D] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
            >
              {t('checkEligibility')}
            </button>
          </div>
        </div>

        {/* Right Graphic: Miniature House Held in Hand (Exact screenshot match) */}
        <div className="shrink-0 relative w-64 sm:w-80 h-48 sm:h-56 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
            alt="Hand holding model house representing Home Loans"
            className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
            40+ Banks Connected
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE HOME LOAN ELIGIBILITY & EMI CALCULATOR MODAL */}
      {/* ======================================================== */}
      {calculatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-gray-200 text-left relative animate-scaleIn my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-[#D92228]">
                  <Calculator className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-navy-950">
                    Home Loan EMI & Eligibility Calculator
                  </h3>
                  <p className="text-xs text-gray-500">
                    Calculate monthly EMI, compare 40+ partner banks, and get 0% processing fee.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCalculatorModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Application Success Toast */}
            {appliedSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Application for <strong>{appliedSuccess}</strong> submitted! Dedicated loan officer will contact you within 30 minutes.
                </span>
              </div>
            )}

            {/* Grid Layout: Sliders on Left, Results & Eligibility on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Sliders (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Loan Amount Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 uppercase">Loan Amount</span>
                    <span className="font-mono font-black text-base text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {formatINR(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="50000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>₹5 Lacs</span>
                    <span>₹2.5 Cr</span>
                    <span>₹5 Cr</span>
                  </div>
                </div>

                {/* 2. Interest Rate Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 uppercase">Interest Rate (% p.a.)</span>
                    <span className="font-mono font-black text-base text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {interestRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6.9"
                    max="12.0"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>6.9%</span>
                    <span>9.0%</span>
                    <span>12.0%</span>
                  </div>
                </div>

                {/* 3. Loan Tenure Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 uppercase">Loan Tenure</span>
                    <span className="font-mono font-black text-base text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {tenureYears} Years ({totalMonths} Months)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>5 Years</span>
                    <span>15 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>

                {/* 4. Quick Bank Offers Table */}
                <div className="pt-2">
                  <h4 className="font-bold text-xs text-navy-950 uppercase tracking-wider mb-2">
                    Compare Partner Bank Rates
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {BANK_PARTNERS.map(b => (
                      <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-navy-950">{b.name}</p>
                          <p className="text-[10px] text-gray-500">Fee: {b.processingFee}</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-mono font-black text-[#D92228]">{b.rate}</span>
                          <button
                            type="button"
                            onClick={() => handleApply(b.name)}
                            className="px-3 py-1 bg-[#D92228] hover:bg-red-700 text-white font-extrabold text-[11px] rounded-lg cursor-pointer transition-all"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Results & Eligibility (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Monthly EMI Output Box */}
                <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Monthly Loan EMI
                  </p>
                  <p className="font-display font-black text-3xl sm:text-4xl text-amber-300 leading-none">
                    {formatINR(calculatedEmi)} <span className="text-xs font-normal text-gray-300">/ month</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase">Principal Amount</p>
                      <p className="font-bold text-white font-mono">{formatINR(loanAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase">Total Interest</p>
                      <p className="font-bold text-orange-400 font-mono">{formatINR(totalInterest)}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs">
                    <p className="text-gray-400 text-[10px] uppercase">Total Amount Payable</p>
                    <p className="font-black text-lg text-white font-mono">{formatINR(totalPayment)}</p>
                  </div>
                </div>

                {/* Instant Eligibility Estimator Box */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Loan Eligibility Check</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block">Net Monthly Salary</label>
                      <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block">Existing Monthly EMIs</label>
                      <input
                        type="number"
                        value={existingEmi}
                        onChange={(e) => setExistingEmi(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200">
                    <p className="text-[10px] text-emerald-800 font-semibold">Estimated Max Loan Eligibility:</p>
                    <p className="font-display font-black text-xl text-emerald-950">
                      {formatINR(eligibleLoanAmount)}
                    </p>
                  </div>
                </div>

                {/* Final CTA Button */}
                <button
                  type="button"
                  onClick={() => handleApply('Preferred Bank Network')}
                  className="w-full py-3 bg-[#D92228] hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer text-center"
                >
                  Apply with 0% Processing Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};