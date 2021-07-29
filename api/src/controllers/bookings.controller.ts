import express from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from '../interfaces/roomResources.interface'
import RoomResourcesModel from '../models/roomResources.model'
import HttpException from '../exceptions/http/HttpException'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import roomResourcesDto from '../dtos/roomResources.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


class BookingsController implements Controller {
    public path = '/room/resources';
    public router = express.Router();
    private bookings = RoomResourcesModel;
   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.roomsResourcesList);
      this.router.get(`${this.path}/:id`, this.findRoomResourceById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(roomResourcesDto), this.addRoomsResource);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateRoomResourceById);
      this.router.delete(`${this.path}/delete`, authMiddleware, this.deleteRoomResourceById);
    }
   

    // list all room resources
    private roomsResourcesList = async (req:express.Request, res:express.Response) => {
        await this.bookings.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add post
    private addRoomsResource = async (req:express.Request, res:express.Response) => {
      const addPostData : roomResourcesDto = req.body
      const newPost = new this.bookings(addPostData)
      
      const saveNewPost = await newPost.save()
      .then(() => res.json({"Response":`Post ${addPostData.name} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get post Info by Id
  private findRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.bookings.findById(req.params.id)
    .then(booking => {
      if (booking)
        res.json(booking)
      else {
        next(new HttpException(404, 'RoomResource not found'));
      }
    })
  }


  // Update Exercide
   private updateRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updatePostData: PostInterface = req.body

    this.bookings.findByIdAndUpdate(id, updatePostData, {new: true})
    .then(booking => {
      if (booking)
        res.json({"Response":`Room Resource with id ${id} updated`})
      else{
        next(new BookingNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.body.id
        this.bookings.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Room Resource with id ${id} deleted successfully`});
          } else {
            next(new BookingNotFoundException(id));
          }
        })
    }
  // class end
  }

export default BookingsController