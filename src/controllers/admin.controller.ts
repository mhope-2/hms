import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingInterface from '../interfaces/bookings.interface'
import BookingModel from '../models/bookings.model'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import authMiddleware from '../middleware/auth.middleware';


class BookingsController implements Controller {
    public path = '/bookings';
    public router = express.Router();
    private bookings = BookingModel;

   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {

      this.router.post(`${this.path}/approve/:id`, authMiddleware, this.approveBooking);
      this.router.post(`${this.path}/decline/:id`, authMiddleware, this.declineBooking);
    }
   

    // approve booking
    private approveBooking = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

        const id = req.params.id
        const updateBookingData: BookingInterface = req.body  

        this.bookings.findOne({_id: id}, (err, booking)=>{
            
            booking.save((err) => {
              if (err) {
                next(new BookingNotFoundException(id))
              } else{
                booking.status = 'approved'
                res.json({"Response":`Your booking with code ${booking.bookingCode} has been approved successfully. Kindly check your email for details`})
                // send email
              }
            });
         });
    
        }


    // reject booking
    private declineBooking = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

        const id = req.params.id
        const reasonForDecline = req.body.reasonForDecline  

        this.bookings.findOne({_id: id}, function(err, booking){
            booking.save((err) => {
              if (err) {
                next(new BookingNotFoundException(id))
              } else{
                booking.status = 'declined';
                res.json({"Response":`Your booking with code ${booking.bookingCode} has declined.\nReason: ${reasonForDecline}. Kindly check your email for details`})
                // send email with reason
              }
            });
         });
    
        }


  // class end
  }

export default BookingsController