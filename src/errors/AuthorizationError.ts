export default class AuthorizationError extends Error {
  public code = 401;
  constructor(public message: string) {
    super(message);
  }
}
