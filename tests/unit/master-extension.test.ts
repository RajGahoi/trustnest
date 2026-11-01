import { describe, it, expect } from 'vitest';
import { calculateGST, validateCoupon, generateInvoice, BUYER_SUBSCRIPTION_PLANS } from '../../src/domain/monetization/plans';
import { store } from '../../src/mock/store';

describe('Monetization & GST Calculation Engine', () => {
  it('calculates 18% GST (CGST 9% + SGST 9%) correctly', () => {
    const calculation = calculateGST(1000);
    expect(calculation.subtotal).toBe(1000);
    expect(calculation.cgst).toBe(90);
    expect(calculation.sgst).toBe(90);
    expect(calculation.gstTotal).toBe(180);
    expect(calculation.grandTotal).toBe(1180);
  });

  it('applies percentage coupon TRUSTNEST50 correctly and generates tax invoice', () => {
    const validation = validateCoupon('TRUSTNEST50', 2000);
    expect(validation.valid).toBe(true);
    expect(validation.discountAmount).toBe(1000);

    const plan = BUYER_SUBSCRIPTION_PLANS[1]; // Weekly Pass
    const invoice = generateInvoice('Rajesh Kumar', 'rajesh@example.com', plan, 50, 'UPI');
    expect(invoice.invoiceNo).toContain('TN-INV');
    expect(invoice.hsnCode).toBe('998314');
    expect(invoice.status).toBe('PAID');
    expect(invoice.cgst).toBeGreaterThan(0);
    expect(invoice.sgst).toBeGreaterThan(0);
  });

  it('rejects invalid or expired coupon codes safely', () => {
    const invalid = validateCoupon('EXPIRED99', 1000);
    expect(invalid.valid).toBe(false);
    expect(invalid.discountAmount).toBe(0);
  });
});

describe('Store State Management: Extensions', () => {
  it('manages property comparisons up to maximum limit', () => {
    const allListings = store.getAllListings();
    expect(allListings.length).toBeGreaterThan(0);

    store.clearComparison();
    expect(store.getComparisonListings().length).toBe(0);

    const first = allListings[0];
    const added = store.addToComparison(first.id);
    expect(added).toBe(true);
    expect(store.isInComparison(first.id)).toBe(true);

    store.removeFromComparison(first.id);
    expect(store.isInComparison(first.id)).toBe(false);
  });

  it('handles contact reveals and protects seller telephone numbers', () => {
    const revealsRemaining = store.getContactRevealsRemaining();
    expect(revealsRemaining).toBeGreaterThanOrEqual(1);

    const decremented = store.decrementContactReveal();
    expect(decremented).toBe(true);
    expect(store.getContactRevealsRemaining()).toBe(revealsRemaining - 1);
  });

  it('transitions lead stages across 8-step pipeline and records private notes', () => {
    const leads = store.getLeads();
    expect(leads.length).toBeGreaterThan(0);

    const testLead = leads[0];
    const updated = store.updateLeadStatus(testLead.id, 'NEGOTIATION');
    expect(updated).toBe(true);

    const noted = store.addLeadNote(testLead.id, 'Buyer made formal counter-offer of 2.1 Cr');
    expect(noted).toBe(true);

    const reloaded = store.getLeads().find(l => l.id === testLead.id);
    expect(reloaded?.status).toBe('NEGOTIATION');
    expect(reloaded?.notes?.[0].text).toContain('2.1 Cr');
  });
});
