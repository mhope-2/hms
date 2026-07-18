
interface PaymentInterface {
    bookingId: string,
    amount?: number,
    method: string,
    status?: string,
    transactionRef?: string
  }

export default PaymentInterface
