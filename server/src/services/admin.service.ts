import { getDatabase } from '../db/connection.js';
import { ListingService } from './listing.service.js';
import { AppError } from '../middlewares/error.js';

export class AdminService {
  public static getModerationQueue() {
    const db = getDatabase();

    // Listings that are in SUBMITTED, PENDING_REVIEW, or have fraud signals
    const rows = db.prepare(`
      SELECT 
        l.*,
        ts.overall_score as trust_overall_score,
        ts.tier as trust_tier,
        ts.badge_label as trust_badge_label,
        ts.verified_at as trust_verified_at,
        ts.dimensions_json as trust_dimensions_json
      FROM listings l
      LEFT JOIN trust_scores ts ON l.id = ts.listing_id
      WHERE l.status IN ('PENDING_REVIEW', 'SUBMITTED', 'REJECTED')
         OR EXISTS (SELECT 1 FROM fraud_signals fs WHERE fs.listing_id = l.id)
      ORDER BY l.created_at DESC
      LIMIT 50
    `).all() as any[];

    return rows.map(r => {
      const documents = db.prepare('SELECT id, name, type, status, uploaded_at, file_path as previewUrl FROM verification_documents WHERE listing_id = ?').all(r.id);
      const fraudSignals = db.prepare('SELECT id, type, severity, description, detected_at FROM fraud_signals WHERE listing_id = ?').all(r.id);
      const images = (db.prepare('SELECT url FROM listing_images WHERE listing_id = ? LIMIT 2').all(r.id) as any[]).map(i => i.url);

      let trustScore = {
        overallScore: r.trust_overall_score || 85,
        tier: r.trust_tier || 'SILVER',
        badgeLabel: r.trust_badge_label || `VERIFIED ${r.trust_overall_score || 85}/100`,
        verifiedAt: r.trust_verified_at || r.created_at.split('T')[0],
        dimensions: []
      };

      try {
        trustScore.dimensions = JSON.parse(r.trust_dimensions_json || '[]');
      } catch (e) {}

      return {
        id: r.id,
        title: r.title,
        categoryName: r.category_name,
        formattedPrice: r.formatted_price,
        sellerName: r.seller_name,
        sellerEmail: r.seller_email,
        sellerPhone: r.seller_phone,
        status: r.status,
        trustScore,
        documents,
        fraudSignals,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'],
        createdAt: r.created_at
      };
    });
  }

  public static decideListing(
    listingId: string,
    decision: 'APPROVE' | 'REJECT',
    reason: string,
    reviewer: { id: string; name: string; role: string }
  ) {
    const targetStatus = decision === 'APPROVE' ? 'PUBLISHED' : 'REJECTED';
    ListingService.updateListingStatus(listingId, targetStatus, reason, reviewer);

    return {
      success: true,
      listingId,
      status: targetStatus,
      reason,
      reviewedBy: reviewer.name,
      reviewedAt: new Date().toISOString()
    };
  }

  public static getAuditLogs(limit = 100) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?').all(limit);
  }

  public static getPlatformStats() {
    const db = getDatabase();
    const totalListings = (db.prepare('SELECT COUNT(*) as count FROM listings').get() as any).count;
    const publishedListings = (db.prepare("SELECT COUNT(*) as count FROM listings WHERE status = 'PUBLISHED'").get() as any).count;
    const pendingListings = (db.prepare("SELECT COUNT(*) as count FROM listings WHERE status IN ('SUBMITTED', 'PENDING_REVIEW')").get() as any).count;
    const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
    const totalLeads = (db.prepare('SELECT COUNT(*) as count FROM leads').get() as any).count;
    const totalFraudSignals = (db.prepare('SELECT COUNT(*) as count FROM fraud_signals').get() as any).count;

    return {
      totalListings,
      publishedListings,
      pendingListings,
      totalUsers,
      totalLeads,
      totalFraudSignals,
      serverTime: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime())
    };
  }
}
