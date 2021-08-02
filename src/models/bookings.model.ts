import * as mongoose from 'mongoose'
import BookingsInterface from '../interfaces/bookings.interface';
let validator = require('validator')
var Schema = mongoose.Schema;

const BookingsSchema = new mongoose.Schema({

    bookingCode: { type: String, required: false, unique:true },
    roomIds:[{type: Schema.Types.ObjectId, ref: 'Rooms'}],
    cost:{ type: Number, required: true},
    userPhone: {type: String, required: true},
    userEmail: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
      required:true,
      unique:false,
      lowercase: true,
      trim:true,
      minlength:3
    },
    status: {type: String, required: true, default: 'pending'}
},
  {timestamps:true}
)

const BookingModel = mongoose.model<BookingsInterface & mongoose.Document>('Bookings', BookingsSchema)
 
export default BookingModel