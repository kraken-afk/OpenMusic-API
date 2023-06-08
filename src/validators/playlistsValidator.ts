import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { PlaylistCreation, PlaylistsResponse } from "../app.d";

export default abstract class playlistValidator {
  static createValidator(req: Request, h: ResponseToolkit) {
    const { name } = req.payload as Omit<PlaylistCreation, "owner">;
    const playlistCreationScheme = Joi.object({
      name: Joi.string().required().max(255),
    });

    const { error } = playlistCreationScheme.validate(
      { name },
      {
        abortEarly: false,
      }
    );

    if (!error) return h.continue;
    else {
      const { stringify: s } = JSON;
      const response: PlaylistsResponse = {
        status: "fail",
        code: 400,
        message: error.details.map(({ message }) => message).join(", "),
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

  static addSongPayloadValidator(req: Request, h: ResponseToolkit) {
    const { songId } = req.payload as { songId: unknown };
    const addSongScheme = Joi.object({
      songId: Joi.string().required(),
    });
    const { error } = addSongScheme.validate(
      { songId },
      {
        abortEarly: false,
      }
    );

    if (!error) return h.continue;
    else {
      const { stringify: s } = JSON;
      const response: PlaylistsResponse = {
        status: "fail",
        code: 400,
        message: error.details.map(({ message }) => message).join(", "),
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

  static removeSongPayloadValidator(req: Request, h: ResponseToolkit) {
    const { songId } = req.payload as { songId: unknown };
    const addSongScheme = Joi.object({
      songId: Joi.string().required(),
    });
    const { error } = addSongScheme.validate(
      { songId },
      {
        abortEarly: false,
      }
    );

    if (!error) return h.continue;
    else {
      const { stringify: s } = JSON;
      const response: PlaylistsResponse = {
        status: "fail",
        code: 400,
        message: error.details.map(({ message }) => message).join(", "),
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
}
