import { Document, Model } from 'mongoose'

/**
 * Generic promise-only data access. The ONLY layer allowed to touch Mongoose.
 * No callbacks anywhere: Mongoose 6 deprecates them and 7 removes them.
 */
class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  public findAll(filter: Record<string, any> = {}): Promise<T[]> {
    return this.model.find(filter).exec()
  }

  public findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  public findOne(filter: Record<string, any>): Promise<T | null> {
    return this.model.findOne(filter).exec()
  }

  public create(data: Record<string, any>): Promise<T> {
    return this.model.create(data as any)
  }

  public updateById(id: string, data: Record<string, any>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  public deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec()
  }
}

export default BaseRepository
