import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { verifyHCaptcha } from "@/lib/captcha";
import {
  sendContactAutoReply,
  sendAdminContactNotification,
} from "@/lib/resend";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message is too long"),
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

  const { name, email, subject, message, captchaToken } = parsed.data;

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

  const { error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject, message });

  if (error) {
    console.error("Supabase contact insert error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }

  // Fire emails in parallel — don't let email failure block the response
  await Promise.allSettled([
    sendContactAutoReply(email, name, subject),
    sendAdminContactNotification({ name, email, subject, message }),
  ]);

  return NextResponse.json(
    { message: "Message sent! We'll get back to you within 24 hours." },
    { status: 201 }
  );
}
