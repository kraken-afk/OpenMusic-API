import AlbumsModel from "../models/AlbumsModel";
import validateAlbumCreation from "../validators/albumsValidator";
import { AlbumsCreation, AlbumsResponse } from "../app.d";
import { Buffer } from "node:buffer";
import { ResponseToolkit } from "hapi";
import type { ServerRoute, Request } from "@hapi/hapi";

const getAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "GET",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params;
    const album = await AlbumsModel.get(id);
    let response: AlbumsResponse;

    if (!album)
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    else
      response = {
        status: "success",
        code: 200,
        data: {
          album,
        },
      };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
    );

    return res;
  },
};

const createAlbumRouter: ServerRoute = {
  path: "/albums",
  method: "POST",
  handler: async (req: Request, h: ResponseToolkit) => {

    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { name, year } = req.payload as AlbumsCreation;
    const dbResponse = await AlbumsModel.create({ name, year });
    let response: AlbumsResponse;

    if (!dbResponse.status)
      response = {
        status: "fail",
        code: 500,
        message: "Internal server error",
      };
    else
      response = {
        status: "success",
        code: 201,
        data: {
          albumId: dbResponse.data.albumId,
        },
      };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
    );

    return res;
  },
  options: {
    pre: [{ method: validateAlbumCreation }],
  },
};

const updateAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "PUT",
  handler: async (req: Request, h: ResponseToolkit) => {
    if ("invalidResponse" in req.app) return req.app.invalidResponse;

    const { id } = req.params;
    const album = req.payload as AlbumsCreation;
    const { status } = await AlbumsModel.update(id, album);
    let response: AlbumsResponse;

    if (!status)
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    else
      response = {
        status: "success",
        code: 200,
        message: "Album has been updated",
      };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
    );

    return res;
  },
  options: {
    pre: [{ method: validateAlbumCreation }],
  },
};

const deleteAlbumsRouter: ServerRoute = {
  path: "/albums/{id}",
  method: "DELETE",
  handler: async (req: Request, h: ResponseToolkit) => {
    const { id } = req.params;
    const { status } = await AlbumsModel.remove(id);
    let response: AlbumsResponse;

    if (!status)
      response = {
        status: "fail",
        code: 404,
        message: "Album not found",
      };
    else
      response = {
        status: "success",
        code: 200,
        message: "Album has been removed",
      };

    const res = h.response(response).code(response.code);
    res.header("Content-Type", "application/json");
    res.header(
      "Content-Length",
      String(Buffer.byteLength(JSON.stringify(response), "utf-8"))
    );

    return res;
  },
};

const AlbumsRouter = {
  get: getAlbumsRouter,
  create: createAlbumRouter,
  update: updateAlbumsRouter,
  delete: deleteAlbumsRouter,
};

export default AlbumsRouter;
