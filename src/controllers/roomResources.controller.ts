import express from 'express'
import Controller from '../interfaces/controller.interface'
import RoomResourcesDto from '../dtos/roomResources.dto'
import RoomResourcesService from '../services/roomResources.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class RoomResourcesController implements Controller {
    public path = '/room/resources';
    public router = express.Router();

    constructor(private readonly roomResourcesService = new RoomResourcesService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.roomsResourcesList);
      this.router.get(`${this.path}/:id`, this.findRoomResourceById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(RoomResourcesDto), this.addRoomsResource);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoomResourceById);
      this.router.delete(`${this.path}/delete/:id`, authMiddleware, this.deleteRoomResourceById);
    }

    // list all room resources
    private roomsResourcesList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.roomResourcesService.listRoomResources())
      } catch (err) {
        next(err)
      }
    }

    // add Room Resource
    private addRoomsResource = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const addRoomResourceData: RoomResourcesDto = req.body
        await this.roomResourcesService.addRoomResource(addRoomResourceData)
        res.json({ "Response": `${addRoomResourceData.name} added to room resources` })
      } catch (err) {
        next(err)
      }
    }

    // Get Room Resource Details by Id
    private findRoomResourceById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.roomResourcesService.getRoomResourceById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // Update Room Resource
    private updateRoomResourceById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.roomResourcesService.updateRoomResource(req.params.id, req.body)
        res.json({ "Response": `Room Resource with id ${req.params.id} updated` })
      } catch (err) {
        next(err)
      }
    }

    // Delete by id
    private deleteRoomResourceById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.roomResourcesService.deleteRoomResource(req.params.id)
        res.json({ "Response": `Room Resource with id ${req.params.id} deleted successfully` })
      } catch (err) {
        next(err)
      }
    }
}

export default RoomResourcesController
