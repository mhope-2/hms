import { Document } from 'mongoose'
import RoomResourcesModel from '../models/roomResources.model'
import RoomResourcesInterface from '../interfaces/roomResources.interface'
import BaseRepository from './base.repository'

export type RoomResourceDocument = RoomResourcesInterface & Document

class RoomResourcesRepository extends BaseRepository<RoomResourceDocument> {
  constructor(model = RoomResourcesModel) {
    super(model)
  }
}

export default RoomResourcesRepository
