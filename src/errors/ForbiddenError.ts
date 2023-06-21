export default class ForbiddenError extends Error {
  public code = 403;

  constructor(public message: string) {
    super(message);
  }
}
