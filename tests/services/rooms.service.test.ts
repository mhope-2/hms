import RoomsService from '../../src/services/rooms.service';
import RoomNotFoundException from '../../src/exceptions/room/RoomNotFoundException';

const sampleRoom = { _id: 'r1', roomNumber: '101', floor: '1', resources: ['WiFi'], price: 100, status: 'available' };

function mockRepo() {
  return {
    findAvailable: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };
}

describe('RoomsService', () => {
  let repo: ReturnType<typeof mockRepo>;
  let service: RoomsService;

  beforeEach(() => {
    repo = mockRepo();
    service = new RoomsService(repo as any);
  });

  it('listAvailableRooms returns rooms from the repository', async () => {
    repo.findAvailable.mockResolvedValue([sampleRoom]);
    await expect(service.listAvailableRooms()).resolves.toEqual([sampleRoom]);
  });

  it('getRoomById returns the room when found', async () => {
    repo.findById.mockResolvedValue(sampleRoom);
    await expect(service.getRoomById('r1')).resolves.toEqual(sampleRoom);
  });

  it('getRoomById throws RoomNotFoundException when missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.getRoomById('nope')).rejects.toBeInstanceOf(RoomNotFoundException);
  });

  it('addRoom creates via the repository', async () => {
    repo.create.mockResolvedValue(sampleRoom);
    await expect(service.addRoom(sampleRoom as any)).resolves.toEqual(sampleRoom);
    expect(repo.create).toHaveBeenCalledWith(sampleRoom);
  });

  it('updateRoom throws RoomNotFoundException when the id does not exist', async () => {
    repo.updateById.mockResolvedValue(null);
    await expect(service.updateRoom('nope', { price: 1 } as any)).rejects.toBeInstanceOf(RoomNotFoundException);
  });

  it('deleteRoom returns the deleted room', async () => {
    repo.deleteById.mockResolvedValue(sampleRoom);
    await expect(service.deleteRoom('r1')).resolves.toEqual(sampleRoom);
  });

  it('deleteRoom throws RoomNotFoundException when the id does not exist', async () => {
    repo.deleteById.mockResolvedValue(null);
    await expect(service.deleteRoom('nope')).rejects.toBeInstanceOf(RoomNotFoundException);
  });
});
