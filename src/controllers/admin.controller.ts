import express from 'express'
import Controller from '../interfaces/controller.interface'
import BookingsService from '../services/bookings.service'
import authMiddleware from '../middleware/auth.middleware'

class AdminController implements Controller {
    public path = '/bookings';
    public router = express.Router();

    constructor(private readonly bookingsService = new BookingsService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.post(`${this.path}/approve/:id`, authMiddleware, this.approveBooking);
      this.router.post(`${this.path}/decline/:id`, authMiddleware, this.declineBooking);
    }

    // approve booking
    private approveBooking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.bookingsService.approveBooking(req.params.id)
        res.json({ "Response": `Booking approved successfully.` })
      } catch (err) {
        next(err)
      }
    }

    // reject booking
    private declineBooking = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.bookingsService.declineBooking(req.params.id)
        res.json({ "Response": `Booking declined successfully with reason: ${req.body.reasonForDecline}.` })
      } catch (err) {
        next(err)
      }
    }
}

export default AdminController
