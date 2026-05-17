"use client";

import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ??
  "10000000-ffff-ffff-ffff-000000000001";

// ── Validation rules ──────────────────────────────────────────────────────────
type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validateField(field: keyof Fields, value: string): string | null {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return null;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return null;
    case "subject":
      if (!value.trim()) return "Subject is required";
      if (value.trim().length < 5) return "Subject must be at least 5 characters";
      return null;
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 20) return "Message must be at least 20 characters";
      return null;
    default:
      return null;
  }
}

function validateAll(fields: Fields): Errors {
  const errors: Errors = {};
  (Object.keys(fields) as (keyof Fields)[]).forEach((k) => {
    const err = validateField(k, fields[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-white/25 focus:bg-white/[0.06]";

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, value) ?? undefined }));
    }
  };

  const blur = (key: keyof Fields) => () => {
    const err = validateField(key, fields[key]);
    setErrors((prev) => ({ ...prev, [key]: err ?? undefined }));
  };

  const submit = async (token: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, captchaToken: token }),
      });
      const data = await res.json() as { message?: string; error?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
      } else {
        toast.success(data.message ?? "Message sent!");
        setFields({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setCaptchaToken(null);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
      captchaRef.current?.resetCaptcha();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAll(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    if (captchaToken) {
      await submit(captchaToken);
    } else {
      // Trigger hCaptcha — submit happens in onVerify
      captchaRef.current?.execute();
    }
  };

  const onVerify = async (token: string) => {
    setCaptchaToken(token);
    // Only auto-submit if loading (i.e., form was submitted and captcha was pending)
    if (loading) {
      await submit(token);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            value={fields.name}
            onChange={set("name")}
            onBlur={blur("name")}
            placeholder="Your name"
            disabled={loading}
            className={cn(inputBase, errors.name && "border-rose-500/50 focus:border-rose-500/50")}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={fields.email}
            onChange={set("email")}
            onBlur={blur("email")}
            placeholder="you@example.com"
            disabled={loading}
            className={cn(inputBase, errors.email && "border-rose-500/50 focus:border-rose-500/50")}
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject}>
        <input
          type="text"
          value={fields.subject}
          onChange={set("subject")}
          onBlur={blur("subject")}
          placeholder="What's this about?"
          disabled={loading}
          className={cn(inputBase, errors.subject && "border-rose-500/50 focus:border-rose-500/50")}
        />
      </Field>

      <Field label="Message" error={errors.message}>
        <textarea
          rows={5}
          value={fields.message}
          onChange={set("message")}
          onBlur={blur("message")}
          placeholder="Tell us what's on your mind…"
          disabled={loading}
          className={cn(
            inputBase,
            "resize-none",
            errors.message && "border-rose-500/50 focus:border-rose-500/50"
          )}
        />
        <div className="mt-1 text-right text-[11px] text-white/25">
          {fields.message.length}/5000
        </div>
      </Field>

      {/* Mounted gate prevents SSR/client hydration mismatch */}
      {mounted && <HCaptcha
        ref={captchaRef}
        sitekey={SITE_KEY}
        size="invisible"
        theme="dark"
        onVerify={onVerify}
        onError={() => {
          setLoading(false);
          toast.error("Captcha error. Please try again.");
        }}
        onExpire={() => {
          setCaptchaToken(null);
          setLoading(false);
        }}
      />}

      <button
        type="submit"
        disabled={loading}
        data-cursor="send"
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 shadow-glow"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
