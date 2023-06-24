import type { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import ForbiddenError from "../errors/ForbiddenError";
import PlaylistsModel from "../models/PlaylistsModel";
import { routeErrorHandler } from "../helpers/CommonErrorHandler";
import { produce } from "../helpers/amqp/produce.amqp";
import { RABBITMQ_QEUE } from "../config/global";
import { ServerResponse } from "../type";
import Joi from "joi";
import InvariantError from "../errors/InvariantError";
import SongsModel from "../models/SongsModel";

export const exportPlaylistRouter: ServerRoute = {
  path: "/export/playlists/{playlistId}",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.auth.credentials;
    const { playlistId } = req.params;
    const targetEmail = (req.payload as { targetEmail: string })?.targetEmail;

    try {
      const playlist = await PlaylistsModel.getPlaylist(playlistId);

      if (playlist.owner !== id) throw new ForbiddenError("Forbiden resource");

      const { error } = Joi.string().email().required().validate(targetEmail);

      if (error) throw new InvariantError(error.message);

      const songs = await SongsModel.getAll({ where: { id: playlist.songs } });
      await produce(RABBITMQ_QEUE, {
        target: targetEmail,
        playlist,
        songs: songs.map(({ id, title, performer }) => ({ id, title, performer })),
      });

      const response: ServerResponse<never> = {
        status: "success",
        code: 201,
        message: "Permintaan Anda sedang kami proses",
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
  },
};
