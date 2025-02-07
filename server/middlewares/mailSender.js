const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'muhammadalikhalil@gmail.com',
            pass: 'uobprlxxhxjwnrfg'
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