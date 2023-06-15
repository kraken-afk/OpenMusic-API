export default class AuthorizationError extends Error {
  code = 401
  constructor (public message: string) {
    super(message)
  }
}
