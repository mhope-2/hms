import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingInterface from '../interfaces/bookings.interface'
import BookingModel from '../models/bookings.model'
import HttpException from '../exceptions/http/HttpException'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import BookingsDto from '../dtos/bookings.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


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
    private addBooking = async (req:express.Request, res:express.Response) => {
      const addBookingData : BookingsDto = req.body
1

      // add booking code to request body
      addBookingData.bookingCode = this.generateBookingCode(100000,900000)

      // join on rooms
      addBookingData

      const newBooking = new this.bookings(addBookingData)
      
      const saveNewBooking = await newBooking.save()
      .then(() => res.json({"Response":`Booking ${addBookingData.bookingCode} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get Booking Info by Id
  private findBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.bookings.findById(req.params.id)
    .then(booking => {
      if (booking)
        res.json(booking)
      else {
        next(new HttpException(404, 'Booking not found'));
      }
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