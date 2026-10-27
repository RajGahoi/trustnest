export const DDL_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  avatar_url TEXT,
  verified_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  attributes_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  category_name TEXT NOT NULL,
  price REAL NOT NULL,
  formatted_price TEXT NOT NULL,
  price_period TEXT,
  address TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  verified_coords INTEGER NOT NULL DEFAULT 0,
  attributes_json TEXT NOT NULL DEFAULT '{}',
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_type TEXT NOT NULL DEFAULT 'OWNER',
  seller_avatar TEXT,
  seller_rating REAL NOT NULL DEFAULT 5.0,
  seller_verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  version INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_boosted INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  saves_count INTEGER NOT NULL DEFAULT 0,
  leads_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  published_at TEXT,
  expires_at TEXT,
  FOREIGN KEY (category_slug) REFERENCES categories (slug)
);

CREATE TABLE IF NOT EXISTS listing_images (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_documents (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  review_notes TEXT,
  uploaded_at TEXT NOT NULL,
  verified_at TEXT,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trust_scores (
  id TEXT PRIMARY KEY,
  listing_id TEXT UNIQUE NOT NULL,
  overall_score INTEGER NOT NULL,
  tier TEXT NOT NULL,
  badge_label TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  dimensions_json TEXT NOT NULL,
  calculated_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fraud_signals (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  detected_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  listing_title TEXT NOT NULL,
  buyer_id TEXT,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  listing_title TEXT NOT NULL,
  listing_image TEXT NOT NULL,
  listing_price TEXT NOT NULL,
  buyer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  last_message TEXT NOT NULL,
  last_message_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  text TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, listing_id),
  FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  business_type TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'PENDING',
  subscription_plan TEXT NOT NULL DEFAULT 'PRO',
  active_listings_count INTEGER NOT NULL DEFAULT 0,
  monthly_leads_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendor_members (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'AGENT',
  avatar TEXT,
  assigned_leads INTEGER NOT NULL DEFAULT 0,
  joined_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES vendor_organizations (id) ON DELETE CASCADE
);

-- Indexes for high-throughput searches and queries
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category_slug);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings (city);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings (price);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings (seller_id);
CREATE INDEX IF NOT EXISTS idx_leads_listing ON leads (listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs (timestamp);
`;
