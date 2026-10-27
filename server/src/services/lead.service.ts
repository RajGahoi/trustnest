import { getDatabase } from '../db/connection.js';
import { AppError } from '../middlewares/error.js';

export interface CreateLeadDTO {
  listingId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  message?: string;
  channel?: 'CHAT' | 'CALL_INTENT' | 'WHATSAPP' | 'EMAIL';
  buyerId?: string;
}

export class LeadService {
  public static createLead(data: CreateLeadDTO) {
    const db = getDatabase();

    const listing = db.prepare('SELECT id, title, seller_id FROM listings WHERE id = ?').get(data.listingId) as any;
    if (!listing) {
      throw new AppError('Listing not found.', 404, 'LISTING_NOT_FOUND');
    }

    const id = `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const cleanName = (data.buyerName || 'Verified Buyer').trim().slice(0, 60);
    const cleanPhone = (data.buyerPhone || '+91 99999 88888').trim().slice(0, 20);
    const cleanEmail = (data.buyerEmail || 'buyer@trustnest.in').trim().slice(0, 80);
    const cleanMsg = (data.message || 'Expressed contact intent for verified listing').trim().slice(0, 500);
    const channel = data.channel || 'CHAT';

    db.prepare(`
      INSERT INTO leads (id, listing_id, listing_title, buyer_id, buyer_name, buyer_phone, buyer_email, message, channel, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?)
    `).run(
      id,
      data.listingId,
      listing.title,
      data.buyerId || null,
      cleanName,
      cleanPhone,
      cleanEmail,
      cleanMsg,
      channel,
      now
    );

    // Increment leads count on the listing
    db.prepare('UPDATE listings SET leads_count = leads_count + 1 WHERE id = ?').run(data.listingId);

    return {
      id,
      listingId: data.listingId,
      listingTitle: listing.title,
      buyerName: cleanName,
      buyerPhone: cleanPhone,
      buyerEmail: cleanEmail,
      message: cleanMsg,
      channel,
      status: 'NEW',
      createdAt: now
    };
  }

  public static getLeads(sellerId?: string) {
    const db = getDatabase();
    if (sellerId) {
      return db.prepare(`
        SELECT l.*
        FROM leads l
        JOIN listings lst ON l.listing_id = lst.id
        WHERE lst.seller_id = ?
        ORDER BY l.created_at DESC
      `).all(sellerId);
    }
    return db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100').all();
  }

  public static updateLeadStatus(id: string, status: 'NEW' | 'CONTACTED' | 'CLOSED') {
    const db = getDatabase();
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
    return true;
  }
}
