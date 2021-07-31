import express from 'express'
import Controller from '../interfaces/controller.interface'
import roomInterface from '../interfaces/roomResources.interface'
import RolesModel from '../models/roles.model'
import HttpException from '../exceptions/http/HttpException'
import RoleNotFoundException from '../exceptions/room/RoomNotFoundException' 
import RolesDto from '../dtos/roles.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'


class RolesController implements Controller {
    public path = '/roles'
    public router = express.Router()
    private role = RolesModel
   
    constructor() {
      this.initializeRoutes()
    }

    // initialize routes
    private initializeRoutes() {
      this.router.get(this.path, this.rolesList)
      this.router.get(`${this.path}/:id`, this.findRoleById)
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(RolesDto), this.addRole)
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoleById)
      this.router.delete(`${this.path}/delete`, authMiddleware, this.deleteRoleById)
    }

    // list all roles
    private rolesList = async (req:express.Request, res:express.Response) => {
        await this.role.find()
        .then(roles => res.json(roles))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add role
    private addRole = async (req:express.Request, res:express.Response) => {
      const addRoleData : RolesDto = req.body
      const newRole = new this.role(addRoleData)
      
      const saveNewRole = await newRole.save()
      .then(() => res.json({"Response":`${addRoleData.role} role added`}))
      .catch(err => res.status(400).json('Error: ' + err))
  }


  // Get role Info by Id
  private findRoleById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.role.findById(req.params.id)
    .then(role => {
      if (role)
        res.json(role)
      else {
        next(new HttpException(404, 'Role not found'))
      }
    })
  }


  // Update Exercide
   private updateRoleById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updateRoleData: roomInterface = req.body

    this.role.findByIdAndUpdate(id, updateRoleData, {new: true})
    .then(role => {
      if (role)
        res.json({"Response":`Role with id ${id} updated`})
      else{
        next(new RoleNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteRoleById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.params.id
        this.role.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Role with id ${id} deleted successfully`})
          } else {
            next(new RoleNotFoundException(id))
          }
        })
    }
  // class end
  }

export default RolesController