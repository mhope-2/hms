import * as mongoose from 'mongoose'
import RefundInterface from '../interfaces/refunds.interface'
let Schema = mongoose.Schema;

const RefundsSchema = new mongoose.Schema({

    paymentId: { type: Schema.Types.ObjectId, required: true, ref: 'Payments' },
    amount: { type: Number, required: true }, // in ghc.
    reason: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' } // pending | approved | declined

},
  {timestamps:true}
)

const RefundsModel = mongoose.model<RefundInterface & mongoose.Document>('Refunds', RefundsSchema)

export default RefundsModel
