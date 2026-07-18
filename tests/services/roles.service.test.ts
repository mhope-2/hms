import RolesService from '../../src/services/roles.service';
import RoleNotFoundException from '../../src/exceptions/roles/RoleNotFoundException';

const sampleRole = { _id: 'role1', role: 'admin', description: 'Administrator' };

function mockRepo() {
  return { findAll: jest.fn(), findById: jest.fn(), create: jest.fn(), updateById: jest.fn(), deleteById: jest.fn() };
}

describe('RolesService', () => {
  let repo: ReturnType<typeof mockRepo>;
  let service: RolesService;

  beforeEach(() => {
    repo = mockRepo();
    service = new RolesService(repo as any);
  });

  it('listRoles returns all roles', async () => {
    repo.findAll.mockResolvedValue([sampleRole]);
    await expect(service.listRoles()).resolves.toEqual([sampleRole]);
  });

  it('getRoleById throws RoleNotFoundException when missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(service.getRoleById('nope')).rejects.toBeInstanceOf(RoleNotFoundException);
  });

  it('addRole creates via the repository', async () => {
    repo.create.mockResolvedValue(sampleRole);
    await expect(service.addRole(sampleRole as any)).resolves.toEqual(sampleRole);
    expect(repo.create).toHaveBeenCalledWith(sampleRole);
  });

  it('updateRole throws RoleNotFoundException when missing', async () => {
    repo.updateById.mockResolvedValue(null);
    await expect(service.updateRole('nope', {})).rejects.toBeInstanceOf(RoleNotFoundException);
  });

  it('deleteRole throws RoleNotFoundException when missing', async () => {
    repo.deleteById.mockResolvedValue(null);
    await expect(service.deleteRole('nope')).rejects.toBeInstanceOf(RoleNotFoundException);
  });
});
