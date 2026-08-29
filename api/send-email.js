import { Resend } from "resend";

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: "One or more fields are too long." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const resend = new Resend(RESEND_API_KEY);

  const receivedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `New portfolio message\n\nFrom: ${name} <${email}>\nReceived: ${receivedAt} IST\n\n${message}\n\n— Sent from prajjwal-rajput.dev`,
      html: renderEmail({ name, email, message, receivedAt }),
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "Failed to send email." });
    }

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

function renderEmail({ name, email, message, receivedAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const initial = escapeHtml(name.trim().charAt(0).toUpperCase() || "?");
  const preheader = `${name} sent you a message from your portfolio.`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>New portfolio message</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b0b10;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e6e7ec;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0b10;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:linear-gradient(180deg,#14141c 0%,#0f0f16 100%);border:1px solid #23232f;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #23232f;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8a8ba0;font-weight:600;">Portfolio Inbox</td>
                    <td align="right" style="font-size:12px;color:#8a8ba0;">${escapeHtml(receivedAt)} IST</td>
                  </tr>
                </table>
                <h1 style="margin:14px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">
                  New message from <span style="background:linear-gradient(90deg,#a78bfa,#60a5fa);-webkit-background-clip:text;background-clip:text;color:transparent;">${safeName}</span>
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="top" width="56" style="padding-right:16px;">
                      <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#ffffff;font-weight:700;font-size:18px;line-height:48px;text-align:center;">${initial}</div>
                    </td>
                    <td valign="top">
                      <div style="font-size:15px;color:#ffffff;font-weight:600;">${safeName}</div>
                      <a href="mailto:${safeEmail}" style="font-size:13px;color:#a78bfa;text-decoration:none;">${safeEmail}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 8px 32px;">
                <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8ba0;font-weight:600;margin-bottom:10px;">Message</div>
                <div style="background:#0b0b10;border:1px solid #23232f;border-radius:12px;padding:20px;font-size:15px;line-height:1.65;color:#e6e7ec;white-space:pre-wrap;word-break:break-word;">
                  ${safeMessage}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 32px 32px;" align="left">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius:10px;background:linear-gradient(135deg,#7c3aed,#3b82f6);">
                      <a href="mailto:${safeEmail}?subject=Re:%20your%20message%20on%20prajjwal-rajput.dev"
                         style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                        Reply to ${safeName}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px;border-top:1px solid #23232f;background:#0d0d14;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;color:#8a8ba0;">
                      Sent from
                      <a href="https://prajjwal-rajput.dev" style="color:#a78bfa;text-decoration:none;">prajjwal-rajput.dev</a>
                    </td>
                    <td align="right" style="font-size:12px;color:#8a8ba0;">
                      Auto-delivered via Resend
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin:18px 0 0;font-size:11px;color:#5c5d70;">
            You're receiving this because someone submitted the contact form on your portfolio.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

