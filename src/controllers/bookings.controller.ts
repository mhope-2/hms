import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingInterface from '../interfaces/bookings.interface'
import BookingsDto from '../dtos/bookings.dto'
import BookingsService from '../services/bookings.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class BookingsController implements Controller {
    public path = '/bookings';
    public router = express.Router();

    constructor(private readonly bookingsService = new BookingsService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.bookingsList);
      this.router.get(`${this.path}/:id`, this.findBookingById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(BookingsDto), this.addBooking);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateBookingById);
    }

    // list all Bookings
    private bookingsList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.bookingsService.listBookings())
      } catch (err) {
        next(err)
      }
    }

    // add Booking
    private addBooking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const addBookingData: BookingsDto = req.body
        const booking = await this.bookingsService.createBooking(addBookingData)
        res.json({ "Response": `Booking ${booking.bookingCode} added` })
      } catch (err) {
        next(err)
      }
    }

    // Get Booking Info by Id
    private findBookingById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.bookingsService.getBookingById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // Update Booking
    private updateBookingById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const updateBookingData: Partial<BookingInterface> = req.body
        await this.bookingsService.updateBooking(req.params.id, updateBookingData)
        res.json({ "Response": `Booking with id ${req.params.id} updated` })
      } catch (err) {
        next(err)
      }
    }
}

export default BookingsController
