import { Document } from 'mongoose'
import RefundsModel from '../models/refunds.model'
import RefundInterface from '../interfaces/refunds.interface'
import BaseRepository from './base.repository'

export type RefundDocument = RefundInterface & Document

class RefundsRepository extends BaseRepository<RefundDocument> {
  constructor(model = RefundsModel) {
    super(model)
  }

  public findOpenByPaymentId(paymentId: string): Promise<RefundDocument | null> {
    return this.findOne({ paymentId, status: { $in: ['pending', 'approved'] } })
  }
}

export default RefundsRepository
