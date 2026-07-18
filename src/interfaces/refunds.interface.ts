
interface RefundInterface {
    paymentId: string,
    amount?: number,
    reason: string,
    status?: string
  }

export default RefundInterface
