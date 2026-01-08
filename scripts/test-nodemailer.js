require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Nodemailer Test ---');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('Error: SMTP_USER or SMTP_PASS not found in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Scalpel Test" <${process.env.EMAIL_FROM || 'noreply@scalpel.org'}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'Nodemailer Test Email - Scalpel',
            text: 'If you receive this, your SMTP configuration for Scalpel is working perfectly!',
            html: '<b>If you receive this, your SMTP configuration for Scalpel is working perfectly!</b>',
        });

        console.log('Success! Message ID:', info.messageId);
    } catch (error) {
        console.error('Failed to send test email:', error);
    }
}

testEmail();
