import type { Category, Listing, VendorOrganization, AuditLog, Conversation } from '../types';
import { GENERATED_LISTINGS } from './generatedListings';
export { ALL_CITY_NAMES, CITY_HIERARCHY } from './locations';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-prop',
    slug: 'property',
    name: 'Real Estate',
    icon: 'Building2',
    description: 'Verified residential apartments, luxury villas, commercial spaces & plots',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-bhk', key: 'bhk', label: 'Bedrooms (BHK)', type: 'enum', required: true, filterable: true, options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'] },
      { id: 'attr-type', key: 'propertyType', label: 'Property Type', type: 'enum', required: true, filterable: true, options: ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Office'] },
      { id: 'attr-area', key: 'area', label: 'Super Area', type: 'number', required: true, filterable: true, unit: 'sq.ft' },
      { id: 'attr-furnish', key: 'furnishing', label: 'Furnishing Status', type: 'enum', required: false, filterable: true, options: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'] },
      { id: 'attr-floor', key: 'floor', label: 'Floor Number', type: 'string', required: false, filterable: false, placeholder: 'e.g. 14th of 22' },
      { id: 'attr-parking', key: 'parking', label: 'Reserved Parking', type: 'boolean', required: false, filterable: true },
    ]
  },
  {
    id: 'cat-veh',
    slug: 'vehicles',
    name: 'Vehicles',
    icon: 'Car',
    description: 'Inspected cars, bikes, electric vehicles & luxury SUVs',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-brand', key: 'brand', label: 'Make / Brand', type: 'enum', required: true, filterable: true, options: ['Hyundai', 'Tata Motors', 'Mahindra', 'BMW', 'Mercedes-Benz', 'Toyota', 'Royal Enfield'] },
      { id: 'attr-year', key: 'year', label: 'Manufacturing Year', type: 'number', required: true, filterable: true },
      { id: 'attr-km', key: 'kmDriven', label: 'KM Driven', type: 'number', required: true, filterable: true, unit: 'km' },
      { id: 'attr-fuel', key: 'fuelType', label: 'Fuel Type', type: 'enum', required: true, filterable: true, options: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'] },
      { id: 'attr-trans', key: 'transmission', label: 'Transmission', type: 'enum', required: true, filterable: true, options: ['Automatic', 'Manual'] },
      { id: 'attr-owners', key: 'ownersCount', label: 'Number of Owners', type: 'enum', required: false, filterable: true, options: ['1st Owner', '2nd Owner', '3rd Owner+'] }
    ]
  },
  {
    id: 'cat-mob',
    slug: 'mobiles',
    name: 'Mobiles & Tabs',
    icon: 'Smartphone',
    description: 'Authenticity-scanned smartphones, iPads & wearables',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-mob-brand', key: 'brand', label: 'Brand', type: 'enum', required: true, filterable: true, options: ['Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Xiaomi', 'Nothing'] },
      { id: 'attr-storage', key: 'storage', label: 'Internal Storage', type: 'enum', required: true, filterable: true, options: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'] },
      { id: 'attr-ram', key: 'ram', label: 'RAM', type: 'enum', required: false, filterable: true, options: ['4 GB', '8 GB', '12 GB', '16 GB'] },
      { id: 'attr-cond', key: 'condition', label: 'Device Condition', type: 'enum', required: true, filterable: true, options: ['Like New (Flawless)', 'Excellent', 'Good', 'Fair'] },
      { id: 'attr-warr', key: 'warranty', label: 'Official Warranty Remaining', type: 'boolean', required: false, filterable: true }
    ]
  },
  {
    id: 'cat-elec',
    slug: 'electronics',
    name: 'Electronics & Laptops',
    icon: 'Laptop',
    description: 'MacBooks, gaming rigs, 4K TVs, audio gear & cameras',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-elec-cat', key: 'deviceType', label: 'Device Type', type: 'enum', required: true, filterable: true, options: ['Laptop', 'Desktop PC', 'Smart TV', 'Camera', 'Audio/Headphones'] },
      { id: 'attr-processor', key: 'processor', label: 'Processor', type: 'string', required: false, filterable: true, placeholder: 'e.g. Apple M2 Max / Intel i7 13th Gen' },
      { id: 'attr-bill', key: 'originalBill', label: 'Original Bill Available', type: 'boolean', required: false, filterable: true }
    ]
  },
  {
    id: 'cat-furn',
    slug: 'furniture',
    name: 'Furniture & Decor',
    icon: 'Armchair',
    description: 'Premium teak wood sets, ergonomic office chairs & designer sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-furn-material', key: 'material', label: 'Material', type: 'enum', required: true, filterable: true, options: ['Solid Teak Wood', 'Engineered Wood', 'Leatherette', 'Fabric', 'Metal'] },
      { id: 'attr-furn-type', key: 'itemType', label: 'Item Type', type: 'enum', required: true, filterable: true, options: ['Sofa Set', 'Bed Frame', 'Dining Table', 'Office Chair', 'Wardrobe'] }
    ]
  },
  {
    id: 'cat-job',
    slug: 'jobs',
    name: 'Jobs & Careers',
    icon: 'Briefcase',
    description: 'Verified company hiring for tech, management, design & operations',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-job-role', key: 'roleType', label: 'Role Type', type: 'enum', required: true, filterable: true, options: ['Full Time', 'Part Time', 'Remote', 'Contract'] },
      { id: 'attr-exp', key: 'experience', label: 'Experience Level', type: 'enum', required: true, filterable: true, options: ['Entry Level (0-2 yrs)', 'Mid Level (3-5 yrs)', 'Senior (6-10 yrs)', 'Lead / Director'] }
    ]
  },
  {
    id: 'cat-serv',
    slug: 'services',
    name: 'Services & Experts',
    icon: 'Wrench',
    description: 'Background-checked home interior designers, legal counsel & technicians',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    attributes: [
      { id: 'attr-serv-type', key: 'serviceType', label: 'Service Category', type: 'enum', required: true, filterable: true, options: ['Interior Design', 'Legal Verification', 'Home Renovation', 'IT Consulting', 'Packers & Movers'] }
    ]
  },
  {
    id: 'cat-oth',
    slug: 'other',
    name: 'Classifieds & Collectibles',
    icon: 'Package',
    description: 'Rare art pieces, musical instruments, fitness equipment & luxury watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    attributes: []
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst-101',
    slug: 'modern-3bhk-sky-villa-greater-noida',
    title: 'Modern 3 BHK Luxury Sky Villa with Private Garden',
    description: 'Exquisite 3 BHK penthouse apartment overlooking Sector 1, Greater Noida West. Features floor-to-ceiling double-glazed glass windows, Italian marble flooring, fully fitted modular kitchen with Bosch appliances, and smart home automation. Verified property title and zero legal encumbrances.',
    categorySlug: 'property',
    categoryName: 'Real Estate',
    price: 18500000,
    formattedPrice: '₹1.85 Cr',
    location: {
      address: 'Tower 4, Apex Signature Heights, Sector 1',
      locality: 'Greater Noida West',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201306',
      lat: 28.5842,
      lng: 77.4421,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      bhk: '3 BHK',
      propertyType: 'Apartment',
      area: 2150,
      furnishing: 'Fully Furnished',
      floor: '18th of 24',
      parking: true
    },
    sellerId: 'usr-vnd-1',
    sellerName: 'TrustNest Platinum Realty',
    sellerPhone: '+91 98765 43210',
    sellerEmail: 'contact@trustnestrealty.in',
    sellerType: 'BUILDER',
    sellerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    trustScore: {
      overallScore: 96,
      tier: 'PLATINUM',
      badgeLabel: 'VERIFIED 96/100',
      verifiedAt: '2026-09-20',
      dimensions: [
        { id: 'td-1', name: 'Identity', score: 20, maxScore: 20, status: 'PASSED', details: 'Aadhaar + GST Identity verified via direct official API', verifiedAt: '2026-09-20' },
        { id: 'td-2', name: 'Documents', score: 20, maxScore: 20, status: 'PASSED', details: 'Registry title deed & Encumbrance certificate cross-checked', verifiedAt: '2026-09-20' },
        { id: 'td-3', name: 'Location', score: 19, maxScore: 20, status: 'PASSED', details: 'GPS geo-tag matched physical site visit within 4 meters accuracy', verifiedAt: '2026-09-20' },
        { id: 'td-4', name: 'Media', score: 19, maxScore: 20, status: 'PASSED', details: 'EXIF metadata verified; zero duplicate scan matches across index', verifiedAt: '2026-09-20' },
        { id: 'td-5', name: 'Risk', score: 18, maxScore: 20, status: 'PASSED', details: 'Automated fraud risk engine evaluated low risk score (0.02)', verifiedAt: '2026-09-20' }
      ]
    },
    status: 'PUBLISHED',
    version: 3,
    isFeatured: true,
    isBoosted: true,
    documents: [
      { id: 'doc-1', name: 'Property Registry Title Deed', type: 'TITLE_DEED', status: 'VERIFIED', uploadedAt: '2026-09-18' },
      { id: 'doc-2', name: 'Aadhaar & Business PAN Card', type: 'AADHAAR_PAN', status: 'VERIFIED', uploadedAt: '2026-09-18' },
      { id: 'doc-3', name: 'Municipal Property Tax Clearance', type: 'TAX_RECEIPT', status: 'VERIFIED', uploadedAt: '2026-09-19' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-18T10:00:00Z',
    publishedAt: '2026-09-20T12:00:00Z',
    expiresAt: '2026-12-20T12:00:00Z',
    viewsCount: 1420,
    savesCount: 188,
    leadsCount: 34
  },
  {
    id: 'lst-102',
    slug: 'bmw-5-series-530i-m-sport-2023',
    title: 'BMW 5 Series 530i M Sport (Carbon Black) — Single Owner',
    description: 'Immaculate 2023 BMW 530i M Sport finished in Carbon Black Metallic over Cognac Vernasca Leather. Driven only 14,200 km with full BMW authorised service history record. Comprehensive insurance till Dec 2026. Zero accident record, original paint verified with digital depth gauge.',
    categorySlug: 'vehicles',
    categoryName: 'Vehicles',
    price: 5450000,
    formattedPrice: '₹54.50 Lakh',
    location: {
      address: 'DLF Phase 5, Golf Course Road',
      locality: 'DLF Phase 5',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      lat: 28.4357,
      lng: 77.0984,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541348263662-e082662dc363?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      brand: 'BMW',
      year: 2023,
      kmDriven: 14200,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      ownersCount: '1st Owner'
    },
    sellerId: 'usr-vnd-2',
    sellerName: 'AutoVeritas Luxury Cars',
    sellerPhone: '+91 99112 23344',
    sellerEmail: 'sales@autoveritas.in',
    sellerType: 'DEALER',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.8,
    sellerVerified: true,
    trustScore: {
      overallScore: 94,
      tier: 'PLATINUM',
      badgeLabel: 'VERIFIED 94/100',
      verifiedAt: '2026-09-21',
      dimensions: [
        { id: 'td-10', name: 'Identity', score: 20, maxScore: 20, status: 'PASSED', details: 'Dealer Trade Certificate & Owner PAN cross-verified', verifiedAt: '2026-09-21' },
        { id: 'td-11', name: 'Documents', score: 19, maxScore: 20, status: 'PASSED', details: 'RC Smart Card, Insurance & VAHAN portal history clear', verifiedAt: '2026-09-21' },
        { id: 'td-12', name: 'Location', score: 18, maxScore: 20, status: 'PASSED', details: 'Showroom location confirmed via GPS verification', verifiedAt: '2026-09-21' },
        { id: 'td-13', name: 'Media', score: 19, maxScore: 20, status: 'PASSED', details: 'High-res image authenticity scan passed with 99.4% confidence', verifiedAt: '2026-09-21' },
        { id: 'td-14', name: 'Risk', score: 18, maxScore: 20, status: 'PASSED', details: 'Automated odometer tampering scan negative', verifiedAt: '2026-09-21' }
      ]
    },
    status: 'PUBLISHED',
    version: 2,
    isFeatured: true,
    isBoosted: false,
    documents: [
      { id: 'doc-10', name: 'RC Smartcard & VAHAN Clearance', type: 'REGISTRATION', status: 'VERIFIED', uploadedAt: '2026-09-21' },
      { id: 'doc-11', name: 'BMW Authorised Service History Log', type: 'TITLE_DEED', status: 'VERIFIED', uploadedAt: '2026-09-21' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-21T08:30:00Z',
    publishedAt: '2026-09-21T11:00:00Z',
    expiresAt: '2026-11-21T11:00:00Z',
    viewsCount: 980,
    savesCount: 142,
    leadsCount: 21
  },
  {
    id: 'lst-103',
    slug: 'apple-iphone-15-pro-max-256gb-natural-titanium',
    title: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    description: 'Factory sealed / immaculate open box iPhone 15 Pro Max Natural Titanium. Battery health 99%. Comes with original box, braided USB-C cable, and official AppleCare+ valid until August 2027. Serial number and IMEI verified against Apple GSX coverage database.',
    categorySlug: 'mobiles',
    categoryName: 'Mobiles & Tabs',
    price: 104900,
    formattedPrice: '₹1,04,900',
    location: {
      address: 'Indiranagar 100ft Road',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      brand: 'Apple',
      storage: '256 GB',
      ram: '8 GB',
      condition: 'Like New (Flawless)',
      warranty: true
    },
    sellerId: 'usr-ind-1',
    sellerName: 'Vikramaditya S.',
    sellerPhone: '+91 98450 99887',
    sellerEmail: 'vikram.tech@gmail.com',
    sellerType: 'OWNER',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    sellerVerified: true,
    trustScore: {
      overallScore: 92,
      tier: 'GOLD',
      badgeLabel: 'VERIFIED 92/100',
      verifiedAt: '2026-09-22',
      dimensions: [
        { id: 'td-20', name: 'Identity', score: 19, maxScore: 20, status: 'PASSED', details: 'Aadhaar identity verified via OTP', verifiedAt: '2026-09-22' },
        { id: 'td-21', name: 'Documents', score: 18, maxScore: 20, status: 'PASSED', details: 'Apple Store purchase invoice & IMEI match confirmed', verifiedAt: '2026-09-22' },
        { id: 'td-22', name: 'Location', score: 18, maxScore: 20, status: 'PASSED', details: 'Seller residence verified in Indiranagar', verifiedAt: '2026-09-22' },
        { id: 'td-23', name: 'Media', score: 19, maxScore: 20, status: 'PASSED', details: 'Original device photo metadata scan clean', verifiedAt: '2026-09-22' },
        { id: 'td-24', name: 'Risk', score: 18, maxScore: 20, status: 'PASSED', details: 'Zero blacklisted IMEI signals recorded', verifiedAt: '2026-09-22' }
      ]
    },
    status: 'PUBLISHED',
    version: 1,
    isFeatured: false,
    isBoosted: false,
    documents: [
      { id: 'doc-20', name: 'Apple Authorized Store Tax Invoice', type: 'TAX_RECEIPT', status: 'VERIFIED', uploadedAt: '2026-09-22' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-22T09:15:00Z',
    publishedAt: '2026-09-22T10:00:00Z',
    expiresAt: '2026-10-22T10:00:00Z',
    viewsCount: 430,
    savesCount: 65,
    leadsCount: 14
  },
  {
    id: 'lst-104',
    slug: 'macbook-pro-16-m3-max-36gb-1tb-space-black',
    title: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD) Space Black',
    description: 'Workstation powerhouse MacBook Pro 16 featuring M3 Max (14-core CPU, 30-core GPU). Space Black casing in immaculate condition. Liquid Retina XDR display with zero dead pixels. 42 battery cycles total. Includes MagSafe 3 braided cable and 140W USB-C GaN power adapter.',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Laptops',
    price: 279000,
    formattedPrice: '₹2,79,000',
    location: {
      address: 'Bandra Kurla Complex (BKC)',
      locality: 'BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      lat: 19.0657,
      lng: 72.8687,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      deviceType: 'Laptop',
      processor: 'Apple M3 Max (14-Core CPU)',
      originalBill: true
    },
    sellerId: 'usr-ind-2',
    sellerName: 'Studio Matrix Creative Labs',
    sellerPhone: '+91 98200 11223',
    sellerEmail: 'equipment@studiomatrix.in',
    sellerType: 'VERIFIED_AGENT',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    trustScore: {
      overallScore: 95,
      tier: 'PLATINUM',
      badgeLabel: 'VERIFIED 95/100',
      verifiedAt: '2026-09-23',
      dimensions: [
        { id: 'td-30', name: 'Identity', score: 20, maxScore: 20, status: 'PASSED', details: 'GSTIN & Studio Registration corporate verified', verifiedAt: '2026-09-23' },
        { id: 'td-31', name: 'Documents', score: 19, maxScore: 20, status: 'PASSED', details: 'Original Tax Invoice & serial number verified', verifiedAt: '2026-09-23' },
        { id: 'td-32', name: 'Location', score: 19, maxScore: 20, status: 'PASSED', details: 'BKC office location physically verified', verifiedAt: '2026-09-23' },
        { id: 'td-33', name: 'Media', score: 19, maxScore: 20, status: 'PASSED', details: 'Photo scan confirms original hardware images', verifiedAt: '2026-09-23' },
        { id: 'td-34', name: 'Risk', score: 18, maxScore: 20, status: 'PASSED', details: 'Low seller risk index', verifiedAt: '2026-09-23' }
      ]
    },
    status: 'PUBLISHED',
    version: 1,
    isFeatured: true,
    isBoosted: true,
    documents: [
      { id: 'doc-30', name: 'GST Tax Invoice from Imagine Apple Store', type: 'TAX_RECEIPT', status: 'VERIFIED', uploadedAt: '2026-09-23' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-23T11:00:00Z',
    publishedAt: '2026-09-23T12:00:00Z',
    expiresAt: '2026-11-23T12:00:00Z',
    viewsCount: 620,
    savesCount: 94,
    leadsCount: 19
  },
  {
    id: 'lst-105',
    slug: 'handcrafted-solid-teak-wood-6-seater-dining-table',
    title: 'Handcrafted Royal Teak Wood 6-Seater Dining Set with Leatherette Chairs',
    description: 'Authentic 100% Solid CP Teak Wood 6-seater dining table with natural matte polyurethane finish. Includes 6 high-density cushioned chairs upholstered in premium dark brown faux leather. Built with mortise and tenon joinery. Zero ply/MDF used.',
    categorySlug: 'furniture',
    categoryName: 'Furniture & Decor',
    price: 68000,
    formattedPrice: '₹68,000',
    location: {
      address: 'Jubilee Hills Checkpost',
      locality: 'Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      lat: 17.4319,
      lng: 78.4071,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      material: 'Solid Teak Wood',
      itemType: 'Dining Table'
    },
    sellerId: 'usr-vnd-3',
    sellerName: 'Heritage Woodcraft Studio',
    sellerPhone: '+91 97000 88776',
    sellerEmail: 'heritagewoods@gmail.com',
    sellerType: 'DEALER',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.7,
    sellerVerified: true,
    trustScore: {
      overallScore: 89,
      tier: 'GOLD',
      badgeLabel: 'VERIFIED 89/100',
      verifiedAt: '2026-09-24',
      dimensions: [
        { id: 'td-40', name: 'Identity', score: 18, maxScore: 20, status: 'PASSED', details: 'Store owner identity verified', verifiedAt: '2026-09-24' },
        { id: 'td-41', name: 'Documents', score: 17, maxScore: 20, status: 'PASSED', details: 'Timber certification and GST invoice on file', verifiedAt: '2026-09-24' },
        { id: 'td-42', name: 'Location', score: 18, maxScore: 20, status: 'PASSED', details: 'Showroom location GPS confirmed', verifiedAt: '2026-09-24' },
        { id: 'td-43', name: 'Media', score: 18, maxScore: 20, status: 'PASSED', details: 'Real workshop photos scanned', verifiedAt: '2026-09-24' },
        { id: 'td-44', name: 'Risk', score: 18, maxScore: 20, status: 'PASSED', details: 'Low risk score', verifiedAt: '2026-09-24' }
      ]
    },
    status: 'PUBLISHED',
    version: 1,
    isFeatured: false,
    isBoosted: false,
    documents: [
      { id: 'doc-40', name: 'GST Registration & Shop License', type: 'REGISTRATION', status: 'VERIFIED', uploadedAt: '2026-09-24' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-24T14:20:00Z',
    publishedAt: '2026-09-24T15:00:00Z',
    expiresAt: '2026-10-24T15:00:00Z',
    viewsCount: 310,
    savesCount: 42,
    leadsCount: 8
  },
  {
    id: 'lst-106',
    slug: 'principal-fullstack-ai-architect-remote-hyderabad',
    title: 'Principal Full-Stack AI Engineer (Next.js / Node / LLM Pipelines)',
    description: 'Leading AI infrastructure company is hiring a Principal Engineer to architect scalable enterprise AI agents, dynamic vector search pipelines, and resilient Next.js micro-frontends. Offering competitive cash compensation + equity package + flexible remote-first environment.',
    categorySlug: 'jobs',
    categoryName: 'Jobs & Careers',
    price: 4500000,
    formattedPrice: '₹45 - 60 LPA',
    pricePeriod: '/year',
    location: {
      address: 'HITEC City Tech Park',
      locality: 'HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      lat: 17.4435,
      lng: 78.3772,
      verifiedCoords: true
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    ],
    attributes: {
      roleType: 'Full Time',
      experience: 'Senior (6-10 yrs)'
    },
    sellerId: 'usr-vnd-4',
    sellerName: 'Synthetix AI Systems',
    sellerPhone: '+91 40 6677 8899',
    sellerEmail: 'careers@synthetix.ai',
    sellerType: 'BUILDER',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    trustScore: {
      overallScore: 97,
      tier: 'PLATINUM',
      badgeLabel: 'VERIFIED 97/100',
      verifiedAt: '2026-09-25',
      dimensions: [
        { id: 'td-50', name: 'Identity', score: 20, maxScore: 20, status: 'PASSED', details: 'Corporate CIN & Ministry of Corporate Affairs verified', verifiedAt: '2026-09-25' },
        { id: 'td-51', name: 'Documents', score: 20, maxScore: 20, status: 'PASSED', details: 'Official employer domain & HR authorization confirmed', verifiedAt: '2026-09-25' },
        { id: 'td-52', name: 'Location', score: 19, maxScore: 20, status: 'PASSED', details: 'HITEC City office registered address match', verifiedAt: '2026-09-25' },
        { id: 'td-53', name: 'Media', score: 19, maxScore: 20, status: 'PASSED', details: 'Verified corporate workspace photography', verifiedAt: '2026-09-25' },
        { id: 'td-54', name: 'Risk', score: 19, maxScore: 20, status: 'PASSED', details: 'Zero recruitment fraud signals recorded', verifiedAt: '2026-09-25' }
      ]
    },
    status: 'PUBLISHED',
    version: 1,
    isFeatured: true,
    isBoosted: true,
    documents: [
      { id: 'doc-50', name: 'MCA Certificate of Incorporation', type: 'REGISTRATION', status: 'VERIFIED', uploadedAt: '2026-09-25' }
    ],
    fraudSignals: [],
    createdAt: '2026-09-25T08:00:00Z',
    publishedAt: '2026-09-25T09:00:00Z',
    expiresAt: '2026-11-25T09:00:00Z',
    viewsCount: 1850,
    savesCount: 310,
    leadsCount: 88
  }
];

// Hand-authored hero listings above are combined with the deterministic,
// seeded multi-city dataset (src/mock/generatedListings.ts, produced by
// gen.js) so every city in the selector has real, browsable inventory
// across every marketplace category instead of a single hard-coded array.
INITIAL_LISTINGS.push(...GENERATED_LISTINGS);

export const VENDOR_ORGANIZATIONS: VendorOrganization[] = [
  {
    id: 'org-101',
    name: 'TrustNest Platinum Realty Pvt Ltd',
    gstNumber: '07AAACT1234F1Z9',
    businessType: 'Real Estate Developer & Agency',
    verificationStatus: 'VERIFIED',
    subscriptionPlan: 'BUSINESS',
    activeListingsCount: 42,
    monthlyLeadsCount: 380,
    members: [
      { id: 'mem-1', name: 'Rajesh Sharma', email: 'rajesh@trustnestrealty.in', phone: '+91 98765 43210', role: 'OWNER', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', assignedLeads: 120, joinedAt: '2025-01-15' },
      { id: 'mem-2', name: 'Priya Verma', email: 'priya@trustnestrealty.in', phone: '+91 98765 43211', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', assignedLeads: 140, joinedAt: '2025-02-01' },
      { id: 'mem-3', name: 'Amitabh Sen', email: 'amitabh@trustnestrealty.in', phone: '+91 98765 43212', role: 'AGENT', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', assignedLeads: 120, joinedAt: '2025-04-10' }
    ]
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorName: 'System Verification Bot',
    actorRole: 'SYSTEM_BOT',
    action: 'TRUST_SCORE_COMPUTED',
    targetResource: 'Listing lst-101',
    timestamp: '2026-09-20T12:00:00Z',
    details: 'Calculated composite trust score 96/100 across 5 verification dimensions.'
  },
  {
    id: 'log-2',
    actorName: 'Senior Moderator (Ananya R.)',
    actorRole: 'MODERATOR',
    action: 'LISTING_APPROVED',
    targetResource: 'Listing lst-101',
    timestamp: '2026-09-20T12:05:00Z',
    details: 'Verified title deeds and physical address check. Status transitioned DRAFT -> PUBLISHED.'
  },
  {
    id: 'log-3',
    actorName: 'Fraud Risk Engine v4',
    actorRole: 'SYSTEM_BOT',
    action: 'MEDIA_AUTHENTICITY_SCAN',
    targetResource: 'Listing lst-102',
    timestamp: '2026-09-21T10:45:00Z',
    details: 'Scanned 3 vehicle images. Zero duplicate visual signatures matched in index.'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    listingId: 'lst-101',
    listingTitle: 'Modern 3 BHK Luxury Sky Villa with Private Garden',
    listingImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80',
    listingPrice: '₹1.85 Cr',
    otherParticipantId: 'usr-buyer-1',
    otherParticipantName: 'Saurabh Malhotra',
    otherParticipantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Hello, I would like to schedule a site visit for this Saturday afternoon.',
    lastMessageAt: '10:42 AM',
    unreadCount: 1
  }
];
