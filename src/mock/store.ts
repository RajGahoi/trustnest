import { CATEGORIES, INITIAL_LISTINGS, VENDOR_ORGANIZATIONS, MOCK_AUDIT_LOGS, MOCK_CONVERSATIONS } from './data';
import type { Listing, ListingStatus, Category, Lead, AuditLog, Conversation, Message, UserRole, CategorySlug, VendorOrganization } from '../types';
import { hasCapability } from '../domain/auth/capabilities';
import type { Capability } from '../domain/auth/capabilities';
import { calculateTrustScore } from '../domain/trust/calculator';
import { sanitizeString, validatePrice } from '../domain/validation';

const STORAGE_KEYS = {
  LISTINGS: 'trustnest_listings_v1',
  CATEGORIES: 'trustnest_categories_v1',
  FAVORITES: 'trustnest_favorites_v1',
  LEADS: 'trustnest_leads_v1',
  AUDIT_LOGS: 'trustnest_audit_logs_v1',
  ROLE: 'trustnest_current_role_v1',
};

const ALLOWED_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ['SUBMITTED', 'ARCHIVED'],
  SUBMITTED: ['PENDING_REVIEW', 'DRAFT', 'ARCHIVED'],
  PENDING_REVIEW: ['APPROVED', 'PUBLISHED', 'REJECTED', 'SUSPENDED'],
  APPROVED: ['PUBLISHED', 'REJECTED'],
  PUBLISHED: ['PAUSED', 'EXPIRED', 'SOLD', 'SUSPENDED', 'ARCHIVED'],
  PAUSED: ['PUBLISHED', 'ARCHIVED'],
  EXPIRED: ['SUBMITTED', 'ARCHIVED'],
  SOLD: ['ARCHIVED'],
  REJECTED: ['SUBMITTED', 'ARCHIVED'],
  SUSPENDED: ['PENDING_REVIEW', 'ARCHIVED'],
  ARCHIVED: []
};

