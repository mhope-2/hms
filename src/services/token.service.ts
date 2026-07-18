import TokenData from '../interfaces/tokenData.interface'
import DataStoredInToken from '../interfaces/dataStoredInToken.interface'
const jwt = require('jsonwebtoken')

class TokenService {

  public createAccessToken(user: { _id: any }): TokenData {
    return this.sign(user, process.env.JWT_SECRET, Number(process.env.JWT_EXPIRES) || 60 * 60)
  }

  // auth.middleware verifies against JWT_REFRESH_SECRET, so this is the
  // token that must be set as the Authorization cookie.
  public createRefreshToken(user: { _id: any }): TokenData {
    return this.sign(user, process.env.JWT_REFRESH_SECRET, Number(process.env.JWT_REFRESH_EXPIRES) || 60 * 60)
  }

  public buildAuthCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  private sign(user: { _id: any }, secret: string | undefined, expiresIn: number): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    }
  }
}

export default TokenService
