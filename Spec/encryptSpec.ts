import { randomUUID } from "crypto";
import Encrypt from "../src/helpers/Encrypt";

describe("Encrypt Helper test case", () => {
  const encrypt = new Encrypt();

  it("Should be an contructor object", () => {
    expect(encrypt).toBeInstanceOf(Encrypt);
  });

  it("Should returning string that unequal from given input", () => {
    const password = randomUUID();
    const hashedString = encrypt.generate(password);

    expect(typeof hashedString).toBe("string");
    expect(hashedString).not.toBe(password);
  });

  it("Should be able to compare hashed string", () => {
    const password = randomUUID();
    const hashedPassword = encrypt.generate(password);

    console.time();
    expect(encrypt.match(password, hashedPassword)).toBe(true);
    console.timeEnd();

    console.timeLog();
  });
});
