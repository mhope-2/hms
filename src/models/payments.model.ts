import * as mongoose from 'mongoose'
import PaymentInterface from '../interfaces/payments.interface'
let Schema = mongoose.Schema;

const PaymentsSchema = new mongoose.Schema({

    bookingId: { type: Schema.Types.ObjectId, required: true, ref: 'Bookings' },
    amount: { type: Number, required: true }, // in ghc.
    method: { type: String, required: true, enum: ['card', 'cash', 'momo'] },
    status: { type: String, required: true, default: 'completed' }, // completed | refunded
    transactionRef: { type: String, required: false }

},
  {timestamps:true}
)

const PaymentsModel = mongoose.model<PaymentInterface & mongoose.Document>('Payments', PaymentsSchema)

export default PaymentsModel
