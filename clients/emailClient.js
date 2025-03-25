import nodemailer from 'nodemailer';

class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_SERVER,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        this.mailFrom = process.env.MAIL_FROM;
        this.schema = process.env.SCHEMA || 'http';
        this.domain = process.env.DOMAIN_NAME || 'localhost:3000';
    }

    async sendConfirmationEmail(recipientEmail, confirmationToken) {
        const confirmationLink = `${this.schema}://${this.domain}/api/auth/verify/${confirmationToken}`;

        const mailOptions = {
            from: this.mailFrom,
            to: recipientEmail,
            subject: 'Please confirm your email',
            html: `
        <h3>Email Confirmation</h3>
        <p>Click the link below to confirm your email address:</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Confirmation email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw error;
        }
    }
}

const emailSender = new EmailSender();
export default emailSender;
