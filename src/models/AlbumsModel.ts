import {
  type Album,
  type AlbumsCreation,
  type DataAlbumCreated,
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
} from "../type";
import { Albums } from "../config/init";
import NotFoundError from "../errors/NotFoundError";
import shortid from "shortid";

export default abstract class AlbumsModel {
  static async create(data: AlbumsCreation): Promise<DatabaseResponse<DataAlbumCreated>> {
    const id = `album-${shortid.generate()}`;

    try {
      await Albums.create({
        id,
        name: data.name,
        year: data.year,
      });
      const response: DatabaseResponsePositive<DataAlbumCreated> = {
        status: true,
        data: {
          albumId: id,
        },
      };

      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error?.message ?? "Unable to create album, something went Error!",
        code: 500,
      };

      return response;
    }
  }

  static async get(id: string): Promise<Album | null> {
    const album = await Albums.findByPk(id, { raw: true });
    console.log(album);
    return album;
  }

  static async update(
    id: string,
    { name, year }: AlbumsCreation,
  ): Promise<DatabaseResponse<{ message: string }>> {
    try {
      const [affectedRow] = await Albums.update({ name, year }, { where: { id } });

      if (affectedRow === 0) {
        throw new NotFoundError(`Song with id: ${id} doesn't exist`);
      }

      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: { message: `Album of id: '${id} has been updated.'` },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error?.message ?? "Album not found",
        code: error.code,
      };
      return response;
    }
  }

  static async remove(id: string): Promise<DatabaseResponse<{ message: string }>> {
    try {
      const affectedRow = await Albums.destroy({ where: { id } });

      if (affectedRow === 0) {
        throw new NotFoundError(`Song with id: ${id} doesn't exist`);
      }

      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: { message: `Album of id: '${id} has been removed.'` },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error?.message ?? "Album not found",
        code: error.code,
      };
      return response;
    }
  }
}
