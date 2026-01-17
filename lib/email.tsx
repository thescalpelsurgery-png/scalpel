import nodemailer from 'nodemailer';
import { emailTemplates } from './email-templates';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Zoho 535 errors can sometimes be caused by SSL handshake issues
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    // Check if essential SMTP config is present
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[Email] SMTP credentials not configured. Skipping email sending.");
      return false;
    }

    const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || '587';

    console.log(`[Email] Attempting to send email via ${host}:${port} as ${process.env.SMTP_USER}`);

    const info = await transporter.sendMail({
      from: `"Scalpel" <${fromEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });

    console.log("[Email] Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email via Nodemailer:", error);
    return false;
  }
}

export { emailTemplates };
