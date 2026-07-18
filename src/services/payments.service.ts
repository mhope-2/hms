import PaymentsRepository, { PaymentDocument } from '../repositories/payments.repository'
import BookingsRepository from '../repositories/bookings.repository'
import PaymentsDto from '../dtos/payments.dto'
import PaymentNotFoundException from '../exceptions/payments/PaymentNotFoundException'
import BookingAlreadyPaidException from '../exceptions/payments/BookingAlreadyPaidException'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException'

class PaymentsService {
  constructor(
    private readonly payments = new PaymentsRepository(),
    private readonly bookings = new BookingsRepository(),
  ) {}

  public listPayments(): Promise<PaymentDocument[]> {
    return this.payments.findAll()
  }

  public async getPaymentById(id: string): Promise<PaymentDocument> {
    const payment = await this.payments.findById(id)
    if (!payment) throw new PaymentNotFoundException(id)
    return payment
  }

  public async createPayment(data: PaymentsDto): Promise<PaymentDocument> {
    const booking = await this.bookings.findById(data.bookingId)
    if (!booking) throw new BookingNotFoundException(data.bookingId)

    const existingPayment = await this.payments.findCompletedByBookingId(data.bookingId)
    if (existingPayment) throw new BookingAlreadyPaidException(data.bookingId)

    // amount always comes from the booking, never from the client
    return this.payments.create({
      bookingId: data.bookingId,
      amount: booking.cost,
      method: data.method,
      status: 'completed',
      transactionRef: data.transactionRef,
    })
  }
}

export default PaymentsService
