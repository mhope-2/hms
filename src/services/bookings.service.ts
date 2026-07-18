import BookingsRepository, { BookingDocument } from '../repositories/bookings.repository'
import RoomsRepository from '../repositories/rooms.repository'
import EmailService from './email.service'
import BookingsDto from '../dtos/bookings.dto'
import BookingInterface from '../interfaces/bookings.interface'
import EmailInterface from '../interfaces/email.interface'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException'
import RoomNotFoundException from '../exceptions/room/RoomNotFoundException'

class BookingsService {
  constructor(
    private readonly bookings = new BookingsRepository(),
    private readonly rooms = new RoomsRepository(),
    private readonly emailService = new EmailService(),
  ) {}

  public listBookings(): Promise<BookingDocument[]> {
    return this.bookings.findAllWithRooms()
  }

  public async getBookingById(id: string): Promise<BookingDocument> {
    const booking = await this.bookings.findByIdWithRooms(id)
    if (!booking) throw new BookingNotFoundException(id)
    return booking
  }

  public async createBooking(data: BookingsDto): Promise<BookingDocument> {
    const room = await this.rooms.findById(data.roomId)
    if (!room) throw new RoomNotFoundException(data.roomId)

    const booking = await this.bookings.create({
      ...data,
      bookingCode: this.generateBookingCode(100000, 900000),
      cost: room.price,
    })

    // Confirmation email is best-effort: the booking is already saved,
    // so a mail failure must not fail the request.
    // Further improvement: to be made a background process
    try {
      await this.emailService.send(this.buildConfirmationMail(booking, room))
    } catch (err) {
      console.error('Failed to send booking confirmation email:', err)
    }

    return booking
  }

  public async updateBooking(id: string, data: Partial<BookingInterface>): Promise<BookingDocument> {
    const booking = await this.bookings.updateById(id, data)
    if (!booking) throw new BookingNotFoundException(id)
    return booking
  }

  public async approveBooking(id: string): Promise<BookingDocument> {
    const booking = await this.bookings.updateById(id, { status: 'approved', approved_at: new Date() })
    if (!booking) throw new BookingNotFoundException(id)
    return booking
  }

  public async declineBooking(id: string): Promise<BookingDocument> {
    const booking = await this.bookings.updateById(id, { status: 'declined' })
    if (!booking) throw new BookingNotFoundException(id)
    return booking
  }

  /**
   * return generated booking code, e.g. BK123456
   **/
  private generateBookingCode(min: number, max: number): string { // min and max included
    return "BK" + String(Math.floor(Math.random() * (max - min + 1) + min))
  }

  private buildConfirmationMail(booking: BookingDocument, room: any): EmailInterface {
    return {
      senderEmail: String(process.env.SMTP_USER_EMAIL),
      recipientEmail: String(booking.userEmail),
      userFullName: String(booking.userFullName),
      recipientPhone: String(booking.userPhone),
      subject: "INT HOTEL BOOKING DETAILS",
      mailContent: `Hello ${booking.userFullName}, \n
                    Your room booking with number ${booking.bookingCode} has been placed sucessfully.\n
                    Details:\n
                    Room Number: ${room.roomNumber}\n
                    Cost: ${booking.cost}\n,
                    Start Date: ${booking.startDate}\n
                    End Date: ${booking.endDate}`,
    }
  }
}

export default BookingsService
