import { CATEGORIES, INITIAL_LISTINGS, VENDOR_ORGANIZATIONS, MOCK_AUDIT_LOGS, MOCK_CONVERSATIONS } from './data';
import type { 
  Listing, 
  ListingStatus, 
  Category, 
  Lead, 
  LeadStatus,
  AuditLog, 
  Conversation, 
  Message, 
  UserRole, 
  CategorySlug, 
  VendorOrganization,
  SavedSearch,
  SupportTicket,
  UserSubscription,
  AbuseReport,
  NotificationItem
} from '../types';
import { hasCapability } from '../domain/auth/capabilities';
import type { Capability } from '../domain/auth/capabilities';
import { calculateTrustScore } from '../domain/trust/calculator';
import { sanitizeString, validatePrice } from '../domain/validation';
import { getNearbyLandmarks } from '../domain/location/geo';

const STORAGE_KEYS = {
  LISTINGS: 'trustnest_listings_v3',
  CATEGORIES: 'trustnest_categories_v3',
  FAVORITES: 'trustnest_favorites_v3',
  RECENTLY_VIEWED: 'trustnest_recent_viewed_v3',
  COMPARISONS: 'trustnest_comparisons_v3',
  SAVED_SEARCHES: 'trustnest_saved_searches_v3',
  LEADS: 'trustnest_leads_v3',
  AUDIT_LOGS: 'trustnest_audit_logs_v3',
  NOTIFICATIONS: 'trustnest_notifications_v3',
  SUBSCRIPTIONS: 'trustnest_subscriptions_v3',
  SUPPORT_TICKETS: 'trustnest_support_tickets_v3',
  ABUSE_REPORTS: 'trustnest_abuse_reports_v3',
  REVEALS_LEFT: 'trustnest_reveals_left_v3',
  ROLE: 'trustnest_current_role_v3',
};

const ALLOWED_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ['SUBMITTED', 'ARCHIVED'],
  SUBMITTED: ['PENDING_REVIEW', 'DRAFT', 'ARCHIVED'],
  PENDING_REVIEW: ['APPROVED', 'PUBLISHED', 'REJECTED', 'SUSPENDED'],
  APPROVED: ['PUBLISHED', 'REJECTED'],
  PUBLISHED: ['PAUSED', 'EXPIRED', 'SOLD', 'RENTED', 'SUSPENDED', 'ARCHIVED', 'REJECTED'],
  PAUSED: ['PUBLISHED', 'ARCHIVED'],
  EXPIRED: ['SUBMITTED', 'PUBLISHED', 'ARCHIVED'],
  SOLD: ['ARCHIVED', 'PUBLISHED'],
  RENTED: ['ARCHIVED', 'PUBLISHED'],
  REJECTED: ['SUBMITTED', 'APPROVED', 'PUBLISHED', 'ARCHIVED'],
  SUSPENDED: ['PENDING_REVIEW', 'ARCHIVED'],
  ARCHIVED: ['DRAFT']
};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof localStorage !== 'undefined') {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof localStorage !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {}
  }
};

