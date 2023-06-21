import {
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
  type UserAuth,
  type UserCreation,
} from "../app.d";
import { Users, type UsersScheme } from "../config/init";
import NotFoundError from "../errors/NotFoundError";
import { encrypt } from "../helpers";
import { Op } from "sequelize";
import shortid from "shortid";

export default abstract class UsersModel {
  static async create({
    username,
    fullname,
    password,
  }: UserCreation): Promise<DatabaseResponse<{ userId: string }>> {
    try {
      const id = `user-${shortid()}`;
      const hashedPassword = encrypt.generate(password);
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

    if (usn == null) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 401,
        message: `Couldn't find username: ${username}`,
      };
      return response;
    }

    const user = await Users.findOne({
      where: { [Op.and]: { username, password: encrypt.generate(password) } },
      raw: true,
    });

    if (user == null) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 401,
        message: "Username and password doesn't match",
      };
      return response;
    }

    const response: DatabaseResponsePositive<any> = {
      status: true,
      code: 201,
      data: { ...user },
    };

    return response;
  }

  static async getUsername(id: string) {
    const user = await Users.findByPk(id, { raw: true });

    if (user == null) {
      throw new NotFoundError(`User with id: ${id} doesn't exist`);
    }
    return user.username;
  }
}
