import type { Listing, Category, Lead, Conversation, Message, AuditLog, UserRole } from '../types';

const API_BASE = '/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  verified_status: string;
  created_at?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

class ApiService {
  private token: string | null = null;
  private currentUser: AuthUser | null = null;

  constructor() {
    this.token = localStorage.getItem('trustnest_jwt_token');
    const savedUser = localStorage.getItem('trustnest_auth_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {}
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public setSession(token: string | null, user: AuthUser | null) {
    this.token = token;
    this.currentUser = user;
    if (token) {
      localStorage.setItem('trustnest_jwt_token', token);
    } else {
      localStorage.removeItem('trustnest_jwt_token');
    }
    if (user) {
      localStorage.setItem('trustnest_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trustnest_auth_user');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message || `API request failed with status ${response.status}`);
      }

      return json.data !== undefined ? json.data : json;
    } catch (err: any) {
      console.warn(`[API] Network or server error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Auth Endpoints ---
  public async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const data = await this.request<{ user: AuthUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setSession(data.token, data.user);
    return data;
  }

  public async register(payload: { email: string; password: string; name: string; phone: string; role?: string }): Promise<{ user: AuthUser; token: string }> {
    const data = await this.request<{ user: AuthUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setSession(data.token, data.user);
    return data;
  }

  public async getMe(): Promise<AuthUser> {
    const user = await this.request<AuthUser>('/auth/me');
    this.currentUser = user;
    localStorage.setItem('trustnest_auth_user', JSON.stringify(user));
    return user;
  }

  public async getSessions(): Promise<any[]> {
    return this.request<any[]>('/auth/sessions');
  }

  public async revokeSession(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/auth/sessions/${id}/revoke`, { method: 'POST' });
    return res.success;
  }

  public logout(): void {
    if (this.token) {
      this.request('/auth/logout', { method: 'POST' }).catch(() => {});
    }
    this.setSession(null, null);
  }

  // --- Listings Endpoints ---
  public async getListings(params: {
    query?: string;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minTrustScore?: number;
    sellerType?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<{ listings: Listing[]; pagination: Pagination }> {
    const queryParts: string[] = [];
    if (params.query) queryParts.push(`query=${encodeURIComponent(params.query)}`);
    if (params.category && params.category !== 'all') queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params.city && params.city !== 'All Cities') queryParts.push(`city=${encodeURIComponent(params.city)}`);
    if (params.minPrice) queryParts.push(`minPrice=${params.minPrice}`);
    if (params.maxPrice) queryParts.push(`maxPrice=${params.maxPrice}`);
    if (params.minTrustScore) queryParts.push(`minTrustScore=${params.minTrustScore}`);
    if (params.sellerType && params.sellerType !== 'ALL') queryParts.push(`sellerType=${encodeURIComponent(params.sellerType)}`);
    if (params.sortBy) queryParts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    if (params.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await this.request<any>(`/listings${queryString}`);
    return {
      listings: res,
      pagination: (res as any).pagination || { page: 1, limit: 12, total: res.length || 0, totalPages: 1 }
    };
  }

  public async getCities(): Promise<Array<{ city: string; count: number }>> {
    return this.request<Array<{ city: string; count: number }>>('/listings/cities');
  }

  public async getListing(idOrSlug: string): Promise<Listing> {
    return this.request<Listing>(`/listings/${idOrSlug}`);
  }

  public async createListing(draft: any): Promise<Listing> {
    return this.request<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(draft)
    });
  }

  public async updateListingStatus(id: string, status: string, reason?: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(`/listings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    });
    return res.success;
  }

  public async toggleFavorite(id: string): Promise<boolean> {
    const res = await this.request<{ isFavorite: boolean }>(`/listings/${id}/favorite`, {
      method: 'POST'
    });
    return res.isFavorite;
  }

  public async getFavorites(): Promise<Listing[]> {
    return this.request<Listing[]>('/listings/favorites/me');
  }

  // --- Categories Endpoints ---
  public async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // --- Leads Endpoints ---
  public async createLead(data: {
    listingId: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail?: string;
    message?: string;
    channel?: string;
  }): Promise<Lead> {
    return this.request<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async getLeads(): Promise<Lead[]> {
    return this.request<Lead[]>('/leads');
  }

  // --- Messages Endpoints ---
  public async getConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/messages/conversations');
  }

  public async startConversation(listingId: string, text: string): Promise<{ conversationId: string; message: Message }> {
    return this.request<{ conversationId: string; message: Message }>('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ listingId, text })
    });
  }

  public async getMessages(conversationId: string): Promise<Message[]> {
    return this.request<Message[]>(`/messages/conversations/${conversationId}/messages`);
  }

  public async sendMessage(conversationId: string, text: string): Promise<Message> {
    return this.request<Message>(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  // --- Admin & Moderation Endpoints ---
  public async getModerationQueue(): Promise<any[]> {
    return this.request<any[]>('/admin/moderation');
  }

  public async decideListing(listingId: string, decision: 'APPROVE' | 'REJECT', reason: string): Promise<any> {
    return this.request<any>('/admin/moderation/decide', {
      method: 'POST',
      body: JSON.stringify({ listingId, decision, reason })
    });
  }

  public async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    return this.request<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
  }

  public async getStats(): Promise<any> {
    return this.request<any>('/admin/stats');
  }
}

export const api = new ApiService();
