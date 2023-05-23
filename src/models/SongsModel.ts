import { Prisma } from "@prisma/client";
import {
  DatabaseResponse,
  DatabaseResponseNegative,
  DatabaseResponsePositive,
  Song,
  SongsCreation,
} from "../app.d";
import shortid from "shortid";
import { prisma } from "../config/init";

export default abstract class SongsModel {
  static async create(
    song: SongsCreation
  ): Promise<DatabaseResponse<{ songId: string }>> {
    const id = 'song-' + shortid();

    try {
      await prisma.songs.create({
        data: {
          id,
          title: song.title,
          genre: song.genre,
          performer: song.performer,
          year: song.year,
          duration: (song?.duration ? song.duration : null) as number,
          albumId: (song?.albumId ? song.albumId : null) as string,
        },
        include: {
          albums: true,
        },
      });

      const response: DatabaseResponsePositive<{ songId: string }> = {
        status: true,
        data: {
          songId: id,
        },
      };
      return response;
    } catch (error) {
      console.error(error);
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
      };
      return response;
    }
  }

  static async get(id: string): Promise<Song | null> {
    const song = (await prisma.songs.findUnique({ where: { id } })) as Song;
    return song;
  }

  static async getAll(options: { select?: Prisma.songsSelect, where?: Prisma.songsWhereInput }): Promise<Song[]> {
    const songs = await prisma.songs.findMany(options);
    return songs;
  }

  static async update(
    song: SongsCreation,
    id: string
  ): Promise<DatabaseResponse<{ message: string }>> {

    try {
      await prisma.songs.update({
        data: { ...song },
        where: { id },
      });

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
      };
      return response;
    }
  }

  static async remove(id: string): Promise<DatabaseResponse<{ message: string }>> {

    try {
      await prisma.songs.delete({
        where: { id },
      });

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
      };
      return response;
    }
  }
}
