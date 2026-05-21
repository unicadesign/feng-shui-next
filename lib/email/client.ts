import { Resend } from 'resend';

// Sender is always fengshui@draganajovic.com — the domain must be verified in Resend.
export const EMAIL_FROM = 'Dragana Jović <fengshui@draganajovic.com>';

// Lazily instantiated so a missing key during build doesn't crash the app.
let _resend: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}
