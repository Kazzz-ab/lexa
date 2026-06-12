import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = 'Lexa <noreply@lexa.legal>';

export async function sendPasswordReset(to, resetUrl) {
  if (!resend) {
    console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your Lexa password',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#4C1D95">Reset your password</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4C1D95,#7C3AED);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;border:1px solid rgba(139,92,246,0.4)">
          Reset Password
        </a>
        <p style="color:#6B6B7B;font-size:0.85rem;font-style:italic">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
