/**
 * Indian RERA (Real Estate Regulatory Authority) reference and verification utilities
 */

export interface StateReraInfo {
  state: string;
  authorityName: string;
  portalUrl: string;
  pattern: RegExp;
  example: string;
}

export const STATE_RERA_REGISTRY: Record<string, StateReraInfo> = {
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    authorityName: 'UP RERA',
    portalUrl: 'https://www.up-rera.in/projects',
    pattern: /^UPRERAPRJ\d{4,8}$/i,
    example: 'UPRERAPRJ12345'
  },
  'Haryana': {
    state: 'Haryana',
    authorityName: 'HRERA Gurugram / Panchkula',
    portalUrl: 'https://haryanarera.gov.in/',
    pattern: /^(GGM|PKL)\/\d{1,4}\/\d{1,4}\/\d{4}\/\d{1,4}$/i,
    example: 'GGM/382/114/2020/28'
  },
  'Maharashtra': {
    state: 'Maharashtra',
    authorityName: 'MahaRERA',
    portalUrl: 'https://maharera.mahaonline.gov.in/',
    pattern: /^P\d{11}$/i,
    example: 'P51800001234'
  },
  'Karnataka': {
    state: 'Karnataka',
    authorityName: 'Karnataka RERA',
    portalUrl: 'https://rera.karnataka.gov.in/',
    pattern: /^PRM\/KA\/RERA\/\d{4}\/\d{3}\/PR\/\d{6}\/\d{6}$/i,
    example: 'PRM/KA/RERA/1251/310/PR/171015/000123'
  },
  'Delhi': {
    state: 'Delhi',
    authorityName: 'Delhi RERA',
    portalUrl: 'https://rera.delhi.gov.in/',
    pattern: /^DLRERA\d{4}P\d{4}$/i,
    example: 'DLRERA2019P0005'
  }
};

export function validateReraNumber(reraNumber: string, state?: string): { isValid: boolean; portalUrl?: string; authorityName?: string } {
  if (!reraNumber || !reraNumber.trim()) {
    return { isValid: false };
  }
  const clean = reraNumber.trim();

  if (state && STATE_RERA_REGISTRY[state]) {
    const info = STATE_RERA_REGISTRY[state];
    return {
      isValid: info.pattern.test(clean) || clean.length >= 8,
      portalUrl: info.portalUrl,
      authorityName: info.authorityName
    };
  }

  // Generic check
  const matched = Object.values(STATE_RERA_REGISTRY).find(item => item.pattern.test(clean));
  if (matched) {
    return {
      isValid: true,
      portalUrl: matched.portalUrl,
      authorityName: matched.authorityName
    };
  }

  return {
    isValid: clean.length >= 6,
    portalUrl: 'https://mohua.gov.in/cms/rera.php',
    authorityName: 'State RERA Portal'
  };
}

export const LEGAL_DISCLAIMER_TEXT = 
  'Legal Disclaimer: Document review and trust scoring performed by TrustNest represent procedural authenticity checks ' +
  'and do not constitute an authoritative legal title guarantee, encumbrance warrant, or government ownership endorsement. ' +
  'Prospective buyers are advised to conduct independent registrar searches and physical title due diligence.';
