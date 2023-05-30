import shortid from "shortid";
import {
  DatabaseResponse,
  UserCreation,
  DatabaseResponsePositive,
  DatabaseResponseNegative,
} from "../app.d";
import { Users } from "../config/init";
import { encrypt } from "../helpers";

export default abstract class UsersModel {
  static async create({
    username,
    fullname,
    password,
  }: UserCreation): Promise<DatabaseResponse<{ userId: string }>> {
    const id = "user-" + shortid();
    const hashedPassword = encrypt.generate(password);

    try {
      await Users.create({ id, username, fullname, password: hashedPassword });
      const response: DatabaseResponsePositive<{ userId: string }> = {
        status: true,
        data: {
          userId: id,
        },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
      };
      return response;
    }
  }

  static async isAlreadyExist(username: string): Promise<boolean> {
    const user = await Users.findOne({ where: { username } , raw: true })
    return (user !== null);
  }
}
