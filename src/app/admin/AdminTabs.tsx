"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, Mail, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subscriber, ContactSubmission } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
    pending:   "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    unsubscribed: "bg-white/5 text-white/40 ring-white/10",
    unread:    "bg-brand-violet/15 text-brand-violet ring-brand-violet/20",
    read:      "bg-white/5 text-white/40 ring-white/10",
    replied:   "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        styles[status] ?? "bg-white/5 text-white/40 ring-white/10"
      )}
    >
      {status}
    </span>
  );
}

interface Props {
  subscribers: Subscriber[];
  contacts: ContactSubmission[];
  activeTab: "subscribers" | "contacts";
  query: string;
}

export default function AdminTabs({ subscribers, contacts, activeTab, query }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const navigate = useCallback(
    (tab: string, q?: string) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (q) params.set("q", q);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname]
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit mb-6">
        {(["subscribers", "contacts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => navigate(t, query)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition",
              activeTab === t
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white"
            )}
          >
            {t === "subscribers" ? (
              <Mail className="h-3.5 w-3.5" />
            ) : (
              <MessageSquare className="h-3.5 w-3.5" />
            )}
            {t === "subscribers" ? "Subscribers" : "Messages"}
            <span className="text-xs opacity-50">
              {t === "subscribers" ? subscribers.length : contacts.length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="search"
          placeholder={
            activeTab === "subscribers"
              ? "Search by email…"
              : "Search by name, email, subject…"
          }
          defaultValue={query}
          onChange={(e) => navigate(activeTab, e.target.value)}
          className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 transition"
        />
      </div>

      {/* Subscribers table */}
      {activeTab === "subscribers" && (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] border-b border-white/5">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium">Email</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium">Status</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium hidden md:table-cell">Source</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium hidden lg:table-cell">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Signed up</span>
                </th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium hidden lg:table-cell">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4 text-white/80 font-mono text-xs">{s.email}</td>
                    <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-4 text-white/40 hidden md:table-cell">{s.source}</td>
                    <td className="px-5 py-4 text-white/40 hidden lg:table-cell whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-5 py-4 text-white/40 hidden lg:table-cell whitespace-nowrap">
                      {s.confirmed_at ? formatDate(s.confirmed_at) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contacts table */}
      {activeTab === "contacts" && (
        <div className="rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] border-b border-white/5">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium">From</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium">Subject</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium hidden md:table-cell">Preview</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium">Status</th>
                <th className="px-5 py-3.5 text-left text-xs text-white/40 font-medium hidden lg:table-cell">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Received</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">
                    No messages found
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <div className="text-white/80 text-xs">{c.name}</div>
                      <div className="text-white/40 text-[11px] font-mono">{c.email}</div>
                    </td>
                    <td className="px-5 py-4 text-white/70 max-w-[200px] truncate">{c.subject}</td>
                    <td className="px-5 py-4 text-white/40 text-xs max-w-[260px] truncate hidden md:table-cell">
                      {c.message}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4 text-white/40 hidden lg:table-cell whitespace-nowrap">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
