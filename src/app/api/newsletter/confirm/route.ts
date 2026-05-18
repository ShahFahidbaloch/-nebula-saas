import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function addToBeehiiv(email: string) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) return;

  await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      reactivate_existing: false,
      send_welcome_email: false,
      utm_source: "nebula-website",
      utm_medium: "organic",
    }),
  });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE}/confirm?error=missing-token`);
  }

  const { data: subscriber } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, status")
    .eq("token", token)
    .maybeSingle();

  if (!subscriber) {
    return NextResponse.redirect(`${BASE}/confirm?error=invalid-token`);
  }

  if (subscriber.status === "confirmed") {
    return NextResponse.redirect(`${BASE}/confirm?already=true`);
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", subscriber.id);

  if (error) {
    console.error("Confirmation update error:", error);
    return NextResponse.redirect(`${BASE}/confirm?error=server`);
  }

  // Sync to Beehiiv in the background — don't block redirect
  addToBeehiiv(subscriber.email).catch((err) =>
    console.error("Beehiiv sync error:", err)
  );

  return NextResponse.redirect(`${BASE}/confirm?success=true`);
}
