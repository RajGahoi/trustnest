import bcrypt from 'bcryptjs';
import { getDatabase } from './connection.js';
import { runMigrations } from './migrate.js';
import { CATEGORIES, INITIAL_LISTINGS, VENDOR_ORGANIZATIONS, MOCK_AUDIT_LOGS, MOCK_CONVERSATIONS } from '../../../src/mock/data.js';

export function seedDatabase(): void {
  runMigrations();
  const db = getDatabase();

  console.log('[Seed] Seeding database...');

  // 1. Seed Categories
  const insertCat = db.prepare(`
    INSERT OR REPLACE INTO categories (id, slug, name, icon, description, image, attributes_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const cat of CATEGORIES) {
    insertCat.run(
      cat.id,
      cat.slug,
      cat.name,
      cat.icon,
      cat.description,
      cat.image,
      JSON.stringify(cat.attributes || []),
      new Date().toISOString()
    );
  }
  console.log(`[Seed] Seeded ${CATEGORIES.length} categories.`);

  // 2. Seed Default Accounts
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('TrustNest@2026', salt);

  const defaultUsers = [
    {
      id: 'usr-admin-1',
      email: 'admin@trustnest.in',
      name: 'Operations Director',
      phone: '+91 98111 00001',
      role: 'ADMIN',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED'
    },
    {
      id: 'usr-mod-1',
      email: 'moderator@trustnest.in',
      name: 'Lead Trust Moderator',
      phone: '+91 98111 00002',
      role: 'MODERATOR',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED'
    },
    {
      id: 'usr-seller-1',
      email: 'seller@trustnest.in',
      name: 'Ananya Roy',
      phone: '+91 98765 00000',
      role: 'SELLER',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED'
    },
    {
      id: 'usr-vnd-1',
      email: 'vendor@trustnest.in',
      name: 'TrustNest Platinum Realty',
      phone: '+91 98222 00003',
      role: 'VENDOR_ADMIN',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED'
    },
    {
      id: 'usr-buyer-1',
      email: 'buyer@trustnest.in',
      name: 'Saurabh Malhotra',
      phone: '+91 99999 88888',
      role: 'USER',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      verified_status: 'VERIFIED'
    }
  ];

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, phone, role, avatar_url, verified_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of defaultUsers) {
    insertUser.run(
      u.id,
      u.email,
      defaultPasswordHash,
      u.name,
      u.phone,
      u.role,
      u.avatar_url,
      u.verified_status,
      new Date().toISOString(),
      new Date().toISOString()
    );
  }
  console.log(`[Seed] Seeded ${defaultUsers.length} test user accounts (Password: TrustNest@2026).`);

  // 3. Seed Vendor Organizations & Members
  const insertOrg = db.prepare(`
    INSERT OR REPLACE INTO vendor_organizations (id, name, gst_number, business_type, verification_status, subscription_plan, active_listings_count, monthly_leads_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMember = db.prepare(`
    INSERT OR REPLACE INTO vendor_members (id, organization_id, name, email, phone, role, avatar, assigned_leads, joined_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const org of VENDOR_ORGANIZATIONS) {
    insertOrg.run(
      org.id,
      org.name,
      org.gstNumber,
      org.businessType,
      org.verificationStatus,
      org.subscriptionPlan,
      org.activeListingsCount,
      org.monthlyLeadsCount,
      new Date().toISOString()
    );

    for (const mem of org.members || []) {
      insertMember.run(
        mem.id,
        org.id,
        mem.name,
        mem.email,
        mem.phone,
        mem.role,
        mem.avatar,
        mem.assignedLeads,
        mem.joinedAt
      );
    }
  }

  // 4. Seed Initial Listings
  const insertListing = db.prepare(`
    INSERT OR REPLACE INTO listings (
      id, slug, title, description, category_slug, category_name, price, formatted_price, price_period,
      address, locality, city, state, pincode, lat, lng, verified_coords, attributes_json,
      seller_id, seller_name, seller_phone, seller_email, seller_type, seller_avatar, seller_rating, seller_verified,
      status, version, is_featured, is_boosted, views_count, saves_count, leads_count,
      created_at, published_at, expires_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertImg = db.prepare(`
    INSERT OR REPLACE INTO listing_images (id, listing_id, url, sort_order, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertDoc = db.prepare(`
    INSERT OR REPLACE INTO verification_documents (id, listing_id, uploader_id, name, type, file_path, status, review_notes, uploaded_at, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTrust = db.prepare(`
    INSERT OR REPLACE INTO trust_scores (id, listing_id, overall_score, tier, badge_label, verified_at, dimensions_json, calculated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFraud = db.prepare(`
    INSERT OR REPLACE INTO fraud_signals (id, listing_id, type, severity, description, detected_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const l of INITIAL_LISTINGS) {
    insertListing.run(
      l.id,
      l.slug || `${l.id}`,
      l.title,
      l.description,
      l.categorySlug,
      l.categoryName,
      l.price,
      l.formattedPrice || `₹${l.price.toLocaleString('en-IN')}`,
      l.pricePeriod || null,
      l.location.address || '',
      l.location.locality || '',
      l.location.city || 'Noida',
      l.location.state || 'Uttar Pradesh',
      l.location.pincode || '201301',
      l.location.lat || 28.6273,
      l.location.lng || 77.3725,
      l.location.verifiedCoords ? 1 : 0,
      JSON.stringify(l.attributes || {}),
      l.sellerId || 'usr-seller-1',
      l.sellerName || 'Verified Seller',
      l.sellerPhone || '+91 98765 00000',
      l.sellerEmail || 'seller@trustnest.in',
      l.sellerType || 'OWNER',
      l.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      l.sellerRating || 5.0,
      l.sellerVerified ? 1 : 0,
      l.status || 'PUBLISHED',
      l.version || 1,
      l.isFeatured ? 1 : 0,
      l.isBoosted ? 1 : 0,
      l.viewsCount || 10,
      l.savesCount || 2,
      l.leadsCount || 1,
      l.createdAt || new Date().toISOString(),
      l.publishedAt || new Date().toISOString(),
      l.expiresAt || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    );

    // Images
    (l.images || []).forEach((imgUrl, idx) => {
      insertImg.run(`img-${l.id}-${idx}`, l.id, imgUrl, idx, new Date().toISOString());
    });

    // Documents
    (l.documents || []).forEach((doc, idx) => {
      insertDoc.run(
        doc.id || `doc-${l.id}-${idx}`,
        l.id,
        l.sellerId || 'usr-seller-1',
        doc.name,
        doc.type,
        doc.previewUrl || null,
        doc.status,
        'Passed primary document verification',
        doc.uploadedAt || new Date().toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );
    });

    // Trust Score
    if (l.trustScore) {
      insertTrust.run(
        `ts-${l.id}`,
        l.id,
        l.trustScore.overallScore,
        l.trustScore.tier,
        l.trustScore.badgeLabel,
        l.trustScore.verifiedAt || new Date().toISOString().split('T')[0],
        JSON.stringify(l.trustScore.dimensions || []),
        new Date().toISOString()
      );
    }

    // Fraud signals
    (l.fraudSignals || []).forEach((fs, idx) => {
      insertFraud.run(
        fs.id || `fs-${l.id}-${idx}`,
        l.id,
        fs.type,
        fs.severity,
        fs.description,
        fs.detectedAt || new Date().toISOString()
      );
    });
  }
  console.log(`[Seed] Seeded ${INITIAL_LISTINGS.length} initial verified listings.`);

  // 5. Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT OR REPLACE INTO audit_logs (id, actor_id, actor_name, actor_role, action, target_resource, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const log of MOCK_AUDIT_LOGS) {
    insertAudit.run(
      log.id,
      'usr-admin-1',
      log.actorName,
      log.actorRole,
      log.action,
      log.targetResource,
      log.details,
      log.timestamp
    );
  }

  // 6. Seed Conversations & Messages
  const insertConv = db.prepare(`
    INSERT OR REPLACE INTO conversations (id, listing_id, listing_title, listing_image, listing_price, buyer_id, seller_id, last_message, last_message_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMsg = db.prepare(`
    INSERT OR REPLACE INTO messages (id, conversation_id, sender_id, sender_name, sender_avatar, text, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const conv of MOCK_CONVERSATIONS) {
    insertConv.run(
      conv.id,
      conv.listingId,
      conv.listingTitle,
      conv.listingImage,
      conv.listingPrice,
      'usr-buyer-1',
      'usr-vnd-1',
      conv.lastMessage,
      conv.lastMessageAt,
      new Date().toISOString()
    );

    insertMsg.run(
      `msg-${conv.id}-1`,
      conv.id,
      'usr-buyer-1',
      'Saurabh Malhotra',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      'Hi, is this property available for immediate possession?',
      1,
      '10:30 AM'
    );

    insertMsg.run(
      `msg-${conv.id}-2`,
      conv.id,
      'usr-vnd-1',
      'TrustNest Platinum Realty',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      'Yes Saurabh! This pent-house is ready to move in with OC certificate received.',
      1,
      '10:35 AM'
    );
  }

  console.log('[Seed] Database initialization and seeding complete.');
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}
