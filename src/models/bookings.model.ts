import * as mongoose from 'mongoose'
import BookingsInterface from '../interfaces/bookings.interface';
var Schema = mongoose.Schema;

const BookingsSchema = new mongoose.Schema({

    bookingCode: { type: String, required: true, unique:true },
    roomId:{type: Schema.Types.ObjectId, ref: 'Rooms'},
    cost:{ type: Number, required: true},
    userPhone: {type: String, required: true},
    userEmail: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        required:true,
        unique:true,
        minlength:3
      },
    status: {type: String, required: true, default: 'pending'}
},
  {timestamps:true}
)

const BookingModel = mongoose.model<BookingsInterface & mongoose.Document>('Bookings', BookingsSchema)
 
export default BookingModel