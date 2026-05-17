import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only initialised when first used (not at build time).
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// Convenience proxy — behaves exactly like the old `supabase` export.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

export type Subscriber = {
  id: string;
  email: string;
  status: "pending" | "confirmed" | "unsubscribed";
  source: string;
  created_at: string;
  confirmed_at: string | null;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
};
