import RefundsRepository, { RefundDocument } from '../repositories/refunds.repository'
import PaymentsRepository from '../repositories/payments.repository'
import RefundsDto from '../dtos/refunds.dto'
import RefundNotFoundException from '../exceptions/refunds/RefundNotFoundException'
import RefundNotAllowedException from '../exceptions/refunds/RefundNotAllowedException'
import PaymentNotFoundException from '../exceptions/payments/PaymentNotFoundException'

class RefundsService {
  constructor(
    private readonly refunds = new RefundsRepository(),
    private readonly payments = new PaymentsRepository(),
  ) {}

  public listRefunds(): Promise<RefundDocument[]> {
    return this.refunds.findAll()
  }

  public async getRefundById(id: string): Promise<RefundDocument> {
    const refund = await this.refunds.findById(id)
    if (!refund) throw new RefundNotFoundException(id)
    return refund
  }

  public async requestRefund(data: RefundsDto): Promise<RefundDocument> {
    const payment = await this.payments.findById(data.paymentId)
    if (!payment) throw new PaymentNotFoundException(data.paymentId)
    if (payment.status !== 'completed') {
      throw new RefundNotAllowedException(`Payment ${data.paymentId} is not refundable (status: ${payment.status})`)
    }

    const openRefund = await this.refunds.findOpenByPaymentId(data.paymentId)
    if (openRefund) {
      throw new RefundNotAllowedException(`A refund for payment ${data.paymentId} already exists`)
    }

    return this.refunds.create({
      paymentId: data.paymentId,
      amount: payment.amount,
      reason: data.reason,
      status: 'pending',
    })
  }

  public async approveRefund(id: string): Promise<RefundDocument> {
    const refund = await this.requirePendingRefund(id)
    const approved = await this.refunds.updateById(id, { status: 'approved' })
    await this.payments.updateById(String(refund.paymentId), { status: 'refunded' })
    return approved as RefundDocument
  }

  public async declineRefund(id: string): Promise<RefundDocument> {
    await this.requirePendingRefund(id)
    return await this.refunds.updateById(id, { status: 'declined' }) as RefundDocument
  }

  private async requirePendingRefund(id: string): Promise<RefundDocument> {
    const refund = await this.refunds.findById(id)
    if (!refund) throw new RefundNotFoundException(id)
    if (refund.status !== 'pending') {
      throw new RefundNotAllowedException(`Refund ${id} has already been ${refund.status}`)
    }
    return refund
  }
}

export default RefundsService
