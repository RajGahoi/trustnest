import type { AreaUnit } from '../../types';

export interface BighaRegionRule {
  state: string;
  name: string;
  sqFtPerBigha: number;
  subUnitsNote: string;
}

export const REGIONAL_BIGHA_RULES: Record<string, BighaRegionRule> = {
  UP: {
    state: 'Uttar Pradesh',
    name: 'UP Pucca Bigha',
    sqFtPerBigha: 27225,
    subUnitsNote: '1 Bigha = 20 Biswa = 27,225 sq ft (~2,529.28 sq m)'
  },
  HARYANA: {
    state: 'Haryana / Punjab',
    name: 'Haryana Bigha',
    sqFtPerBigha: 9075,
    subUnitsNote: '1 Bigha = 4 Kanals = 80 Marlas = 9,075 sq ft'
  },
  BENGAL: {
    state: 'West Bengal',
    name: 'Bengal Bigha',
    sqFtPerBigha: 14400,
    subUnitsNote: '1 Bigha = 20 Kathas = 14,400 sq ft (~1,337.8 sq m)'
  },
  RAJASTHAN: {
    state: 'Rajasthan',
    name: 'Rajasthan Bigha',
    sqFtPerBigha: 17424,
    subUnitsNote: '1 Bigha = 20 Biswa = 17,424 sq ft (~1,618.7 sq m)'
  },
  DEFAULT: {
    state: 'India Standard (Pucca)',
    name: 'Standard Pucca Bigha',
    sqFtPerBigha: 27225,
    subUnitsNote: '1 Standard Bigha = 27,225 sq ft (0.625 Acre)'
  }
};

/**
 * Standard conversions to and from Square Feet
 */
export const AREA_TO_SQFT_FACTORS: Record<AreaUnit, number> = {
  sqft: 1,
  sqyd: 9, // 1 sq yd (Gaj) = 9 sq ft
  sqm: 10.7639, // 1 sq m = 10.7639 sq ft
  acre: 43560, // 1 Acre = 43,560 sq ft
  hectare: 107639, // 1 Hectare = 107,639 sq ft (~2.471 Acres)
  bigha: 27225 // Default Standard Pucca Bigha
};

export function convertArea(
  value: number,
  fromUnit: AreaUnit,
  toUnit: AreaUnit,
  regionKey: string = 'DEFAULT'
): number {
  if (value <= 0 || isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  // Compute base Sq Ft
  let sqftFactorFrom = AREA_TO_SQFT_FACTORS[fromUnit];
  if (fromUnit === 'bigha') {
    const rule = REGIONAL_BIGHA_RULES[regionKey] || REGIONAL_BIGHA_RULES.DEFAULT;
    sqftFactorFrom = rule.sqFtPerBigha;
  }
  const totalSqFt = value * sqftFactorFrom;

  // Convert Sq Ft to target unit
  let sqftFactorTo = AREA_TO_SQFT_FACTORS[toUnit];
  if (toUnit === 'bigha') {
    const rule = REGIONAL_BIGHA_RULES[regionKey] || REGIONAL_BIGHA_RULES.DEFAULT;
    sqftFactorTo = rule.sqFtPerBigha;
  }

  const converted = totalSqFt / sqftFactorTo;
  return Number(converted.toFixed(2));
}

export function formatAreaUnitLabel(unit: AreaUnit): string {
  switch (unit) {
    case 'sqft': return 'sq ft (Square Feet)';
    case 'sqyd': return 'sq yd / Gaj (Square Yards)';
    case 'sqm': return 'sq m (Square Metres)';
    case 'acre': return 'Acres';
    case 'hectare': return 'Hectares';
    case 'bigha': return 'Bigha (Regional Land Unit)';
  }
}

export function formatAreaWithUnit(area: number, unit: AreaUnit): string {
  return `${Number(area).toLocaleString('en-IN')} ${unit === 'sqyd' ? 'sq yd (Gaj)' : unit}`;
}
