import express from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from '../interfaces/bookings.interface'
import BookingsModel from '../models/bookings.model'
import HttpException from '../exceptions/http/HttpException'
import BookingNotFoundException from '../exceptions/bookings/BookingNotFoundException' 
import BookingsDto from '../dtos/bookings.dto'
import validationMiddleware from '../middleware/validation.middleware'
import authMiddleware from '../middleware/auth.middleware';


class BookingsController implements Controller {
    public path = '/room/resources';
    public router = express.Router();
    private bookings = BookingsModel;
   
    constructor() {
      this.initializeRoutes()
    }

    private initializeRoutes() {
      this.router.get(this.path, this.bookingsList);
      this.router.get(`${this.path}/:id`, this.findBookingById);
      this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(BookingsDto), this.addBooking);
      this.router.patch(`${this.path}/update/:id`, authMiddleware, this.updateBookingById);
      this.router.delete(`${this.path}/delete`, authMiddleware, this.deleteBookingById);
    }
   

    // list all Bookings
    private bookingsList = async (req:express.Request, res:express.Response) => {
        await this.bookings.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err)) 
    } 

   
    // add post
    private addBooking = async (req:express.Request, res:express.Response) => {
      const addPostData : BookingsDto = req.body
      const newPost = new this.bookings(addPostData)
      
      const saveNewPost = await newPost.save()
      .then(() => res.json({"Response":`Post ${addPostData.name} added`}))
      .catch(err => res.status(400).json('Error: ' + err));
  }


  // Get post Info by Id
  private findBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.bookings.findById(req.params.id)
    .then(booking => {
      if (booking)
        res.json(booking)
      else {
        next(new HttpException(404, 'Booking not found'));
      }
    })
  }


  // Update Exercide
   private updateBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    const id = req.params.id
    const updatePostData: PostInterface = req.body

    this.bookings.findByIdAndUpdate(id, updatePostData, {new: true})
    .then(booking => {
      if (booking)
        res.json({"Response":`Booking with id ${id} updated`})
      else{
        next(new BookingNotFoundException(id))
      }
    }    

    )}


    // Delete by id
    private deleteBookingById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
        const id = req.body.id
        this.bookings.findByIdAndDelete(id)
        .then(successResponse => {
          if (successResponse) {
              res.json({"Response":`Booking with id ${id} deleted successfully`});
          } else {
            next(new BookingNotFoundException(id));
          }
        })
    }
  // class end
  }

export default BookingsController