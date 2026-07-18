import RoomResourcesRepository, { RoomResourceDocument } from '../repositories/roomResources.repository'
import RoomResourcesDto from '../dtos/roomResources.dto'
import RoomResourceNotFoundException from '../exceptions/roomResources/RoomResourceNotFoundException'

class RoomResourcesService {
  constructor(private readonly roomResources = new RoomResourcesRepository()) {}

  public listRoomResources(): Promise<RoomResourceDocument[]> {
    return this.roomResources.findAll()
  }

  public async getRoomResourceById(id: string): Promise<RoomResourceDocument> {
    const resource = await this.roomResources.findById(id)
    if (!resource) throw new RoomResourceNotFoundException(id)
    return resource
  }

  public addRoomResource(data: RoomResourcesDto): Promise<RoomResourceDocument> {
    return this.roomResources.create(data)
  }

  public async updateRoomResource(id: string, data: Record<string, any>): Promise<RoomResourceDocument> {
    const resource = await this.roomResources.updateById(id, data)
    if (!resource) throw new RoomResourceNotFoundException(id)
    return resource
  }

  public async deleteRoomResource(id: string): Promise<RoomResourceDocument> {
    const resource = await this.roomResources.deleteById(id)
    if (!resource) throw new RoomResourceNotFoundException(id)
    return resource
  }
}

export default RoomResourcesService
