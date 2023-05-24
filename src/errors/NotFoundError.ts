export default class NotFoundError extends Error {
  constructor(
    public message: string,
    public code: number,
  ) {
    super(message);
  }
}