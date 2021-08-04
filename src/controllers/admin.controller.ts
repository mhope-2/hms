import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingInterface from '../interfaces/bookings.interface'
import BookingModel from '../models/bookings.model'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import authMiddleware from '../middleware/auth.middleware';


class AdminController implements Controller {
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

        await this.bookings.updateOne({_id: id}, { status: 'approved' })
        .then(()=>{
          // update room status to taken
          res.json({"Response":`Booking approved successfully.`})
        })
        .catch(err => res.json({"Response":"Attempt to approve booking failed"}))
    
        }


    // reject booking
    private declineBooking = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

        const id = req.params.id
        const reasonForDecline = req.body.reasonForDecline  

        await this.bookings.updateOne({_id: id}, { status: 'declined' })
        .then(()=>{
          res.json({"Response":`Booking declined successfully with reason: ${reasonForDecline}.`})
        })
        .catch(err => res.json({"Response":"Attempt to decline booking failed"}))
  
        }


  // class end
  }

export default AdminController