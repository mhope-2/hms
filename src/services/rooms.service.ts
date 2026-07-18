import RoomsRepository, { RoomDocument } from '../repositories/rooms.repository'
import RoomsDto from '../dtos/rooms.dto'
import RoomsInterface from '../interfaces/rooms.interface'
import RoomNotFoundException from '../exceptions/room/RoomNotFoundException'

class RoomsService {
  constructor(private readonly rooms = new RoomsRepository()) {}

  public listAvailableRooms(): Promise<RoomDocument[]> {
    return this.rooms.findAvailable()
  }

  public async getRoomById(id: string): Promise<RoomDocument> {
    const room = await this.rooms.findById(id)
    if (!room) throw new RoomNotFoundException(id)
    return room
  }

  public addRoom(data: RoomsDto): Promise<RoomDocument> {
    return this.rooms.create(data)
  }

  public async updateRoom(id: string, data: Partial<RoomsInterface>): Promise<RoomDocument> {
    const room = await this.rooms.updateById(id, data)
    if (!room) throw new RoomNotFoundException(id)
    return room
  }

  public async deleteRoom(id: string): Promise<RoomDocument> {
    const room = await this.rooms.deleteById(id)
    if (!room) throw new RoomNotFoundException(id)
    return room
  }
}

export default RoomsService
