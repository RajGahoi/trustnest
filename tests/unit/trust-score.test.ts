import { describe, it, expect } from 'vitest';
import { evaluateTrustScore } from '../../server/src/services/trust.service.js';

describe('Server Trust Scoring Engine', () => {
  it('should compute high Platinum tier score for verified seller with verified documents & clean media', () => {
    const result = evaluateTrustScore({
      sellerVerified: true,
      sellerType: 'BUILDER',
      documents: [
        { type: 'TITLE_DEED', status: 'VERIFIED' },
        { type: 'AADHAAR_PAN', status: 'VERIFIED' },
        { type: 'TAX_RECEIPT', status: 'VERIFIED' }
      ],
      location: {
        address: 'Sector 62, Noida',
        locality: 'Sector 62',
        city: 'Noida',
        pincode: '201309',
        lat: 28.6273,
        lng: 77.3725,
        verifiedCoords: true
      },
      images: [
        'https://images.unsplash.com/photo-1?w=800',
        'https://images.unsplash.com/photo-2?w=800',
        'https://images.unsplash.com/photo-3?w=800',
        'https://images.unsplash.com/photo-4?w=800'
      ],
      price: 15000000,
      categorySlug: 'property'
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(90);
    expect(result.tier).toBe('PLATINUM');
    expect(result.dimensions).toHaveLength(5);
    expect(result.fraudSignals).toHaveLength(0);
  });

  it('should detect duplicate images and penalize media score with a fraud signal', () => {
    const result = evaluateTrustScore({
      sellerVerified: false,
      sellerType: 'OWNER',
      documents: [],
      location: {
        address: 'Unknown',
        locality: 'Sector 1',
        city: 'Noida',
        pincode: '201301',
        lat: 28.6,
        lng: 77.3,
        verifiedCoords: false
      },
      images: [
        'https://images.unsplash.com/duplicate?w=800',
        'https://images.unsplash.com/duplicate?w=800'
      ],
      price: 500000,
      categorySlug: 'property'
    });

    const duplicateSignal = result.fraudSignals.find(s => s.type === 'DUPLICATE_IMAGE');
    expect(duplicateSignal).toBeDefined();
    expect(duplicateSignal?.severity).toBe('MEDIUM');
  });

  it('should flag unrealistic property price as a high-severity price anomaly signal', () => {
    const result = evaluateTrustScore({
      sellerVerified: true,
      sellerType: 'OWNER',
      documents: [],
      location: {
        address: 'Sector 15',
        locality: 'Sector 15',
        city: 'Noida',
        pincode: '201301',
        lat: 28.6,
        lng: 77.3,
        verifiedCoords: true
      },
      images: ['https://images.unsplash.com/photo-1?w=800'],
      price: 500, // Anomaly: ₹500 for real estate property
      categorySlug: 'property'
    });

    const anomalySignal = result.fraudSignals.find(s => s.type === 'PRICE_ANOMALY');
    expect(anomalySignal).toBeDefined();
    expect(anomalySignal?.severity).toBe('HIGH');
  });
});
