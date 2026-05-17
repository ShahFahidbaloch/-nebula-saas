"use client";

import { useEffect, useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ??
  "10000000-ffff-ffff-ffff-000000000001";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return null;
}

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pendingSubmitRef = useRef(false);

  const handleBlur = () => setEmailError(validateEmail(email));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };

  const onCaptchaVerify = async (token: string) => {
    if (!pendingSubmitRef.current) return;
    pendingSubmitRef.current = false;

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken: token }),
      });
      const data = await res.json() as { message?: string; error?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
      } else {
        toast.success(data.message ?? "Check your inbox!");
        setEmail("");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
      captchaRef.current?.resetCaptcha();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setLoading(true);
    pendingSubmitRef.current = true;
    captchaRef.current?.execute();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-full glass p-1.5 transition ${
          emailError ? "ring-1 ring-rose-500/50" : ""
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your email address"
          disabled={loading}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          data-cursor="subscribe"
          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:shadow-glow disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {emailError && (
        <p className="mt-2 px-4 text-xs text-rose-400">{emailError}</p>
      )}

      {/* Mounted gate prevents SSR/client hydration mismatch */}
      {mounted && <HCaptcha
        ref={captchaRef}
        sitekey={SITE_KEY}
        size="invisible"
        theme="dark"
        onVerify={onCaptchaVerify}
        onError={() => {
          setLoading(false);
          pendingSubmitRef.current = false;
          toast.error("Captcha error. Please try again.");
        }}
        onExpire={() => {
          setLoading(false);
          pendingSubmitRef.current = false;
        }}
      />}
    </form>
  );
}
