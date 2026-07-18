import * as express from 'express'
import Controller from '../interfaces/controller.interface'
import AuthenticationService from '../services/authentication.service'
import validationMiddleware from '../middleware/validation.middleware'
import CreateUserDto from '../dtos/user.dto'
import LogInDto from '../dtos/login.dto'

class AuthenticationController implements Controller {

    public path = '/auth'
    public router = express.Router()

    constructor(private readonly authService = new AuthenticationService()) {
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
    private userList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.authService.listUsers())
      } catch (err) {
        next(err)
      }
    }

    // Get user Info by Id
    private findUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        res.json(await this.authService.getUserById(req.params.id))
      } catch (err) {
        next(err)
      }
    }

    // registration
    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const { user, cookie } = await this.authService.register(req.body)
        res.setHeader('Set-Cookie', [cookie])
        res.json({ "response": `user with username ${user.username} registered successfully` })
      } catch (err) {
        next(err)
      }
    }

    // login
    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const { user, cookie } = await this.authService.login(req.body)
        res.setHeader('Set-Cookie', [cookie])
        res.json(user)
      } catch (err) {
        next(err)
      }
    }

    // logout
    private loggingOut = (req: express.Request, res: express.Response) => {
      res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
      res.json({ "response": "logged out successfully" });
    }
}

export default AuthenticationController
