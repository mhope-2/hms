import RolesRepository, { RoleDocument } from '../repositories/roles.repository'
import RolesDto from '../dtos/roles.dto'
import RoleNotFoundException from '../exceptions/roles/RoleNotFoundException'

class RolesService {
  constructor(private readonly roles = new RolesRepository()) {}

  public listRoles(): Promise<RoleDocument[]> {
    return this.roles.findAll()
  }

  public async getRoleById(id: string): Promise<RoleDocument> {
    const role = await this.roles.findById(id)
    if (!role) throw new RoleNotFoundException(id)
    return role
  }

  public addRole(data: RolesDto): Promise<RoleDocument> {
    return this.roles.create(data)
  }

  public async updateRole(id: string, data: Record<string, any>): Promise<RoleDocument> {
    const role = await this.roles.updateById(id, data)
    if (!role) throw new RoleNotFoundException(id)
    return role
  }

  public async deleteRole(id: string): Promise<RoleDocument> {
    const role = await this.roles.deleteById(id)
    if (!role) throw new RoleNotFoundException(id)
    return role
  }
}

export default RolesService
