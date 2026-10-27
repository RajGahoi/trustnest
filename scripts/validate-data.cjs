// Automated data QA for the generated multi-city inventory.
// Run with: npm run validate:data  (or: node scripts/validate-data.cjs)
//
// Checks the deterministic dataset in src/mock/generatedListings.ts for:
//  - duplicate listing ids / slugs
//  - orphan or malformed city references (must exist in src/mock/locations.ts)
//  - invalid category slugs
//  - missing/zero prices
//  - invalid listing status values
//  - invalid / internally-inconsistent trust scores
//  - missing seller references
//  - broken (empty) image arrays
//
// Exits with a non-zero code if any check fails, so it can be wired into CI.

const fs = require('fs');
const path = require('path');

function loadJsonExport(filePath, marker) {
  const src = fs.readFileSync(filePath, 'utf8');
  const afterMarker = src.split(marker)[1];
  const endIdx = afterMarker.indexOf('\n];');
  const jsonStr = afterMarker.slice(0, endIdx) + '\n]';
  return JSON.parse(jsonStr);
}

const mockDir = path.join(__dirname, '..', 'src', 'mock');
const listings = loadJsonExport(path.join(mockDir, 'generatedListings.ts'), 'GENERATED_LISTINGS: Listing[] = ');
const cityHierarchy = loadJsonExport(path.join(mockDir, 'locations.ts'), 'CITY_HIERARCHY: CityInfo[] = ');
const validCities = new Set(cityHierarchy.map(c => c.city));

const VALID_CATEGORIES = new Set(['property', 'vehicles', 'mobiles', 'electronics', 'furniture', 'jobs', 'services', 'other']);
const VALID_STATUSES = new Set(['DRAFT', 'SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'SOLD', 'REJECTED', 'SUSPENDED', 'ARCHIVED']);

const errors = [];
const seenIds = new Set();
const seenSlugs = new Set();

listings.forEach((l, i) => {
  const tag = `[${l.id || `#${i}`}]`;

  if (seenIds.has(l.id)) errors.push(`${tag} duplicate listing id`);
  seenIds.add(l.id);

  if (seenSlugs.has(l.slug)) errors.push(`${tag} duplicate slug: ${l.slug}`);
  seenSlugs.add(l.slug);

  if (!l.title || l.title.trim().length < 3) errors.push(`${tag} missing/too-short title`);
  if (!VALID_CATEGORIES.has(l.categorySlug)) errors.push(`${tag} invalid category slug: ${l.categorySlug}`);
  if (!l.location || !validCities.has(l.location.city)) errors.push(`${tag} orphan/invalid city reference: ${l.location && l.location.city}`);
  if (!l.location || !l.location.locality) errors.push(`${tag} missing locality`);
  if (!(l.price > 0)) errors.push(`${tag} missing or non-positive price`);
  if (!VALID_STATUSES.has(l.status)) errors.push(`${tag} invalid listing status: ${l.status}`);
  if (!l.sellerId || !l.sellerName) errors.push(`${tag} missing seller reference`);
  if (!Array.isArray(l.images) || l.images.length === 0) errors.push(`${tag} broken/empty image array`);
  (l.images || []).forEach(url => {
    if (!/^https:\/\/images\.unsplash\.com\/photo-/.test(url)) errors.push(`${tag} unexpected image host: ${url}`);
  });

  // Trust score internal consistency
  if (l.trustScore) {
    const dimSum = (l.trustScore.dimensions || []).reduce((s, d) => s + d.score, 0);
    if (Math.abs(dimSum - l.trustScore.overallScore) > 5) {
      errors.push(`${tag} trust score inconsistent: dimensions sum to ${dimSum}, overallScore is ${l.trustScore.overallScore}`);
    }
    const expectedTier = l.trustScore.overallScore >= 90 ? 'PLATINUM' : l.trustScore.overallScore >= 80 ? 'GOLD' : l.trustScore.overallScore >= 65 ? 'SILVER' : 'STANDARD';
    if (l.trustScore.tier !== expectedTier) {
      errors.push(`${tag} trust tier "${l.trustScore.tier}" does not match score ${l.trustScore.overallScore} (expected ${expectedTier})`);
    }
  } else {
    errors.push(`${tag} missing trustScore`);
  }
});

// City coverage check — every city in the hierarchy should have eligible (published) inventory
const publishedByCity = {};
listings.filter(l => l.status === 'PUBLISHED').forEach(l => {
  publishedByCity[l.location.city] = (publishedByCity[l.location.city] || 0) + 1;
});
cityHierarchy.forEach(c => {
  if (!publishedByCity[c.city] || publishedByCity[c.city] < 3) {
    errors.push(`City coverage warning: ${c.city} has only ${publishedByCity[c.city] || 0} published listings`);
  }
});

console.log(`Checked ${listings.length} generated listings across ${cityHierarchy.length} cities.`);
if (errors.length === 0) {
  console.log('✔ No data integrity issues found.');
  process.exit(0);
} else {
  console.log(`✘ Found ${errors.length} issue(s):`);
  errors.forEach(e => console.log(' - ' + e));
  process.exit(1);
}
