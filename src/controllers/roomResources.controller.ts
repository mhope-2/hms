import express from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from '../interfaces/roomResources.interface'
import RoomResourcesModel from '../models/roomResources.model'
import HttpException from '../exceptions/http/HttpException'
import RoomResourceNotFoundException from '../exceptions/roomResources/RoomResourceNotFoundException' 
import RoomResourcesDto from '../dtos/roomResources.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


class RoomResourcesController implements Controller {
    public path = '/room/resources';
    public router = express.Router();
    private roomResource = RoomResourcesModel;
   
    constructor() {
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
    private roomsResourcesList = async (req:express.Request, res:express.Response) => {
        await this.roomResource.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add Room Resource
    private addRoomsResource = async (req:express.Request, res:express.Response) => {
      const addPostData : RoomResourcesDto = req.body
      const newPost = new this.roomResource(addPostData)
      
      const saveNewPost = await newPost.save()
      .then(() => res.json({"Response":`Post ${addPostData.name} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get Room Resource Details by Id
  private findRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.roomResource.findById(req.params.id)
    .then(roomResource => {
      if (roomResource)
        res.json(roomResource)
      else {
        next(new HttpException(404, 'RoomResource not found'));
      }
    })
  }


  // Update Room Resource
   private updateRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updatePostData: PostInterface = req.body

    this.roomResource.findByIdAndUpdate(id, updatePostData, {new: true})
    .then(roomResource => {
      if (roomResource)
        res.json({"Response":`Room Resource with id ${id} updated`})
      else{
        next(new RoomResourceNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.params.id
        this.roomResource.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Room Resource with id ${id} deleted successfully`});
          } else {
            next(new RoomResourceNotFoundException(id));
          }
        })
    }
  // class end
  }

export default RoomResourcesController