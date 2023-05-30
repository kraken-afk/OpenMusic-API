import { type HashOptions, type BinaryToTextEncoding, createHash } from "node:crypto";

export default class Encrypt {
  constructor(
    protected algorithm: string = "sha256",
    protected encoding: BinaryToTextEncoding = "base64"
  ) {}

  public generate(data: string, options?: HashOptions | undefined): string {
    const { algorithm, encoding } = this;
    const hashedValue = createHash(algorithm, options).update(data).digest(encoding);

    return hashedValue;
  }

  public match(input: string, hashedInput: string): boolean {
    return (this.generate(input) === hashedInput);
  }
}
