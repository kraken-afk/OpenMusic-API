import { type CollaborationCreationPayload, type ServerResponse } from "../app.d";
import { type Request, type ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

type CollaborationsResponse = ServerResponse<{ collaborationId: string }>;

export default abstract class collaborationsValidator {
  static createCollaborations(req: Request, h: ResponseToolkit) {
    const { playlistId, userId } = req.payload as CollaborationCreationPayload;
    const collaborationCreationScheme = Joi.object({
      playlistId: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error } = collaborationCreationScheme.validate(
      { playlistId, userId },
      {
        abortEarly: false,
      },
    );

    if (error == null) return h.continue;
    else {
      const { stringify: s } = JSON;
      const response: CollaborationsResponse = {
        status: "fail",
        code: 400,
        message: error.details.map(({ message }) => message).join(", "),
      };

      const res = h.response(response).code(response.code);
      res.header("Content-Type", "application/json");
      res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
      req.app = { invalidResponse: res };
      return res;
    }
  }

  static removeUserCollaborations(req: Request, h: ResponseToolkit) {
    const { playlistId, userId } = req.payload as CollaborationCreationPayload;
    const collaborationCreationScheme = Joi.object({
      playlistId: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error } = collaborationCreationScheme.validate(
      { playlistId, userId },
      {
        abortEarly: false,
      },
    );

    if (error == null) return h.continue;
    else {
      const { stringify: s } = JSON;
      const response: CollaborationsResponse = {
        status: "fail",
        code: 400,
        message: error.details.map(({ message }) => message).join(", "),
      };

      const res = h.response(response).code(response.code);
      res.header("Content-Type", "application/json");
      res.header("Content-Length", String(Buffer.byteLength(s(response), "utf-8")));
      req.app = { invalidResponse: res };
      return res;
    }
  }
}
