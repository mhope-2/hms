const nodemailer = require('nodemailer')
import express from 'express'
import EmailDto from '../dtos/email.dto'

const transport = {

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // use TLS
    
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        password: process.env.SMTP_USER_PASSWORD,
    },
    }
    
const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
    if (error) {
    //if error happened code ends here
        console.error(error)
    } else {
        //this means success
        console.log('Ready to send mail!')
}
})
        
const sendMail = (mailPayload: EmailDto) => {
        
    const mail = {
        from: process.env.SMTP_FROM_EMAIL,
        to: mailPayload.recipientEmail,
        subject: `${mailPayload.subject}`,
        text: `
            from:
            ${mailPayload.senderEmail}
    
            contact details
            email: ${mailPayload.recipientEmail}
            phone: ${mailPayload.recipientPhone}
    
            message:
            ${mailPayload.mailContent}`,
        }

        transporter.sendMail(mail, (err, data) => {
            if (err) {
                return 'failed';
            } else {
                return 'success'
            }
        })
}

export default sendMail