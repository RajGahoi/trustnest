# TrustNest — Production Architecture Specification

**Architecture Version:** 2.0.0-PROD  
**Status:** Approved & Implemented  
**Lead Architect:** Principal Software Architect  

---

## 1. Architectural Philosophy

TrustNest is architected as an **evidence-driven marketplace platform** where listings are verified prior to publication. High visual appeal must be matched by rigorous backend security, deterministic trust scoring, auditable state machines, and relational data integrity.

```
+-----------------------------------------------------------------------+
|                             CLIENT TIER                               |
|   React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion      |
|   - Real-time API Client with typed contracts & auth state            |
|   - Client-side optimistic updates with server reconciliation         |
+-----------------------------------^-----------------------------------+
                                    | HTTPS / REST / WebSockets / JSON
+-----------------------------------v-----------------------------------+
|                           API GATEWAY TIER                            |
|   Express 4 + TypeScript Server                                       |
|   - Security Middlewares: Helmet, CORS, RateLimiter, RequestId        |
|   - Cookie & Bearer Session Auth Middleware                           |
|   - Schema Validation Middleware (Zod / Joi-like runtime checks)      |
+-----------------------------------^-----------------------------------+
                                    |
+-----------------------------------v-----------------------------------+
|                        APPLICATION SERVICES                           |
|   - AuthService (Registration, Bcrypt Password Hash, JWT Sessions)   |
|   - ListingService (State Machine: Draft -> Submitted -> Published)   |
|   - TrustEngineService (Authoritative 5-dimension scoring v2.1)       |
|   - FraudDetectionService (Perceptual hashing, price & anomaly checks)|
|   - DocumentService (Secure storage, mime validation, access control) |
|   - CommunicationService (Persistent messages, leads, notifications)  |
|   - AdminModerationService (Audited review queues & dispute decisions)|
+-----------------------------------^-----------------------------------+
                                    |
+-----------------------------------v-----------------------------------+
|                        DATA PERSISTENCE TIER                          |
|   SQLite (built-in node:sqlite, zero native compilation issues)       |
|   with PostgreSQL Driver compatibility for production clustering      |
|   - Relational foreign keys, ON DELETE CASCADE, CHECK constraints     |
|   - Multi-statement ACID Transactions                                 |
|   - Append-only Audit Logs                                            |
+-----------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
trustnest/
├── backend/                        # Modular Node.js / TypeScript Server
│   ├── src/
│   │   ├── config/                 # Environment and security configuration
│   │   ├── controllers/            # Request handlers
│   │   ├── db/                     # Database connection, schemas, migrations
│   │   │   ├── migrations/         # SQL DDL migrations
│   │   │   ├── connection.ts       # Database singleton
│   │   │   └── seed.ts             # Deterministic seed data loader
│   │   ├── middlewares/            # Auth, RBAC, RateLimit, Error handling
│   │   ├── routes/                 # Express API routes (/api/v1/...)
│   │   ├── services/               # Core business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── listing.service.ts
│   │   │   ├── trust.service.ts
│   │   │   ├── fraud.service.ts
│   │   │   ├── document.service.ts
│   │   │   ├── lead.service.ts
│   │   │   └── message.service.ts
│   │   ├── utils/                  # Cryptography, sanitize, formatting
│   │   └── index.ts                # Server entry point
│   └── tests/                      # Unit and integration tests
├── src/                            # Frontend React 19 Client
│   ├── app/                        # Pages (Home, Search, Listing, Post, etc.)
│   ├── components/                 # Reusable UI, Layout, Motion components
│   ├── domain/                     # Client domain helpers & shared contracts
│   ├── services/                   # Frontend API Client connecting to backend
│   └── types/                      # Shared domain types
├── docs/                           # Architecture, security, and audit documents
└── package.json
```

---

## 3. Data Model & Relational Integrity

### Entities
1. `users`: ID, email, password_hash, name, phone, role (`GUEST`, `USER`, `SELLER`, `VENDOR_AGENT`, `VENDOR_ADMIN`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`), avatar_url, verified_status, created_at, updated_at.
2. `sessions`: token_hash, user_id, expires_at, user_agent, ip_address, revoked_at.
3. `categories`: id, slug, name, icon, description, image, attribute_schema (JSON).
4. `listings`: id, slug, title, description, category_slug, price, price_period, location (JSON/columns), seller_id, status (`DRAFT`, `SUBMITTED`, `PENDING_REVIEW`, `APPROVED`, `PUBLISHED`, `PAUSED`, `EXPIRED`, `SOLD`, `REJECTED`, `SUSPENDED`, `ARCHIVED`), version, views_count, saves_count, leads_count, created_at, published_at.
5. `listing_images`: id, listing_id, url, sort_order, is_primary, phash, created_at.
6. `verification_documents`: id, listing_id, uploader_id, file_path, original_name, mime_type, file_size, document_type, status (`PENDING`, `VERIFIED`, `REJECTED`), reviewer_id, review_notes, created_at.
7. `trust_scores`: id, listing_id, overall_score, tier, identity_score, document_score, location_score, media_score, risk_score, breakdown_json, calculated_at.
8. `fraud_signals`: id, listing_id, signal_type, severity, description, detected_at.
9. `leads`: id, listing_id, buyer_id, buyer_name, buyer_phone, buyer_email, message, channel, status, created_at.
10. `conversations`: id, listing_id, buyer_id, seller_id, last_message_text, last_message_at, created_at.
11. `messages`: id, conversation_id, sender_id, text, is_read, created_at.
12. `favorites`: user_id, listing_id, created_at (Primary Key: `user_id`, `listing_id`).
13. `audit_logs`: id, actor_id, actor_name, actor_role, action, target_resource, details, ip_address, timestamp.

---

## 4. Trust & Fraud Architecture

The Trust Engine calculates a 0-100 score across 5 weighted dimensions (Max 20 points each):
1. **Identity (20 pts):** Verified phone, verified email, Aadhaar/PAN/Corporate GSTIN verification.
2. **Documents (20 pts):** Verified title deeds, registration certificates, utility bills, verified by certified moderator or automated OCR.
3. **Location (20 pts):** Reverse geocoded address matching postal locality and GPS radius verification.
4. **Media (20 pts):** Minimum image count, high resolution, clean EXIF metadata, absence of perceptual duplicates.
5. **Risk Evaluation (20 pts):** Baseline 20 minus penalty points for pricing anomalies, duplicate images, rapid listing spam, or user complaint flags.

Tier classification:
- **Platinum:** 94 - 100
- **Gold:** 88 - 93
- **Silver:** 80 - 87
- **Standard:** < 80
