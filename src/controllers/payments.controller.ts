import express from 'express'
import Controller from '../interfaces/controller.interface'
import PaymentsDto from '../dtos/payments.dto'
import PaymentsService from '../services/payments.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class PaymentsController implements Controller {
    public path = '/payments';
    public router = express.Router();

    constructor(private readonly paymentsService = new PaymentsService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, authMiddleware, this.paymentsList);
      this.router.get(`${this.path}/:id`, authMiddleware, this.findPaymentById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(PaymentsDto), this.addPayment);
    }

    // list all payments
    private paymentsList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.paymentsService.listPayments())
      } catch (err) {
        next(err)
      }
    }

    // Get payment Info by Id
    private findPaymentById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.paymentsService.getPaymentById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // record payment for a booking
    private addPayment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const payment = await this.paymentsService.createPayment(req.body)
        res.json({ "Response": `Payment ${payment._id} recorded for booking ${payment.bookingId}` })
      } catch (err) {
        next(err)
      }
    }
}

export default PaymentsController
