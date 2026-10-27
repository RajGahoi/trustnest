// Deterministic multi-city marketplace data generator.
// Run with: npm run seed  (or: node scripts/generate-listings.cjs)
// Regenerates src/mock/generatedListings.ts and src/mock/locations.ts.
// Uses a seeded PRNG so output is 100% reproducible (no "randomizer chaos") —
// running this twice in a row produces byte-identical output, so it is safe
// to run repeatedly without creating uncontrolled duplicate records.

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260928); // seeded on today's date for reproducibility
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};
const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const round100 = (n) => Math.round(n / 100) * 100;
const round1000 = (n) => Math.round(n / 1000) * 1000;

// ---------------------------------------------------------------------------
// CITY / STATE / LOCALITY HIERARCHY
// ---------------------------------------------------------------------------
const CITIES = [
  {
    city: 'Greater Noida', state: 'Uttar Pradesh', tier: 0.95, pincodes: ['201306', '201310', '201308', '201301'],
    localities: ['Knowledge Park III', 'Alpha 1', 'Beta 2', 'Pari Chowk', 'Sector 1 (Greater Noida West)', 'Techzone 4'],
    center: [28.4744, 77.5040]
  },
  {
    city: 'Noida', state: 'Uttar Pradesh', tier: 1.0, pincodes: ['201301', '201309', '201304', '201305'],
    localities: ['Sector 18', 'Sector 62', 'Sector 75', 'Sector 76', 'Sector 137', 'Sector 50'],
    center: [28.5355, 77.3910]
  },
  {
    city: 'Gurugram', state: 'Haryana', tier: 1.2, pincodes: ['122002', '122009', '122018', '122001'],
    localities: ['Golf Course Road', 'DLF Phase 1', 'DLF Phase 2', 'Cyber City', 'Sohna Road', 'Sector 57'],
    center: [28.4595, 77.0266]
  },
  {
    city: 'Delhi NCR', state: 'Delhi', tier: 1.25, pincodes: ['110001', '110075', '110085', '110017'],
    localities: ['Connaught Place', 'Dwarka Sector 12', 'Rohini Sector 7', 'Saket', 'Vasant Kunj', 'Karol Bagh'],
    center: [28.6139, 77.2090]
  },
  {
    city: 'Bengaluru', state: 'Karnataka', tier: 1.15, pincodes: ['560066', '560100', '560102', '560034'],
    localities: ['Whitefield', 'Electronic City', 'HSR Layout', 'Koramangala', 'Indiranagar', 'Marathahalli'],
    center: [12.9716, 77.5946]
  },
  {
    city: 'Mumbai', state: 'Maharashtra', tier: 1.5, pincodes: ['400053', '400076', '400050', '400607'],
    localities: ['Andheri West', 'Powai', 'Bandra West', 'Vashi (Navi Mumbai)', 'Malad West', 'Thane West'],
    center: [19.0760, 72.8777]
  },
  {
    city: 'Hyderabad', state: 'Telangana', tier: 0.9, pincodes: ['500081', '500033', '500084', '500072'],
    localities: ['Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'HITEC City', 'Banjara Hills'],
    center: [17.3850, 78.4867]
  }
];

// ---------------------------------------------------------------------------
// IMAGE POOLS (reusing only image URLs already verified/present in this codebase)
// ---------------------------------------------------------------------------
const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const AV = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=80`;

const IMAGES = {
  property: ['1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c', '1600607687939-ce8a6c25118c', '1600566753376-12c8ab7fb75b', '1545324418-cc1a3fa10c00', '1512917774080-9991f1c4c750', '1596176530529-78163a4f7af2', '1570168007204-dfb528c6958f'],
  vehicles: ['1555215695-3004980ad54e', '1541348263662-e082662dc363', '1503376780353-7e6692767b70'],
  mobiles: ['1695048133142-1a20484d2569', '1511707171634-5f897ff02aa9'],
  electronics: ['1517336714731-489689fd1ca8', '1541807084-5c52b6b3adef', '1498050108023-c5249f4df085'],
  furniture: ['1617806118233-18e1de247200', '1555041469-a586c61ea9bc'],
  jobs: ['1486406146926-c627a92ad1ab', '1522071820081-009f0129c71c'],
  services: ['1621905251189-08b45d6a269e', '1522071820081-009f0129c71c'],
  other: ['1523275335684-37898b6baf30']
};
const AVATAR_POOL = ['1560250097-0b93528c311a', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1494790108377-be9c29b29330', '1472099645785-5658abf4ff4e', '1534528741775-53994a69daeb', '1573496359142-b8d87734a5a2', '1519085360753-af0119f7cbe7', '1535713875002-d1d0cf377fde'];

function imagesFor(categorySlug) {
  const pool = IMAGES[categorySlug] || IMAGES.other;
  const n = categorySlug === 'property' ? pick([3, 4, 5, 6, 8]) : Math.min(pool.length, pick([1, 2, pool.length]));
  return pickN(pool, Math.min(n, pool.length)).map(IMG);
}

// ---------------------------------------------------------------------------
// SELLER / VENDOR REGISTRY
// ---------------------------------------------------------------------------
const FIRST = ['Rohit', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Rahul', 'Divya', 'Karan', 'Priyanka', 'Aditya', 'Meera', 'Suresh', 'Neha', 'Manish', 'Pooja'];
const LAST = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Malhotra', 'Chawla', 'Rao', 'Bhatt', 'Kulkarni', 'Menon', 'Kapoor', 'Joshi'];

let sellerSeq = 200;
const SELLERS = []; // { id, name, type, phone, email, avatar, rating, verified }

function makeIndividual(cityIdx) {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const s = {
    id: `usr-ind-${sellerSeq++}`,
    name,
    type: 'OWNER',
    phone: `+91 9${int(1000000, 9999999)}${int(10, 99)}`,
    email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
    avatar: AV(pick(AVATAR_POOL)),
    rating: (int(42, 50) / 10),
    verified: rng() > 0.15
  };
  SELLERS.push(s);
  return s;
}

function makeVendor(namePrefix, city, type) {
  const s = {
    id: `usr-vnd-${sellerSeq++}`,
    name: `${namePrefix} — ${city}`,
    type,
    phone: `+91 ${int(70, 99)}${int(100, 999)} ${int(10000, 99999)}`,
    email: `contact@${namePrefix.toLowerCase().replace(/[^a-z0-9]+/g, '')}.in`,
    avatar: AV(pick(AVATAR_POOL)),
    rating: (int(44, 50) / 10),
    verified: true
  };
  SELLERS.push(s);
  return s;
}

// Vendor name pools per category (kept clearly synthetic/demo)
const VENDOR_NAMES = {
  property: ['Skyline Estates', 'Capital City Realtors', 'Nest & Key Properties', 'Horizon Realty Group'],
  vehicles: ['Highway Motors Certified', 'CarTrust Pre-Owned', 'Velocity Auto Dealership'],
  mobiles: ['GadgetVerify Retail', 'TechBazaar Devices'],
  electronics: ['CircuitHub Electronics', 'PixelWorks Retail'],
  furniture: ['Woodcraft Interiors', 'Urban Nest Furnishings'],
  jobs: ['Northwind Technologies', 'Synapse Digital Labs', 'Bluepeak Solutions', 'Everline Systems'],
  services: ['ProCraft Home Services', 'Meridian Consulting']
};

// ---------------------------------------------------------------------------
// CATEGORY-SPECIFIC GENERATORS
// ---------------------------------------------------------------------------
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Office'];
const BHKS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const FURNISHING = ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'];

function genProperty(city, locality, seller, idx) {
  const bhk = pick(BHKS);
  const bedrooms = parseInt(bhk) || 5;
  const propertyType = pick(PROPERTY_TYPES);
  const area = propertyType === 'Plot' ? int(1000, 3600) : int(550 + bedrooms * 150, 900 + bedrooms * 480);
  const pricePerSqft = int(4200, 8600) * city.tier;
  const rawPrice = round1000(pricePerSqft * area);
  const formattedPrice = rawPrice >= 10000000 ? `₹${(rawPrice / 10000000).toFixed(2)} Cr` : `₹${(rawPrice / 100000).toFixed(1)} Lakh`;
  const floorTotal = int(8, 28);
  const floorNum = int(1, floorTotal);
  const titleVariants = [
    `${bhk} ${propertyType} in ${locality}, ${city.city}`,
    `Spacious ${bhk} ${propertyType} Near Main Road, ${locality}`,
    `${propertyType} for Sale — ${bhk}, ${locality} ${city.city}`,
    `Well-Maintained ${bhk} ${propertyType} with Parking, ${locality}`
  ];
  const descVariants = [
    `${bedrooms >= 1 ? bhk : ''} ${propertyType.toLowerCase()} located in ${locality}, ${city.city}. ${area} sq.ft carpet area, ${pick(FURNISHING).toLowerCase()}, close to schools, hospitals and metro connectivity. Clear title and municipal approvals on file.`,
    `Available for immediate sale: ${propertyType.toLowerCase()} in a gated community at ${locality}. Good natural light, ${int(1, 2)} covered parking slot(s), power backup, and 24x7 security. Ideal for end-use or investment.`,
    `Resale ${propertyType.toLowerCase()} in prime ${locality} pocket of ${city.city}. Recently repainted, modular kitchen fittings included, low-maintenance society with clubhouse and children's play area nearby.`
  ];
  return {
    categorySlug: 'property', categoryName: 'Real Estate',
    title: pick(titleVariants),
    description: pick(descVariants),
    price: rawPrice, formattedPrice,
    attributes: {
      bhk, propertyType, area,
      furnishing: pick(FURNISHING),
      floor: `${floorNum}th of ${floorTotal}`,
      parking: rng() > 0.3
    }
  };
}

