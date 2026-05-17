import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { verifyHCaptcha } from "@/lib/captcha";
import { sendConfirmationEmail } from "@/lib/resend";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  captchaToken: z.string().min(1, "Captcha required"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 422 }
    );
  }

  const { email, captchaToken } = parsed.data;

  // Verify hCaptcha
  let captchaOk: boolean;
  try {
    captchaOk = await verifyHCaptcha(captchaToken);
  } catch {
    return NextResponse.json(
      { error: "Captcha verification failed" },
      { status: 500 }
    );
  }
  if (!captchaOk) {
    return NextResponse.json(
      { error: "Captcha verification failed. Please try again." },
      { status: 422 }
    );
  }

  // Check for existing subscriber
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, status, token")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.status === "confirmed") {
      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      );
    }
    // Pending: resend confirmation
    if (existing.status === "pending") {
      await sendConfirmationEmail(email, existing.token);
      return NextResponse.json(
        { message: "Confirmation email resent. Check your inbox." },
        { status: 200 }
      );
    }
  }

  // Insert new subscriber
  const { data: inserted, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: "footer" })
    .select("token")
    .single();

  if (error || !inserted) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription. Please try again." },
      { status: 500 }
    );
  }

  // Send confirmation email
  try {
    await sendConfirmationEmail(email, inserted.token);
  } catch (err) {
    console.error("Resend error:", err);
    // Don't fail the request — subscriber is saved, email failed
  }

  return NextResponse.json(
    { message: "Check your inbox to confirm your subscription!" },
    { status: 201 }
  );
}
