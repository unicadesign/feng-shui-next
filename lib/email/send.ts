import { getResend, EMAIL_FROM } from './client';
import {
  newsletterWelcome,
  webinarConfirmation,
  type WebinarConfirmationData,
} from './templates';

type SendResult = { sent: boolean; error?: string };

async function send(to: string, subject: string, html: string): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing — skipping send to', to);
    return { sent: false, error: 'email_not_configured' };
  }
  try {
    const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
    if (error) {
      console.error('[email] Resend error:', error);
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] send threw:', err);
    return { sent: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function sendNewsletterWelcome(to: string): Promise<SendResult> {
  const { subject, html } = newsletterWelcome();
  return send(to, subject, html);
}

export async function sendWebinarConfirmation(
  to: string,
  data: WebinarConfirmationData,
): Promise<SendResult> {
  const { subject, html } = webinarConfirmation(data);
  return send(to, subject, html);
}
