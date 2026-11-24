import nodemailer from 'nodemailer';
import { siteConfig } from '@/config/site';

export interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  isWhatsApp: boolean;
  company?: string;
  interestedService: string;
  budget: string;
  message?: string;
  source: string;
  calculatorDetails?: any;
}

export async function sendLeadNotification(lead: LeadData): Promise<{
  success: boolean;
  message?: string;
}> {
  const recipient = siteConfig.emails.contact; // vishamanofficial.business@gmail.com
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || recipient;

  if (!gmailPass) {
    console.warn('[Mailer] GMAIL_APP_PASSWORD is not set. Skipping SMTP dispatch.');
    return { success: false, message: 'SMTP not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 1.5px;">New Project Lead</span>
          <h1 style="font-size: 22px; font-weight: 800; margin: 4px 0 0; color: #0f172a;">${siteConfig.name} Inbound Inquiry</h1>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 35%;">Client Name</td>
            <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${lead.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address</td>
            <td style="padding: 10px 0;"><a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${lead.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone Number</td>
            <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">
              <a href="tel:${lead.phone}" style="color: #0f172a; text-decoration: none;">${lead.phone}</a>
              ${lead.isWhatsApp ? '<span style="margin-left: 8px; font-size: 11px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 700;">WhatsApp</span>' : ''}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Service Interested</td>
            <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${lead.interestedService}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Budget / Est. Scope</td>
            <td style="padding: 10px 0; font-weight: 700; color: #059669;">${lead.budget}</td>
          </tr>
          ${lead.company ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Company</td>
            <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${lead.company}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Inquiry Source</td>
            <td style="padding: 10px 0; font-weight: 600; color: #64748b;">${lead.source}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Project Brief</td>
            <td style="padding: 10px 0; color: #334155; line-height: 1.5;">${lead.message || 'No additional notes'}</td>
          </tr>
          ${lead.calculatorDetails ? `
          <tr>
            <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Calculator Specs</td>
            <td style="padding: 10px 0;">
              <pre style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 12px; color: #334155; overflow-x: auto;">${JSON.stringify(lead.calculatorDetails, null, 2)}</pre>
            </td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}" style="background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block;">
            💬 Open WhatsApp Chat (${siteConfig.phone})
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${lead.fullName} (${siteConfig.name})" <${gmailUser}>`,
      to: recipient,
      replyTo: lead.email,
      subject: `[Lead Alert - ${siteConfig.name}] ${lead.fullName} (${lead.interestedService} - ${lead.budget})`,
      html: htmlBody,
    });

    console.log('[Mailer] Nodemailer sent lead email to', recipient);
    return { success: true };
  } catch (err: any) {
    console.error('[Mailer] Nodemailer dispatch error:', err.message);
    return { success: false, message: err.message };
  }
}