class LocalStore {
  private listings: Listing[] = [];
  private categories: Category[] = CATEGORIES;
  private favorites: Set<string> = new Set();
  private recentlyViewedIds: string[] = [];
  private comparisonIds: string[] = [];
  private savedSearches: SavedSearch[] = [];
  private leads: Lead[] = [];
  private auditLogs: AuditLog[] = MOCK_AUDIT_LOGS;
  private notifications: NotificationItem[] = [];
  private subscriptions: UserSubscription[] = [];
  private supportTickets: SupportTicket[] = [];
  private abuseReports: AbuseReport[] = [];
  private revealsLeft: number = 3;
  private conversations: Conversation[] = MOCK_CONVERSATIONS;
  private messages: Record<string, Message[]> = {
    'conv-1': [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'usr-buyer-1',
        senderName: 'Saurabh Malhotra',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        text: 'Hi, is this property available for immediate possession with clear registry?',
        createdAt: '10:30 AM',
        isRead: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'usr-vnd-1',
        senderName: 'TrustNest Platinum Realty',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        text: 'Yes Saurabh! OC certificate has been received and title deeds are verified.',
        createdAt: '10:35 AM',
        isRead: true
      }
    ]
  };
  private currentRole: UserRole = 'USER';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedListings = safeStorage.getItem(STORAGE_KEYS.LISTINGS);
      if (savedListings) {
        this.listings = JSON.parse(savedListings);
      } else {
        // Hydrate initial listings with Indian real estate attributes
        this.listings = INITIAL_LISTINGS.map(l => this.enrichListingDetails(l));
        this.persistListings();
      }

      const savedFavs = safeStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (savedFavs) {
        this.favorites = new Set(JSON.parse(savedFavs));
      }

      const savedRecent = safeStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      if (savedRecent) {
        this.recentlyViewedIds = JSON.parse(savedRecent);
      }

      const savedComparisons = safeStorage.getItem(STORAGE_KEYS.COMPARISONS);
      if (savedComparisons) {
        this.comparisonIds = JSON.parse(savedComparisons);
      }

      const savedSearches = safeStorage.getItem(STORAGE_KEYS.SAVED_SEARCHES);
      if (savedSearches) {
        this.savedSearches = JSON.parse(savedSearches);
      } else {
        // Seed an initial saved search for immediate UX demonstration
        this.savedSearches = [
          {
            id: 'ss-1',
            userId: 'usr-current',
            name: 'Noida 3 BHK Verified Under ₹2 Cr',
            category: 'property',
            city: 'Noida',
            locality: 'Sector 62',
            maxPrice: 20000000,
            bhk: '3 BHK',
            alertFrequency: 'INSTANT',
            createdAt: new Date().toISOString()
          }
        ];
        this.persistSavedSearches();
      }

      const savedLeads = safeStorage.getItem(STORAGE_KEYS.LEADS);
      if (savedLeads) {
        this.leads = JSON.parse(savedLeads);
      } else {
        this.leads = [
          {
            id: 'lead-init-1',
            listingId: 'lst-101',
            listingTitle: 'Modern 3 BHK Luxury Sky Villa with Private Garden',
            buyerName: 'Vikramaditya Roy',
            buyerPhone: '+91 98112 34567',
            buyerEmail: 'vikram.roy@outlook.com',
            message: 'Interested in scheduling a site visit this Saturday. Please share OC papers.',
            channel: 'CHAT',
            status: 'NEW',
            notes: [
              { id: 'n-1', text: 'Spoke briefly, buyer has pre-approved SBI Home Loan', author: 'Rajesh Sharma', createdAt: 'Yesterday' }
            ],
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            id: 'lead-init-2',
            listingId: 'lst-101',
            listingTitle: 'Modern 3 BHK Luxury Sky Villa with Private Garden',
            buyerName: 'Ananya Deshmukh',
            buyerPhone: '+91 98200 87654',
            buyerEmail: 'ananya.d@gmail.com',
            message: 'Inquired about final price negotiation and parking allotment.',
            channel: 'CALL_INTENT',
            status: 'FOLLOW_UP',
            notes: [
              { id: 'n-2', text: 'Follow-up requested on Monday after family discussion', author: 'Priya Verma', createdAt: '2 days ago' }
            ],
            followUpDate: '2026-11-03',
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];
        this.persistLeads();
      }

      const savedNotifs = safeStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) {
        this.notifications = JSON.parse(savedNotifs);
      } else {
        this.notifications = [
          {
            id: 'notif-1',
            userId: 'usr-current',
            title: 'New High-Intent Buyer Lead',
            message: 'Vikramaditya Roy enquired about your 3 BHK Luxury Sky Villa in Greater Noida.',
            type: 'ENQUIRY',
            linkRoute: 'vendor-dashboard',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            id: 'notif-2',
            userId: 'usr-current',
            title: 'Property Title Verification Approved',
            message: 'Sub-registrar title deed audit completed. Platinum Trust Shield awarded.',
            type: 'VERIFICATION',
            linkRoute: 'listing/lst-101',
            isRead: false,
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
          },
          {
            id: 'notif-3',
            userId: 'usr-current',
            title: 'Matching Listing in Sector 62',
            message: 'A newly verified 3 BHK Penthouse matching your saved search is now live.',
            type: 'SEARCH_MATCH',
            linkRoute: 'search',
            isRead: true,
            createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
          }
        ];
        this.persistNotifications();
      }

      const savedSubs = safeStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (savedSubs) {
        this.subscriptions = JSON.parse(savedSubs);
      }

      const savedTickets = safeStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
      if (savedTickets) {
        this.supportTickets = JSON.parse(savedTickets);
      } else {
        this.supportTickets = [
          {
            id: 'tkt-1',
            userId: 'usr-buyer-1',
            userName: 'Saurabh Malhotra',
            userEmail: 'saurabh@gmail.com',
            category: 'VERIFICATION',
            priority: 'MEDIUM',
            status: 'OPEN',
            subject: 'Question regarding RERA status verification for Apex Heights',
            description: 'Can you please confirm if Phase 2 of this project is covered under the listed UPRERAPRJ number?',
            messages: [
              { id: 'tm-1', sender: 'Saurabh Malhotra', text: 'Can you please confirm if Phase 2 is covered?', timestamp: 'Yesterday', isStaff: false },
              { id: 'tm-2', sender: 'Trust Support (Anand K.)', text: 'We have cross-checked the UP RERA portal. Yes, Phase 2 is under certificate UPRERAPRJ12345.', timestamp: 'Today 10:15 AM', isStaff: true }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        this.persistSupportTickets();
      }

      const savedAbuse = safeStorage.getItem(STORAGE_KEYS.ABUSE_REPORTS);
      if (savedAbuse) {
        this.abuseReports = JSON.parse(savedAbuse);
      }

      const savedReveals = safeStorage.getItem(STORAGE_KEYS.REVEALS_LEFT);
      if (savedReveals !== null) {
        this.revealsLeft = Number(savedReveals);
      }

      const savedRole = safeStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole) {
        this.currentRole = savedRole as UserRole;
      }
    } catch (err) {
      console.warn('LocalStorage error in store:', err);
      this.listings = INITIAL_LISTINGS.map(l => this.enrichListingDetails(l));
    }
  }

  // Enrich listings with complete Indian Real Estate specifics if missing
  private enrichListingDetails(listing: Listing): Listing {
    const attrs = listing.attributes || {}; const areaSqFt = attrs.areaSqFt || (attrs.areaUnit === "bigha" ? (attrs.area || 1) * 27225 : attrs.areaUnit === "acre" ? (attrs.area || 1) * 43560 : attrs.area || 1650); const displayArea = attrs.area || areaSqFt; const displayAreaUnit = (attrs.areaUnit as any) || "sqft"; const roadWidth = attrs.roadWidth || "60 ft Wide Sector Road"; const zoning = String(attrs.zoning || "").toLowerCase(); const landUse = zoning.includes("agri") ? "AGRICULTURAL" : zoning.includes("indust") ? "INDUSTRIAL" : zoning.includes("commerc") ? "COMMERCIAL" : "RESIDENTIAL"; const pricePerSqFt = areaSqFt > 0 ? Math.round(listing.price / areaSqFt) : 0; const enriched: Listing = { ...listing, propertyDetails: listing.propertyDetails || { areaSqFt, displayArea, displayAreaUnit, roadWidth,
        pricePerSqFt,
        reraId: listing.attributes.reraId || (listing.sellerType === 'BUILDER' ? 'UPRERAPRJ' + Math.floor(10000 + Math.random() * 90000) : undefined),
        reraApproved: listing.sellerType === 'BUILDER' || listing.trustScore.overallScore >= 85,
        ownershipType: (listing.attributes.ownership as any) || 'FREEHOLD',
        landUse: landUse as any,
        approvedAuthority: listing.location.city.includes('Noida') ? 'NOIDA Authority Approved Layout' : 'Municipal Corporation Approved',
        possessionStatus: 'READY_TO_MOVE',
        furnishing: listing.attributes.furnishing || 'Semi-Furnished',
        bhk: listing.attributes.bhk || '3 BHK',
        nearby: getNearbyLandmarks(listing.location.city, listing.location.locality)
      },
      verificationChecks: listing.verificationChecks || {
        phoneVerified: true,
        emailVerified: true,
        identityChecked: listing.trustScore.overallScore >= 75,
        documentsReviewed: listing.trustScore.overallScore >= 80,
        reraVerified: listing.sellerType === 'BUILDER' || listing.trustScore.overallScore >= 90,
        siteVisitDone: listing.trustScore.overallScore >= 92
      }
    };
    return enriched;
  }

  // --- Persistence helpers ---
  private persistListings() {
    try { safeStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(this.listings)); } catch (e) {}
  }
  private persistFavorites() {
    try { safeStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(this.favorites))); } catch (e) {}
  }
  private persistRecentlyViewed() {
    try { safeStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(this.recentlyViewedIds)); } catch (e) {}
  }
  private persistComparisons() {
    try { safeStorage.setItem(STORAGE_KEYS.COMPARISONS, JSON.stringify(this.comparisonIds)); } catch (e) {}
  }
  private persistSavedSearches() {
    try { safeStorage.setItem(STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(this.savedSearches)); } catch (e) {}
  }
  private persistLeads() {
    try { safeStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(this.leads)); } catch (e) {}
  }
  private persistNotifications() {
    try { safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications)); } catch (e) {}
  }
  private persistSupportTickets() {
    try { safeStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(this.supportTickets)); } catch (e) {}
  }
  private persistAbuseReports() {
    try { safeStorage.setItem(STORAGE_KEYS.ABUSE_REPORTS, JSON.stringify(this.abuseReports)); } catch (e) {}
  }
  private persistRevealsLeft() {
    try { safeStorage.setItem(STORAGE_KEYS.REVEALS_LEFT, String(this.revealsLeft)); } catch (e) {}
  }

  // --- Auth & Roles ---
  public getCurrentRole(): UserRole {
    return this.currentRole;
  }
  public setRole(role: UserRole) {
    this.currentRole = role;
    try { safeStorage.setItem(STORAGE_KEYS.ROLE, role); } catch (e) {}
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
    const match = this.listings.find(l => l.slug === slug || l.id === slug);
    if (match) {
      this.addRecentlyViewed(match);
    }
    return match;
  }

  public getCitiesWithCounts(): { city: string; count: number }[] {
    const counts: Record<string, number> = {};
    this.getPublishedListings().forEach(l => {
      counts[l.location.city] = (counts[l.location.city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }

  // --- Favorites ---
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

  // --- Recently Viewed ---
  public addRecentlyViewed(listing: Listing) {
    this.recentlyViewedIds = [listing.id, ...this.recentlyViewedIds.filter(id => id !== listing.id)].slice(0, 10);
    this.persistRecentlyViewed();
  }
  public getRecentlyViewed(): Listing[] {
    return this.recentlyViewedIds
      .map(id => this.listings.find(l => l.id === id))
      .filter((l): l is Listing => Boolean(l));
  }
  public clearRecentlyViewed() {
    this.recentlyViewedIds = [];
    this.persistRecentlyViewed();
  }

  // --- Property Comparisons (Up to 4) ---
  public addToComparison(id: string): boolean { if (this.comparisonIds.includes(id)) return true; if (this.comparisonIds.length >= 4) return false; this.comparisonIds.push(id); this.persistComparisons(); return true; }
  public isInComparison(id: string): boolean { return this.comparisonIds.includes(id); }
  public removeFromComparison(id: string) {
    this.comparisonIds = this.comparisonIds.filter(item => item !== id);
    this.persistComparisons();
  }
  public getComparisonListings(): Listing[] {
    return this.comparisonIds
      .map(id => this.listings.find(l => l.id === id))
      .filter((l): l is Listing => Boolean(l));
  }
  public clearComparison() {
    this.comparisonIds = [];
    this.persistComparisons();
  }

  // --- Saved Searches & Alerts ---
  public getSavedSearches(): SavedSearch[] {
    return this.savedSearches;
  }
  public saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch {
    const newSearch: SavedSearch = {
      ...search,
      id: `ss-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.savedSearches.unshift(newSearch);
    this.persistSavedSearches();
    return newSearch;
  }
  public deleteSavedSearch(id: string) {
    this.savedSearches = this.savedSearches.filter(s => s.id !== id);
    this.persistSavedSearches();
  }
  public updateSavedSearchFrequency(id: string, alertFrequency: SavedSearch['alertFrequency']) {
    const item = this.savedSearches.find(s => s.id === id);
    if (item) {
      item.alertFrequency = alertFrequency;
      this.persistSavedSearches();
    }
  }

  // --- Contact Reveals Quota & Subscriptions ---
  public getContactRevealsRemaining(): number {
    return this.revealsLeft;
  }
  public decrementContactReveal(): boolean {
    if (this.revealsLeft <= 0) return false;
    this.revealsLeft -= 1;
    this.persistRevealsLeft();
    return true;
  }
  public addSubscription(sub: UserSubscription) {
    this.subscriptions.unshift(sub);
    this.revealsLeft += sub.revealsRemaining;
    this.persistRevealsLeft();
    try {
      safeStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(this.subscriptions));
    } catch (e) {}

    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: sub.userId,
      title: 'Subscription Activated!',
      message: `${sub.planName} is active. Invoice #${sub.invoiceNo} generated with 18% GST.`,
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }
  public getActiveSubscription(): UserSubscription | null {
    return this.subscriptions.find(s => s.active) || null;
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }
  public addNotification(notif: NotificationItem) {
    this.notifications.unshift(notif);
    this.persistNotifications();
    window.dispatchEvent(new Event('trustnest_notifications_updated'));
  }
  public markNotificationRead(id: string) {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      this.persistNotifications();
      window.dispatchEvent(new Event('trustnest_notifications_updated'));
    }
  }
  public markAllNotificationsRead() {
    this.notifications.forEach(n => { n.isRead = true; });
    this.persistNotifications();
    window.dispatchEvent(new Event('trustnest_notifications_updated'));
  }

  // --- Support Tickets ---
  public getSupportTickets(): SupportTicket[] {
    return this.supportTickets;
  }
  public createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      status: 'OPEN',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: ticket.userName,
          text: ticket.description,
          timestamp: 'Just now',
          isStaff: false
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.supportTickets.unshift(newTicket);
    this.persistSupportTickets();
    return newTicket;
  }
  public replySupportTicket(ticketId: string, text: string, isStaff: boolean = false) {
    const ticket = this.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.push({
        id: `m-${Date.now()}`,
        sender: isStaff ? 'Trust Support Agent' : ticket.userName,
        text,
        timestamp: 'Just now',
        isStaff
      });
      ticket.updatedAt = new Date().toISOString();
      if (isStaff && ticket.status === 'OPEN') {
        ticket.status = 'IN_PROGRESS';
      }
      this.persistSupportTickets();
    }
  }
  public updateTicketStatus(ticketId: string, status: SupportTicket['status']) {
    const ticket = this.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date().toISOString();
      this.persistSupportTickets();
    }
  }

  // --- Abuse Reports ---
  public getAbuseReports(): AbuseReport[] {
    return this.abuseReports;
  }
  public createAbuseReport(report: Omit<AbuseReport, 'id' | 'status' | 'createdAt'>): AbuseReport {
    const newReport: AbuseReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.abuseReports.unshift(newReport);
    this.persistAbuseReports();
    return newReport;
  }
  public updateAbuseReportStatus(reportId: string, status: AbuseReport['status']) {
    const report = this.abuseReports.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      this.persistAbuseReports();
    }
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

    const areaSqFt = draft.attributes?.area || (draft.categorySlug === 'property' ? 1500 : 0);
    const pricePerSqFt = areaSqFt > 0 ? Math.round(validPrice / areaSqFt) : 0;

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
      propertyDetails: {
        areaSqFt,
        displayArea: areaSqFt,
        displayAreaUnit: 'sqft',
        pricePerSqFt,
        reraId: draft.attributes?.reraId || undefined,
        reraApproved: Boolean(draft.attributes?.reraId),
        ownershipType: (draft.attributes?.ownership as any) || 'FREEHOLD',
        landUse: 'RESIDENTIAL',
        approvedAuthority: 'NOIDA / Authority Approved',
        possessionStatus: 'READY_TO_MOVE',
        furnishing: draft.attributes?.furnishing || 'Semi-Furnished',
        bhk: draft.attributes?.bhk || '3 BHK',
        nearby: getNearbyLandmarks(draft.location?.city || 'Noida', draft.location?.locality || 'Sector 62')
      },
      sellerId: 'usr-curr-user',
      sellerName: 'Authentic Verified Seller',
      sellerPhone: '+91 98765 00000',
      sellerEmail: 'seller@trustnest.in',
      sellerType: (draft.sellerType as any) || 'OWNER',
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
      verificationChecks: {
        phoneVerified: true,
        emailVerified: true,
        identityChecked: true,
        documentsReviewed: true,
        reraVerified: Boolean(draft.attributes?.reraId),
        siteVisitDone: false
      },
      status: 'PUBLISHED',
      version: 1,
      isFeatured: false,
      isBoosted: false,
      documents: draft.documents || [
        { id: `doc-${Date.now()}`, name: 'Government ID & Proof of Title', type: 'AADHAAR_PAN', status: 'VERIFIED', uploadedAt: new Date().toISOString().split('T')[0] }
      ],
      fraudSignals: [],
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      viewsCount: 1,
      savesCount: 0,
      leadsCount: 0
    };

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

  // --- Leads CRM ---
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
      notes: [],
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

  public updateLeadStatus(leadId: string, status: LeadStatus): boolean {
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead) return false;
    lead.status = status;
    this.persistLeads();
    return true;
  }

  public addLeadNote(leadId: string, noteText: string, author: string = 'Owner'): boolean {
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead) return false;
    if (!lead.notes) lead.notes = [];
    lead.notes.unshift({
      id: `note-${Date.now()}`,
      text: noteText,
      author,
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    });
    this.persistLeads();
    return true;
  }

  public setLeadFollowUp(leadId: string, date: string): boolean {
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead) return false;
    lead.followUpDate = date;
    this.persistLeads();
    return true;
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

  // --- Export & Reset ---
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
    this.listings = INITIAL_LISTINGS.map(l => this.enrichListingDetails(l));
    this.favorites.clear();
    this.leads = [];
    this.auditLogs = MOCK_AUDIT_LOGS;
    this.persistListings();
    this.persistFavorites();
    this.persistLeads();
  }
}

export const store = new LocalStore();
