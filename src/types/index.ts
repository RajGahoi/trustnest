export type UserRole = 
  | 'GUEST' 
  | 'USER' 
  | 'BUYER'
  | 'SELLER' 
  | 'AGENT'
  | 'BUILDER'
  | 'VENDOR_AGENT' 
  | 'VENDOR_ADMIN' 
  | 'MODERATOR' 
  | 'SUPPORT'
  | 'ADMIN' 
  | 'SUPER_ADMIN';

export type CategorySlug = 
  | 'property' 
  | 'vehicles' 
  | 'mobiles' 
  | 'electronics' 
  | 'furniture' 
  | 'jobs' 
  | 'services' 
  | 'other';

export type AttributeType = 'string' | 'number' | 'enum' | 'boolean' | 'range' | 'area' | 'currency';

export interface AttributeDefinition {
  id: string;
  key: string;
  label: string;
  type: AttributeType;
  required: boolean;
  options?: string[];
  filterable: boolean;
  unit?: string;
  placeholder?: string;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  icon: string;
  description: string;
  image: string;
  attributes: AttributeDefinition[];
}

export type ListingStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED' 
  | 'PAUSED' 
  | 'EXPIRED' 
  | 'SOLD' 
  | 'RENTED'
  | 'REJECTED' 
  | 'SUSPENDED' 
  | 'ARCHIVED';

export type VerificationDimensionStatus = 'PASSED' | 'PENDING' | 'FLAGGED';

export interface TrustDimension {
  id: string;
  name: 'Identity' | 'Documents' | 'Location' | 'Media' | 'Risk';
  score: number; // 0 to 20
  maxScore: number; // 20
  status: VerificationDimensionStatus;
  details: string;
  verifiedAt?: string;
}

export interface TrustScore {
  overallScore: number; // 0 to 100
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD';
  dimensions: TrustDimension[];
  verifiedAt: string;
  badgeLabel: string;
}

export interface LocationData {
  address: string;
  city: string;
  state: string;
  locality: string;
  subLocality?: string;
  pincode: string;
  lat: number;
  lng: number;
  verifiedCoords?: boolean;
  privacyPrecision?: 'EXACT' | 'APPROXIMATE' | 'LOCALITY_ONLY';
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'TITLE_DEED' | 'AADHAAR_PAN' | 'TAX_RECEIPT' | 'REGISTRATION' | 'BUSINESS_GST' | 'RERA_CERTIFICATE' | 'APPROVED_MAP';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'REQUIRES_INFO';
  uploadedAt: string;
  previewUrl?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface FraudSignal {
  id: string;
  type: 'DUPLICATE_IMAGE' | 'MANIPULATION_DETECTED' | 'PRICE_ANOMALY' | 'EXIF_MISMATCH' | 'FREQUENCY_SPIKE' | 'SCRAPING_SUSPECT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  detectedAt: string;
}

export interface NearbyLandmarks {
  schools?: Array<{ name: string; distanceKm: number }>;
  hospitals?: Array<{ name: string; distanceKm: number }>;
  transit?: Array<{ name: string; distanceKm: number; type: 'METRO' | 'BUS' | 'AIRPORT' | 'HIGHWAY' }>;
  businessHubs?: Array<{ name: string; distanceKm: number }>;
}

export type AreaUnit = 'sqft' | 'sqyd' | 'sqm' | 'acre' | 'hectare' | 'bigha';

export interface IndianPropertyDetails {
  areaSqFt: number;
  displayArea: number;
  displayAreaUnit: AreaUnit;
  pricePerSqFt: number;
  reraId?: string;
  reraApproved?: boolean;
  ownershipType: 'FREEHOLD' | 'LEASEHOLD' | 'POWER_OF_ATTORNEY' | 'COOPERATIVE';
  landUse: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'AGRICULTURAL' | 'MIXED';
  approvedAuthority?: string;
  khataNo?: string;
  khasraNo?: string;
  possessionStatus?: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION';
  furnishing?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  facing?: string;
  roadWidth?: string;
  parking?: string;
  floor?: string;
  totalFloors?: number;
  bhk?: string;
  nearby?: NearbyLandmarks;
}

export interface GranularVerificationChecklist {
  phoneVerified: boolean;
  emailVerified: boolean;
  identityChecked: boolean;
  documentsReviewed: boolean;
  reraVerified: boolean;
  siteVisitDone: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  categorySlug: CategorySlug;
  categoryName: string;
  price: number;
  formattedPrice: string;
  pricePeriod?: string; // e.g. '/month' for rent or salary
  location: LocationData;
  images: string[];
  attributes: Record<string, any>;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerType: 'OWNER' | 'BUILDER' | 'DEALER' | 'VERIFIED_AGENT';
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified: boolean;
  trustScore: TrustScore;
  status: ListingStatus;
  version: number;
  isFeatured: boolean;
  isBoosted: boolean;
  documents: VerificationDocument[];
  fraudSignals: FraudSignal[];
  propertyDetails?: IndianPropertyDetails;
  verificationChecks?: GranularVerificationChecklist;
  createdAt: string;
  publishedAt: string;
  expiresAt: string;
  viewsCount: number;
  savesCount: number;
  leadsCount: number;
}

export type LeadStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'INTERESTED' 
  | 'FOLLOW_UP' 
  | 'NEGOTIATION' 
  | 'CONVERTED' 
  | 'NOT_INTERESTED' 
  | 'CLOSED';

export interface LeadNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  channel: 'CHAT' | 'CALL_INTENT' | 'WHATSAPP' | 'EMAIL';
  status: LeadStatus;
  notes?: LeadNote[];
  followUpDate?: string;
  isPhoneMasked?: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: string;
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface VendorTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT';
  avatar: string;
  assignedLeads: number;
  joinedAt: string;
}

