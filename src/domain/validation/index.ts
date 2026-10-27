export function sanitizeString(input: string, maxLength: number = 500): string {
  if (!input) return '';
  const clean = input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip inline JS
    .trim();
  return clean.substring(0, maxLength);
}

export function validatePrice(price: number): { valid: boolean; error?: string } {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, error: 'Price must be a valid number.' };
  }
  if (price <= 0) {
    return { valid: false, error: 'Price must be greater than 0.' };
  }
  if (price > 100000000000) {
    return { valid: false, error: 'Price exceeds maximum platform threshold (₹10,000 Cr).' };
  }
  return { valid: true };
}
