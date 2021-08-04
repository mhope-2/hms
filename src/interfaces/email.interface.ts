
interface EmailInterface {
    senderEmail: string
    recipientEmail: string
    userFullName: string
    recipientPhone: string
    subject: string
    mailContent: string
  }

export default EmailInterface

const mailPayload : BookingInterface = {
    : String(process.env.SMTP_USER_EMAIL),
    : req.body.userEmail, 
    userFullName: req.body.userFullName,
    recipientPhone: req.body.userPhone,
    subject: "INT HOTEL BOOKING DETAILS",
    mailContent: `Hello ${req.body.userFullName}, \n
    
                  Your room booking with number ${addBookingData.bookingCode} has been placed sucessfully.\n
                  Details:\n
                  Room Number: ${room.roomNumber}\n
                  Cost: ${addBookingData.cost}\n,
                  Start Date: ${addBookingData.startDate}\n
                  End Date: ${addBookingData.endDate}` 
  }