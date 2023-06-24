import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { routeErrorHandler } from "../helpers/CommonErrorHandler";
import { ServerResponse } from "../type";
import UserAlbumLikesModel from "../models/UserAlbumLikesModel";
import AlbumsModel from "../models/AlbumsModel";
import { CacheClient } from "../cache";

export const postLikesRouter: ServerRoute = {
  path: "/albums/{id}/likes",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials as { id: string };

    try {
      await UserAlbumLikesModel.add({ albumId, userId });
      const response: ServerResponse<never> = {
        status: "success",
        code: 201,
        message: `${userId} liked ${albumId}`,
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

export const deleteLikesRouter: ServerRoute = {
  path: "/albums/{id}/likes",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials as { id: string };

    try {
      await UserAlbumLikesModel.delete({ albumId, userId });
      const response: ServerResponse<never> = {
        status: "success",
        code: 200,
        message: `${userId} unliked ${albumId}`,
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

export const getLikesCountRouter: ServerRoute = {
  path: "/albums/{id}/likes",
  method: "GET",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params;

    try {
      const likeCount = await AlbumsModel.getLikeCount(id);
      const response: ServerResponse<{ likes: number }> = {
        status: "success",
        code: 200,
        data: {
          likes: likeCount,
        },
      };
      const res = h.response(response).code(response.code);

      res.header(
        "Content-Length",
        String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
      );

      // set the logic contrary of isChangedState because
      // the state is changed before returning the value
      if (CacheClient.isChangedState.fromCache) res.header("X-Data-Source", "cache");

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
};
