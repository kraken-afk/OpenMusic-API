import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import PlaylistsModel from "../models/PlaylistsModel";
import AuthorizationError from "../errors/AuthorizationError";
import playlistValidator from "../validators/playlistsValidator";
import UsersModel from "../models/UsersModel";
import {
  PlaylistCreation,
  DatabaseResponse,
  ServerResponse,
  Playlist,
} from "../app.d";
import { routeErrorHandler } from "../helpers/CommonErrorHandler";

type PlaylistsResponse = ServerResponse<{
  playlists?: Playlist[];
  playlistId?: string;
  playlist?: any;
}>;

export const createPlaylist: ServerRoute = {
  path: "/playlists",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    try {
      const { name } = req.payload as Omit<PlaylistCreation, "owner">;
      const { id: owner } = req.auth.credentials;

      if (!owner) throw new AuthorizationError("Invalid credentials");

      const dbResponse: DatabaseResponse<{ playlistId: string }> =
        await PlaylistsModel.create({ name, owner } as PlaylistCreation);
      let response: PlaylistsResponse;

      if (!dbResponse.status)
        response = {
          status: "fail",
          code: dbResponse.code as number,
          message: dbResponse.message,
        };
      else
        response = {
          status: "success",
          code: 201,
          data: {
            playlistId: dbResponse.data.playlistId,
          },
        };

      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );

      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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
        method: playlistValidator.createValidator,
      },
    ],
  },
};

export const getPlaylists: ServerRoute = {
  path: "/playlists",
  method: "GET",
  handler: async (req: Request, h: ResponseToolkit) => {
    try {
      const { id } = req.auth.credentials;

      if (!id) throw new AuthorizationError("Invalid credentials");

      const playlists = await PlaylistsModel.getAll({ owner: id as string });
      const response: PlaylistsResponse = {
        status: "success",
        code: 200,
        data: { playlists },
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      console.error(error);
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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

export const removePlaylist: ServerRoute = {
  path: "/playlists/{id}",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    try {
      const { id } = req.params;
      const { id: ownerId } = req.auth.credentials as { id: string };

      await PlaylistsModel.remove(id as string, ownerId);

      const response: PlaylistsResponse = {
        status: "success",
        code: 200,
        message: `Playlist with id: ${id} removed`,
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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

export const addSongsRouter: ServerRoute = {
  path: "/playlists/{id}/songs",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { id: ownerId } = req.auth.credentials as { id: string };
    const { id: playlistId } = req.params;
    const { songId } = req.payload as { songId: string };

    try {
      await PlaylistsModel.addSong({ playlistId, ownerId }, songId);
      const response: PlaylistsResponse = {
        status: "success",
        code: 201,
        message: `Song with id: ${songId} added to playlist with id: ${playlistId}`,
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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
        method: playlistValidator.addSongPayloadValidator,
      },
    ],
  },
};

export const getSongsInPlaylist: ServerRoute = {
  path: "/playlists/{id}/songs",
  method: "GET",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { id: ownerId } = req.auth.credentials as { id: string };
    const { id: playlistId } = req.params as { id: string };

    try {
      const songs = await PlaylistsModel.getSongs({ ownerId, playlistId });
      const playlist = await PlaylistsModel.getPlaylist(playlistId);
      const username = await UsersModel.getUsername(playlist.owner);
      const response: PlaylistsResponse = {
        status: "success",
        code: 200,
        data: {
          playlist: {
            id: playlistId,
            name: playlist.name,
            username,
            songs,
          },
        },
      };

      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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

export const removeSongInPlaylist: ServerRoute = {
  path: "/playlists/{id}/songs",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { id: ownerId } = req.auth.credentials as { id: string };
    const { id: playlistId } = req.params;
    const { songId } = req.payload as { songId: string };

    try {
      await PlaylistsModel.removeSong(songId, { ownerId, playlistId });
      const response: PlaylistsResponse = {
        status: "success",
        code: 200,
        message: `Song with id: ${songId} removed from playlist with id: ${playlistId}`,
      };
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
      );
      return res;
    } catch (error) {
      const response = routeErrorHandler(error);
      const res = h.response(response).code(response.code);
      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
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
        method: playlistValidator.removeSongPayloadValidator,
      },
    ],
  },
};
