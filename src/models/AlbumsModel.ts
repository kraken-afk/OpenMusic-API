import { PrismaClient } from "@prisma/client";
import {
  Album,
  AlbumsCreation,
  DataAlbumCreated,
  DatabaseResponse,
  DatabaseResponseNegative,
  DatabaseResponsePositive,
} from "../app.d";
import PrismaScheme from "../config/PrismaScheme";
import shortid from "shortid";

export default abstract class AlbumsModel {
  static async create(
    data: AlbumsCreation
  ): Promise<DatabaseResponse<DataAlbumCreated>> {
    const prisma = new PrismaClient(PrismaScheme);
    const id = 'album-' + shortid.generate();

    try {
      await prisma.albums.create({ data: { ...data, id } });
      const response: DatabaseResponsePositive<DataAlbumCreated> = {
        status: true,
        data: {
          albumId: id,
        },
      };

      return response;
    } catch (error) {
      console.error(error);
      const response: DatabaseResponseNegative = {
        status: false,
        message:
          error?.message ?? "Unable to create album, something went Error!",
      };

      return response;
    } finally {
      prisma.$disconnect();
    }
  }

  static async get(id: string): Promise<Album | null> {
    const prisma = new PrismaClient(PrismaScheme);
    const album: Album | null = await prisma.albums.findUnique({
      where: { id },
    });
    prisma.$disconnect();
    return album;
  }

  static async update(
    id: string,
    { name, year }: AlbumsCreation
  ): Promise<DatabaseResponse<{ message: string }>> {
    const prisma = new PrismaClient(PrismaScheme);
    try {
      await prisma.albums.update({
        where: { id },
        data: { name, year },
      });
      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: { message: `Album of id: '${id} has been updated.'` },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error?.message ?? "Album not found",
      };
      return response;
    } finally {
      prisma.$disconnect();
    }
  }

  static async remove(
    id: string
  ): Promise<DatabaseResponse<{ message: string }>> {
    const prisma = new PrismaClient(PrismaScheme);
    try {
      await prisma.albums.delete({ where: { id } });
      const response: DatabaseResponsePositive<{ message: string }> = {
        status: true,
        data: { message: `Album of id: '${id} has been removed.'` },
      };
      return response;
    } catch (error) {
      const response: DatabaseResponseNegative = {
        status: false,
        message: error?.message ?? "Album not found",
      };
      return response;
    } finally {
      prisma.$disconnect();
    }
  }
}
