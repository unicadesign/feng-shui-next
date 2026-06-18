// Pure functions returning { subject, html } for each transactional email.
// Add new templates here as features grow (course purchase, week unlocked, …).

const BRAND = 'Dragana Jović';
const ACCENT = '#1f3a5f'; // navy-ish, matches site palette

function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="sr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f6f1ea;font-family:Helvetica,Arial,sans-serif;color:#2b2b2b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #e8ddcc;">
        <tr><td style="padding:28px 36px;border-bottom:1px solid #efe6d6;">
          <span style="font-size:20px;font-weight:700;color:${ACCENT};">${BRAND}</span>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#2b2b2b;">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #efe6d6;font-size:12px;color:#8a8175;">
          ${BRAND} · Feng Shui konsalting i edukacija
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Minimal HTML escape for user-provided strings inserted into the templates.
function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string),
  );
}

export function newsletterWelcome(): { subject: string; html: string } {
  return {
    subject: 'Dobrodošli — Dragana Jović Feng Shui',
    html: shell(
      'Hvala na prijavi!',
      `<p style="margin:0 0 14px;line-height:1.6;">Uspešno ste se prijavili na naš newsletter. Povremeno ćete dobijati savete o protoku energije, ritualima i usklađenom životu kroz Feng Shui.</p>
       <p style="margin:0;line-height:1.6;">Srdačno,<br>Dragana</p>`,
    ),
  };
}

export interface WebinarConfirmationData {
  fullName: string;
  startsAt?: string;
  zoomLink?: string;
}

export function webinarConfirmation(data: WebinarConfirmationData): { subject: string; html: string } {
  // Inlined to avoid pulling client/server boundary types into the email template.
  const formatted = (() => {
    if (!data.startsAt) return '';
    const d = new Date(data.startsAt);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const h = d.getHours();
    const m = d.getMinutes();
    const time = m === 0 ? `${h}h` : `${pad(h)}:${pad(m)}h`;
    return `${day}.${month}.${year} u ${time}`;
  })();
  const when = formatted
    ? `<p style="margin:0 0 14px;line-height:1.6;"><strong>Termin:</strong> ${formatted}</p>`
    : '';
  const link = (data.zoomLink || '').trim();
  const access = link
    ? `<p style="margin:0 0 14px;line-height:1.6;">Pristupite vebinaru klikom na dugme ispod. Ako dugme ne radi, kopirajte link ispod njega i otvorite ga u pretraživaču.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">
         <tr><td style="border-radius:9999px;background:${ACCENT};">
           <a href="${esc(link)}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 28px;color:#fffdf9;text-decoration:none;font-weight:600;font-size:14px;border-radius:9999px;">Pristupite vebinaru</a>
         </td></tr>
       </table>
       <p style="margin:0 0 14px;line-height:1.6;word-break:break-all;font-size:12px;color:#6b6258;"><a href="${esc(link)}" target="_blank" rel="noopener" style="color:#6b6258;">${esc(link)}</a></p>`
    : '';
  return {
    subject: 'Potvrda prijave na besplatan vebinar',
    html: shell(
      'Vaša prijava je primljena',
      `<p style="margin:0 0 14px;line-height:1.6;">Zdravo ${esc(data.fullName)},</p>
       <p style="margin:0 0 14px;line-height:1.6;">Hvala što ste se prijavili za besplatan Feng Shui vebinar. Vaše mesto je rezervisano.</p>
       ${when}
       ${access}
       <p style="margin:0;line-height:1.6;">Vidimo se uskoro,<br>Dragana</p>`,
    ),
  };
}
