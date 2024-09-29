require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendResetEmail(email, resetToken, request, subject, userName) {

    const baseUrl = `${request.protocol}://${request.get('host')}`;

    const resetLink = `${process.env.FRONT_END_BASE_URL}/forgot-password?token=${resetToken}`;

    let htmlTemplate = fs.readFileSync('template/emails/reset_password.html', 'utf8');

    // Replace the placeholder with the actual reset link
    htmlTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);
    htmlTemplate = htmlTemplate.replace('{{userName}}', userName);

    // Create the transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_EMAIL_USER,
            pass: process.env.SMTP_EMAIL_PASS
        }
    });

    // Mail options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlTemplate
    };

    // Send the email
    try {
        transporter.sendMail(mailOptions);
        console.log('Reset email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendResetEmail,
}