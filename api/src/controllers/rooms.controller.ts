const jwt = require('jsonwebtoken')
import express from 'express'
import Controller from '../interfaces/controller.interface'
import roomInterface from '../interfaces/roomResources.interface'
import RoomsModel from '../models/rooms.model'
import HttpException from '../exceptions/http/HttpException'
import RoomNotFoundException from '../exceptions/room/RoomNotFoundException' 
import roomsDto from '../dtos/rooms.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


class RoomsController implements Controller {
    public path = '/rooms';
    public router = express.Router();
    private room = RoomsModel;
   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.roomsList);
      this.router.get(`${this.path}/:id`, this.findRoomById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(roomsDto), this.addRoom);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoomById);
      this.router.delete(`${this.path}/delete`, authMiddleware, this.deleteRoomById);
    }
   

    // list all rooms
    private roomsList = async (req:express.Request, res:express.Response) => {
        await this.room.find()
        .then(rooms => res.json(rooms))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add room
    private addRoom = async (req:express.Request, res:express.Response) => {
      const addRoomData : roomsDto = req.body
      const newRoom = new this.room(addRoomData)
      
      const saveNewroom = await newRoom.save()
      .then(() => res.json({"Response":`room with number ${addRoomData.roomNumber} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get room Info by Id
  private findRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.room.findById(req.params.id)
    .then(room => {
      if (room)
        res.json(room)
      else {
        next(new HttpException(404, 'Room not found'));
      }
    })
  }


  // Update Exercide
   private updateRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updateRoomData: roomInterface = req.body

    this.room.findByIdAndUpdate(id, updateRoomData, {new: true})
    .then(room => {
      if (room)
        res.json({"Response":`room with id ${id} updated`})
      else{
        next(new RoomNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.body.id
        this.room.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Room with id ${id} deleted successfully`});
          } else {
            next(new RoomNotFoundException(id));
          }
        })
    }
  // class end
  }

export default RoomsController