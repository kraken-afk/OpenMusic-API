import { type ServerResponse, type UserCreation } from "../app.d";
import UsersModel from "../models/UsersModel";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

type UserResponse = ServerResponse<{ userId: string }>;

export async function validateUserCreation(req: Request, h: ResponseToolkit) {
  const payload = req.payload as UserCreation;
  const userScheme = Joi.object({
    username: Joi.string().required(),
    fullname: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = userScheme.validate(payload, { abortEarly: false });
  const isUsernameAlreadyExist =
    typeof payload?.username === "string"
      ? await UsersModel.isAlreadyExist(payload.username)
      : true;

  if (error == null && !isUsernameAlreadyExist) {
    return h.continue;
  } else {
    const message = error != null ? error.details.map(({ message }) => message) : [];

    if (isUsernameAlreadyExist && typeof payload?.username === "string") {
      message.push('"username" already exist');
    }

    const { stringify: s } = JSON;
    const response: UserResponse = {
      status: "fail",
      code: 400,
      message: message.join(", "),
    };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
    req.app = { invalidResponse: res };
    return res;
  }
}
