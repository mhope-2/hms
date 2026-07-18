import EmailInterface from '../interfaces/email.interface'
const nodemailer = require('nodemailer')

class EmailService {
  private transporter: any

  // Lazy: env vars are loaded by dotenv in server.ts AFTER modules are imported,
  // so the transporter must not be built at import/construction time.
  private getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER_EMAIL,
          pass: process.env.SMTP_USER_PASSWORD,
        },
      })
    }
    return this.transporter
  }

  public async send(payload: EmailInterface): Promise<void> {
    await this.getTransporter().sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: payload.recipientEmail,
      subject: payload.subject,
      text: `
        from:
        ${payload.senderEmail}

        contact details
        email: ${payload.recipientEmail}
        phone: ${payload.recipientPhone}

        message:
        ${payload.mailContent}`,
    })
  }
}

export default EmailService
