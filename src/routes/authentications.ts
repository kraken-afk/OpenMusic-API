import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import {
  AuthenticationResponse,
  type UserAuth,
  type RefreshTokenPayload,
} from "../app.d";
import UsersModel from "../models/UsersModel";
import TokenManager from "../helpers/TokenManager";
import AuthenticationsModel from "../models/AuthenticationsModel";
import InvariantError from "../errors/InvariantError";
import authenticationValidator from "../validators/authenticationsValidator";

export const loginRouter: ServerRoute = {
  path: "/authentications",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { username, password } = req.payload as UserAuth;
    let response: AuthenticationResponse;

    const user = await UsersModel.find({ username, password });

    if (!user.status) {
      response = {
        status: "fail",
        code: user.code as number,
        message: user.message,
      };

      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } else {
      const { id } = user.data;
      const accessToken = TokenManager.generateAccess({ id });
      const refreshToken = TokenManager.generateRefresh({ id });

      try {
        await AuthenticationsModel.add(refreshToken);
        response = {
          status: "success",
          code: user.code as number,
          data: {
            accessToken,
            refreshToken,
          },
        };

        const res = h.response(response).code(response.code);
        res.header(
          "Content-Length",
          String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
        );
        return res;
      } catch (error) {
        response = {
          status: "fail",
          code: error.code,
          message: error.message,
        };
        const res = h.response(response).code(response.code);
        res.header(
          "Content-Length",
          String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
        );
        return res;
      }
    }
  },
  options: {
    pre: [{ method: authenticationValidator.loginPayloadValidate }],
  },
};

export const refreshTokenRouter: ServerRoute = {
  path: "/authentications",
  method: "PUT",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { refreshToken } = req.payload as RefreshTokenPayload;

    try {
      const { token } = await AuthenticationsModel.verifyToken(
        refreshToken as string
      );
      const {
        payload: { id },
      } = TokenManager.verify(token);
      const accessToken = TokenManager.generateAccess(id);
      const response: AuthenticationResponse = {
        status: "success",
        code: 200,
        data: { accessToken },
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      if (error instanceof InvariantError) {
        const response: AuthenticationResponse = {
          status: "fail",
          code: error.code as number,
          message: error.message,
        };
        const res = h.response(response).code(response.code);
        res.header(
          "Content-Length",
          String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
        );
        return res;
      }
    }
  },
  options: {
    pre: [{ method: authenticationValidator.refreshTokenPayloadValidate }],
  },
};

export const deleteTokenRouter: ServerRoute = {
  path: "/authentications",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { refreshToken } = req.payload as RefreshTokenPayload;

    try {
      const { token } = await AuthenticationsModel.verifyToken(
        refreshToken as string
      );
      const { status, message, code } = await AuthenticationsModel.deleteToken(
        token
      );
      let response: AuthenticationResponse;

      if (!status)
        response = {
          status: "fail",
          code: code as number,
          message: message,
        };
      else
        response = {
          status: "success",
          code: code as number,
          message: message,
        };

      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      if (error instanceof InvariantError) {
        const response: AuthenticationResponse = {
          status: "fail",
          code: error.code as number,
          message: error.message,
        };
        const res = h.response(response).code(response.code);
        res.header(
          "Content-Length",
          String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
        );
        return res;
      }
    }
  },
  options: {
    pre: [{ method: authenticationValidator.deleteTokenPayloadValidate }],
  },
};
