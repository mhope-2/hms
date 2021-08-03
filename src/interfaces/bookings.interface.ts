
interface BookingInterface {
    bookingCode?: String,
    roomId: string,
    cost?: Number,
    userPhone: String,
    userEmail: String,
    userFullName: String,
    numberOfPeople: Number,
    startDate: Date,
    endDate: Date
  }

export default BookingInterface
