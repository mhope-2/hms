import express from 'express'
import Controller from '../interfaces/controller.interface'
import RefundsDto from '../dtos/refunds.dto'
import RefundsService from '../services/refunds.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class RefundController implements Controller {
    public path = '/refunds';
    public router = express.Router();

    constructor(private readonly refundsService = new RefundsService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, authMiddleware, this.refundsList);
      this.router.get(`${this.path}/:id`, authMiddleware, this.findRefundById);
      this.router.post(`${this.path}/request`, authMiddleware, validationMiddleware(RefundsDto), this.requestRefund);
      this.router.post(`${this.path}/approve/:id`, authMiddleware, this.approveRefund);
      this.router.post(`${this.path}/decline/:id`, authMiddleware, this.declineRefund);
    }

    // list all refunds
    private refundsList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.refundsService.listRefunds())
      } catch (err) {
        next(err)
      }
    }

    // Get refund Info by Id
    private findRefundById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.refundsService.getRefundById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // request a refund for a payment
    private requestRefund = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const refund = await this.refundsService.requestRefund(req.body)
        res.json({ "Response": `Refund ${refund._id} requested for payment ${refund.paymentId}` })
      } catch (err) {
        next(err)
      }
    }

    // approve refund
    private approveRefund = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.refundsService.approveRefund(req.params.id)
        res.json({ "Response": `Refund approved successfully.` })
      } catch (err) {
        next(err)
      }
    }

    // decline refund
    private declineRefund = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.refundsService.declineRefund(req.params.id)
        res.json({ "Response": `Refund declined successfully.` })
      } catch (err) {
        next(err)
      }
    }
}

export default RefundController
