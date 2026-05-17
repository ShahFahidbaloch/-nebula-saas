-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  source      TEXT NOT NULL DEFAULT 'footer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'unread'
               CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for admin search performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contact_submissions (created_at DESC);

-- Disable RLS on these tables (server-side only access via service_role key)
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
