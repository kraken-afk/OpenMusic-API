import { type RefreshTokenPayload, type ServerResponse, type UserAuth } from "../app.d";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

type AuthenticationResponse = ServerResponse<{
  accessToken?: string;
  refreshToken?: string;
}>;

export default abstract class authenticationValidator {
  static loginPayloadValidate(req: Request, h: ResponseToolkit) {
    const { username, password } = req.payload as UserAuth;
    const userAuthScheme = Joi.object({
      username: Joi.string().alphanum().required(),
      password: Joi.string().required(),
    });

    const { error } = userAuthScheme.validate({ username, password });

    if (error == null) return h.continue;
    else {
      const response: AuthenticationResponse = {
        status: "fail",
        code: 400,
        message: "Bad request",
      };
      const res = h.response(response).code(response.code);
      req.app = { invalidResponse: res };
      return res;
    }
  }

  static refreshTokenPayloadValidate(req: Request, h: ResponseToolkit) {
    const { refreshToken } = req.payload as RefreshTokenPayload;
    const refreshTokenScheme = Joi.object({
      refreshToken: Joi.string().required(),
    });
    const { error } = refreshTokenScheme.validate({ refreshToken });

    if (error == null) return h.continue;
    else {
      const response: AuthenticationResponse = {
        status: "fail",
        code: 400,
        message: "Bad request",
      };
      const res = h.response(response).code(response.code);
      req.app = { invalidResponse: res };
      return res;
    }
  }

  static deleteTokenPayloadValidate(req: Request, h: ResponseToolkit) {
    const { refreshToken } = req.payload as RefreshTokenPayload;
    const refreshTokenScheme = Joi.object({
      refreshToken: Joi.string().required(),
    });
    const { error } = refreshTokenScheme.validate({ refreshToken });

    if (error == null) return h.continue;
    else {
      const response: AuthenticationResponse = {
        status: "fail",
        code: 400,
        message: "Bad request",
      };
      const res = h.response(response).code(response.code);
      req.app = { invalidResponse: res };
      return res;
    }
  }
}
