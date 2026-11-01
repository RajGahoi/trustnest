import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  Table, 
  Sparkles
} from 'lucide-react';
import { formatINR } from '../../domain/india/currency';

interface EmiCalculatorPageProps {
  onNavigate: (route: string) => void;
}

export const EmiCalculatorPage: React.FC<EmiCalculatorPageProps> = ({ onNavigate }) => {
  const [loanAmount, setLoanAmount] = useState(4500000); // 45 Lakhs
  const [interestRate, setInterestRate] = useState(7.20); // 7.20%
  const [tenureYears, setTenureYears] = useState(20); // 20 years
  const [showAmortization, setShowAmortization] = useState(true);

  // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const calculatedEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = calculatedEmi * totalMonths;
  const totalInterest = totalPayment - loanAmount;
  const principalPercentage = Math.round((loanAmount / totalPayment) * 100);
  const interestPercentage = 100 - principalPercentage;

  // Year-by-Year Amortization Schedule Generator
  const amortizationSchedule = [];
  let currentBalance = loanAmount;
  for (let year = 1; year <= Math.min(tenureYears, 30); year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      if (currentBalance <= 0) break;
      const monthInterest = currentBalance * monthlyRate;
      const monthPrincipal = Math.min(currentBalance, calculatedEmi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      currentBalance -= monthPrincipal;
    }
    amortizationSchedule.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      totalYearPayment: Math.round(yearPrincipal + yearInterest),
      closingBalance: Math.max(0, Math.round(currentBalance))
    });
    if (currentBalance <= 0) break;
  }

  // Prepayment savings estimate
  const interestSaved = Math.round(totalInterest * 0.22);
  const tenureReducedYears = Math.min(4, Math.round(tenureYears * 0.18));

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-[#D92228] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('loans')}
          className="text-xs font-bold text-[#D92228] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Compare 40+ Bank Offers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#D92228] flex items-center justify-center mx-auto">
          <Calculator className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Home Loan EMI Calculator
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Plan your home loan repayment with accurate monthly EMI calculations, interest breakup visualizer, and year-by-year amortization schedule.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Column (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Loan Amount */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                <span className="uppercase">1. Loan Amount</span>
                <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
                  {formatINR(loanAmount)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={50000000}
                step={100000}
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#D92228] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>₹5 Lacs</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* 2. Interest Rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                <span className="uppercase">2. Interest Rate (% per annum)</span>
                <span className="font-mono text-base font-black text-[#D92228] bg-red-50 px-3 py-1 rounded-xl">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={6.5}
                max={15.0}
                step={0.05}
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#D92228] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>6.5% (Lowest Bank Offer)</span>
                <span>10.5%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* 3. Tenure */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                <span className="uppercase">3. Loan Tenure</span>
                <span className="font-mono text-base font-black text-navy-950 bg-cream-100 px-3 py-1 rounded-xl">
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
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Prepayment Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Smart Homebuyer Tip:</strong>
                <span>
                  Paying just 1 extra EMI every year or increasing your EMI by 5% annually saves up to <strong>{formatINR(interestSaved)}</strong> in total interest and reduces tenure by ~<strong>{tenureReducedYears} years</strong>!
                </span>
              </div>
            </div>
          </div>

          {/* Results Summary Box (Col 5) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-red-50/50 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Monthly Loan EMI
              </span>
              <p className="font-mono font-black text-3xl sm:text-4xl text-[#D92228] mt-1.5">
                {formatINR(calculatedEmi)}
              </p>
              <span className="text-[11px] text-gray-500 block mt-1">
                Payable every month for {tenureYears} years
              </span>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-950">Principal: {principalPercentage}%</span>
                <span className="text-[#D92228]">Interest: {interestPercentage}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden flex">
                <div style={{ width: `${principalPercentage}%` }} className="bg-navy-900 h-full" />
                <div style={{ width: `${interestPercentage}%` }} className="bg-[#D92228] h-full" />
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Principal Amount</span>
                <p className="font-mono font-extrabold text-sm sm:text-base text-navy-950 mt-0.5">
                  {formatINR(loanAmount)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Interest</span>
                <p className="font-mono font-extrabold text-sm sm:text-base text-[#D92228] mt-0.5">
                  {formatINR(totalInterest)}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs text-left">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Amount (Principal + Interest)</span>
              <p className="font-mono font-black text-lg text-navy-950 mt-0.5">
                {formatINR(totalPayment)}
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => onNavigate('loans')}
              className="w-full py-3.5 bg-[#D92228] hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Explore Bank Offers for {formatINR(calculatedEmi)}/mo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Year-by-Year Amortization Schedule Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-[#D92228]" />
            <h3 className="font-display text-lg sm:text-xl font-bold text-navy-950">
              Year-by-Year Loan Amortization Schedule
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowAmortization(!showAmortization)}
            className="text-xs font-bold text-gray-600 hover:text-navy-950 cursor-pointer"
          >
            {showAmortization ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showAmortization && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-y border-gray-200">
                <tr>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4 text-right">Principal Paid</th>
                  <th className="py-3 px-4 text-right">Interest Paid</th>
                  <th className="py-3 px-4 text-right">Total Annual Payment</th>
                  <th className="py-3 px-4 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {amortizationSchedule.map(row => (
                  <tr key={row.year} className="hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-bold text-navy-950 font-sans">Year {row.year}</td>
                    <td className="py-3 px-4 text-right text-emerald-700">{formatINR(row.principalPaid)}</td>
                    <td className="py-3 px-4 text-right text-[#D92228]">{formatINR(row.interestPaid)}</td>
                    <td className="py-3 px-4 text-right font-bold text-navy-950">{formatINR(row.totalYearPayment)}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-600">{formatINR(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
