import { PrismaClient } from "@prisma/client";
import {
  DatabaseResponse,
  DatabaseResponseNegative,
  DatabaseResponsePositive,
  Song,
  Songs,
  SongsCreation,
} from "../app.d";
import PrismaScheme from "../config/PrismaScheme";
import shortid from "shortid";

export default abstract class SongsModel {
  static async create(
    song: SongsCreation
  ): Promise<DatabaseResponse<{ songId: string }>> {
    const prisma = new PrismaClient(PrismaScheme);
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
    } finally {
      prisma.$disconnect();
    }
  }

  static async get(id: string): Promise<Song | null> {
    const prisma = new PrismaClient(PrismaScheme);
    const song = (await prisma.songs.findUnique({ where: { id } })) as Song;

    prisma.$disconnect();
    return song;
  }

  static async getAll(): Promise<Songs[]> {
    const prisma = new PrismaClient(PrismaScheme);
    const songs = await prisma.songs.findMany({
      select: {
        id: true,
        title: true,
        performer: true,
      },
    });

    prisma.$disconnect();
    return songs;
  }

  static async update(
    song: SongsCreation,
    id: string
  ): Promise<DatabaseResponse<{ message: string }>> {
    const prisma = new PrismaClient(PrismaScheme);

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
      console.error(error);
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
      };
      return response;
    } finally {
      prisma.$disconnect();
    }
  }

  static async remove(id: string): Promise<DatabaseResponse<{ message: string }>> {
    const prisma = new PrismaClient(PrismaScheme);

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
      console.error(error);
      const response: DatabaseResponseNegative = {
        status: false,
        message: error.message,
      };
      return response;
    } finally {
      prisma.$disconnect();
    }
  }
}
