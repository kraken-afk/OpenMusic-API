export default class ForbiddenError extends Error {
  public code: number = 403;

  constructor(
    public message: string
  ) {
    super(message);
  }
}
