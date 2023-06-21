export default class NotFoundError extends Error {
  public code = 404;

  constructor(public message: string) {
    super(message);
  }
}
