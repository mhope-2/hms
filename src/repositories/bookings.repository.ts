import { Document } from 'mongoose'
import BookingModel from '../models/bookings.model'
import BookingInterface from '../interfaces/bookings.interface'
import BaseRepository from './base.repository'

export type BookingDocument = BookingInterface & Document

class BookingsRepository extends BaseRepository<BookingDocument> {
  constructor(model = BookingModel) {
    super(model)
  }

  public findAllWithRooms(): Promise<BookingDocument[]> {
    return this.model.find().populate('roomId').exec()
  }

  public findByIdWithRooms(id: string): Promise<BookingDocument | null> {
    return this.model.findById(id).populate('roomId').exec()
  }
}

export default BookingsRepository
