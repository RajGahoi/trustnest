/**
 * Indian Rupee (INR) currency formatting and number parsing
 * Converts numbers into standard Indian numbering system (Lakhs & Crores).
 */

export function formatINR(amount: number, options: { compact?: boolean; showSymbol?: boolean } = {}): string {
  const { compact = false, showSymbol = true } = options;
  const symbol = showSymbol ? '₹' : '';

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0`;
  }

  if (compact) {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `${symbol}${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `${symbol}${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
    if (amount >= 1000) {
      const k = amount / 1000;
      return `${symbol}${k.toFixed(1).replace(/\.0$/, '')}k`;
    }
  }

  // Standard Indian comma grouping (e.g., 2,50,00,000)
  const parts = Math.round(amount).toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${symbol}${res}`;
}

export function parseINR(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[₹,\s]/g, '').toLowerCase();

  if (cleaned.includes('cr')) {
    const num = parseFloat(cleaned.replace('cr', ''));
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (cleaned.includes('lakh') || cleaned.includes('lac') || cleaned.includes('l')) {
    const num = parseFloat(cleaned.replace(/lakh|lac|l/, ''));
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace('k', ''));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }

  const direct = parseFloat(cleaned);
  return isNaN(direct) ? 0 : direct;
}

export function formatIndianMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
