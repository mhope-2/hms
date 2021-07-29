import * as mongoose from 'mongoose'
import BookingsInterface from '../interfaces/bookings.interface';
var Schema = mongoose.Schema;

const BookingsSchema = new mongoose.Schema({

    booking_code: { type: String, required: true, unique:true },
    room:[
        {type: Schema.Types.ObjectId, ref: 'Rooms'}
      ],
    resources:[
      {type: Schema.Types.ObjectId, ref: 'RoomResources'}
    ]       
},
  {timestamps:true}
)

const BookingsModel = mongoose.model<BookingsInterface & mongoose.Document>('Bookings', BookingsSchema)
 
export default BookingsModel