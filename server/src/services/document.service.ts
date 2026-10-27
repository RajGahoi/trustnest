import fs from 'node:fs';
import path from 'node:path';
import { getDatabase } from '../db/connection.js';
import { config } from '../config/index.js';
import { AppError } from '../middlewares/error.js';
import { evaluateTrustScore } from './trust.service.js';

export class DocumentService {
  public static uploadDocument(
    listingId: string,
    uploaderId: string,
    file: { originalname: string; mimetype: string; size: number; filename: string; path: string },
    documentType: string
  ) {
    const db = getDatabase();

    const listing = db.prepare('SELECT id, seller_id FROM listings WHERE id = ?').get(listingId) as any;
    if (!listing) {
      throw new AppError('Listing not found.', 404, 'LISTING_NOT_FOUND');
    }

    if (listing.seller_id !== uploaderId && uploaderId !== 'usr-admin-1') {
      throw new AppError('Unauthorized to upload documents for this listing.', 403, 'FORBIDDEN');
    }

    const id = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO verification_documents (id, listing_id, uploader_id, name, type, file_path, status, review_notes, uploaded_at, verified_at)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING', 'Document queued for moderator verification', ?, NULL)
    `).run(
      id,
      listingId,
      uploaderId,
      file.originalname,
      documentType || 'AADHAAR_PAN',
      file.filename,
      now.split('T')[0]
    );

    return {
      id,
      listingId,
      name: file.originalname,
      type: documentType,
      status: 'PENDING',
      uploadedAt: now.split('T')[0]
    };
  }

  public static verifyDocument(documentId: string, status: 'VERIFIED' | 'REJECTED', reviewNotes: string, reviewer: { id: string; name: string; role: string }) {
    const db = getDatabase();
    const doc = db.prepare('SELECT id, listing_id, name, type FROM verification_documents WHERE id = ?').get(documentId) as any;
    if (!doc) {
      throw new AppError('Document not found.', 404, 'DOCUMENT_NOT_FOUND');
    }

    const today = new Date().toISOString().split('T')[0];

    db.prepare(`
      UPDATE verification_documents
      SET status = ?, review_notes = ?, verified_at = ?
      WHERE id = ?
    `).run(status, reviewNotes || `Decision: ${status}`, today, documentId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, actor_id, actor_name, actor_role, action, target_resource, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `log-${Date.now()}`,
      reviewer.id,
      reviewer.name,
      reviewer.role,
      `DOCUMENT_${status}`,
      `Document ${documentId} for Listing ${doc.listing_id}`,
      reviewNotes || `Moderator marked document as ${status}`,
      new Date().toISOString()
    );

    // Recalculate listing trust score dynamically
    this.recalculateListingTrustScore(doc.listing_id);

    return {
      id: documentId,
      status,
      verifiedAt: today,
      reviewNotes
    };
  }

  public static recalculateListingTrustScore(listingId: string) {
    const db = getDatabase();
    const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(listingId) as any;
    if (!listing) return;

    const docs = db.prepare('SELECT type, status FROM verification_documents WHERE listing_id = ?').all(listingId) as any[];
    const images = (db.prepare('SELECT url FROM listing_images WHERE listing_id = ?').all(listingId) as any[]).map(i => i.url);

    const scoreResult = evaluateTrustScore({
      sellerVerified: Boolean(listing.seller_verified),
      sellerType: listing.seller_type,
      documents: docs,
      location: {
        address: listing.address,
        locality: listing.locality,
        city: listing.city,
        pincode: listing.pincode,
        lat: listing.lat,
        lng: listing.lng,
        verifiedCoords: Boolean(listing.verified_coords)
      },
      images,
      price: listing.price,
      categorySlug: listing.category_slug
    });

    db.prepare(`
      UPDATE trust_scores
      SET overall_score = ?, tier = ?, badge_label = ?, verified_at = ?, dimensions_json = ?, calculated_at = ?
      WHERE listing_id = ?
    `).run(
      scoreResult.overallScore,
      scoreResult.tier,
      scoreResult.badgeLabel,
      scoreResult.verifiedAt,
      JSON.stringify(scoreResult.dimensions),
      new Date().toISOString(),
      listingId
    );
  }
}
