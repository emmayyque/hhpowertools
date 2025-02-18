const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport(
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.NM_USER,
            pass: process.env.NM_APP_PASS,
        }
    }
)

const sendMail = (to, subject, message) => {
    transporter.sendMail({
        to: to,
        subject: subject,
        html: message
    })
}


module.exports = sendMail