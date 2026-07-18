import { Document } from 'mongoose'
import UserModel from '../models/user.model'
import UserInterface from '../interfaces/user.interface'
import BaseRepository from './base.repository'

export type UserDocument = UserInterface & Document

class UsersRepository extends BaseRepository<UserDocument> {
  constructor(model = UserModel) {
    super(model)
  }

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email })
  }

  public findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username })
  }

  // password has select:false in the schema; login needs it explicitly
  public findByUsernameWithPassword(username: string): Promise<UserDocument | null> {
    return this.model.findOne({ username }).select('+password').exec()
  }
}

export default UsersRepository
