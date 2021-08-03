// const nodemailer = require('nodemailer')

// const sendMail = () => {

// }

// const transport = {
    
// host: process.env.EMAIL_HOST,
// port: process.env.EMAIL_PORT,
// secure: true, // use TLS

// auth: {
//     user: process.env.SMTP_USER_EMAIL,
//     password: process.env.SMTP_USER_PASSWORD,
// },
// }

// const transporter = nodemailer.createTransport(transport)
//     transporter.verify((error, success) => {
//     if (error) {
//     //if error happened code ends here
//         console.error(error)
//     } else {
//         //this means success
//         console.log('Ready to send mail!')
// }
// })


// const mail = {
//     from: process.env.SMTP_FROM_EMAIL,
//     to: process.env.SMTP_TO_EMAIL,
//     subject: 'New Contact Form Submission',
//     text: `
//       from:
//       ${req.body.name}

//       contact details
//       email: ${req.body.email}
//       phone: ${req.body.tel}

//       message:
//       ${req.body.message}`,
//     }
//     transporter.sendMail(mail, (err, data) => {
//         if (err) {
//             res.json({
//                 status: 'fail',
//             })
//         } else {
//             res.json({
//                 status: 'success',
//             })
//         }
//     })