const VEHICLE_BRANDS = {
  'Hyundai': [700000, 1250000], 'Tata Motors': [600000, 1100000], 'Mahindra': [900000, 1700000],
  'BMW': [4200000, 7200000], 'Mercedes-Benz': [5000000, 8500000], 'Toyota': [1500000, 3200000],
  'Royal Enfield': [160000, 360000]
};
function genVehicle(city, locality, seller, idx) {
  const brand = pick(Object.keys(VEHICLE_BRANDS));
  const [lo, hi] = VEHICLE_BRANDS[brand];
  const year = int(2018, 2025);
  const age = 2026 - year;
  const kmDriven = int(4000, 18000) * Math.max(age, 1);
  const depreciation = Math.max(0.55, 1 - age * 0.07);
  const rawPrice = round1000(int(lo, hi) * depreciation);
  const models = {
    'Hyundai': ['Creta', 'Verna', 'i20'], 'Tata Motors': ['Nexon', 'Harrier', 'Punch'],
    'Mahindra': ['XUV700', 'Scorpio-N', 'Thar'], 'BMW': ['3 Series', '5 Series', 'X5'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC'], 'Toyota': ['Fortuner', 'Innova Crysta', 'Camry'],
    'Royal Enfield': ['Classic 350', 'Himalayan', 'Meteor 350']
  };
  const model = pick(models[brand]);
  const owners = pick(['1st Owner', '1st Owner', '2nd Owner', '3rd Owner+']);
  return {
    categorySlug: 'vehicles', categoryName: 'Vehicles',
    title: `${brand} ${model} ${year} — ${owners}, ${(kmDriven / 1000).toFixed(0)}K km`,
    description: `${year} ${brand} ${model} in ${locality}, ${city.city}. ${kmDriven.toLocaleString()} km on the odometer, ${owners.toLowerCase()}, full service records maintained at authorised centre. Valid insurance and clean VAHAN registration history.`,
    price: rawPrice, formattedPrice: `₹${(rawPrice / 100000).toFixed(2)} Lakh`,
    attributes: {
      brand, year, kmDriven,
      fuelType: pick(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid']),
      transmission: pick(['Automatic', 'Manual']),
      ownersCount: owners
    }
  };
}

const MOBILE_BRANDS = {
  'Apple': [55000, 145000], 'Samsung': [35000, 115000], 'OnePlus': [28000, 68000],
  'Google Pixel': [38000, 92000], 'Xiaomi': [13000, 42000], 'Nothing': [22000, 46000]
};
function genMobile(city, locality, seller, idx) {
  const brand = pick(Object.keys(MOBILE_BRANDS));
  const [lo, hi] = MOBILE_BRANDS[brand];
  const storage = pick(['64 GB', '128 GB', '256 GB', '512 GB', '1 TB']);
  const condition = pick(['Like New (Flawless)', 'Excellent', 'Good', 'Fair']);
  const condFactor = { 'Like New (Flawless)': 1, 'Excellent': 0.9, 'Good': 0.78, 'Fair': 0.62 }[condition];
  const rawPrice = round100(int(lo, hi) * condFactor);
  const models = {
    'Apple': ['iPhone 15 Pro', 'iPhone 14', 'iPhone 15 Pro Max'], 'Samsung': ['Galaxy S24 Ultra', 'Galaxy Z Fold 5', 'Galaxy S23'],
    'OnePlus': ['12', '11R', 'Open'], 'Google Pixel': ['8 Pro', '8', '7a'],
    'Xiaomi': ['14 Ultra', '13 Pro', 'Redmi Note 13 Pro'], 'Nothing': ['Phone (2)', 'Phone (2a)']
  };
  const model = pick(models[brand]);
  return {
    categorySlug: 'mobiles', categoryName: 'Mobiles & Tabs',
    title: `${brand} ${model} (${storage}) — ${condition}`,
    description: `${condition} condition ${brand} ${model}, ${storage} variant. Seller based in ${locality}, ${city.city}. Includes original box and charging cable; battery health verified prior to listing.`,
    price: rawPrice, formattedPrice: `₹${rawPrice.toLocaleString('en-IN')}`,
    attributes: {
      brand, storage,
      ram: pick(['4 GB', '8 GB', '12 GB', '16 GB']),
      condition, warranty: rng() > 0.5
    }
  };
}

const ELEC_TYPES = {
  'Laptop': [45000, 220000], 'Desktop PC': [40000, 150000], 'Smart TV': [25000, 120000],
  'Camera': [30000, 180000], 'Audio/Headphones': [5000, 40000]
};
function genElectronics(city, locality, seller, idx) {
  const deviceType = pick(Object.keys(ELEC_TYPES));
  const [lo, hi] = ELEC_TYPES[deviceType];
  const rawPrice = round100(int(lo, hi));
  const processors = { 'Laptop': 'Apple M2 / Intel i7 13th Gen', 'Desktop PC': 'AMD Ryzen 7 / Intel i9', 'Smart TV': '', 'Camera': '', 'Audio/Headphones': '' };
  return {
    categorySlug: 'electronics', categoryName: 'Electronics & Laptops',
    title: `${deviceType} — ${pick(['Excellent Condition', 'Barely Used', 'Original Bill Available', 'Under Warranty'])}`,
    description: `${deviceType} for sale in ${locality}, ${city.city}. Well maintained, no repairs or screen damage, sold with all original accessories where applicable.`,
    price: rawPrice, formattedPrice: `₹${rawPrice.toLocaleString('en-IN')}`,
    attributes: {
      deviceType,
      processor: processors[deviceType] || undefined,
      originalBill: rng() > 0.4
    }
  };
}

const FURN_ITEMS = {
  'Sofa Set': [25000, 90000], 'Bed Frame': [15000, 60000], 'Dining Table': [20000, 80000],
  'Office Chair': [5000, 25000], 'Wardrobe': [15000, 55000]
};
function genFurniture(city, locality, seller, idx) {
  const itemType = pick(Object.keys(FURN_ITEMS));
  const [lo, hi] = FURN_ITEMS[itemType];
  const material = pick(['Solid Teak Wood', 'Engineered Wood', 'Leatherette', 'Fabric', 'Metal']);
  const materialFactor = material === 'Solid Teak Wood' ? 1.3 : material === 'Metal' ? 0.9 : 1;
  const rawPrice = round100(int(lo, hi) * materialFactor);
  return {
    categorySlug: 'furniture', categoryName: 'Furniture & Decor',
    title: `${material} ${itemType} — ${locality} Pickup`,
    description: `${itemType} made of ${material.toLowerCase()}, in good used condition. Located in ${locality}, ${city.city}; buyer to arrange pickup or local delivery can be arranged for a small fee.`,
    price: rawPrice, formattedPrice: `₹${rawPrice.toLocaleString('en-IN')}`,
    attributes: { material, itemType }
  };
}

const JOB_ROLES = ['Backend Engineer', 'Frontend Developer', 'Product Manager', 'Data Analyst', 'DevOps Engineer', 'UI/UX Designer', 'QA Engineer', 'Sales Executive'];
const EXPERIENCE_BANDS = {
  'Entry Level (0-2 yrs)': [400000, 800000], 'Mid Level (3-5 yrs)': [800000, 1600000],
  'Senior (6-10 yrs)': [1600000, 3200000], 'Lead / Director': [3000000, 6000000]
};
function genJob(city, locality, seller, idx) {
  const role = pick(JOB_ROLES);
  const experience = pick(Object.keys(EXPERIENCE_BANDS));
  const [lo, hi] = EXPERIENCE_BANDS[experience];
  const salaryLo = round1000(lo);
  const salaryHi = round1000(hi);
  const roleType = pick(['Full Time', 'Part Time', 'Remote', 'Contract']);
  return {
    categorySlug: 'jobs', categoryName: 'Jobs & Careers',
    title: `${role} — ${roleType} (${experience.split(' (')[0]})`,
    description: `${seller.name.split(' — ')[0]} is hiring a ${role} for its ${locality}, ${city.city} office. ${roleType} role suited to candidates at the ${experience.toLowerCase()} band. Competitive compensation with performance bonus.`,
    price: salaryLo, formattedPrice: `₹${(salaryLo / 100000).toFixed(1)} - ${(salaryHi / 100000).toFixed(1)} LPA`,
    pricePeriod: '/year',
    attributes: { roleType, experience }
  };
}

const SERVICE_TYPES = ['Interior Design', 'Legal Verification', 'Home Renovation', 'IT Consulting', 'Packers & Movers'];
function genService(city, locality, seller, idx) {
  const serviceType = pick(SERVICE_TYPES);
  const pricingModel = pick(['Hourly', 'Fixed Project Fee']);
  const rawPrice = pricingModel === 'Hourly' ? int(500, 4500) : round1000(int(8000, 95000));
  return {
    categorySlug: 'services', categoryName: 'Services & Experts',
    title: `${serviceType} Services in ${locality}, ${city.city}`,
    description: `Background-checked ${serviceType.toLowerCase()} provider serving ${locality} and nearby areas of ${city.city}. ${pricingModel === 'Hourly' ? 'Hourly consultation available.' : 'Fixed-fee project packages available.'} References available on request.`,
    price: rawPrice, formattedPrice: pricingModel === 'Hourly' ? `₹${rawPrice.toLocaleString('en-IN')}/hr` : `₹${rawPrice.toLocaleString('en-IN')}`,
    attributes: { serviceType, pricingModel }
  };
}

const OTHER_ITEMS = ['Vintage Vinyl Record Collection', 'Acoustic Guitar (Fender)', 'Treadmill (Home Gym)', 'Antique Wall Clock', 'Mountain Bike (18-Speed)'];
function genOther(city, locality, seller, idx) {
  const item = pick(OTHER_ITEMS);
  const rawPrice = round100(int(3000, 45000));
  return {
    categorySlug: 'other', categoryName: 'Classifieds & Collectibles',
    title: `${item} — ${locality}`,
    description: `${item} in working/good condition, selling due to relocation. Available for local pickup in ${locality}, ${city.city}.`,
    price: rawPrice, formattedPrice: `₹${rawPrice.toLocaleString('en-IN')}`,
    attributes: {}
  };
}

const GENERATORS = {
  property: genProperty, vehicles: genVehicle, mobiles: genMobile, electronics: genElectronics,
  furniture: genFurniture, jobs: genJob, services: genService, other: genOther
};

// ---------------------------------------------------------------------------
// TRUST SCORE / DOCS / STATUS
// ---------------------------------------------------------------------------
let dimSeq = 200;
function genTrustScore(sellerVerified) {
  const base = sellerVerified ? int(78, 98) : int(55, 82);
  const dims = ['Identity', 'Documents', 'Location', 'Media', 'Risk'];
  const per = Math.floor(base / 5);
  let remainder = base - per * 5;
  const dimensions = dims.map((name, i) => {
    let score = Math.min(20, per + (i < remainder ? 1 : 0) + int(-1, 1));
    score = Math.max(10, Math.min(20, score));
    const status = score >= 15 ? 'PASSED' : score >= 11 ? 'PENDING' : 'FLAGGED';
    return {
      id: `td-gen-${dimSeq++}`, name, score, maxScore: 20, status,
      details: `${name} verification ${status === 'PASSED' ? 'completed successfully' : status === 'PENDING' ? 'awaiting final confirmation' : 'flagged for manual review'}`,
      verifiedAt: '2026-09-26'
    };
  });
  const overallScore = Math.min(99, dimensions.reduce((s, d) => s + d.score, 0));
  const tier = overallScore >= 90 ? 'PLATINUM' : overallScore >= 80 ? 'GOLD' : overallScore >= 65 ? 'SILVER' : 'STANDARD';
  return { overallScore, tier, badgeLabel: `VERIFIED ${overallScore}/100`, verifiedAt: '2026-09-26', dimensions };
}

const STATUS_POOL = ['PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'SOLD', 'EXPIRED', 'PAUSED'];

// ---------------------------------------------------------------------------
// MAIN GENERATION LOOP
// ---------------------------------------------------------------------------
const CATEGORY_PLAN = [
  { slug: 'property', vendors: 2, individuals: 1, listingsPerVendor: 2, vendorType: 'BUILDER' },
  { slug: 'vehicles', vendors: 1, individuals: 1, listingsPerVendor: 2, vendorType: 'DEALER' },
  { slug: 'mobiles', vendors: 1, individuals: 2, listingsPerVendor: 1, vendorType: 'VERIFIED_AGENT' },
  { slug: 'electronics', vendors: 1, individuals: 1, listingsPerVendor: 1, vendorType: 'VERIFIED_AGENT' },
  { slug: 'furniture', vendors: 1, individuals: 1, listingsPerVendor: 1, vendorType: 'DEALER' },
  { slug: 'jobs', vendors: 2, individuals: 0, listingsPerVendor: 1, vendorType: 'BUILDER' },
  { slug: 'services', vendors: 2, individuals: 0, listingsPerVendor: 1, vendorType: 'VERIFIED_AGENT' },
  { slug: 'other', vendors: 0, individuals: 1, listingsPerVendor: 1, vendorType: 'OWNER' }
];

let listingSeq = 1000;
const LISTINGS = [];
let localityRotation = 0;

CITIES.forEach((city) => {
  CATEGORY_PLAN.forEach((plan) => {
    const namePool = VENDOR_NAMES[plan.slug] || [];
    const vendorSellers = [];
    for (let v = 0; v < plan.vendors; v++) {
      const prefix = namePool[v % namePool.length] || `${plan.slug} Partners`;
      vendorSellers.push(makeVendor(prefix, city.city, plan.vendorType));
    }
    const individualSellers = [];
    for (let ind = 0; ind < plan.individuals; ind++) {
      individualSellers.push(makeIndividual());
    }

    const allSellersForCategory = [
      ...vendorSellers.flatMap(s => Array(plan.listingsPerVendor).fill(s)),
      ...individualSellers
    ];

    allSellersForCategory.forEach((seller) => {
      const locality = city.localities[localityRotation % city.localities.length];
      localityRotation++;
      const gen = GENERATORS[plan.slug](city, locality, seller, listingSeq);
      const id = `lst-${listingSeq++}`;
      const cleanSlugBase = `${gen.title}-${city.city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const [lat0, lng0] = city.center;
      const status = pick(STATUS_POOL);
      const trustScore = genTrustScore(seller.verified);
      const createdDay = int(1, 26);
      const createdAt = `2026-09-${String(createdDay).padStart(2, '0')}T${String(int(7, 20)).padStart(2, '0')}:00:00Z`;

      LISTINGS.push({
        id,
        slug: `${cleanSlugBase}-${id.split('-')[1]}`,
        title: gen.title,
        description: gen.description,
        categorySlug: gen.categorySlug,
        categoryName: gen.categoryName,
        price: gen.price,
        formattedPrice: gen.formattedPrice,
        ...(gen.pricePeriod ? { pricePeriod: gen.pricePeriod } : {}),
        location: {
          address: `${locality}, ${city.city}`,
          locality,
          city: city.city,
          state: city.state,
          pincode: pick(city.pincodes),
          lat: Number((lat0 + (rng() - 0.5) * 0.12).toFixed(4)),
          lng: Number((lng0 + (rng() - 0.5) * 0.12).toFixed(4)),
          verifiedCoords: rng() > 0.1
        },
        images: imagesFor(gen.categorySlug),
        attributes: gen.attributes,
        sellerId: seller.id,
        sellerName: seller.name,
        sellerPhone: seller.phone,
        sellerEmail: seller.email,
        sellerType: seller.type,
        sellerAvatar: seller.avatar,
        sellerRating: seller.rating,
        sellerVerified: seller.verified,
        trustScore,
        status,
        version: 1,
        isFeatured: rng() > 0.85,
        isBoosted: rng() > 0.9,
        documents: [
          { id: `doc-gen-${id}`, name: plan.slug === 'property' ? 'Property Title & Tax Document' : plan.slug === 'vehicles' ? 'RC & Insurance Document' : plan.slug === 'jobs' ? 'Employer Registration Certificate' : 'Ownership / Purchase Proof', type: plan.slug === 'property' ? 'TITLE_DEED' : plan.slug === 'vehicles' ? 'REGISTRATION' : plan.slug === 'jobs' ? 'BUSINESS_GST' : 'AADHAAR_PAN', status: 'VERIFIED', uploadedAt: '2026-09-24' }
        ],
        fraudSignals: [],
        createdAt,
        publishedAt: createdAt,
        expiresAt: `2026-12-${String(createdDay).padStart(2, '0')}T${String(int(7, 20)).padStart(2, '0')}:00:00Z`,
        viewsCount: int(20, 2200),
        savesCount: int(0, 320),
        leadsCount: int(0, 95)
      });
    });
  });
});

// A handful of admin-only / non-public listings to test status filtering (never shown in public search)
['DRAFT', 'PENDING_REVIEW', 'SUSPENDED'].forEach((status, i) => {
  const city = CITIES[i % CITIES.length];
  const locality = city.localities[0];
  const seller = makeIndividual();
  const gen = genProperty(city, locality, seller, listingSeq);
  const id = `lst-${listingSeq++}`;
  LISTINGS.push({
    id, slug: `admin-qa-${status.toLowerCase()}-${id}`,
    title: `[QA] ${gen.title}`, description: gen.description,
    categorySlug: gen.categorySlug, categoryName: gen.categoryName,
    price: gen.price, formattedPrice: gen.formattedPrice,
    location: { address: `${locality}, ${city.city}`, locality, city: city.city, state: city.state, pincode: city.pincodes[0], lat: city.center[0], lng: city.center[1], verifiedCoords: true },
    images: imagesFor('property'), attributes: gen.attributes,
    sellerId: seller.id, sellerName: seller.name, sellerPhone: seller.phone, sellerEmail: seller.email,
    sellerType: seller.type, sellerAvatar: seller.avatar, sellerRating: seller.rating, sellerVerified: seller.verified,
    trustScore: genTrustScore(seller.verified), status, version: 1, isFeatured: false, isBoosted: false,
    documents: [], fraudSignals: [], createdAt: '2026-09-26T09:00:00Z', publishedAt: '2026-09-26T09:00:00Z',
    expiresAt: '2026-12-26T09:00:00Z', viewsCount: 3, savesCount: 0, leadsCount: 0
  });
});

// ---------------------------------------------------------------------------
// OUTPUT
// ---------------------------------------------------------------------------
const fs = require('fs');

const locationsOut = `// AUTO-GENERATED by gen.js — city / state / locality reference data.
// Deterministic (seeded), do not hand-edit; re-run gen.js to regenerate.
export interface CityInfo {
  city: string;
  state: string;
  localities: string[];
}

export const CITY_HIERARCHY: CityInfo[] = ${JSON.stringify(CITIES.map(c => ({ city: c.city, state: c.state, localities: c.localities })), null, 2)};

export const ALL_CITY_NAMES: string[] = CITY_HIERARCHY.map(c => c.city);
`;

const listingsOut = `// AUTO-GENERATED by gen.js — deterministic multi-city marketplace inventory.
// Seed: 20260928. Re-run \`node gen.js\` from the project root to regenerate.
import type { Listing } from '../types';

export const GENERATED_LISTINGS: Listing[] = ${JSON.stringify(LISTINGS, null, 2)};
`;

const path = require('path');
const outDir = path.join(__dirname, '..', 'src', 'mock');
fs.writeFileSync(path.join(outDir, 'locations.ts'), locationsOut);
fs.writeFileSync(path.join(outDir, 'generatedListings.ts'), listingsOut);

console.log(`Generated ${LISTINGS.length} listings across ${CITIES.length} cities and ${CATEGORY_PLAN.length} categories.`);
console.log(`Generated ${SELLERS.length} synthetic sellers/vendors.`);
const perCity = {};
LISTINGS.forEach(l => { perCity[l.location.city] = (perCity[l.location.city] || 0) + (l.status === 'PUBLISHED' ? 1 : 0); });
console.log('Published listings per city:', perCity);
