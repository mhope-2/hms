import { Document } from 'mongoose'
import RolesModel from '../models/roles.model'
import RolesInterface from '../interfaces/roles.interface'
import BaseRepository from './base.repository'

export type RoleDocument = RolesInterface & Document

class RolesRepository extends BaseRepository<RoleDocument> {
  constructor(model = RolesModel) {
    super(model)
  }
}

export default RolesRepository
