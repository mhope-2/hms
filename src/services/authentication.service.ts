import * as bcrypt from 'bcrypt'
import UsersRepository, { UserDocument } from '../repositories/users.repository'
import TokenService from './token.service'
import CreateUserDto from '../dtos/user.dto'
import LogInDto from '../dtos/login.dto'
import PasswordMismatchException from '../exceptions/auth/PasswordMismatchException'
import InvalidPasswordLengthException from '../exceptions/auth/InvalidPasswordLengthException'
import UserWithThatEmailAlreadyExistsException from '../exceptions/auth/UserWithThatEmailAlreadyExistsException'
import UserWithThatUsernameAlreadyExistsException from '../exceptions/auth/UserWithThatUsernameAlreadyExistsException'
import InvalidCredentialsException from '../exceptions/auth/InvalidCredentialsException'
import UserNotFoundException from '../exceptions/auth/UserNotFoundException'

class AuthenticationService {
  constructor(
    private readonly users = new UsersRepository(),
    private readonly tokenService = new TokenService(),
  ) {}

  public listUsers(): Promise<UserDocument[]> {
    return this.users.findAll()
  }

  public async getUserById(id: string): Promise<UserDocument> {
    const user = await this.users.findById(id)
    if (!user) throw new UserNotFoundException(404)
    return user
  }

  public async register(userData: CreateUserDto): Promise<{ user: UserDocument, cookie: string }> {
    if (userData.password !== userData.password2) throw new PasswordMismatchException()
    if (userData.password.length < 6) throw new InvalidPasswordLengthException()
    if (await this.users.findByEmail(userData.email)) throw new UserWithThatEmailAlreadyExistsException(userData.email)
    if (await this.users.findByUsername(userData.username)) throw new UserWithThatUsernameAlreadyExistsException(userData.username)

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await this.users.create({ ...userData, password: hashedPassword })

    const cookie = await this.issueToken(user)
    user.password = ''
    return { user, cookie }
  }

  public async login(logInData: LogInDto): Promise<{ user: UserDocument, cookie: string }> {
    const user = await this.users.findByUsernameWithPassword(logInData.username)
    if (!user) throw new InvalidCredentialsException()

    const isPasswordMatching = await bcrypt.compare(logInData.password, user.password)
    if (!isPasswordMatching) throw new InvalidCredentialsException()

    const cookie = await this.issueToken(user)
    user.password = ''
    return { user, cookie }
  }

  // The auth middleware verifies with JWT_REFRESH_SECRET, so the cookie
  // must always carry the refresh-secret token (see token.service.ts).
  private async issueToken(user: UserDocument): Promise<string> {
    const tokenData = this.tokenService.createRefreshToken(user as any)
    await this.users.updateById((user as any)._id, { token: tokenData.token })
    return this.tokenService.buildAuthCookie(tokenData)
  }
}

export default AuthenticationService
