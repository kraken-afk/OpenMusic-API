import { type ServerResponse, type UserCreation } from "../type";
import UsersModel from "../models/UsersModel";
import { validateUserCreation } from "../validators/usersValidator";
import { type Request, type ResponseToolkit, type ServerRoute } from "@hapi/hapi";

type UserResponse = ServerResponse<{ userId: string }>;

export const createUserRouter: ServerRoute = {
  path: "/users",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;
    const { username, fullname, password } = req.payload as UserCreation;
    const dbResponse = await UsersModel.create({
      username,
      fullname,
      password,
    });
    let response: UserResponse;

    if (!dbResponse.status) {
      response = {
        status: "fail",
        code: 500,
        message: dbResponse.message,
      };
    } else {
      response = {
        status: "success",
        code: 201,
        data: {
          userId: dbResponse.data.userId,
        },
      };
    }

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
    );

    return res;
  },
  options: {
    pre: [{ method: validateUserCreation }],
  },
};
