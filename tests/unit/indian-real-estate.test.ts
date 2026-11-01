import { describe, it, expect } from 'vitest';
import { formatINR, parseINR, formatIndianMobile } from '../../src/domain/india/currency';
import { convertArea, formatAreaWithUnit } from '../../src/domain/india/area';
import { validateReraNumber, STATE_RERA_REGISTRY } from '../../src/domain/india/rera';
import { calculateDistanceKm } from '../../src/domain/location/geo';

describe('Indian Real Estate Domain: Currency & Localization', () => {
  it('formats values in Lakhs and Crores accurately with compact mode', () => {
    expect(formatINR(1500000, { compact: true })).toBe('₹15 Lakh');
    expect(formatINR(24500000, { compact: true })).toBe('₹2.45 Cr');
    expect(formatINR(75000)).toBe('₹75,000');
  });

  it('parses formatted Indian strings back to raw numeric values', () => {
    expect(parseINR('₹2.5 Cr')).toBe(25000000);
    expect(parseINR('50 Lakh')).toBe(5000000);
    expect(parseINR('₹45,000')).toBe(45000);
  });

  it('validates and formats 10-digit Indian mobile numbers with +91 prefix', () => {
    expect(formatIndianMobile('9876543210')).toBe('+91 98765 43210');
    expect(formatIndianMobile('+919876543210')).toBe('+91 98765 43210');
  });
});

describe('Indian Real Estate Domain: Regional Area Conversions', () => {
  it('converts between standard metric and imperial units', () => {
    // 1000 sq ft to sq meters
    const sqMeters = convertArea(1000, 'sqft', 'sqm');
    expect(sqMeters).toBeCloseTo(92.9, 1);

    // 1 Acre to sq ft
    const sqFtFromAcre = convertArea(1, 'acre', 'sqft');
    expect(sqFtFromAcre).toBe(43560);
  });

  it('respects regional state Bigha variations without assuming universal equivalence', () => {
    // Uttar Pradesh Pucca Bigha = 27,225 sq ft
    const upBighaInSqFt = convertArea(1, 'bigha', 'sqft', 'UP');
    expect(upBighaInSqFt).toBe(27225);

    // Haryana Bigha = 9,075 sq ft
    const haryanaBighaInSqFt = convertArea(1, 'bigha', 'sqft', 'HARYANA');
    expect(haryanaBighaInSqFt).toBe(9075);

    // Rajasthan Bigha = 17,424 sq ft
    const rajasthanBighaInSqFt = convertArea(1, 'bigha', 'sqft', 'RAJASTHAN');
    expect(rajasthanBighaInSqFt).toBe(17424);

    // Bengal Bigha = 14,400 sq ft
    const bengalBighaInSqFt = convertArea(1, 'bigha', 'sqft', 'BENGAL');
    expect(bengalBighaInSqFt).toBe(14400);
  });

  it('formats area strings with appropriate units', () => {
    expect(formatAreaWithUnit(1850, 'sqft')).toBe('1,850 sqft');
    expect(formatAreaWithUnit(2.5, 'acre')).toBe('2.5 acre');
  });
});

describe('Indian Real Estate Domain: RERA & Spatial Intelligence', () => {
  it('validates state-specific RERA numbers correctly', () => {
    const upResult = validateReraNumber('UPRERAPRJ12345');
    expect(upResult.isValid).toBe(true);
    expect(upResult.portalUrl).toContain('up-rera.in');

    const mhResult = validateReraNumber('P51800001234');
    expect(mhResult.isValid).toBe(true);
    expect(mhResult.portalUrl).toContain('maharera');

    const dlResult = validateReraNumber('DLRERA2019P0005');
    expect(dlResult.isValid).toBe(true);
  });

  it('contains registered state portals in RERA registry', () => {
    expect(STATE_RERA_REGISTRY['Uttar Pradesh'].authorityName).toBe('UP RERA');
    expect(STATE_RERA_REGISTRY['Maharashtra'].authorityName).toBe('MahaRERA');
    expect(STATE_RERA_REGISTRY['Karnataka'].authorityName).toBe('Karnataka RERA');
  });

  it('calculates geographic distance using Haversine algorithm', () => {
    // Connaught Place Delhi to Cyber City Gurugram (~25-30km)
    const distanceKm = calculateDistanceKm(
      { lat: 28.6315, lng: 77.2167 },
      { lat: 28.4595, lng: 77.0266 }
    );
    expect(distanceKm).toBeGreaterThan(15);
    expect(distanceKm).toBeLessThan(35);
  });
});
