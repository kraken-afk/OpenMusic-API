import process from 'node:process'
import { token, type HapiJwt } from '@hapi/jwt'
import InvariantError from '../errors/InvariantError'

export default abstract class TokenManager {
  public static generateAccess (payload: HapiJwt.Payload): string {
    return token.generate(
      payload,
      process.env.ACCESS_TOKEN_KEY as HapiJwt.Secret
    )
  }

  public static generateRefresh (payload: HapiJwt.Payload): string {
    return token.generate(
      payload,
      process.env.REFRESH_TOKEN_KEY as HapiJwt.Secret
    )
  }

  public static verify (refreshToken: string): HapiJwt.DecodedToken {
    try {
      const artifacts = token.decode(refreshToken)
      token.verifySignature(
        artifacts,
        process.env.REFRESH_TOKEN_KEY as HapiJwt.Secret
      )
      return artifacts.decoded
    } catch (error) {
      throw new InvariantError(error.message, 400)
    }
  }
}
