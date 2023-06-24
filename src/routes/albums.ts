import { type Album, type AlbumsCreation, type ServerResponse } from "../type";
import type { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { routeErrorHandler } from "../helpers/CommonErrorHandler";
import { coverUploadsValidator } from "../validators/coverUploadsValidator";
import { existsSync } from "node:fs";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { Albums } from "../config/init";
import { URL } from "node:url";
import { Buffer } from "node:buffer";
import path, { resolve } from "node:path";
import AlbumsModel from "../models/AlbumsModel";
import SongsModel from "../models/SongsModel";
import validateAlbumCreation from "../validators/albumsValidator";
import InvariantError from "../errors/InvariantError";

type AlbumsResponse = ServerResponse<{ albumId: string } | { album: Album }>;

export const getAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "GET",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params;
    const album = await AlbumsModel.get(id);
    let response: AlbumsResponse;

    if (album == null) {
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    } else {
      album.songs = await SongsModel.getAll({
        attributes: ["id", "title", "performer"],
        where: { albumId: album.id },
      });
      response = {
        status: "success",
        code: 200,
        data: {
          album,
        },
      };
    }

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
    );

    return res;
  },
};

export const createAlbumRouter: ServerRoute = {
  path: "/albums",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { name, year } = req.payload as AlbumsCreation;
    const dbResponse = await AlbumsModel.create({ name, year });
    let response: AlbumsResponse;

    if (!dbResponse.status) {
      response = {
        status: "fail",
        code: 500,
        message: dbResponse.message,
      };
    } else {
      response = {
        status: "success",
        code: 201,
        data: {
          albumId: dbResponse.data.albumId,
        },
      };
    }

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
    );

    return res;
  },
  options: {
    pre: [{ method: validateAlbumCreation }],
  },
};

export const updateAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "PUT",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { id } = req.params;
    const album = req.payload as AlbumsCreation;
    const { status } = await AlbumsModel.update(id, album);
    let response: AlbumsResponse;

    if (!status) {
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    } else {
      response = {
        status: "success",
        code: 200,
        message: "Album has been updated",
      };
    }

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
    );

    return res;
  },
  options: {
    pre: [{ method: validateAlbumCreation }],
  },
};

export const deleteAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params;
    const { status } = await AlbumsModel.remove(id);
    let response: AlbumsResponse;

    if (!status) {
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    } else {
      response = {
        status: "success",
        code: 200,
        message: "Album has been removed",
      };
    }

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8")),
    );

    return res;
  },
};

export const albumCoverUploadRouter: ServerRoute = {
  path: "/albums/{id}/covers",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    try {
      const { cover } = req.payload as { cover: object };
      const { id: albumId } = req.params;

      if (!cover) throw new InvariantError("Bad Payload");

      const {
        _data,
        hapi: { filename },
      } = cover as { _data: Buffer; hapi: { filename: string } };
      const input: Buffer = _data;
      const fileName = `${+new Date()}.${albumId}.${filename}`;
      const dirPath = resolve(__dirname, "./../uploads");

      if (!existsSync(dirPath)) await mkdir(dirPath);

      const dir = await readdir(dirPath);

      await Promise.all([
        dir.some(async (s, i) => {
          if (s.includes(albumId)) await unlink(path.join(dirPath, dir[i]));
        }),
      ]);

      await writeFile(path.join(dirPath, fileName), input);

      Albums.update(
        { coverUrl: new URL(`uploads/${fileName}`, req.server.info.uri).href },
        { where: { id: albumId } },
      );

      const response = {
        status: "success",
        code: 201,
        message: "Cover uploaded",
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
    payload: {
      parse: true,
      allow: "multipart/form-data",
      maxBytes: 512000,
      multipart: {
        output: "stream",
      },
    },
    pre: [{ method: coverUploadsValidator }],
  },
};
