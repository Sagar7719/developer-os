import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

/**
 * EmailService — Abstract Provider pattern isolating email dispatch transport.
 * Facilitates seamless migration between Gmail SMTP, Resend, SendGrid, or AWS SES.
 */
export class EmailService {
  constructor() {
    this.receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'admin@developer-os.dev';

    // SMTP Transport Configuration (Gmail / Generic SMTP)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  /**
   * Dispatch email notification to site admin upon new contact message submission.
   * @param {Object} payload - { name, email, subject, message, contactId }
   * @returns {Promise<boolean>}
   */
  async sendContactNotification({ name, email, subject, message, contactId }) {
    const mailOptions = {
      from: `"Developer OS Contact" <${process.env.SMTP_FROM || 'noreply@developer-os.dev'}>`,
      to: this.receiverEmail,
      subject: `[Developer OS Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2>New Contact Inquiry</h2>
          <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <h3>Message Payload:</h3>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>
          <hr />
          <p style="font-size: 12px; color: #64748b;">Contact Entry ID: ${contactId}</p>
        </div>
      `,
    };

    try {
      // Avoid throwing errors in development if SMTP credentials are missing
      if (!process.env.SMTP_USER && process.env.NODE_ENV !== 'production') {
        logger.info('[EmailService] SMTP credentials missing. Simulating email notification dispatch:', {
          to: this.receiverEmail,
          subject,
          sender: email,
        });
        return true;
      }

      await this.transporter.sendMail(mailOptions);
      logger.info('[EmailService] Notification email sent successfully', { to: this.receiverEmail, contactId });
      return true;
    } catch (error) {
      logger.error('[EmailService] Failed to send notification email:', { error: error.message, contactId });
      return false;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
