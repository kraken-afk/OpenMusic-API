import { Router, type Response, type Request } from "express";
import validateAlbumCreation from "../validators/albumsValidator";
import { AlbumsCreation, AlbumsResponse } from "../app.d";
import AlbumsModel from "../models/AlbumsModel";

const router = Router();

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
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

  res
    .setHeader("Content-Type", "application/json")
    .setHeader(
      "Content-Length",
      Buffer.byteLength(JSON.stringify(response), "utf-8")
    )
    .status(response.code)
    .send(response);
});

router.put(
  "/:id",
  validateAlbumCreation,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, year } = req.body;
    const { status } = await AlbumsModel.update(id, { name, year });
    let response: AlbumsResponse;

    console.log(status);

    if (! status )
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

    res
      .setHeader("Content-Type", "application/json")
      .setHeader(
        "Content-Length",
        Buffer.byteLength(JSON.stringify(response), "utf-8")
      )
      .status(response.code)
      .send(response);
  }
);

router.post(
  "/",
  validateAlbumCreation,
  async (req: Request, res: Response): Promise<void> => {
    const album: AlbumsCreation = req.body;
    const dbResponse = await AlbumsModel.create(album);
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

    res
      .setHeader("Content-Type", "application/json")
      .setHeader(
        "Content-Length",
        Buffer.byteLength(JSON.stringify(response), "utf-8")
      )
      .status(response.code)
      .send(response);
  }
);

const AlbumRouter = router;
export default AlbumRouter;
