import shortid from "shortid";
import {
  DatabaseResponse,
  UserCreation,
  DatabaseResponsePositive,
  DatabaseResponseNegative,
  UserAuth,
} from "../app.d";
import { Users, UsersScheme } from "../config/init";
import { encrypt } from "../helpers";
import { Op } from "sequelize";

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
    const user = await Users.findOne({ where: { username }, raw: true });
    return user !== null;
  }

  static async find({
    username,
    password,
  }: UserAuth): Promise<DatabaseResponse<UsersScheme>> {
    const usn = await Users.findOne({ where: { username }, raw: true });

    if (!usn) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 401,
        message: "Couldn't find username: " + username,
      };
      return response;
    }

    const user = await Users.findOne({
      where: { [Op.and]: { username, password: encrypt.generate(password) } },
      raw: true,
    });

    if (!user) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 401,
        message: "Username and password doesn't match"
      }
      return response;
    }

    const response: DatabaseResponsePositive<any> = {
      status: true,
      code: 201,
      data: { ...user },
    };

    return response;
  }
}
