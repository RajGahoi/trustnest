export type UserRole = 
  | 'GUEST' 
  | 'USER' 
  | 'SELLER' 
  | 'VENDOR_AGENT' 
  | 'VENDOR_ADMIN' 
  | 'MODERATOR' 
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
  pincode: string;
  lat: number;
  lng: number;
  verifiedCoords?: boolean;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'TITLE_DEED' | 'AADHAAR_PAN' | 'TAX_RECEIPT' | 'REGISTRATION' | 'BUSINESS_GST';
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  uploadedAt: string;
  previewUrl?: string;
}

export interface FraudSignal {
  id: string;
  type: 'DUPLICATE_IMAGE' | 'MANIPULATION_DETECTED' | 'PRICE_ANOMALY' | 'EXIF_MISMATCH' | 'FREQUENCY_SPIKE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  detectedAt: string;
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
  createdAt: string;
  publishedAt: string;
  expiresAt: string;
  viewsCount: number;
  savesCount: number;
  leadsCount: number;
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
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
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

export interface VendorOrganization {
  id: string;
  name: string;
  gstNumber: string;
  businessType: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  members: VendorTeamMember[];
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
