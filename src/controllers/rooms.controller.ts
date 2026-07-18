import express from 'express'
import Controller from '../interfaces/controller.interface'
import RoomsInterface from '../interfaces/rooms.interface'
import RoomsDto from '../dtos/rooms.dto'
import RoomsService from '../services/rooms.service'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware'

class RoomsController implements Controller {
    public path = '/rooms';
    public router = express.Router();

    constructor(private readonly roomsService = new RoomsService()) {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.roomsList);
      this.router.get(`${this.path}/:id`, this.findRoomById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(RoomsDto), this.addRoom);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoomById);
      this.router.delete(`${this.path}/delete/:id`, authMiddleware, this.deleteRoomById);
    }

    // list all rooms
    private roomsList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.roomsService.listAvailableRooms())
      } catch (err) {
        next(err)
      }
    }

    // add room
    private addRoom = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const addRoomData: RoomsDto = req.body
        await this.roomsService.addRoom(addRoomData)
        res.json({ "Response": `room with number ${addRoomData.roomNumber} added successfully` })
      } catch (err) {
        next(err)
      }
    }

    // Get room Info by Id
    private findRoomById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.roomsService.getRoomById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // Update Room Info
    private updateRoomById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const updateRoomData: Partial<RoomsInterface> = req.body
        await this.roomsService.updateRoom(req.params.id, updateRoomData)
        res.json({ "Response": `room with id ${req.params.id} updated successfully` })
      } catch (err) {
        next(err)
      }
    }

    // Delete by id
    private deleteRoomById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        await this.roomsService.deleteRoom(req.params.id)
        res.json({ "Response": `Room with id ${req.params.id} deleted successfully` })
      } catch (err) {
        next(err)
      }
    }
}

export default RoomsController
