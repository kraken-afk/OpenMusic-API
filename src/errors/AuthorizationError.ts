export default class AuthorizationError extends Error {
  code: number = 401;
  constructor(public message: string) {
    super(message);
  }
}
