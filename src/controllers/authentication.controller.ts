import * as bcrypt from 'bcrypt'
import * as express from 'express'
// const bcrypt = require('bcrypt')
import UserWithThatEmailAlreadyExistsException from '../exceptions/auth/UserWithThatEmailAlreadyExistsException'
import InvalidCredentialsException from '../exceptions/auth/InvalidCredentialsException'
import PasswordMismatchException from '../exceptions/auth/PasswordMismatchException'
import InvalidPasswordLengthException from '../exceptions/auth/InvalidPasswordLengthException'
import UserNotFoundException from '../exceptions/auth/UserNotFoundException'
import UserWithThatUsernameAlreadyExistsException from '../exceptions/auth/UserWithThatUsernameAlreadyExistsException'
import Controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware'
import CreateUserDto from '../dtos/user.dto'
import UserModel from '../models/user.model'
import LogInDto from '../login/login.dto'
import TokenData from '../interfaces/tokenData.interface'
import UserInterface from '../interfaces/user.interface'
import DataStoredInToken from '../interfaces/dataStoredInToken.interface'
const jwt = require('jsonwebtoken')

class AuthenticationController implements Controller {

    public path = '/auth'
    public router = express.Router()
    private user = UserModel

    constructor() {
        this.initializeRoutes()
      }
    
    private initializeRoutes() {

        this.router.get(`${this.path}/users`, this.userList)
        this.router.get(`${this.path}/:id`, this.findUserById)
        this.router.post(`${this.path}/user/register`, validationMiddleware(CreateUserDto), this.registration)
        this.router.post(`${this.path}/user/login`, validationMiddleware(LogInDto), this.loggingIn)
        this.router.post(`${this.path}/user/logout`, this.loggingOut);

      }


    // get all users  
    private userList = async (req, res) => {
        await this.user.find()
          .then(users => {
            for (let usersItem =0; usersItem<users.length; usersItem++){
              delete usersItem["password"]
            }
              res.json(users)
          }) 
          .catch(err => res.status(400).json('Error: ' + err))
    } 

    // Get Exercise Info by Id
  private findUserById = async (req:express.Request, res:express.Response, next:express.NextFunction) => {

    this.user.findById(req.params.id)
    .then(user => {
      if (user)
        res.json(user)
      else {
        next(new UserNotFoundException(404))
      }
    })
  }

    // registration middleware
    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = req.body
        
        const passwordsMatch = userData.password === userData.password2 ? true : false
        
        if (passwordsMatch) {

            if(userData.password.length < 6){
              next(new InvalidPasswordLengthException())
            }

            if(req.body.password != req.body.password2){
              next(new PasswordMismatchException())
            }

            if ( await this.user.findOne({ email: userData.email }) ) {
              next(new UserWithThatEmailAlreadyExistsException(userData.email))
            } 

            if ( await this.user.findOne({ username: userData.username }) ) {
              next(new UserWithThatUsernameAlreadyExistsException(userData.username))
            } 

            // create user
            const hashedPassword = await bcrypt.hash(userData.password, 10)
            const user = await this.user.create({
              ...userData,
              password: hashedPassword,
            })
            const tokenData = this.createToken(user)
              // assign token to created user
              const token = this.setCookie(tokenData)
              this.user.findOne({_id: user._id}, function(err, user){
                user.token = token;
                user.save((err) => {
                  if (err) {
                    console.log(err)
                  }
                });
             });
            user.password = ''
            res.setHeader('Cookie', [this.setCookie(tokenData)])
            res.json({"response": `user with username ${user.username} registered successfully`})
          }  
          else {
            next(new PasswordMismatchException())
          }                      
      } 


      // login middleware
      private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = req.body
        const user = await this.user.findOne({ username: logInData.username })
        if (user) {
          const isPasswordMatching = await bcrypt.compare(logInData.password, user.password)
          if (isPasswordMatching) {

          const tokenData = this.refreshToken(user)
            // assign token to created user
            const token = this.setCookie(tokenData)
            this.user.findOne({_id: user._id}, function(err, user){
              user.token = token;
              user.save((err) => {
                if (err) {
                  console.log(err)
                }
              });
           });

            user.password = ''
            
            res.json(user)
          } else {
            next(new InvalidCredentialsException())
          }
        } else {
          next(new InvalidCredentialsException())
        }
      }

      private setCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
      }

      get getCookie(){
        return this.setCookie
      }

    // create token
      private createToken(user): TokenData {
        const expiresIn = Number(process.env.JWT_EXPIRES) || 60 * 60
        const secret = process.env.JWT_SECRET
        const dataStoredInToken: DataStoredInToken = {
          _id: user._id
        }
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        }
      }


      // create token
      private refreshToken(user): TokenData {
        const expiresIn = Number(process.env.JWT_REFRESH_EXPIRES) || 60 * 60
        const secret = process.env.JWT_REFRESH_SECRET
        const dataStoredInToken: DataStoredInToken = {
          _id: user._id
        }
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        }
      }


      // logout
      private loggingOut = (req: express.Request, res: express.Response) => {
        res.setHeader('Cookie', ['Authorization=;Max-age=0']);
        res.json({"response": "logged out successfully"});
      }

}    

export default AuthenticationController