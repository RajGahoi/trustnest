import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  UserCheck, 
  HelpCircle, 
  X
} from 'lucide-react';
import { formatINR } from '../../domain/india/currency';

interface BankOffer {
  id: string;
  name: string;
  category: 'psu' | 'private' | 'hfc';
  rate: number;
  rateStr: string;
  processingFee: string;
  maxAmount: string;
  maxTenureYears: number;
  badge?: string;
  accentColor: string;
  features: string[];
}

const BANK_OFFERS: BankOffer[] = [
  {
    id: 'boi',
    name: 'Bank of India',
    category: 'psu',
    rate: 7.10,
    rateStr: '7.10% p.a.',
    processingFee: 'Zero Processing Fee*',
    maxAmount: 'Up to ₹ 5 Crores',
    maxTenureYears: 30,
    badge: 'Lowest Rate in Market',
    accentColor: '#1B4784',
    features: ['No prepayment penalty', 'Concession for CIBIL > 750', 'Quick digital verification']
  },
  {
    id: 'canara',
    name: 'Canara Bank',
    category: 'psu',
    rate: 7.15,
    rateStr: '7.15% p.a.',
    processingFee: '0.25% (Min ₹1,500)',
    maxAmount: 'Up to ₹ 7 Crores',
    maxTenureYears: 30,
    badge: 'Best PSU Value',
    accentColor: '#0083CA',
    features: ['High loan eligibility ratio', 'Flexible overdraft facility', 'Zero charges on floating rate']
  },
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    category: 'psu',
    rate: 7.15,
    rateStr: '7.15% p.a.',
    processingFee: 'Zero for Women Borrowers',
    maxAmount: 'Up to ₹ 20 Crores',
    maxTenureYears: 30,
    badge: 'Most Trusted',
    accentColor: '#280071',
    features: ['SBI Maxgain overdraft available', 'Over 24,000 branches pan-India', 'Special women discount']
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    category: 'psu',
    rate: 7.20,
    rateStr: '7.20% p.a.',
    processingFee: 'Nil for festive season',
    maxAmount: 'Up to ₹ 10 Crores',
    maxTenureYears: 30,
    badge: 'Festive Waiver',
    accentColor: '#F26522',
    features: ['Nil processing fee till month end', 'Baroda Home Loan Advantage', 'Instant e-approval']
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank Home Loans',
    category: 'private',
    rate: 7.25,
    rateStr: '7.25% p.a.',
    processingFee: 'Up to ₹3,000 + GST',
    maxAmount: 'Up to ₹ 15 Crores',
    maxTenureYears: 30,
    badge: 'Fast Approval (48 Hrs)',
    accentColor: '#004C8F',
    features: ['Doorstep document collection', 'Pre-approved builder tie-ups', 'Top-up loan facility']
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    category: 'private',
    rate: 7.30,
    rateStr: '7.30% p.a.',
    processingFee: '0.25% to 0.50%',
    maxAmount: 'Up to ₹ 12 Crores',
    maxTenureYears: 25,
    badge: 'Best Balance Transfer',
    accentColor: '#ED1C24',
    features: ['Special balance transfer discount', 'Quick sanction in 3 days', 'Customized repayment schedule']
  },
  {
    id: 'icici',
    name: 'ICICI Bank Home Loans',
    category: 'private',
    rate: 7.35,
    rateStr: '7.35% p.a.',
    processingFee: '0.25% to 0.50%',
    maxAmount: 'Up to ₹ 15 Crores',
    maxTenureYears: 30,
    badge: 'Instant Digital Sanction',
    accentColor: '#A41D22',
    features: ['Express sanction for pre-approved', 'Repayment track record benefits', 'Digital disbursement']
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    category: 'private',
    rate: 7.40,
    rateStr: '7.40% p.a.',
    processingFee: 'Up to 0.50%',
    maxAmount: 'Up to ₹ 10 Crores',
    maxTenureYears: 30,
    badge: '12 EMIs Off Scheme',
    accentColor: '#97144D',
    features: ['Axis Shubh Arambh 12 EMIs waived', 'No legal fees on approved projects', 'Quick verification']
  }
];

interface HomeLoansPageProps {
  onNavigate: (route: string) => void;
}

