import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE}/confirm?error=missing-token`);
  }

  const { data: subscriber } = await supabase
    .from("newsletter_subscribers")
    .select("id, status")
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

  return NextResponse.redirect(`${BASE}/confirm?success=true`);
}
