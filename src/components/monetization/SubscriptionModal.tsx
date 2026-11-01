import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Tag, Download, CreditCard, ArrowRight } from 'lucide-react';
import { BUYER_SUBSCRIPTION_PLANS, SELLER_SUBSCRIPTION_PLANS, validateCoupon, calculateGST, generateInvoice } from '../../domain/monetization/plans';
import type { SubscriptionPlan, TaxInvoice } from '../../types';
import { formatINR } from '../../domain/india/currency';
import { store } from '../../mock/store';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAudience?: 'BUYER' | 'SELLER';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  defaultAudience = 'BUYER'
}) => {
  const [audience, setAudience] = useState<'BUYER' | 'SELLER'>(defaultAudience);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    defaultAudience === 'BUYER' ? BUYER_SUBSCRIPTION_PLANS[1] : SELLER_SUBSCRIPTION_PLANS[1]
  );
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'CHECKOUT' | 'INVOICE'>('SELECT');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [generatedInvoice, setGeneratedInvoice] = useState<TaxInvoice | null>(null);

  if (!isOpen) return null;

  const currentPlans = audience === 'BUYER' ? BUYER_SUBSCRIPTION_PLANS : SELLER_SUBSCRIPTION_PLANS;
  const basePrice = Math.max(0, selectedPlan.priceINR - couponDiscount);
  const gstBreakdown = calculateGST(basePrice);

  const handleApplyCoupon = () => {
    const res = validateCoupon(couponCode, selectedPlan.priceINR);
    if (res.valid) {
      setCouponDiscount(res.discountAmount);
      setCouponMsg(res.message);
    } else {
      setCouponDiscount(0);
      setCouponMsg(res.message);
    }
  };

  const handleSimulatePayment = () => {
    // Generate real invoice
    const inv = generateInvoice(
      'Verified User',
      'user@trustnest.in',
      selectedPlan,
      couponDiscount,
      paymentMethod
    );

    // Save to store
    store.addSubscription({
      id: `sub-${Date.now()}`,
      userId: 'usr-current',
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      pricePaid: gstBreakdown.grandTotal,
      gstPaid: gstBreakdown.gstTotal,
      invoiceNo: inv.invoiceNo,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + selectedPlan.durationDays * 86400000).toISOString(),
      active: true,
      revealsRemaining: selectedPlan.contactRevealsLimit
    });

    setGeneratedInvoice(inv);
    setPaymentStep('INVOICE');
    try {
      confetti({ particleCount: 80, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-navy-900/15 shadow-2xl relative max-h-[92vh] overflow-y-auto text-navy-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'SELECT' && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Transparent Verified Marketplace Pricing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Unlock Direct Owner Contacts & Featured Reach
              </h2>
              <p className="text-xs text-navy-700 mt-1">
                Zero brokerage commission. Honest, tax-compliant subscriptions with instant GST digital invoices.
              </p>

              {/* Audience Switcher */}
              <div className="inline-flex p-1 bg-cream-200 rounded-2xl mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setAudience('BUYER');
                    setSelectedPlan(BUYER_SUBSCRIPTION_PLANS[1]);
                    setCouponDiscount(0);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    audience === 'BUYER' ? 'bg-navy-900 text-white shadow' : 'text-navy-700 hover:text-navy-900'
                  }`}
                >
                  Buyer Contact Passes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAudience('SELLER');
                    setSelectedPlan(SELLER_SUBSCRIPTION_PLANS[1]);
                    setCouponDiscount(0);
                  }}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    audience === 'SELLER' ? 'bg-navy-900 text-white shadow' : 'text-navy-700 hover:text-navy-900'
                  }`}
                >
                  Seller & Builder Boosts
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {currentPlans.map(plan => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setCouponDiscount(0);
                      setCouponMsg('');
                    }}
                    className={`rounded-2xl p-5 border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-navy-900 text-white border-orange-500 ring-2 ring-orange-500/40 shadow-xl'
                        : 'bg-white border-navy-900/10 hover:border-navy-900/30 text-navy-900'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h4 className="font-extrabold text-sm mb-1">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-2xl font-extrabold">
                          {plan.priceINR === 0 ? 'FREE' : formatINR(plan.priceINR)}
                        </span>
                        {plan.priceINR > 0 && (
                          <span className={`text-[10px] font-semibold ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                            /{plan.durationDays} days
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 text-xs mb-4">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-orange-400' : 'text-trust-green'}`} />
                            <span className={isSelected ? 'text-gray-200' : 'text-navy-700'}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-orange-glow'
                          : 'bg-cream-200 text-navy-900 hover:bg-cream-300'
                      }`}
                    >
                      {isSelected ? 'Selected Plan' : 'Choose Plan'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Proceed Action */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-navy-900/10">
              <div>
                <span className="text-xs text-navy-700">Selected: </span>
                <span className="font-extrabold text-navy-900">{selectedPlan.name}</span>
                <span className="text-xs text-orange-600 font-bold ml-2">
                  ({selectedPlan.priceINR === 0 ? 'Free' : `${formatINR(selectedPlan.priceINR)} + 18% GST`})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentStep('CHECKOUT')}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-orange-glow flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {paymentStep === 'CHECKOUT' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase">
                <CreditCard className="w-4 h-4" />
                Step 2: Payment & GST Invoice Details
              </div>
              <h3 className="text-xl font-extrabold text-navy-900 mt-1">
                Order Review: {selectedPlan.name}
              </h3>
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 bg-white rounded-2xl border border-navy-900/10">
              <label className="block text-xs font-bold text-navy-900 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                Apply Promotional Coupon:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TRUSTNEST50 or WELCOME2026"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-cream-50 border border-navy-900/15 rounded-xl text-xs font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <div className={`mt-2 text-xs font-semibold ${couponDiscount > 0 ? 'text-trust-green' : 'text-red-600'}`}>
                  {couponMsg}
                </div>
              )}
            </div>

            {/* Price & GST Breakdown Table */}
            <div className="p-5 bg-white rounded-2xl border border-navy-900/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-navy-700">
                <span>Plan Base Price:</span>
                <span>{formatINR(selectedPlan.priceINR)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-trust-green font-bold">
                  <span>Coupon Discount:</span>
                  <span>- {formatINR(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-navy-700">
                <span>Taxable Subtotal:</span>
                <span className="font-semibold">{formatINR(gstBreakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-700">
                <span>Central GST (CGST @ 9%):</span>
                <span>{formatINR(gstBreakdown.cgst)}</span>
              </div>
              <div className="flex justify-between text-navy-700">
                <span>State GST (SGST @ 9%):</span>
                <span>{formatINR(gstBreakdown.sgst)}</span>
              </div>
              <div className="pt-2 border-t border-navy-900/10 flex justify-between font-extrabold text-base text-navy-900">
                <span>Grand Total (Incl. Taxes):</span>
                <span className="text-orange-600">{formatINR(gstBreakdown.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-navy-900 uppercase">Select Payment Instrument:</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR Code', desc: 'GooglePay, PhonePe, Paytm' },
                  { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { id: 'NETBANKING', label: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-navy-900 text-white border-orange-500 ring-2 ring-orange-500/30'
                        : 'bg-white border-navy-900/10 hover:bg-cream-200 text-navy-900'
                    }`}
                  >
                    <div className="font-bold text-xs">{m.label}</div>
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPaymentStep('SELECT')}
                className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-navy-900 font-bold rounded-xl text-xs cursor-pointer"
              >
                Back to Plans
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-orange-glow flex items-center gap-2 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Simulate Sandbox Payment ({formatINR(gstBreakdown.grandTotal)})</span>
              </button>
            </div>
          </div>
        )}

        {paymentStep === 'INVOICE' && generatedInvoice && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-navy-900/15 shadow-trust text-navy-900">
              <div className="flex items-start justify-between border-b border-navy-900/10 pb-4 mb-4">
                <div>
                  <div className="text-xl font-extrabold text-navy-900 tracking-tight">TrustNest Technologies</div>
                  <div className="text-xs text-navy-700">Digital Tax Invoice / Payment Receipt</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-1">GSTIN: 09AAACT2026M1Z8 · SAC: {generatedInvoice.hsnCode}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-trust-green/15 text-trust-green border border-trust-green/30 rounded-full text-xs font-extrabold uppercase">
                    Payment Successful
                  </span>
                  <div className="text-xs font-mono font-bold mt-1.5 text-navy-900">{generatedInvoice.invoiceNo}</div>
                  <div className="text-[11px] text-gray-500">{generatedInvoice.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">Billed To:</span>
                  <span className="font-bold text-navy-900">{generatedInvoice.customerName}</span>
                  <span className="block text-navy-700">{generatedInvoice.customerEmail}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">Payment Instrument:</span>
                  <span className="font-bold text-navy-900">{generatedInvoice.paymentMethod} Simulated</span>
                  <span className="block text-trust-green font-semibold">Instant Entitlement Activated</span>
                </div>
              </div>

              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="bg-cream-100/60 border-b border-navy-900/10 text-left font-bold text-navy-800">
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Taxable</th>
                    <th className="p-2 text-right">CGST (9%)</th>
                    <th className="p-2 text-right">SGST (9%)</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-navy-900/10">
                    <td className="p-2 font-bold">{generatedInvoice.planName}</td>
                    <td className="p-2 text-right">{formatINR(generatedInvoice.subtotal)}</td>
                    <td className="p-2 text-right">{formatINR(generatedInvoice.cgst)}</td>
                    <td className="p-2 text-right">{formatINR(generatedInvoice.sgst)}</td>
                    <td className="p-2 text-right font-extrabold text-navy-900">{formatINR(generatedInvoice.total)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-amber-soft/20 rounded-xl border border-orange-500/20 text-[11px] text-navy-800">
                Entitlement Activated: Your contact reveals allowance has been updated. You can now reveal direct seller contact numbers without restrictions.
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-cream-200 hover:bg-cream-300 text-navy-900 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-orange-500" />
                <span>Print / Save PDF Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done & Return to Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
