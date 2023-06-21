export default class InvariantError extends Error {
  public code = 400;

  constructor(public message: string) {
    super(message);
  }
}
