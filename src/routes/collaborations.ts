import { type CollaborationCreationPayload, type ServerResponse } from "../app.d";
import { routeErrorHandler } from "../helpers/CommonErrorHandler";
import CollaborationsModel from "../models/CollaborationsModel";
import collaborationsValidator from "../validators/collaborationsValidator";
import { type Request, type ResponseToolkit, type ServerRoute } from "@hapi/hapi";

type CollaborationsResponse = ServerResponse<{ collaborationId: string }>;

export const createCollaborations: ServerRoute = {
  path: "/collaborations",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;
    const { id: ownerId } = req.auth.credentials as { id: string };
    const { playlistId, userId } = req.payload as CollaborationCreationPayload;

    try {
      const dbResponse = await CollaborationsModel.create(ownerId, playlistId, userId);
      let response: CollaborationsResponse;

      if (dbResponse.status) {
        response = {
          status: "success",
          code: 201,
          data: {
            collaborationId: dbResponse.data.collaborationsId,
          },
        };
      } else {
        response = {
          status: "fail",
          code: dbResponse.code as number,
          message: "Something went error",
        };
      }

      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
      );
      return res;
    }
  },
  options: {
    auth: {
      strategy: "openmusic_jwt",
    },
    pre: [
      {
        method: collaborationsValidator.createCollaborations,
      },
    ],
  },
};

export const removeUserFromCollaboration: ServerRoute = {
  path: "/collaborations",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id: credentialId } = req.auth.credentials as { id: string };
    const { userId, playlistId } = req.payload as CollaborationCreationPayload;

    try {
      await CollaborationsModel.removeUser(credentialId, playlistId, userId);
      const response: CollaborationsResponse = {
        status: "success",
        code: 200,
        message: `User with id: ${userId} has been removed as collaborator at playlist ${playlistId}`,
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
      );
      return res;
    }
  },
  options: {
    auth: {
      strategy: "openmusic_jwt",
    },
    pre: [
      {
        method: collaborationsValidator.removeUserCollaborations,
      },
    ],
  },
};
