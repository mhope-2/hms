const jwt = require('jsonwebtoken')
import express from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from '../interfaces/roomResources.interface'
import RoomsModel from '../models/rooms.model'
import HttpException from '../exceptions/http/HttpException'
import PostNotFoundException from '../exceptions/post/PostNotFoundException' 
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
   

    // list all posts
    private roomsList = async (req:express.Request, res:express.Response) => {
        await this.room.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add post
    private addRoom = async (req:express.Request, res:express.Response) => {
      const addPostData : roomsDto = req.body
      const newPost = new this.post(addPostData)
      
      const saveNewPost = await newPost.save()
      .then(() => res.json({"Response":`Post ${addPostData.postTitle} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get post Info by Id
  private findRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

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
   private updateRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updatePostData: PostInterface = req.body

    this.post.findByIdAndUpdate(id, updatePostData, {new: true})
    .then(post => {
      if (post)
        res.json({"Response":`Post with id ${id} updated`})
      else{
        next(new PostNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteRoomById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.body.id
        this.post.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Post with id ${id} deleted successfully`});
          } else {
            next(new PostNotFoundException(id));
          }
        })
    }
  // class end
  }

export default RoomsController