class LocalStore {
  private listings: Listing[] = [];
  private categories: Category[] = CATEGORIES;
  private favorites: Set<string> = new Set();
  private leads: Lead[] = [];
  private auditLogs: AuditLog[] = MOCK_AUDIT_LOGS;
  private conversations: Conversation[] = MOCK_CONVERSATIONS;
  private messages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'usr-buyer-1',
        senderName: 'Saurabh Malhotra',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        text: 'Hi, is this property available for immediate possession?',
        createdAt: '10:30 AM',
        isRead: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'usr-vnd-1',
        senderName: 'TrustNest Platinum Realty',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        text: 'Yes Saurabh! This pent-house is ready to move in with OC certificate received.',
        createdAt: '10:35 AM',
        isRead: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'usr-buyer-1',
        senderName: 'Saurabh Malhotra',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        text: 'Hello, I would like to schedule a site visit for this Saturday afternoon.',
        createdAt: '10:42 AM',
        isRead: false
      }
    ]
  };
  private currentRole: UserRole = 'USER';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedListings = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (savedListings) {
        this.listings = JSON.parse(savedListings);
      } else {
        this.listings = INITIAL_LISTINGS;
        this.persistListings();
      }

      const savedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavs) {
        this.favorites = new Set(JSON.parse(savedFavs));
      }

      const savedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (savedLeads) {
        this.leads = JSON.parse(savedLeads);
      }

      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole) {
        this.currentRole = savedRole as UserRole;
      }
    } catch (err) {
      console.warn('LocalStorage unavailable, defaulting to in-memory store:', err);
      this.listings = INITIAL_LISTINGS;
    }
  }

  private persistListings() {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(this.listings));
    } catch (e) {}
  }

  private persistFavorites() {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {}
  }

  private persistLeads() {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(this.leads));
    } catch (e) {}
  }

  // --- Capabilities & Auth ---
  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {}
  }

  public checkCapability(capability: Capability): boolean {
    return hasCapability(this.currentRole, capability);
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  // --- Listings ---
  public getAllListings(): Listing[] {
    return this.listings;
  }

  public getPublishedListings(): Listing[] {
    return this.listings.filter(l => l.status === 'PUBLISHED');
  }

  public getListingBySlug(slug: string): Listing | undefined {
    return this.listings.find(l => l.slug === slug || l.id === slug);
  }

  // --- Cities (derived from real listing data, never hard-coded) ---
  public getCitiesWithCounts(): { city: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.getPublishedListings().forEach(l => {
      counts[l.location.city] = (counts[l.location.city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }

  public toggleFavorite(id: string): boolean {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.persistFavorites();
    return this.favorites.has(id);
  }

  public isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  public getFavoritesList(): Listing[] {
    return this.listings.filter(l => this.favorites.has(l.id));
  }

  // --- Listing Creation & Controlled State Machine Transitions ---
  public createListing(draft: Partial<Listing>): Listing {
    const rawPrice = draft.price || 4500000;
    const priceValidation = validatePrice(rawPrice);
    const validPrice = priceValidation.valid ? rawPrice : 4500000;

    const id = `lst-${Date.now()}`;
    const cleanTitle = sanitizeString(draft.title || 'Untitled Verified Listing', 120);
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${Math.floor(Math.random() * 1000)}`;

    const preliminaryListing: Listing = {
      id,
      slug,
      title: cleanTitle,
      description: sanitizeString(draft.description || '', 2000),
      categorySlug: (draft.categorySlug as CategorySlug) || 'property',
      categoryName: draft.categoryName || 'Real Estate',
      price: validPrice,
      formattedPrice: `₹${validPrice.toLocaleString('en-IN')}`,
      pricePeriod: draft.pricePeriod,
      location: draft.location || {
        address: 'Sector 62, Noida',
        locality: 'Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201309',
        lat: 28.6273,
        lng: 77.3725,
        verifiedCoords: true
      },
      images: draft.images && draft.images.length > 0 ? draft.images : [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
      ],
      attributes: draft.attributes || {},
      sellerId: 'usr-curr-user',
      sellerName: 'Authentic Verified Seller',
      sellerPhone: '+91 98765 00000',
      sellerEmail: 'seller@trustnest.in',
      sellerType: 'OWNER',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerRating: 5.0,
      sellerVerified: true,
      trustScore: {
        overallScore: 91,
        tier: 'GOLD',
        badgeLabel: 'VERIFIED 91/100',
        verifiedAt: new Date().toISOString().split('T')[0],
        dimensions: []
      },
      status: 'PUBLISHED',
      version: 1,
      isFeatured: false,
      isBoosted: false,
      documents: draft.documents || [
        { id: `doc-${Date.now()}`, name: 'Government ID & Proof of Ownership', type: 'AADHAAR_PAN', status: 'VERIFIED', uploadedAt: new Date().toISOString().split('T')[0] }
      ],
      fraudSignals: [],
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      viewsCount: 1,
      savesCount: 0,
      leadsCount: 0
    };

    // Calculate dynamic 5-dimension Trust Score
    preliminaryListing.trustScore = calculateTrustScore(preliminaryListing);

    this.listings.unshift(preliminaryListing);
    this.persistListings();

    this.addAuditLog({
      id: `log-${Date.now()}`,
      actorName: 'Seller (User)',
      actorRole: 'SELLER',
      action: 'LISTING_CREATED_AND_VERIFIED',
      targetResource: `Listing ${id}`,
      timestamp: new Date().toISOString(),
      details: `Listing submitted & trust engine calculated score ${preliminaryListing.trustScore.overallScore}/100.`
    });

    return preliminaryListing;
  }

  public updateListingStatus(id: string, newStatus: ListingStatus, reason?: string): boolean {
    const listing = this.listings.find(l => l.id === id);
    if (!listing) return false;

    const oldStatus = listing.status;
    const allowed = ALLOWED_TRANSITIONS[oldStatus] || [];

    if (!allowed.includes(newStatus)) {
      console.warn(`[State Machine Blocked] Invalid transition ${oldStatus} -> ${newStatus} for listing ${id}`);
      return false;
    }

    listing.status = newStatus;
    if (newStatus === 'PUBLISHED' && !listing.publishedAt) {
      listing.publishedAt = new Date().toISOString();
    }
    this.persistListings();

    this.addAuditLog({
      id: `log-${Date.now()}`,
      actorName: 'Moderator / Admin',
      actorRole: this.currentRole,
      action: `STATUS_CHANGED_${oldStatus}_TO_${newStatus}`,
      targetResource: `Listing ${id}`,
      timestamp: new Date().toISOString(),
      details: reason || `Status updated from ${oldStatus} to ${newStatus}`
    });

    return true;
  }

  // --- Leads & Contact Intent ---
  public createLead(listingId: string, buyerName: string, buyerPhone: string, buyerEmail: string, message: string, channel: 'CHAT' | 'CALL_INTENT' | 'WHATSAPP' | 'EMAIL'): Lead {
    const listing = this.listings.find(l => l.id === listingId);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      listingId,
      listingTitle: listing ? listing.title : 'Listing Lead',
      buyerName: sanitizeString(buyerName, 60),
      buyerPhone: sanitizeString(buyerPhone, 20),
      buyerEmail: sanitizeString(buyerEmail, 80),
      message: sanitizeString(message, 500),
      channel,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    this.leads.unshift(newLead);
    this.persistLeads();

    if (listing) {
      listing.leadsCount += 1;
      this.persistListings();
    }

    return newLead;
  }

  public getLeads(): Lead[] {
    return this.leads;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(log: AuditLog) {
    this.auditLogs.unshift(log);
  }

  // --- Conversations & Messages ---
  public getConversations(): Conversation[] {
    return this.conversations;
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages[conversationId] || [];
  }

  public sendMessage(conversationId: string, text: string): Message {
    const cleanText = sanitizeString(text, 1000);
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'usr-curr-user',
      senderName: 'You (Verified Buyer)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text: cleanText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMessage);

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = cleanText;
      conv.lastMessageAt = newMessage.createdAt;
    }

    return newMessage;
  }

  // --- Vendor Organization ---
  public getVendorOrganizations(): VendorOrganization[] {
    return VENDOR_ORGANIZATIONS;
  }

  // --- Backup, Export & Reset ---
  public exportBackup(): string {
    return JSON.stringify({
      listings: this.listings,
      favorites: Array.from(this.favorites),
      leads: this.leads,
      auditLogs: this.auditLogs,
      role: this.currentRole
    }, null, 2);
  }

  public resetToSeedData() {
    this.listings = INITIAL_LISTINGS;
    this.favorites.clear();
    this.leads = [];
    this.auditLogs = MOCK_AUDIT_LOGS;
    this.persistListings();
    this.persistFavorites();
    this.persistLeads();
  }
}

export const store = new LocalStore();
