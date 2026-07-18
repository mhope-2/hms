import { Document } from 'mongoose'
import RoomsModel from '../models/rooms.model'
import RoomsInterface from '../interfaces/rooms.interface'
import BaseRepository from './base.repository'

export type RoomDocument = RoomsInterface & Document

class RoomsRepository extends BaseRepository<RoomDocument> {
  constructor(model = RoomsModel) {
    super(model)
  }

  public findAvailable(): Promise<RoomDocument[]> {
    return this.findAll({ status: 'available' })
  }
}

export default RoomsRepository
