# TrustNest — Verified Marketplace & Trust Engine

TrustNest is an evidence-backed, high-integrity marketplace application. Unlike conventional classifieds where listings are unvetted, TrustNest enforces an authoritative 5-dimension verification pipeline (Identity, Documents, Location, Media, and Fraud Risk) before listings are promoted.

---

## 1. Quick Start

### Prerequisites
- Node.js v22+ or v24+
- npm v10+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Seed database (creates relational tables and imports 140+ verified listings & test users)
npm run server:seed

# 3. Start full-stack environment (Express API on port 4000 + Vite Frontend on port 5173)
npm run dev
```

Visit the application in your browser at:
- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:4000`
- **API Health Check:** `http://localhost:4000/api/v1/health`

---

## 2. Default Test Accounts

All pre-seeded test accounts use the password: `TrustNest@2026`

| Persona / Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Platform Administrator** | `admin@trustnest.in` | `TrustNest@2026` | Full platform control, audit logs, system telemetry, schemas |
| **Trust Moderator** | `moderator@trustnest.in` | `TrustNest@2026` | Moderation queue, approve/reject listings, verify documents |
| **Verified Seller** | `seller@trustnest.in` | `TrustNest@2026` | Post verified listings, review enquiries, manage inventory |
| **Vendor Organization Admin** | `vendor@trustnest.in` | `TrustNest@2026` | Manage team members, lead pipeline, enterprise subscriptions |
| **Verified Buyer** | `buyer@trustnest.in` | `TrustNest@2026` | Save favorites, contact sellers, initiate persistent chat |

*Note: You can also use the 1-Click Authenticated Persona Switcher in the top-right corner of the application to switch roles instantly with genuine signed JWT sessions.*

---

## 3. Architecture & Tech Stack

```
Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion)
                          │ (HTTPS / JSON / Bearer JWT)
                          ▼
API Gateway (Node.js 24 + Express + Helmet + CORS + RateLimiter)
                          │
Application Services (Auth, Trust Engine, Listing State Machine, Messaging, Leads)
                          │
Relational Database (SQLite via built-in node:sqlite with PostgreSQL driver compatibility)
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide icons.
- **Backend API:** Node.js Express modular REST API, Bcrypt password hashing, JWT session tokens, Multer document uploads with MIME validation.
- **Authoritative Trust Engine:** Server-authoritative 5-dimension scoring (Identity 20pts, Documents 20pts, Location 20pts, Media 20pts, Fraud Risk 20pts).
- **Relational Integrity:** Foreign keys, ACID transactions, and append-only audit trail logs.
- **DevOps & Containers:** Dockerfile and `docker-compose.yml` included.

---

## 4. Documentation Index

Comprehensive technical documentation is maintained under the `docs/` directory:
- [Implementation & Forensics Audit](docs/IMPLEMENTATION_AUDIT.md)
- [Production Architecture](docs/ARCHITECTURE.md)
- [Feature Implementation Matrix](docs/FEATURE_MATRIX.md)
- [Security Audit & Hardening Report](docs/SECURITY_AUDIT.md)
- [Implementation & Autonomous Execution Roadmap](docs/IMPLEMENTATION_PLAN.md)

---

## 5. Automated Testing

Run the test suite covering unit tests and full end-to-end integration workflows:
```bash
# Run all Vitest unit and API integration tests
npm test

# Run code linter
npm run lint

# Validate listing data integrity
npm run validate:data

# Production build verification
npm run build
```

---

## 6. API Reference Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health and telemetry probe | No |
| `POST` | `/api/v1/auth/register` | Create a new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/v1/auth/me` | Current authenticated user profile | Yes |
| `GET` | `/api/v1/listings` | Search and filter listings with pagination | No |
| `GET` | `/api/v1/listings/cities` | Data-driven city counts | No |
| `GET` | `/api/v1/listings/:idOrSlug` | Detailed listing data with trust breakdown | No |
| `POST` | `/api/v1/listings` | Create listing with server trust evaluation | Yes |
| `POST` | `/api/v1/listings/:id/favorite` | Toggle favorite state | Yes |
| `POST` | `/api/v1/leads` | Capture buyer contact intent | Optional |
| `GET` | `/api/v1/messages/conversations` | Persistent user conversations | Yes |
| `POST` | `/api/v1/messages/conversations/:id/messages` | Send message | Yes |
| `GET` | `/api/v1/admin/moderation` | Moderation queue for pending listings | Moderator / Admin |
| `POST` | `/api/v1/admin/moderation/decide` | Approve or reject listing with audit log | Moderator / Admin |
| `GET` | `/api/v1/admin/audit-logs` | Append-only audit trail logs | Admin |
