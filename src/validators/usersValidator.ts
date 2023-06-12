import Joi from "joi";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import { UserCreation, ServerResponse } from "../app.d";
import UsersModel from "../models/UsersModel";

type UserResponse = ServerResponse<{ userId: string }>;

export async function validateUserCreation(req: Request, h: ResponseToolkit) {
  const payload = req.payload as UserCreation;
  const userScheme = Joi.object({
    username: Joi.string().alphanum().required(),
    fullname: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = userScheme.validate(payload);
  const isUsernameAlreadyExist = await UsersModel.isAlreadyExist(payload.username);

  if (!error && !isUsernameAlreadyExist)
    return h.continue;
  else {
    const message = error ? error.details.map(({ message }) => message) : [];

    if (isUsernameAlreadyExist)
      message.push("\"username\" already exist");

    const { stringify: s } = JSON;
    const response: UserResponse = {
      status: "fail",
      code: 400,
      message: message.join(", "),
    };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(s(response), "utf-8"))
    );
    req.app = { invalidResponse: res };
    return res;
  }
}