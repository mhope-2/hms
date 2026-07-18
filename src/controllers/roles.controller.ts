import express from 'express'
import Controller from '../interfaces/controller.interface'
import RolesDto from '../dtos/roles.dto'
import RolesService from '../services/roles.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class RolesController implements Controller {
    public path = '/roles'
    public router = express.Router()

    constructor(private readonly rolesService = new RolesService()) {
      this.initializeRoutes()
    }

    // initialize routes
    private initializeRoutes() {
      this.router.get(this.path, this.rolesList)
      this.router.get(`${this.path}/:id`, this.findRoleById)
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(RolesDto), this.addRole)
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoleById)
      this.router.delete(`${this.path}/delete/:id`, authMiddleware, this.deleteRoleById)
    }

    // list all roles
    private rolesList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.rolesService.listRoles())
      } catch (err) {
        next(err)
      }
    }

    // add role
    private addRole = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const addRoleData: RolesDto = req.body
        await this.rolesService.addRole(addRoleData)
        res.json({ "Response": `${addRoleData.role} role added` })
      } catch (err) {
        next(err)
      }
    }

    // Get role Info by Id
    private findRoleById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.rolesService.getRoleById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // Update role
    private updateRoleById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.rolesService.updateRole(req.params.id, req.body)
        res.json({ "Response": `Role with id ${req.params.id} updated` })
      } catch (err) {
        next(err)
      }
    }

    // Delete by id
    private deleteRoleById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.rolesService.deleteRole(req.params.id)
        res.json({ "Response": `Role with id ${req.params.id} deleted successfully` })
      } catch (err) {
        next(err)
      }
    }
}

export default RolesController
