import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../server/src/app.js';
import { runMigrations } from '../../server/src/db/migrate.js';
import { seedDatabase } from '../../server/src/db/seed.js';

describe('TrustNest API End-to-End Integration Suite', () => {
  beforeAll(() => {
    runMigrations();
    seedDatabase();
  });

  let buyerToken: string;
  let adminToken: string;
  let createdListingId: string;
  let conversationId: string;

  it('1. GET /api/v1/health - should report HEALTHY status and service telemetry', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.service).toContain('TrustNest');
  });

  it('2. POST /api/v1/auth/register - should create a new verified user account with hashed password', async () => {
    const testEmail = `newuser_${Date.now()}@trustnest.in`;
    const res = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      password: 'ComplexPassword@2026',
      name: 'Rohan Sharma',
      phone: '+91 98888 11111',
      role: 'USER'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.token).toBeDefined();
    buyerToken = res.body.data.token;
  });

  it('3. POST /api/v1/auth/login - should authenticate existing admin and return JWT token', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@trustnest.in',
      password: 'TrustNest@2026'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.token;
  });

  it('4. GET /api/v1/auth/me - should return authenticated user profile using Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Rohan Sharma');
  });

  it('5. GET /api/v1/listings - should return database listings with pagination and trust scores', async () => {
    const res = await request(app).get('/api/v1/listings?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].trustScore).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThan(50);
  });

  it('6. POST /api/v1/listings - should create a new listing with server-authoritative trust calculation', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        title: '3 BHK Sea Breeze Penthouse Sector 150',
        description: 'Exquisite verified penthouse with verified OC and registry completed.',
        categorySlug: 'property',
        categoryName: 'Real Estate',
        price: 18500000,
        attributes: {
          bhk: '3 BHK',
          propertyType: 'Apartment',
          area: 2450
        },
        location: {
          address: 'Sector 150 Express Highway',
          locality: 'Sector 150',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201310',
          lat: 28.5123,
          lng: 77.4521,
          verifiedCoords: true
        },
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.trustScore.overallScore).toBeGreaterThanOrEqual(80);
    createdListingId = res.body.data.id;
  });

  it('7. POST /api/v1/leads - should capture buyer contact intent and persist lead', async () => {
    const res = await request(app).post('/api/v1/leads').send({
      listingId: createdListingId,
      buyerName: 'Vikram Joshi',
      buyerPhone: '+91 99887 76655',
      buyerEmail: 'vikram@example.com',
      message: 'Interested in scheduling a site viewing this weekend.',
      channel: 'CHAT'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.buyerName).toBe('Vikram Joshi');
    expect(res.body.data.status).toBe('NEW');
  });

  it('8. POST /api/v1/messages/conversations - should initiate a persistent conversation', async () => {
    const res = await request(app)
      .post('/api/v1/messages/conversations')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        listingId: createdListingId,
        text: 'Hello, is the price slightly negotiable for immediate registry?'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversationId).toBeDefined();
    conversationId = res.body.data.conversationId;
  });

  it('9. Security Check: GET /api/v1/admin/moderation - should forbid non-admin/moderator users (403)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/moderation')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('10. POST /api/v1/admin/moderation/decide - should allow admin to approve listing and log to append-only audit trail', async () => {
    const res = await request(app)
      .post('/api/v1/admin/moderation/decide')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        listingId: createdListingId,
        decision: 'APPROVE',
        reason: 'Passed complete title deed audit and physical GPS confirmation.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PUBLISHED');

    // Verify audit logs
    const auditRes = await request(app)
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(auditRes.status).toBe(200);
    expect(auditRes.body.data.length).toBeGreaterThan(0);
    expect(auditRes.body.data[0].action).toContain('STATUS_CHANGED');
  });
});