export const HomeLoansPage: React.FC<HomeLoansPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'eligibility' | 'calculator' | 'faq'>('comparison');
  const [bankFilter, setBankFilter] = useState<'all' | 'psu' | 'private'>('all');
  const [selectedBank, setSelectedBank] = useState<BankOffer | null>(null);

  // Application Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantIncome, setApplicantIncome] = useState('85000');
  const [applicantLoanAmount, setApplicantLoanAmount] = useState('4500000');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // EMI Calculator State
  const [calcAmount, setCalcAmount] = useState(4500000); // 45 Lakhs
  const [calcRate, setCalcRate] = useState(7.15); // 7.15%
  const [calcTenureYears, setCalcTenureYears] = useState(20);

  // Eligibility Calculator State
  const [eligMonthlyIncome, setEligMonthlyIncome] = useState(85000);
  const [eligExistingEmi, setEligExistingEmi] = useState(12000);
  const [eligTenureYears, setEligTenureYears] = useState(25);
  const eligRate = 7.15;

  // Check URL params on mount (e.g. #loans?tab=eligibility or #loans?bank=canara)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('tab=eligibility')) {
      setActiveTab('eligibility');
    } else if (hash.includes('tab=calculator')) {
      setActiveTab('calculator');
    }
    const match = hash.match(/bank=([a-z]+)/i);
    if (match && match[1]) {
      const bank = BANK_OFFERS.find(b => b.id.toLowerCase() === match[1].toLowerCase());
      if (bank) {
        setSelectedBank(bank);
        setApplyModalOpen(true);
      }
    }
  }, []);

  // Monthly EMI Calculation
  const monthlyRate = calcRate / 12 / 100;
  const totalMonths = calcTenureYears * 12;
  const calculatedEmi = Math.round(
    (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = calculatedEmi * totalMonths;
  const totalInterest = totalPayment - calcAmount;

  // Loan Eligibility Calculation (50% FOIR)
  const eligMonthlyRate = eligRate / 12 / 100;
  const eligTotalMonths = eligTenureYears * 12;
  const availableMonthlyDisposable = Math.max(0, eligMonthlyIncome * 0.50 - eligExistingEmi);
  const eligibleLoanAmount = Math.round(
    (availableMonthlyDisposable * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
    (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
  );

  const filteredBanks = BANK_OFFERS.filter(b => {
    if (bankFilter === 'all') return true;
    return b.category === bankFilter;
  });

  const handleOpenApply = (bank?: BankOffer) => {
    if (bank) setSelectedBank(bank);
    else setSelectedBank(BANK_OFFERS[0]);
    setAppliedSuccess(false);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#D92228] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          RERA & RBI Regulated Banking Partners
        </span>
      </div>

      {/* Hero Header Banner (MagicLoans Signature Styling) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-white via-[#FFFDF8] to-[#FFF5F5] border border-orange-200/80 shadow-xl overflow-hidden p-6 sm:p-10 md:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black text-[#D92228] tracking-tight">
              magic
            </span>
            <div className="flex items-center text-[#D92228] font-display text-3xl sm:text-4xl font-black">
              <span>L</span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#D92228] text-white text-xs sm:text-sm flex items-center justify-center font-bold mx-0.5">
                ₹
              </span>
              <span>ans</span>
            </div>
            <span className="ml-3 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-[#D92228]">
              Verified Home Loans
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black text-navy-950 tracking-tight leading-tight">
            Compare Home Loan Offers from 40+ Partner Banks
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
            Get instant access to real-time interest rates from public sector & private banks. Enjoy 0% processing fee, free doorstep document collection, and instant digital in-principle sanctions.
          </p>

          {/* Quick Value Props */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm font-bold text-gray-800">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lowest Rate 7.10% p.a.</span>
            </span>
            <span className="flex items-center gap-1.5 text-navy-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Processing Fee*</span>
            </span>
            <span className="flex items-center gap-1.5 text-orange-600">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>10-Minute Digital Sanction</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'comparison', label: 'Bank Offers & Comparison (40+ Banks)', icon: Building2 },
          { id: 'eligibility', label: 'Eligibility Calculator', icon: UserCheck },
          { id: 'calculator', label: 'EMI Calculator', icon: Calculator },
          { id: 'faq', label: 'Documents & FAQs', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#D92228] text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BANK COMPARISON TABLE & CARDS */}
      {/* ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Sub Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-gray-500">Filter By:</span>
              <button
                type="button"
                onClick={() => setBankFilter('all')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  bankFilter === 'all' ? 'bg-navy-950 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Banks ({BANK_OFFERS.length})
              </button>
              <button
                type="button"
                onClick={() => setBankFilter('psu')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  bankFilter === 'psu' ? 'bg-navy-950 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Public Sector (PSU)
              </button>
              <button
                type="button"
                onClick={() => setBankFilter('private')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  bankFilter === 'private' ? 'bg-navy-950 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Private Banks
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenApply()}
              className="px-5 py-2 rounded-xl bg-[#D92228] hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Common Pre-Approved Sanction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bank Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map(bank => (
              <div
                key={bank.id}
                className="bg-white rounded-3xl border border-gray-200 hover:border-[#D92228] p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-lg text-navy-950 group-hover:text-[#D92228] transition-colors">
                        {bank.name}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {bank.category === 'psu' ? 'Govt / Public Sector Bank' : 'Top Tier Private Bank'}
                      </span>
                    </div>

                    {bank.badge && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {bank.badge}
                      </span>
                    )}
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Interest Rate</p>
                      <p className="font-mono font-black text-xl text-[#D92228] mt-0.5">
                        {bank.rateStr}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Processing Fee</p>
                      <p className="text-xs font-bold text-gray-800 mt-1 line-clamp-1">
                        {bank.processingFee}
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {bank.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">Max Tenure</span>
                    <span className="text-xs font-black text-navy-950 font-mono">{bank.maxTenureYears} Years</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenApply(bank)}
                    className="px-5 py-2.5 rounded-xl bg-[#D92228] hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Apply with {bank.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ELIGIBILITY CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                Check How Much Home Loan You Can Get
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Based on standard RBI guidelines and 50% Fixed Obligation to Income Ratio (FOIR).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders (Col 7) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Net Monthly Take-Home Salary</span>
                    <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {formatINR(eligMonthlyIncome)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={500000}
                    step={5000}
                    value={eligMonthlyIncome}
                    onChange={e => setEligMonthlyIncome(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹25,000</span>
                    <span>₹2.5 Lacs</span>
                    <span>₹5 Lacs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Existing Monthly EMIs (Car, Personal, Cards)</span>
                    <span className="font-mono text-base font-black text-gray-800 bg-gray-100 px-3 py-1 rounded-xl">
                      {formatINR(eligExistingEmi)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={2000}
                    value={eligExistingEmi}
                    onChange={e => setEligExistingEmi(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹0</span>
                    <span>₹75,000</span>
                    <span>₹1.5 Lacs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Desired Loan Tenure</span>
                    <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {eligTenureYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={eligTenureYears}
                    onChange={e => setEligTenureYears(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>5 Years</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              {/* Eligibility Result Box (Col 5) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                    Maximum Eligible Home Loan
                  </span>
                  <p className="font-mono font-black text-3xl sm:text-4xl text-[#D92228] mt-2">
                    {formatINR(eligibleLoanAmount)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Maximum allowed monthly EMI: <strong>{formatINR(availableMonthlyDisposable)}/mo</strong>
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-red-100 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Benchmark Rate:</span>
                    <strong className="text-navy-950">{eligRate}% p.a.</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">FOIR Applied:</span>
                    <strong className="text-navy-950">50% of Net Salary</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Processing Fee:</span>
                    <strong className="text-emerald-700">₹0 (Zero Processing Fee Offer)</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenApply()}
                  className="w-full py-3.5 bg-[#D92228] hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Claim Pre-Approved Letter for {formatINR(eligibleLoanAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: EMI CALCULATOR */}
      {/* ======================================================== */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-950">
                Home Loan EMI Calculator with Amortization Schedule
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Instantly compute monthly installment, total interest payable, and repayment split.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders (Col 7) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Loan Amount</span>
                    <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {formatINR(calcAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={30000000}
                    step={100000}
                    value={calcAmount}
                    onChange={e => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>₹5 Lacs</span>
                    <span>₹1.5 Cr</span>
                    <span>₹3 Cr</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Interest Rate (% per annum)</span>
                    <span className="font-mono text-base font-black text-[#D92228] bg-red-50 px-3 py-1 rounded-xl">
                      {calcRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6.5}
                    max={14.0}
                    step={0.05}
                    value={calcRate}
                    onChange={e => setCalcRate(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>6.5% (Lowest)</span>
                    <span>14.0%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                    <span>Tenure (Years)</span>
                    <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                      {calcTenureYears} Years ({totalMonths} Months)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={calcTenureYears}
                    onChange={e => setCalcTenureYears(Number(e.target.value))}
                    className="w-full accent-[#D92228] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              {/* Result Summary Box (Col 5) */}
              <div className="lg:col-span-5 bg-navy-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Monthly Loan EMI
                  </span>
                  <p className="font-mono font-black text-3xl sm:text-4xl text-amber-400 mt-2">
                    {formatINR(calculatedEmi)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-gray-300 font-bold uppercase block">Principal Amount</span>
                    <strong className="font-mono text-sm sm:text-base text-white">{formatINR(calcAmount)}</strong>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-gray-300 font-bold uppercase block">Total Interest</span>
                    <strong className="font-mono text-sm sm:text-base text-amber-300">{formatINR(totalInterest)}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] text-gray-300 font-bold uppercase block">Total Amount Payable</span>
                  <strong className="font-mono text-lg text-white">{formatINR(totalPayment)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenApply()}
                  className="w-full py-3.5 bg-[#D92228] hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply with this EMI ({formatINR(calculatedEmi)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DOCUMENTS & FAQS */}
      {/* ======================================================== */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Document Checklist */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D92228]" />
              <span>Mandatory Checklist of Documents</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <h4 className="font-bold text-xs text-navy-900 uppercase tracking-wider">
                  For Salaried Applicants
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                  <li>PAN Card & Aadhaar Card (Identity & Address Proof)</li>
                  <li>Last 3 Months Salary Slips</li>
                  <li>Last 6 Months Bank Salary Account Statements</li>
                  <li>Latest Form 16 / Income Tax Returns (2 Years)</li>
                  <li>Property Agreement to Sale & Title Deeds</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <h4 className="font-bold text-xs text-navy-900 uppercase tracking-wider">
                  For Self-Employed / Business Owners
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                  <li>PAN Card, Aadhaar Card, & GST Registration Certificate</li>
                  <li>Last 3 Years Audited Balance Sheet & P&L Statement</li>
                  <li>Last 12 Months Current & Savings Account Bank Statements</li>
                  <li>Business Continuity Proof (Shop Act / MSME Udyam)</li>
                  <li>RERA Approved Sanction Plan & Chain of Deeds</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-display text-xl font-bold text-navy-950 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#D92228]" />
              <span>Frequently Asked Questions</span>
            </h3>

            {[
              {
                q: 'What is the minimum credit / CIBIL score required for 7.10% rates?',
                a: 'A CIBIL score of 750 and above unlocks the lowest interest rate slab of 7.10% to 7.25% across Bank of India, Canara Bank, and SBI.'
              },
              {
                q: 'Can I transfer my existing home loan to get lower EMI?',
                a: 'Yes, Balance Transfer is fully supported with zero foreclosure penalty on floating rate loans. Our partner banks also offer up to ₹50 Lakhs additional top-up.'
              },
              {
                q: 'How long does in-principle digital sanction take?',
                a: 'Digital sanction takes approximately 10 to 15 minutes upon submitting basic KYC and income details online.'
              },
              {
                q: 'Is there any processing fee charged by TrustNest?',
                a: 'TrustNest does not charge any service or consultation fee from borrowers. You get direct bank access with exclusive waiver benefits.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-navy-950">{faq.q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INSTANT DIGITAL APPLICATION MODAL */}
      {/* ======================================================== */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {appliedSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-display text-2xl font-black text-navy-950">
                  Application Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Your application for <strong>{selectedBank?.name || 'Home Loan Offers'}</strong> has been registered. Reference ID: <strong className="font-mono text-navy-950">TN-LOAN-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
                  <p>✓ Dedicated senior loan officer assigned.</p>
                  <p>✓ Instant digital eligibility verification started.</p>
                  <p>✓ You will receive a call within 30 minutes for doorstep document pickup.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="w-full py-3 bg-[#D92228] text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-[#D92228] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-navy-950">
                      Apply for {selectedBank?.name || 'Home Loan'}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Starts at {selectedBank?.rateStr || '7.10%'} • 0% Processing Fee
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter applicant legal name"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D92228]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={applicantPhone}
                      onChange={e => setApplicantPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D92228]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email ID</label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={applicantEmail}
                      onChange={e => setApplicantEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D92228]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monthly Salary (₹)</label>
                    <input
                      type="number"
                      required
                      value={applicantIncome}
                      onChange={e => setApplicantIncome(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D92228] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Required Loan (₹)</label>
                    <input
                      type="number"
                      required
                      value={applicantLoanAmount}
                      onChange={e => setApplicantLoanAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D92228] font-mono"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed">
                  By clicking submit, you authorize TrustNest & partner banks to fetch credit report and verify employment per RBI guidelines.
                </p>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D92228] hover:bg-red-700 text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Generate In-Principle Sanction Letter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
