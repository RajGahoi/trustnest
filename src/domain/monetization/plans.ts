import type { SubscriptionPlan, TaxInvoice } from '../../types';

export const BUYER_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'BUYER_FREE',
    name: 'Free Buyer Allowance',
    audience: 'BUYER',
    priceINR: 0,
    durationDays: 365,
    features: [
      'Search 140+ verified properties',
      '3 Free Seller Contact Reveals',
      'In-App Persistent Messaging',
      'Save unlimited favorites'
    ],
    contactRevealsLimit: 3,
    featuredListingsLimit: 0,
    instantAlerts: false,
    prioritySupport: false
  },
  {
    id: 'BUYER_WEEKLY',
    name: 'Weekly Active Buyer Pass',
    audience: 'BUYER',
    priceINR: 299,
    durationDays: 7,
    features: [
      '25 Direct Verified Seller Reveals',
      'Instant WhatsApp & In-App Alerts',
      'Price Drop & Market Trend Insights',
      'Download Verified Document Summary'
    ],
    contactRevealsLimit: 25,
    featuredListingsLimit: 0,
    instantAlerts: true,
    prioritySupport: false,
    popular: true
  },
  {
    id: 'BUYER_MONTHLY',
    name: 'Monthly Property Hunter Pro',
    audience: 'BUYER',
    priceINR: 899,
    durationDays: 30,
    features: [
      '100 Direct Verified Seller Reveals',
      'Priority RERA & Legal Status Alerts',
      'Direct Concierge Callback Assistance',
      'Compare Up to 10 Properties Side-by-Side'
    ],
    contactRevealsLimit: 100,
    featuredListingsLimit: 0,
    instantAlerts: true,
    prioritySupport: true
  },
  {
    id: 'BUYER_PREMIUM',
    name: 'Annual Elite VIP Pass',
    audience: 'BUYER',
    priceINR: 2999,
    durationDays: 365,
    features: [
      'Unlimited Seller Contact Reveals',
      'Off-Market Pre-Launch Listings',
      'Dedicated Real Estate Advisory Lead',
      'Priority Support with 1-hr SLA'
    ],
    contactRevealsLimit: 9999,
    featuredListingsLimit: 0,
    instantAlerts: true,
    prioritySupport: true
  }
];

export const SELLER_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'SELLER_FREE',
    name: 'Free Single Listing',
    audience: 'SELLER',
    priceINR: 0,
    durationDays: 30,
    features: [
      '1 Active Property Listing',
      'Standard 5-Dimension Trust Audit',
      'Basic Lead Inbox',
      '30 Days Validity'
    ],
    contactRevealsLimit: 0,
    featuredListingsLimit: 0,
    instantAlerts: false,
    prioritySupport: false
  },
  {
    id: 'SELLER_FEATURED',
    name: 'Featured Trust Boost',
    audience: 'SELLER',
    priceINR: 499,
    durationDays: 14,
    features: [
      'Top-of-Search Category Sticky Badge',
      'Highlighted Platinum Trust Shield',
      '3x Higher Buyer Enquiries',
      '14 Days Boost Duration'
    ],
    contactRevealsLimit: 0,
    featuredListingsLimit: 1,
    instantAlerts: true,
    prioritySupport: false,
    popular: true
  },
  {
    id: 'SELLER_PREMIUM',
    name: '30-Day Premium Showcase',
    audience: 'SELLER',
    priceINR: 1499,
    durationDays: 30,
    features: [
      'Homepage Editorial Showcase',
      'Instant WhatsApp Lead Forwarding',
      'Verified RERA / Title Badge',
      '30 Days Validity & Auto-Renewal'
    ],
    contactRevealsLimit: 0,
    featuredListingsLimit: 3,
    instantAlerts: true,
    prioritySupport: true
  },
  {
    id: 'SELLER_BUILDER',
    name: 'Builder & Broker Multi-Pack',
    audience: 'SELLER',
    priceINR: 4999,
    durationDays: 90,
    features: [
      'Up to 25 Verified Project Listings',
      '5 Multi-Seat Agent CRM Logins',
      'Lead Assignment & Status Pipeline',
      'Dedicated Account Manager'
    ],
    contactRevealsLimit: 0,
    featuredListingsLimit: 10,
    instantAlerts: true,
    prioritySupport: true
  }
];

export interface CouponResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

export function validateCoupon(code: string, subtotal: number): CouponResult {
  const clean = (code || '').trim().toUpperCase();
  if (clean === 'TRUSTNEST50') {
    const discount = Math.round(subtotal * 0.5);
    return { valid: true, code: clean, discountAmount: discount, message: '50% Festive Launch Discount Applied!' };
  }
  if (clean === 'WELCOME2026') {
    const discount = Math.min(200, subtotal);
    return { valid: true, code: clean, discountAmount: discount, message: '₹200 Welcome Offer Applied!' };
  }
  if (clean === 'BROKER20') {
    const discount = Math.round(subtotal * 0.2);
    return { valid: true, code: clean, discountAmount: discount, message: '20% Broker/Agency Discount Applied!' };
  }
  return { valid: false, code: clean, discountAmount: 0, message: 'Invalid or expired coupon code' };
}

export function calculateGST(baseAmount: number): {
  subtotal: number;
  cgst: number;
  sgst: number;
  gstTotal: number;
  grandTotal: number;
} {
  const subtotal = Math.max(0, baseAmount);
  // 18% GST (9% CGST + 9% SGST)
  const cgst = Math.round(subtotal * 0.09 * 100) / 100;
  const sgst = Math.round(subtotal * 0.09 * 100) / 100;
  const gstTotal = Math.round((cgst + sgst) * 100) / 100;
  const grandTotal = Math.round((subtotal + gstTotal) * 100) / 100;

  return { subtotal, cgst, sgst, gstTotal, grandTotal };
}

export function generateInvoice(
  customerName: string,
  customerEmail: string,
  plan: SubscriptionPlan,
  discountAmount: number = 0,
  paymentMethod: string = 'UPI'
): TaxInvoice {
  const base = Math.max(0, plan.priceINR - discountAmount);
  const gst = calculateGST(base);
  const invoiceNo = `TN-INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    invoiceNo,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    customerName: customerName || 'Valued TrustNest Customer',
    customerEmail: customerEmail || 'customer@trustnest.in',
    planName: plan.name,
    subtotal: gst.subtotal,
    cgst: gst.cgst,
    sgst: gst.sgst,
    total: gst.grandTotal,
    hsnCode: '998314', // Classified Advertising & Portal Services
    paymentMethod,
    status: 'PAID'
  };
}