export interface BuilderProject {
  id: string;
  name: string;
  developerName: string;
  location: string;
  city: string;
  reraId: string;
  totalUnits: number;
  availableUnits: number;
  priceRange: string;
  possessionDate: string;
  image: string;
  brochureUrl?: string;
}

export interface VendorOrganization {
  id: string;
  name: string;
  gstNumber: string;
  businessType: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  members: VendorTeamMember[];
  projects?: BuilderProject[];
  subscriptionPlan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  activeListingsCount: number;
  monthlyLeadsCount: number;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetResource: string;
  timestamp: string;
  details: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  category: string;
  city: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bhk?: string;
  minTrustScore?: number;
  alertFrequency: 'INSTANT' | 'DAILY' | 'WEEKLY' | 'OFF';
  createdAt: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isStaff: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'LOGIN' | 'PAYMENT' | 'LISTING' | 'VERIFICATION' | 'FRAUD_REPORT' | 'SUBSCRIPTION' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlanId = 
  | 'BUYER_FREE' 
  | 'BUYER_WEEKLY' 
  | 'BUYER_MONTHLY' 
  | 'BUYER_PREMIUM' 
  | 'SELLER_FREE' 
  | 'SELLER_FEATURED' 
  | 'SELLER_PREMIUM' 
  | 'SELLER_BUILDER';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  audience: 'BUYER' | 'SELLER';
  priceINR: number;
  durationDays: number;
  features: string[];
  contactRevealsLimit: number;
  featuredListingsLimit: number;
  instantAlerts: boolean;
  prioritySupport: boolean;
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: SubscriptionPlanId;
  planName: string;
  pricePaid: number;
  gstPaid: number;
  invoiceNo: string;
  startsAt: string;
  expiresAt: string;
  active: boolean;
  revealsRemaining: number;
}

export interface TaxInvoice {
  invoiceNo: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerGst?: string;
  planName: string;
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  total: number;
  hsnCode: string;
  paymentMethod: string;
  status: 'PAID';
}

export interface AbuseReport {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterEmail: string;
  reason: 'FAKE_PROPERTY' | 'PRICE_BAIT' | 'DUPLICATE' | 'UNREACHABLE' | 'COPYRIGHT_IMAGE' | 'OTHER';
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'DISMISSED' | 'ACTION_TAKEN';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ENQUIRY' | 'VERIFICATION' | 'PRICE_ALERT' | 'SEARCH_MATCH' | 'SYSTEM';
  linkRoute?: string;
  isRead: boolean;
  createdAt: string;
}
