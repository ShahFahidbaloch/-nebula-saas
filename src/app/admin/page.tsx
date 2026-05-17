import { Suspense } from "react";
import { supabase, type Subscriber, type ContactSubmission } from "@/lib/supabase";
import AdminTabs from "./AdminTabs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Nebula" };

interface Props {
  searchParams: Promise<{ tab?: string; q?: string }>;
}

async function getSubscribers(q: string): Promise<Subscriber[]> {
  let query = supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q) query = query.ilike("email", `%${q}%`);

  const { data } = await query;
  return (data as Subscriber[]) ?? [];
}

async function getContacts(q: string): Promise<ContactSubmission[]> {
  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q) {
    query = query.or(
      `email.ilike.%${q}%,name.ilike.%${q}%,subject.ilike.%${q}%`
    );
  }

  const { data } = await query;
  return (data as ContactSubmission[]) ?? [];
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const tab = params.tab === "contacts" ? "contacts" : "subscribers";
  const q = params.q ?? "";

  const [subscribers, contacts] = await Promise.all([
    getSubscribers(q),
    getContacts(q),
  ]);

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="border-b border-white/5 bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-cyan">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-semibold tracking-tight">Nebula Admin</span>
          <span className="ml-auto text-xs text-white/30">
            Protected · {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">
              {subscribers.filter((s) => s.status === "confirmed").length} confirmed subscribers ·{" "}
              {contacts.filter((c) => c.status === "unread").length} unread messages
            </p>
          </div>
        </div>

        <Suspense>
          <AdminTabs
            subscribers={subscribers}
            contacts={contacts}
            activeTab={tab}
            query={q}
          />
        </Suspense>
      </div>
    </main>
  );
}
