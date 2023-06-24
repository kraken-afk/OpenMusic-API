import {
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
} from "../type";
import { Auth } from "../config/init";
import InternalServerError from "../errors/InternalServerError";
import InvariantError from "../errors/InvariantError";

export default abstract class AuthenticationsModel {
  static async add(token: string): Promise<boolean> {
    try {
      await Auth.create({ token });
      return true;
    } catch (error) {
      console.error(error)
      throw new InternalServerError("Internal server error");
    }
  }

  static async verifyToken(refreshToken: string): Promise<{ token: string }> {
    const token = await Auth.findOne({
      where: { token: refreshToken },
      attributes: ["token"],
    });

    if (token == null) throw new InvariantError("Invalid token");

    return token;
  }

  static async deleteToken(refreshToken: string): Promise<DatabaseResponse<object>> {
    const affectedRow = await Auth.destroy({ where: { token: refreshToken } });

    if (affectedRow === 0) {
      const response: DatabaseResponseNegative = {
        status: false,
        code: 400,
        message: "Couldn't found token in the database",
      };
      return response;
    }
    const response: DatabaseResponsePositive<object> = {
      status: true,
      code: 200,
      message: "Token deleted",
      data: {},
    };
    return response;
  }
}
