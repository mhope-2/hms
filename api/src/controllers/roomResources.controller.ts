import express from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from '../interfaces/roomResources.interface'
import RoomResourcesModel from '../models/roomResources.model'
import HttpException from '../exceptions/http/HttpException'
import RoomResourceNotFoundException from '../exceptions/roomResources/RoomResourceNotFoundException' 
import roomResourcesDto from '../dtos/roomResources.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


class RoomResourcesController implements Controller {
    public path = '/posts';
    public router = express.Router();
    private post = RoomResourcesModel;
   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.roomsResourcesList);
      this.router.get(`${this.path}/:id`, this.findRoomResourceById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(roomResourcesDto), this.addRoomsResource);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updatePostById);
      this.router.delete(`${this.path}/delete`, authMiddleware, this.deletePostById);
    }
   

    // list all room resources
    private roomsResourcesList = async (req:express.Request, res:express.Response) => {
        await this.post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add post
    private addRoomsResource = async (req:express.Request, res:express.Response) => {
      const addPostData : roomResourcesDto = req.body
      const newPost = new this.post(addPostData)
      
      const saveNewPost = await newPost.save()
      .then(() => res.json({"Response":`Post ${addPostData.postTitle} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get post Info by Id
  private findRoomResourceById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.post.findById(req.params.id)
    .then(post => {
      if (post)
        res.json(post)
      else {
        next(new HttpException(404, 'Post not found'));
      }
    })
  }


  // Update Exercide
   private updatePostById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updatePostData: PostInterface = req.body

    this.post.findByIdAndUpdate(id, updatePostData, {new: true})
    .then(post => {
      if (post)
        res.json({"Response":`Post with id ${id} updated`})
      else{
        next(new RoomResourceNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deletePostById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.body.id
        this.post.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Post with id ${id} deleted successfully`});
          } else {
            next(new RoomResourceNotFoundException(id));
          }
        })
    }
  // class end
  }

export default RoomsResourcesController