import RoomResourcesService from '../../src/services/roomResources.service';
import RoomResourceNotFoundException from '../../src/exceptions/roomResources/RoomResourceNotFoundException';

const sampleResource = { _id: 'res1', name: 'WiFi', description: 'Wireless internet' };

function mockRepo() {
  return { findAll: jest.fn(), findById: jest.fn(), create: jest.fn(), updateById: jest.fn(), deleteById: jest.fn() };
}

describe('RoomResourcesService', () => {
  let repo: ReturnType<typeof mockRepo>;
  let service: RoomResourcesService;

  beforeEach(() => {
    repo = mockRepo();
    service = new RoomResourcesService(repo as any);
  });

  it('listRoomResources returns all resources', async () => {
    repo.findAll.mockResolvedValue([sampleResource]);
    await expect(service.listRoomResources()).resolves.toEqual([sampleResource]);
  });

  it('getRoomResourceById throws when missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.getRoomResourceById('nope')).rejects.toBeInstanceOf(RoomResourceNotFoundException);
  });

  it('addRoomResource creates via the repository', async () => {
    repo.create.mockResolvedValue(sampleResource);
    await expect(service.addRoomResource(sampleResource as any)).resolves.toEqual(sampleResource);
  });

  it('updateRoomResource throws when missing', async () => {
    repo.updateById.mockResolvedValue(null);
    await expect(service.updateRoomResource('nope', {})).rejects.toBeInstanceOf(RoomResourceNotFoundException);
  });

  it('deleteRoomResource throws when missing', async () => {
    repo.deleteById.mockResolvedValue(null);
    await expect(service.deleteRoomResource('nope')).rejects.toBeInstanceOf(RoomResourceNotFoundException);
  });
});
