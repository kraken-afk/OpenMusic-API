import {
  type DatabaseResponse,
  type DatabaseResponseNegative,
  type DatabaseResponsePositive,
  type SongsCreation,
} from "../type";
import { Songs, type SongsScheme } from "../config/init";
import NotFoundError from "../errors/NotFoundError";
import { type FindOptions } from "sequelize";
import shortid from "shortid";

export default abstract class SongsModel {
  static async create(
    song: SongsCreation,
  ): Promise<DatabaseResponse<{ songId: string }>> {
    const id = `song-${shortid()}`;

    try {
      await Songs.create({
        id,
        title: song.title,
        genre: song.genre,
        performer: song.performer,
        year: +song.year,
        duration: song?.duration ? +song.duration : null,
        albumId: song?.albumId ? song.albumId : null,
      });

      const response: DatabaseResponsePositive<{ songId: string }> = {
        status: true,
        data: {
          songId: id,
        },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
      };
      return response;
    }
  }

  static async get(id: string): Promise<SongsScheme | null> {
    const song = await Songs.findByPk(id, {
      raw: true,
    });
    return song;
  }

  static async getAll(options: FindOptions): Promise<SongsScheme[]> {
    const songs = await Songs.findAll({ ...options, raw: true } as FindOptions);
    return songs;
  }

  static async update(
    song: SongsCreation,
    id: string,
  ): Promise<DatabaseResponse<{ message: string }>> {
    try {
      const [affectedRow] = await Songs.update(song, { where: { id } });

      if (affectedRow === 0) {
        throw new NotFoundError(`Song with id: ${id} doesn't exist`);
      }

      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: {
          message: `Song with id: ${id} updated`,
        },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
        code: error.code,
      };
      return response;
    }
  }

  static async remove(id: string): Promise<DatabaseResponse<{ message: string }>> {
    try {
      const affectedRow = await Songs.destroy({ where: { id } });

      if (affectedRow === 0) {
        throw new NotFoundError(`Song with id: ${id} doesn't exist`);
      }

      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: {
          message: `Song with id: ${id} removed`,
        },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
        code: error.code,
      };
      return response;
    }
  }
}
