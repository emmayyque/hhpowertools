const nodemailer = require('nodemailer')
require('dotenv').config()

console.log("SMTP Config:", process.env.NM_HOST, process.env.NM_PORT, process.env.NM_USER);

const transporter = nodemailer.createTransport(
    {
        secure: true,
        host: process.env.NM_HOST,
        port: process.env.NM_PORT,
        auth: {
            user: process.env.NM_USER,
            pass: process.env.NM_APP_PASS,
        }
    }
)

const sendMail = async (to, subject, message) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.NM_USER, // Ensure 'from' is set
            to: to,
            subject: subject,
            html: message
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


module.exports = sendMail