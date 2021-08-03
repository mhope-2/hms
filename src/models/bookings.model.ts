import * as mongoose from 'mongoose'
import BookingsInterface from '../interfaces/bookings.interface';
let validator = require('validator')
var Schema = mongoose.Schema;

const BookingsSchema = new mongoose.Schema({

    bookingCode: { type: String, required: false, unique:false },
    
    roomId: [{type: Schema.Types.ObjectId, required: true, ref:'Rooms' }],
    
    cost:{ type: Number, required: false},
    
    userPhone: {type: String, required: true},
    
    userEmail: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
      required:true,
      lowercase: true,
      trim:true,
      minlength:3
    },

    userFullName: {type: String, required: true},

    numberOfPeople: {type: Number, required: true},

    status: {type: String, required: true, default: 'pending'},

    approved_at: { type: Date, required: false },

    startDate: { type: Date, required: true },

    endDate: { type: Date, required: true },

    daysValid : { type: Number, required: false }
},
  {timestamps:true}
)


BookingsSchema.virtual('rooms', {
  ref: 'Rooms',
  localField: '_id',
  foreignField: 'roomNumber',
});

const BookingModel = mongoose.model<BookingsInterface & mongoose.Document>('Bookings', BookingsSchema)
 
export default BookingModel