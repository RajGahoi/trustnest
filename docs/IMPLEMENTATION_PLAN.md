# TrustNest — Implementation Plan & Autonomous Execution Roadmap

**Objective:** Transform TrustNest into a complete, verified, secure full-stack production application.

---

## Roadmap & Milestones

### Phase 1: Production Backend Architecture Setup
- [x] Configure server dependencies: `express`, `cors`, `helmet`, `bcryptjs`, `jsonwebtoken`, `multer`, `dotenv`.
- [x] Create modular backend layout under `server/` with TypeScript compilation.
- [x] Establish environment variable management (`.env`, `.env.example`).

### Phase 2: Relational Database & Data Integrity
- [x] Implement database manager with SQLite (`node:sqlite` or sqlite3) with PostgreSQL schema compatibility.
- [x] Create DDL migration runner and define all core tables (`users`, `sessions`, `categories`, `listings`, `listing_images`, `verification_documents`, `fraud_signals`, `trust_scores`, `leads`, `conversations`, `messages`, `favorites`, `audit_logs`, `vendor_organizations`).
- [x] Implement seed script importing the initial 143 verified listings, demo users with hashed passwords, categories, and initial vendor orgs.

### Phase 3: Authentication & Role-Based Authorization
- [x] Implement `AuthService` with registration, password hashing (bcrypt), login, session token generation (JWT).
- [x] Implement auth middleware: `authenticateToken`, `requireRole`, `requireCapability`.
- [x] Add user session tracking, password reset stubs, and account profile endpoints.

### Phase 4: Marketplace Core APIs
- [x] Category listing and attribute schema endpoints (`GET /api/v1/categories`).
- [x] Full-text and multi-faceted search with server-side pagination, sorting, and dynamic attribute filtering (`GET /api/v1/listings`).
- [x] Listing detail endpoint with seller information and verification status (`GET /api/v1/listings/:id_or_slug`).
- [x] Listing creation wizard endpoint with server validation, draft saving, and state transitions (`POST /api/v1/listings`, `PATCH /api/v1/listings/:id/status`).
- [x] Favorites toggle and list endpoints (`GET /api/v1/favorites`, `POST /api/v1/favorites/:listingId`).

### Phase 5: Authoritative Trust & Verification Engine
- [x] Server-side 5-dimension Trust Scoring engine (`calculateTrustScore`).
- [x] Automated fraud detection signals (duplicate photo checking, abnormal price deviations, frequency analysis).
- [x] Secure document upload endpoint with MIME validation and access control (`POST /api/v1/documents/upload`).
- [x] Reviewer verification workflow (`PATCH /api/v1/documents/:id/verify`).

### Phase 6: Messaging, Leads & Vendor Workflows
- [x] Persistent conversations and message history (`GET /api/v1/conversations`, `POST /api/v1/conversations/:id/messages`).
- [x] Lead capture pipeline (`POST /api/v1/leads`, `GET /api/v1/leads`).
- [x] Vendor organization metrics and team member management endpoints.

### Phase 7: Administration & Moderation Portal
- [x] Moderation queue (`GET /api/v1/admin/moderation/queue`).
- [x] Listing approval/rejection with mandatory audit trail logging (`POST /api/v1/admin/moderation/decide`).
- [x] Append-only audit logs endpoint (`GET /api/v1/admin/audit-logs`).
- [x] System health and database telemetry endpoint (`GET /api/v1/health`).

### Phase 8: Frontend Client Integration
- [x] Create unified typed API client (`src/services/api.ts`).
- [x] Wire authentication state into React app (replace localStorage role switcher with real login/register modal and authenticated user profile).
- [x] Connect Marketplace search, listing details, listing wizard, messaging, favorites, vendor dashboard, and admin portal to real backend endpoints.
- [x] Add graceful error states, loading spinners, and network reconnection handling.

### Phase 9: Automated Testing & Verification
- [x] Unit tests for trust scoring, state machine transitions, and password hashing.
- [x] Integration tests for authentication, listing creation, moderation workflow, and messaging.
- [x] Run lint, build, and automated test suite.
