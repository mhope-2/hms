import { Document } from 'mongoose'
import PaymentsModel from '../models/payments.model'
import PaymentInterface from '../interfaces/payments.interface'
import BaseRepository from './base.repository'

export type PaymentDocument = PaymentInterface & Document

class PaymentsRepository extends BaseRepository<PaymentDocument> {
  constructor(model = PaymentsModel) {
    super(model)
  }

  public findCompletedByBookingId(bookingId: string): Promise<PaymentDocument | null> {
    return this.findOne({ bookingId, status: 'completed' })
  }
}

export default PaymentsRepository
