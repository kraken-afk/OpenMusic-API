export default class InternalServerError extends Error {
  public code = 500;

  constructor(public message: string) {
    super(message);
  }
}
