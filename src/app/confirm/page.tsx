import Link from "next/link";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const metadata = { title: "Subscription Confirmed — Nebula" };

interface Props {
  searchParams: Promise<{ success?: string; already?: string; error?: string }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const params = await searchParams;
  const isSuccess = params.success === "true";
  const isAlready = params.already === "true";
  const isError = Boolean(params.error);

  const content = isSuccess
    ? {
        icon: <CheckCircle2 className="h-12 w-12 text-emerald-400" />,
        title: "You're in! 🎉",
        body: "Your email has been confirmed. Welcome to the Nebula community — you'll be the first to hear about new features and updates.",
      }
    : isAlready
    ? {
        icon: <CheckCircle2 className="h-12 w-12 text-brand-cyan" />,
        title: "Already confirmed",
        body: "This email is already confirmed. You're all set!",
      }
    : {
        icon: <XCircle className="h-12 w-12 text-rose-400" />,
        title: "Something went wrong",
        body:
          params.error === "invalid-token"
            ? "This confirmation link is invalid or has already been used."
            : params.error === "missing-token"
            ? "No confirmation token found in this link."
            : "An error occurred confirming your subscription. Please try again or contact support.",
      };

  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-glow opacity-50" />

      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-violet via-brand-blue to-brand-cyan">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Nebula
          </span>
        </Link>

        <div className="glass gradient-border rounded-3xl p-10">
          <div className="flex justify-center mb-6">{content.icon}</div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            {content.title}
          </h1>
          <p className="text-sm leading-relaxed text-white/60 mb-8">
            {content.body}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to Nebula
          </Link>
        </div>
      </div>
    </main>
  );
}
