import { Resend } from "resend";

// Lazy singleton — avoids throwing at module load / build time.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  _resend = new Resend(key);
  return _resend;
}

const FROM = `${process.env.RESEND_FROM_NAME ?? "Nebula"} <${process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`;
const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function sendConfirmationEmail(to: string, token: string) {
  const confirmUrl = `${BASE}/api/newsletter/confirm?token=${token}`;
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Confirm your Nebula subscription",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#05060a;font-family:'Plus Jakarta Sans',sans-serif;color:#fff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0c14;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
        <tr>
          <td style="padding:48px 48px 32px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
              <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#3b82f6,#22d3ee);display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:18px;">✦</span>
              </div>
              <span style="font-size:18px;font-weight:600;color:#fff;">Nebula</span>
            </div>
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#fff;line-height:1.2;">
              Confirm your subscription
            </h1>
            <p style="margin:0 0 32px;font-size:16px;color:rgba(255,255,255,0.6);line-height:1.6;">
              You're one click away from joining 12,000+ makers building the next era of software with Nebula. Click below to confirm your email address.
            </p>
            <a href="${confirmUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#22d3ee);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:100px;">
              Confirm subscription →
            </a>
            <p style="margin:32px 0 0;font-size:13px;color:rgba(255,255,255,0.3);line-height:1.6;">
              If you didn't request this, you can safely ignore this email. The link expires in 7 days.
              <br>
              Or copy this URL: <a href="${confirmUrl}" style="color:rgba(255,255,255,0.4);">${confirmUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
              © ${new Date().getFullYear()} Nebula Inc. · You're receiving this because you signed up at nebula.io
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendContactAutoReply(
  to: string,
  name: string,
  subject: string
) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `We got your message — ${subject}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#05060a;font-family:'Plus Jakarta Sans',sans-serif;color:#fff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0c14;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
        <tr>
          <td style="padding:48px 48px 32px;">
            <div style="margin-bottom:32px;">
              <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#3b82f6,#22d3ee);display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:18px;">✦</span>
              </div>
            </div>
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#fff;">
              Got it, ${name} 👋
            </h1>
            <p style="margin:0 0 16px;font-size:16px;color:rgba(255,255,255,0.6);line-height:1.6;">
              Thanks for reaching out. We've received your message about <strong style="color:rgba(255,255,255,0.8);">"${subject}"</strong> and we'll get back to you within 24 hours.
            </p>
            <p style="margin:0 0 32px;font-size:16px;color:rgba(255,255,255,0.6);line-height:1.6;">
              In the meantime, check out our <a href="${BASE}#features" style="color:#7c3aed;">features</a> or explore our <a href="${BASE}#pricing" style="color:#7c3aed;">pricing plans</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
              © ${new Date().getFullYear()} Nebula Inc.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

export async function sendAdminContactNotification(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail) return;
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[Nebula] New contact: ${opts.subject}`,
    html: `
<p><strong>From:</strong> ${opts.name} &lt;${opts.email}&gt;</p>
<p><strong>Subject:</strong> ${opts.subject}</p>
<hr>
<p style="white-space:pre-wrap">${opts.message}</p>
<hr>
<p><a href="${BASE}/admin">View in admin →</a></p>`,
  });
}
