import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingInterface from '../interfaces/bookings.interface'
import EmailInterface from '../interfaces/email.interface'
import BookingModel from '../models/bookings.model'
import RoomsModel from '../models/rooms.model'
import HttpException from '../exceptions/http/HttpException'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import BookingsDto from '../dtos/bookings.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';
import sendMail from '../utils/email.utils'
import EmailDto from '../dtos/email.dto'

class BookingsController implements Controller {
    public path = '/bookings';
    public router = express.Router();
    private bookings = BookingModel;
   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.bookingsList);
      this.router.get(`${this.path}/:id`, this.findBookingById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(BookingsDto), this.addBooking);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateBookingById);
    }
   

    // list all Bookings
    private bookingsList = async (req:express.Request, res:express.Response) => {
        await this.bookings.find()
        .then(bookings => res.json(bookings))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add Booking
    private addBooking = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
      let addBookingData : BookingsDto = req.body

      const room = await RoomsModel.findById(addBookingData.roomId)
      .exec( async (err, room) =>{
        if (err){
          next(new BookingNotFoundException(req.params.id))
        }
        if (room){
          addBookingData.bookingCode = this.generateBookingCode(100000,900000) 

          addBookingData.cost = room.price
          
          const newBooking = new this.bookings(addBookingData)
 
        const saveNewBooking = await newBooking.save()
        .then(async () => {
          //send mail 
          /** Further improvement: to be made a background process
           */
          const mailPayload : EmailInterface = {
            senderEmail: String(process.env.SMTP_USER_EMAIL),
            recipientEmail: req.body.userEmail, 
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
           sendMail(mailPayload)
          res.json({"Response":`Booking ${addBookingData.bookingCode} added`})
        })
        .catch(err => res.status(400).json('Error: ' + err));
        
          }
        })

      console.log(addBookingData)

      
  }
  

  // further improvement => not implemented yet
  private allowMultipleRoomBooking = async (requestBody: BookingsDto) =>{

    const loopVar = requestBody

    requestBody.bookingCode = this.generateBookingCode(100000,900000)      

    // loop over room Ids and save separately with same booking code
    for(let i = 0; i < loopVar.roomId.length; i++){

      // requestBody.roomIds = [loopVar.roomId[i]]

      const newBooking = new this.bookings(requestBody)

      const saveNewBooking = await newBooking.save()
      .then(()=> {
        console.log("Saved booking data to database")
      })
      .catch(err => {
        console.log("Failed to save booking data to database. Error: ",err)
      })
    }
    requestBody.bookingCode
  }

  // Get Booking Info by Id
  private findBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const booking = await this.bookings.findById(req.params.id).populate('roomId')
    .exec((err, booking) =>{
      if (err){
        next(new BookingNotFoundException(req.params.id))
      }
      if (booking)
        res.json(booking)
    })
    
  }


  // Update Booking
   private updateBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updateBookingData: BookingInterface = req.body

    this.bookings.findByIdAndUpdate(id, updateBookingData, {new: true})
    .then(booking => {
      if (booking)
        res.json({"Response":`Booking with id ${id} updated`})
      else{
        next(new BookingNotFoundException(id))
      }
    }    

    )}


    /**
     * return generated booking code
     **/
    private generateBookingCode = (min, max): string => { // min and max included 
      return "BK" + String(Math.floor(Math.random() * (max - min + 1) + min))
    }


  // class end
  }

export default BookingsController